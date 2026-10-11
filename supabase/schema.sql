-- ==============================================================================
-- ROAMWISE — SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  home_city TEXT,
  preferred_currency TEXT NOT NULL DEFAULT 'INR',
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TRIPS
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  destination_place_id TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  destination_country TEXT,
  hero_image TEXT,
  start_city TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  travelers INT NOT NULL DEFAULT 2 CHECK (travelers > 0),
  travel_type TEXT NOT NULL DEFAULT 'Couple',
  budget NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  ai_summary TEXT,
  status TEXT NOT NULL DEFAULT 'PLANNED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);

-- 3. TRIP DAYS
CREATE TABLE IF NOT EXISTS public.trip_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  weather_note TEXT,
  UNIQUE(trip_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_trip_days_trip_id ON public.trip_days(trip_id);

-- 4. ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_day_id UUID NOT NULL REFERENCES public.trip_days(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  expected_duration INT NOT NULL DEFAULT 90,
  estimated_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  position INT NOT NULL DEFAULT 0,
  notes TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  rating NUMERIC(3, 2),
  opening_hours TEXT,
  photo_url TEXT,
  travel_time_to_next INT
);

CREATE INDEX IF NOT EXISTS idx_activities_trip_day_id ON public.activities(trip_day_id, position);

-- 5. BUDGET ITEMS
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  day_number INT,
  estimated_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  source_label TEXT NOT NULL DEFAULT 'Estimated'
);

CREATE INDEX IF NOT EXISTS idx_budget_items_trip_id ON public.budget_items(trip_id);

-- 6. SHARED TRIPS
CREATE TABLE IF NOT EXISTS public.shared_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  access_token_hash TEXT UNIQUE NOT NULL,
  include_budget BOOLEAN NOT NULL DEFAULT TRUE,
  is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
  expiration_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_trips_trip_id ON public.shared_trips(trip_id);

-- 7. GENERATION JOBS
CREATE TABLE IF NOT EXISTS public.generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trip_draft_id TEXT,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generation_jobs_user_id ON public.generation_jobs(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update own profile" ON public.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users manage own trips" ON public.trips
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage own trip days" ON public.trip_days
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips t WHERE t.id = trip_days.trip_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Users manage own activities" ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trip_days td
      JOIN public.trips t ON t.id = td.trip_id
      WHERE td.id = activities.trip_day_id AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users manage own budget items" ON public.budget_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips t WHERE t.id = budget_items.trip_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Users manage own shared trip links" ON public.shared_trips
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips t WHERE t.id = shared_trips.trip_id AND t.user_id = auth.uid())
  );

CREATE POLICY "Users view own generation jobs" ON public.generation_jobs
  FOR ALL USING (auth.uid() = user_id);
