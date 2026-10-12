"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  Edit3,
  Share2,
  RefreshCw,
  Calendar,
  Compass,
  Wallet,
  Clock,
  Printer,
  Copy,
  Trash2,
  Check,
  Link2,
  ShieldAlert,
  Sparkles,
  FileDown,
} from "lucide-react";
import { Trip, SharedTripLink } from "@/lib/types";
import { useRoamWise } from "@/context/RoamWiseContext";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import { IllustratedPdfModal } from "./IllustratedPdfModal";
import { formatCurrency, formatDateRange } from "@/lib/utils";

interface TripHeaderShellProps {
  tripId: string;
  children: React.ReactNode;
}

export function TripHeaderShell({ tripId, children }: TripHeaderShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    getTripById,
    saveOrUpdateTrip,
    deleteTrip,
    duplicateTrip,
    showToast,
  } = useRoamWise();

  const [trip, setTrip] = useState<Trip | null>(() => getTripById(tripId) || null);
  const [loading, setLoading] = useState(!trip);
  const [unauthorized, setUnauthorized] = useState(false);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Share Panel State
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
        const res = await fetch(
          `/api/trips/${tripId}?userId=${encodeURIComponent(user?.id || "")}`
        );
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
  }, [tripId, localTrip, user?.id]);

  if (loading) {
    return (
      <div className="trip-workspace">
        <div className="empty-panel">
          <h3>Loading your itinerary...</h3>
          <p>Fetching verified stops, route coordinates, and budget items.</p>
        </div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="access-gate">
        <div className="access-gate-icon">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2>Unauthorized Trip Access</h2>
        <p>This itinerary is private and belongs to another traveler.</p>
        <div className="access-gate-actions">
          <Link href="/dashboard" className="button button-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="access-gate">
        <h2>Itinerary Not Found</h2>
        <p>
          We couldn’t locate this trip. Try selecting one from your Dashboard or
          planning a new adventure.
        </p>
        <div className="access-gate-actions">
          <Link href="/dashboard" className="button button-primary">
            Go to Dashboard
          </Link>
          <Link href="/trips/trip-manali-flagship" className="button button-quiet">
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
    <div className="trip-workspace">
      {/* Trip Hero */}
      <div
        className="trip-hero"
        style={{
          backgroundImage: `linear-gradient(125deg, rgba(10, 26, 36, 0.86), rgba(8, 127, 140, 0.56)), url('${trip.heroImage}')`,
        }}
      >
        <div className="trip-hero-copy">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span className="hero-badge">{trip.destinationCountry}</span>
            <span className="hero-badge">
              {trip.travelPace} Pace • {trip.travelTier}
            </span>
            {trip.isDemoData && (
              <span className="hero-badge">
                <Sparkles className="w-3.5 h-3.5" /> Verified Catalog Mode
              </span>
            )}
          </div>
          <h1>{trip.title}</h1>
          <p className="trip-theme">{trip.themeTagline}</p>
          <p>
            {formatDateRange(trip.startDate, trip.endDate)} • {trip.travelers}{" "}
            {trip.travelers === 1 ? "Traveler" : "Travelers"} ({trip.travelType}
            ) • Origin: {trip.startCity}
          </p>
        </div>

        <div className="trip-hero-actions no-print">
          <button
            type="button"
            className="trip-action primary"
            onClick={() =>
              saveOrUpdateTrip(
                { ...trip, isSaved: true },
                "Trip saved to your collection!"
              )
            }
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{trip.isSaved ? "Saved" : "Save Trip"}</span>
          </button>

          <button
            type="button"
            className="trip-action"
            onClick={() => setPdfModalOpen(true)}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF (with Photos)</span>
          </button>

          <Link href={`/trips/${trip.id}/edit`} className="trip-action">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Make Changes / Edit</span>
          </Link>

          <button
            type="button"
            className="trip-action"
            onClick={() => setShareOpen((prev) => !prev)}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="trip-action"
            disabled={isRegenerating}
            onClick={() => setConfirmRegen(true)}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isRegenerating ? "Regenerating..." : "Regenerate"}</span>
          </button>

          <button
            type="button"
            className="trip-action"
            onClick={async () => {
              const copy = await duplicateTrip(trip.id);
              if (copy) router.push(`/trips/${copy.id}`);
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>

          <button
            type="button"
            className="trip-action"
            onClick={() => window.print()}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            type="button"
            className="trip-action"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Share Options Drawer */}
      {shareOpen && (
        <div role="dialog" aria-modal="true" className="share-options">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "18px" }}>
            <strong style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Share2 className="w-4 h-4" /> Share Itinerary
            </strong>
            <label className="checkbox-pill">
              <input
                type="checkbox"
                checked={includeBudgetInShare}
                onChange={(e) => setIncludeBudgetInShare(e.target.checked)}
              />
              <span>Include budget breakdown on shared page</span>
            </label>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.84rem" }}>
              <span>Expires:</span>
              <input
                type="date"
                value={shareExpiration}
                onChange={(e) => setShareExpiration(e.target.value)}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: "10px",
                  padding: "4px 8px",
                }}
              />
            </label>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            {!activeShareLink ? (
              <button
                type="button"
                className="button button-primary button-sm"
                onClick={handleGenerateShareLink}
              >
                <Link2 className="w-4 h-4" /> Create Shareable Link
              </button>
            ) : (
              <>
                <code className="share-url">{shareUrl}</code>
                <button
                  type="button"
                  className="button button-primary button-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    setCopiedShare(true);
                    showToast("Share link copied!", shareUrl);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }}
                >
                  {copiedShare ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedShare ? "Copied" : "Copy"}</span>
                </button>
                <Link
                  href={`/share/${activeShareLink.token}`}
                  className="button button-quiet button-sm"
                >
                  Open Shared Preview
                </Link>
                <button
                  type="button"
                  className="button button-danger button-sm"
                  onClick={handleRevokeShareLink}
                >
                  Revoke Link
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4 Summary Cards */}
      <div className="trip-summary-row">
        <div className="stat-card">
          <span className="stat-icon">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <span>Total Days</span>
            <strong>{trip.durationDays} Days</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <span>Total Activities</span>
            <strong>{totalActivities} Stops</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <Wallet className="w-4 h-4" />
          </span>
          <div>
            <span>Estimated Trip Cost</span>
            <strong>{formatCurrency(totalEstimatedCost, trip.currency)}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">
            <Clock className="w-4 h-4" />
          </span>
          <div>
            <span>Estimated Travel Time</span>
            <strong>
              {Math.floor(totalTransitMins / 60)}h {totalTransitMins % 60}m
            </strong>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="trip-tabs no-print">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`trip-tab ${tab.active ? "active" : ""}`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {/* Active Tab Content */}
      <div>{children}</div>

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

      <IllustratedPdfModal
        trip={trip}
        open={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
}
