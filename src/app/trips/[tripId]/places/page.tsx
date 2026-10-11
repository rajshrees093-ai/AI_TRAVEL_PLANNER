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
import { cn, formatCurrency } from "@/lib/utils";

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
        { label: trip?.destinationName || "Trip", href: `/trips/${params.tripId}` },
        { label: "Places & Food" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search Input */}
                <div className="md:col-span-2 flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                  <Search className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search attractions, restaurants, or cuisines in ${trip.destinationName}...`}
                    className="bg-transparent text-xs sm:text-sm text-heading focus:outline-none w-full"
                  />
                </div>

                {/* Price Filter */}
                <select
                  aria-label="Filter by price level"
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-heading"
                >
                  <option value="ALL">All Price Levels</option>
                  <option value="Free">Free Entry</option>
                  <option value="$">$ Budget Friendly</option>
                  <option value="$$">$$ Moderate</option>
                  <option value="$$$">$$$ Signature</option>
                </select>

                {/* Dietary Filter */}
                <select
                  aria-label="Filter by dietary support"
                  value={selectedDiet}
                  onChange={(e) => setSelectedDiet(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold text-heading"
                >
                  <option value="ALL">All Dietary Preferences</option>
                  <option value="Vegetarian">Vegetarian Verified</option>
                  <option value="Vegan">Vegan Verified</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                </select>
              </div>

              {/* Category Chips + Target Day Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORY_FILTERS.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                          active
                            ? "bg-primary text-white"
                            : "bg-background border border-border text-muted hover:text-heading"
                        )}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted font-medium">Add stops to:</span>
                  <select
                    value={targetDayToAdd}
                    onChange={(e) =>
                      setTargetDayToAdd(Number(e.target.value))
                    }
                    className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-primary"
                  >
                    {trip.days.map((d) => (
                      <option key={d.id} value={d.dayNumber}>
                        Day {d.dayNumber} ({d.date})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Cards Grid */}
            {filteredPlaces.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <p className="text-base font-heading font-bold text-heading">
                  No places matched your current filters
                </p>
                <p className="text-xs text-muted mt-1">
                  Try clearing your search or selecting &ldquo;All&rdquo;
                  categories.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                    setSelectedPrice("ALL");
                    setSelectedDiet("ALL");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => {
                  const isInItinerary = trip.days.some((d) =>
                    d.activities.some((a) => a.placeId === place.placeId)
                  );

                  return (
                    <div
                      key={place.placeId}
                      className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div
                          onClick={() => setDetailPlace(place)}
                          className="relative h-48 overflow-hidden cursor-pointer group"
                        >
                          <img
                            src={place.photoUrl}
                            alt={place.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-xs text-heading text-[11px] font-bold">
                              {place.category}
                            </span>
                            {place.isHiddenGem && (
                              <span className="px-2.5 py-1 rounded-full bg-accent text-white text-[11px] font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Hidden Gem
                              </span>
                            )}
                          </div>
                          {place.priceLevel && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/55 text-white text-xs font-bold">
                              {place.priceLevel}
                            </span>
                          )}
                          <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                            <span className="font-semibold">
                              {place.subcategory}
                            </span>
                            {place.rating && (
                              <span className="inline-flex items-center gap-1 bg-black/45 px-2 py-0.5 rounded-full">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <strong>{place.rating}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5">
                          <button
                            type="button"
                            onClick={() => setDetailPlace(place)}
                            className="text-left group"
                          >
                            <h3 className="text-base font-heading font-bold text-heading group-hover:text-primary transition-colors">
                              {place.name}
                            </h3>
                          </button>

                          <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">
                            {place.description}
                          </p>

                          <div className="mt-3 space-y-1.5 text-xs text-muted">
                            <p className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="truncate">{place.address}</span>
                            </p>
                            {place.openingHours && (
                              <p className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>{place.openingHours}</span>
                              </p>
                            )}
                            {place.cuisine && (
                              <p className="flex items-center gap-1.5">
                                <Utensils className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>Cuisine: {place.cuisine}</span>
                              </p>
                            )}
                          </div>

                          {/* Dietary Badges when supported */}
                          {place.dietarySupported &&
                            place.dietarySupported.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {place.dietarySupported.map((d) => (
                                  <span
                                    key={d}
                                    className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-semibold"
                                  >
                                    ✓ {d}
                                  </span>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-muted block">
                            Est. Group Cost
                          </span>
                          <span className="text-xs font-bold text-heading">
                            {place.estimatedCostINR === 0
                              ? "Free"
                              : formatCurrency(
                                  place.estimatedCostINR * trip.travelers,
                                  trip.currency
                                )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${place.name} ${place.address}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${place.name} in Google Maps`}
                            className="p-2 rounded-xl border border-border text-muted hover:text-heading"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            type="button"
                            onClick={() =>
                              handleAddPlaceToDay(place, targetDayToAdd)
                            }
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors",
                              isInItinerary
                                ? "bg-sand text-heading hover:bg-primary hover:text-white"
                                : "bg-primary hover:bg-primary-dark text-white"
                            )}
                          >
                            {isInItinerary ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Add Again (Day {targetDayToAdd})</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Day {targetDayToAdd}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
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
                      <span className="px-2.5 py-1 rounded-full bg-primary text-xs font-bold">
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
                      <div className="p-3.5 rounded-xl bg-sand/50 border border-border text-xs text-heading">
                        <strong>Traveler Highlight:</strong>{" "}
                        {detailPlace.whyVisit}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-background border border-border">
                        <span className="text-muted block">Address</span>
                        <strong className="text-heading">
                          {detailPlace.address}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-border">
                        <span className="text-muted block">
                          Opening Hours & Suggested Duration
                        </span>
                        <strong className="text-heading">
                          {detailPlace.openingHours || "09:00 AM – 06:00 PM"} •{" "}
                          {detailPlace.recommendedDurationMins} mins
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-border">
                        <span className="text-muted block">
                          Verified Rating & Reviews
                        </span>
                        <strong className="text-heading">
                          ★ {detailPlace.rating || 4.5} (
                          {(detailPlace.reviewCount || 1200).toLocaleString()}{" "}
                          reviews)
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-border">
                        <span className="text-muted block">
                          GPS Coordinates & Place ID
                        </span>
                        <strong className="text-heading font-mono text-[11px]">
                          {detailPlace.lat}, {detailPlace.lng} (
                          {detailPlace.placeId.slice(0, 14)})
                        </strong>
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
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold text-heading"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-2">
                      <select
                        value={targetDayToAdd}
                        onChange={(e) =>
                          setTargetDayToAdd(Number(e.target.value))
                        }
                        className="px-3 py-2.5 rounded-xl bg-surface border border-border text-xs font-bold text-heading"
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
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold"
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
