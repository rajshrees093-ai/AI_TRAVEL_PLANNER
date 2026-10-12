"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  CheckCircle2,
  X,
  Save,
  ArrowRight,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  ConversationalProposal,
  proposeConversationalAdjustment,
} from "@/lib/ai-assistant";
import { FoodPreference, TravelGroupType, TravelPace } from "@/lib/types";
import { calculateDaysBetween, formatCurrency } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Make Day 2 more relaxed.",
  "Add more adventure activities.",
  "Find cheaper restaurants.",
  "Replace museums with nature spots.",
  "Add vegetarian food recommendations.",
  "Reduce travel time between attractions.",
];

const ALL_INTERESTS = [
  "Nature and Mountains",
  "Beaches",
  "Adventure",
  "Historical Places",
  "Food Exploration",
  "Shopping",
  "Photography",
  "Relaxation",
  "Art and Culture",
  "Hidden Gems",
];

export default function EditAndCustomizeTripPage({
  params,
}: {
  params: { tripId: string };
}) {
  const router = useRouter();
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [destinationName, setDestinationName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [travelType, setTravelType] = useState<TravelGroupType>("Couple");
  const [budget, setBudget] = useState(45000);
  const [travelPace, setTravelPace] = useState<TravelPace>("Balanced");
  const [foodPreference, setFoodPreference] =
    useState<FoodPreference>("No Preference");
  const [interests, setInterests] = useState<string[]>([]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [pendingProposal, setPendingProposal] =
    useState<ConversationalProposal | null>(null);

  useEffect(() => {
    if (!trip) return;
    setDestinationName(trip.destinationName);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setTravelers(trip.travelers);
    setTravelType(trip.travelType);
    setBudget(trip.budget);
    setTravelPace(trip.travelPace);
    setFoodPreference(trip.foodPreference);
    setInterests(trip.interests);
  }, [trip]);

  const toggleInterest = (label: string) => {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const handleSaveParameterEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;
    const duration = Math.max(1, calculateDaysBetween(startDate, endDate));
    const updated = {
      ...trip,
      destinationName: destinationName.trim() || trip.destinationName,
      title: `Your Perfect ${duration}-Day Escape to ${
        destinationName.trim() || trip.destinationName
      }`,
      startDate,
      endDate,
      durationDays: duration,
      travelers: Math.max(1, Number(travelers)),
      travelType,
      budget: Math.max(1000, Number(budget)),
      travelPace,
      foodPreference,
      interests: interests.length > 0 ? interests : trip.interests,
    };
    await saveOrUpdateTrip(updated, "Trip parameters saved & recalculated!");
  };

  const handleProposeAIAdjustment = (instructionText: string) => {
    if (!trip || !instructionText.trim()) return;
    const proposal = proposeConversationalAdjustment(
      trip,
      instructionText.trim()
    );
    setPendingProposal(proposal);
    setAiPrompt(instructionText);
  };

  const handleConfirmProposal = async () => {
    if (!pendingProposal) return;
    await saveOrUpdateTrip(
      pendingProposal.proposedTrip,
      "Applied RouteBloom AI adjustments!"
    );
    setPendingProposal(null);
    setAiPrompt("");
  };

  return (
    <DashboardWorkspaceLayout
      title={
        trip
          ? `${trip.destinationName} — Edit & AI Assistant`
          : "Customize Trip"
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: trip?.destinationName || "Trip",
          href: `/trips/${params.tripId}`,
        },
        { label: "Edit & Customize" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="trip-detail-panel edit-panel">
            {/* Conversational AI Editor */}
            <div className="ai-edit-box">
              <div className="ai-edit-head">
                <span className="ai-edit-icon">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <span className="eyebrow">Conversational AI Editor</span>
                  <h3>Ask RouteBloom to Adjust Your Trip</h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>
                    Describe how you’d like to refine your itinerary. RouteBloom
                    will preview the proposed changes and impact on budget and
                    transit time before applying.
                  </p>
                </div>
              </div>

              <div className="suggestion-chips">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="filter-chip"
                    onClick={() => handleProposeAIAdjustment(prompt)}
                  >
                    “{prompt}”
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProposeAIAdjustment(aiPrompt);
                }}
                style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Make Day 2 more relaxed..."
                  aria-label="Ask RouteBloom to adjust your trip"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    border: "1px solid var(--line)",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    background: "var(--paper)",
                  }}
                />
                <button type="submit" className="button button-primary">
                  <Send className="w-4 h-4" /> Preview
                </button>
              </form>

              {pendingProposal && (
                <div className="proposal-review">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                    <div>
                      <span className="eyebrow">Proposed Itinerary Changes</span>
                      <h4>“{pendingProposal.instruction}”</h4>
                    </div>
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => setPendingProposal(null)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p>{pendingProposal.explanation}</p>

                  <div style={{ display: "grid", gap: "6px" }}>
                    {pendingProposal.changesList.map((change, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.86rem" }}>
                        <CheckCircle2 className="w-4 h-4" style={{ color: "var(--sage)" }} />
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>

                  <div className="place-categories">
                    <span className="pill-badge">
                      Budget Impact:{" "}
                      {pendingProposal.budgetDelta <= 0
                        ? formatCurrency(
                            pendingProposal.budgetDelta,
                            trip.currency
                          )
                        : `+${formatCurrency(
                            pendingProposal.budgetDelta,
                            trip.currency
                          )}`}
                    </span>
                    <span className="pill-badge">
                      Transit Impact:{" "}
                      {pendingProposal.travelTimeDeltaMinutes <= 0
                        ? `${pendingProposal.travelTimeDeltaMinutes} mins`
                        : `+${pendingProposal.travelTimeDeltaMinutes} mins`}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                      type="button"
                      className="button button-quiet button-sm"
                      onClick={() => setPendingProposal(null)}
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      className="button button-primary button-sm"
                      onClick={handleConfirmProposal}
                    >
                      Confirm & Apply Changes
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Structured Trip Parameter Form */}
            <form onSubmit={handleSaveParameterEdits} className="space-y-6">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Trip Parameters</span>
                  <h2>Edit Trip Parameters</h2>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={() => router.push(`/trips/${trip.id}/itinerary`)}
                  >
                    Edit Daily Timeline <ArrowRight className="w-4 h-4" />
                  </button>
                  <button type="submit" className="button button-primary button-sm">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <label className="form-field">
                  <span>Destination Name</span>
                  <input
                    type="text"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Total Budget ({trip.currency})</span>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                  />
                </label>

                <label className="form-field">
                  <span>Start Date</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>End Date</span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>

                <label className="form-field">
                  <span>Number of Travelers</span>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                  />
                </label>

                <label className="form-field">
                  <span>Travel Group Type</span>
                  <select
                    value={travelType}
                    onChange={(e) =>
                      setTravelType(e.target.value as TravelGroupType)
                    }
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Friends">Friends</option>
                    <option value="Family">Family</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Travel Pace</span>
                  <select
                    value={travelPace}
                    onChange={(e) =>
                      setTravelPace(e.target.value as TravelPace)
                    }
                  >
                    <option value="Relaxed">Relaxed</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Packed">Packed</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Food Preference</span>
                  <select
                    value={foodPreference}
                    onChange={(e) =>
                      setFoodPreference(e.target.value as FoodPreference)
                    }
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </label>

                <div className="form-field full-span">
                  <span>Active Interests</span>
                  <div className="place-categories">
                    {ALL_INTERESTS.map((item) => {
                      const active = interests.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          className={`filter-chip ${active ? "active" : ""}`}
                          onClick={() => toggleInterest(item)}
                        >
                          {active ? `✓ ${item}` : item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
