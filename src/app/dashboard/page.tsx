"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Compass,
  Globe2,
  Map,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  ALL_DESTINATIONS,
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { DestinationInfo, Trip } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

const DASHBOARD_HERO_PHOTOS = [
  "/places/kerala-backwaters.jpg",
  "/places/switzerland-lauterbrunnen.jpg",
  "/places/santorini-oia-caldera.jpg",
  "/places/manali-solang-valley.jpg",
  "/places/paris-eiffel-tower.jpg",
  "/places/bali-uluwatu.jpg",
];

function greeting() {
  const hour = new Date().getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
    ? "Good afternoon"
    : "Good evening";
}

const fmtDate = (value: string) =>
  value
    ? new Date(`${value}T12:00:00`).toLocaleDateString("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Choose a date";

function MiniDynamicThumb({
  dest,
  intervalMs = 3600,
}: {
  dest: DestinationInfo;
  intervalMs?: number;
}) {
  const photos = useMemo(() => {
    const candidates = getCandidatePlacesForDestination(dest.name).filter(
      (p) =>
        p.category !== "Restaurant" &&
        p.category !== "Café" &&
        p.photoUrl.startsWith("/places/")
    );
    const urls = Array.from(
      new Set([dest.heroImage, ...candidates.map((p) => p.photoUrl)])
    ).filter(Boolean);
    return urls.length > 0 ? urls.slice(0, 3) : [dest.heroImage];
  }, [dest]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % photos.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [photos.length, intervalMs]);

  return <img src={photos[idx]} alt={dest.name} loading="lazy" />;
}

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    trips,
    drafts,
    updateActiveDraft,
    resetActiveDraft,
    removeDraft,
  } = useRoamWise();

  const [heroIdx, setHeroIdx] = useState(0);
  const [exploreTab, setExploreTab] = useState<
    "QUICK" | "ALL" | "INDIA" | "FOREIGN" | "SACRED"
  >("QUICK");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % DASHBOARD_HERO_PHOTOS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = trips.filter((trip) => trip.endDate >= today);
  const upcomingCount = upcoming.length;
  const savedCount = trips.filter((trip) => trip.isSaved).length;
  const uniqueDestinationsCount = new Set(
    trips.map((trip) => trip.destinationName)
  ).size;

  const beginPlanning = (dest?: DestinationInfo) => {
    if (dest) {
      resetActiveDraft({
        placeId: dest.placeId,
        name: dest.name,
        country: dest.stateOrCountry,
        heroImage: dest.heroImage,
      });
      router.push("/create-trip/dates");
      return;
    }
    router.push("/create-trip/destination");
  };

  const filteredExploreDestinations = useMemo(() => {
    let list: DestinationInfo[] = ALL_DESTINATIONS;
    if (exploreTab === "QUICK") {
      list = POPULAR_DESTINATIONS.slice(0, 10);
    } else if (exploreTab === "SACRED") {
      list = SACRED_DESTINATIONS;
    } else if (exploreTab === "INDIA") {
      list = ALL_DESTINATIONS.filter((d) =>
        d.stateOrCountry.toLowerCase().includes("india")
      );
    } else if (exploreTab === "FOREIGN") {
      list = ALL_DESTINATIONS.filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = ALL_DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.stateOrCountry.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [exploreTab, searchQuery]);

  const firstName = user?.name ? user.name.split(" ")[0] : "traveler";

  return (
    <DashboardWorkspaceLayout title="Your workspace" allowPublicPreview>
      <div className="dashboard-page">
        <div className="welcome-row">
          <div>
            <span className="eyebrow">
              {greeting()}, {firstName}
            </span>
            <h1>
              Where to <em>next?</em>
            </h1>
            <p>
              Your next memorable journey is a few thoughtful choices away.
            </p>
          </div>
          <button
            type="button"
            className="button button-primary"
            onClick={() => beginPlanning()}
          >
            <Plus size={17} /> Plan a new trip
          </button>
        </div>

        <section
          className="dashboard-hero"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(10,43,46,.86), rgba(10,43,46,.25)), url('${DASHBOARD_HERO_PHOTOS[heroIdx]}')`,
            transition: "background-image 0.9s ease-in-out",
          }}
        >
          <div className="dash-hero-copy">
            <span className="eyebrow eyebrow-light">
              YOUR PERSONAL TRAVEL DESK
            </span>
            <h2>
              Dream it. Plan it.
              <br />
              <em>Explore it.</em>
            </h2>
            <p>Turn a travel idea into a journey you can shape, day by day.</p>
            <button
              type="button"
              className="button button-light"
              onClick={() => beginPlanning()}
            >
              Create your next adventure <ArrowRight size={16} />
            </button>
          </div>
          <div className="banner-mark">
            <Compass size={80} strokeWidth={0.7} />
            <span>
              RB
              <br />
              <small>TRAVEL NOTES</small>
            </span>
          </div>
        </section>

        <div className="stats-row">
          <Stat
            icon={<Map />}
            label="Trips planned"
            value={String(trips.length)}
            detail="Across your collection"
          />
          <Stat
            icon={<CalendarDays />}
            label="Upcoming"
            value={String(upcomingCount)}
            detail="Journeys on the horizon"
          />
          <Stat
            icon={<Bookmark />}
            label="Saved plans"
            value={String(savedCount)}
            detail="Ready when you are"
          />
          <Stat
            icon={<Globe2 />}
            label="Places explored"
            value={String(uniqueDestinationsCount)}
            detail="Destinations in your plans"
          />
        </div>

        {drafts.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="dashboard-section-head">
              <div>
                <span className="eyebrow">IN PROGRESS</span>
                <h2>Continue planning</h2>
              </div>
            </div>
            <div className="mini-destinations">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="mini-destination"
                  onClick={() => {
                    updateActiveDraft(draft);
                    router.push("/create-trip/dates");
                  }}
                >
                  <img
                    src={draft.heroImage || "/places/manali-solang-valley.jpg"}
                    alt=""
                  />
                  <span>
                    <b>{draft.destinationName || "Untitled Draft"}</b>
                    <small>
                      {draft.durationDays} days · {draft.travelType}
                    </small>
                  </span>
                  <button
                    type="button"
                    aria-label="Delete draft"
                    className="icon-btn tiny"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDraft(draft.id);
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-section-head">
          <div>
            <span className="eyebrow">ON YOUR HORIZON</span>
            <h2>Your upcoming adventures</h2>
          </div>
          {trips.length > 0 && (
            <button
              type="button"
              className="inline-link"
              onClick={() => router.push("/saved-trips")}
            >
              View your trips <ArrowRight size={15} />
            </button>
          )}
        </div>

        {trips.length > 0 ? (
          <div className="upcoming-grid">
            {trips.slice(0, 3).map((trip) => (
              <DashboardTripCard
                key={trip.id}
                trip={trip}
                onOpen={() => router.push(`/trips/${trip.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-panel">
            <div className="empty-mark">
              <Compass size={29} />
            </div>
            <span className="eyebrow">A FRESH PAGE</span>
            <h3>Your adventures start here.</h3>
            <p>
              Begin with a place you’re curious about. You can edit every part
              of the plan before you save it.
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => beginPlanning()}
            >
              Create your first trip <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="text-link sample-link"
              onClick={() => beginPlanning(POPULAR_DESTINATIONS[0])}
            >
              Start with Manali <Sparkles size={15} />
            </button>
          </div>
        )}

        <div className="dashboard-explore" id="explore-destinations">
          <div className="dashboard-section-head">
            <div>
              <span className="eyebrow">A FEW PLACES TO START</span>
              <h2>Somewhere new?</h2>
            </div>
            <button
              type="button"
              className="inline-link"
              onClick={() => beginPlanning()}
            >
              Explore all <ArrowRight size={15} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div className="place-categories" style={{ margin: 0 }}>
              {(
                [
                  { id: "QUICK", label: "Popular picks" },
                  { id: "ALL", label: `All (${ALL_DESTINATIONS.length})` },
                  { id: "INDIA", label: "India" },
                  { id: "FOREIGN", label: "Foreign & Global" },
                  { id: "SACRED", label: "Sacred & Holy" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={exploreTab === tab.id ? "active" : ""}
                  onClick={() => setExploreTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="search-field" style={{ minWidth: 230 }}>
              <Search size={15} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter destinations..."
              />
            </div>
          </div>

          {exploreTab === "QUICK" && !searchQuery.trim() ? (
            <div className="mini-destinations">
              {filteredExploreDestinations.map((place, idx) => (
                <button
                  key={place.slug}
                  type="button"
                  className="mini-destination"
                  onClick={() => beginPlanning(place)}
                >
                  <MiniDynamicThumb
                    dest={place}
                    intervalMs={3400 + (idx % 4) * 500}
                  />
                  <span>
                    <b>{place.name}</b>
                    <small>{place.category}</small>
                  </span>
                  <ArrowUpRight size={15} />
                </button>
              ))}
            </div>
          ) : (
            <div className="wizard-destinations">
              {filteredExploreDestinations.map((place, idx) => (
                <button
                  key={place.slug}
                  type="button"
                  className="wizard-destination"
                  onClick={() => beginPlanning(place)}
                >
                  <MiniDynamicThumb
                    dest={place}
                    intervalMs={3600 + (idx % 4) * 500}
                  />
                  <span className="wd-content">
                    <small>{place.stateOrCountry}</small>
                    <b>{place.name}</b>
                    <span>{place.category}</span>
                  </span>
                  <ArrowUpRight size={16} className="wd-arrow" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardWorkspaceLayout>
  );
}

function Stat({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-detail">{detail}</div>
      </div>
    </article>
  );
}

function DashboardTripCard({
  trip,
  onOpen,
}: {
  trip: Trip;
  onOpen: () => void;
}) {
  const estimatedCost = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );
  return (
    <article className="trip-card">
      <button
        type="button"
        className="trip-photo"
        onClick={onOpen}
        aria-label={`Open ${trip.destinationName} trip`}
      >
        <img src={trip.heroImage} alt={trip.destinationName} />
        <span className="trip-photo-tag">{trip.status.toUpperCase()}</span>
        <span className="trip-more" aria-hidden="true">
          <ArrowUpRight size={17} />
        </span>
      </button>
      <div className="trip-card-body">
        <div className="trip-card-title">
          <div>
            <span className="eyebrow">{trip.destinationCountry}</span>
            <h3>{trip.destinationName}</h3>
          </div>
          <span className="trip-status">{trip.status}</span>
        </div>
        <div className="trip-metadata">
          <span>
            <CalendarDays size={14} />
            {fmtDate(trip.startDate)}
          </span>
          <span>
            <Users size={14} />
            {trip.travelers} travelers
          </span>
        </div>
        <div className="trip-card-foot">
          <span>
            {formatCurrency(estimatedCost, trip.currency)}{" "}
            <small>estimated</small>
          </span>
          <button type="button" onClick={onOpen}>
            View plan <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
