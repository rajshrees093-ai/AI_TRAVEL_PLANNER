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
  findDestinationInfo,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { destinationStepSchema } from "@/lib/validations";

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
  const [autoCycleTick, setAutoCycleTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoCycleTick((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
    const allCurated = [...POPULAR_DESTINATIONS, ...SACRED_DESTINATIONS];
    if (activeTab === "SACRED") {
      return SACRED_DESTINATIONS;
    }
    if (activeTab === "POPULAR") {
      return POPULAR_DESTINATIONS;
    }
    if (activeTab === "INDIAN_CITIES") {
      return allCurated.filter((d) =>
        d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    if (activeTab === "GLOBAL_CITIES") {
      return allCurated.filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    const foreignDest = allCurated.filter(
      (d) => !d.stateOrCountry.toLowerCase().includes("india")
    );
    const indianLeisure = POPULAR_DESTINATIONS.filter((d) =>
      d.stateOrCountry.toLowerCase().includes("india")
    );
    const indianSacred = SACRED_DESTINATIONS.filter((d) =>
      d.stateOrCountry.toLowerCase().includes("india")
    );
    const interleaved: typeof POPULAR_DESTINATIONS = [];
    const maxLen = Math.max(
      foreignDest.length,
      indianLeisure.length,
      indianSacred.length
    );
    for (let i = 0; i < maxLen; i++) {
      if (i < foreignDest.length) interleaved.push(foreignDest[i]);
      if (i < indianLeisure.length) interleaved.push(indianLeisure[i]);
      if (i < indianSacred.length) interleaved.push(indianSacred[i]);
    }
    return interleaved;
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
      <div className="wizard-page">
        <WizardProgressStepper currentStep={1} />

        <section className="wizard-panel">
          <div className="destination-picker">
            {/* Search Input */}
            <div style={{ position: "relative" }}>
              <label className="search-field planner-search">
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  value={query}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  placeholder="Search a city, country, temple, or popular destination..."
                  aria-label="Search a city, country, or worship place"
                />
                {activeDraft.destinationPlaceId && (
                  <span className="pill-badge">
                    <Check className="w-3.5 h-3.5" /> Verified ID
                  </span>
                )}
              </label>

              {showDropdown && suggestions.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    marginTop: "8px",
                    background: "var(--paper)",
                    border: "1px solid var(--line)",
                    borderRadius: "18px",
                    boxShadow: "var(--shadow-md)",
                    zIndex: 30,
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderBottom: "1px solid var(--line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--muted)",
                    }}
                  >
                    <span>Matching Destinations ({suggestions.length})</span>
                    <button
                      type="button"
                      onClick={() => setShowDropdown(false)}
                      className="text-button"
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
                        style={{
                          width: "100%",
                          padding: "12px 16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "none",
                          borderBottom: "1px solid var(--line)",
                          background: isSelected
                            ? "var(--ocean-soft)"
                            : "transparent",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span className="selected-place-pin">
                            {isSacred ? (
                              <Flame className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}
                          </span>
                          <div>
                            <strong style={{ display: "block", color: "var(--ink)" }}>
                              {item.name}
                            </strong>
                            <small style={{ color: "var(--muted)" }}>
                              {item.stateOrCountry} • {item.category}
                            </small>
                          </div>
                        </div>
                        <span className="text-button">Select</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Place Pill */}
            {activeDraft.destinationPlaceId && (
              <div className="selected-place">
                <span className="selected-place-pin">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <strong>
                    {activeDraft.destinationName}, {activeDraft.destinationCountry}
                  </strong>
                  <span>
                    Selected destination • Verified Place ID:{" "}
                    <code>{activeDraft.destinationPlaceId}</code>
                  </span>
                </div>
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={handleContinue}
                >
                  Continue to Dates <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {errorMsg && (
              <div role="alert" className="auth-error">
                {errorMsg}
              </div>
            )}

            {/* Category Tabs */}
            <div className="wizard-subhead" style={{ marginTop: "6px" }}>
              <div>
                <h3>Popular & Sacred Destinations</h3>
                <span>{displayedShowcaseCards.length} options</span>
              </div>
              <div className="place-categories">
                {[
                  { id: "ALL" as CatalogTab, label: "All Destinations", icon: Compass },
                  { id: "SACRED" as CatalogTab, label: "Worship & Holy Places", icon: Flame },
                  { id: "POPULAR" as CatalogTab, label: "Popular Leisure", icon: Sparkles },
                  { id: "INDIAN_CITIES" as CatalogTab, label: "India", icon: Building2 },
                  { id: "GLOBAL_CITIES" as CatalogTab, label: "International", icon: Globe2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      className={`filter-chip ${active ? "active" : ""}`}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowDropdown(false);
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Destination Cards Grid */}
            <div className="wizard-destinations">
              {displayedShowcaseCards.map((dest, destIdx) => {
                const selected =
                  activeDraft.destinationPlaceId === dest.placeId ||
                  activeDraft.destinationName.toLowerCase() ===
                    dest.name.toLowerCase();
                const candidateStops = getCandidatePlacesForDestination(dest.name)
                  .filter(
                    (p) => p.category !== "Restaurant" && p.category !== "Café"
                  )
                  .slice(0, 3);
                const activePhoto =
                  candidateStops.length > 0
                    ? candidateStops[
                        (autoCycleTick + destIdx) % candidateStops.length
                      ]?.photoUrl || dest.heroImage
                    : dest.heroImage;

                return (
                  <button
                    key={dest.placeId}
                    type="button"
                    className={`wizard-destination ${selected ? "selected" : ""}`}
                    onClick={() => {
                      if (selected) {
                        handleContinue();
                      } else {
                        handleSelectPlace(dest);
                      }
                    }}
                  >
                    <div
                      className="wizard-destination-art"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.08), rgba(16, 24, 40, 0.72)), url(${activePhoto})`,
                      }}
                    >
                      <span>{dest.category.split("&")[0].trim()}</span>
                      <div>
                        <strong>{dest.name}</strong>
                        <small>{dest.stateOrCountry}</small>
                      </div>
                    </div>
                    <div className="wizard-destination-body">
                      <p>{dest.tagline}</p>
                      <div>
                        <span>{dest.stateOrCountry.split(",")[0]}</span>
                        <span>{selected ? "Selected ✓ (Click to continue)" : "Select →"}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick-Pick Worldwide Directory */}
            <div style={{ marginTop: "14px" }}>
              <div className="wizard-subhead">
                <h3>Quick-Pick Any City or Holy Shrine Worldwide ({filteredDirectoryCities.length}+ Directory)</h3>
                <span>Click to select</span>
              </div>
              <div className="place-categories" style={{ maxHeight: "150px", overflowY: "auto", padding: "6px 0" }}>
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
                      className={`filter-chip ${isSelected ? "active" : ""}`}
                      onClick={() => {
                        const matched = findDestinationInfo(city.name);
                        handleSelectPlace({
                          placeId: city.placeId,
                          name: city.name,
                          stateOrCountry: city.stateOrCountry,
                          category: isSacred
                            ? "Sacred & Spiritual Pilgrimage"
                            : city.regionType === "Indian City"
                            ? "Indian City & Heritage"
                            : "Global City & Cultural Hub",
                          heroImage: matched.heroImage,
                        });
                      }}
                    >
                      {isSacred ? (
                        <Flame className="w-3.5 h-3.5" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {city.name} ({city.stateOrCountry.split(",")[0]})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="wizard-footer">
          <button
            type="button"
            className="button button-quiet"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <button
            type="button"
            className="button button-primary"
            onClick={handleContinue}
            disabled={!activeDraft.destinationPlaceId}
          >
            Continue to Hometown & Dates <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}
