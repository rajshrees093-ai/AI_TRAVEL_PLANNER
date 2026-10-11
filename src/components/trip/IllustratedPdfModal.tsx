"use client";

import React, { useState } from "react";
import {
  FileDown,
  Printer,
  X,
  MapPin,
  Clock,
  Calendar,
  Users,
  Wallet,
  Sparkles,
  CheckCircle2,
  Navigation,
  Globe2,
} from "lucide-react";
import { Trip } from "@/lib/types";
import { computeHometownToDestinationTransit } from "@/lib/destinations-catalog";
import { formatCurrency, formatDateRange } from "@/lib/utils";

interface IllustratedPdfModalProps {
  trip: Trip;
  open: boolean;
  onClose: () => void;
}

export function IllustratedPdfModal({
  trip,
  open,
  onClose,
}: IllustratedPdfModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!open) return null;

  const transit = computeHometownToDestinationTransit(
    trip.startCity || "New Delhi",
    trip.destinationName
  );
  const totalEstimated = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );
  const totalStops = trip.days.reduce((s, d) => s + d.activities.length, 0);

  const buildIllustratedHtmlDocument = () => {
    const daysHtml = trip.days
      .map((day) => {
        const dayCost = day.activities.reduce((s, a) => s + a.estimatedCost, 0);
        const stopsHtml = day.activities
          .map(
            (act, idx) => `
          <div class="stop-card">
            <div class="stop-photo-wrap">
              <img src="${act.photoUrl}" alt="${act.title.replace(/"/g, "&quot;")}" crossorigin="anonymous" />
              <span class="stop-index-badge">Stop #${idx + 1}</span>
              <span class="stop-cat-badge">${act.category}</span>
            </div>
            <div class="stop-body">
              <div class="stop-header-row">
                <span class="stop-time">${act.startTime} – ${act.endTime} (${act.expectedDuration} mins)</span>
                <span class="stop-cost">${
                  act.estimatedCost === 0
                    ? "Free Entry"
                    : formatCurrency(act.estimatedCost, trip.currency)
                }</span>
              </div>
              <h4 class="stop-title">${act.title}</h4>
              <p class="stop-address">📍 ${act.address}</p>
              <p class="stop-desc">${act.description}</p>
              ${
                act.notes
                  ? `<div class="stop-tip"><strong>Insider Tip:</strong> ${act.notes}</div>`
                  : ""
              }
              <div class="stop-meta-footer">
                ${
                  act.openingHours
                    ? `<span>🕒 Hours: ${act.openingHours}</span>`
                    : ""
                }
                ${
                  act.rating
                    ? `<span>★ ${act.rating.toFixed(1)} Rating</span>`
                    : ""
                }
                ${
                  act.travelTimeToNext
                    ? `<span>🚗 Next stop: ${act.distanceToNextKm} km (~${act.travelTimeToNext} mins)</span>`
                    : `<span>🏁 End of Day ${day.dayNumber}</span>`
                }
              </div>
            </div>
          </div>
        `
          )
          .join("");

        return `
        <section class="day-section">
          <div class="day-banner">
            <div>
              <span class="day-pill">DAY ${day.dayNumber} • ${day.date}</span>
              <h3 class="day-title">${day.title}</h3>
              <p class="day-summary">${day.summary}</p>
            </div>
            <div class="day-stats">
              <div><strong>${day.activities.length}</strong> Places</div>
              <div><strong>${formatCurrency(dayCost, trip.currency)}</strong> Est.</div>
              <div>${day.weatherCondition || "Pleasant"}</div>
            </div>
          </div>
          <div class="stops-grid">
            ${stopsHtml}
          </div>
        </section>
      `;
      })
      .join("");

    const budgetRowsHtml = trip.budgetItems
      .map(
        (b) => `
      <tr>
        <td><strong>${b.category}</strong></td>
        <td>${b.title} (${b.sourceLabel})</td>
        <td style="text-align:right;font-weight:700;">${formatCurrency(
          b.estimatedAmount,
          trip.currency
        )}</td>
      </tr>
    `
      )
      .join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${trip.title} — RoamWise Illustrated Travel Itinerary PDF</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1F2933;
      background: #FAFAF7;
      padding: 28px;
      line-height: 1.5;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .container { max-width: 980px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8EAED; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
    .hero {
      position: relative;
      height: 310px;
      background-image: url('${trip.heroImage}');
      background-size: cover;
      background-position: center;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 28px 34px;
    }
    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(15,23,42,0.88), rgba(15,23,42,0.35));
    }
    .hero-top, .hero-bottom { position: relative; z-index: 2; }
    .brand-badge {
      display: inline-block;
      background: #087F8C;
      color: #FFFFFF;
      font-weight: 800;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 999px;
    }
    .hero h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 34px;
      font-weight: 800;
      margin-top: 8px;
    }
    .hero p { font-size: 14px; opacity: 0.92; margin-top: 4px; }
    .meta-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #F5E9D8;
      padding: 18px 34px;
      border-bottom: 1px solid #E8EAED;
    }
    .meta-box span { display: block; font-size: 11px; text-transform: uppercase; color: #64748B; font-weight: 700; }
    .meta-box strong { font-size: 15px; color: #1F2933; }
    .content { padding: 30px 34px; }
    .route-box {
      background: #F0FDFA;
      border: 1px solid #99F6E4;
      border-radius: 16px;
      padding: 18px 22px;
      margin-bottom: 28px;
    }
    .route-box h3 { font-size: 16px; color: #075D66; margin-bottom: 6px; font-family: 'Plus Jakarta Sans', sans-serif; }
    .route-modes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 10px; font-size: 12px; }
    .route-mode-card { background: #FFFFFF; border: 1px solid #CCFBF1; padding: 10px 12px; border-radius: 10px; }
    .day-section { margin-bottom: 34px; page-break-inside: avoid; }
    .day-banner {
      background: #1F2933;
      color: #FFFFFF;
      padding: 18px 24px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .day-pill {
      display: inline-block;
      background: #FF8066;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 99px;
      margin-bottom: 4px;
    }
    .day-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; }
    .day-summary { font-size: 12px; opacity: 0.85; margin-top: 3px; }
    .day-stats { text-align: right; font-size: 12px; line-height: 1.6; }
    .stops-grid { display: flex; flex-direction: column; gap: 16px; }
    .stop-card {
      display: grid;
      grid-template-columns: 240px 1fr;
      border: 1px solid #E8EAED;
      border-radius: 16px;
      overflow: hidden;
      background: #FFFFFF;
      page-break-inside: avoid;
    }
    .stop-photo-wrap { position: relative; height: 100%; min-height: 185px; background: #E2E8F0; }
    .stop-photo-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .stop-index-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #087F8C;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 9px;
      border-radius: 99px;
    }
    .stop-cat-badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(15, 23, 42, 0.82);
      color: #FFFFFF;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 99px;
    }
    .stop-body { padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; }
    .stop-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .stop-time { font-size: 12px; font-weight: 700; color: #087F8C; }
    .stop-cost { font-size: 12px; font-weight: 700; color: #1F2933; background: #F5E9D8; padding: 2px 10px; border-radius: 99px; }
    .stop-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 800; color: #1F2933; }
    .stop-address { font-size: 12px; color: #64748B; margin-top: 2px; }
    .stop-desc { font-size: 12.5px; color: #334155; margin-top: 8px; }
    .stop-tip {
      margin-top: 8px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 11.5px;
      color: #92400E;
    }
    .stop-meta-footer {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed #E8EAED;
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 11px;
      color: #64748B;
      font-weight: 600;
    }
    .budget-table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    .budget-table th, .budget-table td { border-bottom: 1px solid #E8EAED; padding: 10px 12px; text-align: left; }
    .budget-table th { background: #F8FAFC; font-size: 11px; text-transform: uppercase; color: #64748B; }
    @media print {
      body { padding: 0; background: #FFFFFF; }
      .container { border: none; box-shadow: none; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <div class="hero-top">
        <span class="brand-badge">RoamWise • Illustrated Travel & Pilgrimage Dossier</span>
      </div>
      <div class="hero-bottom">
        <h1>${trip.title}</h1>
        <p>${trip.themeTagline}</p>
      </div>
    </div>

    <div class="meta-strip">
      <div class="meta-box">
        <span>Travel Dates & Duration</span>
        <strong>${formatDateRange(trip.startDate, trip.endDate)} (${trip.durationDays} Days)</strong>
      </div>
      <div class="meta-box">
        <span>Hometown → Destination</span>
        <strong>${trip.startCity} → ${trip.destinationName}</strong>
      </div>
      <div class="meta-box">
        <span>Travelers & Style</span>
        <strong>${trip.travelers} (${trip.travelType}) • ${trip.travelPace}</strong>
      </div>
      <div class="meta-box">
        <span>Estimated Total Cost</span>
        <strong>${formatCurrency(totalEstimated, trip.currency)}</strong>
      </div>
    </div>

    <div class="content">
      <div class="route-box">
        <h3>✈️ How to Reach ${transit.destinationName} from Your Hometown (${transit.originCity}) — ~${transit.aerialDistanceKm.toLocaleString()} km</h3>
        <p style="font-size:12.5px;color:#334155;">${transit.routeSummaryNote}</p>
        <div class="route-modes">
          <div class="route-mode-card"><strong>By Flight:</strong><br/>${transit.flightEstimate}</div>
          <div class="route-mode-card"><strong>By Train:</strong><br/>${transit.trainEstimate || "International / Air route"}</div>
          <div class="route-mode-card"><strong>By Road:</strong><br/>${transit.roadEstimate || "Long-distance route"}</div>
        </div>
      </div>

      ${daysHtml}

      <section class="day-section">
        <h3 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;margin-bottom:8px;">Complete Trip Budget Breakdown</h3>
        <table class="budget-table">
          <thead>
            <tr>
              <th>Expense Category</th>
              <th>Details</th>
              <th style="text-align:right;">Estimated Cost</th>
            </tr>
          </thead>
          <tbody>
            ${budgetRowsHtml}
            <tr>
              <td colspan="2"><strong>Total Planned Itinerary Cost (${trip.travelers} Travelers)</strong></td>
              <td style="text-align:right;font-weight:800;color:#087F8C;font-size:15px;">${formatCurrency(
                totalEstimated,
                trip.currency
              )}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</body>
</html>`;
  };

  const handlePrintSaveAsPdf = () => {
    setIsGeneratingPdf(true);
    const html = buildIllustratedHtmlDocument();
    const printWin = window.open("", "_blank", "width=1050,height=850");
    if (!printWin) {
      setIsGeneratingPdf(false);
      window.print();
      return;
    }
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();

    // Wait briefly for all destination and place images to load before opening the Save as PDF dialog
    setTimeout(() => {
      printWin.focus();
      printWin.print();
      setIsGeneratingPdf(false);
    }, 900);
  };

  const handleDownloadIllustratedFile = () => {
    const html = buildIllustratedHtmlDocument();
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = trip.destinationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    a.href = url;
    a.download = `RoamWise-${slug}-Illustrated-Itinerary.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Illustrated PDF Itinerary Preview and Download"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-surface border border-border rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-elevated overflow-hidden">
        {/* Top Action Bar */}
        <div className="px-6 py-4 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-heading">
                Illustrated PDF Itinerary with Place Photos
              </h3>
              <p className="text-xs text-muted">
                Includes high-resolution photos of all {totalStops} places to visit, timings, addresses & hometown route
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handlePrintSaveAsPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>
                {isGeneratingPdf
                  ? "Preparing Photo PDF..."
                  : "Save / Print as PDF (with Photos)"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadIllustratedFile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Illustrated Booklet</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close PDF preview"
              className="p-2 rounded-xl border border-border text-muted hover:text-heading hover:bg-sand/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Magazine-Style Illustrated PDF Preview */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-background space-y-8">
          {/* PDF Cover Header */}
          <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-soft">
            <div className="relative h-60 sm:h-72 w-full">
              <img
                src={trip.heroImage}
                alt={trip.destinationName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider">
                    RoamWise Official Illustrated Travel Plan
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                    {trip.durationDays} Days • {totalStops} Verified Places
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-4xl font-heading font-extrabold">
                    {trip.title}
                  </h2>
                  <p className="text-sm text-white/90 mt-1">
                    {trip.themeTagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Trip Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-sand/40 border-b border-border text-xs">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-muted block">Dates</span>
                  <strong className="text-heading">
                    {formatDateRange(trip.startDate, trip.endDate)}
                  </strong>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-muted block">Hometown Route</span>
                  <strong className="text-heading">
                    {trip.startCity} → {trip.destinationName}
                  </strong>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-muted block">Travelers</span>
                  <strong className="text-heading">
                    {trip.travelers} ({trip.travelType})
                  </strong>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <span className="text-muted block">Estimated Total</span>
                  <strong className="text-heading">
                    {formatCurrency(totalEstimated, trip.currency)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Hometown Transit Summary inside PDF */}
            <div className="p-5 bg-primary/5 border-b border-border">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Hometown-to-Destination Transit ({transit.originCity} →{" "}
                {transit.destinationName} • ~
                {transit.aerialDistanceKm.toLocaleString()} km)
              </p>
              <p className="text-xs text-heading mt-1">
                {transit.routeSummaryNote}
              </p>
            </div>
          </div>

          {/* Day-by-Day Illustrated Schedule with Place Photographs */}
          {trip.days.map((day) => {
            const dayTotal = day.activities.reduce(
              (s, a) => s + a.estimatedCost,
              0
            );
            return (
              <div
                key={day.id}
                className="bg-surface border border-border rounded-3xl overflow-hidden shadow-soft"
              >
                <div className="bg-heading text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-accent text-white text-[11px] font-bold mb-1">
                      DAY {day.dayNumber} • {day.date}
                    </span>
                    <h4 className="text-lg font-heading font-bold">
                      {day.title}
                    </h4>
                    <p className="text-xs text-white/80">{day.summary}</p>
                  </div>
                  <div className="text-xs sm:text-right text-white/90">
                    <p className="font-bold">{day.activities.length} Places to Visit</p>
                    <p>Est. Day Spend: {formatCurrency(dayTotal, trip.currency)}</p>
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                  {day.activities.map((act, idx) => (
                    <div
                      key={act.id}
                      className="grid grid-cols-1 md:grid-cols-12 border border-border rounded-2xl overflow-hidden bg-background"
                    >
                      {/* Place Photograph */}
                      <div className="md:col-span-4 relative h-48 md:h-auto min-h-[175px]">
                        <img
                          src={act.photoUrl}
                          alt={act.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-white text-[11px] font-bold shadow-xs">
                          Stop #{idx + 1}
                        </span>
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-semibold">
                          {act.category}
                        </span>
                      </div>

                      {/* Place Details */}
                      <div className="md:col-span-8 p-4 sm:p-5 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                              <Clock className="w-3.5 h-3.5" />
                              {act.startTime} – {act.endTime} ({act.expectedDuration}{" "}
                              mins)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-sand text-heading text-xs font-bold">
                              {act.estimatedCost === 0
                                ? "Free Entry"
                                : formatCurrency(
                                    act.estimatedCost,
                                    trip.currency
                                  )}
                            </span>
                          </div>

                          <h5 className="text-base sm:text-lg font-heading font-bold text-heading">
                            {act.title}
                          </h5>

                          <p className="text-xs text-muted flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{act.address}</span>
                          </p>

                          <p className="text-xs sm:text-sm text-heading/90 mt-2.5 leading-relaxed">
                            {act.description}
                          </p>

                          {act.notes && (
                            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                <strong>Visitor Tip:</strong> {act.notes}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted font-medium">
                          <span>
                            {act.openingHours
                              ? `Open: ${act.openingHours}`
                              : "Verified Destination Stop"}
                          </span>
                          {act.travelTimeToNext ? (
                            <span className="inline-flex items-center gap-1 text-primary font-semibold">
                              <Navigation className="w-3 h-3" />
                              Next stop: {act.distanceToNextKm} km (~
                              {act.travelTimeToNext} mins)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-success font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Final stop of Day {day.dayNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
