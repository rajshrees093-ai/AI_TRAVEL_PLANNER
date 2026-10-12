"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Copy,
  Check,
  Printer,
  ShieldAlert,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Brand } from "@/components/ui/BrandComponents";
import { Trip } from "@/lib/types";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { useRoamWise } from "@/context/RoamWiseContext";

export default function SharedTripReadOnlyPage({
  params,
}: {
  params: { token: string };
}) {
  const { showToast } = useRoamWise();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [includeBudget, setIncludeBudget] = useState(true);
  const [expirationDate, setExpirationDate] = useState<string | undefined>();
  const [errorReason, setErrorReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/trips/shared-lookup/share?token=${encodeURIComponent(
            params.token
          )}`
        );
        if (!res.ok) {
          const err = await res.json();
          if (active) {
            setErrorReason(
              err.message ||
                "This shared itinerary link is invalid, expired, or has been revoked."
            );
            setLoading(false);
          }
          return;
        }
        const data = await res.json();
        if (active && data.trip) {
          setTrip(data.trip);
          setIncludeBudget(data.shareConfig?.includeBudget ?? true);
          setExpirationDate(data.shareConfig?.expirationDate);
        }
      } catch {
        if (active) {
          setErrorReason("Unable to load shared itinerary.");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [params.token]);

  const handleRevoke = async () => {
    if (!trip) return;
    await fetch(`/api/trips/${trip.id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REVOKE", token: params.token }),
    });
    setTrip(null);
    setErrorReason("This shared itinerary link has been revoked by the owner.");
    showToast("Access revoked", "Shared link has been disabled.", "info");
  };

  if (loading) {
    return (
      <div className="shared-page">
        <div className="empty-panel">
          <h3>Loading shared itinerary...</h3>
        </div>
      </div>
    );
  }

  if (errorReason || !trip) {
    return (
      <div className="shared-missing">
        <div className="empty-panel">
          <ShieldAlert className="w-8 h-8" style={{ color: "var(--danger)", margin: "0 auto" }} />
          <h1>Shared Itinerary Unavailable</h1>
          <p>{errorReason}</p>
          <div style={{ marginTop: "12px" }}>
            <Link href="/" className="button button-primary">
              Explore RouteBloom
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalCost = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );

  return (
    <div className="shared-page">
      {/* Top Public Bar */}
      <header className="shared-header no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/" className="brand-anchor">
            <Brand />
          </Link>
          <span className="read-only-pill">
            <Sparkles className="w-3.5 h-3.5" /> Read-Only Shared Itinerary
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className="button button-quiet button-sm"
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              setCopied(true);
              showToast("Link copied!", url);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>

          <button
            type="button"
            className="button button-quiet button-sm"
            onClick={() => window.print()}
          >
            <Printer className="w-3.5 h-3.5" /> Print PDF
          </button>

          <button
            type="button"
            className="button button-danger button-sm"
            onClick={handleRevoke}
          >
            Revoke Link
          </button>

          <Link
            href="/create-trip/destination"
            className="button button-primary button-sm"
          >
            Plan Your Own Trip
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div
        className="shared-hero"
        style={{
          backgroundImage: `linear-gradient(125deg, rgba(10, 26, 36, 0.86), rgba(8, 127, 140, 0.56)), url('${trip.heroImage}')`,
        }}
      >
        <div>
          <span className="hero-badge">
            {trip.destinationName} • {trip.durationDays} Days
          </span>
          <h1>{trip.title}</h1>
          <p>{trip.themeTagline}</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <span className="hero-badge">
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
          <span className="hero-badge">
            {trip.travelers} Travelers ({trip.travelType})
          </span>
          {expirationDate && (
            <span className="hero-badge">Expires: {expirationDate}</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="shared-content">
        <div className="shared-summary">
          <div className="editorial-note">
            <span className="eyebrow">Trip Overview</span>
            <h3>Curated by RouteBloom</h3>
            <p>{trip.aiSummary}</p>
          </div>
        </div>

        {includeBudget && trip.budgetItems.length > 0 && (
          <div className="shared-budget">
            <div>
              <span className="eyebrow">Estimated Budget Breakdown</span>
              <h3>Total: {formatCurrency(totalCost, trip.currency)}</h3>
            </div>
            <div className="place-categories">
              {trip.budgetItems.slice(0, 6).map((item) => (
                <span key={item.id} className="pill-badge">
                  {item.category}:{" "}
                  {formatCurrency(item.estimatedAmount, trip.currency)}
                </span>
              ))}
            </div>
          </div>
        )}

        {trip.days.map((day) => (
          <section key={day.id} className="shared-day">
            <div>
              <span className="eyebrow">
                Day {day.dayNumber} • {day.date}
              </span>
              <h2>{day.title}</h2>
              <p>{day.summary}</p>
            </div>

            {day.activities.map((act) => (
              <div key={act.id} className="shared-activity">
                <span>
                  {act.startTime} – {act.endTime}
                </span>
                <div>
                  <strong>{act.title}</strong>
                  <p>{act.description}</p>
                  <small>
                    {act.category} • {act.expectedDuration}m • {act.address}
                  </small>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${act.title} ${act.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-quiet button-sm"
                >
                  <MapPin className="w-3.5 h-3.5" /> Map{" "}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
