"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, activeDraft, isAuthLoading, showToast } = useRoamWise();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
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

    const parsed = loginSchema.safeParse({ email, password, rememberMe });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Invalid credentials.");
      return;
    }

    const res = await signIn(email.trim(), password, false);
    if (!res.ok) {
      setErrorMsg(
        res.error ||
          "Account not found or password incorrect. New here? Click 'Create an account' below."
      );
      return;
    }

    if (
      activeDraft.destinationPlaceId &&
      redirectPath === "/create-trip/destination"
    ) {
      router.push("/create-trip/dates");
    } else {
      router.push(redirectPath || "/create-trip/destination");
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address for password recovery.");
      return;
    }
    setResetSent(true);
    showToast(
      "Password reset link sent",
      `Recovery instructions sent to ${email}.`
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Panel — Immersive Travel Photography */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/40" />

        <div className="relative z-10">
          <RoamWiseLogo lightText size="lg" />
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-sand mb-3">
            Explore More. Plan Less. Travel Smarter.
          </p>
          <h1 className="text-4xl font-heading font-extrabold leading-tight">
            &ldquo;Every great journey begins with a plan.&rdquo;
          </h1>
          <p className="text-base text-white/85 mt-4 leading-relaxed">
            Discover hidden trails, sacred pilgrimage shrines, local culinary
            gems, and stress-free daily routes designed around how you love to
            explore the world.
          </p>
        </div>
      </div>

      {/* Right Panel — Centered Authentication Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <RoamWiseLogo size="md" />
          </div>

          {!forgotMode ? (
            <>
              {(pendingDest || activeDraft.destinationName) && (
                <div className="mb-4 p-3.5 rounded-2xl bg-primary/10 border border-primary/25 flex items-center gap-2.5 text-xs font-medium text-heading">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Sign in to continue planning your trip to{" "}
                    <strong className="font-bold text-primary">
                      {pendingDest || activeDraft.destinationName}
                    </strong>
                    .
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
                Welcome back
              </h2>
              <p className="text-sm text-muted mt-1.5">
                Sign in with your registered email and password to access your travel workspace.
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
                    htmlFor="login-email"
                    className="block text-xs font-semibold text-heading mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                    <Mail className="w-4 h-4 text-muted shrink-0" />
                    <input
                      id="login-email"
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
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-heading mb-1.5"
                  >
                    Password
                  </label>
                  <div className="flex items-center gap-2.5 bg-background border border-border rounded-xl px-3.5 py-2.5 focus-within:border-primary">
                    <Lock className="w-4 h-4 text-muted shrink-0" />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="bg-transparent text-sm text-heading focus:outline-none w-full"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 text-muted cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setErrorMsg(null);
                    }}
                    className="font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span>
                    {isAuthLoading ? "Signing in..." : "Sign In & Continue"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-muted">
                Don&apos;t have an account yet?{" "}
                <Link
                  href={`/signup?redirect=${encodeURIComponent(redirectPath)}${pendingDest ? `&dest=${encodeURIComponent(pendingDest)}` : ""}`}
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
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
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-heading font-bold text-heading">
                Reset your password
              </h2>
              <p className="text-sm text-muted">
                Enter your account email and we&apos;ll send a secure recovery
                link.
              </p>
              {resetSent ? (
                <div className="p-4 rounded-xl bg-success/10 border border-success/30 text-sm text-heading flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Check your inbox</p>
                    <p className="text-xs text-muted mt-0.5">
                      We sent a password reset link to {email}.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-sm text-heading"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-semibold text-sm"
                  >
                    Send Recovery Link
                  </button>
                </form>
              )}
              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setResetSent(false);
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
