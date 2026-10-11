"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  Compass,
  Calendar,
  Bookmark,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Sparkles,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import { POPULAR_DESTINATIONS } from "@/lib/destinations-catalog";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import {
  cn,
  formatCurrency,
  formatDateRange,
  getTimeGreeting,
} from "@/lib/utils";
import { TripWizardDraft } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    trips,
    isLoadingTrips,
    drafts,
    updateActiveDraft,
    resetActiveDraft,
    removeDraft,
    deleteTrip,
    duplicateTrip,
  } = useRoamWise();

  const [openMenuTripId, setOpenMenuTripId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [previewEmptyState, setPreviewEmptyState] = useState(false);

  const firstName = user?.name?.split(" ")[0] || "Explorer";
  const greeting = getTimeGreeting();

  const displayedTrips = previewEmptyState ? [] : trips;
  const upcomingTrips = displayedTrips.filter(
    (t) => t.status === "UPCOMING" || t.status === "PLANNED"
  );
  const savedCount = displayedTrips.filter((t) => t.isSaved).length;
  const uniqueDestinations = new Set(
    displayedTrips.map((t) => t.destinationName.toLowerCase())
  ).size;

  const handleContinueDraft = (draft: TripWizardDraft) => {
    updateActiveDraft(draft);
    const stepRoutes: Record<number, string> = {
      1: "/create-trip/destination",
      2: "/create-trip/dates",
      3: "/create-trip/preferences",
      4: "/create-trip/budget",
      5: "/create-trip/review",
    };
    router.push(stepRoutes[draft.currentStep] || "/create-trip/destination");
  };

  const handlePlanDestination = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    resetActiveDraft({
      placeId: dest.placeId,
      name: dest.name,
      country: dest.stateOrCountry,
      heroImage: dest.heroImage,
    });
    router.push("/create-trip/dates");
  };

  const statusBadgeStyle = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "bg-primary/15 text-primary border-primary/25";
      case "PLANNED":
        return "bg-success/15 text-success border-success/25";
      case "DRAFT":
        return "bg-warning/15 text-warning border-warning/25";
      default:
        return "bg-sand text-heading border-border";
    }
  };

  return (
    <DashboardWorkspaceLayout
      title="Travel Workspace"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      actions={
        <button
          type="button"
          onClick={() => setPreviewEmptyState((p) => !p)}
          className="hidden xl:inline-flex items-center px-2.5 py-1 rounded-lg border border-border text-[11px] font-medium text-muted hover:text-heading transition-colors"
        >
          {previewEmptyState ? "Show My Trips" : "Preview First-Time View"}
        </button>
      }
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            {greeting}, {firstName}! Where to next?
          </h2>
          <p className="text-sm text-muted mt-1">
            Your next memorable journey is just a few clicks away.
          </p>
        </div>
        <Link
          href="/create-trip/destination"
          onClick={() => resetActiveDraft()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Main Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-soft border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-sand mb-3">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>AI-Powered Personalized Journeys</span>
          </span>
          <h3 className="text-2xl sm:text-4xl font-heading font-extrabold leading-tight">
            Dream it. Plan it. Explore it.
          </h3>
          <p className="text-sm sm:text-base text-white/85 mt-2.5 leading-relaxed">
            Turn your travel ideas into unforgettable experiences with your
            personal AI travel planner.
          </p>
          <Link
            href="/create-trip/destination"
            onClick={() => resetActiveDraft()}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm shadow-sm transition-colors"
          >
            <span>Create Your Next Adventure</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* First-Time User Empty State vs Active Workspace */}
      {isLoadingTrips ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 rounded-2xl bg-surface border border-border p-5 animate-pulse"
            />
          ))}
        </div>
      ) : displayedTrips.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-soft mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-heading">
            Your adventures start here
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto mt-2 leading-relaxed">
            Tell RoamWise where you want to travel, your dates, preferences, and
            budget—we&apos;ll craft a complete day-by-day itinerary with
            verified locations and interactive route maps.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create-trip/destination"
              onClick={() => resetActiveDraft()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Trip</span>
            </Link>
            {previewEmptyState && (
              <button
                type="button"
                onClick={() => setPreviewEmptyState(false)}
                className="px-5 py-3 rounded-xl border border-border text-sm font-medium text-heading hover:bg-sand/40"
              >
                Restore Sample Trips
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* 4 Summary Cards using Actual Database/Store Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Total Trips Planned",
                value: displayedTrips.length,
                sub: "Complete multi-day itineraries",
                icon: Compass,
                color: "text-primary bg-primary/10",
              },
              {
                label: "Upcoming Trips",
                value: upcomingTrips.length,
                sub: "Scheduled departures",
                icon: Calendar,
                color: "text-accent bg-accent/10",
              },
              {
                label: "Saved Itineraries",
                value: savedCount,
                sub: "Ready for offline & sharing",
                icon: Bookmark,
                color: "text-success bg-success/10",
              },
              {
                label: "Destinations Explored",
                value: uniqueDestinations,
                sub: "Distinct cities & regions",
                icon: MapPin,
                color: "text-warning bg-warning/10",
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-surface border border-border rounded-2xl p-5 shadow-soft flex items-start justify-between"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      {card.label}
                    </p>
                    <p className="text-3xl font-heading font-extrabold text-heading mt-1.5">
                      {card.value}
                    </p>
                    <p className="text-xs text-muted mt-1">{card.sub}</p>
                  </div>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      card.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upcoming Adventures Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-heading font-bold text-heading">
                  Your Upcoming Adventures
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Open any itinerary to explore day-wise timelines, route maps,
                  and budget breakdowns.
                </p>
              </div>
              <Link
                href="/saved-trips"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View All ({displayedTrips.length}) →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col relative"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.heroImage}
                      alt={trip.destinationName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span
                      className={cn(
                        "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md bg-surface/90",
                        statusBadgeStyle(trip.status)
                      )}
                    >
                      {trip.status}
                    </span>

                    {/* Three-dot action menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuTripId(
                            openMenuTripId === trip.id ? null : trip.id
                          )
                        }
                        aria-label={`Actions for ${trip.destinationName}`}
                        className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuTripId === trip.id && (
                        <div className="absolute right-0 mt-1.5 w-40 bg-surface border border-border rounded-xl shadow-elevated py-1.5 z-20">
                          <Link
                            href={`/trips/${trip.id}/edit`}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-sand/40"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-primary" />
                            <span>Edit Trip</span>
                          </Link>
                          <button
                            type="button"
                            onClick={async () => {
                              setOpenMenuTripId(null);
                              await duplicateTrip(trip.id);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-sand/40 text-left"
                          >
                            <Copy className="w-3.5 h-3.5 text-primary" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuTripId(null);
                              setTripToDelete(trip.id);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 inset-x-4 text-white">
                      <h4 className="text-lg font-heading font-bold leading-snug">
                        {trip.destinationName}
                      </h4>
                      <p className="text-xs text-white/85">
                        {trip.destinationCountry}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5 text-xs text-muted">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-heading">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {trip.durationDays} Days
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          {trip.travelers}{" "}
                          {trip.travelers === 1 ? "Traveler" : "Travelers"} (
                          {trip.travelType})
                        </span>
                        <span className="font-semibold text-heading">
                          {formatCurrency(trip.budget, trip.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center gap-2.5">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold text-center transition-colors"
                      >
                        View Itinerary
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/map`}
                        className="py-2.5 px-3 rounded-xl border border-border text-heading hover:bg-sand/40 text-xs font-medium transition-colors"
                      >
                        Map
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Continue Planning Section (Persisted Drafts) */}
      {drafts.length > 0 && (
        <section className="mb-12">
          <div className="mb-4">
            <h3 className="text-xl font-heading font-bold text-heading">
              Continue Planning
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Pick up right where you left off on your in-progress trip drafts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => {
              const progressPct = Math.min(100, draft.currentStep * 20);
              return (
                <div
                  key={draft.id}
                  className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {draft.heroImage ? (
                      <img
                        src={draft.heroImage}
                        alt={draft.destinationName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-heading">
                          {draft.destinationName || "Untitled Trip"}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand text-heading">
                          Step {draft.currentStep} of 5 ({progressPct}%)
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {draft.durationDays} days • {draft.travelers} travelers •
                        Updated{" "}
                        {new Date(draft.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="w-44 h-1.5 bg-background rounded-full overflow-hidden mt-2 border border-border">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleContinueDraft(draft)}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors"
                    >
                      Continue Planning
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      aria-label="Discard draft"
                      className="p-2 text-muted hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Explore Destinations Section */}
      <section id="explore-destinations">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-heading font-bold text-heading">
              Explore Destinations
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Curated places ready for instant AI itinerary generation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_DESTINATIONS.slice(0, 8).map((dest) => (
            <div
              key={dest.placeId}
              className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col justify-between group"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3.5 text-white">
                  <p className="font-heading font-bold text-base">{dest.name}</p>
                  <p className="text-[11px] text-white/80">
                    {dest.stateOrCountry}
                  </p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-muted line-clamp-2">
                  {dest.tagline}
                </p>
                <button
                  type="button"
                  onClick={() => handlePlanDestination(dest)}
                  className="mt-3 w-full py-2 px-3 rounded-xl bg-background hover:bg-primary hover:text-white border border-border text-xs font-semibold text-primary transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Plan Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(tripToDelete)}
        title="Delete this itinerary?"
        description="This action will permanently remove the itinerary from your saved trips collection."
        confirmLabel="Delete Itinerary"
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
