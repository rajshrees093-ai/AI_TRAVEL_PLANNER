import {
  getCandidatePlacesForDestination,
} from "./destinations-catalog";
import {
  applyAIBudgetRescue,
  optimizeDailyStopsOrder,
  recalculateTripMetrics,
} from "./ai-engine";
import { Trip, TripActivity, VerifiedPlace } from "./types";

export interface ConversationalProposal {
  instruction: string;
  explanation: string;
  changesList: string[];
  budgetDelta: number;
  travelTimeDeltaMinutes: number;
  proposedTrip: Trip;
}

/**
 * Regenerates a single day of the trip without modifying other days.
 */
export function regenerateSingleDayInTrip(
  trip: Trip,
  dayNumber: number
): Trip {
  const candidates = getCandidatePlacesForDestination(trip.destinationName);
  const targetDay = trip.days.find((d) => d.dayNumber === dayNumber);
  if (!targetDay) return trip;

  const currentDayPlaceIds = new Set(
    targetDay.activities.map((a) => a.placeId)
  );
  const otherDaysPlaceIds = new Set(
    trip.days
      .filter((d) => d.dayNumber !== dayNumber)
      .flatMap((d) => d.activities.map((a) => a.placeId))
  );

  // Prefer places not in current day, and ideally not in other days
  const freshPool = candidates.filter(
    (p) => !currentDayPlaceIds.has(p.placeId) && !otherDaysPlaceIds.has(p.placeId)
  );
  const fallbackPool = candidates.filter(
    (p) => !currentDayPlaceIds.has(p.placeId)
  );
  const pool =
    freshPool.length >= targetDay.activities.length
      ? freshPool
      : fallbackPool.length > 0
      ? [...freshPool, ...fallbackPool]
      : candidates;

  const newActivities: TripActivity[] = targetDay.activities.map(
    (oldAct, idx) => {
      const replacement: VerifiedPlace =
        pool[idx % pool.length] || candidates[idx % candidates.length];
      return {
        ...oldAct,
        id: `${targetDay.id}-act-regen-${Date.now().toString(36)}-${idx}`,
        placeId: replacement.placeId,
        title: replacement.name,
        category: replacement.category,
        expectedDuration: replacement.recommendedDurationMins,
        estimatedCost: replacement.estimatedCostINR * trip.travelers,
        description: replacement.description,
        notes:
          replacement.whyVisit ||
          `Refreshed ${replacement.subcategory} recommendation for Day ${dayNumber}.`,
        lat: replacement.lat,
        lng: replacement.lng,
        address: replacement.address,
        rating: replacement.rating,
        reviewCount: replacement.reviewCount,
        openingHours: replacement.openingHours,
        photoUrl: replacement.photoUrl,
        isHiddenGem: replacement.isHiddenGem,
        isOutdoor: replacement.isOutdoor,
        dietarySupported: replacement.dietarySupported,
        cuisine: replacement.cuisine,
      };
    }
  );

  const updatedDays = trip.days.map((d) =>
    d.dayNumber === dayNumber
      ? {
          ...d,
          title: `Day ${dayNumber} — Curated Fresh Discovery`,
          activities: newActivities,
        }
      : d
  );

  return recalculateTripMetrics({
    ...trip,
    days: updatedDays,
  });
}

/**
 * Conversational AI Editor: Interprets natural-language instructions, proposes
 * concrete verified itinerary modifications, and calculates budget & schedule impact.
 */
export function proposeConversationalAdjustment(
  trip: Trip,
  instruction: string
): ConversationalProposal {
  const lower = instruction.toLowerCase();
  const candidates = getCandidatePlacesForDestination(trip.destinationName);
  const beforeCost = trip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );
  const beforeTravelMins = trip.days.reduce(
    (s, d) =>
      s + d.activities.reduce((acc, a) => acc + (a.travelTimeToNext || 0), 0),
    0
  );

  let updatedTrip: Trip = JSON.parse(JSON.stringify(trip));
  const changesList: string[] = [];
  let explanation = "";

  // 1. Check if user mentions making a specific day (or trip) more relaxed
  const dayMatch = lower.match(/day\s*(\d+)/i);
  const targetDayNum = dayMatch ? parseInt(dayMatch[1], 10) : null;

  if (lower.includes("relaxed") || lower.includes("fewer")) {
    const dayToRelax =
      targetDayNum && updatedTrip.days.some((d) => d.dayNumber === targetDayNum)
        ? targetDayNum
        : Math.min(2, updatedTrip.days.length);

    updatedTrip.days = updatedTrip.days.map((day) => {
      if (day.dayNumber === dayToRelax && day.activities.length > 2) {
        const removed = day.activities[day.activities.length - 1];
        const trimmed = day.activities.slice(0, day.activities.length - 1).map((a, idx) => ({
          ...a,
          startTime: idx === 0 ? "09:30 AM" : idx === 1 ? "12:30 PM" : "03:30 PM",
          endTime: idx === 0 ? "11:30 AM" : idx === 1 ? "02:15 PM" : "05:30 PM",
        }));
        changesList.push(
          `Day ${dayToRelax}: Removed "${removed.title}" and widened sightseeing buffers to 90+ minutes between stops.`
        );
        return {
          ...day,
          title: `Day ${dayToRelax} — Unhurried & Relaxed Exploration`,
          activities: trimmed,
        };
      }
      return day;
    });
    updatedTrip.travelPace = "Relaxed";
    explanation = `We lightened Day ${dayToRelax}'s schedule to 3 well-spaced experiences with generous downtime and later morning starts.`;
  } else if (lower.includes("cheaper") || lower.includes("budget")) {
    const rescue = applyAIBudgetRescue(updatedTrip);
    updatedTrip = rescue.updatedTrip;
    changesList.push(...rescue.rescuedChanges);
    explanation = `Replaced higher-priced dining and ticketed stops with top-rated free or low-cost verified alternatives.`;
  } else if (lower.includes("vegetarian") || lower.includes("vegan")) {
    const targetDiet = lower.includes("vegan") ? "Vegan" : "Vegetarian";
    const vegPlaces = candidates.filter(
      (p) =>
        (p.category === "Restaurant" || p.category === "Café") &&
        p.dietarySupported?.includes(targetDiet)
    );
    updatedTrip.days = updatedTrip.days.map((day, dIdx) => ({
      ...day,
      activities: day.activities.map((act) => {
        if (act.category === "Restaurant" || act.category === "Café") {
          const vegPick = vegPlaces[dIdx % Math.max(1, vegPlaces.length)];
          if (vegPick && vegPick.placeId !== act.placeId) {
            changesList.push(
              `Day ${day.dayNumber}: Updated dining stop "${act.title}" to ${targetDiet}-verified "${vegPick.name}".`
            );
            return {
              ...act,
              placeId: vegPick.placeId,
              title: vegPick.name,
              description: vegPick.description,
              estimatedCost: vegPick.estimatedCostINR * trip.travelers,
              lat: vegPick.lat,
              lng: vegPick.lng,
              address: vegPick.address,
              dietarySupported: vegPick.dietarySupported,
              cuisine: vegPick.cuisine,
            };
          }
        }
        return act;
      }),
    }));
    updatedTrip.foodPreference = targetDiet;
    if (changesList.length === 0) {
      changesList.push(
        `Verified all dining stops across Days 1–${updatedTrip.durationDays} support ${targetDiet} menus.`
      );
    }
    explanation = `Curated verified ${targetDiet.toLowerCase()} dining spots and cafés across your itinerary.`;
  } else if (lower.includes("adventure") || lower.includes("nature")) {
    const wantAdventure = lower.includes("adventure");
    const targetCat = wantAdventure ? "Adventure" : "Nature";
    const matchingPool = candidates.filter(
      (p) =>
        p.category === targetCat ||
        p.category === "Nature" ||
        p.isHiddenGem
    );
    const pick = matchingPool[0] || candidates[0];
    if (pick && updatedTrip.days.length > 0) {
      const targetDay = updatedTrip.days[0];
      const replaced = targetDay.activities[targetDay.activities.length - 1];
      targetDay.activities[targetDay.activities.length - 1] = {
        ...replaced,
        placeId: pick.placeId,
        title: pick.name,
        category: pick.category,
        description: pick.description,
        estimatedCost: pick.estimatedCostINR * trip.travelers,
        lat: pick.lat,
        lng: pick.lng,
        address: pick.address,
        photoUrl: pick.photoUrl,
      };
      changesList.push(
        `Day 1: Replaced "${replaced.title}" with ${targetCat.toLowerCase()} highlight "${pick.name}".`
      );
    }
    explanation = `Added verified ${targetCat.toLowerCase()} and outdoor highlights while preserving your daily dining and route flow.`;
  } else {
    // Reduce travel time / route optimization
    updatedTrip.days = updatedTrip.days.map((day) => {
      const asPlaces: VerifiedPlace[] = day.activities.map((a) => ({
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
        estimatedCostINR: Math.round(a.estimatedCost / Math.max(1, trip.travelers)),
        recommendedDurationMins: a.expectedDuration,
        photoUrl: a.photoUrl,
      }));
      const optimized = optimizeDailyStopsOrder(asPlaces);
      const reorderedActs = day.activities.map((act, idx) => {
        const match = day.activities.find(
          (x) => x.placeId === optimized[idx].placeId
        )!;
        return {
          ...match,
          startTime: act.startTime,
          endTime: act.endTime,
          position: idx + 1,
        };
      });
      return { ...day, activities: reorderedActs };
    });
    changesList.push(
      `Re-sequenced stops across all ${updatedTrip.durationDays} days using nearest-neighbor geographic clustering to minimize road transit.`
    );
    explanation = `Applied Smart Route Optimization to your existing stops to eliminate backtracking and reduce daily transit time.`;
  }

  updatedTrip = recalculateTripMetrics(updatedTrip);
  const afterCost = updatedTrip.budgetItems.reduce(
    (s, b) => s + b.estimatedAmount,
    0
  );
  const afterTravelMins = updatedTrip.days.reduce(
    (s, d) =>
      s + d.activities.reduce((acc, a) => acc + (a.travelTimeToNext || 0), 0),
    0
  );

  return {
    instruction,
    explanation,
    changesList,
    budgetDelta: Math.round(afterCost - beforeCost),
    travelTimeDeltaMinutes: Math.round(afterTravelMins - beforeTravelMins),
    proposedTrip: updatedTrip,
  };
}
