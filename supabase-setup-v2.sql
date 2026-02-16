-- =============================================================
-- DnD Planner V2 - Database Schema
-- Kjør dette i Supabase SQL Editor
-- VIKTIG: Deaktiver "Confirm email" i Dashboard > Auth > Settings først
-- =============================================================

-- Slett gamle tabeller (rekkefølge er viktig pga. foreign keys)
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS users;

-- 1. PROFILER (koblet til Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('dm', 'player')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TILGJENGELIGHET (bruker UUID i stedet for brukernavn)
CREATE TABLE IF NOT EXISTS availability (
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
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

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

-- 5. AUTO-OPPRETT PROFIL ved registrering
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'player')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 6. ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Slett gamle policies først
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Availability is viewable by everyone" ON availability;
DROP POLICY IF EXISTS "Users can insert own availability" ON availability;
DROP POLICY IF EXISTS "Users can update own availability" ON availability;
DROP POLICY IF EXISTS "Users can delete own availability" ON availability;

-- Profiler: alle kan lese, brukere kan oppdatere sin egen
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Tilgjengelighet: alle kan lese, brukere kan endre sin egen
CREATE POLICY "Availability is viewable by everyone"
  ON availability FOR SELECT USING (true);

CREATE POLICY "Users can insert own availability"
  ON availability FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own availability"
  ON availability FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own availability"
  ON availability FOR DELETE USING (auth.uid() = user_id);
