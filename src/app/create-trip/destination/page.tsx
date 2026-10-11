"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Flame,
  Globe2,
  Compass,
  Building2,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { WizardProgressStepper } from "@/components/wizard/WizardProgressStepper";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
} from "@/lib/destinations-catalog";
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

type CatalogTab = "ALL" | "SACRED" | "POPULAR" | "INDIAN_CITIES" | "GLOBAL_CITIES";

export default function DestinationSelectionPage() {
  const router = useRouter();
  const { activeDraft, updateActiveDraft } = useRoamWise();

  const [query, setQuery] = useState(activeDraft.destinationName || "");
  const [activeTab, setActiveTab] = useState<CatalogTab>("ALL");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/places/search?type=destinations&category=${activeTab}&q=${encodeURIComponent(
            query
          )}`
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
  }, [query, activeTab]);

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

  const displayedShowcaseCards = useMemo(() => {
    if (activeTab === "SACRED") {
      return SACRED_DESTINATIONS;
    }
    if (activeTab === "POPULAR") {
      return POPULAR_DESTINATIONS;
    }
    if (activeTab === "INDIAN_CITIES") {
      return [...POPULAR_DESTINATIONS, ...SACRED_DESTINATIONS].filter((d) =>
        d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    if (activeTab === "GLOBAL_CITIES") {
      return [...POPULAR_DESTINATIONS, ...SACRED_DESTINATIONS].filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    return [...POPULAR_DESTINATIONS, ...SACRED_DESTINATIONS];
  }, [activeTab]);

  const filteredDirectoryCities = useMemo(() => {
    if (activeTab === "SACRED") {
      return WORLDWIDE_CITIES_AND_HOMETOWNS.filter(
        (c) => c.regionType === "Sacred & Holy Place"
      );
    }
    if (activeTab === "INDIAN_CITIES") {
      return WORLDWIDE_CITIES_AND_HOMETOWNS.filter((c) =>
        c.stateOrCountry.toLowerCase().includes("india")
      );
    }
    if (activeTab === "GLOBAL_CITIES") {
      return WORLDWIDE_CITIES_AND_HOMETOWNS.filter(
        (c) => !c.stateOrCountry.toLowerCase().includes("india")
      );
    }
    return WORLDWIDE_CITIES_AND_HOMETOWNS;
  }, [activeTab]);

  return (
    <DashboardWorkspaceLayout
      title="Plan New Trip — Step 1 of 5"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Destination & Sacred Place Selection" },
      ]}
    >
      <WizardProgressStepper currentStep={1} />

      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2.5">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Worldwide Cities + Sacred & Holy Pilgrimage Sites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Where Would You Like to Journey?
          </h2>
          <p className="text-sm sm:text-base text-muted mt-1.5">
            Search any city, worship or holy site (Char Dham, Jyotirlingas, Golden Temple, Ayodhya, Tirupati, Mecca, Vatican, Jerusalem), or global destination. In the next step, you can set your exact hometown for end-to-end travel routing.
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
              placeholder="Search any city, temple, holy place, or country worldwide (e.g., Varanasi, Ayodhya, Tirupati, Kedarnath, London, Tokyo)..."
              aria-label="Search a city, country, or worship place"
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
            <div className="absolute left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-elevated z-30 max-h-80 overflow-y-auto divide-y divide-border">
              <div className="px-4 py-2 bg-sand/30 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted">
                <span>Matching Cities, Holy Places & Worldwide Destinations ({suggestions.length})</span>
                <button
                  type="button"
                  onClick={() => setShowDropdown(false)}
                  className="text-primary hover:underline"
                >
                  Close
                </button>
              </div>
              {suggestions.map((item) => {
                const isSelected =
                  activeDraft.destinationPlaceId === item.placeId;
                const isSacred =
                  item.category.toLowerCase().includes("sacred") ||
                  item.category.toLowerCase().includes("spiritual") ||
                  item.category.toLowerCase().includes("jyotirlinga") ||
                  item.category.toLowerCase().includes("dham") ||
                  item.category.toLowerCase().includes("pilgrimage");
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
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                          isSacred
                            ? "bg-accent/15 text-accent"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {isSacred ? (
                          <Flame className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-heading">
                            {item.name}
                          </p>
                          {isSacred && (
                            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                              Sacred / Holy Site
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted">
                          {item.stateOrCountry} • {item.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary shrink-0 ml-2">
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

        {/* Category Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border pb-4">
          {[
            { id: "ALL" as CatalogTab, label: "All Destinations & Holy Sites", icon: Compass },
            { id: "SACRED" as CatalogTab, label: "Worship & Holy Places (21+)", icon: Flame },
            { id: "POPULAR" as CatalogTab, label: "Popular Leisure", icon: Sparkles },
            { id: "INDIAN_CITIES" as CatalogTab, label: "Indian Cities & Shrines", icon: Building2 },
            { id: "GLOBAL_CITIES" as CatalogTab, label: "Worldwide Cities & Holy Sites", icon: Globe2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowDropdown(false);
                }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                  active
                    ? "bg-primary text-white shadow-xs"
                    : "bg-background border border-border text-muted hover:text-heading hover:bg-sand/40"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase Destinations & Holy Places Image Grid */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted">
              {activeTab === "SACRED"
                ? "Sacred Worship & Pilgrimage Destinations (India & Worldwide)"
                : activeTab === "INDIAN_CITIES"
                ? "Featured Indian Cities & Pilgrimage Hubs"
                : activeTab === "GLOBAL_CITIES"
                ? "Featured International Cities & Global Holy Sites"
                : "Featured Leisure & Sacred Destinations"}
            </h3>
            <span className="text-xs text-muted">
              Showing {displayedShowcaseCards.length} curated guides
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayedShowcaseCards.map((dest) => {
              const selected =
                activeDraft.destinationPlaceId === dest.placeId ||
                activeDraft.destinationName.toLowerCase() ===
                  dest.name.toLowerCase();
              const isSacred =
                dest.category.toLowerCase().includes("sacred") ||
                dest.category.toLowerCase().includes("spiritual") ||
                dest.category.toLowerCase().includes("jyotirlinga") ||
                dest.category.toLowerCase().includes("dham") ||
                dest.category.toLowerCase().includes("pilgrimage");

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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    {isSacred && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent/90 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                        <Flame className="w-3 h-3" />
                        <span>Holy Site</span>
                      </div>
                    )}
                    {selected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="font-heading font-bold text-base leading-snug">
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

        {/* Quick-Select Worldwide & Indian Cities + Shrines Directory */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-heading">
                Quick-Pick Any City or Holy Shrine Worldwide ({filteredDirectoryCities.length}+ Directory)
              </h3>
              <p className="text-xs text-muted">
                Click any city or worship center below to select it immediately, or type any town on Earth in the search box above.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-background border border-border">
            {filteredDirectoryCities.map((city) => {
              const isSelected =
                activeDraft.destinationPlaceId === city.placeId ||
                activeDraft.destinationName.toLowerCase() ===
                  city.name.toLowerCase();
              const isSacred = city.regionType === "Sacred & Holy Place";

              return (
                <button
                  key={city.placeId}
                  type="button"
                  onClick={() =>
                    handleSelectPlace({
                      placeId: city.placeId,
                      name: city.name,
                      stateOrCountry: city.stateOrCountry,
                      category: isSacred
                        ? "Sacred & Spiritual Pilgrimage"
                        : city.regionType === "Indian City"
                        ? "Indian City & Heritage"
                        : "Global City & Cultural Hub",
                      heroImage: isSacred
                        ? "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80"
                        : "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
                    })
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                    isSelected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : isSacred
                      ? "bg-accent/10 text-heading border-accent/25 hover:border-accent"
                      : "bg-surface text-heading border-border hover:border-primary/40"
                  )}
                >
                  {isSacred ? (
                    <Flame
                      className={cn(
                        "w-3 h-3",
                        isSelected ? "text-white" : "text-accent"
                      )}
                    />
                  ) : (
                    <MapPin
                      className={cn(
                        "w-3 h-3",
                        isSelected ? "text-white" : "text-primary"
                      )}
                    />
                  )}
                  <span>{city.name}</span>
                  <span
                    className={cn(
                      "text-[10px]",
                      isSelected ? "text-white/80" : "text-muted"
                    )}
                  >
                    ({city.stateOrCountry.split(",")[0]})
                  </span>
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
            <span>Continue to Hometown & Dates</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
