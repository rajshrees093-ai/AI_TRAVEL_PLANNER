"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Plus,
  Compass,
  ArrowRight,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import { formatCurrency, formatDateRange } from "@/lib/utils";

export default function SavedTripsPage() {
  const router = useRouter();
  const {
    trips,
    deleteTrip,
    duplicateTrip,
    resetActiveDraft,
    showToast,
  } = useRoamWise();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "UPCOMING" | "PAST" | "DRAFT"
  >("ALL");
  const [sortBy, setSortBy] = useState<"CREATED" | "TRAVEL_DATE">("TRAVEL_DATE");
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const filteredTrips = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const list = trips.filter((t) => {
      const matchesSearch =
        !q ||
        t.destinationName.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.destinationCountry.toLowerCase().includes(q);

      let matchesStatus = true;
      if (statusFilter === "UPCOMING") {
        matchesStatus = t.status === "UPCOMING" || t.status === "PLANNED";
      } else if (statusFilter === "PAST") {
        matchesStatus = t.status === "COMPLETED";
      } else if (statusFilter === "DRAFT") {
        matchesStatus = t.status === "DRAFT";
      }

      return matchesSearch && matchesStatus;
    });

    return list.sort((a, b) => {
      if (sortBy === "TRAVEL_DATE") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [trips, searchQuery, statusFilter, sortBy]);

  const handleQuickShare = async (tripId: string, destName: string) => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ includeBudget: true }),
      });
      if (res.ok) {
        const data = await res.json();
        const url = `${window.location.origin}/share/${data.shareLink.token}`;
        navigator.clipboard.writeText(url);
        showToast(`Copied share link for ${destName}!`, url);
      }
    } catch {
      const fallbackUrl = `${window.location.origin}/share/roamwise-manali-escape-demo`;
      navigator.clipboard.writeText(fallbackUrl);
      showToast("Share link copied!", fallbackUrl);
    }
  };

  return (
    <DashboardWorkspaceLayout
      title="Saved Trips"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Saved Trips" },
      ]}
    >
      <div className="saved-page">
        <div className="welcome-row">
          <div>
            <span className="eyebrow">Saved Collection</span>
            <h1>Your Travel Collection</h1>
            <p>Every journey you’ve dreamed of, all in one place.</p>
          </div>

          <Link
            href="/create-trip/destination"
            onClick={() => resetActiveDraft()}
            className="button button-primary"
          >
            <Plus className="w-4 h-4" /> Plan New Trip
          </Link>
        </div>

        {/* Filter, Search, Sort & View Mode Bar */}
        <div className="saved-controls">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
            <label className="search-field">
              <Search className="w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination..."
                aria-label="Search destination"
              />
            </label>

            <div className="place-categories">
              {(
                [
                  { key: "ALL", label: "All" },
                  { key: "UPCOMING", label: "Upcoming" },
                  { key: "PAST", label: "Past" },
                  { key: "DRAFT", label: "Drafts" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`filter-chip ${
                    statusFilter === tab.key ? "active" : ""
                  }`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <select
              aria-label="Sort trips by"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "CREATED" | "TRAVEL_DATE")
              }
              style={{
                border: "1px solid var(--line)",
                borderRadius: "14px",
                padding: "10px 14px",
                background: "var(--paper)",
              }}
            >
              <option value="TRAVEL_DATE">Sort by Travel Date</option>
              <option value="CREATED">Sort by Date Created</option>
            </select>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={`filter-chip ${viewMode === "grid" ? "active" : ""}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={`filter-chip ${viewMode === "list" ? "active" : ""}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredTrips.length === 0 ? (
          <div className="empty-panel">
            <Compass className="w-8 h-8" style={{ color: "var(--ocean)", margin: "0 auto" }} />
            <h3>No saved itineraries match this view</h3>
            <p>
              Try switching your filter to “All” or create a new personalized
              trip plan.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "8px" }}>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("ALL");
                }}
              >
                Reset Filters
              </button>
              <Link href="/create-trip/destination" className="button button-primary">
                + Create New Trip
              </Link>
            </div>
          </div>
        ) : (
          <div
            className={`upcoming-grid saved-grid ${
              viewMode === "list" ? "list" : ""
            }`}
          >
            {filteredTrips.map((trip) => (
              <div key={trip.id} className="saved-item">
                <article className="trip-card">
                  <div
                    className="trip-card-art"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.08), rgba(16, 24, 40, 0.72)), url(${trip.heroImage})`,
                    }}
                  >
                    <span>
                      {trip.status} • {trip.durationDays} Days
                    </span>
                    <div>
                      <strong>{trip.destinationName}</strong>
                      <small>{trip.destinationCountry}</small>
                    </div>
                  </div>
                  <div className="trip-card-body">
                    <p>{trip.themeTagline}</p>
                    <div className="trip-card-meta">
                      <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                      <span>
                        {trip.travelers} ({trip.travelType})
                      </span>
                      <span>{formatCurrency(trip.budget, trip.currency)}</span>
                    </div>
                    <div className="trip-card-actions">
                      <Link href={`/trips/${trip.id}`} className="text-button">
                        Open Trip <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>

                <div className="saved-item-actions">
                  <Link
                    href={`/trips/${trip.id}/edit`}
                    className="button button-quiet button-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={async () => {
                      const copy = await duplicateTrip(trip.id);
                      if (copy) router.push(`/trips/${copy.id}`);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button
                    type="button"
                    className="button button-quiet button-sm"
                    onClick={() =>
                      handleQuickShare(trip.id, trip.destinationName)
                    }
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button
                    type="button"
                    className="button button-danger button-sm"
                    onClick={() => setTripToDelete(trip.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(tripToDelete)}
        title="Delete this saved trip?"
        description="This action will remove the itinerary from your travel collection."
        confirmLabel="Delete Trip"
        onConfirm={async () => {
          if (tripToDelete) {
            await deleteTrip(tripToDelete);
            setTripToDelete(null);
          }
        }}
        onCancel={() => setTripToDelete(null)}
      />
    </DashboardWorkspaceLayout>
  );
}
