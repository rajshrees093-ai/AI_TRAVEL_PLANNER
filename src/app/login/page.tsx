"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe2, Sparkles } from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { Brand } from "@/components/ui/BrandComponents";
import { loginSchema } from "@/lib/validations";

const AUTH_DYNAMIC_PHOTOS = [
  "/places/kerala-backwaters.jpg",
  "/places/switzerland-lauterbrunnen.jpg",
  "/places/santorini-oia-caldera.jpg",
  "/places/paris-louvre-pyramid.jpg",
  "/places/jaipur-hawa-mahal.jpg",
  "/places/bali-uluwatu.jpg",
];

export default function LoginPage() {
  const router = useRouter();
  const { signIn, activeDraft, isAuthLoading, showToast } = useRoamWise();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState("/dashboard");
  const [pendingDest, setPendingDest] = useState("");
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect");
      const dest = params.get("dest");
      if (redir) setRedirectPath(redir);
      if (dest) setPendingDest(dest);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % AUTH_DYNAMIC_PHOTOS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = loginSchema.safeParse({
      email,
      password,
      rememberMe: true,
    });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Invalid credentials.");
      return;
    }

    const res = await signIn(email.trim(), password, false);
    if (!res.ok) {
      setErrorMsg(
        res.error ||
          "Account not found or password incorrect. New here? Create an account below."
      );
      return;
    }

    if (
      activeDraft.destinationPlaceId &&
      redirectPath === "/create-trip/destination"
    ) {
      router.push("/create-trip/dates");
    } else {
      router.push(redirectPath || "/dashboard");
    }
  };

  const handleGoogleSignIn = async () => {
    const res = await signIn(
      email.trim() || "traveler@roamwise.app",
      "Traveler",
      true
    );
    if (res.ok) {
      router.push(redirectPath || "/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <aside
        className="auth-photo"
        style={{
          backgroundImage: `linear-gradient(0deg,rgba(12,34,36,.74),rgba(12,34,36,.05)),url('${AUTH_DYNAMIC_PHOTOS[slideIdx]}')`,
          transition: "background-image 0.9s ease-in-out",
        }}
      >
        <button
          type="button"
          className="auth-back"
          onClick={() => router.push("/")}
        >
          <ArrowLeft size={16} /> Back to RouteBloom
        </button>
        <div className="auth-photo-caption">
          <Brand light />
          <span className="eyebrow eyebrow-light">
            NOT EVERY JOURNEY LOOKS THE SAME
          </span>
          <h2>
            Every great journey
            <br />
            begins with <em>a feeling.</em>
          </h2>
          <p>Let the planning feel a little more like the anticipation.</p>
        </div>
      </aside>

      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Brand />
          <span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span>
          <h1>Welcome back.</h1>
          <p className="auth-subtitle">
            Your next good plan is waiting when you are.
          </p>

          {pendingDest && (
            <div className="demo-callout">
              <Sparkles size={16} />
              <span>
                <b>Destination selected: {pendingDest}.</b> Sign in to continue
                building your itinerary.
              </span>
            </div>
          )}

          {errorMsg && (
            <div className="field-error" role="alert" style={{ marginBottom: 12 }}>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="form-field">
              <span>Email address</span>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <label className="form-field">
              <span>Password</span>
              <div className="password-field">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <button
              type="button"
              className="forgot-link"
              onClick={() => {
                if (!email || !email.includes("@")) {
                  showToast(
                    "Enter your email first",
                    "Type your registered email address to request a reset link.",
                    "warning"
                  );
                  return;
                }
                showToast(
                  "Password reset email sent",
                  `If ${email} is registered, recovery instructions are on the way.`
                );
              }}
            >
              Forgot password?
            </button>

            <button
              className="button button-primary button-wide"
              type="submit"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? "Please wait…" : "Sign in"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="auth-divider">
            <span />
            or
            <span />
          </div>
          <button
            type="button"
            className="button button-outline button-wide"
            onClick={handleGoogleSignIn}
          >
            <Globe2 size={16} /> Continue with Google
          </button>

          <div className="auth-demo-choice">
            <span>Want to look around first?</span>
            <button type="button" onClick={() => router.push("/dashboard")}>
              Explore workspace preview
            </button>
          </div>

          <p className="auth-switch">
            New to RouteBloom?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/signup${
                    redirectPath
                      ? `?redirect=${encodeURIComponent(redirectPath)}`
                      : ""
                  }${
                    pendingDest
                      ? `${redirectPath ? "&" : "?"}dest=${encodeURIComponent(
                          pendingDest
                        )}`
                      : ""
                  }`
                )
              }
            >
              Create an account
            </button>
          </p>

          <div className="auth-legal">
            By continuing, you agree to our <a href="#terms">Terms</a> and{" "}
            <a href="#privacy">Privacy Policy.</a>
          </div>
        </div>
      </section>
    </div>
  );
}
