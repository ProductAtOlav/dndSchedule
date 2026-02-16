-- =============================================================
-- DnD Planner V3 - Forenklet Database Schema (uten auth)
-- Kjør dette i Supabase SQL Editor
-- =============================================================

-- Slett gamle tabeller (rekkefølge er viktig pga. foreign keys)
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS profiles;

-- Slett gamle triggers og funksjoner fra V2
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 1. PROFILER (standalone, ikke koblet til auth)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  display_name TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('dm', 'player')),
  avatar INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MIGRERING: Hvis profiles-tabellen allerede finnes, kjør denne i stedet:
-- ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar INTEGER NOT NULL DEFAULT 0;

-- 2. TILGJENGELIGHET
CREATE TABLE availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  day_index INTEGER NOT NULL CHECK (day_index >= 0 AND day_index <= 6),
  hour INTEGER NOT NULL CHECK (hour >= 8 AND hour <= 22),
  is_available BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_index, hour)
);

-- 3. INDEKSER
CREATE INDEX IF NOT EXISTS idx_availability_user_id ON availability(user_id);
CREATE INDEX IF NOT EXISTS idx_availability_day_hour ON availability(day_index, hour);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- 4. AUTO-OPPDATER updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_availability_updated_at ON availability;
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. DEAKTIVER RLS (ingen auth, alle kan lese og skrive)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;
