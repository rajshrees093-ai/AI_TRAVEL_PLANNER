"use client";

import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Edit3,
  Check,
  TrendingDown,
  Users,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { applyAIBudgetRescue } from "@/lib/ai-engine";
import { cn, formatCurrency } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Accommodation: "#087F8C",
  Food: "#FF8066",
  Transport: "#E8A33D",
  Activities: "#22946B",
  Other: "#6366F1",
  Contingency: "#94A3B8",
};

export default function TripBudgetAnalysisPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);
  const [rescueLog, setRescueLog] = useState<string[]>([]);
  const [editingTotalBudget, setEditingTotalBudget] = useState(false);
  const [newTotalBudgetInput, setNewTotalBudgetInput] = useState<number>(
    trip?.budget || 45000
  );

  const totalPlannedCost = useMemo(
    () =>
      trip
        ? trip.budgetItems.reduce((sum, item) => sum + item.estimatedAmount, 0)
        : 0,
    [trip]
  );

  const remainingBudget = trip ? trip.budget - totalPlannedCost : 0;
  const perPersonCost = trip
    ? Math.round(totalPlannedCost / Math.max(1, trip.travelers))
    : 0;
  const isOverBudget = remainingBudget < 0;

  // Group by category for Donut Chart & Allocation Progress Bars
  const categoryBreakdown = useMemo(() => {
    if (!trip) return [];
    const map = new Map<string, number>();
    trip.budgetItems.forEach((item) => {
      map.set(
        item.category,
        (map.get(item.category) || 0) + item.estimatedAmount
      );
    });
    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value: Math.round(value),
      pct:
        totalPlannedCost > 0
          ? Math.round((value / totalPlannedCost) * 100)
          : 0,
      color: CATEGORY_COLORS[name] || "#087F8C",
    }));
  }, [trip, totalPlannedCost]);

  // Daily estimated expenses for Bar Chart
  const dailyChartData = useMemo(() => {
    if (!trip) return [];
    const nonDaySpecificTotal = trip.budgetItems
      .filter((i) => !i.dayNumber)
      .reduce((s, i) => s + i.estimatedAmount, 0);
    const dailyBaseShare = Math.round(
      nonDaySpecificTotal / Math.max(1, trip.durationDays)
    );

    return trip.days.map((day) => {
      const daySpecific = trip.budgetItems
        .filter((i) => i.dayNumber === day.dayNumber)
        .reduce((s, i) => s + i.estimatedAmount, 0);
      return {
        day: `Day ${day.dayNumber}`,
        ActivitiesAndDining: Math.round(daySpecific),
        StaysAndTransitShare: dailyBaseShare,
        Total: Math.round(daySpecific + dailyBaseShare),
      };
    });
  }, [trip]);

  const handleSaveItemEstimate = async (itemId: string) => {
    if (!trip) return;
    const updatedItems = trip.budgetItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            estimatedAmount: Math.max(0, Number(editAmount)),
            sourceLabel: "User Adjusted" as const,
          }
        : item
    );
    setEditingItemId(null);
    await saveOrUpdateTrip(
      {
        ...trip,
        budgetItems: updatedItems,
      },
      "Updated expense estimate"
    );
  };

  const handleSaveUserBudgetCap = async () => {
    if (!trip) return;
    setEditingTotalBudget(false);
    await saveOrUpdateTrip(
      {
        ...trip,
        budget: Math.max(1000, Number(newTotalBudgetInput)),
      },
      "Updated target trip budget"
    );
  };

  const handleTriggerBudgetRescue = async () => {
    if (!trip) return;
    const { updatedTrip, rescuedChanges, savedAmount } =
      applyAIBudgetRescue(trip);
    setRescueLog(rescuedChanges);
    await saveOrUpdateTrip(
      updatedTrip,
      `AI Budget Rescue saved ${formatCurrency(savedAmount, trip.currency)}!`
    );
  };

  return (
    <DashboardWorkspaceLayout
      title={trip ? `${trip.destinationName} — Budget Analysis` : "Budget Analysis"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: trip?.destinationName || "Trip", href: `/trips/${params.tripId}` },
        { label: "Budget Analysis" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="space-y-8">
            {/* Over-Budget Warning Banner + Working "Find Cheaper Alternatives" Button */}
            {isOverBudget && (
              <div
                role="alert"
                className="p-5 rounded-2xl bg-warning/15 border-2 border-warning/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-soft"
              >
                <div className="flex items-start gap-3.5">
                  <AlertTriangle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-base font-heading font-bold text-heading">
                      Your estimated trip cost exceeds your selected budget.
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                      Planned estimates are{" "}
                      <strong>
                        {formatCurrency(
                          Math.abs(remainingBudget),
                          trip.currency
                        )}
                      </strong>{" "}
                      above your {formatCurrency(trip.budget, trip.currency)}{" "}
                      target. Let RoamWise replace high-cost stops with verified
                      free or budget-friendly alternatives.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerBudgetRescue}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shrink-0 shadow-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Find Cheaper Alternatives</span>
                </button>
              </div>
            )}

            {/* AI Budget Rescue Log if triggered */}
            {rescueLog.length > 0 && (
              <div className="p-5 rounded-2xl bg-success/10 border border-success/30 space-y-2">
                <div className="flex items-center gap-2 text-success font-heading font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI Budget Rescue Applied:</span>
                </div>
                <ul className="list-disc list-inside text-xs text-heading space-y-1">
                  {rescueLog.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4 Top Financial Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total User Budget */}
              <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">
                    Total User Budget
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTotalBudgetInput(trip.budget);
                      setEditingTotalBudget((e) => !e);
                    }}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
                {editingTotalBudget ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="number"
                      value={newTotalBudgetInput}
                      onChange={(e) =>
                        setNewTotalBudgetInput(Number(e.target.value))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-sm font-bold text-heading"
                    />
                    <button
                      type="button"
                      onClick={handleSaveUserBudgetCap}
                      className="p-1.5 rounded-lg bg-primary text-white"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-2xl font-heading font-extrabold text-heading mt-1.5">
                    {formatCurrency(trip.budget, trip.currency)}
                  </p>
                )}
                <p className="text-[11px] text-muted mt-1">
                  Selected target cap ({trip.travelTier} tier)
                </p>
              </div>

              {/* Card 2: Estimated Planned Cost */}
              <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft">
                <span className="text-xs font-semibold text-muted block">
                  Estimated Planned Cost
                </span>
                <p className="text-2xl font-heading font-extrabold text-heading mt-1.5">
                  {formatCurrency(totalPlannedCost, trip.currency)}
                </p>
                <p className="text-[11px] text-muted mt-1">
                  Preliminary estimate across {trip.budgetItems.length} line
                  items
                </p>
              </div>

              {/* Card 3: Estimated Remaining Budget */}
              <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft">
                <span className="text-xs font-semibold text-muted block">
                  Estimated Remaining Budget
                </span>
                <p
                  className={cn(
                    "text-2xl font-heading font-extrabold mt-1.5",
                    isOverBudget ? "text-warning" : "text-success"
                  )}
                >
                  {isOverBudget ? "-" : "+"}
                  {formatCurrency(Math.abs(remainingBudget), trip.currency)}
                </p>
                <p className="text-[11px] text-muted mt-1">
                  {isOverBudget
                    ? "Over target — use AI Budget Rescue"
                    : "Within your selected budget"}
                </p>
              </div>

              {/* Card 4: Estimated Per-Person Cost */}
              <div className="bg-surface border border-border rounded-2xl p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted">
                    Estimated Per-Person Cost
                  </span>
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-heading font-extrabold text-heading mt-1.5">
                  {formatCurrency(perPersonCost, trip.currency)}
                </p>
                <p className="text-[11px] text-muted mt-1">
                  Split across {trip.travelers}{" "}
                  {trip.travelers === 1 ? "traveler" : "travelers"}
                </p>
              </div>
            </div>

            {/* Recharts Visualizations: Donut Chart & Daily Bar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donut Chart by Category */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-heading">
                      Spending by Category
                    </h3>
                    <p className="text-xs text-muted">
                      Estimated distribution across stays, dining, transit, and
                      activities.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sand text-heading text-[10px] font-bold">
                    Estimated Only
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                      >
                        {categoryBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) =>
                          formatCurrency(Number(val), trip.currency)
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Allocation Progress Bars */}
                <div className="space-y-3 mt-4">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-heading flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          {cat.name}
                        </span>
                        <span className="text-muted">
                          <strong className="text-heading">
                            {formatCurrency(cat.value, trip.currency)}
                          </strong>{" "}
                          ({cat.pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.pct}%`,
                            backgroundColor: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart Showing Daily Estimated Expenses */}
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-heading font-bold text-heading">
                        Daily Estimated Expenses
                      </h3>
                      <p className="text-xs text-muted">
                        Comparing daily activities & dining against evenly
                        allocated stay & transit costs.
                      </p>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(100,116,139,0.18)"
                        />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(val: any) =>
                            formatCurrency(Number(val), trip.currency)
                          }
                        />
                        <Bar
                          dataKey="ActivitiesAndDining"
                          name="Day Sights & Dining"
                          stackId="a"
                          fill="#087F8C"
                          radius={[0, 0, 4, 4]}
                        />
                        <Bar
                          dataKey="StaysAndTransitShare"
                          name="Stays & Transit Share"
                          stackId="a"
                          fill="#FF8066"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-background border border-border flex items-center justify-between">
                  <div className="text-xs">
                    <p className="font-semibold text-heading">
                      Want to trim daily spending?
                    </p>
                    <p className="text-muted">
                      AI Budget Rescue can optimize high-cost items in one
                      click.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerBudgetRescue}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sand hover:bg-primary hover:text-white text-heading text-xs font-semibold transition-colors shrink-0"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Optimize Costs</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Detailed Expense Table with Inline Editing */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft">
              <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-heading font-bold text-heading">
                    Detailed Expense Breakdown
                  </h3>
                  <p className="text-xs text-muted">
                    All figures are estimates—not confirmed booking prices.
                    Click any amount to customize your estimate.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Wallet className="w-4 h-4" />
                  Total: {formatCurrency(totalPlannedCost, trip.currency)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted">
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Expense Item</th>
                      <th className="py-3.5 px-4">Day</th>
                      <th className="py-3.5 px-4">Pricing Source Label</th>
                      <th className="py-3.5 px-4 text-right">
                        Estimated Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-xs sm:text-sm">
                    {trip.budgetItems.map((item) => {
                      const isEditing = editingItemId === item.id;
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-sand/25 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-semibold text-heading">
                            <span className="inline-flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{
                                  backgroundColor:
                                    CATEGORY_COLORS[item.category] || "#087F8C",
                                }}
                              />
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-heading font-medium">
                            {item.title}
                          </td>
                          <td className="py-3.5 px-4 text-muted">
                            {item.dayNumber ? `Day ${item.dayNumber}` : "Trip-wide"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-background border border-border text-[11px] font-medium text-muted">
                              {item.sourceLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-heading font-bold text-heading">
                            {isEditing ? (
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  value={editAmount}
                                  onChange={(e) =>
                                    setEditAmount(Number(e.target.value))
                                  }
                                  className="w-24 px-2 py-1 rounded-lg bg-background border border-primary text-right text-xs font-bold"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSaveItemEstimate(item.id)
                                  }
                                  className="p-1 rounded-md bg-primary text-white"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingItemId(item.id);
                                  setEditAmount(item.estimatedAmount);
                                }}
                                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                                title="Click to adjust estimate"
                              >
                                <span>
                                  {formatCurrency(
                                    item.estimatedAmount,
                                    trip.currency
                                  )}
                                </span>
                                <Edit3 className="w-3 h-3 text-muted" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
