"use client";

import React, { useMemo, useState } from "react";
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
import { formatCurrency } from "@/lib/utils";

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

  const maxDailyTotal = useMemo(
    () => Math.max(1, ...dailyChartData.map((d) => d.Total)),
    [dailyChartData]
  );

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
      title={
        trip ? `${trip.destinationName} — Budget Analysis` : "Budget Analysis"
      }
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: trip?.destinationName || "Trip",
          href: `/trips/${params.tripId}`,
        },
        { label: "Budget Analysis" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && (
          <div className="trip-detail-panel">
            {/* Over-Budget Warning Banner */}
            {isOverBudget && (
              <div role="alert" className="budget-warning">
                <AlertTriangle className="w-5 h-5" />
                <div style={{ flex: 1 }}>
                  <strong>
                    Your estimated trip cost exceeds your selected budget.
                  </strong>
                  <p>
                    Planned estimates are{" "}
                    {formatCurrency(Math.abs(remainingBudget), trip.currency)}{" "}
                    above your {formatCurrency(trip.budget, trip.currency)}{" "}
                    target. Let RouteBloom replace high-cost stops with verified
                    free or budget-friendly alternatives.
                  </p>
                </div>
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={handleTriggerBudgetRescue}
                >
                  <Sparkles className="w-4 h-4" /> Find Cheaper Alternatives
                </button>
              </div>
            )}

            {/* AI Budget Rescue Log */}
            {rescueLog.length > 0 && (
              <div className="selected-place" style={{ flexDirection: "column", alignItems: "flex-start" }}>
                <strong style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--sage)" }}>
                  <CheckCircle2 className="w-4 h-4" /> AI Budget Rescue Applied:
                </strong>
                <ul style={{ margin: "6px 0 0 18px", fontSize: "0.86rem", color: "var(--ink)" }}>
                  {rescueLog.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4 Financial Summary Cards */}
            <div className="budget-summary-cards">
              <div className="stat-card">
                <span className="stat-icon">
                  <Wallet className="w-4 h-4" />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Total User Budget</span>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setNewTotalBudgetInput(trip.budget);
                        setEditingTotalBudget((e) => !e);
                      }}
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  {editingTotalBudget ? (
                    <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                      <input
                        type="number"
                        value={newTotalBudgetInput}
                        onChange={(e) =>
                          setNewTotalBudgetInput(Number(e.target.value))
                        }
                        style={{
                          width: "120px",
                          padding: "4px 8px",
                          borderRadius: "8px",
                          border: "1px solid var(--line)",
                        }}
                      />
                      <button
                        type="button"
                        className="button button-primary button-sm"
                        onClick={handleSaveUserBudgetCap}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <strong>{formatCurrency(trip.budget, trip.currency)}</strong>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">
                  <Wallet className="w-4 h-4" />
                </span>
                <div>
                  <span>Estimated Planned Cost</span>
                  <strong>
                    {formatCurrency(totalPlannedCost, trip.currency)}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <div>
                  <span>Estimated Remaining Budget</span>
                  <strong
                    style={{
                      color: isOverBudget ? "var(--danger)" : "var(--sage)",
                    }}
                  >
                    {isOverBudget ? "-" : "+"}
                    {formatCurrency(Math.abs(remainingBudget), trip.currency)}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <span className="stat-icon">
                  <Users className="w-4 h-4" />
                </span>
                <div>
                  <span>Estimated Per-Person Cost</span>
                  <strong>{formatCurrency(perPersonCost, trip.currency)}</strong>
                </div>
              </div>
            </div>

            {/* Category & Daily Charts */}
            <div className="budget-charts">
              <div className="chart-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span className="eyebrow">Category Allocation</span>
                    <h3>Spending by Category</h3>
                  </div>
                  <span className="pill-badge">Estimated Only</span>
                </div>

                <div className="budget-split">
                  {categoryBreakdown.map((cat) => (
                    <div key={cat.name} className="split-row">
                      <div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <i
                            style={{
                              width: "10px",
                              height: "10px",
                              borderRadius: "999px",
                              background: cat.color,
                              display: "inline-block",
                            }}
                          />
                          {cat.name}
                        </span>
                        <strong>
                          {formatCurrency(cat.value, trip.currency)} ({cat.pct}%)
                        </strong>
                      </div>
                      <div className="split-bar">
                        <span
                          style={{
                            width: `${cat.pct}%`,
                            background: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="chart-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span className="eyebrow">Daily Distribution</span>
                    <h3>Daily Estimated Expenses</h3>
                  </div>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={handleTriggerBudgetRescue}
                  >
                    <TrendingDown className="w-3.5 h-3.5" /> Optimize Costs
                  </button>
                </div>

                <div className="daily-bars">
                  {dailyChartData.map((d) => {
                    const heightPct = Math.max(
                      18,
                      Math.round((d.Total / maxDailyTotal) * 100)
                    );
                    return (
                      <div key={d.day} className="daily-bar-item">
                        <div className="daily-bar-track">
                          <div
                            className="daily-bar-fill"
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <strong>{d.day}</strong>
                        <span>{formatCurrency(d.Total, trip.currency)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Expense Table */}
            <div className="expense-table-wrap">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Line-Item Estimates</span>
                  <h2>Detailed Expense Breakdown</h2>
                </div>
                <span className="pill-badge">
                  Total: {formatCurrency(totalPlannedCost, trip.currency)}
                </span>
              </div>

              <div className="expense-table">
                {trip.budgetItems.map((item) => {
                  const isEditing = editingItemId === item.id;
                  return (
                    <div key={item.id} className="expense-row">
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          {item.category} •{" "}
                          {item.dayNumber
                            ? `Day ${item.dayNumber}`
                            : "Trip-wide"}{" "}
                          • {item.sourceLabel}
                        </span>
                      </div>

                      <div>
                        {isEditing ? (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <input
                              type="number"
                              min={0}
                              value={editAmount}
                              onChange={(e) =>
                                setEditAmount(Number(e.target.value))
                              }
                            />
                            <button
                              type="button"
                              className="button button-primary button-sm"
                              onClick={() => handleSaveItemEstimate(item.id)}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="button button-quiet button-sm"
                            onClick={() => {
                              setEditingItemId(item.id);
                              setEditAmount(item.estimatedAmount);
                            }}
                            title="Click to adjust estimate"
                          >
                            <strong>
                              {formatCurrency(
                                item.estimatedAmount,
                                trip.currency
                              )}
                            </strong>
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
