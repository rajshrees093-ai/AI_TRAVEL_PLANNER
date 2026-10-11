"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Copy,
  Check,
  Printer,
  ShieldAlert,
  Wallet,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
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
      <div className="min-h-screen bg-background p-6 max-w-5xl mx-auto space-y-6">
        <div className="h-16 bg-surface rounded-2xl animate-pulse" />
        <div className="h-72 bg-surface rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (errorReason || !trip) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-8 text-center shadow-elevated">
          <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-heading font-bold text-heading">
            Shared Itinerary Unavailable
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            {errorReason}
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold"
          >
            Explore RoamWise
          </Link>
        </div>
      </div>
    );
  }

  const totalCost = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );

  return (
    <div className="min-h-screen bg-background text-heading pb-16">
      {/* Top Public Bar */}
      <header className="bg-surface border-b border-border sticky top-0 z-30 no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RoamWiseLogo size="sm" />
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sand text-heading text-[11px] font-semibold">
              <Sparkles className="w-3 h-3 text-primary" />
              Read-Only Shared Itinerary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                setCopied(true);
                showToast("Link copied!", url);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-sand/40 text-xs font-semibold text-heading"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-primary" />
              )}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-sand/40 text-xs font-semibold text-heading"
            >
              <Printer className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Print PDF</span>
            </button>

            <button
              type="button"
              onClick={handleRevoke}
              className="px-3 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Revoke Link
            </button>

            <Link
              href="/create-trip/destination"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold"
            >
              Plan Your Own Trip
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden border border-border shadow-soft">
          <img
            src={trip.heroImage}
            alt={trip.destinationName}
            className="h-64 sm:h-80 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-3 py-1 rounded-full bg-primary text-xs font-bold">
              {trip.destinationName} • {trip.durationDays} Days
            </span>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold mt-2">
              {trip.title}
            </h1>
            <p className="text-sm text-white/85 mt-1">{trip.themeTagline}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent" />
                {trip.travelers} Travelers ({trip.travelType})
              </span>
              {expirationDate && (
                <span>Link expires: {expirationDate}</span>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-soft">
          <h2 className="text-base font-heading font-bold text-heading mb-2">
            Trip Overview
          </h2>
          <p className="text-sm text-muted leading-relaxed">{trip.aiSummary}</p>
        </div>

        {/* Day-wise Schedule */}
        <section className="space-y-6">
          <h2 className="text-xl font-heading font-bold text-heading">
            Day-by-Day Itinerary & Route Stops
          </h2>

          {trip.days.map((day) => (
            <div
              key={day.id}
              className="bg-surface border border-border rounded-2xl p-6 shadow-soft space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-xs font-bold text-primary uppercase">
                    Day {day.dayNumber} • {day.date}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-heading">
                    {day.title}
                  </h3>
                </div>
                <span className="text-xs text-muted">
                  {day.activities.length} verified stops
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {day.activities.map((act, idx) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-xl bg-background border border-border flex items-start gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-primary">
                          {act.startTime} – {act.endTime}
                        </span>
                        <span className="text-muted">{act.category}</span>
                      </div>
                      <h4 className="text-sm font-heading font-bold text-heading mt-1">
                        {act.title}
                      </h4>
                      <p className="text-xs text-muted mt-1 line-clamp-2">
                        {act.description}
                      </p>
                      <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {act.expectedDuration}m
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            `${act.title} ${act.address}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Map</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Budget Breakdown if Shared */}
        {includeBudget && trip.budgetItems.length > 0 && (
          <section className="bg-surface border border-border rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <span>Estimated Budget Breakdown</span>
              </h2>
              <span className="text-base font-heading font-extrabold text-primary">
                Total: {formatCurrency(totalCost, trip.currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trip.budgetItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold uppercase text-primary block">
                      {item.category}
                    </span>
                    <p className="font-medium text-heading truncate">
                      {item.title}
                    </p>
                  </div>
                  <strong className="text-heading shrink-0">
                    {formatCurrency(item.estimatedAmount, trip.currency)}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
