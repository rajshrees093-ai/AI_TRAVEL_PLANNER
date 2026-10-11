"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import { POPULAR_DESTINATIONS } from "@/lib/destinations-catalog";
import { destinationStepSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  placeId: string;
  name: string;
  stateOrCountry: string;
  category: string;
  heroImage: string;
  tagline?: string;
}

export default function DestinationSelectionPage() {
  const router = useRouter();
  const { activeDraft, updateActiveDraft } = useRoamWise();

  const [query, setQuery] = useState(activeDraft.destinationName || "");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/search?type=destinations&q=${encodeURIComponent(query)}`
        );
        if (res.ok && active) {
          const data = await res.json();
          setSuggestions(data.destinations || []);
        }
      } catch {
        // Fallback to local filter
      }
    }, 150);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelectPlace = (dest: SearchSuggestion) => {
    setQuery(dest.name);
    setShowDropdown(false);
    setErrorMsg(null);
    updateActiveDraft({
      destinationPlaceId: dest.placeId,
      destinationName: dest.name,
      destinationCountry: dest.stateOrCountry,
      heroImage: dest.heroImage,
      currentStep: Math.max(activeDraft.currentStep, 1),
    });
  };

  const handleContinue = () => {
    setErrorMsg(null);
    const parsed = destinationStepSchema.safeParse({
      destinationPlaceId: activeDraft.destinationPlaceId,
      destinationName: activeDraft.destinationName,
      destinationCountry: activeDraft.destinationCountry,
    });

    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message ||
          "Please select a destination to continue."
      );
      return;
    }

    updateActiveDraft({ currentStep: Math.max(activeDraft.currentStep, 2) });
    router.push("/create-trip/dates");
  };

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 1 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Destination Selection" },
      ]}
    >
      <WizardProgressStepper currentStep={1} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Let&apos;s Plan Something Amazing.
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1.5">
            First, where would you like to explore?
          </p>
        </div>

        {/* Autocomplete Search Input */}
        <div className="relative mt-6 max-w-2xl">
          <div className="flex items-center gap-3 bg-background border-2 border-border focus-within:border-primary rounded-2xl px-4 py-3.5 shadow-xs transition-colors">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              value={query}
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              placeholder="Search a city, country, or destination..."
              aria-label="Search a city, country, or destination"
              className="bg-transparent text-base font-medium text-heading placeholder:text-muted focus:outline-none w-full"
            />
            {activeDraft.destinationPlaceId && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold shrink-0">
                <Check className="w-3.5 h-3.5" />
                Verified ID
              </span>
            )}
          </div>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-elevated z-30 max-h-72 overflow-y-auto divide-y divide-border">
              {suggestions.map((item) => {
                const isSelected =
                  activeDraft.destinationPlaceId === item.placeId;
                return (
                  <button
                    key={item.placeId}
                    type="button"
                    onClick={() => handleSelectPlace(item)}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-center justify-between hover:bg-sand/40 transition-colors",
                      isSelected && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-heading">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted">
                          {item.stateOrCountry} •{" "}
                          <span className="font-mono text-[10px]">
                            {item.placeId.slice(0, 16)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-primary">
                      Select
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Destination Verification Pill */}
        {activeDraft.destinationPlaceId && (
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-primary/10 border border-primary/25 text-xs font-medium text-heading">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>
              Selected:{" "}
              <strong className="font-bold">
                {activeDraft.destinationName}
              </strong>{" "}
              ({activeDraft.destinationCountry}) • Place ID:{" "}
              <code className="text-[11px] text-primary font-mono">
                {activeDraft.destinationPlaceId}
              </code>
            </span>
          </div>
        )}

        {errorMsg && (
          <div
            role="alert"
            className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 max-w-xl"
          >
            {errorMsg}
          </div>
        )}

        {/* Popular Destinations Image Grid */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted mb-4">
            Or Pick a Popular Destination
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_DESTINATIONS.map((dest) => {
              const selected =
                activeDraft.destinationPlaceId === dest.placeId ||
                activeDraft.destinationName.toLowerCase() ===
                  dest.name.toLowerCase();

              return (
                <button
                  key={dest.placeId}
                  type="button"
                  onClick={() => handleSelectPlace(dest)}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden border-2 text-left transition-all",
                    selected
                      ? "border-primary ring-4 ring-primary/15 shadow-elevated"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {selected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="font-heading font-bold text-base">
                        {dest.name}
                      </p>
                      <p className="text-[11px] text-white/85">
                        {dest.stateOrCountry}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 bg-surface flex items-center justify-between text-xs">
                    <span className="text-muted truncate">{dest.category}</span>
                    <span
                      className={cn(
                        "font-semibold shrink-0 ml-2",
                        selected ? "text-primary" : "text-muted"
                      )}
                    >
                      {selected ? "Selected" : "Choose"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-heading hover:bg-sand/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!activeDraft.destinationPlaceId}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold shadow-sm transition-colors"
          >
            <span>Continue to Dates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
