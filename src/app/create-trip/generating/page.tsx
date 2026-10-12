"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";

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
    <DashboardWorkspaceLayout
      title="Generating Your Itinerary"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Generating Trip" },
      ]}
    >
      <div className="generating-view">
        {!errorState ? (
          <>
            <div className="generating-orbit">
              <div className="orbit-ring" />
              <div className="orbit-compass">
                <Compass className="w-7 h-7" />
              </div>
              <div className="orbit-dot" />
            </div>

            <span className="eyebrow">
              Crafting {activeDraft.destinationName || "Your"} Journey
              {jobId ? ` • ${jobId}` : ""}
            </span>
            <h1>{GENERATION_STEPS[activeStepIdx]}</h1>
            <p>
              Matching verified places, dining preferences, and route distances
              for your {activeDraft.durationDays}-day{" "}
              {activeDraft.travelType.toLowerCase()} trip.
            </p>

            <div className="generating-steps">
              {GENERATION_STEPS.map((msg, idx) => {
                const isDone = idx < activeStepIdx;
                const isCurrent = idx === activeStepIdx;
                return (
                  <div
                    key={msg}
                    className={`generating-step ${
                      isDone ? "done" : isCurrent ? "active" : ""
                    }`}
                  >
                    <span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </span>
                    <p>{msg}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="empty-panel">
            <AlertTriangle className="w-8 h-8" style={{ color: "var(--danger)", margin: "0 auto" }} />
            <h3>We hit a snag generating your trip</h3>
            <p>{errorState}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "10px" }}>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => router.push("/create-trip/review")}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Review
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={runGeneration}
              >
                <RefreshCw className="w-4 h-4" /> Retry Generation
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardWorkspaceLayout>
  );
}
