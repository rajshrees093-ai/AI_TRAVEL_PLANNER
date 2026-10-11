"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
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
import { cn, formatCurrency } from "@/lib/utils";

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

  // Preliminary allocation percentages
  const allocations = [
    {
      label: "Accommodation",
      pct: activeDraft.includedExpenses.includes("Accommodation") ? 38 : 0,
      color: "bg-primary",
    },
    {
      label: "Food",
      pct: activeDraft.includedExpenses.includes("Food") ? 24 : 0,
      color: "bg-accent",
    },
    {
      label: "Local transport",
      pct: activeDraft.includedExpenses.includes("Local transport") ? 16 : 0,
      color: "bg-warning",
    },
    {
      label: "Activities",
      pct: activeDraft.includedExpenses.includes("Activities") ? 14 : 0,
      color: "bg-success",
    },
    {
      label: "Emergency buffer",
      pct: 8,
      color: "bg-slate-400",
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
        { label: activeDraft.destinationName || "Trip", href: "/create-trip/destination" },
        { label: "Budget Planner" },
      ]}
    >
      <WizardProgressStepper currentStep={4} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Let&apos;s Make Every Rupee Count.
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1.5">
            An unforgettable journey doesn&apos;t have to exceed your budget.
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

        {/* Budget Entry Card */}
        <div className="mt-7 bg-background border border-border rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="inline-flex rounded-xl bg-surface border border-border p-1">
              <button
                type="button"
                onClick={() => updateActiveDraft({ budgetMode: "TOTAL" })}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  activeDraft.budgetMode === "TOTAL"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-heading"
                )}
              >
                Total Trip Budget
              </button>
              <button
                type="button"
                onClick={() => updateActiveDraft({ budgetMode: "PER_PERSON" })}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  activeDraft.budgetMode === "PER_PERSON"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-heading"
                )}
              >
                Per-Person Budget
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="currency-select"
                className="text-xs font-semibold text-muted"
              >
                Currency:
              </label>
              <select
                id="currency-select"
                value={activeDraft.currency}
                onChange={(e) =>
                  updateActiveDraft({ currency: e.target.value })
                }
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-xs font-bold text-heading"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                {activeDraft.budgetMode === "TOTAL"
                  ? "Selected Total Trip Budget"
                  : "Selected Per-Person Budget"}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Wallet className="w-7 h-7 text-primary shrink-0" />
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
                  className="text-3xl sm:text-4xl font-heading font-extrabold text-heading bg-surface border border-border rounded-2xl px-4 py-2 w-full max-w-xs focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-xs text-muted mt-2">
                Total for {activeDraft.travelers}{" "}
                {activeDraft.travelers === 1 ? "traveler" : "travelers"}:{" "}
                <strong className="text-heading">
                  {formatCurrency(totalTripBudget, activeDraft.currency)}
                </strong>{" "}
                ({formatCurrency(perPersonBudget, activeDraft.currency)} /
                person)
              </p>
            </div>

            <div>
              <label
                htmlFor="budget-slider"
                className="block text-xs font-semibold text-muted mb-2"
              >
                Interactive Budget Slider
              </label>
              <input
                id="budget-slider"
                type="range"
                min={5000}
                max={300000}
                step={2500}
                value={Math.min(300000, activeDraft.budgetAmount)}
                onChange={(e) =>
                  updateActiveDraft({ budgetAmount: Number(e.target.value) })
                }
                className="w-full accent-primary h-2 bg-border rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-muted mt-1.5">
                <span>{formatCurrency(5000, activeDraft.currency)}</span>
                <span>{formatCurrency(75000, activeDraft.currency)}</span>
                <span>{formatCurrency(150000, activeDraft.currency)}</span>
                <span>{formatCurrency(300000, activeDraft.currency)}+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Restrictive Budget Warning (Non-blocking per specification) */}
        {isBudgetRestrictive && (
          <div
            role="status"
            className="mt-5 p-4 rounded-2xl bg-warning/15 border border-warning/40 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-heading">
                Heads up: This budget is relatively tight for{" "}
                {activeDraft.durationDays} days in{" "}
                {activeDraft.destinationName || "this destination"} (
                {activeDraft.travelTier} style).
              </p>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Typical {activeDraft.travelTier.toLowerCase()} trips for{" "}
                {activeDraft.travelers} travelers average around{" "}
                <strong>
                  {formatCurrency(recommendedMinTotal, activeDraft.currency)}
                </strong>
                . You can still continue—RoamWise will prioritize free natural
                attractions and budget-friendly cafés.
              </p>
            </div>
          </div>
        )}

        {/* Economy, Comfort, or Premium Travel Style */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Travel Comfort Style
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TIER_OPTIONS.map((item) => {
              const selected = activeDraft.travelTier === item.tier;
              return (
                <button
                  key={item.tier}
                  type="button"
                  onClick={() => updateActiveDraft({ travelTier: item.tier })}
                  className={cn(
                    "p-5 rounded-2xl border-2 text-left transition-all",
                    selected
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-heading font-bold text-heading">
                      {item.tier}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sand text-heading">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Coverage Categories */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Which Expenses Are Included in This Budget?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {EXPENSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const selected = activeDraft.includedExpenses.includes(cat.label);
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => toggleExpenseCategory(cat.label)}
                  className={cn(
                    "p-3.5 rounded-xl border-2 text-left flex items-center justify-between gap-2 transition-all",
                    selected
                      ? "border-primary bg-primary/10 text-heading"
                      : "border-border bg-background text-muted hover:text-heading"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-semibold leading-tight">
                      {cat.label}
                    </span>
                  </div>
                  {selected && (
                    <Check className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preliminary Budget Allocation Preview */}
        <div className="mt-8 bg-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-heading font-bold text-heading">
                Preliminary Budget Allocation Preview
              </h3>
              <p className="text-[11px] text-muted">
                Preliminary estimates only — exact activity & dining estimates
                are calculated once your itinerary is generated.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sand text-heading text-[11px] font-semibold">
              Preliminary Estimate
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3.5 w-full rounded-full overflow-hidden flex bg-border my-4">
            {normalizedAllocations.map((seg) =>
              seg.normalizedPct > 0 ? (
                <div
                  key={seg.label}
                  className={cn("h-full transition-all", seg.color)}
                  style={{ width: `${seg.normalizedPct}%` }}
                  title={`${seg.label}: ${seg.normalizedPct}%`}
                />
              ) : null
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {normalizedAllocations.map((seg) => (
              <div
                key={seg.label}
                className="bg-surface border border-border rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn("w-2.5 h-2.5 rounded-full shrink-0", seg.color)}
                  />
                  <span className="text-xs font-medium text-muted truncate">
                    {seg.label}
                  </span>
                </div>
                <p className="text-sm font-heading font-bold text-heading mt-1">
                  {formatCurrency(seg.amount, activeDraft.currency)}
                </p>
                <p className="text-[11px] text-muted">{seg.normalizedPct}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/create-trip/preferences")}
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
            <span>Review Trip Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
