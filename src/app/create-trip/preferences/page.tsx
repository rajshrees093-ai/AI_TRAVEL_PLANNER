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
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { preferencesStepSchema } from "@/lib/validations";
import { FoodPreference, TravelPace } from "@/lib/types";

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
        {
          label: activeDraft.destinationName || "Trip",
          href: "/create-trip/destination",
        },
        { label: "Travel Preferences" },
      ]}
    >
      <div className="wizard-page">
        <WizardProgressStepper currentStep={3} />

        <section className="wizard-panel">
          {errorMsg && (
            <div role="alert" className="auth-error" style={{ marginBottom: "18px" }}>
              {errorMsg}
            </div>
          )}

          <div className="preferences-form">
            <div>
              <div className="wizard-subhead">
                <h3>Select Your Travel Interests</h3>
                <span>{activeDraft.interests.length} selected</span>
              </div>
              <div className="interest-grid">
                {INTEREST_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const selected = activeDraft.interests.includes(item.label);
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`interest-card ${selected ? "selected" : ""}`}
                      onClick={() => toggleInterest(item.label)}
                    >
                      <span className="interest-icon">
                        <Icon className="w-4 h-4" />
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="wizard-subhead">
                <h3>Travel Pace</h3>
                <span>Daily rhythm</span>
              </div>
              <div className="pace-row">
                {PACE_OPTIONS.map((opt) => {
                  const selected = activeDraft.travelPace === opt.pace;
                  return (
                    <button
                      key={opt.pace}
                      type="button"
                      className={`pace-card ${selected ? "selected" : ""}`}
                      onClick={() => updateActiveDraft({ travelPace: opt.pace })}
                    >
                      <strong>{opt.pace}</strong>
                      <p>{opt.desc}</p>
                      <small style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                        {opt.detail}
                      </small>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="wizard-subhead">
                <h3>Food Preferences</h3>
                <span>Dining recommendations</span>
              </div>
              <div className="choice-row">
                {FOOD_OPTIONS.map((food) => {
                  const selected = activeDraft.foodPreference === food;
                  return (
                    <button
                      key={food}
                      type="button"
                      className={`choice-card ${selected ? "selected" : ""}`}
                      onClick={() => updateActiveDraft({ foodPreference: food })}
                    >
                      <strong>{food}</strong>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-grid preferences-controls">
              <label className="form-field">
                <span>Optional dietary restrictions / allergies</span>
                <input
                  id="dietary-restrictions"
                  type="text"
                  value={activeDraft.dietaryRestrictions}
                  onChange={(e) =>
                    updateActiveDraft({ dietaryRestrictions: e.target.value })
                  }
                  placeholder="e.g. Jain, Gluten-free, Nut allergy"
                />
              </label>

              <label className="form-field">
                <span>Optional accessibility or mobility needs</span>
                <input
                  id="accessibility-needs"
                  type="text"
                  value={activeDraft.accessibilityNeeds}
                  onChange={(e) =>
                    updateActiveDraft({ accessibilityNeeds: e.target.value })
                  }
                  placeholder="e.g. Avoid steep stairs, wheelchair friendly"
                />
              </label>

              <label className="form-field full-span">
                <span>Anything special you’d like us to include?</span>
                <textarea
                  id="special-instructions"
                  rows={3}
                  value={activeDraft.specialInstructions}
                  onChange={(e) =>
                    updateActiveDraft({ specialInstructions: e.target.value })
                  }
                  placeholder="I love quiet beaches and want to avoid crowded tourist places."
                />
              </label>
            </div>
          </div>
        </section>

        <div className="wizard-footer">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => router.push("/create-trip/dates")}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={handleContinue}
          >
            Continue to Budget <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
