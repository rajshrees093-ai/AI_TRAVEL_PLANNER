"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  Utensils,
  Wallet,
  Route,
  CloudSun,
  Gem,
  ArrowRight,
  ThumbsUp,
  MessageSquarePlus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { formatCurrency } from "@/lib/utils";

export default function TripOverviewPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [newComment, setNewComment] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("Companion");

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !newComment.trim()) return;
    const updated = {
      ...trip,
      comments: [
        {
          id: `comment-${Date.now()}`,
          authorName: commentAuthor.trim() || "Travel Companion",
          text: newComment.trim(),
          upvotes: 1,
          createdAt: new Date().toISOString(),
        },
        ...(trip.comments || []),
      ],
    };
    setNewComment("");
    await saveOrUpdateTrip(updated, "Suggestion added to trip board");
  };

  const handleUpvoteComment = async (commentId: string) => {
    if (!trip) return;
    const updated = {
      ...trip,
      comments: (trip.comments || []).map((c) =>
        c.id === commentId ? { ...c, upvotes: c.upvotes + 1 } : c
      ),
    };
    await saveOrUpdateTrip(updated);
  };

  const allActivities = trip ? trip.days.flatMap((d) => d.activities) : [];
  const mustVisitSights = allActivities
    .filter((a) => a.category !== "Restaurant" && a.category !== "Café")
    .slice(0, 4);
  const foodExperiences = allActivities
    .filter((a) => a.category === "Restaurant" || a.category === "Café")
    .slice(0, 3);
  const hiddenGems = allActivities.filter((a) => a.isHiddenGem);
  const totalPlannedCost = trip
    ? trip.budgetItems.reduce((s, b) => s + b.estimatedAmount, 0)
    : 0;

  return (
    <DashboardWorkspaceLayout
      title={trip ? `${trip.destinationName} — Overview` : "Trip Overview"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Trips", href: "/saved-trips" },
        { label: trip?.destinationName || "Trip Overview" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="space-y-8">
            {/* AI Personalization Rationale + Weather Advisory */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Personalization Rationale
                  </span>
                  <span className="text-[11px] text-muted">
                    Verified Place Metadata + AI Synthesis
                  </span>
                </div>
                <p className="text-sm sm:text-base text-heading leading-relaxed">
                  {trip.aiSummary}
                </p>
                <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-2">
                  {trip.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-lg bg-background border border-border text-xs font-medium text-heading"
                    >
                      {interest}
                    </span>
                  ))}
                  <span className="px-2.5 py-1 rounded-lg bg-sand text-heading text-xs font-semibold">
                    Food: {trip.foodPreference}
                  </span>
                </div>
              </div>

              {/* Weather-Aware Planning Card */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/15 text-warning text-xs font-bold">
                      <CloudSun className="w-3.5 h-3.5" />
                      Weather-Aware Planning
                    </span>
                  </div>
                  <h3 className="text-base font-heading font-bold text-heading">
                    {trip.days[0]?.weatherCondition || "Pleasant Conditions"}
                  </h3>
                  <p className="text-xs text-muted mt-1.5 leading-relaxed">
                    {trip.days[0]?.weatherNote ||
                      "Outdoor viewpoints are scheduled for morning clarity, with sheltered cultural or café stops available midday."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border text-[11px] text-muted">
                  Note: Seasonal climate benchmarks shown. Check 48-hour live
                  radar prior to outdoor trails.
                </div>
              </div>
            </div>

            {/* Budget Warning Banner if Over Budget */}
            {trip.validationWarnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-warning/15 border border-warning/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-medium text-heading">
                    {trip.validationWarnings[0]}
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/budget`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shrink-0 text-center"
                >
                  Open AI Budget Rescue →
                </Link>
              </div>
            )}

            {/* Day-by-Day Preview Cards */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-heading font-bold text-heading">
                    Day-by-Day Schedule Preview
                  </h3>
                  <p className="text-xs text-muted">
                    Click any day to open the full interactive timeline.
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/itinerary`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Open Full Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {trip.days.map((day) => (
                  <div
                    key={day.id}
                    className="bg-surface border border-border rounded-2xl p-5 shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-bold">
                          Day {day.dayNumber} • {day.date}
                        </span>
                        <span className="text-xs text-muted">
                          {day.activities.length} stops
                        </span>
                      </div>
                      <h4 className="text-base font-heading font-bold text-heading">
                        {day.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 leading-relaxed">
                        {day.summary}
                      </p>

                      <ul className="mt-4 space-y-2">
                        {day.activities.map((act) => (
                          <li
                            key={act.id}
                            className="flex items-center justify-between text-xs bg-background border border-border rounded-xl px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[11px] text-primary font-semibold shrink-0">
                                {act.startTime}
                              </span>
                              <span className="font-medium text-heading truncate">
                                {act.title}
                              </span>
                            </div>
                            <span className="text-muted shrink-0 ml-2">
                              {act.category}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <Link
                        href={`/trips/${trip.id}/itinerary?day=${day.dayNumber}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        Customize Day {day.dayNumber} →
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/map?day=${day.dayNumber}`}
                        className="text-xs font-medium text-muted hover:text-heading"
                      >
                        View Day Route
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Must-Visit Highlights & Hidden Gems */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>Must-Visit Verified Attractions</span>
                  </h3>
                  <Link
                    href={`/trips/${trip.id}/places`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Explore All Places →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mustVisitSights.map((place) => (
                    <div
                      key={place.id}
                      className="bg-background border border-border rounded-2xl overflow-hidden flex flex-col"
                    >
                      <img
                        src={place.photoUrl}
                        alt={place.title}
                        className="h-32 w-full object-cover"
                      />
                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-primary">
                              {place.category}
                            </span>
                            {place.rating && (
                              <span className="text-[11px] font-semibold text-heading">
                                ★ {place.rating}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-heading font-bold text-heading mt-0.5">
                            {place.title}
                          </h4>
                          <p className="text-xs text-muted mt-1 line-clamp-2">
                            {place.description}
                          </p>
                        </div>
                        <p className="text-[11px] text-muted mt-2 pt-2 border-t border-border truncate">
                          {place.address}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidden Gems & Recommended Food Experiences */}
              <div className="space-y-6">
                <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft">
                  <h3 className="text-base font-heading font-bold text-heading flex items-center gap-2 mb-3">
                    <Gem className="w-4 h-4 text-accent" />
                    <span>Hidden Gems Included</span>
                  </h3>
                  {hiddenGems.length > 0 ? (
                    <div className="space-y-3">
                      {hiddenGems.slice(0, 2).map((gem) => (
                        <div
                          key={gem.id}
                          className="p-3.5 rounded-xl bg-sand/40 border border-border"
                        >
                          <p className="text-xs font-bold text-heading">
                            {gem.title}
                          </p>
                          <p className="text-xs text-muted mt-1 leading-relaxed">
                            {gem.notes || gem.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted">
                      Discover lesser-known local spots in the Places & Food tab.
                    </p>
                  )}
                </div>

                <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft">
                  <h3 className="text-base font-heading font-bold text-heading flex items-center gap-2 mb-3">
                    <Utensils className="w-4 h-4 text-primary" />
                    <span>Recommended Dining</span>
                  </h3>
                  <div className="space-y-2.5">
                    {foodExperiences.map((food) => (
                      <div
                        key={food.id}
                        className="p-3 rounded-xl bg-background border border-border flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-heading truncate">
                            {food.title}
                          </p>
                          <p className="text-[11px] text-muted">
                            {food.cuisine || food.category}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-primary shrink-0 ml-2">
                          {formatCurrency(food.estimatedCost, trip.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Budget & Route Overview Cards + Group Collaboration Board */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Budget Snapshot */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-heading font-bold text-heading flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary" />
                      <span>Budget Summary</span>
                    </h3>
                    <span className="text-xs font-semibold text-success flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tracked
                    </span>
                  </div>
                  <p className="text-2xl font-heading font-extrabold text-heading">
                    {formatCurrency(totalPlannedCost, trip.currency)}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Out of {formatCurrency(trip.budget, trip.currency)} selected
                    budget ({trip.travelers} travelers)
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/budget`}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-background hover:bg-sand/40 border border-border text-xs font-semibold text-heading text-center transition-colors"
                >
                  Open Full Budget Analysis →
                </Link>
              </div>

              {/* Route Snapshot */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-heading flex items-center gap-2 mb-3">
                    <Route className="w-4 h-4 text-primary" />
                    <span>Smart Route Overview</span>
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Daily attractions are ordered geographically using
                    nearest-neighbor clustering to prevent backtracking and keep
                    daily road transit comfortable.
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/map`}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold text-center transition-colors"
                >
                  Open Interactive Route Map →
                </Link>
              </div>

              {/* Group Collaboration & Companion Notes */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-heading font-bold text-heading flex items-center gap-2 mb-3">
                    <MessageSquarePlus className="w-4 h-4 text-primary" />
                    <span>Group Collaboration & Votes</span>
                  </h3>

                  <div className="space-y-2.5 max-h-36 overflow-y-auto mb-3">
                    {(trip.comments || []).map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl bg-background border border-border text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-bold text-heading">
                            {c.authorName}:{" "}
                          </span>
                          <span className="text-muted">{c.text}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleUpvoteComment(c.id)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface border border-border text-[11px] font-semibold text-primary shrink-0"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{c.upvotes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Suggest an activity or note..."
                    className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs text-heading focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-semibold shrink-0"
                  >
                    Post
                  </button>
                </form>
              </div>
            </section>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
