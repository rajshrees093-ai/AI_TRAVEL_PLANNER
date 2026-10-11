"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  User,
  Heart,
  UsersRound,
  Baby,
  Clock,
  ArrowLeft,
  ArrowRight,
  Check,
  Plane,
  TrainFront,
  Car,
  Globe2,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { datesStepSchema } from "@/lib/validations";
import { calculateDaysBetween, cn } from "@/lib/utils";
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
    label: "Solo Explorer",
    desc: "Independent pace, flexible discovery",
    defaultCount: 1,
    icon: User,
  },
  {
    type: "Couple",
    label: "Couple",
    desc: "Romantic views, cozy dining & escapes",
    defaultCount: 2,
    icon: Heart,
  },
  {
    type: "Friends",
    label: "Friends Group",
    desc: "Shared adventures, cafés & vibrant spots",
    defaultCount: 4,
    icon: UsersRound,
  },
  {
    type: "Family",
    label: "Family",
    desc: "Comfortable schedules & all-age sights",
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
  "Patna",
  "Bhopal",
  "Indore",
  "Chandigarh",
  "Kochi",
  "Guwahati",
  "London",
  "New York City",
  "Dubai",
  "Singapore",
  "Toronto",
  "Sydney",
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
      <WizardProgressStepper currentStep={2} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Where are you traveling from & when?
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1.5">
            Select your starting hometown anywhere in the world, travel dates, and group size for{" "}
            <strong className="text-heading">
              {activeDraft.destinationName || "your destination"}
            </strong>
            .
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

        {/* Date Pickers + Automatic Duration Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7">
          <div>
            <label
              htmlFor="start-date"
              className="block text-xs font-semibold text-heading mb-1.5"
            >
              Start Date
            </label>
            <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <input
                id="start-date"
                type="date"
                value={activeDraft.startDate}
                onChange={(e) =>
                  updateActiveDraft({ startDate: e.target.value })
                }
                className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="end-date"
              className="block text-xs font-semibold text-heading mb-1.5"
            >
              End Date
            </label>
            <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <input
                id="end-date"
                type="date"
                value={activeDraft.endDate}
                onChange={(e) => updateActiveDraft({ endDate: e.target.value })}
                className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
              />
            </div>
          </div>

          {/* Automatic Trip Duration */}
          <div className="flex flex-col justify-end">
            <div
              className={cn(
                "rounded-xl px-4 py-2.5 border flex items-center justify-between",
                duration > 0 && duration <= 14
                  ? "bg-primary/10 border-primary/25 text-heading"
                  : "bg-red-50 border-red-200 text-red-700"
              )}
            >
              <span className="text-xs font-medium">Calculated Duration</span>
              <span className="text-base font-heading font-bold">
                {duration > 0
                  ? `${duration} ${duration === 1 ? "Day" : "Days"}`
                  : "Invalid Date Range"}
              </span>
            </div>
          </div>
        </div>

        {/* Starting City (Worldwide Hometown Search) & Traveler Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <div className="relative">
            <label
              htmlFor="start-city"
              className="block text-xs font-semibold text-heading mb-1.5"
            >
              Your Hometown / Starting City (All Indian & Global Cities)
            </label>
            <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
              <Globe2 className="w-4 h-4 text-primary shrink-0" />
              <input
                id="start-city"
                type="text"
                value={activeDraft.startCity}
                onFocus={() => setShowHometownDropdown(true)}
                onChange={(e) => {
                  updateActiveDraft({ startCity: e.target.value });
                  setShowHometownDropdown(true);
                }}
                placeholder="Type any hometown worldwide (e.g. New Delhi, Mumbai, London, Dubai)..."
                className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
              />
            </div>

            {showHometownDropdown && hometownSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-surface border border-border rounded-2xl shadow-elevated z-30 max-h-60 overflow-y-auto divide-y divide-border">
                <div className="px-3.5 py-2 bg-sand/30 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                  <span>Select Your Hometown / Origin City</span>
                  <button
                    type="button"
                    onClick={() => setShowHometownDropdown(false)}
                    className="text-primary hover:underline"
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
                    className="w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-sand/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-heading">
                          {city.name}
                        </p>
                        <p className="text-[11px] text-muted">
                          {city.stateOrCountry}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-primary">
                      Use Hometown
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Quick-Select Hometown Pills */}
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {QUICK_HOMETOWNS.map((ht) => {
                const isSelected =
                  activeDraft.startCity.toLowerCase() === ht.toLowerCase();
                return (
                  <button
                    key={ht}
                    type="button"
                    onClick={() => {
                      updateActiveDraft({ startCity: ht });
                      setShowHometownDropdown(false);
                    }}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors",
                      isSelected
                        ? "bg-primary text-white border-primary"
                        : "bg-background text-muted border-border hover:text-heading"
                    )}
                  >
                    {ht}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="traveler-count"
              className="block text-xs font-semibold text-heading mb-1.5"
            >
              Number of Travelers
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  updateActiveDraft({
                    travelers: Math.max(1, activeDraft.travelers - 1),
                  })
                }
                className="w-10 h-10 rounded-xl border border-border bg-background hover:bg-sand/40 font-bold text-heading"
              >
                -
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 bg-background border border-border rounded-xl px-4 py-2.5">
                <Users className="w-4 h-4 text-primary" />
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
                  className="bg-transparent text-center text-sm font-bold text-heading w-16 focus:outline-none"
                />
                <span className="text-xs text-muted">
                  {activeDraft.travelers === 1 ? "Traveler" : "Travelers"}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateActiveDraft({
                    travelers: Math.min(30, activeDraft.travelers + 1),
                  })
                }
                className="w-10 h-10 rounded-xl border border-border bg-background hover:bg-sand/40 font-bold text-heading"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Live Hometown -> Destination Route & Transit Preview */}
        {activeDraft.startCity && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-primary/5 border border-primary/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-primary/15">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold">
                  Hometown Route Connected
                </span>
                <p className="text-sm font-heading font-bold text-heading">
                  {transitPreview.originCity} → {transitPreview.destinationName}
                </p>
              </div>
              <span className="text-xs font-semibold text-primary">
                ~{transitPreview.aerialDistanceKm.toLocaleString()} km air distance • Recommended:{" "}
                {transitPreview.recommendedPrimaryMode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-2.5">
                <Plane className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold uppercase text-muted">
                    By Flight
                  </p>
                  <p className="text-xs font-semibold text-heading mt-0.5">
                    {transitPreview.flightEstimate}
                  </p>
                </div>
              </div>

              {transitPreview.trainEstimate && (
                <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-2.5">
                  <TrainFront className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-muted">
                      By Express Train
                    </p>
                    <p className="text-xs font-semibold text-heading mt-0.5">
                      {transitPreview.trainEstimate}
                    </p>
                  </div>
                </div>
              )}

              {transitPreview.roadEstimate && (
                <div className="p-3 rounded-xl bg-surface border border-border flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold uppercase text-muted">
                      By Road / Highway
                    </p>
                    <p className="text-xs font-semibold text-heading mt-0.5">
                      {transitPreview.roadEstimate}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-muted mt-2.5">
              {transitPreview.routeSummaryNote}
            </p>
          </div>
        )}

        {/* Travel Group Type Cards */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Travel Group Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GROUP_TYPES.map((g) => {
              const Icon = g.icon;
              const selected = activeDraft.travelType === g.type;
              return (
                <button
                  key={g.type}
                  type="button"
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
                  className={cn(
                    "p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between",
                    selected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        selected
                          ? "bg-primary text-white"
                          : "bg-surface text-primary border border-border"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {selected && (
                      <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm text-heading">
                      {g.label}
                    </p>
                    <p className="text-xs text-muted mt-1">{g.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Availability / Sightseeing Window */}
        <div className="mt-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-3">
            Preferred Daily Sightseeing / Darshan Window (Optional)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SIGHTSEEING_WINDOWS.map((win) => {
              const active = activeDraft.sightseeingWindow === win;
              return (
                <button
                  key={win}
                  type="button"
                  onClick={() => updateActiveDraft({ sightseeingWindow: win })}
                  className={cn(
                    "px-4 py-3 rounded-xl border text-xs font-medium flex items-center gap-2 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-heading font-semibold"
                      : "border-border bg-background text-muted hover:text-heading"
                  )}
                >
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>{win}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/create-trip/destination")}
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
            <span>Continue to Preferences</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
