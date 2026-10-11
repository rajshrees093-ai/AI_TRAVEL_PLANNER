# RoamWise — Explore More. Plan Less. Travel Smarter.

RoamWise is a production-oriented, full-stack **AI Travel Planning Platform** built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Recharts**, **Zod**, **Supabase PostgreSQL / Prisma**, **OpenAI Structured Outputs**, and **Google Maps Platform APIs**.

Travelers enter their destination, dates, traveler count, group type, interests, travel pace, dietary preferences, and budget. RoamWise generates a personalized, geographically clustered day-by-day itinerary using verified place metadata, interactive route maps, and financial budget breakdowns.

---

## 1. Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling & Design System**: Tailwind CSS with RoamWise custom brand tokens (`#087F8C` Deep Ocean Teal, `#FAFAF7` Warm Off-White, `#FF8066` Warm Sunset Coral, `#F5E9D8` Soft Sand, `#1F2933` Deep Charcoal) + Dark Mode support
- **Typography**: `Plus Jakarta Sans` (Headings), `Inter` (Body), `Playfair Display` (Editorial hero accents)
- **Icons & Animations**: `lucide-react` & `framer-motion` (with `prefers-reduced-motion` support)
- **Visualizations**: `recharts` (Donut & Stacked Daily Expense Bar Charts)
- **Validation**: `zod` & `react-hook-form`

### Backend & Persistence
- **API Layer**: Next.js App Router Route Handlers (`/api/*`)
- **AI Engine**: OpenAI API (`gpt-4o-mini` / `gpt-4o`) + deterministic Verified Place Constraint Solver & Route Optimizer
- **Location & Routing Services**: Google Places API (New), Google Routes API, Google Maps JavaScript / Directions integration
- **Database & Auth**: Supabase PostgreSQL (`supabase/schema.sql` with Row Level Security policies) + Prisma ORM (`prisma/schema.prisma`) + Hybrid persistent store for zero-config local execution

---

## 2. Complete Screen & Route Architecture (18 Screens)

| Screen | Route | Description |
| :--- | :--- | :--- |
| **1. Landing Page** | `/` | Sticky translucent navbar, Hero + Quick Trip Search widget, 8 Popular Destinations, How It Works, Feature Highlights, Footer |
| **2. Login Page** | `/login` | Split-screen photography, Email/Password, visibility toggle, Forgot Password flow, Google Sign-In |
| **3. Sign Up Page** | `/signup` | Split-screen layout, password strength rules, Zod validation, account creation |
| **4. User Dashboard** | `/dashboard` | Collapsible sidebar, time-aware greeting, Hero banner, 4 live database summary cards, Upcoming Adventures grid, Continue Planning drafts, Destination carousel, First-time user empty state |
| **5. Destination Selection** | `/create-trip/destination` | Step 1: Google Places / Verified catalog autocomplete, stable `ChIJ...` Place ID capture, popular destination cards |
| **6. Dates & Travelers** | `/create-trip/dates` | Step 2: Start/End dates, automatic duration, starting city, traveler count, group cards (`Solo`, `Couple`, `Friends`, `Family`), sightseeing window |
| **7. Travel Preferences** | `/create-trip/preferences` | Step 3: 12 selectable interest cards, Travel Pace (`Relaxed`, `Balanced`, `Packed`), Food & dietary preferences, free-text special notes |
| **8. Budget Planner** | `/create-trip/budget` | Step 4: Total/Per-Person budget toggle, currency, tier (`Economy`, `Comfort`, `Premium`), expense coverage, segmented allocation preview & restrictive budget warning |
| **9. Trip Review** | `/create-trip/review` | Step 5: Complete summary with section jump-edits and duplicate-submission prevention |
| **10. AI Generation Screen** | `/create-trip/generating` | Real step-based server job polling (`/api/trips/generate/[jobId]`), animated compass, retry handling |
| **11. Trip Overview** | `/trips/[tripId]` | Hero, Save/Edit/Share/Regenerate/PDF action bar, 4 summary cards, AI Personalization Rationale, Weather-Aware Planning banner, Day previews, Hidden Gems, Group Collaboration & Voting board |
| **12. Day-Wise Itinerary** | `/trips/[tripId]/itinerary` | Chronological timeline, reorder stops, replace with verified places, edit times, move between days, delete stops, single-day regeneration |
| **13. Places & Restaurants** | `/trips/[tripId]/places` | Discovery hub with search, category/price/dietary filters, verified place detail modal, Add to Day action |
| **14. Interactive Route Map** | `/trips/[tripId]/map` | Split-screen stop list + interactive coordinate-projected route map with numbered pins, polylines, travel mode switcher (`DRIVE`, `TRANSIT`, `WALK`), and Smart Route Optimizer |
| **15. Trip Budget Analysis** | `/trips/[tripId]/budget` | 4 financial summary cards, Recharts Donut & Daily Bar charts, inline editable expense table, and one-click **AI Budget Rescue** |
| **16. Saved Trips** | `/saved-trips` | Grid/List toggle, search, status filters (`Upcoming`, `Past`, `Draft`), sort, duplicate, share, delete confirmation |
| **17. Edit & Customize Trip** | `/trips/[tripId]/edit` | Parameter editor + **Conversational AI Editor** ("Ask RoamWise to Adjust Your Trip") with budget/transit diff preview |
| **18. Profile & Settings** | `/profile` | Personal profile, saved default travel preferences (auto-prefills future trips), Light/Dark theme switch, password update, account deletion |
| **Shared Trip Page** | `/share/[token]` | Sanitized public read-only itinerary with optional budget visibility, expiration date, print PDF, and instant link revocation |

---

## 3. Installation & Running Locally

### Prerequisites
- Node.js `v18.18+` or `v20+` / `v24+`
- `npm`

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
> **Demonstration Mode**: If API keys are omitted, RoamWise automatically runs in a clearly labeled **Demo & Verified Catalog Mode** with full functionality across all 18 screens, persisted trips, route calculations, and AI itinerary customization.

### Step 3: Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Step 4: Run Automated Tests & Production Build
```bash
npm test
npm run build
```

---

## 4. Google Cloud & Supabase Setup Guide

### Google Cloud API Activation & Key Restrictions
1. Open the **Google Cloud Console** and enable:
   - **Maps JavaScript API**
   - **Places API (New)**
   - **Routes API**
2. Create **two separate keys**:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Restrict by **HTTP Referrer** (`http://localhost:3000/*`, `https://your-vercel-domain.vercel.app/*`) and limit API scope strictly to **Maps JavaScript API**.
   - `GOOGLE_MAPS_SERVER_KEY`: Restrict by **Server IP** and limit API scope to **Places API (New)** and **Routes API**. Never expose this key to the browser.

### Supabase & Database Migration
1. Create a new project at [supabase.com](https://supabase.com).
2. Run the SQL migration in `supabase/schema.sql` inside the Supabase SQL Editor to create all 7 tables (`users`, `trips`, `trip_days`, `activities`, `budget_items`, `shared_trips`, `generation_jobs`) and enable Row Level Security (RLS) policies.
3. Optionally sync Prisma with `npx prisma db push`.

---

## 5. Feature Limitations & Honesty Notes
- **Estimates vs. Live Bookings**: All activity, accommodation, dining, and transport figures are clearly labeled as preliminary or regional benchmark estimates—not confirmed booking quotes.
- **Weather-Aware Planning**: Uses seasonal climate benchmarks and advises checking 48-hour live radar prior to outdoor hikes rather than fabricating long-range daily weather forecasts.
