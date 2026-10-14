"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Compass,
  Lock,
  Map,
  MapPin,
  Navigation,
  Pencil,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Users,
  Wallet,
  PlaneTakeoff,
} from "lucide-react";
import { Brand } from "@/components/ui/BrandComponents";
import {
  ALL_DESTINATIONS,
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  findDestinationInfo,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { DestinationInfo } from "@/lib/types";
import { useRoamWise } from "@/context/RoamWiseContext";

const HERO_DYNAMIC_PHOTOS = [
  "/places/manali-solang-valley.jpg",
  "/places/switzerland-lauterbrunnen.jpg",
  "/places/santorini-oia-caldera.jpg",
  "/places/kerala-backwaters.jpg",
  "/places/paris-eiffel-tower.jpg",
  "/places/jaipur-hawa-mahal.jpg",
  "/places/bali-uluwatu.jpg",
  "/places/tokyo-sensoji.jpg",
];

const CLOSING_DYNAMIC_PHOTOS = [
  "/places/kerala-backwaters.jpg",
  "/places/maldives-overwater-lagoon.jpg",
  "/places/turkey-cappadocia-balloons.jpg",
  "/places/udaipur-lake-pichola.jpg",
  "/places/switzerland-matterhorn.jpg",
];

interface CuratedExampleView {
  id: string;
  slug: string;
  name: string;
  destination: string;
  fromCity: string;
  toCity: string;
  fromDate: string;
  toDate: string;
  durationDays: number;
  rupeesBudget: number;
  perPersonRupees: number;
  travelers: number;
  travelerType: string;
  imageUrl: string;
  tag: string;
  highlights: string[];
}

const CURATED_EXAMPLE_VIEWS: CuratedExampleView[] = [
  {
    id: "ex-manali",
    slug: "manali",
    name: "Manali Alpine Valley Retreat",
    destination: "Manali, Himachal Pradesh",
    fromCity: "New Delhi",
    toCity: "Manali",
    fromDate: "15 Nov 2026",
    toDate: "19 Nov 2026",
    durationDays: 4,
    rupeesBudget: 32000,
    perPersonRupees: 16000,
    travelers: 2,
    travelerType: "Couple / Duo",
    imageUrl: "/places/manali-solang-valley.jpg",
    tag: "Snow Valleys & Cafés",
    highlights: ["Solang Valley Adventure", "Old Manali Cafés", "Jogini Waterfall", "Hadimba Temple"],
  },
  {
    id: "ex-switzerland",
    slug: "switzerland",
    name: "Swiss Alpine Glacial Splendor",
    destination: "Lauterbrunnen & Interlaken, Switzerland",
    fromCity: "Mumbai",
    toCity: "Lauterbrunnen",
    fromDate: "05 Dec 2026",
    toDate: "11 Dec 2026",
    durationDays: 6,
    rupeesBudget: 240000,
    perPersonRupees: 120000,
    travelers: 2,
    travelerType: "Couple",
    imageUrl: "/places/switzerland-lauterbrunnen.jpg",
    tag: "Glacial Valleys & Peaks",
    highlights: ["72 Waterfalls Valley", "Jungfraujoch Railway", "Lake Thun Cruise", "Alpine Strolls"],
  },
  {
    id: "ex-santorini",
    slug: "santorini",
    name: "Santorini Aegean Sunset",
    destination: "Oia & Fira, Santorini, Greece",
    fromCity: "New Delhi",
    toCity: "Santorini",
    fromDate: "18 Oct 2026",
    toDate: "23 Oct 2026",
    durationDays: 5,
    rupeesBudget: 195000,
    perPersonRupees: 97500,
    travelers: 2,
    travelerType: "Couple",
    imageUrl: "/places/santorini-oia-caldera.jpg",
    tag: "Caldera & White Domes",
    highlights: ["Oia Castle Sunset", "Red Beach Catamaran", "Fira to Oia Cliff Path", "Cliffside Dining"],
  },
  {
    id: "ex-kerala",
    slug: "kerala",
    name: "Kerala Backwaters & Tea Hills",
    destination: "Alleppey & Munnar, Kerala",
    fromCity: "Bengaluru",
    toCity: "Alleppey",
    fromDate: "20 Nov 2026",
    toDate: "24 Nov 2026",
    durationDays: 4,
    rupeesBudget: 44000,
    perPersonRupees: 11000,
    travelers: 4,
    travelerType: "Family / Group",
    imageUrl: "/places/kerala-backwaters.jpg",
    tag: "Houseboat & Tea Estates",
    highlights: ["Vembanad Houseboat Cruise", "Munnar Tea Plantations", "Fort Kochi Sunset", "Ayurvedic Spa"],
  },
  {
    id: "ex-jaipur",
    slug: "jaipur",
    name: "Jaipur Royal Heritage",
    destination: "Jaipur, Rajasthan",
    fromCity: "New Delhi",
    toCity: "Jaipur",
    fromDate: "28 Oct 2026",
    toDate: "31 Oct 2026",
    durationDays: 3,
    rupeesBudget: 24000,
    perPersonRupees: 12000,
    travelers: 2,
    travelerType: "Weekend Getaway",
    imageUrl: "/places/jaipur-hawa-mahal.jpg",
    tag: "Forts, Palaces & Bazaars",
    highlights: ["Hawa Mahal Morning", "Amer Fort Guided Tour", "City Palace Museum", "Johari Bazaar"],
  },
  {
    id: "ex-paris",
    slug: "paris",
    name: "Parisian Art & Romance",
    destination: "Paris, France",
    fromCity: "Mumbai",
    toCity: "Paris",
    fromDate: "10 Dec 2026",
    toDate: "15 Dec 2026",
    durationDays: 5,
    rupeesBudget: 210000,
    perPersonRupees: 105000,
    travelers: 2,
    travelerType: "Romantic Holiday",
    imageUrl: "/places/paris-eiffel-tower.jpg",
    tag: "Art, Architecture & Cuisine",
    highlights: ["Eiffel Tower Twilight", "Louvre Museum Treasures", "Seine River Cruise", "Montmartre Stroll"],
  },
  {
    id: "ex-bali",
    slug: "bali",
    name: "Bali Tropical Sanctuary",
    destination: "Ubud & Uluwatu, Bali, Indonesia",
    fromCity: "Chennai",
    toCity: "Bali",
    fromDate: "02 Dec 2026",
    toDate: "07 Dec 2026",
    durationDays: 5,
    rupeesBudget: 88000,
    perPersonRupees: 44000,
    travelers: 2,
    travelerType: "Duo / Friends",
    imageUrl: "/places/bali-uluwatu.jpg",
    tag: "Temples & Cliff Coast",
    highlights: ["Uluwatu Sunset Kecak", "Tegalalang Rice Terraces", "Tirta Empul Water Temple", "Seminyak Beach"],
  },
  {
    id: "ex-varanasi",
    slug: "varanasi",
    name: "Varanasi Sacred Riverfront",
    destination: "Varanasi, Uttar Pradesh",
    fromCity: "Kolkata",
    toCity: "Varanasi",
    fromDate: "14 Nov 2026",
    toDate: "17 Nov 2026",
    durationDays: 3,
    rupeesBudget: 18500,
    perPersonRupees: 9250,
    travelers: 2,
    travelerType: "Spiritual Pilgrimage",
    imageUrl: "/places/varanasi-ganga-aarti.jpg",
    tag: "Ghats & Ancient Shrines",
    highlights: ["Dashashwamedh Evening Aarti", "Sunrise Boat on Ganga", "Kashi Vishwanath Corridor", "Sarnath Excursion"],
  },
];

function DestinationDynamicImage({
  dest,
  intervalMs = 3800,
}: {
  dest: DestinationInfo;
  intervalMs?: number;
}) {
  const photos = useMemo(() => {
    const candidates = getCandidatePlacesForDestination(dest.name).filter(
      (p) =>
        p.category !== "Restaurant" &&
        p.category !== "Café" &&
        p.photoUrl.startsWith("/places/")
    );
    const urls = Array.from(
      new Set([dest.heroImage, ...candidates.map((p) => p.photoUrl)])
    ).filter(Boolean);
    return urls.length > 0 ? urls.slice(0, 4) : [dest.heroImage];
  }, [dest]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % photos.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [photos.length, intervalMs]);

  return (
    <img
      src={photos[idx]}
      alt={`${dest.name}, ${dest.stateOrCountry}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, resetActiveDraft, openAuthModal } = useRoamWise();

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const defaultFromDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  }, []);
  const defaultToDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 18);
    return d.toISOString().slice(0, 10);
  }, []);

  const [fromCity, setFromCity] = useState("New Delhi");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [budget, setBudget] = useState("80000");
  const [travellers, setTravellers] = useState("2");
  const [heroIdx, setHeroIdx] = useState(0);
  const [closingIdx, setClosingIdx] = useState(0);
  const [regionFilter, setRegionFilter] = useState<
    "FEATURED" | "ALL" | "INDIA" | "FOREIGN" | "SACRED"
  >("FEATURED");

  useEffect(() => {
    const t1 = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % HERO_DYNAMIC_PHOTOS.length);
    }, 4500);
    const t2 = setInterval(() => {
      setClosingIdx((prev) => (prev + 1) % CLOSING_DYNAMIC_PHOTOS.length);
    }, 5200);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  const calculatedTripDays = useMemo(() => {
    if (!fromDate || !toDate) return 4;
    const d1 = new Date(`${fromDate}T00:00:00`);
    const d2 = new Date(`${toDate}T00:00:00`);
    const diff = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [fromDate, toDate]);

  const displayedDestinations = useMemo(() => {
    if (regionFilter === "FEATURED") {
      return POPULAR_DESTINATIONS.slice(0, 8);
    }
    if (regionFilter === "SACRED") {
      return SACRED_DESTINATIONS;
    }
    if (regionFilter === "INDIA") {
      return ALL_DESTINATIONS.filter((d) =>
        d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    if (regionFilter === "FOREIGN") {
      return ALL_DESTINATIONS.filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    return ALL_DESTINATIONS;
  }, [regionFilter]);

  // If unauthenticated person tries to fill ANY detail, immediately redirect to login/signup
  const handleDetailFieldInteraction = (e?: React.SyntheticEvent) => {
    if (!isAuthenticated) {
      if (e) {
        e.preventDefault();
        if ("blur" in (e.target as HTMLElement)) {
          (e.target as HTMLElement).blur();
        }
      }
      const nextRoute = search.trim() ? "/create-trip/dates" : "/create-trip/destination";
      router.push(
        `/login?redirect=${encodeURIComponent(nextRoute)}&reason=fill_details${
          search.trim() ? `&dest=${encodeURIComponent(search.trim())}` : ""
        }`
      );
      return true;
    }
    return false;
  };

  const beginPlanning = (
    dest?: DestinationInfo,
    prefill?: {
      startCity?: string;
      startDate?: string;
      endDate?: string;
      durationDays?: number;
      budgetAmount?: number;
      travelers?: number;
    }
  ) => {
    let endDate = prefill?.endDate;
    let durationDays = prefill?.durationDays;
    if (prefill?.startDate && !endDate) {
      const end = new Date(`${prefill.startDate}T12:00:00`);
      end.setDate(end.getDate() + 3);
      endDate = end.toISOString().slice(0, 10);
      durationDays = 4;
    }

    resetActiveDraft({
      startCity: prefill?.startCity || fromCity || "New Delhi",
      placeId: dest?.placeId,
      name: dest?.name,
      country: dest?.stateOrCountry,
      heroImage: dest?.heroImage,
      startDate: prefill?.startDate || fromDate,
      endDate: endDate || toDate,
      durationDays: durationDays || calculatedTripDays,
      budgetAmount: prefill?.budgetAmount || (Number(budget) || 80000),
      travelers: prefill?.travelers || (Number(travellers) || 2),
    });

    const nextRoute = dest
      ? "/create-trip/dates"
      : "/create-trip/destination";

    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(nextRoute)}&reason=fill_details${
          dest ? `&dest=${encodeURIComponent(dest.name)}` : ""
        }`
      );
      return;
    }

    router.push(nextRoute);
  };

  const handleQuickPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      handleDetailFieldInteraction(e);
      return;
    }
    const matched = search.trim() ? findDestinationInfo(search.trim()) : undefined;
    beginPlanning(matched, {
      startCity: fromCity.trim() || "New Delhi",
      startDate: fromDate || undefined,
      endDate: toDate || undefined,
      durationDays: calculatedTripDays,
      budgetAmount: Math.max(1000, Number(budget) || 80000),
      travelers: Math.max(1, Number(travellers) || 2),
    });
  };

  const handleExampleCardClick = (ex: CuratedExampleView) => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          "/create-trip/dates"
        )}&reason=fill_details&dest=${encodeURIComponent(ex.toCity)}`
      );
      return;
    }
    const matched = findDestinationInfo(ex.slug) || findDestinationInfo(ex.toCity);
    beginPlanning(matched, {
      startCity: ex.fromCity,
      startDate: ex.fromDate,
      endDate: ex.toDate,
      durationDays: ex.durationDays,
      budgetAmount: ex.rupeesBudget,
      travelers: ex.travelers,
    });
  };

  return (
    <div className="landing-page">
      {/* RouteBloom Official Travel Portal Entrance Gateway */}
      <div className="travel-portal-gateway-bar">
        <div className="portal-gateway-content">
          <div className="portal-live-badge">
            <span className="portal-pulse-dot" />
            <span className="portal-badge-text">ROUTEBLOOM TRAVEL PORTAL · LIVE GATEWAY</span>
          </div>
          <p className="portal-gateway-quote">
            ✦ Official Travel Entrance · Curated Places · From &amp; To Multi-Day Routes · Rupee Accuracy
          </p>
          <div className="portal-quick-actions">
            <a href="#quick-planner" className="portal-action-pill">
              Trip Details Planner ↓
            </a>
            <a href="#example-views" className="portal-action-pill portal-action-accent">
              Example Itineraries View ✦
            </a>
          </div>
        </div>
      </div>

      <nav className="landing-nav">
        <Link href="/" className="brand-anchor">
          <Brand light />
        </Link>
        <div className="landing-links">
          <a href="#example-views">Example view</a>
          <a href="#destinations">Explore destinations</a>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Why RouteBloom</a>
        </div>
        <div className="landing-auth">
          {isAuthenticated ? (
            <button
              type="button"
              className="button button-light"
              onClick={() => router.push("/dashboard")}
            >
              Open workspace <ArrowRight size={15} />
            </button>
          ) : (
            <>
              <button
                type="button"
                className="text-link"
                onClick={() => openAuthModal("login", "/dashboard")}
              >
                Log in
              </button>
              <button
                type="button"
                className="button button-light"
                onClick={() => openAuthModal("signup", "/dashboard")}
              >
                Sign up <ArrowRight size={15} />
              </button>
            </>
          )}
        </div>
      </nav>

      <section
        className="hero"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(13,35,39,.76) 0%, rgba(13,35,39,.38) 52%, rgba(13,35,39,.08) 100%), url('${HERO_DYNAMIC_PHOTOS[heroIdx]}')`,
          transition: "background-image 0.9s ease-in-out",
        }}
      >
        <div className="hero-content">
          <span className="hero-kicker">
            <span className="kicker-line" /> ROUTEBLOOM GLOBAL TRAVEL PORTAL
          </span>
          <h1>
            Your next adventure,
            <br />
            <em>perfectly planned.</em>
          </h1>
          <p>
            Tell us where you want to go, what you love, and how much you’d like
            to spend. Your journey begins with a plan that feels like you.
          </p>
          <div className="hero-ctas">
            <button
              type="button"
              className="button button-coral"
              onClick={() => beginPlanning()}
            >
              Plan my trip <ArrowRight size={16} />
            </button>
            <a className="hero-secondary" href="#example-views">
              View example places <ArrowDownRight size={16} />
            </a>
          </div>
          <div className="hero-footnote">
            <Compass size={15} /> Inspiration in. A trip that feels like yours
            out.
          </div>
        </div>

        <div className="hero-side-note">
          <span>
            {String(heroIdx + 1).padStart(2, "0")} /{" "}
            {String(HERO_DYNAMIC_PHOTOS.length).padStart(2, "0")}
          </span>
          <i />
          <small>
            Unforgettable mornings
            <br />
            look good on you.
          </small>
        </div>

        {/* Highly Visible Detail Section for From & To, Dates, Rupees, and Persons */}
        <form
          id="quick-planner"
          className="quick-plan prominent-detail-section"
          onSubmit={handleQuickPlanSubmit}
        >
          <div className="quick-head">
            <div className="quick-head-badges">
              <span className="quick-title">
                <Sparkle size={16} /> TRIP DETAILS
              </span>
              <span className="detail-tag tag-place">🛫 FROM &amp; TO</span>
              <span className="detail-tag tag-date">📅 FROM &amp; TO DATES</span>
              <span className="detail-tag tag-rupees">₹ RUPEES</span>
              <span className="detail-tag tag-person">👥 PERSONS</span>
            </div>
            <span className="quick-step">CUSTOMIZE &amp; GENERATE · 1 MIN</span>
          </div>

          {!isAuthenticated && (
            <div
              className="portal-redirect-notice-bar"
              onClick={() =>
                router.push(
                  `/login?redirect=${encodeURIComponent(
                    "/create-trip/dates"
                  )}&reason=fill_details`
                )
              }
              role="button"
              tabIndex={0}
            >
              <div className="portal-redirect-notice-left">
                <Lock size={15} className="portal-lock-icon" />
                <span>
                  <strong>Portal Sign-In Notice:</strong> Sign in or sign up to
                  fill and customize your travel details. Clicking or focusing
                  any field redirects to login/signup.
                </span>
              </div>
              <span className="portal-redirect-action">
                Sign In / Sign Up <ArrowRight size={13} />
              </span>
            </div>
          )}

          <div className="quick-fields">
            {/* 1. FROM DETAIL */}
            <label className="quick-field highlight-field field-from">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <PlaneTakeoff size={14} className="icon-teal" /> FROM / DEPARTURE
                </span>
                <span className="field-hint">Origin City</span>
              </div>
              <input
                aria-label="Departure origin city"
                placeholder="e.g. New Delhi, Mumbai"
                value={fromCity}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleDetailFieldInteraction(e);
                    return;
                  }
                  setFromCity(e.target.value);
                }}
                onFocus={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onClick={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onKeyDown={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                readOnly={!isAuthenticated}
                list="origin-city-options"
                className="bold-input"
              />
              <datalist id="origin-city-options">
                {WORLDWIDE_CITIES_AND_HOMETOWNS.map((city) => (
                  <option key={city.placeId} value={city.name}>
                    {city.stateOrCountry}
                  </option>
                ))}
              </datalist>
            </label>

            {/* 2. TO DETAIL */}
            <label className="quick-field destination-field highlight-field field-to">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <MapPin size={14} className="icon-teal" /> TO / DESTINATION
                </span>
                <span className="field-hint">City or Region</span>
              </div>
              <input
                aria-label="Destination"
                placeholder="e.g. Manali, Paris, Bali"
                value={search}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleDetailFieldInteraction(e);
                    return;
                  }
                  setSearch(e.target.value);
                }}
                onFocus={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onClick={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onKeyDown={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                readOnly={!isAuthenticated}
                list="destination-options"
                className="bold-input"
              />
              <datalist id="destination-options">
                {ALL_DESTINATIONS.map((item) => (
                  <option key={item.slug} value={item.name}>
                    {item.stateOrCountry}
                  </option>
                ))}
                {WORLDWIDE_CITIES_AND_HOMETOWNS.map((city) => (
                  <option key={city.placeId} value={city.name}>
                    {city.stateOrCountry}
                  </option>
                ))}
              </datalist>
            </label>

            {/* 3. FROM DATE DETAIL */}
            <label className="quick-field highlight-field field-fromdate">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <CalendarDays size={14} className="icon-amber" /> FROM DATE
                </span>
                <span className="field-hint">Start Date</span>
              </div>
              <input
                aria-label="From travel date"
                type="date"
                min={today}
                value={fromDate}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleDetailFieldInteraction(e);
                    return;
                  }
                  setFromDate(e.target.value);
                }}
                onFocus={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onClick={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onKeyDown={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                readOnly={!isAuthenticated}
                className="bold-input"
              />
            </label>

            {/* 4. TO DATE DETAIL */}
            <label className="quick-field highlight-field field-todate">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <CalendarDays size={14} className="icon-amber" /> TO DATE
                </span>
                <span className="field-hint">{calculatedTripDays} Days Trip</span>
              </div>
              <input
                aria-label="To travel date"
                type="date"
                min={fromDate || today}
                value={toDate}
                onChange={(e) => {
                  if (!isAuthenticated) {
                    handleDetailFieldInteraction(e);
                    return;
                  }
                  setToDate(e.target.value);
                }}
                onFocus={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onClick={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                onKeyDown={(e) => {
                  if (!isAuthenticated) handleDetailFieldInteraction(e);
                }}
                readOnly={!isAuthenticated}
                className="bold-input"
              />
            </label>

            {/* 5. RUPEES DETAIL */}
            <label className="quick-field highlight-field field-rupees">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <Wallet size={14} className="icon-emerald" /> RUPEES (₹)
                </span>
                <span className="field-hint">INR Total</span>
              </div>
              <div className="rupee-input-wrap">
                <span className="rupee-currency-prefix">₹</span>
                <input
                  aria-label="Budget in rupees"
                  type="number"
                  min="1000"
                  step="1000"
                  value={budget}
                  onChange={(e) => {
                    if (!isAuthenticated) {
                      handleDetailFieldInteraction(e);
                      return;
                    }
                    setBudget(e.target.value);
                  }}
                  onFocus={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  onClick={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  onKeyDown={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  readOnly={!isAuthenticated}
                  className="bold-input rupee-input-val"
                  placeholder="80000"
                />
              </div>
            </label>

            {/* 6. PERSON DETAIL */}
            <label className="quick-field traveler-field highlight-field field-person">
              <div className="field-top-row">
                <span className="field-badge-label">
                  <Users size={14} className="icon-coral" /> PERSONS
                </span>
                <span className="field-hint">
                  {Number(travellers) === 1
                    ? "Solo"
                    : Number(travellers) === 2
                    ? "Couple"
                    : "Group"}
                </span>
              </div>
              <div className="person-input-wrap">
                <input
                  aria-label="Number of travelers"
                  type="number"
                  min="1"
                  max="24"
                  value={travellers}
                  onChange={(e) => {
                    if (!isAuthenticated) {
                      handleDetailFieldInteraction(e);
                      return;
                    }
                    setTravellers(e.target.value);
                  }}
                  onFocus={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  onClick={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  onKeyDown={(e) => {
                    if (!isAuthenticated) handleDetailFieldInteraction(e);
                  }}
                  readOnly={!isAuthenticated}
                  className="bold-input person-input-val"
                />
                <span className="person-suffix">
                  {Number(travellers) === 1 ? "Person" : "Persons"}
                </span>
              </div>
            </label>

            <button
              type="submit"
              className="button button-primary quick-submit prominent-submit"
            >
              Plan with RouteBloom <ArrowRight size={16} />
            </button>
          </div>

          <p className="quick-caption">
            ✨ Verified places, estimated road travel times, and real rupee budgets tailored to your group.
          </p>
        </form>
      </section>

      <div className="landing-trust">
        <span>
          <ShieldCheck size={15} /> You choose what to save
        </span>
        <span>
          <Map size={15} /> Thoughtful routes, not rush-hour races
        </span>
        <span>
          <Wallet size={15} /> Every number clearly labeled
        </span>
      </div>

      {/* Curated Example Places & Itineraries View Section */}
      <section className="example-view-section section-pad" id="example-views">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED EXAMPLE VIEW</span>
            <h2>
              Places &amp; itineraries
              <br />
              <em>for example view</em>
            </h2>
          </div>
          <div>
            <p>
              Preview sample trips with verified place images, exact From &amp; To
              routes, travel dates, real rupee budgets, and traveler counts before
              planning your own.
            </p>
          </div>
        </div>

        <div className="example-view-grid">
          {CURATED_EXAMPLE_VIEWS.map((ex) => (
            <article key={ex.id} className="example-view-card">
              <div className="example-view-thumb">
                <img
                  src={ex.imageUrl}
                  alt={`${ex.name} in ${ex.destination}`}
                  loading="lazy"
                />
                <div className="example-view-overlay-shade" />
                <span className="example-view-badge">
                  <Sparkles size={11} /> EXAMPLE VIEW
                </span>
                <span className="example-view-duration-badge">
                  {ex.durationDays} DAYS
                </span>
                <div className="example-view-thumb-caption">
                  <span className="example-view-category-tag">{ex.tag}</span>
                </div>
              </div>

              <div className="example-view-body">
                <div className="example-route-label">
                  <MapPin size={13} />
                  <span>
                    From <strong>{ex.fromCity}</strong> → To{" "}
                    <strong>{ex.toCity}</strong>
                  </span>
                </div>

                <h3 className="example-view-title">{ex.name}</h3>
                <span className="example-view-destination">{ex.destination}</span>

                <div className="example-view-meta-row">
                  <div className="example-mini-pill">
                    <span className="example-mini-label">📅 Dates</span>
                    <span className="example-mini-value">{ex.fromDate}</span>
                  </div>
                  <div className="example-mini-pill">
                    <span className="example-mini-label">₹ Rupees</span>
                    <span className="example-mini-value rupee-val">
                      ₹ {ex.rupeesBudget.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="example-mini-pill">
                    <span className="example-mini-label">👥 Travelers</span>
                    <span className="example-mini-value">
                      {ex.travelers} Persons
                    </span>
                  </div>
                </div>

                <div className="example-highlights-wrap">
                  {ex.highlights.slice(0, 3).map((hl, i) => (
                    <span key={i} className="example-highlight-chip">
                      • {hl}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="example-view-action-btn"
                  onClick={() => handleExampleCardClick(ex)}
                  title={
                    !isAuthenticated
                      ? "Sign in to customize this itinerary"
                      : "Plan similar trip"
                  }
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock size={13} /> Sign in to customize trip{" "}
                      <ArrowRight size={13} />
                    </>
                  ) : (
                    <>
                      Customize &amp; Plan This Route <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="destination-section section-pad" id="destinations">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PLACES TO BEGIN</span>
            <h2>
              Where will your next
              <br />
              <em>story begin?</em>
            </h2>
          </div>
          <div>
            <p>
              From a long weekend in the hills to a foreign city or sacred
              shrine you’ve been dreaming about, the first step is just picking
              a place.
            </p>
            <div className="place-categories" style={{ marginTop: 14 }}>
              {(
                [
                  { id: "FEATURED", label: "Featured (8)" },
                  { id: "ALL", label: `All (${ALL_DESTINATIONS.length})` },
                  { id: "INDIA", label: "India" },
                  { id: "FOREIGN", label: "Foreign & Global" },
                  { id: "SACRED", label: "Sacred & Holy" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={regionFilter === tab.id ? "active" : ""}
                  onClick={() => setRegionFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="destination-grid"
          style={
            regionFilter !== "FEATURED"
              ? { gridTemplateRows: "auto", gridAutoRows: "230px" }
              : undefined
          }
        >
          {displayedDestinations.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              className={`destination-card ${
                regionFilter === "FEATURED"
                  ? `destination-card-${index + 1}`
                  : ""
              }`}
              onClick={() => beginPlanning(item)}
              title={
                !isAuthenticated
                  ? "Click to sign in / create account and plan this trip"
                  : `Plan trip to ${item.name}`
              }
            >
              <DestinationDynamicImage
                dest={item}
                intervalMs={3600 + (index % 4) * 500}
              />
              {!isAuthenticated && (
                <span className="destination-hover-auth-tag">
                  <Lock size={12} /> Sign in to plan
                </span>
              )}
              <span className="destination-shade" />
              <span className="destination-card-content">
                <small>{item.stateOrCountry}</small>
                <strong>{item.name}</strong>
                <span className="destination-mini-meta">
                  📍 {item.name} · 📅 4 Days · ₹ {item.suggestedMinDailyPerPersonINR * 4} · 👥 2P
                </span>
                <i className="round-arrow">
                  <ArrowUpRight size={17} />
                </i>
              </span>
            </button>
          ))}
        </div>

        <div className="attribution-note">
          Click any destination card to open the step-by-step itinerary planner
          with verified landmarks and route estimates.
        </div>
      </section>

      <section className="how-section section-pad" id="how-it-works">
        <div className="eyebrow">A BETTER WAY TO GET THERE</div>
        <div className="section-heading compact-heading">
          <h2>
            Less tab-hopping.
            <br />
            <em>More looking forward.</em>
          </h2>
          <p>
            Keep the fun part of planning. Leave the spreadsheet-shaped part to
            us.
          </p>
        </div>
        <div className="steps-row">
          <Step
            number="01"
            icon={<Compass />}
            title="Tell us your travel style"
            text="Choose a place, set your budget, and tell us what makes a day feel well spent."
          />
          <Step
            number="02"
            icon={<Sparkles />}
            title="Let your plan take shape"
            text="Bring your preferences together with candidate places and a pace that feels right."
          />
          <Step
            number="03"
            icon={<Navigation />}
            title="Keep the good bits"
            text="Adjust your days, review the estimates, and save the itinerary you actually want."
          />
        </div>
      </section>

      <section className="feature-section section-pad" id="features">
        <div className="eyebrow">YOUR TRIP, WITH A LITTLE MORE CLARITY</div>
        <div className="feature-grid">
          <Feature
            icon={<Sparkles />}
            title="Made around you"
            text="Interests, food preferences, travel pace, and the small notes that make a trip personal."
          />
          <Feature
            icon={<Wallet />}
            title="A budget with context"
            text="See what’s an estimate, what’s included, and what may need a second look."
          />
          <Feature
            icon={<MapPin />}
            title="Verified landmarks & places"
            text="Discover curated attractions, sacred shrines, and neighborhood dining grounded in real coordinates."
          />
          <Feature
            icon={<Map />}
            title="A route you can reshape"
            text="Map the day, optimize your route order, or leave yourself some breathing room."
          />
          <Feature
            icon={<Pencil />}
            title="Easy to make yours"
            text="Change the timing, swap a stop, or use AI adjustments to keep the parts of the plan you love."
          />
          <Feature
            icon={<Bookmark />}
            title="Your journeys, together"
            text="Keep drafts and trips in one place; export an illustrated PDF or share a read-only view when ready."
          />
        </div>
      </section>

      <section
        className="closing-banner"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(12,35,39,.78), rgba(12,35,39,.18)), url('${CLOSING_DYNAMIC_PHOTOS[closingIdx]}')`,
          transition: "background-image 0.9s ease-in-out",
        }}
      >
        <div>
          <span className="eyebrow eyebrow-light">
            YOUR NEXT CHAPTER IS OUT THERE
          </span>
          <h2>
            Dream it. Plan it.
            <br />
            <em>Then go see.</em>
          </h2>
          <button
            type="button"
            className="button button-light"
            onClick={() => beginPlanning()}
          >
            Start a new adventure <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Thoughtful travel planning for people who’d rather be out there.
            </p>
          </div>
          <div className="footer-links">
            <a href="#destinations">Destinations</a>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <button type="button" onClick={() => router.push("/login")}>
              Sign in
            </button>
          </div>
          <span className="footer-tag">Explore more. Plan less.</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RouteBloom</span>
          <span>
            Itinerary estimates and timings are for planning guidance.
          </span>
          <span>Verify live availability and prices before booking.</span>
        </div>
      </footer>
    </div>
  );
}

function Step({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="how-step">
      <div className="step-top">
        <span>{number}</span>
        <i>{icon}</i>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="feature-item">
      <div className="feature-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
      <ArrowUpRight className="feature-arrow" size={17} />
    </article>
  );
}
