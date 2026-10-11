"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Globe2,
  Sparkles,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { signupSchema } from "@/lib/validations";
import { WORLDWIDE_CITIES_AND_HOMETOWNS } from "@/lib/destinations-catalog";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, activeDraft, updateActiveDraft, isAuthLoading } =
    useRoamWise();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [homeCity, setHomeCity] = useState(activeDraft.startCity || "New Delhi");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/create-trip/destination");
  const [pendingDest, setPendingDest] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      const dest = params.get("dest");
      if (redir) setRedirectPath(redir);
      if (dest) setPendingDest(dest);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!parsed.success) {
      setErrorMsg(
        parsed.error.issues[0]?.message || "Please check your inputs."
      );
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

    if (homeCity.trim()) {
      updateActiveDraft({ startCity: homeCity.trim() });
    }

    // If user already picked a destination on the dashboard, go straight to Step 2 (Dates), otherwise Step 1 (Destination)
    if (activeDraft.destinationPlaceId && redirectPath === "/create-trip/destination") {
      router.push("/create-trip/dates");
    } else {
      router.push(redirectPath || "/create-trip/destination");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/40" />

        <div className="relative z-10">
          <RoamWiseLogo lightText size="lg" />
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-sand mb-3">
            Start Your Travel Collection
          </p>
          <h1 className="text-4xl font-heading font-extrabold leading-tight">
            &ldquo;Every great journey begins with a plan.&rdquo;
          </h1>
          <p className="text-base text-white/85 mt-4 leading-relaxed">
            Create your personal RoamWise account to unlock step-by-step AI trip
            planning, customize daily schedules, and download illustrated PDF
            itineraries with photos of every place you&apos;ll visit.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <RoamWiseLogo size="md" />
          </div>

          {(pendingDest || activeDraft.destinationName) && (
            <div className="mb-4 p-3.5 rounded-2xl bg-primary/10 border border-primary/25 flex items-center gap-2.5 text-xs font-medium text-heading">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>
                Create your account to continue planning your trip to{" "}
                <strong className="font-bold text-primary">
                  {pendingDest || activeDraft.destinationName}
                </strong>
                .
              </span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
            Create your RoamWise account
          </h2>
          <p className="text-sm text-muted mt-1.5">
            Your profile details and itineraries are stored securely in our backend.
          </p>

          {errorMsg && (
            <div
              role="alert"
              className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Full Name
              </label>
              <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <User className="w-4 h-4 text-muted shrink-0" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="bg-transparent text-sm text-heading focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Email Address
              </label>
              <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <Mail className="w-4 h-4 text-muted shrink-0" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-transparent text-sm text-heading focus:outline-none w-full"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-hometown"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Your Hometown / Starting City
              </label>
              <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <Globe2 className="w-4 h-4 text-muted shrink-0" />
                <input
                  id="signup-hometown"
                  type="text"
                  list="signup-hometown-options"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  placeholder="e.g. New Delhi, Mumbai, Bengaluru, London..."
                  required
                  className="bg-transparent text-sm text-heading focus:outline-none w-full"
                />
                <datalist id="signup-hometown-options">
                  {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                    <option key={c.placeId} value={c.name}>
                      {c.stateOrCountry}
                    </option>
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Password (min 8 chars, 1 uppercase, 1 number)
              </label>
              <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <Lock className="w-4 h-4 text-muted shrink-0" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. Travel2026"
                  required
                  className="bg-transparent text-sm text-heading focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-muted hover:text-heading p-0.5"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirm"
                className="block text-xs font-semibold text-heading mb-1.5"
              >
                Confirm Password
              </label>
              <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                <Lock className="w-4 h-4 text-muted shrink-0" />
                <input
                  id="signup-confirm"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="bg-transparent text-sm text-heading focus:outline-none w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>
                {isAuthLoading
                  ? "Saving Account & Opening Planner..."
                  : "Create Account & Continue to Planner"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectPath)}${pendingDest ? `&dest=${encodeURIComponent(pendingDest)}` : ""}`}
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/dashboard"
              className="text-xs text-muted hover:text-heading"
            >
              ← Back to Dashboard Showcase
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
