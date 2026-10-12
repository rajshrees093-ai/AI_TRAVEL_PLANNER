"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Car,
  Train,
  Footprints,
  ExternalLink,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { optimizeDailyStopsOrder } from "@/lib/ai-engine";
import { VerifiedPlace } from "@/lib/types";
import {
  calculateHaversineKm,
  estimateTravelMinutes,
  formatCurrency,
} from "@/lib/utils";

type TravelMode = "DRIVE" | "TRANSIT" | "WALK";

export default function InteractiveTripMapPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("DRIVE");
  const [routeTotals, setRouteTotals] = useState<{
    distanceKm: number;
    durationMinutes: number;
  }>({ distanceKm: 0, durationMinutes: 0 });
  const [zoomScale, setZoomScale] = useState<number>(1);

  const currentDay =
    trip?.days.find((d) => d.dayNumber === selectedDayNum) || trip?.days[0];
  const activities = useMemo(
    () => currentDay?.activities || [],
    [currentDay]
  );

  const activeStop =
    activities.find((a) => a.id === selectedStopId) || activities[0] || null;

  useEffect(() => {
    if (activities.length < 2) {
      setRouteTotals({ distanceKm: 0, durationMinutes: 0 });
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            travelMode,
            waypoints: activities.map((a) => ({
              placeId: a.placeId,
              title: a.title,
              lat: a.lat,
              lng: a.lng,
            })),
          }),
        });
        if (res.ok && active) {
          const data = await res.json();
          setRouteTotals({
            distanceKm: data.totalDistanceKm || 0,
            durationMinutes: data.totalDurationMinutes || 0,
          });
        }
      } catch {
        // Fallback local calculation
      }
    })();

    return () => {
      active = false;
    };
  }, [activities, travelMode]);

  const projectedPoints = useMemo(() => {
    if (activities.length === 0) return [];
    const lats = activities.map((a) => a.lat);
    const lngs = activities.map((a) => a.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(0.008, maxLat - minLat);
    const lngSpan = Math.max(0.008, maxLng - minLng);

    return activities.map((act, idx) => {
      const normX = (act.lng - minLng) / lngSpan;
      const normY = 1 - (act.lat - minLat) / latSpan;
      const x = Math.round(110 + normX * 580);
      const y = Math.round(85 + normY * 310);
      return {
        ...act,
        index: idx + 1,
        x,
        y,
      };
    });
  }, [activities]);

  const handleOptimizeDayRoute = async () => {
    if (!trip || !currentDay || currentDay.activities.length <= 2) return;
    const asPlaces: VerifiedPlace[] = currentDay.activities.map((a) => ({
      placeId: a.placeId,
      name: a.title,
      destinationSlug: trip.destinationName.toLowerCase(),
      destinationName: trip.destinationName,
      category: a.category,
      subcategory: a.category,
      description: a.description,
      address: a.address,
      lat: a.lat,
      lng: a.lng,
      estimatedCostINR: Math.round(
        a.estimatedCost / Math.max(1, trip.travelers)
      ),
      recommendedDurationMins: a.expectedDuration,
      photoUrl: a.photoUrl,
    }));

    const optimized = optimizeDailyStopsOrder(asPlaces);
    const reordered = currentDay.activities.map((slotAct, idx) => {
      const matched = currentDay.activities.find(
        (x) => x.placeId === optimized[idx].placeId
      )!;
      return {
        ...matched,
        startTime: slotAct.startTime,
        endTime: slotAct.endTime,
        position: idx + 1,
      };
    });

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: reordered } : d
    );

    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Optimized Day ${currentDay.dayNumber} route order to minimize backtracking!`
    );
  };

  return (
    <DashboardWorkspaceLayout
      title={
        trip ? `${trip.destinationName} — Interactive Route Map` : "Route Map"
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: trip?.destinationName || "Trip",
          href: `/trips/${params.tripId}`,
        },
        { label: "Interactive Route Map" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && currentDay && (
          <div className="map-layout">
            {/* Left Stops Panel */}
            <div className="map-stops">
              <div className="map-days">
                {trip.days.map((d) => {
                  const active = d.dayNumber === currentDay.dayNumber;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      className={`day-pill ${active ? "active" : ""}`}
                      onClick={() => {
                        setSelectedDayNum(d.dayNumber);
                        setSelectedStopId(d.activities[0]?.id || null);
                      }}
                    >
                      <span>Day {d.dayNumber}</span>
                    </button>
                  );
                })}
              </div>

              <div className="map-route-mode">
                {(
                  [
                    { mode: "DRIVE", label: "Drive", icon: Car },
                    { mode: "TRANSIT", label: "Transit", icon: Train },
                    { mode: "WALK", label: "Walk", icon: Footprints },
                  ] as const
                ).map((m) => {
                  const Icon = m.icon;
                  const active = travelMode === m.mode;
                  return (
                    <button
                      key={m.mode}
                      type="button"
                      className={`filter-chip ${active ? "active" : ""}`}
                      onClick={() => setTravelMode(m.mode)}
                    >
                      <Icon className="w-3.5 h-3.5" /> {m.label}
                    </button>
                  );
                })}
              </div>

              <div className="map-day-title">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                  <div>
                    <h3>Day {currentDay.dayNumber} Route</h3>
                    <p>
                      {routeTotals.distanceKm} km • ~
                      {routeTotals.durationMinutes} mins (
                      {travelMode.toLowerCase()})
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button button-primary button-sm"
                    onClick={handleOptimizeDayRoute}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Optimize Route
                  </button>
                </div>
              </div>

              <div className="map-stop-list">
                {activities.map((act, idx) => {
                  const isHighlighted = activeStop?.id === act.id;
                  const next = activities[idx + 1];
                  const legDist = next
                    ? calculateHaversineKm(act.lat, act.lng, next.lat, next.lng)
                    : 0;
                  const legTime = next
                    ? estimateTravelMinutes(legDist, travelMode)
                    : 0;

                  return (
                    <div
                      key={act.id}
                      onClick={() => setSelectedStopId(act.id)}
                      className={`map-stop ${isHighlighted ? "active" : ""}`}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="map-stop-number">{idx + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong>{act.title}</strong>
                        <span>
                          {act.startTime} • {act.category}
                        </span>
                        <small>{act.address}</small>
                        {next && (
                          <small style={{ color: "var(--ocean)", fontWeight: 700, display: "block", marginTop: "4px" }}>
                            ↳ {legDist} km • ~{legTime} mins via{" "}
                            {travelMode.toLowerCase()}
                          </small>
                        )}
                      </div>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                          `${act.title} ${act.address}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-stop-open"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>

              {activeStop && (
                <div className="map-note">
                  <strong>
                    Selected: #{activeStop.position} {activeStop.title}
                  </strong>
                  <p>
                    {activeStop.expectedDuration} mins • Est.{" "}
                    {formatCurrency(activeStop.estimatedCost, trip.currency)} • (
                    {activeStop.lat}, {activeStop.lng})
                  </p>
                </div>
              )}
            </div>

            {/* Right Interactive Map Canvas */}
            <div className="map-canvas-wrap">
              <div className="map-legend" style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", gap: "14px" }}>
                  <span>
                    <i className="legend-dot" style={{ background: "#087F8C" }} />{" "}
                    Attractions & Sights
                  </span>
                  <span>
                    <i className="legend-dot" style={{ background: "#FF8066" }} />{" "}
                    Restaurants & Cafés
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={() => setZoomScale(1)}
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Fit Day{" "}
                    {currentDay.dayNumber} Bounds
                  </button>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={() =>
                      setZoomScale((z) =>
                        z < 1.35 ? Number((z + 0.15).toFixed(2)) : 0.9
                      )
                    }
                  >
                    Zoom ({Math.round(zoomScale * 100)}%)
                  </button>
                </div>
              </div>

              <div className="map-canvas" style={{ height: "480px", position: "relative", overflow: "hidden" }}>
                <svg
                  viewBox="0 0 800 460"
                  style={{
                    width: "100%",
                    height: "100%",
                    transform: `scale(${zoomScale})`,
                    transition: "transform 0.3s ease",
                  }}
                >
                  <defs>
                    <pattern
                      id="map-grid"
                      width="48"
                      height="48"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 48 0 L 0 0 0 48"
                        fill="none"
                        stroke="rgba(8, 127, 140, 0.10)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  <rect width="800" height="460" fill="url(#map-grid)" />
                  <path
                    d="M -20 120 Q 240 40, 480 180 T 820 110"
                    fill="none"
                    stroke="rgba(8, 127, 140, 0.16)"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 440 Q 320 290, 590 360 T 830 260"
                    fill="none"
                    stroke="rgba(245, 233, 216, 0.55)"
                    strokeWidth="36"
                    strokeLinecap="round"
                  />

                  {projectedPoints.map((pt, idx) => {
                    const next = projectedPoints[idx + 1];
                    if (!next) return null;
                    const midX = (pt.x + next.x) / 2;
                    const midY = (pt.y + next.y) / 2;
                    const dist = calculateHaversineKm(
                      pt.lat,
                      pt.lng,
                      next.lat,
                      next.lng
                    );
                    const mins = estimateTravelMinutes(dist, travelMode);

                    return (
                      <g key={`leg-${pt.id}-${next.id}`}>
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={next.x}
                          y2={next.y}
                          stroke="#087F8C"
                          strokeWidth="4"
                          strokeDasharray={
                            travelMode === "WALK" ? "6 6" : "10 5"
                          }
                        />
                        <rect
                          x={midX - 44}
                          y={midY - 12}
                          width="88"
                          height="22"
                          rx="11"
                          fill="#FFFFFF"
                          stroke="#087F8C"
                          strokeWidth="1.5"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          textAnchor="middle"
                          style={{ fontSize: "10px", fontWeight: 700, fill: "#1F2933" }}
                        >
                          {dist}km • {mins}m
                        </text>
                      </g>
                    );
                  })}

                  {projectedPoints.map((pt) => {
                    const isSelected = activeStop?.id === pt.id;
                    const isDining =
                      pt.category === "Restaurant" || pt.category === "Café";
                    const pinColor = isDining ? "#FF8066" : "#087F8C";

                    return (
                      <g
                        key={pt.id}
                        onClick={() => setSelectedStopId(pt.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="28"
                            fill={pinColor}
                            opacity="0.22"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? "19" : "15"}
                          fill={pinColor}
                          stroke="#FFFFFF"
                          strokeWidth="3"
                        />
                        <text
                          x={pt.x}
                          y={pt.y + 4}
                          textAnchor="middle"
                          style={{ fontSize: "12px", fontWeight: 700, fill: "#FFFFFF" }}
                        >
                          {pt.index}
                        </text>
                        <rect
                          x={pt.x - 75}
                          y={pt.y + 22}
                          width="150"
                          height="24"
                          rx="8"
                          fill="#1F2933"
                          opacity="0.9"
                        />
                        <text
                          x={pt.x}
                          y={pt.y + 38}
                          textAnchor="middle"
                          style={{ fontSize: "10px", fontWeight: 600, fill: "#FFFFFF" }}
                        >
                          {pt.title.length > 22
                            ? `${pt.title.slice(0, 20)}…`
                            : pt.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
