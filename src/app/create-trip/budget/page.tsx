"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Utensils,
  Compass,
  Car,
  Plane,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { findDestinationInfo } from "@/lib/destinations-catalog";
import { budgetStepSchema } from "@/lib/validations";
import { TravelStyleTier } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const EXPENSE_CATEGORIES = [
  { label: "Accommodation", icon: BedDouble },
  { label: "Food", icon: Utensils },
  { label: "Activities", icon: Compass },
  { label: "Local transport", icon: Car },
  { label: "Travel to the destination", icon: Plane },
];

const TIER_OPTIONS: {
  tier: TravelStyleTier;
  desc: string;
  badge: string;
}[] = [
  {
    tier: "Economy",
    desc: "Smart boutique stays, local transit & authentic street/café dining.",
    badge: "Value Focused",
  },
  {
    tier: "Comfort",
    desc: "Well-rated hotels, private transfers & curated regional restaurants.",
    badge: "Most Popular",
  },
  {
    tier: "Premium",
    desc: "Luxury heritage resorts, private chauffeurs & signature fine dining.",
    badge: "Elevated",
  },
];

export default function BudgetSelectionPage() {
  const router = useRouter();
  const { activeDraft, updateActiveDraft } = useRoamWise();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const destInfo = findDestinationInfo(
    activeDraft.destinationName || "Manali"
  );

  const totalTripBudget =
    activeDraft.budgetMode === "PER_PERSON"
      ? activeDraft.budgetAmount * activeDraft.travelers
      : activeDraft.budgetAmount;

  const perPersonBudget = Math.round(
    totalTripBudget / Math.max(1, activeDraft.travelers)
  );

  const recommendedMinTotal =
    destInfo.suggestedMinDailyPerPersonINR *
    Math.max(1, activeDraft.durationDays) *
    Math.max(1, activeDraft.travelers) *
    (activeDraft.travelTier === "Economy"
      ? 0.7
      : activeDraft.travelTier === "Premium"
      ? 1.4
      : 1.0);

  const isBudgetRestrictive = totalTripBudget < recommendedMinTotal * 0.78;

  const allocations = [
    {
      label: "Accommodation",
      pct: activeDraft.includedExpenses.includes("Accommodation") ? 38 : 0,
    },
    {
      label: "Food",
      pct: activeDraft.includedExpenses.includes("Food") ? 24 : 0,
    },
    {
      label: "Local transport",
      pct: activeDraft.includedExpenses.includes("Local transport") ? 16 : 0,
    },
    {
      label: "Activities",
      pct: activeDraft.includedExpenses.includes("Activities") ? 14 : 0,
    },
    {
      label: "Emergency buffer",
      pct: 8,
    },
  ];
  const rawPctSum = allocations.reduce((s, a) => s + a.pct, 0) || 100;
  const normalizedAllocations = allocations.map((a) => ({
    ...a,
    normalizedPct: Math.round((a.pct / rawPctSum) * 100),
    amount: Math.round((a.pct / rawPctSum) * totalTripBudget),
  }));

  const toggleExpenseCategory = (label: string) => {
    const exists = activeDraft.includedExpenses.includes(label);
    const next = exists
      ? activeDraft.includedExpenses.filter((x) => x !== label)
      : [...activeDraft.includedExpenses, label];
    updateActiveDraft({ includedExpenses: next });
  };

  const handleContinue = () => {
    setErrorMsg(null);
    const parsed = budgetStepSchema.safeParse({
      budgetAmount: Number(activeDraft.budgetAmount),
      budgetMode: activeDraft.budgetMode,
      currency: activeDraft.currency,
      travelTier: activeDraft.travelTier,
      includedExpenses: activeDraft.includedExpenses,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message ||
          "Please configure your budget and included expense categories."
      );
      return;
    }

    updateActiveDraft({ currentStep: 5 });
    router.push("/create-trip/review");
  };

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 4 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: activeDraft.destinationName || "Trip",
          href: "/create-trip/destination",
        },
        { label: "Budget Planner" },
      ]}
    >
      <div className="wizard-page">
        <WizardProgressStepper currentStep={4} />

        <section className="wizard-panel">
          {errorMsg && (
            <div role="alert" className="auth-error" style={{ marginBottom: "18px" }}>
              {errorMsg}
            </div>
          )}

          <div className="budget-planner">
            <div className="budget-input-panel">
              <div className="budget-mode-row">
                <div className="place-categories">
                  <button
                    type="button"
                    className={`filter-chip ${
                      activeDraft.budgetMode === "TOTAL" ? "active" : ""
                    }`}
                    onClick={() => updateActiveDraft({ budgetMode: "TOTAL" })}
                  >
                    Total Trip Budget
                  </button>
                  <button
                    type="button"
                    className={`filter-chip ${
                      activeDraft.budgetMode === "PER_PERSON" ? "active" : ""
                    }`}
                    onClick={() =>
                      updateActiveDraft({ budgetMode: "PER_PERSON" })
                    }
                  >
                    Per-Person Budget
                  </button>
                </div>

                <select
                  id="currency-select"
                  value={activeDraft.currency}
                  onChange={(e) =>
                    updateActiveDraft({ currency: e.target.value })
                  }
                  style={{
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    padding: "8px 12px",
                    background: "var(--paper)",
                    fontWeight: 700,
                  }}
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <label className="budget-amount-input">
                <span>{activeDraft.currency}</span>
                <input
                  type="number"
                  min={2000}
                  step={1000}
                  value={activeDraft.budgetAmount}
                  onChange={(e) =>
                    updateActiveDraft({
                      budgetAmount: Math.max(0, Number(e.target.value)),
                    })
                  }
                  aria-label="Budget amount"
                />
              </label>

              <input
                id="budget-slider"
                type="range"
                className="budget-slider"
                min={5000}
                max={300000}
                step={2500}
                value={Math.min(300000, activeDraft.budgetAmount)}
                onChange={(e) =>
                  updateActiveDraft({ budgetAmount: Number(e.target.value) })
                }
              />

              <div className="per-person-note">
                <span>
                  Total for {activeDraft.travelers}{" "}
                  {activeDraft.travelers === 1 ? "traveler" : "travelers"}:{" "}
                  <strong>
                    {formatCurrency(totalTripBudget, activeDraft.currency)}
                  </strong>
                </span>
                <strong>
                  {formatCurrency(perPersonBudget, activeDraft.currency)} / person
                </strong>
              </div>

              <div>
                <div className="wizard-subhead">
                  <h3>Travel Comfort Style</h3>
                  <span>{activeDraft.travelTier}</span>
                </div>
                <div className="pace-row">
                  {TIER_OPTIONS.map((item) => {
                    const selected = activeDraft.travelTier === item.tier;
                    return (
                      <button
                        key={item.tier}
                        type="button"
                        className={`pace-card ${selected ? "selected" : ""}`}
                        onClick={() =>
                          updateActiveDraft({ travelTier: item.tier })
                        }
                      >
                        <strong>{item.tier}</strong>
                        <p>{item.desc}</p>
                        <small style={{ color: "var(--ocean)", fontWeight: 700 }}>
                          {item.badge}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="expense-includes">
                <div className="wizard-subhead">
                  <h3>Which Expenses Are Included in This Budget?</h3>
                </div>
                <div className="include-grid">
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const selected = activeDraft.includedExpenses.includes(
                      cat.label
                    );
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        className={`include-chip ${selected ? "selected" : ""}`}
                        onClick={() => toggleExpenseCategory(cat.label)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{cat.label}</span>
                        {selected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="budget-estimate-card">
              <div>
                <span className="eyebrow">Preliminary Estimate</span>
                <h3>Preliminary Budget Allocation Preview</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.86rem", marginTop: "4px" }}>
                  Exact activity & dining estimates are calculated once your
                  itinerary is generated.
                </p>
              </div>

              <div className="budget-split">
                {normalizedAllocations.map((seg) => (
                  <div key={seg.label} className="split-row">
                    <div>
                      <span>{seg.label}</span>
                      <strong>
                        {formatCurrency(seg.amount, activeDraft.currency)} (
                        {seg.normalizedPct}%)
                      </strong>
                    </div>
                    <div className="split-bar">
                      <span style={{ width: `${seg.normalizedPct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {isBudgetRestrictive && (
                <div role="status" className="budget-warning">
                  <AlertTriangle className="w-5 h-5" />
                  <div>
                    <strong>
                      Heads up: This budget is relatively tight for{" "}
                      {activeDraft.durationDays} days in{" "}
                      {activeDraft.destinationName || "this destination"} (
                      {activeDraft.travelTier} style).
                    </strong>
                    <p>
                      Typical {activeDraft.travelTier.toLowerCase()} trips for{" "}
                      {activeDraft.travelers} travelers average around{" "}
                      {formatCurrency(
                        recommendedMinTotal,
                        activeDraft.currency
                      )}
                      . You can still continue—RouteBloom will prioritize free
                      natural attractions and budget-friendly cafés.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="wizard-footer">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => router.push("/create-trip/preferences")}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={handleContinue}
          >
            Review Trip Details <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
