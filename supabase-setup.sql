-- SQL for å opprette tabeller i Supabase
-- Gå til SQL Editor i Supabase Dashboard og kjør denne koden

-- Slett eksisterende tabeller for å starte på nytt
DROP TABLE IF EXISTS availability;
DROP TABLE IF EXISTS users;

-- Opprett brukertabell
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opprett tilgjengelighetstabell
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  day_index INTEGER NOT NULL,
  hour INTEGER NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(username, day_index, hour)
);

-- Opprett indeks for raskere oppslag
CREATE INDEX IF NOT EXISTS idx_availability_username ON availability(username);

-- Deaktiver Row Level Security (RLS) for enkel testing
-- For produksjonsbruk bør du aktivere RLS og sette opp riktige policies
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE availability DISABLE ROW LEVEL SECURITY;

-- Funksjon for å oppdatere updated_at automatisk
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for å oppdatere updated_at
DROP TRIGGER IF EXISTS update_availability_updated_at ON availability;
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
