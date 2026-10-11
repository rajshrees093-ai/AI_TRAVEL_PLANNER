import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "AED ",
    JPY: "¥",
  };
  const locale = currency === "INR" ? "en-IN" : "en-US";
  const symbol = symbols[currency] || `${currency} `;
  return `${symbol}${Math.round(amount).toLocaleString(locale)}`;
}

export function calculateDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diffTime = end.getTime() - start.getTime();
  if (diffTime < 0) return -1;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

export function formatDateRange(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return "Dates not set";
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Invalid dates";
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  const startOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString("en-US", startOpts)} – ${end.toLocaleDateString("en-US", opts)}`;
}

export function calculateHaversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c * 1.32).toFixed(1)); // 1.32 road winding factor
}

export function estimateTravelMinutes(
  distanceKm: number,
  mode: "DRIVE" | "TRANSIT" | "WALK" = "DRIVE"
): number {
  if (distanceKm <= 0.2) return 5;
  const speedsKmh: Record<"DRIVE" | "TRANSIT" | "WALK", number> = {
    DRIVE: 26, // Urban/scenic average with traffic
    TRANSIT: 20,
    WALK: 4.5,
  };
  return Math.max(5, Math.round((distanceKm / speedsKmh[mode]) * 60));
}

export function getTimeGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
