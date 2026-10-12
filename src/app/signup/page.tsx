"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Globe2, Sparkles } from "lucide-react";
import { useRoamWise } from "@/context/RoamWiseContext";
import { Brand } from "@/components/ui/BrandComponents";
import { signupSchema } from "@/lib/validations";
import { WORLDWIDE_CITIES_AND_HOMETOWNS } from "@/lib/destinations-catalog";

const AUTH_DYNAMIC_PHOTOS = [
  "/places/switzerland-lauterbrunnen.jpg",
  "/places/kerala-backwaters.jpg",
  "/places/santorini-oia-caldera.jpg",
  "/places/paris-louvre-pyramid.jpg",
  "/places/jaipur-hawa-mahal.jpg",
  "/places/bali-uluwatu.jpg",
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signIn, activeDraft, updateActiveDraft, isAuthLoading } =
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

    if (
      activeDraft.destinationPlaceId &&
      redirectPath === "/create-trip/destination"
    ) {
      router.push("/create-trip/dates");
    } else {
      router.push(redirectPath || "/create-trip/destination");
    }
  };

  const handleGoogleSignUp = async () => {
    const res = await signIn(
      email.trim() || "traveler@roamwise.app",
      name.trim() || "Traveler",
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
          <span className="eyebrow">MAKE SPACE FOR YOUR NEXT TRIP</span>
          <h1>Let’s get you going.</h1>
          <p className="auth-subtitle">
            Create an account to keep your ideas in one place.
          </p>

          {pendingDest && (
            <div className="demo-callout">
              <Sparkles size={16} />
              <span>
                <b>Destination selected: {pendingDest}.</b> Create your free
                account to continue planning.
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
              <span>Full name</span>
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
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
              <span>
                Home city <small>For route & transit planning</small>
              </span>
              <input
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="e.g. New Delhi, Mumbai, London"
                list="signup-home-city-list"
              />
              <datalist id="signup-home-city-list">
                {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                  <option key={c.placeId} value={c.name}>
                    {c.stateOrCountry}
                  </option>
                ))}
              </datalist>
            </label>
            <label className="form-field">
              <span>
                Password <small>At least 8 characters</small>
              </span>
              <div className="password-field">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
            <label className="form-field">
              <span>Confirm password</span>
              <div className="password-field">
                <input
                  required
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </label>

            <button
              className="button button-primary button-wide"
              type="submit"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? "Please wait…" : "Create account"}
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
            onClick={handleGoogleSignUp}
          >
            <Globe2 size={16} /> Continue with Google
          </button>

          <div className="auth-demo-choice">
            <span>Just exploring?</span>
            <button type="button" onClick={() => router.push("/dashboard")}>
              Explore workspace preview
            </button>
          </div>

          <p className="auth-switch">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/login${
                    redirectPath
                      ? `?redirect=${encodeURIComponent(redirectPath)}`
                      : ""
                  }`
                )
              }
            >
              Sign in
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
