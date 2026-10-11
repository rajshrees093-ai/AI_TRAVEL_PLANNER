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
  Flame,
  Globe2,
  Camera,
  Search,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import {
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  ALL_DESTINATIONS,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  findDestinationInfo,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { useRoamWise } from "@/context/RoamWiseContext";
import { RoamWiseLogo } from "@/components/ui/BrandComponents";
import { calculateDaysBetween, cn } from "@/lib/utils";

const HERO_LANDING_SCENES = [
  {
    id: "jaipur",
    destinationName: "Jaipur",
    placeLabel: "Hawa Mahal & Amber Fort, Jaipur",
    promoTag: "ROYAL HERITAGE",
    headline: "Royal Palaces, Hilltop Forts & Pink City Bazaars",
    subline:
      "+ Customized Day-by-Day Fort & Palace Route from your hometown\n+ Includes Chokhi Dhani, Nahargarh Sunset & Illustrated Photo PDF",
    photoUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "varanasi",
    destinationName: "Varanasi (Kashi)",
    placeLabel: "Dashashwamedh Ghat & Kashi Vishwanath, Varanasi",
    promoTag: "SACRED DARSHAN",
    headline: "Ancient Ganges Ghats, Evening Aarti & Sacred Temples",
    subline:
      "+ Timed Kashi Vishwanath Sugam Darshan & Sunrise Boat Ride\n+ Includes Sarnath Buddhist Trail & Pure Vegetarian Dining",
    photoUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "goa",
    destinationName: "Goa",
    placeLabel: "Palolem Coastline & Fontainhas Quarter, Goa",
    promoTag: "COASTAL ESCAPE",
    headline: "Sun-Drenched Beaches, Latin Villas & Ocean Cruises",
    subline:
      "+ Curated North & South Goa Coastline + Aguada Fort Sunset\n+ Includes Heritage Cafés, Water Sports & Route Map",
    photoUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    placeLabel: "Sri Harmandir Sahib Golden Temple, Amritsar",
    promoTag: "HOLY PILGRIMAGE",
    headline: "Gleaming Golden Sanctum, Sarovar & Heritage Walk",
    subline:
      "+ Dawn & Night Palki Sahib Darshan + Community Langar Experience\n+ Includes Wagah Border Ceremony & Authentic Kulcha Stops",
    photoUrl:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "bali",
    destinationName: "Bali",
    placeLabel: "Uluwatu Ocean Temple & Ubud Terraces, Bali",
    promoTag: "ISLAND SANCTUARY",
    headline: "Emerald Rice Terraces, Cliff Temples & Turquoise Coves",
    subline:
      "+ Direct Hometown-to-Bali Flight Guidance + Ubud & Uluwatu Split\n+ Includes Tirta Empul Water Temple & Nusa Penida Viewpoints",
    photoUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85",
  },
];

const LANDING_TALL_POSTERS = [
  {
    destinationName: "Dubai",
    headlineLines: ["FUTURISTIC", "DUBAI & SKYLINE", "ESCAPES"],
    priceLabel: "₹6,500",
    sublabel: "EST. DAILY FROM",
    photoUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85",
  },
  {
    destinationName: "Ayodhya",
    headlineLines: ["SACRED AYODHYA", "& VARANASI", "DARSHAN 2026"],
    priceLabel: "₹2,000",
    sublabel: "EST. DAILY FROM",
    photoUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
  },
  {
    destinationName: "Kerala",
    headlineLines: ["BACKWATERS", "& MUNNAR HILLS", "KERALA"],
    priceLabel: "₹3,400",
    sublabel: "EST. DAILY FROM",
    photoUrl:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=85",
  },
  {
    destinationName: "Tokyo",
    headlineLines: ["EXPLORE", "TOKYO, KYOTO", "& ASIA"],
    priceLabel: "₹7,800",
    sublabel: "EST. DAILY FROM",
    photoUrl:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=85",
  },
];

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
  const [heroSceneIdx, setHeroSceneIdx] = useState(0);
  const [showSignInPopup, setShowSignInPopup] = useState(true);
  const [quickStartCity, setQuickStartCity] = useState(
    activeDraft.startCity || "New Delhi"
  );
  const [quickDest, setQuickDest] = useState("");
  const [quickStartDate, setQuickStartDate] = useState(activeDraft.startDate);
  const [quickEndDate, setQuickEndDate] = useState(activeDraft.endDate);
  const [quickBudget, setQuickBudget] = useState(45000);
  const [quickTravelers, setQuickTravelers] = useState(2);
  const [showcaseFilter, setShowcaseFilter] = useState<
    "ALL" | "SACRED" | "LEISURE"
  >("ALL");
  const [hoveredPhotoByDest, setHoveredPhotoByDest] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSceneIdx((prev) => (prev + 1) % HERO_LANDING_SCENES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const currentHero = HERO_LANDING_SCENES[heroSceneIdx];

  const handleQuickGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = findDestinationInfo(
      quickDest.trim() || currentHero.destinationName
    );
    const duration = Math.max(
      1,
      calculateDaysBetween(quickStartDate, quickEndDate)
    );

    updateActiveDraft({
      destinationPlaceId: matched.placeId,
      destinationName: matched.name,
      destinationCountry: matched.stateOrCountry,
      heroImage: matched.heroImage,
      startCity: quickStartCity.trim() || "New Delhi",
      startDate: quickStartDate,
      endDate: quickEndDate,
      durationDays: duration > 0 ? duration : 4,
      budgetAmount: Number(quickBudget) || 45000,
      travelers: Number(quickTravelers) || 2,
      currentStep: 3,
    });

    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent("/create-trip/preferences")}&dest=${encodeURIComponent(matched.name)}`
      );
      return;
    }

    router.push("/create-trip/preferences");
  };

  const handleSelectDestinationCard = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    resetActiveDraft({
      placeId: dest.placeId,
      name: dest.name,
      country: dest.stateOrCountry,
      heroImage: dest.heroImage,
    });
    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent("/create-trip/dates")}&dest=${encodeURIComponent(dest.name)}`
      );
      return;
    }
    router.push("/create-trip/dates");
  };

  const mixedDestinations = (() => {
    const out: typeof POPULAR_DESTINATIONS = [];
    const maxLen = Math.max(
      POPULAR_DESTINATIONS.length,
      SACRED_DESTINATIONS.length
    );
    for (let i = 0; i < maxLen; i++) {
      if (i < POPULAR_DESTINATIONS.length) out.push(POPULAR_DESTINATIONS[i]);
      if (i < SACRED_DESTINATIONS.length) out.push(SACRED_DESTINATIONS[i]);
    }
    return out.slice(0, 20);
  })();

  const displayedDestinations =
    showcaseFilter === "SACRED"
      ? SACRED_DESTINATIONS
      : showcaseFilter === "LEISURE"
      ? POPULAR_DESTINATIONS
      : mixedDestinations;

  return (
    <div className="min-h-screen bg-background text-heading flex flex-col">
      {/* Sticky Navigation Bar */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-b border-border py-3.5 shadow-soft"
            : "bg-black/30 backdrop-blur-xs py-5"
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
              Destinations & Holy Sites
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

          <div className="flex items-center gap-3 relative">
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
              href="/dashboard"
              className={cn(
                "px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors",
                scrolled
                  ? "text-primary hover:bg-primary/10"
                  : "text-white hover:bg-white/15"
              )}
            >
              Dashboard
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login?redirect=/create-trip/destination"
                className={cn(
                  "px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors",
                  scrolled
                    ? "text-heading hover:bg-sand/50"
                    : "text-white hover:bg-white/15"
                )}
              >
                Sign in
              </Link>
            )}
            <Link
              href={
                isAuthenticated
                  ? "/create-trip/destination"
                  : "/signup?redirect=/create-trip/destination"
              }
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-extrabold shadow-sm transition-colors"
            >
              {isAuthenticated ? "Plan New Trip" : "Get Started"}
            </Link>

            {/* Floating "Have an account?" Popover Card under Sign in (Like Reference Image 1) */}
            {!isAuthenticated && showSignInPopup && (
              <div className="hidden sm:block absolute top-14 right-0 w-72 bg-white text-slate-900 rounded-2xl shadow-2xl p-4 pr-8 border border-slate-100 z-50">
                <div className="absolute -top-2 right-24 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => setShowSignInPopup(false)}
                  aria-label="Close sign in prompt"
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      Have an account?
                    </p>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                      Sign in for personalized itineraries, saved trips & Photo
                      PDF downloads.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Link
                        href="/login?redirect=/dashboard"
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        Sign in →
                      </Link>
                      <Link
                        href="/signup?redirect=/dashboard"
                        className="text-xs font-bold text-accent hover:underline"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Real Place Photography + Docked White Search & Calendar Bar (Matching Reference Image 1) */}
      <section
        id="top"
        className="relative min-h-[86vh] flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div
          key={currentHero.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${currentHero.photoUrl}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Real Place Switcher Pills */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-wrap items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/25 text-white text-xs font-bold flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentHero.placeLabel}</span>
          </span>
          {HERO_LANDING_SCENES.map((scene, idx) => (
            <button
              key={scene.id}
              type="button"
              onClick={() => setHeroSceneIdx(idx)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all backdrop-blur-md",
                idx === heroSceneIdx
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-black/45 text-white/90 hover:bg-black/65 border border-white/20"
              )}
            >
              {scene.destinationName.split("(")[0].trim()}
            </button>
          ))}
        </div>

        {/* Left-Aligned Hero Headline & Golden Pill Button */}
        <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8">
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-3.5 py-1 rounded-md bg-gradient-to-r from-pink-500 via-orange-500 to-amber-400 text-white text-xs font-black uppercase tracking-widest shadow-md">
              {currentHero.promoTag} • AI TRAVEL PLANNER
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.08] mt-3 drop-shadow-sm">
              {currentHero.headline}
            </h1>

            <p className="mt-4 text-xs sm:text-base text-white/95 font-medium whitespace-pre-line leading-relaxed">
              {currentHero.subline}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  handleSelectDestinationCard(
                    findDestinationInfo(currentHero.destinationName)
                  )
                }
                className="px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm shadow-xl transition-transform hover:scale-105"
              >
                Plan {currentHero.destinationName.split("(")[0].trim()} Now
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-heading font-bold text-sm transition-colors"
              >
                Open Full Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Docked White Horizontal Search + Calendar Bar at Bottom of Hero (Immediately Visible Like Reference Image 1) */}
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <form
            onSubmit={handleQuickGenerate}
            className="bg-white dark:bg-surface text-slate-900 dark:text-heading rounded-2xl shadow-2xl border border-slate-200/80 dark:border-border p-4 sm:p-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Traveling to */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Traveling to
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <MapPin className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="text"
                    list="roamwise-hero-destinations"
                    value={quickDest}
                    onChange={(e) => setQuickDest(e.target.value)}
                    placeholder="Anywhere (City or Holy Site)"
                    className="bg-transparent text-sm font-bold text-primary dark:text-heading placeholder:text-primary/80 focus:outline-none w-full"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                  <datalist id="roamwise-hero-destinations">
                    {ALL_DESTINATIONS.map((d) => (
                      <option key={d.placeId} value={d.name}>
                        {d.stateOrCountry} • {d.category}
                      </option>
                    ))}
                    {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                      <option key={`city_${c.placeId}`} value={c.name}>
                        {c.stateOrCountry}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Leaving from (Hometown) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Leaving from
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Globe2 className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="text"
                    list="roamwise-hero-hometowns"
                    value={quickStartCity}
                    onChange={(e) => setQuickStartCity(e.target.value)}
                    placeholder="Any hometown"
                    required
                    className="bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none w-full"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                  <datalist id="roamwise-hero-hometowns">
                    {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                      <option key={c.placeId} value={c.name}>
                        {c.stateOrCountry}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Leaving on (Start Date Calendar) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Leaving on (Start Date)
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Calendar className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="date"
                    value={quickStartDate}
                    onChange={(e) => setQuickStartDate(e.target.value)}
                    required
                    className="bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Returning on (End Date Calendar) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Returning on (End Date)
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Calendar className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="date"
                    value={quickEndDate}
                    min={quickStartDate}
                    onChange={(e) => setQuickEndDate(e.target.value)}
                    required
                    className="bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="lg:col-span-1">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Guests
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Users className="w-4 h-4 text-primary mr-1.5 shrink-0" />
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={quickTravelers}
                    onChange={(e) => setQuickTravelers(Number(e.target.value))}
                    className="bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Search Trips Button */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-full bg-[#0057D9] hover:bg-[#0046B0] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Trips</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 4 Tall Vertical Poster Cards + Wide Gradient-Framed Panoramic Banner (Matching Reference Image 2) */}
      <section className="pt-16 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {LANDING_TALL_POSTERS.map((card) => (
            <div
              key={card.destinationName}
              onClick={() =>
                handleSelectDestinationCard(
                  findDestinationInfo(card.destinationName)
                )
              }
              className="group relative h-[430px] rounded-2xl overflow-hidden shadow-elevated cursor-pointer select-none"
            >
              <img
                src={card.photoUrl}
                alt={card.destinationName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

              <div className="absolute inset-x-6 bottom-6 text-white flex flex-col items-start">
                <div className="space-y-0.5">
                  {card.headlineLines.map((line) => (
                    <p
                      key={line}
                      className="text-2xl sm:text-[26px] font-heading font-black uppercase leading-[1.05] tracking-tight drop-shadow-sm"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/85">
                    {card.sublabel}
                  </p>
                  <p className="text-3xl font-heading font-black text-white leading-tight">
                    {card.priceLabel}
                  </p>
                </div>

                <button
                  type="button"
                  className="mt-4 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs shadow-md transition-transform group-hover:scale-105"
                >
                  Plan now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wide Gradient-Framed Panoramic Banner */}
        <div
          onClick={() =>
            handleSelectDestinationCard(
              findDestinationInfo("Kedarnath & Badrinath (Char Dham)")
            )
          }
          className="p-1.5 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-400 to-amber-300 shadow-elevated cursor-pointer group"
        >
          <div className="relative h-[220px] sm:h-[240px] rounded-[20px] overflow-hidden flex items-center justify-between px-6 sm:px-12">
            <img
              src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2000&q=85"
              alt="Char Dham & Global Escapes"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/75" />

            <div className="relative z-10 hidden md:flex items-center gap-4 text-white">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <Compass className="w-9 h-9 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  ROAMWISE SIGNATURE EXPEDITIONS
                </p>
                <p className="text-lg font-heading font-extrabold">
                  Hometown-to-Destination Multi-Modal Routes
                </p>
                <p className="text-xs text-white/80">
                  Flights • Express Trains • Highway Transfers • Photo PDF
                </p>
              </div>
            </div>

            <div className="relative z-10 my-auto">
              <button
                type="button"
                className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs sm:text-sm shadow-xl transition-transform group-hover:scale-105"
              >
                Explore Now
              </button>
            </div>

            <div className="relative z-10 text-right text-white max-w-md">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white/90">
                BACK FOR BOLD & DIVINE ESCAPES
              </p>
              <h4 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight leading-none mt-1">
                CHAR DHAM & GLOBAL WONDERS
              </h4>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-amber-300 mt-1.5">
                INDIA & WORLDWIDE • 2026–2027 SEASON OPEN
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular & Sacred Destinations Section */}
      <section
        id="destinations"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Curated Inspiration & Sacred Pilgrimages
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-heading mt-2">
              Where will your next story begin?
            </h2>
          </div>
          <Link
            href="/create-trip/destination"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            <span>Search any global city or holy place</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 mb-8">
          {[
            { id: "ALL" as const, label: "All Featured Destinations & Holy Sites", icon: Compass },
            { id: "SACRED" as const, label: "Sacred Worship & Pilgrimage Places (21+)", icon: Flame },
            { id: "LEISURE" as const, label: "Mountains, Beaches & Global Cities", icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = showcaseFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setShowcaseFilter(tab.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                  active
                    ? "bg-primary text-white shadow-sm"
                    : "bg-surface border border-border text-muted hover:text-heading hover:bg-sand/40"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedDestinations.map((dest) => {
            const stops = getCandidatePlacesForDestination(dest.name).slice(
              0,
              3
            );
            const activePhoto =
              hoveredPhotoByDest[dest.placeId] || dest.heroImage;
            return (
              <div
                key={dest.placeId}
                onClick={() => handleSelectDestinationCard(dest)}
                className="group cursor-pointer text-left bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={activePhoto}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
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

                {/* 3-Photo Landmark Preview Strip */}
                {stops.length > 0 && (
                  <div className="px-3.5 pt-3 pb-1">
                    <div className="grid grid-cols-3 gap-1.5">
                      {stops.map((s) => (
                        <div
                          key={s.placeId}
                          onMouseEnter={() =>
                            setHoveredPhotoByDest((prev) => ({
                              ...prev,
                              [dest.placeId]: s.photoUrl,
                            }))
                          }
                          onMouseLeave={() =>
                            setHoveredPhotoByDest((prev) => {
                              const next = { ...prev };
                              delete next[dest.placeId];
                              return next;
                            })
                          }
                          className="relative h-12 rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
                          title={s.name}
                        >
                          <img
                            src={s.photoUrl}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                          <span className="absolute bottom-0.5 inset-x-1 text-[8px] font-semibold text-white truncate">
                            {s.name.split("—")[0].trim()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 pt-2.5 flex-1 flex flex-col justify-between">
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
              </div>
            );
          })}
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
