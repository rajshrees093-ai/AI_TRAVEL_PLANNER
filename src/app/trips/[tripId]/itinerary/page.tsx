"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Wallet,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Repeat,
  Calendar,
  Car,
  Sparkles,
  X,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { getCandidatePlacesForDestination } from "@/lib/destinations-catalog";
import { regenerateSingleDayInTrip } from "@/lib/ai-assistant";
import { TripActivity, VerifiedPlace } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

export default function DayWiseItineraryPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [replacingActivityId, setReplacingActivityId] = useState<string | null>(
    null
  );
  const [addingModalOpen, setAddingModalOpen] = useState(false);
  const [editingTimeActId, setEditingTimeActId] = useState<string | null>(null);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);

  const currentDay =
    trip?.days.find((d) => d.dayNumber === selectedDayNum) || trip?.days[0];
  const candidatePlaces = trip
    ? getCandidatePlacesForDestination(trip.destinationName)
    : [];

  const handleRegenerateCurrentDay = async () => {
    if (!trip || !currentDay) return;
    setIsRegeneratingDay(true);
    try {
      const updated = regenerateSingleDayInTrip(trip, currentDay.dayNumber);
      await saveOrUpdateTrip(
        updated,
        `Regenerated Day ${currentDay.dayNumber} while preserving all other days!`
      );
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!trip || !currentDay) return;
    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber
        ? {
            ...d,
            activities: d.activities.filter((a) => a.id !== activityId),
          }
        : d
    );
    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      "Activity removed & route recalculated"
    );
  };

  const handleReorderActivity = async (
    activityIndex: number,
    direction: "UP" | "DOWN"
  ) => {
    if (!trip || !currentDay) return;
    const targetIdx =
      direction === "UP" ? activityIndex - 1 : activityIndex + 1;
    if (targetIdx < 0 || targetIdx >= currentDay.activities.length) return;

    const list = [...currentDay.activities];
    // Swap positions while keeping time slots sensible
    const temp = list[activityIndex];
    list[activityIndex] = {
      ...list[targetIdx],
      startTime: temp.startTime,
      endTime: temp.endTime,
    };
    list[targetIdx] = {
      ...temp,
      startTime: currentDay.activities[targetIdx].startTime,
      endTime: currentDay.activities[targetIdx].endTime,
    };

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: list } : d
    );
    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      "Reordered stops & recalculated travel times"
    );
  };

  const handleMoveToDay = async (activity: TripActivity, targetDayNum: number) => {
    if (!trip || !currentDay || targetDayNum === currentDay.dayNumber) return;
    const updatedDays = trip.days.map((d) => {
      if (d.dayNumber === currentDay.dayNumber) {
        return {
          ...d,
          activities: d.activities.filter((a) => a.id !== activity.id),
        };
      }
      if (d.dayNumber === targetDayNum) {
        return {
          ...d,
          activities: [
            ...d.activities,
            {
              ...activity,
              tripDayId: d.id,
              position: d.activities.length + 1,
            },
          ],
        };
      }
      return d;
    });

    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Moved "${activity.title}" to Day ${targetDayNum}`
    );
  };

  const handleSaveTimeEdit = async (activityId: string) => {
    if (!trip || !currentDay) return;
    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber
        ? {
            ...d,
            activities: d.activities.map((a) =>
              a.id === activityId
                ? {
                    ...a,
                    startTime: editStartTime || a.startTime,
                    endTime: editEndTime || a.endTime,
                  }
                : a
            ),
          }
        : d
    );
    setEditingTimeActId(null);
    await saveOrUpdateTrip({ ...trip, days: updatedDays }, "Activity timing updated");
  };

  const handleReplaceWithVerifiedPlace = async (place: VerifiedPlace) => {
    if (!trip || !currentDay || !replacingActivityId) return;
    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber
        ? {
            ...d,
            activities: d.activities.map((a) =>
              a.id === replacingActivityId
                ? {
                    ...a,
                    placeId: place.placeId,
                    title: place.name,
                    category: place.category,
                    description: place.description,
                    expectedDuration: place.recommendedDurationMins,
                    estimatedCost: place.estimatedCostINR * trip.travelers,
                    lat: place.lat,
                    lng: place.lng,
                    address: place.address,
                    rating: place.rating,
                    openingHours: place.openingHours,
                    photoUrl: place.photoUrl,
                    isHiddenGem: place.isHiddenGem,
                  }
                : a
            ),
          }
        : d
    );
    setReplacingActivityId(null);
    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Replaced with "${place.name}"`
    );
  };

  const handleAddVerifiedPlace = async (place: VerifiedPlace) => {
    if (!trip || !currentDay) return;
    const newAct: TripActivity = {
      id: `${currentDay.id}-act-${Date.now().toString(36)}`,
      tripDayId: currentDay.id,
      placeId: place.placeId,
      title: place.name,
      category: place.category,
      startTime: "05:30 PM",
      endTime: "07:00 PM",
      expectedDuration: place.recommendedDurationMins,
      estimatedCost: place.estimatedCostINR * trip.travelers,
      position: currentDay.activities.length + 1,
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
    };

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber
        ? { ...d, activities: [...d.activities, newAct] }
        : d
    );
    setAddingModalOpen(false);
    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Added "${place.name}" to Day ${currentDay.dayNumber}`
    );
  };

  return (
    <DashboardWorkspaceLayout
      title={trip ? `${trip.destinationName} — Daily Itinerary` : "Daily Itinerary"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: trip?.destinationName || "Trip", href: `/trips/${params.tripId}` },
        { label: "Daily Itinerary" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && currentDay && (
          <div className="space-y-6">
            {/* Day Selector Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {trip.days.map((day) => {
                  const active = day.dayNumber === currentDay.dayNumber;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      onClick={() => setSelectedDayNum(day.dayNumber)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-xs sm:text-sm font-heading font-bold transition-all shrink-0",
                        active
                          ? "bg-primary text-white shadow-xs"
                          : "bg-background border border-border text-muted hover:text-heading"
                      )}
                    >
                      <span>Day {day.dayNumber}</span>
                      <span
                        className={cn(
                          "ml-2 text-[11px] font-normal",
                          active ? "text-white/85" : "text-muted"
                        )}
                      >
                        {day.date}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAddingModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Attraction</span>
                </button>
                <button
                  type="button"
                  disabled={isRegeneratingDay}
                  onClick={handleRegenerateCurrentDay}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-sand/40 text-xs font-semibold text-heading transition-colors"
                >
                  <RefreshCw
                    className={cn(
                      "w-3.5 h-3.5 text-primary",
                      isRegeneratingDay && "animate-spin"
                    )}
                  />
                  <span>Regenerate Day {currentDay.dayNumber}</span>
                </button>
              </div>
            </div>

            {/* Day Banner Summary */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentDay.date}</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-heading mt-1">
                  {currentDay.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted mt-1">
                  {currentDay.summary}
                </p>
              </div>
              <Link
                href={`/trips/${trip.id}/map?day=${currentDay.dayNumber}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sand/60 hover:bg-sand text-heading text-xs font-semibold shrink-0 transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span>View Day {currentDay.dayNumber} Route on Map</span>
              </Link>
            </div>

            {/* Timeline Cards */}
            {currentDay.activities.length === 0 ? (
              <div className="bg-surface border border-border rounded-2xl p-10 text-center">
                <p className="text-base font-heading font-bold text-heading">
                  No activities scheduled for Day {currentDay.dayNumber}
                </p>
                <p className="text-xs text-muted mt-1">
                  Add a verified attraction or regenerate this day to populate
                  your schedule.
                </p>
                <button
                  type="button"
                  onClick={() => setAddingModalOpen(true)}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  + Add Verified Attraction
                </button>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/30 space-y-6 ml-2 sm:ml-4">
                {currentDay.activities.map((act, idx) => (
                  <div key={act.id} className="relative">
                    {/* Numbered Timeline Dot */}
                    <div className="absolute -left-[37px] sm:-left-[45px] top-4 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft hover:border-primary/40 transition-all">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={act.photoUrl}
                          alt={act.title}
                          className="w-full md:w-44 h-36 rounded-xl object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                                  {act.startTime} – {act.endTime}
                                </span>
                                <span className="px-2.5 py-1 rounded-lg bg-sand text-heading text-xs font-semibold">
                                  {act.category}
                                </span>
                                {act.isHiddenGem && (
                                  <span className="px-2.5 py-1 rounded-lg bg-accent/15 text-accent text-xs font-bold flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Hidden Gem
                                  </span>
                                )}
                              </div>

                              {/* Reorder Buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() =>
                                    handleReorderActivity(idx, "UP")
                                  }
                                  aria-label="Move activity earlier"
                                  className="p-1.5 rounded-lg border border-border text-muted hover:text-heading disabled:opacity-30"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    idx === currentDay.activities.length - 1
                                  }
                                  onClick={() =>
                                    handleReorderActivity(idx, "DOWN")
                                  }
                                  aria-label="Move activity later"
                                  className="p-1.5 rounded-lg border border-border text-muted hover:text-heading disabled:opacity-30"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <h4 className="text-lg font-heading font-bold text-heading mt-2">
                              {act.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                Visit: {act.expectedDuration} mins
                              </span>
                              <span className="inline-flex items-center gap-1 font-semibold text-heading">
                                <Wallet className="w-3.5 h-3.5 text-primary" />
                                Est. Cost:{" "}
                                {act.estimatedCost === 0
                                  ? "Free Entry"
                                  : formatCurrency(
                                      act.estimatedCost,
                                      trip.currency
                                    )}
                              </span>
                              {act.openingHours && (
                                <span>Hours: {act.openingHours}</span>
                              )}
                            </div>
                          </div>

                          {/* Inline Time Editor if active */}
                          {editingTimeActId === act.id && (
                            <div className="mt-3 p-3 rounded-xl bg-background border border-border flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                value={editStartTime}
                                onChange={(e) =>
                                  setEditStartTime(e.target.value)
                                }
                                placeholder="09:00 AM"
                                className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-heading w-28"
                              />
                              <span className="text-xs text-muted">to</span>
                              <input
                                type="text"
                                value={editEndTime}
                                onChange={(e) => setEditEndTime(e.target.value)}
                                placeholder="11:00 AM"
                                className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-heading w-28"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveTimeEdit(act.id)}
                                className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-semibold"
                              >
                                Save Time
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingTimeActId(null)}
                                className="px-2.5 py-1 text-xs text-muted"
                              >
                                Cancel
                              </button>
                            </div>
                          )}

                          {/* Activity Action Bar */}
                          <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setReplacingActivityId(act.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background hover:bg-sand/40 border border-border text-xs font-medium text-heading transition-colors"
                              >
                                <Repeat className="w-3.5 h-3.5 text-primary" />
                                <span>Replace</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTimeActId(act.id);
                                  setEditStartTime(act.startTime);
                                  setEditEndTime(act.endTime);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background hover:bg-sand/40 border border-border text-xs font-medium text-heading transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                <span>Change Time</span>
                              </button>

                              {trip.days.length > 1 && (
                                <select
                                  aria-label="Move activity to another day"
                                  value={currentDay.dayNumber}
                                  onChange={(e) =>
                                    handleMoveToDay(act, Number(e.target.value))
                                  }
                                  className="px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-medium text-heading"
                                >
                                  {trip.days.map((d) => (
                                    <option
                                      key={d.id}
                                      value={d.dayNumber}
                                    >
                                      {d.dayNumber === currentDay.dayNumber
                                        ? `On Day ${d.dayNumber}`
                                        : `Move to Day ${d.dayNumber}`}
                                    </option>
                                  ))}
                                </select>
                              )}

                              <button
                                type="button"
                                onClick={() => handleDeleteActivity(act.id)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background hover:bg-red-50 border border-border text-xs font-medium text-red-600 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                href={`/trips/${trip.id}/map?day=${currentDay.dayNumber}&highlight=${act.id}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5" />
                                <span>View on Map</span>
                              </Link>
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  `${act.title} ${trip.destinationName}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted hover:text-heading"
                              >
                                <span>Google Maps</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Travel Time Connector to Next Activity */}
                    {act.travelTimeToNext &&
                      idx < currentDay.activities.length - 1 && (
                        <div className="my-3 ml-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand/70 border border-border text-xs font-medium text-heading">
                          <Car className="w-3.5 h-3.5 text-primary" />
                          <span>
                            ~{act.travelTimeToNext} mins drive (
                            {act.distanceToNextKm} km) to next stop
                          </span>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            )}

            {/* Replace or Add Verified Place Modal */}
            {(replacingActivityId || addingModalOpen) && (
              <div
                role="dialog"
                aria-modal="true"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
              >
                <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full p-6 shadow-elevated max-h-[82vh] flex flex-col">
                  <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-heading">
                        {replacingActivityId
                          ? "Replace with a Verified Place"
                          : `Add Verified Place to Day ${currentDay.dayNumber}`}
                      </h3>
                      <p className="text-xs text-muted">
                        Select from verified attractions, cafés, and restaurants
                        in {trip.destinationName}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReplacingActivityId(null);
                        setAddingModalOpen(false);
                      }}
                      className="p-1.5 text-muted hover:text-heading rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {candidatePlaces.map((place) => (
                      <div
                        key={place.placeId}
                        className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={place.photoUrl}
                            alt={place.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-primary">
                              {place.category} • ★ {place.rating || 4.5}
                            </span>
                            <h4 className="text-sm font-heading font-bold text-heading truncate">
                              {place.name}
                            </h4>
                            <p className="text-xs text-muted line-clamp-1">
                              {place.description}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            replacingActivityId
                              ? handleReplaceWithVerifiedPlace(place)
                              : handleAddVerifiedPlace(place)
                          }
                          className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shrink-0"
                        >
                          {replacingActivityId ? "Replace" : "Add Stop"}
                        </button>
                      </div>
                    ))}
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
