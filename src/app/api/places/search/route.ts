import { NextRequest, NextResponse } from "next/server";
import {
  POPULAR_DESTINATIONS,
  VERIFIED_PLACES_CATALOG,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { isLiveGooglePlacesMode } from "@/lib/ai-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const destination = (searchParams.get("destination") || "").trim();
    const category = (searchParams.get("category") || "ALL").trim();
    const type = (searchParams.get("type") || "destinations").trim(); // "destinations" | "places"

    if (type === "places") {
      const places = destination
        ? getCandidatePlacesForDestination(destination)
        : VERIFIED_PLACES_CATALOG;

      const filtered = places.filter((p) => {
        const matchesQuery =
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase());
        const matchesCat =
          category === "ALL" ||
          (category === "Hidden Gems" && p.isHiddenGem) ||
          p.category.toLowerCase() === category.toLowerCase();
        return matchesQuery && matchesCat;
      });

      return NextResponse.json({
        places: filtered,
        isLiveApi: isLiveGooglePlacesMode(),
      });
    }

    // Destination autocomplete search
    if (isLiveGooglePlacesMode() && query.length >= 2) {
      try {
        const res = await fetch(
          "https://places.googleapis.com/v1/places:autocomplete",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": process.env.GOOGLE_MAPS_SERVER_KEY!,
            },
            body: JSON.stringify({
              input: query,
              includedPrimaryTypes: ["(cities)"],
            }),
            signal: AbortSignal.timeout(5000),
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
            const suggestions = data.suggestions
              .filter((s: any) => s.placePrediction)
              .map((s: any) => ({
                placeId: s.placePrediction.placeId,
                name:
                  s.placePrediction.structuredFormat?.mainText?.text ||
                  s.placePrediction.text?.text,
                stateOrCountry:
                  s.placePrediction.structuredFormat?.secondaryText?.text ||
                  "Verified Destination",
                category: "Verified Google Place",
                heroImage:
                  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
              }));
            return NextResponse.json({
              destinations: suggestions,
              isLiveApi: true,
            });
          }
        }
      } catch {
        // Fall back to curated catalog
      }
    }

    const extraCities = [
      {
        placeId: "ChIJ_udaipur_rj",
        slug: "udaipur",
        name: "Udaipur",
        stateOrCountry: "Rajasthan, India",
        category: "Lakes & Palaces",
        tagline: "Marble lake palaces, Aravalli sunsets, and Mewar heritage.",
        heroImage:
          "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
      },
      {
        placeId: "ChIJ_kyoto_jp",
        slug: "kyoto",
        name: "Kyoto",
        stateOrCountry: "Japan",
        category: "Zen Gardens & Shrines",
        tagline: "Bamboo groves, golden pavilions, and historic teahouses.",
        heroImage:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      },
      {
        placeId: "ChIJ_paris_fr",
        slug: "paris",
        name: "Paris",
        stateOrCountry: "France",
        category: "Art, Cafés & Architecture",
        tagline: "Seine boulevards, world-class museums, and neighborhood patisseries.",
        heroImage:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      },
      {
        placeId: "ChIJ_ladakh_in",
        slug: "ladakh",
        name: "Leh Ladakh",
        stateOrCountry: "Ladakh, India",
        category: "High-Altitude Monasteries & Lakes",
        tagline: "Turquoise alpine lakes, Buddhist gompas, and dramatic mountain passes.",
        heroImage:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      },
    ];

    const allDests = [...POPULAR_DESTINATIONS, ...extraCities];
    const matches = !query
      ? POPULAR_DESTINATIONS
      : allDests.filter(
          (d) =>
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.stateOrCountry.toLowerCase().includes(query.toLowerCase()) ||
            d.category.toLowerCase().includes(query.toLowerCase())
        );

    // If user typed a valid custom city name not in predefined list, offer a verified custom entry
    if (query.length >= 2 && matches.length === 0) {
      const formattedName =
        query.charAt(0).toUpperCase() + query.slice(1).trim();
      matches.push({
        placeId: `ChIJ_custom_${query.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        slug: query.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        name: formattedName,
        stateOrCountry: "Custom Destination",
        category: "Culture, Landmarks & Local Dining",
        tagline: `Explore ${formattedName}'s top attractions, local dining, and scenic routes.`,
        heroImage:
          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
      });
    }

    return NextResponse.json({
      destinations: matches,
      isLiveApi: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search places", details: String(error) },
      { status: 500 }
    );
  }
}
