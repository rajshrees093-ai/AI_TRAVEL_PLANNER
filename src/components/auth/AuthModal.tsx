"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  User,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { Brand } from "@/components/ui/BrandComponents";
import { WORLDWIDE_CITIES_AND_HOMETOWNS } from "@/lib/destinations-catalog";

export function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    authModalMode,
    authModalRedirect,
    closeAuthModal,
    openAuthModal,
    signIn,
    signUp,
    isAuthLoading,
    activeDraft,
  } = useRoamWise();

  const [mode, setMode] = useState<"login" | "signup">(authModalMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [homeCity, setHomeCity] = useState(activeDraft.startCity || "New Delhi");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync mode whenever parent sets it
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "login") {
      if (!email.trim() || !password) {
        setErrorMsg("Please enter both email and password.");
        return;
      }
      const res = await signIn(email.trim(), password, false);
      if (!res.ok) {
        setErrorMsg(res.error || "Invalid credentials. Please double check.");
        return;
      }
      closeAuthModal();
      if (authModalRedirect) {
        router.push(authModalRedirect);
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      if (password.length < 8) {
        setErrorMsg("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
      const res = await signUp(
        name.trim(),
        email.trim(),
        password,
        homeCity.trim() || "New Delhi"
      );
      if (!res.ok) {
        setErrorMsg(res.error || "Could not create account.");
        return;
      }
      closeAuthModal();
      if (authModalRedirect) {
        router.push(authModalRedirect);
      }
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    const googleEmail = email.trim() || "traveler@routebloom.travel";
    const googleName = name.trim() || "Traveler";
    const res = await signIn(googleEmail, googleName, true);
    if (res.ok) {
      closeAuthModal();
      if (authModalRedirect) {
        router.push(authModalRedirect);
      }
    } else {
      setErrorMsg(res.error || "Google sign in failed.");
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeAuthModal}
          aria-label="Close authentication modal"
        >
          <X size={18} />
        </button>

        <div className="auth-modal-header">
          <div className="brand-center">
            <Brand />
          </div>
          <span className="auth-modal-eyebrow">
            <Sparkles size={13} /> ROUTEBLOOM MEMBER ACCESS
          </span>
          <h2 id="auth-modal-title">
            {mode === "login" ? (
              <>
                Sign in to <em>RouteBloom</em>
              </>
            ) : (
              <>
                Create your <em>RouteBloom</em> account
              </>
            )}
          </h2>
          <p className="auth-modal-sub">
            {mode === "login"
              ? "Sign in to access your customized itineraries, real routes, and travel budget."
              : "Sign up to start planning, save your trips, and explore destinations."}
          </p>

          {activeDraft.destinationName && (
            <div className="auth-destination-pill">
              <MapPin size={14} />
              <span>
                Planning trip to <b>{activeDraft.destinationName}</b>
              </span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={`auth-tab-btn ${mode === "login" ? "active" : ""}`}
              onClick={() => {
                setMode("login");
                setErrorMsg(null);
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              className={`auth-tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setErrorMsg(null);
              }}
            >
              Create Account
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="auth-error-banner" role="alert">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {mode === "signup" && (
            <>
              <label className="auth-input-group">
                <span className="auth-label">
                  <User size={13} /> Full Name
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  autoComplete="name"
                />
              </label>

              <label className="auth-input-group">
                <span className="auth-label">
                  <MapPin size={13} /> Home Departure City
                </span>
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="e.g. New Delhi, Mumbai, London"
                  list="auth-modal-cities"
                />
                <datalist id="auth-modal-cities">
                  {WORLDWIDE_CITIES_AND_HOMETOWNS.slice(0, 50).map((c) => (
                    <option key={c.placeId} value={c.name}>
                      {c.stateOrCountry}
                    </option>
                  ))}
                </datalist>
              </label>
            </>
          )}

          <label className="auth-input-group">
            <span className="auth-label">
              <Mail size={13} /> Email Address
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-input-group">
            <span className="auth-label">
              <Lock size={13} /> Password
            </span>
            <div className="auth-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 8 characters)"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                className="auth-pw-toggle"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </label>

          {mode === "signup" && (
            <label className="auth-input-group">
              <span className="auth-label">
                <Lock size={13} /> Confirm Password
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
          )}

          <button
            type="submit"
            className="button button-primary button-wide auth-submit-btn"
            disabled={isAuthLoading}
          >
            {isAuthLoading ? (
              "Please wait…"
            ) : mode === "login" ? (
              <>
                Sign in to RouteBloom <ArrowRight size={16} />
              </>
            ) : (
              <>
                Create free account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-modal-divider">
          <span />
          <b>OR</b>
          <span />
        </div>

        <button
          type="button"
          className="button button-outline button-wide google-btn"
          onClick={handleGoogleAuth}
          disabled={isAuthLoading}
        >
          <Globe2 size={16} /> Continue with Google
        </button>

        <div className="auth-modal-footer">
          {mode === "login" ? (
            <p>
              Don’t have an account yet?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
              >
                Create one now →
              </button>
            </p>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                }}
              >
                Sign in here →
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
