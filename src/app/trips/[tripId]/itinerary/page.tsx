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
import { formatCurrency } from "@/lib/utils";

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
          <div className="trip-detail-panel">
            {/* Day Selector Tabs */}
            <div className="panel-heading">
              <div className="day-selector">
                {trip.days.map((day) => {
                  const active = day.dayNumber === currentDay.dayNumber;
                  return (
                    <button
                      key={day.id}
                      type="button"
                      className={`day-pill ${active ? "active" : ""}`}
                      onClick={() => setSelectedDayNum(day.dayNumber)}
                    >
                      <span>Day {day.dayNumber}</span>
                      <small>{day.date}</small>
                    </button>
                  );
                })}
              </div>

              <div className="day-actions">
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={() => setAddingModalOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Attraction
                </button>
                <button
                  type="button"
                  className="button button-quiet button-sm"
                  disabled={isRegeneratingDay}
                  onClick={handleRegenerateCurrentDay}
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate Day{" "}
                  {currentDay.dayNumber}
                </button>
              </div>
            </div>

            {/* Day Banner Summary */}
            <div className="day-title-row">
              <div>
                <span className="eyebrow">{currentDay.date}</span>
                <h2>{currentDay.title}</h2>
                <p>{currentDay.summary}</p>
              </div>
              <Link
                href={`/trips/${trip.id}/map?day=${currentDay.dayNumber}`}
                className="button button-quiet button-sm"
              >
                <MapPin className="w-4 h-4" /> View Day {currentDay.dayNumber}{" "}
                Route on Map
              </Link>
            </div>

            {/* Timeline Cards */}
            {currentDay.activities.length === 0 ? (
              <div className="empty-panel">
                <h3>No activities scheduled for Day {currentDay.dayNumber}</h3>
                <p>
                  Add a verified attraction or regenerate this day to populate
                  your schedule.
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setAddingModalOpen(true)}
                >
                  + Add Verified Attraction
                </button>
              </div>
            ) : (
              <div className="timeline">
                {currentDay.activities.map((act, idx) => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-node">
                      <span>{idx + 1}</span>
                    </div>

                    <div className="timeline-card">
                      <div className="timeline-time">
                        <strong>{act.startTime}</strong>
                        <span>to {act.endTime}</span>
                        {act.travelTimeToNext &&
                          idx < currentDay.activities.length - 1 && (
                            <small style={{ color: "var(--ocean)", fontWeight: 700, marginTop: "6px" }}>
                              <Car className="w-3.5 h-3.5" /> ~
                              {act.travelTimeToNext}m ({act.distanceToNextKm} km)
                            </small>
                          )}
                      </div>

                      <div className="activity-content">
                        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                          <img
                            src={act.photoUrl}
                            alt={act.title}
                            style={{
                              width: "148px",
                              height: "110px",
                              borderRadius: "16px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />

                          <div style={{ flex: 1, minWidth: "220px" }}>
                            <div className="activity-top">
                              <div>
                                <h3>{act.title}</h3>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                <span className="activity-category">
                                  {act.category}
                                </span>
                                {act.isHiddenGem && (
                                  <span className="pill-badge">
                                    <Sparkles className="w-3 h-3" /> Hidden Gem
                                  </span>
                                )}
                              </div>
                            </div>

                            <p style={{ marginTop: "6px" }}>{act.description}</p>

                            <div className="activity-meta" style={{ marginTop: "10px" }}>
                              <span>
                                <Clock className="w-3.5 h-3.5" /> Visit:{" "}
                                {act.expectedDuration} mins
                              </span>
                              <span>
                                <Wallet className="w-3.5 h-3.5" /> Est. Cost:{" "}
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
                        </div>

                        {editingTimeActId === act.id && (
                          <div className="replace-drawer" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                            <input
                              type="text"
                              value={editStartTime}
                              onChange={(e) => setEditStartTime(e.target.value)}
                              placeholder="09:00 AM"
                              style={{ padding: "6px 10px", borderRadius: "10px", border: "1px solid var(--line)" }}
                            />
                            <span>to</span>
                            <input
                              type="text"
                              value={editEndTime}
                              onChange={(e) => setEditEndTime(e.target.value)}
                              placeholder="11:00 AM"
                              style={{ padding: "6px 10px", borderRadius: "10px", border: "1px solid var(--line)" }}
                            />
                            <button
                              type="button"
                              className="button button-primary button-sm"
                              onClick={() => handleSaveTimeEdit(act.id)}
                            >
                              Save Time
                            </button>
                            <button
                              type="button"
                              className="button button-quiet button-sm"
                              onClick={() => setEditingTimeActId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <div className="activity-actions">
                          <button
                            type="button"
                            className="mini-action"
                            disabled={idx === 0}
                            onClick={() => handleReorderActivity(idx, "UP")}
                            aria-label="Move activity earlier"
                          >
                            <ArrowUp className="w-3.5 h-3.5" /> Earlier
                          </button>

                          <button
                            type="button"
                            className="mini-action"
                            disabled={idx === currentDay.activities.length - 1}
                            onClick={() => handleReorderActivity(idx, "DOWN")}
                            aria-label="Move activity later"
                          >
                            <ArrowDown className="w-3.5 h-3.5" /> Later
                          </button>

                          <button
                            type="button"
                            className="mini-action"
                            onClick={() => setReplacingActivityId(act.id)}
                          >
                            <Repeat className="w-3.5 h-3.5" /> Replace
                          </button>

                          <button
                            type="button"
                            className="mini-action"
                            onClick={() => {
                              setEditingTimeActId(act.id);
                              setEditStartTime(act.startTime);
                              setEditEndTime(act.endTime);
                            }}
                          >
                            <Clock className="w-3.5 h-3.5" /> Change Time
                          </button>

                          {trip.days.length > 1 && (
                            <select
                              aria-label="Move activity to another day"
                              value={currentDay.dayNumber}
                              onChange={(e) =>
                                handleMoveToDay(act, Number(e.target.value))
                              }
                              className="mini-action"
                            >
                              {trip.days.map((d) => (
                                <option key={d.id} value={d.dayNumber}>
                                  {d.dayNumber === currentDay.dayNumber
                                    ? `On Day ${d.dayNumber}`
                                    : `Move to Day ${d.dayNumber}`}
                                </option>
                              ))}
                            </select>
                          )}

                          <button
                            type="button"
                            className="mini-action danger"
                            onClick={() => handleDeleteActivity(act.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>

                          <Link
                            href={`/trips/${trip.id}/map?day=${currentDay.dayNumber}&highlight=${act.id}`}
                            className="mini-action"
                          >
                            <MapPin className="w-3.5 h-3.5" /> View on Map
                          </Link>

                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${act.title} ${trip.destinationName}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mini-action"
                          >
                            Google Maps <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
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
                          className="button button-primary button-sm"
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
