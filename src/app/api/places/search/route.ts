import { NextRequest, NextResponse } from "next/server";
import {
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  ALL_DESTINATIONS,
  ALL_VERIFIED_PLACES,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { isLiveGooglePlacesMode } from "@/lib/ai-engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim();
    const destination = (searchParams.get("destination") || "").trim();
    const category = (searchParams.get("category") || "ALL").trim();
    const type = (searchParams.get("type") || "destinations").trim(); // "destinations" | "places" | "hometowns"

    // 1. Places & Restaurants Search (Attractions, Temples, Shrines, Dining)
    if (type === "places") {
      const places = destination
        ? getCandidatePlacesForDestination(destination)
        : ALL_VERIFIED_PLACES;

      const filtered = places.filter((p) => {
        const matchesQuery =
          !query ||
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          p.destinationName.toLowerCase().includes(query.toLowerCase());
        const matchesCat =
          category === "ALL" ||
          (category === "Hidden Gems" && p.isHiddenGem) ||
          (category === "Sacred & Worship" &&
            (p.subcategory.toLowerCase().includes("temple") ||
              p.subcategory.toLowerCase().includes("shrine") ||
              p.subcategory.toLowerCase().includes("jyotirlinga") ||
              p.subcategory.toLowerCase().includes("gurudwara") ||
              p.subcategory.toLowerCase().includes("ghat") ||
              p.subcategory.toLowerCase().includes("aarti") ||
              p.subcategory.toLowerCase().includes("darshan") ||
              p.subcategory.toLowerCase().includes("sattvic"))) ||
          p.category.toLowerCase() === category.toLowerCase();
        return matchesQuery && matchesCat;
      });

      return NextResponse.json({
        places: filtered,
        isLiveApi: isLiveGooglePlacesMode(),
      });
    }

    // 2. Worldwide Hometowns & Origin Cities Search (for "Traveling From" selector)
    if (type === "hometowns") {
      const qLower = query.toLowerCase();
      const matchedCities = !query
        ? WORLDWIDE_CITIES_AND_HOMETOWNS
        : WORLDWIDE_CITIES_AND_HOMETOWNS.filter(
            (c) =>
              c.name.toLowerCase().includes(qLower) ||
              c.stateOrCountry.toLowerCase().includes(qLower) ||
              c.regionType.toLowerCase().includes(qLower)
          );

      // If user typed a hometown/town not in static list, attempt OpenStreetMap Nominatim geocoding
      if (query.length >= 2 && matchedCities.length < 3) {
        try {
          const nomRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              query
            )}&limit=5&addressdetails=1`,
            {
              headers: {
                "User-Agent": "RoamWise-TravelPlanner/1.0",
                "Accept-Language": "en",
              },
              signal: AbortSignal.timeout(3500),
            }
          );
          if (nomRes.ok) {
            const nomData = await nomRes.json();
            if (Array.isArray(nomData)) {
              for (const item of nomData) {
                const name =
                  item.name ||
                  item.display_name?.split(",")[0]?.trim() ||
                  query;
                const stateOrCountry =
                  item.display_name
                    ?.split(",")
                    .slice(1, 3)
                    .join(",")
                    .trim() || "Worldwide City";
                if (
                  !matchedCities.some(
                    (m) => m.name.toLowerCase() === name.toLowerCase()
                  )
                ) {
                  matchedCities.push({
                    placeId: `ChIJ_osm_${item.place_id || name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
                    name,
                    stateOrCountry,
                    regionType: stateOrCountry.toLowerCase().includes("india")
                      ? "Indian City"
                      : "Global City",
                    lat: Number(item.lat) || 28.6139,
                    lng: Number(item.lon) || 77.209,
                  });
                }
              }
            }
          }
        } catch {
          // Graceful fallback if offline
        }
      }

      if (query.length >= 2 && matchedCities.length === 0) {
        const formatted = query.charAt(0).toUpperCase() + query.slice(1).trim();
        matchedCities.push({
          placeId: `ChIJ_hometown_${query.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
          name: formatted,
          stateOrCountry: "Worldwide Hometown",
          regionType: "Global City",
          lat: 28.6139,
          lng: 77.209,
        });
      }

      return NextResponse.json({
        hometowns: matchedCities.slice(0, 40),
      });
    }

    // 3. Destination & Worship/Holy Place Search
    // Build unified catalog from POPULAR_DESTINATIONS + SACRED_DESTINATIONS + WORLDWIDE_CITIES_AND_HOMETOWNS
    const cityDestinations = WORLDWIDE_CITIES_AND_HOMETOWNS.filter(
      (c) =>
        !ALL_DESTINATIONS.some(
          (d) =>
            d.name.toLowerCase() === c.name.toLowerCase() ||
            d.name.toLowerCase().includes(c.name.toLowerCase())
        )
    ).map((c) => {
      const isSacred = c.regionType === "Sacred & Holy Place";
      const slug = c.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return {
        placeId: c.placeId,
        slug,
        name: c.name,
        stateOrCountry: c.stateOrCountry,
        category: isSacred
          ? "Sacred & Spiritual Pilgrimage"
          : c.regionType === "Indian City"
          ? "Indian City & Heritage Hub"
          : "Global City & Cultural Hub",
        tagline: isSacred
          ? `Sacred shrines, darshan corridors, and spiritual peace in ${c.name}.`
          : `Iconic landmarks, local neighborhoods, and curated routes in ${c.name}.`,
        heroImage: isSacred
          ? "/places/varanasi-ghat.jpg"
          : c.regionType === "Indian City"
          ? "/places/jaipur-hawa-mahal.jpg"
          : "/places/tokyo-sensoji.jpg",
        lat: c.lat,
        lng: c.lng,
        regionType: c.regionType,
      };
    });

    const fullCatalog = [
      ...POPULAR_DESTINATIONS.map((d) => ({
        ...d,
        regionType: d.stateOrCountry.toLowerCase().includes("india")
          ? "Indian City"
          : "Global City",
      })),
      ...SACRED_DESTINATIONS.map((d) => ({
        ...d,
        regionType: "Sacred & Holy Place",
      })),
      ...cityDestinations,
    ];

    // Filter by category tab if requested
    let pool = fullCatalog;
    if (category === "SACRED") {
      pool = fullCatalog.filter(
        (d) =>
          d.regionType === "Sacred & Holy Place" ||
          d.category.toLowerCase().includes("sacred") ||
          d.category.toLowerCase().includes("spiritual") ||
          d.category.toLowerCase().includes("jyotirlinga") ||
          d.category.toLowerCase().includes("dham") ||
          d.category.toLowerCase().includes("pilgrimage") ||
          d.slug === "rishikesh"
      );
    } else if (category === "POPULAR") {
      pool = POPULAR_DESTINATIONS.map((d) => ({
        ...d,
        regionType: "Popular",
      }));
    } else if (category === "INDIAN_CITIES") {
      pool = fullCatalog.filter((d) =>
        d.stateOrCountry.toLowerCase().includes("india")
      );
    } else if (category === "GLOBAL_CITIES") {
      pool = fullCatalog.filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }

    const qLower = query.toLowerCase();
    const matches = !query
      ? pool
      : fullCatalog.filter(
          (d) =>
            d.name.toLowerCase().includes(qLower) ||
            d.stateOrCountry.toLowerCase().includes(qLower) ||
            d.category.toLowerCase().includes(qLower) ||
            (d.tagline && d.tagline.toLowerCase().includes(qLower))
        );

    // Also try live OpenStreetMap Nominatim geocoding when searching for a specific town, temple, or city worldwide
    if (query.length >= 2 && matches.length < 4) {
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&limit=4&addressdetails=1`,
          {
            headers: {
              "User-Agent": "RoamWise-TravelPlanner/1.0",
              "Accept-Language": "en",
            },
            signal: AbortSignal.timeout(3500),
          }
        );
        if (nomRes.ok) {
          const nomData = await nomRes.json();
          if (Array.isArray(nomData)) {
            for (const item of nomData) {
              const name =
                item.name ||
                item.display_name?.split(",")[0]?.trim() ||
                query;
              const stateOrCountry =
                item.display_name
                  ?.split(",")
                  .slice(1, 3)
                  .join(",")
                  .trim() || "Worldwide Destination";
              const looksSacred =
                query.toLowerCase().includes("temple") ||
                query.toLowerCase().includes("mandir") ||
                query.toLowerCase().includes("dham") ||
                query.toLowerCase().includes("shrine") ||
                query.toLowerCase().includes("church") ||
                query.toLowerCase().includes("mosque") ||
                item.type === "place_of_worship";

              if (
                !matches.some(
                  (m) => m.name.toLowerCase() === name.toLowerCase()
                )
              ) {
                matches.push({
                  placeId: `ChIJ_osm_${item.place_id || name.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
                  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  name,
                  stateOrCountry,
                  category: looksSacred
                    ? "Sacred & Spiritual Pilgrimage"
                    : "Verified Worldwide City & Destination",
                  tagline: looksSacred
                    ? `Sacred darshan, spiritual heritage, and local rituals in ${name}.`
                    : `Explore ${name}'s top attractions, cultural heritage, and dining routes.`,
                  heroImage: looksSacred
                    ? "/places/varanasi-ghat.jpg"
                    : "/places/jaipur-hawa-mahal.jpg",
                  lat: Number(item.lat) || 28.6139,
                  lng: Number(item.lon) || 77.209,
                  regionType: looksSacred ? "Sacred & Holy Place" : "Global City",
                });
              }
            }
          }
        }
      } catch {
        // Ignore network errors and rely on static + custom fallback
      }
    }

    // If user typed a valid custom city or worship place not found above, offer an instant custom entry
    if (query.length >= 2 && matches.length === 0) {
      const formattedName =
        query.charAt(0).toUpperCase() + query.slice(1).trim();
      const looksSacred =
        qLower.includes("temple") ||
        qLower.includes("mandir") ||
        qLower.includes("dham") ||
        qLower.includes("devi") ||
        qLower.includes("sahib") ||
        qLower.includes("shrine") ||
        qLower.includes("church") ||
        qLower.includes("mosque");
      matches.push({
        placeId: `ChIJ_custom_${qLower.replace(/[^a-z0-9]/g, "_")}`,
        slug: qLower.replace(/[^a-z0-9]/g, "-"),
        name: formattedName,
        stateOrCountry: "Worldwide Destination",
        category: looksSacred
          ? "Sacred & Spiritual Pilgrimage"
          : "Culture, Landmarks & Local Dining",
        tagline: looksSacred
          ? `Sacred darshan timings, temple heritage, and sattvic dining in ${formattedName}.`
          : `Explore ${formattedName}'s top attractions, local dining, and scenic routes.`,
        heroImage: looksSacred
          ? "/places/varanasi-ghat.jpg"
          : "/places/jaipur-hawa-mahal.jpg",
        lat: 28.6139,
        lng: 77.209,
        regionType: looksSacred ? "Sacred & Holy Place" : "Global City",
      });
    }

    return NextResponse.json({
      destinations: matches,
      isLiveApi: isLiveGooglePlacesMode(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search places", details: String(error) },
      { status: 500 }
    );
  }
}
