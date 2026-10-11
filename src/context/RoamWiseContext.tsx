"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Trip,
  TripWizardDraft,
  UserProfile,
} from "@/lib/types";
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
  refreshTrips: () => Promise<void>;
  getTripById: (tripId: string) => Trip | undefined;
  saveOrUpdateTrip: (trip: Trip, toastLabel?: string) => Promise<Trip>;
  deleteTrip: (tripId: string) => Promise<void>;
  duplicateTrip: (tripId: string) => Promise<Trip | null>;
  signIn: (email: string, nameOverride?: string) => Promise<void>;
  signUp: (name: string, email: string) => Promise<void>;
  signOut: () => void;
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  deleteUserAccount: () => void;
  toasts: ToastMessage[];
  showToast: (
    title: string,
    description?: string,
    type?: "success" | "warning" | "error" | "info"
  ) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_USER: UserProfile = {
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
  createdAt: "2026-01-15T09:00:00.000Z",
};

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
    sightseeingWindow: "09:00 AM – 07:00 PM",
    interests: user?.preferences?.favoriteCategories?.length
      ? [...user.preferences.favoriteCategories]
      : ["Nature and Mountains", "Food Exploration", "Hidden Gems"],
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
  USER: "roamwise_user_v1",
  AUTH_STATE: "roamwise_authenticated_v1",
  TRIPS: "roamwise_saved_trips_v1",
  DRAFTS: "roamwise_drafts_v1",
  ACTIVE_DRAFT: "roamwise_active_draft_v1",
  THEME: "roamwise_theme_v1",
};

export function RoamWiseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);
  const [drafts, setDrafts] = useState<TripWizardDraft[]>([
    {
      ...createInitialDraft(DEFAULT_USER),
      id: "draft-rishikesh-sample",
      currentStep: 3,
      destinationPlaceId: "ChIJfcR22r4lCTkR98B_C-9mH_Q",
      destinationName: "Rishikesh",
      destinationCountry: "Uttarakhand, India",
      heroImage:
        "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
      updatedAt: new Date(Date.now() - 3600_000 * 5).toISOString(),
    },
  ]);
  const [activeDraft, setActiveDraft] = useState<TripWizardDraft>(() =>
    createInitialDraft(DEFAULT_USER)
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

  const refreshTrips = useCallback(async () => {
    setIsLoadingTrips(true);
    try {
      const res = await fetch("/api/trips?userId=user-roamwise-demo");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.trips)) {
          // Merge with any locally edited trips so offline/browser changes are never lost
          const localRaw =
            typeof window !== "undefined"
              ? localStorage.getItem(STORAGE_KEYS.TRIPS)
              : null;
          const localTrips: Trip[] = localRaw ? JSON.parse(localRaw) : [];
          const mergedMap = new Map<string, Trip>();
          data.trips.forEach((t: Trip) => mergedMap.set(t.id, t));
          localTrips.forEach((t: Trip) => mergedMap.set(t.id, t));
          const mergedList = Array.from(mergedMap.values());
          setTrips(mergedList);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              STORAGE_KEYS.TRIPS,
              JSON.stringify(mergedList)
            );
          }
        }
      }
    } catch {
      // Fallback to localStorage trips
      if (typeof window !== "undefined") {
        const localRaw = localStorage.getItem(STORAGE_KEYS.TRIPS);
        if (localRaw) {
          setTrips(JSON.parse(localRaw));
        }
      }
    } finally {
      setIsLoadingTrips(false);
    }
  }, []);

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

    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // Ignore parse error
      }
    }

    const savedAuth = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    if (savedAuth === "false") {
      setIsAuthenticated(false);
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

    refreshTrips();
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
      const recalculated = recalculateTripMetrics({
        ...trip,
        isSaved: true,
        updatedAt: new Date().toISOString(),
      });

      setTrips((prev) => {
        const exists = prev.some((t) => t.id === recalculated.id);
        const next = exists
          ? prev.map((t) => (t.id === recalculated.id ? recalculated : t))
          : [recalculated, ...prev];
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(next));
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
        showToast(toastLabel, `${recalculated.destinationName} itinerary updated.`);
      }
      return recalculated;
    },
    [showToast]
  );

  const deleteTrip = useCallback(
    async (tripId: string) => {
      const target = trips.find((t) => t.id === tripId);
      setTrips((prev) => {
        const next = prev.filter((t) => t.id !== tripId);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(next));
        }
        return next;
      });
      try {
        await fetch(`/api/trips/${tripId}?userId=${user?.id || "user-roamwise-demo"}`, {
          method: "DELETE",
        });
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
        title: `${source.title} (Copy)`,
        status: "DRAFT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveOrUpdateTrip(duplicated, "Trip duplicated");
      return duplicated;
    },
    [trips, saveOrUpdateTrip]
  );

  const signIn = useCallback(
    async (email: string, nameOverride?: string) => {
      setIsAuthLoading(true);
      await new Promise((r) => setTimeout(r, 350));
      const inferredName =
        nameOverride ||
        user?.name ||
        email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

      const nextUser: UserProfile = {
        ...(user || DEFAULT_USER),
        name: inferredName,
        email,
      };
      setUser(nextUser);
      setIsAuthenticated(true);
      setIsAuthLoading(false);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
      }
      showToast(`Welcome back, ${inferredName.split(" ")[0]}!`, "Signed in to RoamWise.");
    },
    [user, showToast]
  );

  const signUp = useCallback(
    async (name: string, email: string) => {
      setIsAuthLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      const nextUser: UserProfile = {
        ...DEFAULT_USER,
        id: `user-${Date.now().toString(36)}`,
        name,
        email,
        createdAt: new Date().toISOString(),
      };
      setUser(nextUser);
      setIsAuthenticated(true);
      setIsAuthLoading(false);

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser));
        localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "true");
      }
      showToast("Account created!", `Welcome to RoamWise, ${name.split(" ")[0]}.`);
    },
    [showToast]
  );

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "false");
    }
    showToast("Signed out", "Your saved trips remain safely stored.", "info");
  }, [showToast]);

  const updateUserProfile = useCallback(
    (partial: Partial<UserProfile>) => {
      setUser((prev) => {
        const base = prev || DEFAULT_USER;
        const next: UserProfile = {
          ...base,
          ...partial,
          preferences: {
            ...base.preferences,
            ...(partial.preferences || {}),
          },
        };
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
        }
        return next;
      });
      showToast("Profile & preferences saved", "Future trip plans will auto-prefill with your settings.");
    },
    [showToast]
  );

  const deleteUserAccount = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    setTrips([]);
    setDrafts([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TRIPS);
      localStorage.removeItem(STORAGE_KEYS.DRAFTS);
      localStorage.setItem(STORAGE_KEYS.AUTH_STATE, "false");
    }
    showToast("Account deleted", "Your account and personal data have been cleared.", "warning");
  }, [showToast]);

  return (
    <RoamWiseContext.Provider
      value={{
        user,
        isAuthenticated,
        isAuthLoading,
        isDemoMode: true,
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
