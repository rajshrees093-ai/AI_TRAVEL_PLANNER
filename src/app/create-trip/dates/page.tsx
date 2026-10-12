"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  User,
  Heart,
  UsersRound,
  Baby,
  ArrowLeft,
  ArrowRight,
  Plane,
  TrainFront,
  Car,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { datesStepSchema } from "@/lib/validations";
import { calculateDaysBetween } from "@/lib/utils";
import { TravelGroupType } from "@/lib/types";
import {
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  computeHometownToDestinationTransit,
  CityDirectoryEntry,
} from "@/lib/destinations-catalog";

const GROUP_TYPES: {
  type: TravelGroupType;
  label: string;
  desc: string;
  defaultCount: number;
  icon: React.ElementType;
}[] = [
  {
    type: "Solo",
    label: "Solo",
    desc: "Flexible pace and single-room estimates",
    defaultCount: 1,
    icon: User,
  },
  {
    type: "Couple",
    label: "Couple",
    desc: "Scenic spots, intimate stays, shared transfers",
    defaultCount: 2,
    icon: Heart,
  },
  {
    type: "Friends",
    label: "Friends",
    desc: "Social evenings, shared rides, group experiences",
    defaultCount: 4,
    icon: UsersRound,
  },
  {
    type: "Family",
    label: "Family",
    desc: "Comfort breaks, family-friendly timing and access",
    defaultCount: 4,
    icon: Baby,
  },
];

const SIGHTSEEING_WINDOWS = [
  "08:00 AM – 06:00 PM (Early Riser / Morning Darshan)",
  "09:00 AM – 07:00 PM (Standard Day)",
  "10:30 AM – 08:30 PM (Leisurely Mornings)",
];

const QUICK_HOMETOWNS = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Lucknow",
  "Jaipur",
  "London",
  "New York City",
  "Dubai",
  "Singapore",
];

export default function DatesAndTravelersPage() {
  const router = useRouter();
  const { activeDraft, updateActiveDraft } = useRoamWise();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showHometownDropdown, setShowHometownDropdown] = useState(false);
  const [hometownSuggestions, setHometownSuggestions] = useState<
    CityDirectoryEntry[]
  >(WORLDWIDE_CITIES_AND_HOMETOWNS.slice(0, 20));

  const duration = calculateDaysBetween(
    activeDraft.startDate,
    activeDraft.endDate
  );

  useEffect(() => {
    let active = true;
    const q = (activeDraft.startCity || "").trim();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/search?type=hometowns&q=${encodeURIComponent(q)}`
        );
        if (res.ok && active) {
          const data = await res.json();
          if (Array.isArray(data.hometowns)) {
            setHometownSuggestions(data.hometowns);
          }
        }
      } catch {
        // Local filter fallback
      }
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [activeDraft.startCity]);

  const transitPreview = useMemo(() => {
    return computeHometownToDestinationTransit(
      activeDraft.startCity || "New Delhi",
      activeDraft.destinationName || "Varanasi"
    );
  }, [activeDraft.startCity, activeDraft.destinationName]);

  const handleContinue = () => {
    setErrorMsg(null);
    const parsed = datesStepSchema.safeParse({
      startDate: activeDraft.startDate,
      endDate: activeDraft.endDate,
      startCity: activeDraft.startCity,
      travelers: Number(activeDraft.travelers),
      travelType: activeDraft.travelType,
      sightseeingWindow: activeDraft.sightseeingWindow,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message ||
          "Please verify your travel dates and traveler count."
      );
      return;
    }

    updateActiveDraft({
      durationDays: duration,
      currentStep: Math.max(activeDraft.currentStep, 3),
    });
    router.push("/create-trip/preferences");
  };

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 2 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        {
          label: activeDraft.destinationName || "Destination",
          href: "/create-trip/destination",
        },
        { label: "Hometown, Dates & Travelers" },
      ]}
    >
      <div className="wizard-page">
        <WizardProgressStepper currentStep={2} />

        <section className="wizard-panel">
          {errorMsg && (
            <div role="alert" className="auth-error" style={{ marginBottom: "18px" }}>
              {errorMsg}
            </div>
          )}

          <div className="form-grid">
            <label className="form-field">
              <span>Start date</span>
              <input
                id="start-date"
                type="date"
                value={activeDraft.startDate}
                onChange={(e) =>
                  updateActiveDraft({ startDate: e.target.value })
                }
              />
            </label>

            <label className="form-field">
              <span>End date</span>
              <input
                id="end-date"
                type="date"
                value={activeDraft.endDate}
                onChange={(e) => updateActiveDraft({ endDate: e.target.value })}
              />
            </label>

            <div className="form-field" style={{ position: "relative" }}>
              <label htmlFor="start-city">
                <span>Starting city / Hometown</span>
              </label>
              <input
                id="start-city"
                type="text"
                value={activeDraft.startCity}
                onFocus={() => setShowHometownDropdown(true)}
                onChange={(e) => {
                  updateActiveDraft({ startCity: e.target.value });
                  setShowHometownDropdown(true);
                }}
                placeholder="Type any hometown worldwide (e.g. New Delhi, Mumbai, London)..."
              />
              {showHometownDropdown && hometownSuggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: "76px",
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: "16px",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 30,
                    maxHeight: "220px",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 14px",
                      borderBottom: "1px solid var(--line)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                    }}
                  >
                    <span>Select Hometown</span>
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => setShowHometownDropdown(false)}
                    >
                      Done
                    </button>
                  </div>
                  {hometownSuggestions.map((city) => (
                    <button
                      key={city.placeId}
                      type="button"
                      onClick={() => {
                        updateActiveDraft({ startCity: city.name });
                        setShowHometownDropdown(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "none",
                        borderBottom: "1px solid var(--line)",
                        background: "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <MapPin className="w-3.5 h-3.5" />
                        <strong style={{ color: "var(--ink)", fontSize: "0.88rem" }}>
                          {city.name}
                        </strong>
                        <small style={{ color: "var(--muted)" }}>
                          {city.stateOrCountry}
                        </small>
                      </span>
                      <span className="text-button">Use</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="place-categories" style={{ marginTop: "6px" }}>
                {QUICK_HOMETOWNS.map((ht) => {
                  const isSelected =
                    activeDraft.startCity.toLowerCase() === ht.toLowerCase();
                  return (
                    <button
                      key={ht}
                      type="button"
                      className={`filter-chip ${isSelected ? "active" : ""}`}
                      onClick={() => {
                        updateActiveDraft({ startCity: ht });
                        setShowHometownDropdown(false);
                      }}
                    >
                      {ht}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="traveler-count">
                <span>Number of travelers</span>
              </label>
              <div className="number-control">
                <button
                  type="button"
                  onClick={() =>
                    updateActiveDraft({
                      travelers: Math.max(1, activeDraft.travelers - 1),
                    })
                  }
                >
                  −
                </button>
                <input
                  id="traveler-count"
                  type="number"
                  min={1}
                  max={30}
                  value={activeDraft.travelers}
                  onChange={(e) =>
                    updateActiveDraft({
                      travelers: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  style={{
                    width: "64px",
                    textAlign: "center",
                    border: "none",
                    background: "transparent",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateActiveDraft({
                      travelers: Math.min(30, activeDraft.travelers + 1),
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-field full-span">
              <span>Travel group type</span>
              <div className="choice-row">
                {GROUP_TYPES.map((g) => {
                  const Icon = g.icon;
                  const selected = activeDraft.travelType === g.type;
                  return (
                    <button
                      key={g.type}
                      type="button"
                      className={`choice-card ${selected ? "selected" : ""}`}
                      onClick={() =>
                        updateActiveDraft({
                          travelType: g.type,
                          travelers:
                            g.type === "Solo"
                              ? 1
                              : g.type === "Couple"
                              ? 2
                              : activeDraft.travelers < 2
                              ? g.defaultCount
                              : activeDraft.travelers,
                        })
                      }
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icon className="w-4 h-4" />
                        <strong>{g.label}</strong>
                      </div>
                      <span>{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="form-field">
              <span>Sightseeing window</span>
              <select
                value={activeDraft.sightseeingWindow}
                onChange={(e) =>
                  updateActiveDraft({ sightseeingWindow: e.target.value })
                }
              >
                {SIGHTSEEING_WINDOWS.map((win) => (
                  <option key={win} value={win}>
                    {win}
                  </option>
                ))}
              </select>
            </label>

            <div className="duration-note">
              <span>Calculated duration</span>
              <strong>
                {duration > 0
                  ? `${duration} ${duration === 1 ? "day" : "days"}`
                  : "Check dates"}
              </strong>
              <p>
                We’ll balance arrival, local exploration, and departure timing
                across {Math.max(1, duration)} days.
              </p>
            </div>

            {/* Live Hometown -> Destination Route & Transit Preview */}
            {activeDraft.startCity && (
              <div className="selected-place full-span" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <div>
                    <strong>
                      Hometown Route Connected: {transitPreview.originCity} →{" "}
                      {transitPreview.destinationName}
                    </strong>
                    <span>
                      ~{transitPreview.aerialDistanceKm.toLocaleString()} km air distance • Recommended:{" "}
                      {transitPreview.recommendedPrimaryMode}
                    </span>
                  </div>
                  <span className="pill-badge">Transit Preview</span>
                </div>
                <div className="choice-row" style={{ marginTop: "8px" }}>
                  <div className="choice-card">
                    <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Plane className="w-4 h-4" /> By Flight
                    </strong>
                    <span>{transitPreview.flightEstimate}</span>
                  </div>
                  {transitPreview.trainEstimate && (
                    <div className="choice-card">
                      <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <TrainFront className="w-4 h-4" /> By Express Train
                      </strong>
                      <span>{transitPreview.trainEstimate}</span>
                    </div>
                  )}
                  {transitPreview.roadEstimate && (
                    <div className="choice-card">
                      <strong style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Car className="w-4 h-4" /> By Road / Highway
                      </strong>
                      <span>{transitPreview.roadEstimate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="wizard-footer">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => router.push("/create-trip/destination")}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={handleContinue}
          >
            Continue to Preferences <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
