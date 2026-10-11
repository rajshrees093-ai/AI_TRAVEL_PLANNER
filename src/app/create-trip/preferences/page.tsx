"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mountain,
  Palmtree,
  Compass,
  Landmark,
  Utensils,
  ShoppingBag,
  Camera,
  Sparkles,
  Moon,
  Palette,
  Gem,
  Smile,
  Flame,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { preferencesStepSchema } from "@/lib/validations";
import { FoodPreference, TravelPace } from "@/lib/types";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  { label: "Spiritual & Temple Darshan", icon: Flame },
  { label: "Nature and Mountains", icon: Mountain },
  { label: "Beaches", icon: Palmtree },
  { label: "Adventure", icon: Compass },
  { label: "Historical Places", icon: Landmark },
  { label: "Food Exploration", icon: Utensils },
  { label: "Shopping", icon: ShoppingBag },
  { label: "Photography", icon: Camera },
  { label: "Relaxation", icon: Sparkles },
  { label: "Nightlife", icon: Moon },
  { label: "Art and Culture", icon: Palette },
  { label: "Hidden Gems", icon: Gem },
  { label: "Family Activities", icon: Smile },
];

const PACE_OPTIONS: { pace: TravelPace; desc: string; detail: string }[] = [
  {
    pace: "Relaxed",
    desc: "Fewer stops, more time to explore.",
    detail: "~3 stops per day with unhurried mornings",
  },
  {
    pace: "Balanced",
    desc: "A comfortable mix of sightseeing and downtime.",
    detail: "~4 stops per day with relaxed meal breaks",
  },
  {
    pace: "Packed",
    desc: "More activities and exciting experiences.",
    detail: "~5 stops per day from morning to sunset",
  },
];

const FOOD_OPTIONS: FoodPreference[] = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "No Preference",
];

export default function TravelPreferencesPage() {
  const router = useRouter();
  const { activeDraft, updateActiveDraft } = useRoamWise();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleInterest = (label: string) => {
    const exists = activeDraft.interests.includes(label);
    const next = exists
      ? activeDraft.interests.filter((i) => i !== label)
      : [...activeDraft.interests, label];
    updateActiveDraft({ interests: next });
  };

  const handleContinue = () => {
    setErrorMsg(null);
    const parsed = preferencesStepSchema.safeParse({
      interests: activeDraft.interests,
      travelPace: activeDraft.travelPace,
      foodPreference: activeDraft.foodPreference,
      dietaryRestrictions: activeDraft.dietaryRestrictions,
      accessibilityNeeds: activeDraft.accessibilityNeeds,
      specialInstructions: activeDraft.specialInstructions,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message ||
          "Please select at least one travel interest."
      );
      return;
    }

    updateActiveDraft({ currentStep: Math.max(activeDraft.currentStep, 4) });
    router.push("/create-trip/budget");
  };

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 3 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: activeDraft.destinationName || "Trip", href: "/create-trip/destination" },
        { label: "Travel Preferences" },
      ]}
    >
      <WizardProgressStepper currentStep={3} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            What kind of traveler are you?
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1.5">
            Help us shape a journey that feels like you.
          </p>
        </div>

        {errorMsg && (
          <div
            role="alert"
            className="mt-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700"
          >
            {errorMsg}
          </div>
        )}

        {/* Interests Grid */}
        <div className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-muted">
              Select Your Travel Interests ({activeDraft.interests.length}{" "}
              selected)
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {INTEREST_OPTIONS.map((item) => {
              const Icon = item.icon;
              const selected = activeDraft.interests.includes(item.label);
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => toggleInterest(item.label)}
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-2",
                    selected
                      ? "border-primary bg-primary/10 text-heading shadow-xs"
                      : "border-border bg-background text-muted hover:border-primary/40 hover:text-heading"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                        selected
                          ? "bg-primary text-white"
                          : "bg-surface text-primary border border-border"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold leading-snug">
                      {item.label}
                    </span>
                  </div>
                  {selected && (
                    <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel Pace */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Travel Pace
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PACE_OPTIONS.map((opt) => {
              const selected = activeDraft.travelPace === opt.pace;
              return (
                <button
                  key={opt.pace}
                  type="button"
                  onClick={() => updateActiveDraft({ travelPace: opt.pace })}
                  className={cn(
                    "p-5 rounded-2xl border-2 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-heading font-bold text-heading">
                      {opt.pace}
                    </span>
                    {selected && (
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-heading mt-1.5 font-medium">
                    {opt.desc}
                  </p>
                  <p className="text-xs text-muted mt-1">{opt.detail}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Preferences & Dietary Needs */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Food Preferences
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FOOD_OPTIONS.map((food) => {
              const selected = activeDraft.foodPreference === food;
              return (
                <button
                  key={food}
                  type="button"
                  onClick={() => updateActiveDraft({ foodPreference: food })}
                  className={cn(
                    "py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-semibold flex items-center justify-between transition-all",
                    selected
                      ? "border-primary bg-primary/10 text-heading"
                      : "border-border bg-background text-muted hover:text-heading"
                  )}
                >
                  <span>{food}</span>
                  {selected && <Check className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label
                htmlFor="dietary-restrictions"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Optional Dietary Restrictions / Allergies
              </label>
              <input
                id="dietary-restrictions"
                type="text"
                value={activeDraft.dietaryRestrictions}
                onChange={(e) =>
                  updateActiveDraft({ dietaryRestrictions: e.target.value })
                }
                placeholder="e.g. Jain, Gluten-free, Nut allergy"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="accessibility-needs"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Optional Accessibility or Mobility Needs
              </label>
              <input
                id="accessibility-needs"
                type="text"
                value={activeDraft.accessibilityNeeds}
                onChange={(e) =>
                  updateActiveDraft({ accessibilityNeeds: e.target.value })
                }
                placeholder="e.g. Avoid steep stairs, wheelchair friendly"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Additional Free-Text Preferences */}
        <div className="mt-8">
          <label
            htmlFor="special-instructions"
            className="block text-xs font-bold uppercase tracking-wider text-muted mb-2"
          >
            Anything special you&apos;d like us to include?
          </label>
          <textarea
            id="special-instructions"
            rows={3}
            value={activeDraft.specialInstructions}
            onChange={(e) =>
              updateActiveDraft({ specialInstructions: e.target.value })
            }
            placeholder="I love quiet beaches and want to avoid crowded tourist places."
            className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm text-heading placeholder:text-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/create-trip/dates")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-heading hover:bg-sand/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <span>Continue to Budget</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
