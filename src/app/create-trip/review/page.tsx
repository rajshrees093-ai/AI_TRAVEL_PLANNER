"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  Users,
  Sliders,
  Wallet,
  Edit3,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  calculateDaysBetween,
  formatCurrency,
  formatDateRange,
} from "@/lib/utils";

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
        { label: activeDraft.destinationName || "Trip", href: "/create-trip/destination" },
        { label: "Review Trip" },
      ]}
    >
      <WizardProgressStepper currentStep={5} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 text-success text-xs font-bold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ready for AI Planning
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
              Your Adventure Is Almost Ready!
            </h2>
            <p className="text-sm text-muted mt-1">
              Review your selections below. You can jump back to edit any
              section without losing your choices.
            </p>
          </div>
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {/* 1. Destination Card */}
          <div className="bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Destination
                  </p>
                  <h3 className="text-lg font-heading font-bold text-heading">
                    {activeDraft.destinationName || "Manali"}
                  </h3>
                  <p className="text-xs text-muted">
                    {activeDraft.destinationCountry || "Himachal Pradesh, India"}
                  </p>
                </div>
              </div>
              <Link
                href="/create-trip/destination"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted flex items-center justify-between">
              <span>Starting City: {activeDraft.startCity}</span>
              <code className="font-mono text-[10px]">
                {activeDraft.destinationPlaceId || "ChIJp7jK8l7vBDkR0xV1m8kY8mM"}
              </code>
            </div>
          </div>

          {/* 2. Dates & Travelers Card */}
          <div className="bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Travel Dates & Group
                  </p>
                  <h3 className="text-lg font-heading font-bold text-heading">
                    {formatDateRange(
                      activeDraft.startDate,
                      activeDraft.endDate
                    )}{" "}
                    ({duration} {duration === 1 ? "Day" : "Days"})
                  </h3>
                  <p className="text-xs text-muted">
                    {activeDraft.travelers}{" "}
                    {activeDraft.travelers === 1 ? "Traveler" : "Travelers"} •{" "}
                    {activeDraft.travelType} Group
                  </p>
                </div>
              </div>
              <Link
                href="/create-trip/dates"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>
            <div className="mt-4 pt-3 border-t border-border text-xs text-muted flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>Window: {activeDraft.sightseeingWindow}</span>
            </div>
          </div>

          {/* 3. Preferences Card */}
          <div className="bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Interests, Pace & Food
                  </p>
                  <h3 className="text-base font-heading font-bold text-heading">
                    {activeDraft.travelPace} Pace • {activeDraft.foodPreference}
                  </h3>
                </div>
              </div>
              <Link
                href="/create-trip/preferences"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeDraft.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-heading"
                >
                  {interest}
                </span>
              ))}
            </div>

            {activeDraft.specialInstructions && (
              <p className="mt-3 pt-3 border-t border-border text-xs text-muted italic">
                Note: &ldquo;{activeDraft.specialInstructions}&rdquo;
              </p>
            )}
          </div>

          {/* 4. Budget & Included Expenses Card */}
          <div className="bg-background border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    Total Budget & Tier
                  </p>
                  <h3 className="text-lg font-heading font-bold text-heading">
                    {formatCurrency(totalBudget, activeDraft.currency)} (
                    {activeDraft.travelTier})
                  </h3>
                  <p className="text-xs text-muted">
                    {formatCurrency(
                      Math.round(
                        totalBudget / Math.max(1, activeDraft.travelers)
                      ),
                      activeDraft.currency
                    )}{" "}
                    per person
                  </p>
                </div>
              </div>
              <Link
                href="/create-trip/budget"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeDraft.includedExpenses.map((exp) => (
                <span
                  key={exp}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs font-medium text-heading"
                >
                  ✓ {exp}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/create-trip/budget")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-heading hover:bg-sand/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Budget</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-heading font-bold text-base shadow-elevated flex items-center justify-center gap-2.5 transition-all"
          >
            <Sparkles className="w-5 h-5 text-sand" />
            <span>
              {isSubmitting
                ? "Starting AI Planner..."
                : "✨ Generate My Itinerary"}
            </span>
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
