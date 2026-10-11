"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { cn } from "@/lib/utils";

const GENERATION_STEPS = [
  "Discovering amazing places...",
  "Finding restaurants that match your taste...",
  "Organizing your daily adventures...",
  "Checking travel distances...",
  "Balancing your trip budget...",
  "Putting the finishing touches on your itinerary...",
];

export default function GeneratingItineraryPage() {
  const router = useRouter();
  const { activeDraft, user, saveOrUpdateTrip, removeDraft } = useRoamWise();

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const startedRef = useRef(false);

  const runGeneration = useCallback(async () => {
    setErrorState(null);
    setActiveStepIdx(0);

    // Step progression timer for visual step milestones (no fake percentages)
    const stepTimer = setInterval(() => {
      setActiveStepIdx((prev) =>
        prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 550);

    try {
      const payload = {
        userId: user?.id || "user-roamwise-demo",
        draftId: activeDraft.id,
        destinationPlaceId:
          activeDraft.destinationPlaceId || "ChIJp7jK8l7vBDkR0xV1m8kY8mM",
        destinationName: activeDraft.destinationName || "Manali",
        destinationCountry:
          activeDraft.destinationCountry || "Himachal Pradesh, India",
        heroImage: activeDraft.heroImage,
        startCity: activeDraft.startCity || "New Delhi",
        startDate: activeDraft.startDate,
        endDate: activeDraft.endDate,
        travelers: Number(activeDraft.travelers) || 2,
        travelType: activeDraft.travelType || "Couple",
        sightseeingWindow: activeDraft.sightseeingWindow,
        interests:
          activeDraft.interests.length > 0
            ? activeDraft.interests
            : ["Nature and Mountains", "Food Exploration"],
        travelPace: activeDraft.travelPace || "Balanced",
        foodPreference: activeDraft.foodPreference || "No Preference",
        dietaryRestrictions: activeDraft.dietaryRestrictions,
        accessibilityNeeds: activeDraft.accessibilityNeeds,
        specialInstructions: activeDraft.specialInstructions,
        budgetAmount: Number(activeDraft.budgetAmount) || 45000,
        budgetMode: activeDraft.budgetMode || "TOTAL",
        currency: activeDraft.currency || "INR",
        travelTier: activeDraft.travelTier || "Comfort",
        includedExpenses:
          activeDraft.includedExpenses.length > 0
            ? activeDraft.includedExpenses
            : ["Accommodation", "Food", "Activities", "Local transport"],
      };

      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        clearInterval(stepTimer);
        setErrorState(
          data.message ||
            "Failed to generate itinerary. Please verify your parameters and retry."
        );
        return;
      }

      setJobId(data.jobId);

      // Poll /api/trips/generate/[jobId] to verify server job completion
      if (data.jobId) {
        const pollRes = await fetch(`/api/trips/generate/${data.jobId}`);
        if (pollRes.ok) {
          const pollData = await pollRes.json();
          if (pollData.status === "FAILED") {
            clearInterval(stepTimer);
            setErrorState(
              pollData.errorMessage || "Server generation job failed."
            );
            return;
          }
        }
      }

      // Allow step sequence to complete smoothly then redirect to generated trip
      setTimeout(async () => {
        clearInterval(stepTimer);
        setActiveStepIdx(GENERATION_STEPS.length - 1);
        if (data.trip) {
          await saveOrUpdateTrip(data.trip, "Itinerary generated!");
          removeDraft(activeDraft.id);
          router.replace(`/trips/${data.trip.id}`);
        } else if (data.tripId) {
          router.replace(`/trips/${data.tripId}`);
        }
      }, 2200);
    } catch (err) {
      clearInterval(stepTimer);
      setErrorState(
        err instanceof Error
          ? err.message
          : "Network error while contacting the AI Travel Engine."
      );
    }
  }, [activeDraft, user?.id, saveOrUpdateTrip, removeDraft, router]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    runGeneration();
  }, [runGeneration]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-surface border border-border rounded-3xl max-w-xl w-full p-8 sm:p-10 shadow-elevated text-center">
        {!errorState ? (
          <>
            {/* Animated Compass & Pulsing AI Indicator */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
              <div className="relative w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center shadow-elevated">
                <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: "6s" }} />
                <span className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand text-heading text-xs font-semibold mb-3">
              <span>Crafting {activeDraft.destinationName || "Your"} Journey</span>
              {jobId && (
                <code className="font-mono text-[10px] text-primary">
                  • {jobId}
                </code>
              )}
            </span>

            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-heading">
              {GENERATION_STEPS[activeStepIdx]}
            </h1>
            <p className="text-sm text-muted mt-2">
              Matching verified places, dining preferences, and route distances
              for your {activeDraft.durationDays}-day{" "}
              {activeDraft.travelType.toLowerCase()} trip.
            </p>

            {/* Step-based Progress List (No Fake Percentages) */}
            <div className="mt-8 text-left space-y-2.5 bg-background border border-border rounded-2xl p-5">
              {GENERATION_STEPS.map((msg, idx) => {
                const isDone = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                return (
                  <div
                    key={msg}
                    className={cn(
                      "flex items-center gap-3 text-xs sm:text-sm transition-opacity",
                      isDone
                        ? "text-success font-medium"
                        : isCurrent
                        ? "text-heading font-bold"
                        : "text-muted opacity-50"
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : isCurrent ? (
                      <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-border shrink-0" />
                    )}
                    <span>{msg}</span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-heading">
              We hit a snag generating your trip
            </h2>
            <p className="text-sm text-muted mt-2 max-w-md mx-auto">
              {errorState}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/create-trip/review")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-heading hover:bg-sand/40"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Review</span>
              </button>
              <button
                type="button"
                onClick={runGeneration}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Generation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
