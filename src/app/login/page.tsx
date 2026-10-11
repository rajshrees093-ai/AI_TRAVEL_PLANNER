"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isAuthLoading, showToast } = useRoamWise();

  const [email, setEmail] = useState("aarav@roamwise.travel");
  const [password, setPassword] = useState("RoamWise2026");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = loginSchema.safeParse({ email, password, rememberMe });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Invalid credentials.");
      return;
    }

    await signIn(email);
    router.push("/dashboard");
  };

  const handleGoogleSignIn = async () => {
    await signIn("aarav@roamwise.travel", "Aarav Sharma");
    router.push("/dashboard");
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
            Discover hidden trails, local culinary gems, and stress-free daily
            routes designed around how you love to explore the world.
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
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-heading">
                Welcome back
              </h2>
              <p className="text-sm text-muted mt-1.5">
                Sign in to access your saved itineraries and travel workspace.
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
                      placeholder="••••••••"
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
                  <span>{isAuthLoading ? "Signing in..." : "Sign In"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-3 text-muted">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-background hover:bg-sand/40 text-heading font-medium text-sm flex items-center justify-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="mt-6 text-center text-xs text-muted">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
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
