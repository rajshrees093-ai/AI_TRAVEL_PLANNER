"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Compass,
  MapPin,
  Sparkles,
  Users,
  Wallet,
  Route,
  Sliders,
  BookmarkCheck,
  Utensils,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
} from "lucide-react";
import { POPULAR_DESTINATIONS } from "@/lib/destinations-catalog";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { calculateDaysBetween, cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    activeDraft,
    updateActiveDraft,
    resetActiveDraft,
    theme,
    toggleTheme,
  } = useRoamWise();

  const [scrolled, setScrolled] = useState(false);
  const [quickDest, setQuickDest] = useState("Manali");
  const [quickStartDate, setQuickStartDate] = useState(activeDraft.startDate);
  const [quickEndDate, setQuickEndDate] = useState(activeDraft.endDate);
  const [quickBudget, setQuickBudget] = useState(45000);
  const [quickTravelers, setQuickTravelers] = useState(2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleQuickGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = POPULAR_DESTINATIONS.find(
      (d) => d.name.toLowerCase() === quickDest.trim().toLowerCase()
    );
    const duration = Math.max(
      1,
      calculateDaysBetween(quickStartDate, quickEndDate)
    );

    updateActiveDraft({
      destinationPlaceId:
        matched?.placeId ||
        `ChIJ_custom_${quickDest.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
      destinationName: matched?.name || quickDest.trim() || "Manali",
      destinationCountry: matched?.stateOrCountry || "Featured Destination",
      heroImage: matched?.heroImage || POPULAR_DESTINATIONS[0].heroImage,
      startDate: quickStartDate,
      endDate: quickEndDate,
      durationDays: duration > 0 ? duration : 4,
      budgetAmount: Number(quickBudget) || 45000,
      travelers: Number(quickTravelers) || 2,
      currentStep: 3,
    });

    router.push("/create-trip/preferences");
  };

  const handleSelectDestinationCard = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    resetActiveDraft({
      placeId: dest.placeId,
      name: dest.name,
      country: dest.stateOrCountry,
      heroImage: dest.heroImage,
    });
    router.push("/create-trip/dates");
  };

  return (
    <div className="min-h-screen bg-background text-heading flex flex-col">
      {/* Sticky Navigation Bar */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-border py-3.5 shadow-soft"
            : "bg-black/25 backdrop-blur-xs py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <RoamWiseLogo lightText={!scrolled} size="md" />

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            <a
              href="#top"
              className={cn(
                "transition-colors",
                scrolled
                  ? "text-heading hover:text-primary"
                  : "text-white/90 hover:text-white"
              )}
            >
              Home
            </a>
            <a
              href="#destinations"
              className={cn(
                "transition-colors",
                scrolled
                  ? "text-muted hover:text-primary"
                  : "text-white/85 hover:text-white"
              )}
            >
              Explore Destinations
            </a>
            <a
              href="#how-it-works"
              className={cn(
                "transition-colors",
                scrolled
                  ? "text-muted hover:text-primary"
                  : "text-white/85 hover:text-white"
              )}
            >
              How It Works
            </a>
            <a
              href="#features"
              className={cn(
                "transition-colors",
                scrolled
                  ? "text-muted hover:text-primary"
                  : "text-white/85 hover:text-white"
              )}
            >
              Features
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={cn(
                "p-2 rounded-xl border transition-colors",
                scrolled
                  ? "border-border text-muted hover:text-heading bg-background"
                  : "border-white/25 text-white hover:bg-white/10"
              )}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-300" />
              )}
            </button>
            <Link
              href={isAuthenticated ? "/dashboard" : "/login"}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                scrolled
                  ? "text-heading hover:bg-sand/50"
                  : "text-white hover:bg-white/15"
              )}
            >
              {isAuthenticated ? "Dashboard" : "Login"}
            </Link>
            <Link
              href="/create-trip/destination"
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="top"
        className="relative min-h-[88vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />

        <div className="relative z-10 max-w-6xl mx-auto w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-medium mb-6">
              <Compass className="w-4 h-4 text-accent" />
              <span>Explore More. Plan Less. Travel Smarter.</span>
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.08]">
              Your Next Adventure,{" "}
              <span className="font-serif italic font-normal text-sand">
                Perfectly Planned.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
              Tell us where you want to go, what you love, and how much you&apos;d
              like to spend. Let AI create a personalized journey made just for
              you.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/create-trip/destination"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-base shadow-elevated transition-all"
              >
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#destinations"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 font-semibold text-base transition-all"
              >
                <span>Explore Destinations</span>
              </a>
            </div>
          </motion.div>

          {/* Quick Trip Search Widget */}
          <motion.form
            onSubmit={handleQuickGenerate}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="mt-12 bg-surface/95 backdrop-blur-md border border-border rounded-2xl p-4 sm:p-5 shadow-elevated max-w-5xl mx-auto text-left"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
              {/* Destination */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Destination
                </label>
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2.5 focus-within:border-primary">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="text"
                    list="roamwise-hero-destinations"
                    value={quickDest}
                    onChange={(e) => setQuickDest(e.target.value)}
                    placeholder="Where to?"
                    required
                    className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
                  />
                  <datalist id="roamwise-hero-destinations">
                    {POPULAR_DESTINATIONS.map((d) => (
                      <option key={d.placeId} value={d.name}>
                        {d.stateOrCountry}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  Start Date
                </label>
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2.5 focus-within:border-primary">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="date"
                    value={quickStartDate}
                    onChange={(e) => setQuickStartDate(e.target.value)}
                    required
                    className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
                  />
                </div>
              </div>

              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  End Date
                </label>
                <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2.5 focus-within:border-primary">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="date"
                    value={quickEndDate}
                    min={quickStartDate}
                    onChange={(e) => setQuickEndDate(e.target.value)}
                    required
                    className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Budget & Travelers */}
              <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Budget (₹)
                  </label>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-2.5 focus-within:border-primary">
                    <Wallet className="w-3.5 h-3.5 text-primary shrink-0" />
                    <input
                      type="number"
                      min={5000}
                      step={2500}
                      value={quickBudget}
                      onChange={(e) => setQuickBudget(Number(e.target.value))}
                      className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                    Travelers
                  </label>
                  <div className="flex items-center gap-1.5 bg-background border border-border rounded-xl px-2.5 py-2.5 focus-within:border-primary">
                    <Users className="w-3.5 h-3.5 text-primary shrink-0" />
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quickTravelers}
                      onChange={(e) =>
                        setQuickTravelers(Number(e.target.value))
                      }
                      className="bg-transparent text-sm font-medium text-heading focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-1">
                <button
                  type="submit"
                  className="w-full h-[44px] rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Trip</span>
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section
        id="destinations"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Curated Inspiration
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mt-2">
              Where will your next story begin?
            </h2>
          </div>
          <Link
            href="/create-trip/destination"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <span>Search any global destination</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_DESTINATIONS.map((dest) => (
            <button
              key={dest.placeId}
              type="button"
              onClick={() => handleSelectDestinationCard(dest)}
              className="group text-left bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-medium bg-surface/90 backdrop-blur-xs text-heading">
                  {dest.category}
                </span>
                <div className="absolute bottom-3.5 inset-x-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-xl font-heading font-bold leading-tight">
                      {dest.name}
                    </h3>
                    <p className="text-xs text-white/85 mt-0.5">
                      {dest.stateOrCountry}
                    </p>
                  </div>
                  <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted">
                  <span>Best time: {dest.bestMonths}</span>
                  <span className="font-semibold text-primary group-hover:underline">
                    Plan Trip →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-sand/45 border-y border-border px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Simple & Intelligent
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mt-2">
              From inspiration to a complete day-by-day plan in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 01 */}
            <div className="bg-surface border border-border rounded-2xl p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary">
                    01 — Step One
                  </span>
                  <Sliders className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading">
                  Tell Us Your Travel Style
                </h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">
                  Choose your destination, budget, dates, and preferences—from
                  hidden mountain trails to vegetarian cafés.
                </p>
              </div>
              {/* Mini UI component illustration */}
              <div className="mt-6 pt-5 border-t border-border space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-primary text-white text-xs font-medium">
                    ✓ Nature & Mountains
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                    ✓ Hidden Gems
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-background border border-border text-muted text-xs">
                    Balanced Pace
                  </span>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-surface border border-border rounded-2xl p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-accent/15 text-accent">
                    02 — Step Two
                  </span>
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading">
                  Let AI Work Its Magic
                </h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">
                  RoamWise builds a personalized daily itinerary using real
                  places, opening hours, and geographic route clustering.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-border">
                  <span className="flex items-center gap-2 font-medium text-heading">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Verified Places & Routes
                  </span>
                  <span className="text-primary font-semibold">Optimized</span>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-surface border border-border rounded-2xl p-7 shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-success/15 text-success">
                    03 — Step Three
                  </span>
                  <Route className="w-5 h-5 text-success" />
                </div>
                <h3 className="text-xl font-heading font-bold text-heading">
                  Explore Your Journey
                </h3>
                <p className="text-sm text-muted mt-2.5 leading-relaxed">
                  Review your plan, swap activities, visualize daily routes on
                  interactive maps, track your budget, and share with friends.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-border">
                <div className="flex items-center justify-between text-xs bg-background p-2.5 rounded-xl border border-border">
                  <span className="flex items-center gap-1.5 text-heading font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    Day 1 • 4 Verified Stops
                  </span>
                  <span className="text-success font-semibold">On Budget</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section
        id="features"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Built for Modern Travelers
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mt-2">
            Everything you need for a seamless journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI Personalized Itineraries",
              description:
                "Tailored day-by-day schedules crafted around your travel pace, group type, dietary preferences, and personal interests.",
            },
            {
              icon: Wallet,
              title: "Smart Budget Planning",
              description:
                "Category breakdowns across stays, dining, transport, and activities—plus one-click AI Budget Rescue when costs run high.",
            },
            {
              icon: Utensils,
              title: "Real Locations and Restaurants",
              description:
                "Verified attractions, local cafés, and hidden gems with real coordinates, opening hours, and dietary compatibility.",
            },
            {
              icon: Route,
              title: "Interactive Route Maps",
              description:
                "Visualize numbered daily stops, polylines, distances, and travel times across driving, transit, and walking modes.",
            },
            {
              icon: Sliders,
              title: "Easy Trip Customization",
              description:
                "Swap activities, reorder stops, regenerate a single day, or ask the Conversational AI Editor to adjust your schedule.",
            },
            {
              icon: BookmarkCheck,
              title: "Saved Travel Plans",
              description:
                "Persist drafts and completed itineraries, duplicate trips, export printable PDFs, and create revocable share links.",
            },
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-surface border border-border rounded-2xl p-6 shadow-soft hover:border-primary/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-heading font-bold text-heading">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <RoamWiseLogo size="md" />
            <p className="text-sm text-muted mt-3 max-w-sm leading-relaxed">
              Explore More. Plan Less. Travel Smarter. RoamWise combines
              verified geographic data with structured AI planning to turn
              inspiration into realistic, memorable journeys.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/dashboard" className="hover:text-primary">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/create-trip/destination"
                  className="hover:text-primary"
                >
                  Plan New Trip
                </Link>
              </li>
              <li>
                <Link href="/saved-trips" className="hover:text-primary">
                  Saved Trips
                </Link>
              </li>
              <li>
                <Link
                  href="/trips/trip-manali-flagship"
                  className="hover:text-primary"
                >
                  Sample Manali Itinerary
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/login" className="hover:text-primary">
                  Sign In / Create Account
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@roamwise.travel"
                  className="hover:text-primary"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-3">
          <p>© {new Date().getFullYear()} RoamWise Technologies. All rights reserved.</p>
          <p>Powered by Verified Places, Route Optimization & Structured AI.</p>
        </div>
      </footer>
    </div>
  );
}
