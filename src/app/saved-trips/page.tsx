"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  Clock,
  Users,
  Edit3,
  Copy,
  Trash2,
  Share2,
  Plus,
  Compass,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import { cn, formatCurrency, formatDateRange } from "@/lib/utils";

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
        showToast(
          `Copied share link for ${destName}!`,
          url
        );
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Your Travel Collection
          </h2>
          <p className="text-sm text-muted mt-1">
            Every journey you&apos;ve dreamed of, all in one place.
          </p>
        </div>

        <Link
          href="/create-trip/destination"
          onClick={() => resetActiveDraft()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Filter, Search, Sort & View Mode Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3.5 py-2 w-full sm:w-64 focus-within:border-primary">
            <Search className="w-4 h-4 text-primary shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destination..."
              aria-label="Search destination"
              className="bg-transparent text-xs sm:text-sm text-heading focus:outline-none w-full"
            />
          </div>

          <div className="inline-flex rounded-xl bg-background border border-border p-1">
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
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                  statusFilter === tab.key
                    ? "bg-primary text-white"
                    : "text-muted hover:text-heading"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          <select
            aria-label="Sort trips by"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "CREATED" | "TRAVEL_DATE")
            }
            className="px-3.5 py-2 rounded-xl bg-background border border-border text-xs font-semibold text-heading"
          >
            <option value="TRAVEL_DATE">Sort by Travel Date</option>
            <option value="CREATED">Sort by Date Created</option>
          </select>

          <div className="inline-flex rounded-xl bg-background border border-border p-1">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-heading"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List view"
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-muted hover:text-heading"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center shadow-soft">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-heading font-bold text-heading">
            No saved itineraries match this view
          </h3>
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto mt-1.5">
            Try switching your filter to &ldquo;All&rdquo; or create a new
            personalized trip plan.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-heading"
            >
              Reset Filters
            </button>
            <Link
              href="/create-trip/destination"
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
            >
              + Create New Trip
            </Link>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={trip.heroImage}
                    alt={trip.destinationName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-surface/90 text-heading text-[11px] font-bold">
                    {trip.status}
                  </span>
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-heading font-bold">
                      {trip.destinationName}
                    </h3>
                    <p className="text-xs text-white/80">
                      {trip.destinationCountry}
                    </p>
                  </div>
                </div>

                <div className="p-5 space-y-2 text-xs text-muted">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDateRange(trip.startDate, trip.endDate)}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-heading">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      {trip.durationDays} Days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      {trip.travelers} ({trip.travelType})
                    </span>
                    <span className="font-bold text-heading">
                      {formatCurrency(trip.budget, trip.currency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                <Link
                  href={`/trips/${trip.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold text-center transition-colors"
                >
                  Open Trip
                </Link>
                <Link
                  href={`/trips/${trip.id}/edit`}
                  title="Edit Trip"
                  className="p-2 rounded-xl border border-border text-muted hover:text-heading"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  title="Duplicate Trip"
                  onClick={async () => {
                    const copy = await duplicateTrip(trip.id);
                    if (copy) router.push(`/trips/${copy.id}`);
                  }}
                  className="p-2 rounded-xl border border-border text-muted hover:text-heading"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Share Trip"
                  onClick={() =>
                    handleQuickShare(trip.id, trip.destinationName)
                  }
                  className="p-2 rounded-xl border border-border text-muted hover:text-heading"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Delete Trip"
                  onClick={() => setTripToDelete(trip.id)}
                  className="p-2 rounded-xl border border-border text-muted hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-surface border border-border rounded-2xl p-4 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={trip.heroImage}
                  alt={trip.destinationName}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-heading font-bold text-heading">
                      {trip.destinationName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-sand text-heading text-[10px] font-bold">
                      {trip.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {formatDateRange(trip.startDate, trip.endDate)} •{" "}
                    {trip.durationDays} Days • {trip.travelers} Travelers •{" "}
                    {formatCurrency(trip.budget, trip.currency)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Link
                  href={`/trips/${trip.id}`}
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold"
                >
                  Open Trip
                </Link>
                <Link
                  href={`/trips/${trip.id}/edit`}
                  className="px-3 py-2 rounded-xl border border-border text-xs font-medium text-heading"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => duplicateTrip(trip.id)}
                  className="px-3 py-2 rounded-xl border border-border text-xs font-medium text-heading"
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickShare(trip.id, trip.destinationName)
                  }
                  className="px-3 py-2 rounded-xl border border-border text-xs font-medium text-heading"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => setTripToDelete(trip.id)}
                  className="p-2 rounded-xl border border-border text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
