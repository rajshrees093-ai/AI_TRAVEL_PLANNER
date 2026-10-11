"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  CheckCircle2,
  X,
  Save,
  Sliders,
  Wallet,
  Clock,
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
import { calculateDaysBetween, cn, formatCurrency } from "@/lib/utils";

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

  // Conversational AI Editor State
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
      "Applied RoamWise AI adjustments!"
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
        { label: trip?.destinationName || "Trip", href: `/trips/${params.tripId}` },
        { label: "Edit & Customize" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7/12): Structured Trip Parameter Form */}
            <form
              onSubmit={handleSaveParameterEdits}
              className="lg:col-span-7 bg-surface border border-border rounded-2xl p-6 shadow-soft space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-primary" />
                    <span>Edit Trip Parameters</span>
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Modify dates, travelers, budget, or preferences without
                    losing your custom daily activities.
                  </p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Destination Name
                  </label>
                  <input
                    type="text"
                    value={destinationName}
                    onChange={(e) => setDestinationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Total Budget ({trip.currency})
                  </label>
                  <input
                    type="number"
                    min={1000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-bold text-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Number of Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Travel Group Type
                  </label>
                  <select
                    value={travelType}
                    onChange={(e) =>
                      setTravelType(e.target.value as TravelGroupType)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Couple">Couple</option>
                    <option value="Friends">Friends</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Travel Pace
                  </label>
                  <select
                    value={travelPace}
                    onChange={(e) =>
                      setTravelPace(e.target.value as TravelPace)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  >
                    <option value="Relaxed">Relaxed</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Packed">Packed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-heading mb-1">
                    Food Preference
                  </label>
                  <select
                    value={foodPreference}
                    onChange={(e) =>
                      setFoodPreference(e.target.value as FoodPreference)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </div>
              </div>

              {/* Interests Multi-Select */}
              <div>
                <label className="block text-xs font-semibold text-heading mb-2">
                  Active Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_INTERESTS.map((item) => {
                    const active = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors",
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-background border-border text-muted hover:text-heading"
                        )}
                      >
                        {active ? `✓ ${item}` : item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Link to Edit Individual Daily Activities */}
              <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-heading">
                    Daily Activities ({trip.days.length} Days)
                  </p>
                  <p className="text-xs text-muted">
                    Reorder, replace, add, or delete individual time slots in
                    the Timeline tab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(`/trips/${trip.id}/itinerary`)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-primary hover:bg-sand/40 shrink-0"
                >
                  <span>Edit Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Right Column (5/12): Conversational AI Editor */}
            <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-6 shadow-soft space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Conversational AI Editor
                </span>
                <h3 className="text-xl font-heading font-bold text-heading">
                  Ask RoamWise to Adjust Your Trip
                </h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Describe how you&apos;d like to refine your itinerary.
                  RoamWise will preview the proposed changes and impact on
                  budget and transit time before applying.
                </p>
              </div>

              {/* Suggested Request Chips */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">
                  Suggested Requests
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleProposeAIAdjustment(prompt)}
                      className="px-3 py-1.5 rounded-xl bg-background hover:bg-primary/10 border border-border hover:border-primary/40 text-xs font-medium text-heading transition-colors text-left"
                    >
                      &ldquo;{prompt}&rdquo;
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Instruction Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleProposeAIAdjustment(aiPrompt);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Make Day 2 more relaxed..."
                  aria-label="Ask RoamWise to adjust your trip"
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm text-heading focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </form>

              {/* Review & Confirmation Step Before Applying Major Changes */}
              {pendingProposal && (
                <div className="p-4 rounded-2xl bg-sand/50 border-2 border-primary/40 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Proposed Itinerary Changes
                      </span>
                      <h4 className="text-sm font-heading font-bold text-heading">
                        &ldquo;{pendingProposal.instruction}&rdquo;
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPendingProposal(null)}
                      className="p-1 text-muted hover:text-heading"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-heading leading-relaxed">
                    {pendingProposal.explanation}
                  </p>

                  <ul className="space-y-1.5 text-xs text-muted bg-surface p-3 rounded-xl border border-border">
                    {pendingProposal.changesList.map((change, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Impact on Budget and Schedule */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface border border-border flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted block">
                          Budget Impact
                        </span>
                        <strong className="text-heading">
                          {pendingProposal.budgetDelta <= 0
                            ? `${formatCurrency(
                                pendingProposal.budgetDelta,
                                trip.currency
                              )}`
                            : `+${formatCurrency(
                                pendingProposal.budgetDelta,
                                trip.currency
                              )}`}
                        </strong>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-surface border border-border flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <div>
                        <span className="text-[10px] text-muted block">
                          Transit Impact
                        </span>
                        <strong className="text-heading">
                          {pendingProposal.travelTimeDeltaMinutes <= 0
                            ? `${pendingProposal.travelTimeDeltaMinutes} mins`
                            : `+${pendingProposal.travelTimeDeltaMinutes} mins`}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPendingProposal(null)}
                      className="px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-heading"
                    >
                      Discard
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmProposal}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold"
                    >
                      Confirm & Apply Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
