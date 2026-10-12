"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Edit3,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  calculateDaysBetween,
  formatCurrency,
  formatDateRange,
} from "@/lib/utils";
import { findDestinationInfo } from "@/lib/destinations-catalog";

export default function TripReviewPage() {
  const router = useRouter();
  const { activeDraft } = useRoamWise();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const duration = Math.max(
    1,
    calculateDaysBetween(activeDraft.startDate, activeDraft.endDate)
  );
  const totalBudget =
    activeDraft.budgetMode === "PER_PERSON"
      ? activeDraft.budgetAmount * activeDraft.travelers
      : activeDraft.budgetAmount;

  const destInfo = findDestinationInfo(activeDraft.destinationName || "Manali");
  const heroBg = activeDraft.heroImage || destInfo.heroImage;

  const handleGenerateClick = () => {
    if (submittedRef.current || isSubmitting) return;
    submittedRef.current = true;
    setIsSubmitting(true);
    router.push(`/create-trip/generating?draftId=${activeDraft.id}`);
  };

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 5 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: activeDraft.destinationName || "Trip",
          href: "/create-trip/destination",
        },
        { label: "Review Trip" },
      ]}
    >
      <div className="wizard-page">
        <WizardProgressStepper currentStep={5} />

        <section className="wizard-panel">
          <div className="review-layout">
            <div
              className="review-hero"
              style={{
                backgroundImage: `linear-gradient(125deg, rgba(10, 26, 36, 0.82), rgba(8, 127, 140, 0.56)), url(${heroBg})`,
              }}
            >
              <div>
                <span className="hero-badge">Ready for AI Planning</span>
                <h3>{activeDraft.destinationName || "Manali"}</h3>
                <p>
                  {activeDraft.destinationCountry || "Himachal Pradesh, India"} •{" "}
                  {duration} {duration === 1 ? "Day" : "Days"} • Starting from{" "}
                  {activeDraft.startCity}
                </p>
              </div>
              <div className="review-hero-meta">
                <span>
                  {formatDateRange(activeDraft.startDate, activeDraft.endDate)}
                </span>
                <span>
                  {activeDraft.travelers}{" "}
                  {activeDraft.travelers === 1 ? "Traveler" : "Travelers"} (
                  {activeDraft.travelType})
                </span>
                <span>
                  {formatCurrency(totalBudget, activeDraft.currency)} •{" "}
                  {activeDraft.travelTier}
                </span>
              </div>
            </div>

            <div className="review-cards">
              {/* 1. Destination */}
              <div className="review-card">
                <div>
                  <span>Destination</span>
                  <strong>{activeDraft.destinationName || "Manali"}</strong>
                  <p>
                    {activeDraft.destinationCountry ||
                      "Himachal Pradesh, India"}{" "}
                    • Starting City: {activeDraft.startCity}
                  </p>
                  <small style={{ color: "var(--muted)", fontSize: "0.75rem" }}>
                    Place ID:{" "}
                    <code>
                      {activeDraft.destinationPlaceId ||
                        "ChIJp7jK8l7vBDkR0xV1m8kY8mM"}
                    </code>
                  </small>
                </div>
                <Link href="/create-trip/destination" className="text-button">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>

              {/* 2. Travel Dates & Group */}
              <div className="review-card">
                <div>
                  <span>Travel Dates & Group</span>
                  <strong>
                    {formatDateRange(
                      activeDraft.startDate,
                      activeDraft.endDate
                    )}{" "}
                    ({duration} {duration === 1 ? "Day" : "Days"})
                  </strong>
                  <p>
                    {activeDraft.travelers}{" "}
                    {activeDraft.travelers === 1 ? "Traveler" : "Travelers"} •{" "}
                    {activeDraft.travelType} Group • Window:{" "}
                    {activeDraft.sightseeingWindow}
                  </p>
                </div>
                <Link href="/create-trip/dates" className="text-button">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>

              {/* 3. Interests, Pace & Food */}
              <div className="review-card">
                <div>
                  <span>Interests, Pace & Food</span>
                  <strong>
                    {activeDraft.travelPace} Pace • {activeDraft.foodPreference}
                  </strong>
                  <p>{activeDraft.interests.join(", ")}</p>
                  {activeDraft.specialInstructions && (
                    <p style={{ fontStyle: "italic", marginTop: "4px" }}>
                      Note: “{activeDraft.specialInstructions}”
                    </p>
                  )}
                </div>
                <Link href="/create-trip/preferences" className="text-button">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>

              {/* 4. Total Budget & Tier */}
              <div className="review-card">
                <div>
                  <span>Total Budget & Tier</span>
                  <strong>
                    {formatCurrency(totalBudget, activeDraft.currency)} (
                    {activeDraft.travelTier})
                  </strong>
                  <p>
                    {formatCurrency(
                      Math.round(
                        totalBudget / Math.max(1, activeDraft.travelers)
                      ),
                      activeDraft.currency
                    )}{" "}
                    per person • Includes:{" "}
                    {activeDraft.includedExpenses.join(", ")}
                  </p>
                </div>
                <Link href="/create-trip/budget" className="text-button">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </Link>
              </div>
            </div>

            <div className="review-disclaimer">
              <Sparkles className="w-4 h-4" />
              <span>
                RouteBloom will assemble verified landmarks, geographic route
                sequences, dining recommendations, and itemized budget estimates
                for your journey.
              </span>
            </div>

            <div className="wizard-footer" style={{ paddingTop: "8px" }}>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => router.push("/create-trip/budget")}
              >
                <ArrowLeft className="w-4 h-4" /> Back to Budget
              </button>

              <button
                type="button"
                onClick={handleGenerateClick}
                disabled={isSubmitting}
                className="button button-primary generate-button"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? "Starting AI Planner..."
                    : "✨ Generate My Itinerary"}
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardWorkspaceLayout>
  );
}
