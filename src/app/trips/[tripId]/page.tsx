"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ThumbsUp,
  CheckCircle2,
  AlertTriangle,
  Plane,
  TrainFront,
  Car,
  Edit3,
  FileDown,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { IllustratedPdfModal } from "@/components/trip/IllustratedPdfModal";
import { useRoamWise } from "@/context/RoamWiseContext";
import { formatCurrency } from "@/lib/utils";
import { computeHometownToDestinationTransit } from "@/lib/destinations-catalog";
import { proposeConversationalAdjustment } from "@/lib/ai-assistant";

export default function TripOverviewPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [newComment, setNewComment] = useState("");
  const [commentAuthor] = useState("Companion");
  const [quickPrompt, setQuickPrompt] = useState("");
  const [refinementNote, setRefinementNote] = useState<string | null>(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);

  const handleQuickRefine = async (instruction: string) => {
    if (!trip || !instruction.trim()) return;
    const result = proposeConversationalAdjustment(trip, instruction.trim());
    await saveOrUpdateTrip(
      result.proposedTrip,
      "Itinerary updated with your changes!"
    );
    setRefinementNote(result.explanation);
    setQuickPrompt("");
  };

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
  const foodExperiences = allActivities
    .filter((a) => a.category === "Restaurant" || a.category === "Café")
    .slice(0, 3);
  const hiddenGems = allActivities.filter((a) => a.isHiddenGem);
  const totalPlannedCost = trip
    ? trip.budgetItems.reduce((s, b) => s + b.estimatedAmount, 0)
    : 0;
  const budgetPct = trip
    ? Math.min(100, Math.round((totalPlannedCost / Math.max(1, trip.budget)) * 100))
    : 0;
  const hometownTransit = trip
    ? computeHometownToDestinationTransit(
        trip.startCity || "New Delhi",
        trip.destinationName
      )
    : null;

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
          <div className="overview-grid">
            {/* Main Column */}
            <div className="overview-main">
              {/* AI Personalization Rationale */}
              <div className="editorial-note">
                <div>
                  <span className="eyebrow">AI Personalization Rationale</span>
                  <h3>Why this itinerary fits your style</h3>
                </div>
                <p>{trip.aiSummary}</p>
                <div className="place-categories">
                  {trip.interests.map((interest) => (
                    <span key={interest} className="filter-chip active">
                      {interest}
                    </span>
                  ))}
                  <span className="filter-chip">
                    Food: {trip.foodPreference}
                  </span>
                </div>
              </div>

              {/* Hometown-to-Destination Travel Route */}
              {hometownTransit && (
                <div className="editorial-note">
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "10px" }}>
                    <div>
                      <span className="eyebrow">Hometown-to-Destination Travel Route</span>
                      <h3>
                        How to Reach {hometownTransit.destinationName} from{" "}
                        {hometownTransit.originCity}
                      </h3>
                    </div>
                    <span className="pill-badge">
                      ~{hometownTransit.aerialDistanceKm.toLocaleString()} km • Best:{" "}
                      {hometownTransit.recommendedPrimaryMode}
                    </span>
                  </div>

                  <div className="choice-row">
                    <div className="choice-card">
                      <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Plane className="w-4 h-4" /> Air Connection
                      </strong>
                      <span>{hometownTransit.flightEstimate}</span>
                    </div>
                    {hometownTransit.trainEstimate && (
                      <div className="choice-card">
                        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <TrainFront className="w-4 h-4" /> Rail / Express Train
                        </strong>
                        <span>{hometownTransit.trainEstimate}</span>
                      </div>
                    )}
                    {hometownTransit.roadEstimate && (
                      <div className="choice-card">
                        <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Car className="w-4 h-4" /> Highway / Road Drive
                        </strong>
                        <span>{hometownTransit.roadEstimate}</span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: "0.86rem" }}>
                    {hometownTransit.routeSummaryNote}
                  </p>
                </div>
              )}

              {/* Budget Warning Banner if Over Budget */}
              {trip.validationWarnings.length > 0 && (
                <div className="budget-warning">
                  <AlertTriangle className="w-5 h-5" />
                  <div style={{ flex: 1 }}>
                    <strong>{trip.validationWarnings[0]}</strong>
                    <div style={{ marginTop: "8px" }}>
                      <Link
                        href={`/trips/${trip.id}/budget`}
                        className="button button-primary button-sm"
                      >
                        Open AI Budget Rescue →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Day-by-Day Preview List */}
              <div className="day-preview-list">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">Daily Schedule</span>
                    <h2>Day-by-Day Schedule & Place Photos</h2>
                  </div>
                  <Link
                    href={`/trips/${trip.id}/itinerary`}
                    className="text-button"
                  >
                    Open Full Interactive Timeline <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {trip.days.map((day) => (
                  <div key={day.id} className="day-preview">
                    <div className="day-preview-head">
                      <div>
                        <span>
                          Day {day.dayNumber} • {day.date}
                        </span>
                        <h4>{day.title}</h4>
                      </div>
                      <Link
                        href={`/trips/${trip.id}/itinerary?day=${day.dayNumber}`}
                        className="text-button"
                      >
                        Edit Day {day.dayNumber} →
                      </Link>
                    </div>

                    <p>{day.summary}</p>

                    <div className="day-preview-items">
                      {day.activities.map((act) => (
                        <div key={act.id} className="mini-activity">
                          <span>{act.startTime}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={act.photoUrl}
                              alt={act.title}
                              style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                flexShrink: 0,
                              }}
                            />
                            <div>
                              <strong>{act.title}</strong>
                              <small>
                                {act.category} • {act.address}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tailor Your Plan & Export */}
              <div className="editorial-note">
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div>
                    <span className="eyebrow">Tailor Your Plan & Export</span>
                    <h3>Want to make changes or download your Illustrated PDF?</h3>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <button
                      type="button"
                      className="button button-primary button-sm"
                      onClick={() => setPdfModalOpen(true)}
                    >
                      <FileDown className="w-4 h-4" /> Download PDF with Place Photos
                    </button>
                    <Link
                      href={`/trips/${trip.id}/edit`}
                      className="button button-quiet button-sm"
                    >
                      <Edit3 className="w-4 h-4" /> Full Customize & AI Studio
                    </Link>
                  </div>
                </div>

                <div className="suggestion-chips">
                  {[
                    "Make Day 1 more relaxed with fewer stops",
                    "Reduce overall cost with budget-friendly options",
                    "Add more local vegetarian food & cafés",
                    "Include hidden gems & scenic viewpoints",
                  ].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      className="filter-chip"
                      onClick={() => handleQuickRefine(chip)}
                    >
                      <Sparkles className="w-3.5 h-3.5" /> {chip}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleQuickRefine(quickPrompt);
                  }}
                  style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                >
                  <input
                    type="text"
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    placeholder="Or type any change (e.g., 'Make Day 2 more relaxed' or 'Reduce food budget')..."
                    style={{
                      flex: 1,
                      minWidth: "220px",
                      border: "1px solid var(--line)",
                      borderRadius: "14px",
                      padding: "10px 14px",
                    }}
                  />
                  <button type="submit" className="button button-primary button-sm">
                    Apply Change Now
                  </button>
                </form>

                {refinementNote && (
                  <div className="selected-place">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{refinementNote}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Aside Column */}
            <aside className="overview-aside">
              {/* Budget Summary */}
              <div className="aside-card">
                <span className="eyebrow">Budget Summary</span>
                <h3>{formatCurrency(totalPlannedCost, trip.currency)}</h3>
                <p>
                  Out of {formatCurrency(trip.budget, trip.currency)} selected
                  budget ({trip.travelers} travelers)
                </p>
                <div className="budget-track">
                  <div className="split-bar">
                    <span style={{ width: `${budgetPct}%` }} />
                  </div>
                  <small>{budgetPct}% of target budget allocated</small>
                </div>
                <Link
                  href={`/trips/${trip.id}/budget`}
                  className="button button-quiet button-sm"
                >
                  Open Full Budget Analysis →
                </Link>
              </div>

              {/* Weather-Aware Planning */}
              <div className="aside-card">
                <span className="eyebrow">Weather-Aware Planning</span>
                <h3>
                  {trip.days[0]?.weatherCondition || "Pleasant Conditions"}
                </h3>
                <p>
                  {trip.days[0]?.weatherNote ||
                    "Outdoor viewpoints are scheduled for morning clarity, with sheltered cultural or café stops available midday."}
                </p>
              </div>

              {/* Recommended Dining */}
              <div className="aside-card">
                <span className="eyebrow">Recommended Dining</span>
                <h3>Curated Food Stops</h3>
                {foodExperiences.map((food) => (
                  <div key={food.id} className="food-card">
                    <div>
                      <strong>{food.title}</strong>
                      <span>{food.cuisine || food.category}</span>
                    </div>
                    <small>
                      {formatCurrency(food.estimatedCost, trip.currency)}
                    </small>
                  </div>
                ))}
                <Link
                  href={`/trips/${trip.id}/places`}
                  className="text-button"
                >
                  Explore All Places & Food →
                </Link>
              </div>

              {/* Hidden Gems & Route Overview */}
              <div className="aside-card">
                <span className="eyebrow">Smart Route & Hidden Gems</span>
                <h3>Geographic Clustering</h3>
                <div className="route-card">
                  {hiddenGems.slice(0, 2).map((gem) => (
                    <div key={gem.id}>
                      <strong>★ {gem.title}</strong>
                      <span>{gem.notes || gem.description}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: "0.84rem" }}>
                    Daily attractions are ordered geographically using
                    nearest-neighbor clustering to prevent backtracking.
                  </p>
                </div>
                <Link
                  href={`/trips/${trip.id}/map`}
                  className="button button-primary button-sm"
                >
                  Open Interactive Route Map →
                </Link>
              </div>

              {/* Group Collaboration */}
              <div className="aside-card">
                <span className="eyebrow">Group Collaboration</span>
                <h3>Companion Notes & Votes</h3>
                <div style={{ display: "grid", gap: "8px" }}>
                  {(trip.comments || []).map((c) => (
                    <div key={c.id} className="food-card">
                      <div>
                        <strong>{c.authorName}</strong>
                        <span>{c.text}</span>
                      </div>
                      <button
                        type="button"
                        className="filter-chip"
                        onClick={() => handleUpvoteComment(c.id)}
                      >
                        <ThumbsUp className="w-3 h-3" /> {c.upvotes}
                      </button>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={handleAddComment}
                  style={{ display: "flex", gap: "8px" }}
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Suggest an activity or note..."
                    style={{
                      flex: 1,
                      border: "1px solid var(--line)",
                      borderRadius: "12px",
                      padding: "8px 10px",
                      fontSize: "0.84rem",
                    }}
                  />
                  <button type="submit" className="button button-primary button-sm">
                    Post
                  </button>
                </form>
              </div>
            </aside>

            <IllustratedPdfModal
              trip={trip}
              open={pdfModalOpen}
              onClose={() => setPdfModalOpen(false)}
            />
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
