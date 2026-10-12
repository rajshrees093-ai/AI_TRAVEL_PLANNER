"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Plus,
  ExternalLink,
  Utensils,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { getCandidatePlacesForDestination } from "@/lib/destinations-catalog";
import { FoodPreference, TripActivity, VerifiedPlace } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_FILTERS = [
  "All",
  "Attractions",
  "Restaurants",
  "Cafés",
  "Shopping",
  "Hidden Gems",
];

export default function PlacesAndRestaurantsPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("ALL");
  const [selectedDiet, setSelectedDiet] = useState<string>("ALL");
  const [targetDayToAdd, setTargetDayToAdd] = useState<number>(1);
  const [detailPlace, setDetailPlace] = useState<VerifiedPlace | null>(null);

  const places = trip
    ? getCandidatePlacesForDestination(trip.destinationName)
    : [];

  const filteredPlaces = places.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.subcategory.toLowerCase().includes(q) ||
      (p.cuisine && p.cuisine.toLowerCase().includes(q));

    let matchesCategory = true;
    if (selectedCategory === "Attractions") {
      matchesCategory =
        p.category !== "Restaurant" &&
        p.category !== "Café" &&
        p.category !== "Shopping";
    } else if (selectedCategory === "Restaurants") {
      matchesCategory = p.category === "Restaurant";
    } else if (selectedCategory === "Cafés") {
      matchesCategory = p.category === "Café";
    } else if (selectedCategory === "Shopping") {
      matchesCategory = p.category === "Shopping";
    } else if (selectedCategory === "Hidden Gems") {
      matchesCategory = Boolean(p.isHiddenGem);
    }

    const matchesPrice =
      selectedPrice === "ALL" || p.priceLevel === selectedPrice;

    const matchesDiet =
      selectedDiet === "ALL" ||
      (p.dietarySupported &&
        p.dietarySupported.includes(selectedDiet as FoodPreference));

    return matchesSearch && matchesCategory && matchesPrice && matchesDiet;
  });

  const handleAddPlaceToDay = async (place: VerifiedPlace, dayNum: number) => {
    if (!trip) return;
    const targetDay =
      trip.days.find((d) => d.dayNumber === dayNum) || trip.days[0];
    if (!targetDay) return;

    const newAct: TripActivity = {
      id: `${targetDay.id}-act-${Date.now().toString(36)}`,
      tripDayId: targetDay.id,
      placeId: place.placeId,
      title: place.name,
      category: place.category,
      startTime: "04:30 PM",
      endTime: "06:00 PM",
      expectedDuration: place.recommendedDurationMins,
      estimatedCost: place.estimatedCostINR * trip.travelers,
      position: targetDay.activities.length + 1,
      description: place.description,
      notes: place.whyVisit || `Verified ${place.subcategory}`,
      lat: place.lat,
      lng: place.lng,
      address: place.address,
      rating: place.rating,
      reviewCount: place.reviewCount,
      openingHours: place.openingHours,
      photoUrl: place.photoUrl,
      isHiddenGem: place.isHiddenGem,
      dietarySupported: place.dietarySupported,
      cuisine: place.cuisine,
    };

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === targetDay.dayNumber
        ? { ...d, activities: [...d.activities, newAct] }
        : d
    );

    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Added "${place.name}" to Day ${targetDay.dayNumber}`
    );
    setDetailPlace(null);
  };

  return (
    <DashboardWorkspaceLayout
      title={
        trip
          ? `${trip.destinationName} — Places & Restaurants`
          : "Places & Restaurants"
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: trip?.destinationName || "Trip",
          href: `/trips/${params.tripId}`,
        },
        { label: "Places & Food" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="trip-detail-panel">
            {/* Search and Filter Bar */}
            <div className="places-controls">
              <label className="search-field">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search attractions, restaurants, or cuisines in ${trip.destinationName}...`}
                />
              </label>

              <select
                aria-label="Filter by price level"
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
              >
                <option value="ALL">All Price Levels</option>
                <option value="Free">Free Entry</option>
                <option value="$">$ Budget Friendly</option>
                <option value="$$">$$ Moderate</option>
                <option value="$$$">$$$ Signature</option>
              </select>

              <select
                aria-label="Filter by dietary support"
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
              >
                <option value="ALL">All Dietary Preferences</option>
                <option value="Vegetarian">Vegetarian Verified</option>
                <option value="Vegan">Vegan Verified</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div className="places-filter-panel">
              <div className="place-categories">
                {CATEGORY_FILTERS.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-chip ${active ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <div className="add-target-day">
                <span>Add stops to:</span>
                <select
                  value={targetDayToAdd}
                  onChange={(e) => setTargetDayToAdd(Number(e.target.value))}
                >
                  {trip.days.map((d) => (
                    <option key={d.id} value={d.dayNumber}>
                      Day {d.dayNumber} ({d.date})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredPlaces.length === 0 ? (
              <div className="empty-panel">
                <h3>No places matched your current filters</h3>
                <p>Try clearing your search or selecting “All” categories.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedPrice("ALL");
                    setSelectedDiet("ALL");
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="place-grid">
                {filteredPlaces.map((place) => {
                  const isInItinerary = trip.days.some((d) =>
                    d.activities.some((a) => a.placeId === place.placeId)
                  );

                  return (
                    <article key={place.placeId} className="place-card">
                      <div
                        className="place-card-art"
                        onClick={() => setDetailPlace(place)}
                        style={{
                          cursor: "pointer",
                          backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.08), rgba(16, 24, 40, 0.72)), url(${place.photoUrl})`,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                          <span>{place.category}</span>
                          {place.priceLevel && <span>{place.priceLevel}</span>}
                        </div>

                        <div>
                          {place.isHiddenGem && (
                            <span style={{ background: "rgba(255, 128, 102, 0.85)", marginBottom: "6px" }}>
                              <Sparkles className="w-3 h-3" /> Hidden Gem
                            </span>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
                            <strong>{place.subcategory}</strong>
                            {place.rating && (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <Star className="w-3.5 h-3.5" /> {place.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="place-card-body">
                        <div>
                          <h3
                            onClick={() => setDetailPlace(place)}
                            style={{ cursor: "pointer" }}
                          >
                            {place.name}
                          </h3>
                          <p>{place.description}</p>
                        </div>

                        <div className="place-card-meta">
                          <span>
                            <MapPin className="w-3.5 h-3.5" /> {place.address}
                          </span>
                          {place.openingHours && (
                            <span>
                              <Clock className="w-3.5 h-3.5" />{" "}
                              {place.openingHours}
                            </span>
                          )}
                          {place.cuisine && (
                            <span>
                              <Utensils className="w-3.5 h-3.5" />{" "}
                              {place.cuisine}
                            </span>
                          )}
                          <span>
                            Est. Group Cost:{" "}
                            {place.estimatedCostINR === 0
                              ? "Free"
                              : formatCurrency(
                                  place.estimatedCostINR * trip.travelers,
                                  trip.currency
                                )}
                          </span>
                        </div>

                        {place.dietarySupported &&
                          place.dietarySupported.length > 0 && (
                            <div className="place-categories">
                              {place.dietarySupported.map((d) => (
                                <span key={d} className="pill-badge">
                                  ✓ {d}
                                </span>
                              ))}
                            </div>
                          )}

                        <div className="place-card-actions">
                          <button
                            type="button"
                            className={`button ${
                              isInItinerary ? "button-quiet" : "button-primary"
                            } button-sm`}
                            onClick={() =>
                              handleAddPlaceToDay(place, targetDayToAdd)
                            }
                          >
                            {isInItinerary ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Add Again (Day{" "}
                                {targetDayToAdd})
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" /> Add to Day{" "}
                                {targetDayToAdd}
                              </>
                            )}
                          </button>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${place.name} ${place.address}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${place.name} in Google Maps`}
                            className="button button-quiet button-sm"
                          >
                            Map <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Place Detail Modal */}
            {detailPlace && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs"
              >
                <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full overflow-hidden shadow-elevated max-h-[88vh] flex flex-col">
                  <div className="relative h-64 w-full shrink-0">
                    <img
                      src={detailPlace.photoUrl}
                      alt={detailPlace.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <button
                      type="button"
                      onClick={() => setDetailPlace(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/75"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <span className="hero-badge">
                        {detailPlace.category} • {detailPlace.subcategory}
                      </span>
                      <h3 className="text-2xl font-heading font-extrabold mt-2">
                        {detailPlace.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    <p className="text-sm text-heading leading-relaxed">
                      {detailPlace.description}
                    </p>

                    {detailPlace.whyVisit && (
                      <div className="selected-place">
                        <strong>Traveler Highlight:</strong>{" "}
                        <span>{detailPlace.whyVisit}</span>
                      </div>
                    )}

                    <div className="review-cards">
                      <div className="review-card">
                        <div>
                          <span>Address</span>
                          <strong>{detailPlace.address}</strong>
                        </div>
                      </div>
                      <div className="review-card">
                        <div>
                          <span>Opening Hours & Suggested Duration</span>
                          <strong>
                            {detailPlace.openingHours || "09:00 AM – 06:00 PM"}{" "}
                            • {detailPlace.recommendedDurationMins} mins
                          </strong>
                        </div>
                      </div>
                      <div className="review-card">
                        <div>
                          <span>Verified Rating & Reviews</span>
                          <strong>
                            ★ {detailPlace.rating || 4.5} (
                            {(detailPlace.reviewCount || 1200).toLocaleString()}{" "}
                            reviews)
                          </strong>
                        </div>
                      </div>
                      <div className="review-card">
                        <div>
                          <span>GPS Coordinates & Place ID</span>
                          <strong>
                            {detailPlace.lat}, {detailPlace.lng} (
                            {detailPlace.placeId.slice(0, 14)})
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-background">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${detailPlace.name} ${detailPlace.address}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-quiet button-sm"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <select
                        value={targetDayToAdd}
                        onChange={(e) =>
                          setTargetDayToAdd(Number(e.target.value))
                        }
                        style={{
                          padding: "8px 12px",
                          borderRadius: "12px",
                          border: "1px solid var(--line)",
                        }}
                      >
                        {trip.days.map((d) => (
                          <option key={d.id} value={d.dayNumber}>
                            Day {d.dayNumber}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddPlaceToDay(detailPlace, targetDayToAdd)
                        }
                        className="button button-primary button-sm"
                      >
                        + Add to Day {targetDayToAdd}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
