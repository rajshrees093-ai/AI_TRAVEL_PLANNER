"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
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
  const [email, setEmail] = useState(user?.email || "aarav@routebloom.travel");
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
      <div className="profile-page">
        <div className="welcome-row">
          <div>
            <span className="eyebrow">Account & Preferences</span>
            <h1>Profile & Settings</h1>
            <p>
              Manage your identity, home departure city, and saved defaults for
              future RouteBloom itineraries.
            </p>
          </div>
        </div>

        <div className="profile-layout">
          {/* Left Identity Card */}
          <aside className="profile-card">
            <div className="profile-avatar-large">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || "RB"}
            </div>
            <h3>{name}</h3>
            <p>{email}</p>
            <div className="place-categories" style={{ justifyContent: "center" }}>
              <span className="pill-badge">{homeCity}</span>
              <span className="pill-badge">{preferredCurrency}</span>
              <span className="pill-badge">{preferredPace} Pace</span>
            </div>

            <div style={{ marginTop: "10px", display: "grid", gap: "8px", width: "100%" }}>
              <button
                type="button"
                className={`button ${
                  theme === "light" ? "button-primary" : "button-quiet"
                } button-sm`}
                onClick={() => setThemeMode("light")}
              >
                <Sun className="w-4 h-4" /> Light Editorial Mode
              </button>
              <button
                type="button"
                className={`button ${
                  theme === "dark" ? "button-primary" : "button-quiet"
                } button-sm`}
                onClick={() => setThemeMode("dark")}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
              <button
                type="button"
                className="button button-quiet button-sm"
                onClick={() => {
                  signOut();
                  router.push("/login");
                }}
              >
                <LogOut className="w-4 h-4" /> Sign Out of RouteBloom
              </button>
            </div>
          </aside>

          {/* Right Form Card */}
          <div className="profile-form-card">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Personal Profile</span>
                  <h2>Identity & Saved Travel Defaults</h2>
                </div>
                <button type="submit" className="button button-primary">
                  <Save className="w-4 h-4" /> Save Profile & Preferences
                </button>
              </div>

              <div className="form-grid">
                <label className="form-field">
                  <span>Full Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="form-field">
                  <span>Home Departure City</span>
                  <input
                    type="text"
                    value={homeCity}
                    onChange={(e) => setHomeCity(e.target.value)}
                    placeholder="e.g. New Delhi, Mumbai, London"
                  />
                </label>

                <label className="form-field">
                  <span>Preferred Currency</span>
                  <select
                    value={preferredCurrency}
                    onChange={(e) => setPreferredCurrency(e.target.value)}
                  >
                    <option value="INR">INR (₹) — Indian Rupee</option>
                    <option value="USD">USD ($) — US Dollar</option>
                    <option value="EUR">EUR (€) — Euro</option>
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AED">AED — UAE Dirham</option>
                    <option value="JPY">JPY (¥) — Japanese Yen</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Preferred Trip Pace</span>
                  <select
                    value={preferredPace}
                    onChange={(e) =>
                      setPreferredPace(e.target.value as TravelPace)
                    }
                  >
                    <option value="Relaxed">Relaxed</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Packed">Packed</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Default Food Preference</span>
                  <select
                    value={foodPreference}
                    onChange={(e) =>
                      setFoodPreference(e.target.value as FoodPreference)
                    }
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="No Preference">No Preference</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Default Comfort Style</span>
                  <select
                    value={defaultTravelTier}
                    onChange={(e) =>
                      setDefaultTravelTier(e.target.value as TravelStyleTier)
                    }
                  >
                    <option value="Economy">Economy</option>
                    <option value="Comfort">Comfort</option>
                    <option value="Premium">Premium</option>
                  </select>
                </label>

                <label className="form-field">
                  <span>Default Trip Budget ({preferredCurrency})</span>
                  <input
                    type="number"
                    min={5000}
                    step={2500}
                    value={defaultBudgetINR}
                    onChange={(e) =>
                      setDefaultBudgetINR(Number(e.target.value))
                    }
                  />
                </label>

                <label className="form-field full-span">
                  <span>Accessibility Requirements</span>
                  <input
                    type="text"
                    value={accessibilityRequirements}
                    onChange={(e) =>
                      setAccessibilityRequirements(e.target.value)
                    }
                    placeholder="e.g. Step-free access, elevator required"
                  />
                </label>

                <div className="form-field full-span">
                  <span>Favorite Travel Categories (Auto-Prefill)</span>
                  <div className="interest-row">
                    {CATEGORIES.map((cat) => {
                      const selected = favoriteCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`filter-chip ${selected ? "active" : ""}`}
                          onClick={() => toggleCategory(cat)}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </form>

            {/* Security & Account Danger Zone */}
            <div className="profile-security">
              <form
                onSubmit={handleUpdatePassword}
                style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "12px" }}
              >
                <label className="form-field" style={{ flex: 1, minWidth: "220px" }}>
                  <span>Change Password</span>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 8 characters)"
                  />
                </label>
                <button type="submit" className="button button-primary">
                  Update Password
                </button>
              </form>

              <div className="account-danger" style={{ marginTop: "18px" }}>
                <div>
                  <strong>Delete Account & Data</strong>
                  <p>
                    Erase your profile, preferences, and saved itineraries from
                    this workspace.
                  </p>
                </div>
                <button
                  type="button"
                  className="button button-danger button-sm"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account & Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="Permanently delete your RouteBloom account?"
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
