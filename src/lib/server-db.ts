import fs from "fs";
import path from "path";
import crypto from "crypto";
import { GenerationJob, SharedTripLink, Trip, UserProfile } from "./types";

export interface StoredUserAccount extends UserProfile {
  passwordHash: string;
}

interface ServerDatabaseShape {
  users: StoredUserAccount[];
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

export function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(`roamwise_salt_v1:${password}`)
    .digest("hex");
}

function stripPassword(account: StoredUserAccount): UserProfile {
  const { passwordHash: _unused, ...profile } = account;
  return profile;
}

let memoryStore: ServerDatabaseShape | null = null;

async function createEmptyStore(): Promise<ServerDatabaseShape> {
  return {
    users: [],
    trips: [],
    jobs: [],
    sharedLinks: [],
  };
}

export async function getServerStore(): Promise<ServerDatabaseShape> {
  if (memoryStore) return memoryStore;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as ServerDatabaseShape;
      if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.trips)) {
        // Filter out any legacy demo user if present
        parsed.users = parsed.users.filter((u) => u.id !== "user-roamwise-demo");
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch {
    // Re-initialize if corrupted
  }

  memoryStore = await createEmptyStore();
  saveServerStore(memoryStore);
  return memoryStore;
}

export function saveServerStore(store: ServerDatabaseShape): void {
  memoryStore = store;
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Read-only filesystem fallback stays in memoryStore
  }
}

export async function registerUserInStore(input: {
  name: string;
  email: string;
  password: string;
  homeCity?: string;
}): Promise<{ user?: UserProfile; error?: string }> {
  const store = await getServerStore();
  const normalizedEmail = input.email.trim().toLowerCase();

  const existing = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );
  if (existing) {
    return {
      error: "An account with this email already exists. Please sign in instead.",
    };
  }

  const newAccount: StoredUserAccount = {
    id: `user-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`,
    name: input.name.trim(),
    email: normalizedEmail,
    homeCity: input.homeCity?.trim() || "New Delhi",
    preferredCurrency: "INR",
    passwordHash: hashPassword(input.password),
    preferences: {
      favoriteCategories: [
        "Spiritual & Temple Darshan",
        "Nature and Mountains",
        "Food Exploration",
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

  store.users.push(newAccount);
  saveServerStore(store);
  return { user: stripPassword(newAccount) };
}

export async function authenticateUserInStore(input: {
  email: string;
  password: string;
}): Promise<{ user?: UserProfile; error?: string }> {
  const store = await getServerStore();
  const normalizedEmail = input.email.trim().toLowerCase();
  const account = store.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail
  );

  if (!account) {
    return {
      error:
        "No account found with this email address. Please create an account first.",
    };
  }

  if (account.passwordHash !== hashPassword(input.password)) {
    return {
      error: "Incorrect password. Please double-check your password and try again.",
    };
  }

  return { user: stripPassword(account) };
}

export async function getUserByIdFromStore(
  userId: string
): Promise<UserProfile | null> {
  const store = await getServerStore();
  const found = store.users.find((u) => u.id === userId);
  return found ? stripPassword(found) : null;
}

export async function updateUserInStore(
  userId: string,
  partial: Partial<UserProfile>
): Promise<UserProfile | null> {
  const store = await getServerStore();
  const idx = store.users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;

  const current = store.users[idx];
  const updated: StoredUserAccount = {
    ...current,
    ...partial,
    id: current.id,
    passwordHash: current.passwordHash,
    preferences: {
      ...current.preferences,
      ...(partial.preferences || {}),
    },
  };
  store.users[idx] = updated;
  saveServerStore(store);
  return stripPassword(updated);
}

export async function deleteUserInStore(userId: string): Promise<boolean> {
  const store = await getServerStore();
  const beforeCount = store.users.length;
  store.users = store.users.filter((u) => u.id !== userId);
  store.trips = store.trips.filter((t) => t.userId !== userId);
  saveServerStore(store);
  return store.users.length < beforeCount;
}

export async function getTripsForUser(userId: string): Promise<Trip[]> {
  if (!userId) return [];
  const store = await getServerStore();
  return store.trips.filter((t) => t.userId === userId);
}

export async function getTripByIdForUser(
  tripId: string,
  userId: string
): Promise<{ trip: Trip | null; unauthorized: boolean }> {
  const store = await getServerStore();
  const trip = store.trips.find((t) => t.id === tripId);
  if (!trip) return { trip: null, unauthorized: false };
  if (userId && trip.userId && trip.userId !== userId) {
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
  if (userId && target.userId && target.userId !== userId) {
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
