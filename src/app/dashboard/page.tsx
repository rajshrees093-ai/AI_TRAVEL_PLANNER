"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Calendar,
  MapPin,
  Users,
  Clock,
  MoreVertical,
  Edit3,
  Copy,
  Trash2,
  Sparkles,
  Search,
  Globe2,
  Flame,
  Camera,
  CheckCircle2,
  User,
  X,
  ChevronDown,
} from "lucide-react";
import { DashboardWorkspaceLayout } from "@/components/layout/DashboardWorkspaceLayout";
import { useRoamWise } from "@/context/RoamWiseContext";
import {
  POPULAR_DESTINATIONS,
  SACRED_DESTINATIONS,
  ALL_DESTINATIONS,
  WORLDWIDE_CITIES_AND_HOMETOWNS,
  findDestinationInfo,
  getCandidatePlacesForDestination,
} from "@/lib/destinations-catalog";
import { ConfirmDialog } from "@/components/ui/BrandComponents";
import {
  calculateDaysBetween,
  cn,
  formatCurrency,
  formatDateRange,
  getTimeGreeting,
} from "@/lib/utils";
import { DestinationInfo, TripWizardDraft } from "@/lib/types";

// 6 Bright, Unmistakable Real Place Photographs for the Hero Background
const HERO_SPOTLIGHT_SCENES = [
  {
    id: "jaipur",
    destinationName: "Jaipur",
    placeLabel: "Hawa Mahal & Amber Fort, Jaipur",
    region: "Rajasthan, India",
    promoTag: "ROYAL HERITAGE",
    headline: "Royal Palaces, Hilltop Forts & Pink City Bazaars",
    subline:
      "+ Customized Day-by-Day Fort & Palace Route from your hometown\n+ Includes Chokhi Dhani, Nahargarh Sunset & Illustrated Photo PDF",
    temp: "25°C • Sunny",
    photoUrl:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "varanasi",
    destinationName: "Varanasi (Kashi)",
    placeLabel: "Dashashwamedh Ghat & Kashi Vishwanath, Varanasi",
    region: "Uttar Pradesh, India",
    promoTag: "SACRED DARSHAN",
    headline: "Ancient Ganges Ghats, Evening Aarti & Sacred Temples",
    subline:
      "+ Timed Kashi Vishwanath Sugam Darshan & Sunrise Boat Ride\n+ Includes Sarnath Buddhist Trail & Pure Vegetarian Dining",
    temp: "22°C • Golden Dusk",
    photoUrl:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "goa",
    destinationName: "Goa",
    placeLabel: "Palolem Beach & Fontainhas Quarter, Goa",
    region: "Goa, India",
    promoTag: "COASTAL ESCAPE",
    headline: "Sun-Drenched Beaches, Latin Villas & Ocean Cruises",
    subline:
      "+ Curated North & South Goa Coastline + Aguada Fort Sunset\n+ Includes Heritage Cafés, Water Sports & Route Map",
    temp: "28°C • Ocean Breeze",
    photoUrl:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    placeLabel: "Sri Harmandir Sahib Golden Temple, Amritsar",
    region: "Punjab, India",
    promoTag: "HOLY PILGRIMAGE",
    headline: "Gleaming Golden Sanctum, Sarovar & Heritage Walk",
    subline:
      "+ Dawn & Night Palki Sahib Darshan + Community Langar Experience\n+ Includes Wagah Border Ceremony & Authentic Kulcha Stops",
    temp: "20°C • Serene Dawn",
    photoUrl:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "bali",
    destinationName: "Bali",
    placeLabel: "Uluwatu Ocean Temple & Ubud Terraces, Bali",
    region: "Bali, Indonesia",
    promoTag: "ISLAND SANCTUARY",
    headline: "Emerald Rice Terraces, Cliff Temples & Turquoise Coves",
    subline:
      "+ Direct Hometown-to-Bali Flight Guidance + Ubud & Uluwatu Split\n+ Includes Tirta Empul Water Temple & Nusa Penida Viewpoints",
    temp: "27°C • Tropical",
    photoUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=85",
  },
  {
    id: "manali",
    destinationName: "Manali",
    placeLabel: "Solang Snow Peaks & Beas Valley, Manali",
    region: "Himachal Pradesh, India",
    promoTag: "ALPINE PEAKS",
    headline: "Snow-Capped Himalayan Peaks, Cedar Trails & River Cafés",
    subline:
      "+ Rohtang & Atal Tunnel Scenic Drive + Hadimba Devi Temple\n+ Includes Old Manali Riverside Cafés & Jogini Waterfall Trek",
    temp: "12°C • Crisp Mountain Air",
    photoUrl:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2000&q=85",
  },
];

// 4 Tall Vertical Poster Cards (Matching Reference Screenshot 2)
const TALL_POSTER_SHOWCASE = [
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

// Curated Bento Mosaic items arranged in a varied visual rhythm
const BENTO_VISUAL_MOSAIC = [
  {
    slug: "varanasi",
    destinationName: "Varanasi (Kashi)",
    title: "Evening Ganga Aarti & Kashi Vishwanath",
    subtitle: "84 Ancient River Ghats • Sarnath • Pure Sattvic Kachori Lanes",
    location: "Uttar Pradesh, India",
    tag: "Sacred Heritage",
    spanClass: "lg:col-span-7 h-[320px] sm:h-[350px]",
    mainPhoto:
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85",
    subPhotos: [
      {
        label: "Kashi Vishwanath",
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Assi Ghat Dawn",
        url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Sarnath Dhamek",
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "manali",
    destinationName: "Manali",
    title: "Solang Snow Peaks & Old Manali",
    subtitle: "Hadimba Cedar Temple • Jogini Falls • Beas River Cafés",
    location: "Himachal Pradesh, India",
    tag: "Alpine Escape",
    spanClass: "lg:col-span-5 h-[320px] sm:h-[350px]",
    mainPhoto:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=85",
    subPhotos: [
      {
        label: "Solang Valley",
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Mountain Café",
        url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "jaipur",
    destinationName: "Jaipur",
    title: "Amber Fort, Hawa Mahal & Royal Bazaars",
    subtitle: "Sheesh Mahal Mirror Hall • Nahargarh Sunset • Johari Bazaar",
    location: "Rajasthan, India",
    tag: "Royal Architecture",
    spanClass: "lg:col-span-4 h-[290px]",
    mainPhoto:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85",
    subPhotos: [
      {
        label: "Amber Fort",
        url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Panna Meena Kund",
        url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "amritsar",
    destinationName: "Amritsar (Golden Temple)",
    title: "Sri Harmandir Sahib & Amrit Sarovar",
    subtitle: "Golden Temple Night Palki • Langar Hall • Wagah Border",
    location: "Punjab, India",
    tag: "Sacred Pilgrimage",
    spanClass: "lg:col-span-4 h-[290px]",
    mainPhoto:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=85",
    subPhotos: [
      {
        label: "Sarovar Reflections",
        url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Amritsari Kulcha",
        url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  {
    slug: "bali",
    destinationName: "Bali",
    title: "Tegallalang Terraces & Uluwatu Sea Temple",
    subtitle: "Sacred Monkey Forest • Nusa Penida Cliffs • Ubud Sanctuaries",
    location: "Bali, Indonesia",
    tag: "Tropical Island",
    spanClass: "lg:col-span-4 h-[290px]",
    mainPhoto:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=85",
    subPhotos: [
      {
        label: "Uluwatu Cliff",
        url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
      },
      {
        label: "Tirta Empul",
        url: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    trips,
    drafts,
    activeDraft,
    updateActiveDraft,
    resetActiveDraft,
    removeDraft,
    deleteTrip,
    duplicateTrip,
  } = useRoamWise();

  const [openMenuTripId, setOpenMenuTripId] = useState<string | null>(null);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [showSignInCallout, setShowSignInCallout] = useState(true);

  // Dashboard Search & Calendar Bar State (Immediately visible on page load!)
  const [searchDestination, setSearchDestination] = useState(
    activeDraft.destinationName || ""
  );
  const [originCity, setOriginCity] = useState(
    activeDraft.startCity || "New Delhi"
  );
  const [startDate, setStartDate] = useState(activeDraft.startDate);
  const [endDate, setEndDate] = useState(activeDraft.endDate);
  const [travelers, setTravelers] = useState(activeDraft.travelers || 2);

  const [catalogCategory, setCatalogCategory] = useState<
    "ALL" | "SACRED" | "LEISURE" | "GLOBAL"
  >("ALL");

  // Active Hero Spotlight Scene Index
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [cardPreviewPhoto, setCardPreviewPhoto] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % HERO_SPOTLIGHT_SCENES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const currentHeroScene = HERO_SPOTLIGHT_SCENES[activeSceneIndex];

  // Deliberately interleave Leisure, Sacred, Mountain, Coastal, and International destinations
  const mixedAllDestinations = useMemo(() => {
    const interleaved: DestinationInfo[] = [];
    const maxLen = Math.max(
      POPULAR_DESTINATIONS.length,
      SACRED_DESTINATIONS.length
    );
    for (let i = 0; i < maxLen; i++) {
      if (i < POPULAR_DESTINATIONS.length) {
        interleaved.push(POPULAR_DESTINATIONS[i]);
      }
      if (i < SACRED_DESTINATIONS.length) {
        interleaved.push(SACRED_DESTINATIONS[i]);
      }
    }
    return interleaved;
  }, []);

  const filteredDestinations = useMemo(() => {
    if (catalogCategory === "SACRED") return SACRED_DESTINATIONS;
    if (catalogCategory === "LEISURE") return POPULAR_DESTINATIONS;
    if (catalogCategory === "GLOBAL") {
      return ALL_DESTINATIONS.filter(
        (d) => !d.stateOrCountry.toLowerCase().includes("india")
      );
    }
    return mixedAllDestinations;
  }, [catalogCategory, mixedAllDestinations]);

  // Handler when user submits the Hero Search + Calendar Bar
  const handleDashboardDestinationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchDestination.trim() || currentHeroScene.destinationName;
    const matched = findDestinationInfo(q);
    const duration = Math.max(1, calculateDaysBetween(startDate, endDate));

    updateActiveDraft({
      destinationPlaceId: matched.placeId,
      destinationName: matched.name,
      destinationCountry: matched.stateOrCountry,
      heroImage: matched.heroImage,
      startCity: originCity.trim() || "New Delhi",
      startDate,
      endDate,
      durationDays: duration > 0 ? duration : 4,
      travelers: Number(travelers) || 2,
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

  const handlePlanByDestinationName = (destinationName: string) => {
    const dest = findDestinationInfo(destinationName);
    handlePlanDestination(dest);
  };

  const handlePlanDestination = (dest: DestinationInfo) => {
    const duration = Math.max(1, calculateDaysBetween(startDate, endDate));
    resetActiveDraft({
      placeId: dest.placeId,
      name: dest.name,
      country: dest.stateOrCountry,
      heroImage: dest.heroImage,
    });
    updateActiveDraft({
      startCity: originCity.trim() || user?.homeCity || "New Delhi",
      startDate,
      endDate,
      durationDays: duration > 0 ? duration : 4,
      travelers: Number(travelers) || 2,
    });

    if (!isAuthenticated) {
      router.push(
        `/signup?redirect=${encodeURIComponent("/create-trip/dates")}&dest=${encodeURIComponent(dest.name)}`
      );
      return;
    }

    router.push("/create-trip/dates");
  };

  const handleStartNewBlankTrip = () => {
    if (!isAuthenticated) {
      router.push("/signup?redirect=/create-trip/destination");
      return;
    }
    router.push("/create-trip/destination");
  };

  const handleContinueDraft = (draft: TripWizardDraft) => {
    updateActiveDraft(draft);
    const stepRoutes: Record<number, string> = {
      1: "/create-trip/destination",
      2: "/create-trip/dates",
      3: "/create-trip/preferences",
      4: "/create-trip/budget",
      5: "/create-trip/review",
    };
    const nextUrl = stepRoutes[draft.currentStep] || "/create-trip/destination";
    if (!isAuthenticated) {
      router.push(`/signup?redirect=${encodeURIComponent(nextUrl)}`);
      return;
    }
    router.push(nextUrl);
  };

  return (
    <DashboardWorkspaceLayout
      title="RoamWise Travel Command Center"
      allowPublicPreview
      actions={
        <button
          type="button"
          onClick={handleStartNewBlankTrip}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      }
    >
      {/* 1. FULL-BLEED REAL PLACE HERO + FLOATING SIGN-IN POPOVER + DOCKED WHITE SEARCH & CALENDAR BAR (Like Reference Image 1) */}
      <section className="relative rounded-3xl overflow-hidden border border-border shadow-elevated mb-12 min-h-[540px] sm:min-h-[580px] flex flex-col justify-between">
        {/* Crisp, Real Place Photograph Background */}
        <div
          key={currentHeroScene.id}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url('${currentHeroScene.photoUrl}')`,
          }}
        />
        {/* Subtle left-side & bottom gradient for text legibility while keeping the place photo vivid and clear */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />

        {/* Top Bar inside Hero: Scene Switcher Pills on Left + Floating "Have an account?" Card on Right */}
        <div className="relative z-20 p-5 sm:p-8 flex flex-wrap items-start justify-between gap-4">
          {/* Real Place Scene Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-md border border-white/25 text-white text-xs font-bold flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentHeroScene.placeLabel}</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {HERO_SPOTLIGHT_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneIndex(idx)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold transition-all backdrop-blur-md",
                    idx === activeSceneIndex
                      ? "bg-amber-400 text-slate-950 shadow-sm"
                      : "bg-black/45 text-white/90 hover:bg-black/65 border border-white/20"
                  )}
                >
                  {scene.destinationName.split("(")[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* Floating "Have an account?" Popover Card (Just like Reference Image 1!) */}
          {!isAuthenticated && showSignInCallout && (
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl p-4 pr-9 max-w-xs relative border border-slate-100 animate-in fade-in duration-300">
              <button
                type="button"
                onClick={() => setShowSignInCallout(false)}
                aria-label="Close sign in prompt"
                className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
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
                    Sign in or Sign up to save custom itineraries & download
                    Illustrated Photo PDFs.
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Link
                      href="/login?redirect=/dashboard"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Sign In →
                    </Link>
                    <Link
                      href="/signup?redirect=/dashboard"
                      className="text-xs font-bold text-accent hover:underline"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Middle Hero Promotional Typography + Golden Yellow CTA Pill (Like Reference Image 1) */}
        <div className="relative z-10 px-5 sm:px-8 my-auto max-w-2xl text-white">
          <div className="inline-block">
            <span className="inline-block px-3.5 py-1 rounded-md bg-gradient-to-r from-pink-500 via-orange-500 to-amber-400 text-white text-xs font-black uppercase tracking-widest shadow-md">
              {currentHeroScene.promoTag} • AI TRIP PLANNER
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold leading-[1.1] mt-3 drop-shadow-sm">
            {currentHeroScene.headline}
          </h2>

          <div className="mt-3 space-y-1 text-xs sm:text-sm text-white/95 font-medium whitespace-pre-line drop-shadow-xs">
            {currentHeroScene.subline}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                handlePlanByDestinationName(currentHeroScene.destinationName)
              }
              className="px-7 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-sm shadow-lg transition-transform hover:scale-102"
            >
              Plan {currentHeroScene.destinationName.split("(")[0].trim()} Now
            </button>

            <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
              {currentHeroScene.temp}
            </span>
          </div>
        </div>

        {/* Bottom Docked Solid White Search + Calendar Bar (Immediately Visible Like Reference Image 1!) */}
        <div className="relative z-20 p-4 sm:p-6 lg:p-8 pt-4">
          <form
            onSubmit={handleDashboardDestinationSearch}
            className="bg-white dark:bg-surface text-slate-900 dark:text-heading rounded-2xl shadow-2xl border border-slate-200/80 dark:border-border p-4 sm:p-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* 1. Traveling To (Destination / Holy Site) */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Traveling to
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <MapPin className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="text"
                    list="dashboard-destination-list"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Anywhere (City or Holy Site)"
                    className="w-full bg-transparent text-sm font-bold text-primary dark:text-heading placeholder:text-primary/80 focus:outline-none"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                  <datalist id="dashboard-destination-list">
                    {ALL_DESTINATIONS.map((d) => (
                      <option key={d.placeId} value={d.name}>
                        {d.stateOrCountry} • {d.category}
                      </option>
                    ))}
                    {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                      <option key={`dest_${c.placeId}`} value={c.name}>
                        {c.stateOrCountry}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 2. Leaving From (Hometown) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Leaving from
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Globe2 className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="text"
                    list="dashboard-hometown-list"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    placeholder="Any hometown"
                    className="w-full bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none"
                  />
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 pointer-events-none" />
                  <datalist id="dashboard-hometown-list">
                    {WORLDWIDE_CITIES_AND_HOMETOWNS.map((c) => (
                      <option key={c.placeId} value={c.name}>
                        {c.stateOrCountry}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              {/* 3. Leaving On (Start Date Calendar Picker) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Leaving on (Start Date)
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Calendar className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* 4. Returning On (End Date Calendar Picker) */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 dark:text-muted mb-1">
                  Returning on (End Date)
                </label>
                <div className="relative flex items-center border-b-2 border-slate-200 dark:border-border focus-within:border-primary pb-2">
                  <Calendar className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    className="w-full bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. Travelers Count */}
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
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-primary dark:text-heading focus:outline-none"
                  />
                </div>
              </div>

              {/* 6. Search / Plan Button (Vibrant Blue/Teal Pill Like Reference Image 1) */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full h-[46px] rounded-full bg-[#0057D9] hover:bg-[#0046B0] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>{isAuthenticated ? "Search Trips" : "Search & Plan"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 2. FOUR TALL VERTICAL POSTER CARDS + FULL-WIDTH GRADIENT-BORDERED PANORAMIC BANNER (Matching Reference Image 2!) */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Handpicked 2026–2027 Departures from Your Hometown
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-heading mt-1">
              Trending Escapes & Sacred Journeys
            </h3>
          </div>
          <p className="text-xs text-muted">
            Click any poster card to open the step-by-step itinerary planner
          </p>
        </div>

        {/* 4 Tall Vertical Poster Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {TALL_POSTER_SHOWCASE.map((card) => (
            <div
              key={card.destinationName}
              onClick={() => handlePlanByDestinationName(card.destinationName)}
              className="group relative h-[430px] rounded-2xl overflow-hidden shadow-elevated cursor-pointer select-none"
            >
              <img
                src={card.photoUrl}
                alt={card.destinationName}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Crisp bottom-to-middle gradient so the white poster typography pops */}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanByDestinationName(card.destinationName);
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs shadow-md transition-transform group-hover:scale-105"
                >
                  Plan now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wide Gradient-Bordered Panoramic Banner (Matching Bottom of Reference Image 2!) */}
        <div
          onClick={() =>
            handlePlanByDestinationName("Kedarnath & Badrinath (Char Dham)")
          }
          className="p-1.5 rounded-3xl bg-gradient-to-r from-pink-500 via-orange-400 to-amber-300 shadow-elevated cursor-pointer group"
        >
          <div className="relative h-[220px] sm:h-[240px] rounded-[20px] overflow-hidden flex items-center justify-between px-6 sm:px-12">
            <img
              src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2000&q=85"
              alt="Himalayan Char Dham & Global Escapes"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/75" />

            {/* Left Brand Emblem */}
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

            {/* Center Floating Golden Button */}
            <div className="relative z-10 my-auto">
              <button
                type="button"
                className="px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-heading font-extrabold text-xs sm:text-sm shadow-xl transition-transform group-hover:scale-105"
              >
                Explore Now
              </button>
            </div>

            {/* Right Bold Display Typography */}
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

      {/* 3. ASYMMETRICAL BENTO PHOTO MOSAIC — ICONIC PLACES IN MIXED VISUAL ORDER */}
      <section className="mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Camera className="w-3.5 h-3.5" />
              <span>Multi-Angle Place Previews</span>
            </span>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-heading mt-1">
              Iconic Places & Sacred Wonders — Interactive Photo Mosaic
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Hover or click the inset thumbnails on any card to preview the
              actual temples, forts, beaches, and viewpoints inside that trip.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {BENTO_VISUAL_MOSAIC.map((item) => {
            const activeBg = cardPreviewPhoto[item.slug] || item.mainPhoto;
            return (
              <div
                key={item.slug}
                onClick={() => handlePlanByDestinationName(item.destinationName)}
                className={cn(
                  "group relative rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elevated cursor-pointer transition-all",
                  item.spanClass
                )}
              >
                <img
                  src={activeBg}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{item.tag}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>{item.location}</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="text-white max-w-md">
                    <h4 className="text-lg sm:text-2xl font-heading font-extrabold leading-snug group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-white/85 mt-1 line-clamp-1">
                      {item.subtitle}
                    </p>
                    <span className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400 group-hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-xs transition-colors">
                      <span>
                        {isAuthenticated
                          ? `Plan ${item.destinationName.split("(")[0].trim()}`
                          : "Select & Plan Trip"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Interactive Multi-Photo Mini Strip */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.subPhotos.map((sub) => (
                      <button
                        key={sub.label}
                        type="button"
                        onMouseEnter={() =>
                          setCardPreviewPhoto((prev) => ({
                            ...prev,
                            [item.slug]: sub.url,
                          }))
                        }
                        onMouseLeave={() =>
                          setCardPreviewPhoto((prev) => {
                            const next = { ...prev };
                            delete next[item.slug];
                            return next;
                          })
                        }
                        onClick={() =>
                          setCardPreviewPhoto((prev) => ({
                            ...prev,
                            [item.slug]:
                              prev[item.slug] === sub.url
                                ? item.mainPhoto
                                : sub.url,
                          }))
                        }
                        className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden border-2 border-white/70 hover:border-amber-400 shadow-md transition-transform hover:scale-105"
                        title={`Preview ${sub.label}`}
                      >
                        <img
                          src={sub.url}
                          alt={sub.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1 inset-x-1 text-[8px] font-bold text-white truncate text-center">
                          {sub.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LOGGED-IN USER'S SAVED TRIPS */}
      {isAuthenticated && trips.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-heading font-bold text-heading">
                Your Generated & Saved Itineraries ({trips.length})
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Stored securely in your backend account. Open any trip to
                customize stops or download its Illustrated Photo PDF.
              </p>
            </div>
            <Link
              href="/saved-trips"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View All ({trips.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => {
              const samplePhotos = trip.days
                .flatMap((d) => d.activities)
                .slice(0, 3);
              return (
                <div
                  key={trip.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-52 w-full overflow-hidden">
                    <img
                      src={trip.heroImage}
                      alt={trip.destinationName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    <span
                      className={cn(
                        "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        trip.status === "UPCOMING"
                          ? "bg-primary text-white"
                          : trip.status === "COMPLETED"
                          ? "bg-surface/90 text-muted"
                          : "bg-accent text-white"
                      )}
                    >
                      {trip.status}
                    </span>

                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuTripId(
                            openMenuTripId === trip.id ? null : trip.id
                          )
                        }
                        aria-label={`Actions for ${trip.destinationName}`}
                        className="w-8 h-8 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {openMenuTripId === trip.id && (
                        <div className="absolute right-0 mt-1.5 w-44 bg-surface border border-border rounded-xl shadow-elevated py-1.5 z-20">
                          <Link
                            href={`/trips/${trip.id}/edit`}
                            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-sand/40"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-primary" />
                            <span>Customize / Edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={async () => {
                              setOpenMenuTripId(null);
                              await duplicateTrip(trip.id);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-heading hover:bg-sand/40 text-left"
                          >
                            <Copy className="w-3.5 h-3.5 text-primary" />
                            <span>Duplicate</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuTripId(null);
                              setTripToDelete(trip.id);
                            }}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="absolute bottom-3 inset-x-4 flex items-end justify-between gap-2 text-white">
                      <div>
                        <h4 className="text-lg font-heading font-bold leading-snug">
                          {trip.destinationName}
                        </h4>
                        <p className="text-xs text-white/85">
                          From {trip.startCity} • {trip.destinationCountry}
                        </p>
                      </div>
                      {samplePhotos.length > 0 && (
                        <div className="flex -space-x-2">
                          {samplePhotos.map((act) => (
                            <img
                              key={act.id}
                              src={act.photoUrl}
                              alt={act.title}
                              title={act.title}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-xs"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5 text-xs text-muted">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {formatDateRange(trip.startDate, trip.endDate)}
                        </span>
                        <span className="inline-flex items-center gap-1 font-medium text-heading">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {trip.durationDays} Days
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          {trip.travelers}{" "}
                          {trip.travelers === 1 ? "Traveler" : "Travelers"} (
                          {trip.travelType})
                        </span>
                        <span className="font-semibold text-heading">
                          {formatCurrency(trip.budget, trip.currency)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center gap-2.5">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold text-center transition-colors"
                      >
                        Open & Download PDF
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/edit`}
                        className="py-2.5 px-3 rounded-xl border border-border text-heading hover:bg-sand/40 text-xs font-medium transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. CONTINUE PLANNING DRAFTS */}
      {isAuthenticated && drafts.length > 0 && (
        <section className="mb-12">
          <div className="mb-4">
            <h3 className="text-xl font-heading font-bold text-heading">
              Continue Planning
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Pick up right where you left off on your in-progress trip drafts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => {
              const progressPct = Math.min(100, draft.currentStep * 20);
              return (
                <div
                  key={draft.id}
                  className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    {draft.heroImage ? (
                      <img
                        src={draft.heroImage}
                        alt={draft.destinationName}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-bold text-heading">
                          {draft.destinationName || "Untitled Trip"}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand text-heading">
                          Step {draft.currentStep} of 5 ({progressPct}%)
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {draft.durationDays} days • {draft.travelers} travelers
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleContinueDraft(draft)}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-colors"
                    >
                      Continue Planning
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDraft(draft.id)}
                      aria-label="Discard draft"
                      className="p-2 text-muted hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. EXPLORE ALL DESTINATIONS & SACRED PLACES (INTERLEAVED MIXED ORDER + 3-PHOTO STRIP PER CARD) */}
      <section id="explore-destinations" className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Curated Global & Spiritual Catalog (Mixed Visual Order)
            </span>
            <h3 className="text-2xl font-heading font-bold text-heading mt-1">
              Explore Destinations, Cities & Sacred Worship Places
            </h3>
            <p className="text-xs sm:text-sm text-muted mt-0.5">
              Hover any of the 3 landmark thumbnails inside each card to preview
              the places you will visit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL" as const, label: "All Curated Mix (24)" },
              { id: "SACRED" as const, label: "Worship & Holy Places (16)" },
              { id: "LEISURE" as const, label: "Mountains, Beaches & Royal" },
              { id: "GLOBAL" as const, label: "International Wonders" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCatalogCategory(tab.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all",
                  catalogCategory === tab.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface border border-border text-muted hover:text-heading hover:bg-sand/40"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest) => {
            const isSacred =
              dest.category.toLowerCase().includes("sacred") ||
              dest.category.toLowerCase().includes("spiritual") ||
              dest.category.toLowerCase().includes("jyotirlinga") ||
              dest.category.toLowerCase().includes("dham") ||
              dest.category.toLowerCase().includes("pilgrimage");

            const candidateStops = getCandidatePlacesForDestination(
              dest.name
            ).slice(0, 3);
            const activePhoto =
              cardPreviewPhoto[dest.placeId] || dest.heroImage;

            return (
              <div
                key={dest.placeId}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => handlePlanDestination(dest)}
                    className="relative h-56 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={activePhoto}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {isSacred ? (
                        <span className="px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                          <Flame className="w-3 h-3" />
                          <span>Sacred Pilgrimage</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-xs text-white text-[10px] font-semibold">
                          {dest.category}
                        </span>
                      )}

                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                        From ₹{dest.suggestedMinDailyPerPersonINR.toLocaleString("en-IN")}/d
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                      <p className="font-heading font-extrabold text-lg leading-snug group-hover:text-amber-300 transition-colors">
                        {dest.name}
                      </p>
                      <p className="text-[11px] text-white/85 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{dest.stateOrCountry}</span>
                      </p>
                    </div>
                  </div>

                  {/* 3-Photo Landmark Preview Strip */}
                  {candidateStops.length > 0 && (
                    <div className="px-3.5 pt-3 pb-1">
                      <div className="grid grid-cols-3 gap-1.5">
                        {candidateStops.map((stop) => (
                          <button
                            key={stop.placeId}
                            type="button"
                            onMouseEnter={() =>
                              setCardPreviewPhoto((prev) => ({
                                ...prev,
                                [dest.placeId]: stop.photoUrl,
                              }))
                            }
                            onMouseLeave={() =>
                              setCardPreviewPhoto((prev) => {
                                const next = { ...prev };
                                delete next[dest.placeId];
                                return next;
                              })
                            }
                            onClick={() => handlePlanDestination(dest)}
                            className="relative h-12 rounded-lg overflow-hidden border border-border hover:border-primary transition-all"
                            title={stop.name}
                          >
                            <img
                              src={stop.photoUrl}
                              alt={stop.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                            <span className="absolute bottom-0.5 inset-x-1 text-[8px] font-semibold text-white truncate text-left">
                              {stop.name.split("—")[0].trim()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 pt-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted line-clamp-2">
                    {dest.tagline}
                  </p>
                  <button
                    type="button"
                    onClick={() => handlePlanDestination(dest)}
                    className="mt-3.5 w-full py-2.5 px-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-heading font-extrabold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>
                      {isAuthenticated
                        ? `Plan ${dest.name.split("(")[0].trim()} Now`
                        : "Plan Now"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(tripToDelete)}
        title="Delete this itinerary?"
        description="This action will permanently remove the itinerary from your saved trips collection."
        confirmLabel="Delete Itinerary"
        onConfirm={async () => {
          if (tripToDelete) {
            await deleteTrip(tripToDelete);
            setTripToDelete(null);
          }
        }}
        onCancel={() => setTripToDelete(null)}
      />
    </DashboardWorkspaceLayout>
  );
}
