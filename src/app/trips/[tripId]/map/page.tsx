"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  Car,
  Train,
  Footprints,
  Route,
  Clock,
  ExternalLink,
  Maximize2,
  Sparkles,
  Utensils,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { TripHeaderShell } from "@/components/trip/TripHeaderShell";
import { useRoamWise } from "@/context/RoamWiseContext";
import { optimizeDailyStopsOrder } from "@/lib/ai-engine";
import { VerifiedPlace } from "@/lib/types";
import {
  calculateHaversineKm,
  cn,
  estimateTravelMinutes,
  formatCurrency,
} from "@/lib/utils";

type TravelMode = "DRIVE" | "TRANSIT" | "WALK";

export default function InteractiveTripMapPage({
  params,
}: {
  params: { tripId: string };
}) {
  const { getTripById, saveOrUpdateTrip } = useRoamWise();
  const trip = getTripById(params.tripId);

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("DRIVE");
  const [routeTotals, setRouteTotals] = useState<{
    distanceKm: number;
    durationMinutes: number;
  }>({ distanceKm: 0, durationMinutes: 0 });
  const [zoomScale, setZoomScale] = useState<number>(1);

  const currentDay =
    trip?.days.find((d) => d.dayNumber === selectedDayNum) || trip?.days[0];
  const activities = useMemo(
    () => currentDay?.activities || [],
    [currentDay]
  );

  const activeStop =
    activities.find((a) => a.id === selectedStopId) || activities[0] || null;

  // Fetch route calculation from POST /api/routes whenever day or travel mode changes
  useEffect(() => {
    if (activities.length < 2) {
      setRouteTotals({ distanceKm: 0, durationMinutes: 0 });
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/routes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            travelMode,
            waypoints: activities.map((a) => ({
              placeId: a.placeId,
              title: a.title,
              lat: a.lat,
              lng: a.lng,
            })),
          }),
        });
        if (res.ok && active) {
          const data = await res.json();
          setRouteTotals({
            distanceKm: data.totalDistanceKm || 0,
            durationMinutes: data.totalDurationMinutes || 0,
          });
        }
      } catch {
        // Fallback local calculation
      }
    })();

    return () => {
      active = false;
    };
  }, [activities, travelMode]);

  // Project GPS coordinates to interactive SVG canvas coordinates with automatic bounds fitting
  const projectedPoints = useMemo(() => {
    if (activities.length === 0) return [];
    const lats = activities.map((a) => a.lat);
    const lngs = activities.map((a) => a.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latSpan = Math.max(0.008, maxLat - minLat);
    const lngSpan = Math.max(0.008, maxLng - minLng);

    return activities.map((act, idx) => {
      const normX = (act.lng - minLng) / lngSpan;
      const normY = 1 - (act.lat - minLat) / latSpan;
      const x = Math.round(110 + normX * 580);
      const y = Math.round(85 + normY * 310);
      return {
        ...act,
        index: idx + 1,
        x,
        y,
      };
    });
  }, [activities]);

  const handleOptimizeDayRoute = async () => {
    if (!trip || !currentDay || currentDay.activities.length <= 2) return;
    const asPlaces: VerifiedPlace[] = currentDay.activities.map((a) => ({
      placeId: a.placeId,
      name: a.title,
      destinationSlug: trip.destinationName.toLowerCase(),
      destinationName: trip.destinationName,
      category: a.category,
      subcategory: a.category,
      description: a.description,
      address: a.address,
      lat: a.lat,
      lng: a.lng,
      estimatedCostINR: Math.round(
        a.estimatedCost / Math.max(1, trip.travelers)
      ),
      recommendedDurationMins: a.expectedDuration,
      photoUrl: a.photoUrl,
    }));

    const optimized = optimizeDailyStopsOrder(asPlaces);
    const reordered = currentDay.activities.map((slotAct, idx) => {
      const matched = currentDay.activities.find(
        (x) => x.placeId === optimized[idx].placeId
      )!;
      return {
        ...matched,
        startTime: slotAct.startTime,
        endTime: slotAct.endTime,
        position: idx + 1,
      };
    });

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: reordered } : d
    );

    await saveOrUpdateTrip(
      { ...trip, days: updatedDays },
      `Optimized Day ${currentDay.dayNumber} route order to minimize backtracking!`
    );
  };

  return (
    <DashboardWorkspaceLayout
      title={trip ? `${trip.destinationName} — Interactive Route Map` : "Route Map"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: trip?.destinationName || "Trip", href: `/trips/${params.tripId}` },
        { label: "Interactive Route Map" },
      ]}
    >
      <TripHeaderShell tripId={params.tripId}>
        {trip && currentDay && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel (~35% width on desktop = 4/12 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-surface border border-border rounded-2xl p-5 shadow-soft space-y-5">
              {/* Day Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Select Day to Map
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {trip.days.map((d) => {
                    const active = d.dayNumber === currentDay.dayNumber;
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setSelectedDayNum(d.dayNumber);
                          setSelectedStopId(d.activities[0]?.id || null);
                        }}
                        className={cn(
                          "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors shrink-0",
                          active
                            ? "bg-primary text-white"
                            : "bg-background border border-border text-muted hover:text-heading"
                        )}
                      >
                        Day {d.dayNumber}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Travel Mode Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                  Transportation Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { mode: "DRIVE", label: "Drive", icon: Car },
                      { mode: "TRANSIT", label: "Transit", icon: Train },
                      { mode: "WALK", label: "Walk", icon: Footprints },
                    ] as const
                  ).map((m) => {
                    const Icon = m.icon;
                    const active = travelMode === m.mode;
                    return (
                      <button
                        key={m.mode}
                        type="button"
                        onClick={() => setTravelMode(m.mode)}
                        className={cn(
                          "py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors",
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background text-muted hover:text-heading"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Route Totals & Smart Route Optimizer CTA */}
              <div className="p-3.5 rounded-xl bg-background border border-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted font-medium">
                    Day {currentDay.dayNumber} Total Route
                  </p>
                  <p className="text-sm font-heading font-bold text-heading">
                    {routeTotals.distanceKm} km • ~{routeTotals.durationMinutes}{" "}
                    mins ({travelMode.toLowerCase()})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOptimizeDayRoute}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimize Route</span>
                </button>
              </div>

              {/* Ordered Stop List */}
              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {activities.map((act, idx) => {
                  const isHighlighted = activeStop?.id === act.id;
                  const next = activities[idx + 1];
                  const legDist = next
                    ? calculateHaversineKm(act.lat, act.lng, next.lat, next.lng)
                    : 0;
                  const legTime = next
                    ? estimateTravelMinutes(legDist, travelMode)
                    : 0;

                  return (
                    <div key={act.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedStopId(act.id)}
                        className={cn(
                          "w-full p-3.5 rounded-xl border text-left transition-all flex items-start gap-3",
                          isHighlighted
                            ? "border-primary bg-primary/10 shadow-xs"
                            : "border-border bg-background hover:border-primary/40"
                        )}
                      >
                        <span
                          className={cn(
                            "w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5",
                            act.category === "Restaurant" ||
                              act.category === "Café"
                              ? "bg-accent text-white"
                              : "bg-primary text-white"
                          )}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-semibold text-primary">
                              {act.startTime}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-muted">
                              {act.category}
                            </span>
                          </div>
                          <p className="text-sm font-heading font-bold text-heading truncate mt-0.5">
                            {act.title}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {act.address}
                          </p>
                        </div>
                      </button>

                      {next && (
                        <div className="py-1.5 pl-6 flex items-center gap-1.5 text-[11px] text-muted">
                          <Route className="w-3 h-3 text-primary" />
                          <span>
                            {legDist} km • ~{legTime} mins via{" "}
                            {travelMode.toLowerCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel (~65% width on desktop = 8/12 cols) — Interactive Route Map */}
            <div className="lg:col-span-7 xl:col-span-8 bg-surface border border-border rounded-2xl overflow-hidden shadow-soft flex flex-col">
              {/* Top Map Controls Bar */}
              <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-background">
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                    <span className="w-3 h-3 rounded-full bg-primary inline-block" />
                    Attractions & Sights
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-heading">
                    <span className="w-3 h-3 rounded-full bg-accent inline-block" />
                    Restaurants & Cafés
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomScale(1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-heading hover:bg-sand/40"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    <span>Fit Day {currentDay.dayNumber} Bounds</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setZoomScale((z) => (z < 1.35 ? Number((z + 0.15).toFixed(2)) : 0.9))
                    }
                    className="px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-semibold text-heading hover:bg-sand/40"
                  >
                    Zoom ({Math.round(zoomScale * 100)}%)
                  </button>
                </div>
              </div>

              {/* Interactive Route Canvas with Topographic Grid, Polylines & Numbered Pins */}
              <div className="relative h-[430px] sm:h-[490px] w-full bg-[#E8F1F2] dark:bg-[#101C24] overflow-hidden select-none">
                <svg
                  viewBox="0 0 800 460"
                  className="w-full h-full transition-transform duration-300"
                  style={{ transform: `scale(${zoomScale})` }}
                >
                  <defs>
                    <pattern
                      id="map-grid"
                      width="48"
                      height="48"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 48 0 L 0 0 0 48"
                        fill="none"
                        stroke="rgba(8, 127, 140, 0.10)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>

                  {/* Map Background Grid & Topographic Contour Curves */}
                  <rect width="800" height="460" fill="url(#map-grid)" />
                  <path
                    d="M -20 120 Q 240 40, 480 180 T 820 110"
                    fill="none"
                    stroke="rgba(8, 127, 140, 0.16)"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 60 440 Q 320 290, 590 360 T 830 260"
                    fill="none"
                    stroke="rgba(245, 233, 216, 0.55)"
                    strokeWidth="36"
                    strokeLinecap="round"
                  />

                  {/* Route Polylines Connecting Day Stops */}
                  {projectedPoints.map((pt, idx) => {
                    const next = projectedPoints[idx + 1];
                    if (!next) return null;
                    const midX = (pt.x + next.x) / 2;
                    const midY = (pt.y + next.y) / 2;
                    const dist = calculateHaversineKm(
                      pt.lat,
                      pt.lng,
                      next.lat,
                      next.lng
                    );
                    const mins = estimateTravelMinutes(dist, travelMode);

                    return (
                      <g key={`leg-${pt.id}-${next.id}`}>
                        <line
                          x1={pt.x}
                          y1={pt.y}
                          x2={next.x}
                          y2={next.y}
                          stroke="#087F8C"
                          strokeWidth="4"
                          strokeDasharray={
                            travelMode === "WALK" ? "6 6" : "10 5"
                          }
                        />
                        <rect
                          x={midX - 44}
                          y={midY - 12}
                          width="88"
                          height="22"
                          rx="11"
                          fill="#FFFFFF"
                          stroke="#087F8C"
                          strokeWidth="1.5"
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          textAnchor="middle"
                          className="text-[10px] font-bold fill-[#1F2933]"
                        >
                          {dist}km • {mins}m
                        </text>
                      </g>
                    );
                  })}

                  {/* Numbered Place & Restaurant Markers */}
                  {projectedPoints.map((pt) => {
                    const isSelected = activeStop?.id === pt.id;
                    const isDining =
                      pt.category === "Restaurant" || pt.category === "Café";
                    const pinColor = isDining ? "#FF8066" : "#087F8C";

                    return (
                      <g
                        key={pt.id}
                        onClick={() => setSelectedStopId(pt.id)}
                        className="cursor-pointer"
                      >
                        {isSelected && (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="28"
                            fill={pinColor}
                            opacity="0.22"
                          />
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isSelected ? "19" : "15"}
                          fill={pinColor}
                          stroke="#FFFFFF"
                          strokeWidth="3"
                        />
                        <text
                          x={pt.x}
                          y={pt.y + 4}
                          textAnchor="middle"
                          className="text-xs font-bold fill-white"
                        >
                          {pt.index}
                        </text>
                        <rect
                          x={pt.x - 75}
                          y={pt.y + 22}
                          width="150"
                          height="24"
                          rx="8"
                          fill="#1F2933"
                          opacity="0.9"
                        />
                        <text
                          x={pt.x}
                          y={pt.y + 38}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-white"
                        >
                          {pt.title.length > 22
                            ? `${pt.title.slice(0, 20)}…`
                            : pt.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Destination Coordinate Attribution Overlay */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-xs border border-border text-[11px] font-medium text-heading">
                  {trip.destinationName} • Day {currentDay.dayNumber} Route (
                  {activities.length} stops)
                </div>
              </div>

              {/* Selected Marker Place Detail Preview Drawer */}
              {activeStop && (
                <div className="p-5 bg-surface border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={activeStop.photoUrl}
                      alt={activeStop.title}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-primary text-white text-[11px] font-bold">
                          Stop #{activeStop.position} • {activeStop.startTime}
                        </span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          {activeStop.category === "Restaurant" ||
                          activeStop.category === "Café" ? (
                            <Utensils className="w-3 h-3" />
                          ) : (
                            <MapPin className="w-3 h-3" />
                          )}
                          {activeStop.category}
                        </span>
                      </div>
                      <h4 className="text-base font-heading font-bold text-heading truncate mt-1">
                        {activeStop.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-1">
                        {activeStop.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-primary" />
                          {activeStop.expectedDuration} mins
                        </span>
                        <span>
                          Est.{" "}
                          {formatCurrency(
                            activeStop.estimatedCost,
                            trip.currency
                          )}
                        </span>
                        <span className="font-mono">
                          ({activeStop.lat}, {activeStop.lng})
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${activeStop.title} ${activeStop.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    <span>Navigate in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </TripHeaderShell>
    </DashboardWorkspaceLayout>
  );
}
