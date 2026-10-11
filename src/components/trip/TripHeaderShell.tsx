"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Edit3,
  Share2,
  RefreshCw,
  MoreHorizontal,
  Calendar,
  Compass,
  Wallet,
  Clock,
  Users,
  Printer,
  Copy,
  Trash2,
  Check,
  Link2,
  ShieldAlert,
  X,
  Sparkles,
} from "lucide-react";
import { Trip, SharedTripLink } from "@/lib/types";
import { useRoamWise } from "@/context/RoamWiseContext";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import { cn, formatCurrency, formatDateRange } from "@/lib/utils";

interface TripHeaderShellProps {
  tripId: string;
  children: React.ReactNode;
}

export function TripHeaderShell({ tripId, children }: TripHeaderShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    getTripById,
    saveOrUpdateTrip,
    deleteTrip,
    duplicateTrip,
    showToast,
  } = useRoamWise();

  const [trip, setTrip] = useState<Trip | null>(() => getTripById(tripId) || null);
  const [loading, setLoading] = useState(!trip);
  const [unauthorized, setUnauthorized] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Share Modal State
  const [shareOpen, setShareOpen] = useState(false);
  const [includeBudgetInShare, setIncludeBudgetInShare] = useState(true);
  const [shareExpiration, setShareExpiration] = useState("");
  const [activeShareLink, setActiveShareLink] = useState<SharedTripLink | null>(
    null
  );
  const [copiedShare, setCopiedShare] = useState(false);

  const localTrip = getTripById(tripId);

  useEffect(() => {
    if (localTrip) {
      setTrip(localTrip);
      setLoading(false);
      const validShare = localTrip.sharedLinks?.find((s) => !s.isRevoked);
      if (validShare) setActiveShareLink(validShare);
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/trips/${tripId}`);
        if (res.status === 403) {
          if (active) {
            setUnauthorized(true);
            setLoading(false);
          }
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (active && data.trip) {
            setTrip(data.trip);
            const validShare = data.trip.sharedLinks?.find(
              (s: SharedTripLink) => !s.isRevoked
            );
            if (validShare) setActiveShareLink(validShare);
          }
        }
      } catch {
        // Ignore network error
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [tripId, localTrip]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-64 rounded-3xl bg-surface border border-border animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-24 rounded-2xl bg-surface border border-border animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-10 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-heading font-bold text-heading">
          Unauthorized Trip Access
        </h2>
        <p className="text-sm text-muted mt-2">
          This itinerary is private and belongs to another traveler.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-10 text-center max-w-lg mx-auto my-8">
        <h2 className="text-xl font-heading font-bold text-heading">
          Itinerary Not Found
        </h2>
        <p className="text-sm text-muted mt-2">
          We couldn&apos;t locate this trip. Try selecting one from your Dashboard
          or planning a new adventure.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/trips/trip-manali-flagship"
            className="px-5 py-2.5 rounded-xl border border-border text-heading text-sm font-medium"
          >
            Open Sample Manali Trip
          </Link>
        </div>
      </div>
    );
  }

  const totalActivities = trip.days.reduce(
    (s, d) => s + d.activities.length,
    0
  );
  const totalEstimatedCost = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );
  const totalTransitMins = trip.days.reduce(
    (s, d) =>
      s + d.activities.reduce((acc, a) => acc + (a.travelTimeToNext || 0), 0),
    0
  );

  const tabs = [
    {
      label: "Overview",
      href: `/trips/${trip.id}`,
      active: pathname === `/trips/${trip.id}`,
    },
    {
      label: "Itinerary",
      href: `/trips/${trip.id}/itinerary`,
      active: pathname === `/trips/${trip.id}/itinerary`,
    },
    {
      label: "Map",
      href: `/trips/${trip.id}/map`,
      active: pathname === `/trips/${trip.id}/map`,
    },
    {
      label: "Places & Food",
      href: `/trips/${trip.id}/places`,
      active: pathname === `/trips/${trip.id}/places`,
    },
    {
      label: "Budget",
      href: `/trips/${trip.id}/budget`,
      active: pathname === `/trips/${trip.id}/budget`,
    },
    {
      label: "Customize & AI",
      href: `/trips/${trip.id}/edit`,
      active: pathname === `/trips/${trip.id}/edit`,
    },
  ];

  const handleFullRegenerate = async () => {
    setConfirmRegen(false);
    setIsRegenerating(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: trip.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.trip) {
          await saveOrUpdateTrip(data.trip, "Full itinerary regenerated!");
          setTrip(data.trip);
        }
      }
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerateShareLink = async () => {
    try {
      const res = await fetch(`/api/trips/${trip.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          includeBudget: includeBudgetInShare,
          expirationDate: shareExpiration || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.shareLink) {
          setActiveShareLink(data.shareLink);
          const updatedTrip: Trip = {
            ...trip,
            sharedLinks: [
              data.shareLink,
              ...(trip.sharedLinks || []).filter((s) => !s.isRevoked),
            ],
          };
          await saveOrUpdateTrip(updatedTrip);
          showToast(
            "Shareable link ready",
            "Anyone with this link can view the read-only itinerary."
          );
        }
      }
    } catch {
      // Fallback client share token
      const fallbackLink: SharedTripLink = {
        id: `share-${Date.now()}`,
        tripId: trip.id,
        token: `roamwise-manali-escape-demo`,
        accessTokenHash: "demo",
        includeBudget: includeBudgetInShare,
        allowCollaboration: true,
        isRevoked: false,
        expirationDate: shareExpiration || undefined,
        createdAt: new Date().toISOString(),
      };
      setActiveShareLink(fallbackLink);
    }
  };

  const handleRevokeShareLink = async () => {
    if (!activeShareLink) return;
    try {
      await fetch(`/api/trips/${trip.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REVOKE",
          token: activeShareLink.token,
        }),
      });
    } catch {
      // Ignore
    }
    setActiveShareLink(null);
    const updatedTrip: Trip = {
      ...trip,
      sharedLinks: (trip.sharedLinks || []).map((s) => ({
        ...s,
        isRevoked: true,
      })),
    };
    await saveOrUpdateTrip(updatedTrip);
    showToast("Share link revoked", "External access has been disabled.", "info");
  };

  const shareUrl =
    typeof window !== "undefined" && activeShareLink
      ? `${window.location.origin}/share/${activeShareLink.token}`
      : activeShareLink
      ? `/share/${activeShareLink.token}`
      : "";

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft">
        <div
          className="h-64 sm:h-80 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${trip.heroImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold border border-white/25">
                {trip.destinationCountry}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-semibold">
                {trip.travelPace} Pace • {trip.travelTier}
              </span>
              {trip.isDemoData && (
                <span className="px-3 py-1 rounded-full bg-sand/95 text-heading text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Verified Catalog Mode
                </span>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <button
                type="button"
                onClick={() =>
                  saveOrUpdateTrip(
                    { ...trip, isSaved: true },
                    "Trip saved to your collection!"
                  )
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>{trip.isSaved ? "Saved" : "Save Trip"}</span>
              </button>

              <Link
                href={`/trips/${trip.id}/edit`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Trip</span>
              </Link>

              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button
                type="button"
                disabled={isRegenerating}
                onClick={() => setConfirmRegen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs font-semibold transition-colors"
              >
                <RefreshCw
                  className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")}
                />
                <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
              </button>

              {/* More Options Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen((m) => !m)}
                  aria-label="More trip options"
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {moreOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-2xl shadow-elevated py-1.5 z-30 text-heading">
                    <button
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        window.print();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-sand/40 text-left"
                    >
                      <Printer className="w-4 h-4 text-primary" />
                      <span>Download / Print PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        setMoreOpen(false);
                        const copy = await duplicateTrip(trip.id);
                        if (copy) router.push(`/trips/${copy.id}`);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium hover:bg-sand/40 text-left"
                    >
                      <Copy className="w-4 h-4 text-primary" />
                      <span>Duplicate Trip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMoreOpen(false);
                        setConfirmDelete(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Trip</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold leading-tight">
              {trip.title}
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-1 max-w-2xl">
              {trip.themeTagline}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent" />
                {trip.travelers}{" "}
                {trip.travelers === 1 ? "Traveler" : "Travelers"} (
                {trip.travelType})
              </span>
              <span>Origin: {trip.startCity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Total Days</p>
            <p className="text-2xl font-heading font-extrabold text-heading mt-1">
              {trip.durationDays} Days
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">Total Activities</p>
            <p className="text-2xl font-heading font-extrabold text-heading mt-1">
              {totalActivities} Stops
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">
              Estimated Trip Cost
            </p>
            <p className="text-2xl font-heading font-extrabold text-heading mt-1">
              {formatCurrency(totalEstimatedCost, trip.currency)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-muted">
              Estimated Travel Time
            </p>
            <p className="text-2xl font-heading font-extrabold text-heading mt-1">
              {Math.floor(totalTransitMins / 60)}h {totalTransitMins % 60}m
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-warning/10 text-warning flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border overflow-x-auto no-print">
        <nav className="flex items-center gap-1 sm:gap-2 min-w-max">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors",
                tab.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-heading"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div>{children}</div>

      {/* Share Modal */}
      {shareOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 shadow-elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                <span>Share Itinerary</span>
              </h3>
              <button
                type="button"
                onClick={() => setShareOpen(false)}
                className="p-1 text-muted hover:text-heading rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Generate a secure read-only link for travel companions. Private
              notes and personal account details are never exposed.
            </p>

            <div className="mt-4 space-y-3 bg-background border border-border rounded-xl p-4">
              <label className="flex items-center justify-between text-xs font-medium text-heading cursor-pointer">
                <span>Include budget breakdown on shared page</span>
                <input
                  type="checkbox"
                  checked={includeBudgetInShare}
                  onChange={(e) => setIncludeBudgetInShare(e.target.checked)}
                  className="rounded border-border text-primary"
                />
              </label>

              <div>
                <label className="block text-xs font-medium text-muted mb-1">
                  Optional Link Expiration Date
                </label>
                <input
                  type="date"
                  value={shareExpiration}
                  onChange={(e) => setShareExpiration(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-border text-xs text-heading"
                />
              </div>
            </div>

            {!activeShareLink ? (
              <button
                type="button"
                onClick={handleGenerateShareLink}
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                <span>Create Shareable Link</span>
              </button>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-xs text-heading font-mono flex-1 focus:outline-none px-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedShare(true);
                      showToast("Share link copied!", shareUrl);
                      setTimeout(() => setCopiedShare(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold flex items-center gap-1"
                  >
                    {copiedShare ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedShare ? "Copied" : "Copy"}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Link
                    href={`/share/${activeShareLink.token}`}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Open Shared Preview →
                  </Link>
                  <button
                    type="button"
                    onClick={handleRevokeShareLink}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Revoke Link Access
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmRegen}
        title="Regenerate entire itinerary?"
        description="This will generate a fresh set of daily activities while keeping your destination, dates, and budget."
        confirmLabel="Regenerate Itinerary"
        variant="primary"
        onConfirm={handleFullRegenerate}
        onCancel={() => setConfirmRegen(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this trip permanently?"
        description="This itinerary and its custom schedule will be removed from your saved trips."
        confirmLabel="Delete Trip"
        variant="danger"
        onConfirm={async () => {
          setConfirmDelete(false);
          await deleteTrip(trip.id);
          router.push("/dashboard");
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
