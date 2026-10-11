"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Sliders,
  Shield,
  Save,
  Sun,
  Moon,
  LogOut,
  Trash2,
  Check,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import { FoodPreference, TravelPace, TravelStyleTier } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Nature and Mountains",
  "Beaches",
  "Adventure",
  "Historical Places",
  "Food Exploration",
  "Shopping",
  "Photography",
  "Relaxation",
  "Art and Culture",
  "Hidden Gems",
];

export default function ProfileAndSettingsPage() {
  const router = useRouter();
  const {
    user,
    theme,
    setThemeMode,
    updateUserProfile,
    signOut,
    deleteUserAccount,
    showToast,
  } = useRoamWise();

  const [name, setName] = useState(user?.name || "Aarav Sharma");
  const [email, setEmail] = useState(user?.email || "aarav@roamwise.travel");
  const [homeCity, setHomeCity] = useState(user?.homeCity || "New Delhi");
  const [preferredCurrency, setPreferredCurrency] = useState(
    user?.preferredCurrency || "INR"
  );

  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(
    user?.preferences?.favoriteCategories || [
      "Nature and Mountains",
      "Food Exploration",
      "Hidden Gems",
    ]
  );
  const [preferredPace, setPreferredPace] = useState<TravelPace>(
    user?.preferences?.preferredPace || "Balanced"
  );
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(
    user?.preferences?.foodPreference || "No Preference"
  );
  const [accessibilityRequirements, setAccessibilityRequirements] = useState(
    user?.preferences?.accessibilityRequirements || ""
  );
  const [defaultBudgetINR, setDefaultBudgetINR] = useState(
    user?.preferences?.defaultBudgetINR || 45000
  );
  const [defaultTravelTier, setDefaultTravelTier] = useState<TravelStyleTier>(
    user?.preferences?.defaultTravelTier || "Comfort"
  );

  const [newPassword, setNewPassword] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setFavoriteCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim(),
      email: email.trim(),
      homeCity: homeCity.trim(),
      preferredCurrency,
      preferences: {
        favoriteCategories,
        preferredPace,
        foodPreference,
        accessibilityRequirements,
        defaultBudgetINR: Number(defaultBudgetINR) || 45000,
        defaultTravelTier,
      },
    });
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast(
        "Password too short",
        "Please enter at least 8 characters.",
        "warning"
      );
      return;
    }
    setNewPassword("");
    showToast("Password updated", "Your account security credentials are saved.");
  };

  return (
    <DashboardWorkspaceLayout
      title="Profile & Settings"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile & Settings" },
      ]}
    >
      <div className="space-y-8 max-w-4xl">
        {/* Section 1: Personal Profile */}
        <form
          onSubmit={handleSaveProfile}
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white font-heading font-extrabold text-xl flex items-center justify-center shadow-sm">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2) || "RW"}
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-heading flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Personal Profile</span>
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Manage your identity, home departure city, and preferred
                  currency.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Preferences</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-heading mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-heading mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-heading mb-1.5">
                Home Departure City
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, London"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-heading mb-1.5">
                Preferred Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
              >
                <option value="INR">INR (₹) — Indian Rupee</option>
                <option value="USD">USD ($) — US Dollar</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="JPY">JPY (¥) — Japanese Yen</option>
              </select>
            </div>
          </div>

          {/* Section 2: Default Travel Preferences */}
          <div className="pt-6 border-t border-border space-y-5">
            <div>
              <h3 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
                <Sliders className="w-5 h-5 text-primary" />
                <span>Saved Travel Preferences (Auto-Prefill)</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Future trip creation wizards will automatically prefill with
                these defaults while allowing per-trip overrides.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-heading mb-2">
                Favorite Travel Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const selected = favoriteCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5",
                        selected
                          ? "bg-primary text-white border-primary"
                          : "bg-background border-border text-muted hover:text-heading"
                      )}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Preferred Trip Pace
                </label>
                <select
                  value={preferredPace}
                  onChange={(e) =>
                    setPreferredPace(e.target.value as TravelPace)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                >
                  <option value="Relaxed">Relaxed</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Packed">Packed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Default Food Preference
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) =>
                    setFoodPreference(e.target.value as FoodPreference)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="No Preference">No Preference</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Default Comfort Style
                </label>
                <select
                  value={defaultTravelTier}
                  onChange={(e) =>
                    setDefaultTravelTier(e.target.value as TravelStyleTier)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                >
                  <option value="Economy">Economy</option>
                  <option value="Comfort">Comfort</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Default Trip Budget ({preferredCurrency})
                </label>
                <input
                  type="number"
                  min={5000}
                  step={2500}
                  value={defaultBudgetINR}
                  onChange={(e) =>
                    setDefaultBudgetINR(Number(e.target.value))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm font-bold text-heading"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-heading mb-1.5">
                  Accessibility Requirements
                </label>
                <input
                  type="text"
                  value={accessibilityRequirements}
                  onChange={(e) =>
                    setAccessibilityRequirements(e.target.value)
                  }
                  placeholder="e.g. Step-free access, elevator required"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Section 3: Account Settings, Theme, Password & Deletion */}
        <div
          id="account-settings"
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-6"
        >
          <div>
            <h3 className="text-lg font-heading font-bold text-heading flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Account & Appearance Settings</span>
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Customize your interface theme, update your password, or manage
              your account data.
            </p>
          </div>

          {/* Theme Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-background border border-border">
            <div>
              <p className="text-sm font-heading font-bold text-heading">
                Interface Appearance
              </p>
              <p className="text-xs text-muted">
                Light mode is RoamWise&apos;s signature warm editorial canvas;
                dark mode is optimized for night travel planning.
              </p>
            </div>
            <div className="inline-flex rounded-xl bg-surface border border-border p-1 shrink-0">
              <button
                type="button"
                onClick={() => setThemeMode("light")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5",
                  theme === "light"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-heading"
                )}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode("dark")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5",
                  theme === "dark"
                    ? "bg-primary text-white"
                    : "text-muted hover:text-heading"
                )}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Password Update */}
          <form
            onSubmit={handleUpdatePassword}
            className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 rounded-xl bg-background border border-border"
          >
            <div className="flex-1">
              <label className="block text-xs font-semibold text-heading mb-1">
                Change Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 8 characters)"
                className="w-full px-3.5 py-2 rounded-xl bg-surface border border-border text-xs sm:text-sm text-heading"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold shrink-0"
            >
              Update Password
            </button>
          </form>

          {/* Logout & Account Deletion */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-sand/40 text-xs font-semibold text-heading"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of RoamWise</span>
            </button>

            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account & Data</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Permanently delete your RoamWise account?"
        description="This will erase your profile, preferences, and saved itineraries from this workspace. This action cannot be undone."
        confirmLabel="Permanently Delete Account"
        variant="danger"
        onConfirm={() => {
          setConfirmDeleteOpen(false);
          deleteUserAccount();
          router.push("/");
        }}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </DashboardWorkspaceLayout>
  );
}
