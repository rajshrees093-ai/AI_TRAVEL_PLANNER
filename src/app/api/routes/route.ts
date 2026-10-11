import { NextRequest, NextResponse } from "next/server";
import { calculateHaversineKm, estimateTravelMinutes } from "@/lib/utils";
import { isLiveGooglePlacesMode } from "@/lib/ai-engine";

interface WaypointInput {
  placeId?: string;
  title: string;
  lat: number;
  lng: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const waypoints: WaypointInput[] = Array.isArray(body.waypoints)
      ? body.waypoints
      : [];
    const travelMode: "DRIVE" | "TRANSIT" | "WALK" =
      body.travelMode === "TRANSIT" || body.travelMode === "WALK"
        ? body.travelMode
        : "DRIVE";

    if (waypoints.length < 2) {
      return NextResponse.json({
        legs: [],
        totalDistanceKm: 0,
        totalDurationMinutes: 0,
        travelMode,
        isLiveRoutesApi: isLiveGooglePlacesMode(),
      });
    }

    // If Google Routes API server key is configured, attempt live route computation
    if (isLiveGooglePlacesMode() && waypoints.length === 2) {
      try {
        const res = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_MAPS_SERVER_KEY!,
              "X-Goog-FieldMask":
                "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
              origin: {
                location: {
                  latLng: {
                    latitude: waypoints[0].lat,
                    longitude: waypoints[0].lng,
                  },
                },
              },
              destination: {
                location: {
                  latLng: {
                    latitude: waypoints[1].lat,
                    longitude: waypoints[1].lng,
                  },
                },
              },
              travelMode,
            }),
            signal: AbortSignal.timeout(5000),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const route = data.routes?.[0];
          if (route) {
            const distKm = Number(((route.distanceMeters || 1000) / 1000).toFixed(1));
            const durSec = parseInt(String(route.duration || "600s").replace("s", ""), 10);
            const durMin = Math.max(5, Math.round(durSec / 60));
            return NextResponse.json({
              legs: [
                {
                  from: waypoints[0].title,
                  to: waypoints[1].title,
                  distanceKm: distKm,
                  durationMinutes: durMin,
                },
              ],
              totalDistanceKm: distKm,
              totalDurationMinutes: durMin,
              travelMode,
              isLiveRoutesApi: true,
            });
          }
        }
      } catch {
        // Fall through to deterministic calculation
      }
    }

    const legs = [];
    let totalDistanceKm = 0;
    let totalDurationMinutes = 0;

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i];
      const to = waypoints[i + 1];
      const distanceKm = calculateHaversineKm(from.lat, from.lng, to.lat, to.lng);
      const durationMinutes = estimateTravelMinutes(distanceKm, travelMode);
      totalDistanceKm += distanceKm;
      totalDurationMinutes += durationMinutes;

      legs.push({
        from: from.title,
        to: to.title,
        fromCoords: { lat: from.lat, lng: from.lng },
        toCoords: { lat: to.lat, lng: to.lng },
        distanceKm,
        durationMinutes,
      });
    }

    return NextResponse.json({
      legs,
      totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
      totalDurationMinutes,
      travelMode,
      isLiveRoutesApi: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to calculate routes", details: String(error) },
      { status: 500 }
    );
  }
}
