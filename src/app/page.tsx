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
  Map,
  MapPin,
  Navigation,
  Pencil,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Users,
  Wallet,
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
  const { isAuthenticated, updateActiveDraft, resetActiveDraft } =
    useRoamWise();

  const today = new Date().toISOString().slice(0, 10);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
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

  const beginPlanning = (
    dest?: DestinationInfo,
    prefill?: {
      startDate?: string;
      budgetAmount?: number;
      travelers?: number;
    }
  ) => {
    if (dest) {
      resetActiveDraft({
        placeId: dest.placeId,
        name: dest.name,
        country: dest.stateOrCountry,
        heroImage: dest.heroImage,
      });
    }
    if (prefill) {
      const patch: Record<string, unknown> = {};
      if (prefill.startDate) {
        patch.startDate = prefill.startDate;
        const end = new Date(`${prefill.startDate}T12:00:00`);
        end.setDate(end.getDate() + 3);
        patch.endDate = end.toISOString().slice(0, 10);
        patch.durationDays = 4;
      }
      if (prefill.budgetAmount) patch.budgetAmount = prefill.budgetAmount;
      if (prefill.travelers) patch.travelers = prefill.travelers;
      updateActiveDraft(patch);
    }

    const nextRoute = dest
      ? "/create-trip/dates"
      : "/create-trip/destination";

    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent(nextRoute)}${
          dest ? `&dest=${encodeURIComponent(dest.name)}` : ""
        }`
      );
      return;
    }
    router.push(nextRoute);
  };

  const handleQuickPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = search.trim() ? findDestinationInfo(search.trim()) : undefined;
    beginPlanning(matched, {
      startDate: date || undefined,
      budgetAmount: Math.max(1000, Number(budget) || 80000),
      travelers: Math.max(1, Number(travellers) || 2),
    });
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="brand-anchor">
          <Brand light />
        </Link>
        <div className="landing-links">
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
                onClick={() => router.push("/login")}
              >
                Log in
              </button>
              <button
                type="button"
                className="button button-light"
                onClick={() => router.push("/dashboard")}
              >
                Try workspace <ArrowRight size={15} />
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
            <span className="kicker-line" /> A MORE THOUGHTFUL WAY TO TRAVEL
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
            <a className="hero-secondary" href="#destinations">
              Explore destinations <ArrowDownRight size={16} />
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

        <form className="quick-plan" onSubmit={handleQuickPlanSubmit}>
          <div className="quick-head">
            <span className="quick-title">
              <Sparkle size={16} /> Start with a feeling
            </span>
            <span className="quick-step">QUICK PLAN · 1 MIN</span>
          </div>
          <div className="quick-fields">
            <label className="quick-field destination-field">
              <span>
                <MapPin size={14} /> DESTINATION
              </span>
              <input
                aria-label="Destination"
                placeholder="Where to?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                list="destination-options"
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
            <label className="quick-field">
              <span>
                <CalendarDays size={14} /> WHEN
              </span>
              <input
                aria-label="Travel date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="quick-field">
              <span>
                <Wallet size={14} /> BUDGET
              </span>
              <input
                aria-label="Budget in rupees"
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </label>
            <label className="quick-field traveler-field">
              <span>
                <Users size={14} /> TRAVELERS
              </span>
              <input
                aria-label="Number of travelers"
                type="number"
                min="1"
                max="24"
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
              />
            </label>
            <button
              type="submit"
              className="button button-primary quick-submit"
            >
              Plan with RouteBloom <ArrowRight size={15} />
            </button>
          </div>
          <p className="quick-caption">
            A good itinerary leaves a little room to wander.
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
            >
              <DestinationDynamicImage
                dest={item}
                intervalMs={3600 + (index % 4) * 500}
              />
              <span className="destination-shade" />
              <span className="destination-card-content">
                <small>{item.stateOrCountry}</small>
                <strong>{item.name}</strong>
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
