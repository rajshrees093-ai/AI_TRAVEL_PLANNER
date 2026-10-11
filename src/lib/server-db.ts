import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GenerationJob, SharedTripLink, Trip, UserProfile } from "./types";
import { generateCompleteTripItinerary } from "./ai-engine";

interface ServerDatabaseShape {
  users: UserProfile[];
  trips: Trip[];
  jobs: GenerationJob[];
  sharedLinks: SharedTripLink[];
}

const DB_FILE_PATH = path.join(process.cwd(), ".roamwise-data.json");

// Rate limiting map in memory: userId -> timestamps[]
const generationRateLimitMap = new Map<string, number[]>();

export function checkRateLimit(userId: string, maxRequestsPerMinute = 10): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const recent = (generationRateLimitMap.get(userId) || []).filter(
    (t) => t > windowStart
  );
  if (recent.length >= maxRequestsPerMinute) {
    return false;
  }
  recent.push(now);
  generationRateLimitMap.set(userId, recent);
  return true;
}

export function hashShareToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

let memoryStore: ServerDatabaseShape | null = null;

async function createSeedStore(): Promise<ServerDatabaseShape> {
  const defaultUser: UserProfile = {
    id: "user-roamwise-demo",
    name: "Aarav Sharma",
    email: "aarav@roamwise.travel",
    homeCity: "New Delhi",
    preferredCurrency: "INR",
    preferences: {
      favoriteCategories: [
        "Nature and Mountains",
        "Food Exploration",
        "Hidden Gems",
        "Historical Places",
      ],
      preferredPace: "Balanced",
      foodPreference: "No Preference",
      accessibilityRequirements: "",
      defaultBudgetINR: 45000,
      defaultTravelTier: "Comfort",
    },
    createdAt: new Date().toISOString(),
  };

  const manaliTrip = await generateCompleteTripItinerary(
    {
      destinationPlaceId: "ChIJp7jK8l7vBDkR0xV1m8kY8mM",
      destinationName: "Manali",
      destinationCountry: "Himachal Pradesh, India",
      startCity: "New Delhi",
      startDate: "2026-11-12",
      endDate: "2026-11-15",
      travelers: 2,
      travelType: "Couple",
      interests: [
        "Nature and Mountains",
        "Food Exploration",
        "Hidden Gems",
        "Photography",
      ],
      travelPace: "Balanced",
      foodPreference: "No Preference",
      specialInstructions:
        "Prefer scenic cedar forest trails, authentic riverside cafés, and uncrowded viewpoints.",
      budgetAmount: 42000,
      budgetMode: "TOTAL",
      currency: "INR",
      travelTier: "Comfort",
      includedExpenses: [
        "Accommodation",
        "Food",
        "Activities",
        "Local transport",
      ],
    },
    defaultUser.id
  );
  manaliTrip.id = "trip-manali-flagship";
  manaliTrip.status = "UPCOMING";

  const goaTrip = await generateCompleteTripItinerary(
    {
      destinationPlaceId: "ChIJQbc2YxC6vzsRkkDzYv-H-Oo",
      destinationName: "Goa",
      destinationCountry: "Goa, India",
      startCity: "Mumbai",
      startDate: "2026-12-04",
      endDate: "2026-12-06",
      travelers: 4,
      travelType: "Friends",
      interests: [
        "Beaches",
        "Historical Places",
        "Food Exploration",
        "Hidden Gems",
      ],
      travelPace: "Relaxed",
      foodPreference: "No Preference",
      specialInstructions:
        "Include Fontainhas Latin Quarter and quiet South Goa lagoons.",
      budgetAmount: 68000,
      budgetMode: "TOTAL",
      currency: "INR",
      travelTier: "Comfort",
      includedExpenses: [
        "Accommodation",
        "Food",
        "Activities",
        "Local transport",
      ],
    },
    defaultUser.id
  );
  goaTrip.id = "trip-goa-coastal";
  goaTrip.status = "PLANNED";

  const jaipurTrip = await generateCompleteTripItinerary(
    {
      destinationPlaceId: "ChIJgeJXTN9KbDkRCS7yDDrG4cI",
      destinationName: "Jaipur",
      destinationCountry: "Rajasthan, India",
      startCity: "New Delhi",
      startDate: "2026-09-10",
      endDate: "2026-09-12",
      travelers: 2,
      travelType: "Family",
      interests: ["Historical Places", "Art and Culture", "Food Exploration"],
      travelPace: "Balanced",
      foodPreference: "Vegetarian",
      budgetAmount: 36000,
      budgetMode: "TOTAL",
      currency: "INR",
      travelTier: "Comfort",
      includedExpenses: ["Accommodation", "Food", "Activities", "Local transport"],
    },
    defaultUser.id
  );
  jaipurTrip.id = "trip-jaipur-royal";
  jaipurTrip.status = "COMPLETED";

  const demoShareToken = "roamwise-manali-escape-demo";
  const demoSharedLink: SharedTripLink = {
    id: "share-demo-1",
    tripId: manaliTrip.id,
    token: demoShareToken,
    accessTokenHash: hashShareToken(demoShareToken),
    includeBudget: true,
    allowCollaboration: true,
    isRevoked: false,
    createdAt: new Date().toISOString(),
  };
  manaliTrip.sharedLinks = [demoSharedLink];

  return {
    users: [defaultUser],
    trips: [manaliTrip, goaTrip, jaipurTrip],
    jobs: [],
    sharedLinks: [demoSharedLink],
  };
}

export async function getServerStore(): Promise<ServerDatabaseShape> {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as ServerDatabaseShape;
      if (parsed && Array.isArray(parsed.trips) && parsed.trips.length > 0) {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch {
    // Re-seed if corrupted
  }

  memoryStore = await createSeedStore();
  saveServerStore(memoryStore);
  return memoryStore;
}

export function saveServerStore(store: ServerDatabaseShape): void {
  memoryStore = store;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Read-only filesystem fallback (e.g., serverless lambda) stays in memoryStore
  }
}

export async function getTripsForUser(userId: string): Promise<Trip[]> {
  const store = await getServerStore();
  return store.trips.filter(
    (t) => t.userId === userId || t.userId === "user-roamwise-demo"
  );
}

export async function getTripByIdForUser(
  tripId: string,
  userId: string
): Promise<{ trip: Trip | null; unauthorized: boolean }> {
  const store = await getServerStore();
  const trip = store.trips.find((t) => t.id === tripId);
  if (!trip) return { trip: null, unauthorized: false };
  if (
    trip.userId !== userId &&
    trip.userId !== "user-roamwise-demo" &&
    userId !== "user-roamwise-demo"
  ) {
    return { trip: null, unauthorized: true };
  }
  return { trip, unauthorized: false };
}

export async function upsertTripInStore(trip: Trip): Promise<Trip> {
  const store = await getServerStore();
  const idx = store.trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) {
    store.trips[idx] = { ...trip, updatedAt: new Date().toISOString() };
  } else {
    store.trips.unshift(trip);
  }
  saveServerStore(store);
  return trip;
}

export async function deleteTripInStore(
  tripId: string,
  userId: string
): Promise<boolean> {
  const store = await getServerStore();
  const idx = store.trips.findIndex((t) => t.id === tripId);
  if (idx < 0) return false;
  const target = store.trips[idx];
  if (
    target.userId !== userId &&
    target.userId !== "user-roamwise-demo"
  ) {
    return false;
  }
  store.trips.splice(idx, 1);
  saveServerStore(store);
  return true;
}

export async function createOrGetShareLink(
  tripId: string,
  includeBudget: boolean,
  expirationDate?: string
): Promise<SharedTripLink | null> {
  const store = await getServerStore();
  const trip = store.trips.find((t) => t.id === tripId);
  if (!trip) return null;

  const token = `rw-${tripId.slice(-6)}-${crypto.randomBytes(4).toString("hex")}`;
  const link: SharedTripLink = {
    id: `share-${Date.now().toString(36)}`,
    tripId,
    token,
    accessTokenHash: hashShareToken(token),
    includeBudget,
    allowCollaboration: true,
    isRevoked: false,
    expirationDate,
    createdAt: new Date().toISOString(),
  };

  store.sharedLinks.unshift(link);
  trip.sharedLinks = [
    link,
    ...(trip.sharedLinks || []).filter((l) => !l.isRevoked),
  ];
  saveServerStore(store);
  return link;
}

export async function revokeShareToken(
  tripId: string,
  token: string
): Promise<boolean> {
  const store = await getServerStore();
  const hash = hashShareToken(token);
  let found = false;

  store.sharedLinks = store.sharedLinks.map((l) => {
    if (
      l.tripId === tripId &&
      (l.token === token || l.accessTokenHash === hash)
    ) {
      found = true;
      return { ...l, isRevoked: true };
    }
    return l;
  });

  const trip = store.trips.find((t) => t.id === tripId);
  if (trip && trip.sharedLinks) {
    trip.sharedLinks = trip.sharedLinks.map((l) =>
      l.token === token || l.accessTokenHash === hash
        ? { ...l, isRevoked: true }
        : l
    );
  }

  if (found) saveServerStore(store);
  return found;
}

export async function resolveSharedTripByToken(token: string): Promise<{
  trip: Trip | null;
  link: SharedTripLink | null;
  reason?: "NOT_FOUND" | "REVOKED" | "EXPIRED";
}> {
  const store = await getServerStore();
  const hash = hashShareToken(token);
  const link = store.sharedLinks.find(
    (l) => l.token === token || l.accessTokenHash === hash
  );

  if (!link) return { trip: null, link: null, reason: "NOT_FOUND" };
  if (link.isRevoked) return { trip: null, link, reason: "REVOKED" };
  if (link.expirationDate) {
    const exp = new Date(link.expirationDate);
    if (!isNaN(exp.getTime()) && exp.getTime() < Date.now()) {
      return { trip: null, link, reason: "EXPIRED" };
    }
  }

  const trip = store.trips.find((t) => t.id === link.tripId) || null;
  if (!trip) return { trip: null, link, reason: "NOT_FOUND" };

  return { trip, link };
}
