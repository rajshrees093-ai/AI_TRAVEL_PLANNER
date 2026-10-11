"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Trip, TripWizardDraft, UserProfile } from "@/lib/types";
import { recalculateTripMetrics } from "@/lib/ai-engine";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "warning" | "error" | "info";
}

interface RoamWiseContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  isDemoMode: boolean;
  theme: "light" | "dark";
  toggleTheme: () => void;
  setThemeMode: (mode: "light" | "dark") => void;
  trips: Trip[];
  isLoadingTrips: boolean;
  drafts: TripWizardDraft[];
  activeDraft: TripWizardDraft;
  updateActiveDraft: (partial: Partial<TripWizardDraft>) => void;
  resetActiveDraft: (prefillDestination?: {
    placeId: string;
    name: string;
    country: string;
    heroImage?: string;
  }) => void;
  saveDraftToContinueList: () => void;
  removeDraft: (draftId: string) => void;
  refreshTrips: (overrideUserId?: string) => Promise<void>;
  getTripById: (tripId: string) => Trip | undefined;
  saveOrUpdateTrip: (trip: Trip, toastLabel?: string) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  duplicateTrip: (tripId: string) => Promise<Trip | null>;
  signIn: (
    email: string,
    passwordOrNameOverride?: string,
    isOAuth?: boolean
  ) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    name: string,
    email: string,
    password?: string,
    homeCity?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  updateUserProfile: (partial: Partial<UserProfile>) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  toasts: ToastMessage[];
  showToast: (
    title: string,
    description?: string,
    type?: "success" | "warning" | "error" | "info"
  ) => void;
  dismissToast: (id: string) => void;
}

function createInitialDraft(user?: UserProfile | null): TripWizardDraft {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() + 14);
  const end = new Date(start);
  end.setDate(start.getDate() + 3);

  return {
    id: `draft-${Date.now().toString(36)}`,
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    destinationPlaceId: "",
    destinationName: "",
    destinationCountry: "",
    heroImage: "",
    startCity: user?.homeCity || "New Delhi",
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
    durationDays: 4,
    travelers: 2,
    travelType: "Couple",
    sightseeingWindow: "09:00 AM – 07:00 PM (Standard Day)",
    interests: user?.preferences?.favoriteCategories?.length
      ? [...user.preferences.favoriteCategories]
      : [
          "Spiritual & Temple Darshan",
          "Nature and Mountains",
          "Food Exploration",
          "Historical Places",
        ],
    travelPace: user?.preferences?.preferredPace || "Balanced",
    foodPreference: user?.preferences?.foodPreference || "No Preference",
    dietaryRestrictions: "",
    accessibilityNeeds: user?.preferences?.accessibilityRequirements || "",
    specialInstructions: "",
    budgetAmount: user?.preferences?.defaultBudgetINR || 45000,
    budgetMode: "TOTAL",
    currency: user?.preferredCurrency || "INR",
    travelTier: user?.preferences?.defaultTravelTier || "Comfort",
    includedExpenses: [
      "Accommodation",
      "Food",
      "Activities",
      "Local transport",
    ],
  };
}

const RoamWiseContext = createContext<RoamWiseContextValue | undefined>(
  undefined
);

const STORAGE_KEYS = {
  USER: "roamwise_user_v2",
  AUTH_STATE: "roamwise_authenticated_v2",
  TRIPS: "roamwise_saved_trips_v2",
  DRAFTS: "roamwise_drafts_v2",
  ACTIVE_DRAFT: "roamwise_active_draft_v2",
  THEME: "roamwise_theme_v2",
};

export function RoamWiseProvider({ children }: { children: React.ReactNode }) {
  // No demo user by default — user starts unauthenticated until they sign up or log in
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(false);
  const [drafts, setDrafts] = useState<TripWizardDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<TripWizardDraft>(() =>
    createInitialDraft(null)
  );
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (
      title: string,
      description?: string,
      type: "success" | "warning" | "error" | "info" = "success"
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshTrips = useCallback(
    async (overrideUserId?: string) => {
      const targetUserId = overrideUserId ?? user?.id;
      if (!targetUserId) {
        setTrips([]);
        setIsLoadingTrips(false);
        return;
      }

      setIsLoadingTrips(true);
      try {
        const res = await fetch(
          `/api/trips?userId=${encodeURIComponent(targetUserId)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.trips)) {
            const localRaw =
              typeof window !== "undefined"
                ? localStorage.getItem(`${STORAGE_KEYS.TRIPS}_${targetUserId}`)
                : null;
            const localTrips: Trip[] = localRaw ? JSON.parse(localRaw) : [];
            const mergedMap = new Map<string, Trip>();
            data.trips.forEach((t: Trip) => mergedMap.set(t.id, t));
            localTrips.forEach((t: Trip) => {
              if (t.userId === targetUserId) mergedMap.set(t.id, t);
            });
            const mergedList = Array.from(mergedMap.values());
            setTrips(mergedList);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                `${STORAGE_KEYS.TRIPS}_${targetUserId}`,
                JSON.stringify(mergedList)
              );
            }
          }
        }
      } catch {
        if (typeof window !== "undefined") {
          const localRaw = localStorage.getItem(
            `${STORAGE_KEYS.TRIPS}_${targetUserId}`
          );
          if (localRaw) {
            setTrips(JSON.parse(localRaw));
          }
        }
      } finally {
        setIsLoadingTrips(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as
      | "light"
      | "dark"
      | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }

    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    const savedUserRaw = localStorage.getItem(STORAGE_KEYS.USER);

    if (savedAuth === "true" && savedUserRaw) {
      try {
        const parsedUser = JSON.parse(savedUserRaw) as UserProfile;
        if (parsedUser && parsedUser.id && parsedUser.id !== "user-roamwise-demo") {
          setUser(parsedUser);
          setIsAuthenticated(true);
          refreshTrips(parsedUser.id);
        }
      } catch {
        // Ignore parse error
      }
    }

    const savedDraft = localStorage.getItem(STORAGE_KEYS.ACTIVE_DRAFT);
    if (savedDraft) {
      try {
        setActiveDraft(JSON.parse(savedDraft));
      } catch {
        // Ignore
      }
    }

    const savedDraftsList = localStorage.getItem(STORAGE_KEYS.DRAFTS);
    if (savedDraftsList) {
      try {
        setDrafts(JSON.parse(savedDraftsList));
      } catch {
        // Ignore
      }
    }
  }, [refreshTrips]);

  const setThemeMode = useCallback((mode: "light" | "dark") => {
    setTheme(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.THEME, mode);
      document.documentElement.classList.toggle("dark", mode === "dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode(theme === "light" ? "dark" : "light");
  }, [theme, setThemeMode]);

  const updateActiveDraft = useCallback(
    (partial: Partial<TripWizardDraft>) => {
      setActiveDraft((prev) => {
        const updated: TripWizardDraft = {
          ...prev,
          ...partial,
          updatedAt: new Date().toISOString(),
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(
            STORAGE_KEYS.ACTIVE_DRAFT,
            JSON.stringify(updated)
          );
        }
        return updated;
      });
    },
    []
  );

  const resetActiveDraft = useCallback(
    (prefillDestination?: {
      placeId: string;
      name: string;
      country: string;
      heroImage?: string;
    }) => {
      const fresh = createInitialDraft(user);
      if (prefillDestination) {
        fresh.destinationPlaceId = prefillDestination.placeId;
        fresh.destinationName = prefillDestination.name;
        fresh.destinationCountry = prefillDestination.country;
        fresh.heroImage = prefillDestination.heroImage || "";
        fresh.currentStep = 2;
      }
      setActiveDraft(fresh);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_DRAFT, JSON.stringify(fresh));
      }
    },
    [user]
  );

  const saveDraftToContinueList = useCallback(() => {
    if (!activeDraft.destinationName) return;
    setDrafts((prev) => {
      const filtered = prev.filter((d) => d.id !== activeDraft.id);
      const next = [
        { ...activeDraft, updatedAt: new Date().toISOString() },
        ...filtered,
      ];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(next));
      }
      return next;
    });
    showToast(
      "Draft progress saved",
      `You can resume planning ${activeDraft.destinationName} anytime from your Dashboard.`
    );
  }, [activeDraft, showToast]);

  const removeDraft = useCallback((draftId: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== draftId);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getTripById = useCallback(
    (tripId: string) => {
      return trips.find((t) => t.id === tripId);
    },
    [trips]
  );

  const saveOrUpdateTrip = useCallback(
    async (trip: Trip, toastLabel?: string): Promise<Trip> => {
      const ownerId = user?.id || trip.userId || "guest-user";
      const recalculated = recalculateTripMetrics({
        ...trip,
        userId: ownerId,
        isSaved: true,
        updatedAt: new Date().toISOString(),
      });

      setTrips((prev) => {
        const exists = prev.some((t) => t.id === recalculated.id);
        const next = exists
          ? prev.map((t) => (t.id === recalculated.id ? recalculated : t))
          : [recalculated, ...prev];
        if (typeof window !== "undefined" && ownerId) {
          localStorage.setItem(
            `${STORAGE_KEYS.TRIPS}_${ownerId}`,
            JSON.stringify(next)
          );
        }
        return next;
      });

      try {
        await fetch(`/api/trips`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(recalculated),
        });
      } catch {
        // Already persisted in localStorage
      }

      if (toastLabel) {
        showToast(
          toastLabel,
          `${recalculated.destinationName} itinerary saved to your account.`
        );
      }
      return recalculated;
    },
    [user?.id, showToast]
  );

  const deleteTrip = useCallback(
    async (tripId: string) => {
      const target = trips.find((t) => t.id === tripId);
      const ownerId = user?.id || "";
      setTrips((prev) => {
        const next = prev.filter((t) => t.id !== tripId);
        if (typeof window !== "undefined" && ownerId) {
          localStorage.setItem(
            `${STORAGE_KEYS.TRIPS}_${ownerId}`,
            JSON.stringify(next)
          );
        }
        return next;
      });
      try {
        await fetch(
          `/api/trips/${tripId}?userId=${encodeURIComponent(ownerId)}`,
          {
            method: "DELETE",
          }
        );
      } catch {
        // Ignore network error
      }
      showToast(
        "Trip deleted",
        target
          ? `Removed ${target.destinationName} from your travel collection.`
          : "Trip removed.",
        "info"
      );
    },
    [trips, user?.id, showToast]
  );

  const duplicateTrip = useCallback(
    async (tripId: string): Promise<Trip | null> => {
      const source = trips.find((t) => t.id === tripId);
      if (!source) return null;

      const copyId = `trip-${Date.now().toString(36)}-copy`;
      const duplicated: Trip = {
        ...JSON.parse(JSON.stringify(source)),
        id: copyId,
        userId: user?.id || source.userId,
        title: `${source.title} (Copy)`,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveOrUpdateTrip(duplicated, "Trip duplicated");
      return duplicated;
    },
    [trips, user?.id, saveOrUpdateTrip]
  );

  const signUp = useCallback(
    async (
      name: string,
      email: string,
      password = "Password123",
      homeCity = "New Delhi"
    ): Promise<{ ok: boolean; error?: string }> => {
      setIsAuthLoading(true);
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "SIGNUP",
            name: name.trim(),
            email: email.trim(),
            password,
            homeCity,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setIsAuthLoading(false);
          return {
            ok: false,
            error: data.error || "Could not create account.",
          };
        }

        const createdUser: UserProfile = data.user;
        setUser(createdUser);
        setIsAuthenticated(true);
        setIsAuthLoading(false);

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(createdUser));
          localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
        }

        await refreshTrips(createdUser.id);
        showToast(
          "Account created & stored!",
          `Welcome to RoamWise, ${createdUser.name.split(" ")[0]}! Let's plan your trip.`
        );
        return { ok: true };
      } catch (err) {
        setIsAuthLoading(false);
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Signup failed.",
        };
      }
    },
    [refreshTrips, showToast]
  );

  const signIn = useCallback(
    async (
      email: string,
      passwordOrNameOverride = "",
      isOAuth = false
    ): Promise<{ ok: boolean; error?: string }> => {
      setIsAuthLoading(true);
      try {
        if (isOAuth) {
          // For OAuth sign-in, try login first; if account doesn't exist yet, register in backend store
          const loginRes = await fetch("/api/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "LOGIN",
              email: email.trim(),
              password: "OAuth_Google_Verified_2026",
            }),
          });
          if (loginRes.ok) {
            const loginData = await loginRes.json();
            if (loginData.user) {
              setUser(loginData.user);
              setIsAuthenticated(true);
              setIsAuthLoading(false);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  STORAGE_KEYS.USER,
                  JSON.stringify(loginData.user)
                );
                localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
              }
              await refreshTrips(loginData.user.id);
              showToast(
                `Welcome back, ${loginData.user.name.split(" ")[0]}!`,
                "Signed in with Google."
              );
              return { ok: true };
            }
          }
          // Otherwise register OAuth user in backend
          const inferredName =
            passwordOrNameOverride ||
            email
              .split("@")[0]
              .replace(/[._-]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());
          return await signUp(
            inferredName,
            email,
            "OAuth_Google_Verified_2026",
            "New Delhi"
          );
        }

        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "LOGIN",
            email: email.trim(),
            password: passwordOrNameOverride,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setIsAuthLoading(false);
          return {
            ok: false,
            error: data.error || "Invalid email or password.",
          };
        }

        const loggedInUser: UserProfile = data.user;
        setUser(loggedInUser);
        setIsAuthenticated(true);
        setIsAuthLoading(false);

        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
          localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
        }

        await refreshTrips(loggedInUser.id);
        showToast(
          `Welcome back, ${loggedInUser.name.split(" ")[0]}!`,
          "Signed in to your RoamWise workspace."
        );
        return { ok: true };
      } catch (err) {
        setIsAuthLoading(false);
        return {
          ok: false,
          error: err instanceof Error ? err.message : "Sign in failed.",
        };
      }
    },
    [refreshTrips, showToast, signUp]
  );

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setTrips([]);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "false");
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    showToast("Signed out", "Your account and trips remain safely stored in the backend.", "info");
  }, [showToast]);

  const updateUserProfile = useCallback(
    async (partial: Partial<UserProfile>) => {
      if (!user) return;
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "UPDATE_PROFILE",
            userId: user.id,
            updates: partial,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                STORAGE_KEYS.USER,
                JSON.stringify(data.user)
              );
            }
          }
        }
      } catch {
        // Fallback local update
      }
      showToast(
        "Profile & preferences saved",
        "Your updated details have been saved to the backend."
      );
    },
    [user, showToast]
  );

  const deleteUserAccount = useCallback(async () => {
    const currentId = user?.id;
    setIsAuthenticated(false);
    setUser(null);
    setTrips([]);
    setDrafts([]);
    if (currentId) {
      try {
        await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "DELETE_ACCOUNT",
            userId: currentId,
          }),
        });
      } catch {
        // Ignore
      }
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      if (currentId) {
        localStorage.removeItem(`${STORAGE_KEYS.TRIPS}_${currentId}`);
      }
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "false");
    }
    showToast(
      "Account deleted",
      "Your account and personal data have been removed from the backend.",
      "warning"
    );
  }, [user?.id, showToast]);

  return (
    <RoamWiseContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        isDemoMode: false,
        theme,
        toggleTheme,
        setThemeMode,
        trips,
        isLoadingTrips,
        drafts,
        activeDraft,
        updateActiveDraft,
        resetActiveDraft,
        saveDraftToContinueList,
        removeDraft,
        refreshTrips,
        getTripById,
        saveOrUpdateTrip,
        deleteTrip,
        duplicateTrip,
        signIn,
        signUp,
        signOut,
        updateUserProfile,
        deleteUserAccount,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </RoamWiseContext.Provider>
  );
}

export function useRoamWise() {
  const ctx = useContext(RoamWiseContext);
  if (!ctx) {
    throw new Error("useRoamWise must be used within a RoamWiseProvider");
  }
  return ctx;
}
