CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('traveler', 'expert', 'admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audio_session_status') THEN
        CREATE TYPE audio_session_status AS ENUM ('matching', 'active', 'completed', 'cancelled');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expert_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    languages TEXT[] NOT NULL DEFAULT '{}',
    hourly_rate_cents INTEGER NOT NULL CHECK (hourly_rate_cents >= 0),
    is_online BOOLEAN NOT NULL DEFAULT false,
    coverage_location GEOGRAPHY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expert_coverage
    ON expert_profiles
    USING GIST (coverage_location);

CREATE INDEX IF NOT EXISTS idx_expert_online
    ON expert_profiles (is_online)
    WHERE is_online = true;

CREATE TABLE IF NOT EXISTS audio_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    traveler_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    expert_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    status audio_session_status NOT NULL DEFAULT 'matching',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    total_cost_cents INTEGER NOT NULL DEFAULT 0 CHECK (total_cost_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time >= start_time)
);

CREATE INDEX IF NOT EXISTS idx_audio_sessions_traveler
    ON audio_sessions (traveler_id);

CREATE INDEX IF NOT EXISTS idx_audio_sessions_expert
    ON audio_sessions (expert_id);

CREATE INDEX IF NOT EXISTS idx_audio_sessions_status
    ON audio_sessions (status);
