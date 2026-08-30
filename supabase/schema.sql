-- ==========================================================
-- PULSEFIT COACH MVP - SUPABASE DATABASE SCHEMA & SEED DATA
-- Copy and paste this script into Supabase Dashboard -> SQL Editor -> Run
-- ==========================================================

-- 1. Create Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    fitness_goal TEXT DEFAULT 'Hypertrophy',
    membership_tier TEXT DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Workouts Table
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    muscle_group TEXT NOT NULL DEFAULT 'Chest',
    sets INTEGER NOT NULL DEFAULT 3,
    reps INTEGER NOT NULL DEFAULT 10,
    weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 20.0,
    duration_min INTEGER DEFAULT 15,
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- 4. Create Open Access Policies for the MVP (Read/Write)
CREATE POLICY "Allow public read access to clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to clients" ON public.clients FOR DELETE USING (true);

CREATE POLICY "Allow public read access to workouts" ON public.workouts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to workouts" ON public.workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to workouts" ON public.workouts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to workouts" ON public.workouts FOR DELETE USING (true);

-- 5. Seed Initial Sample Athletes
INSERT INTO public.clients (id, full_name, email, avatar_url, phone, fitness_goal, membership_tier)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Alex Morgan', 'alex.m@example.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', '+40 721 000 111', 'Hypertrophy', 'Elite Pro'),
    ('c2222222-2222-2222-2222-222222222222', 'David Chen', 'david.c@example.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+40 722 333 444', 'Strength', 'Standard'),
    ('c3333333-3333-3333-3333-333333333333', 'Elena Vasilescu', 'elena.v@example.com', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', '+40 733 555 666', 'Fat Loss', 'Elite Pro'),
    ('c4444444-4444-4444-4444-444444444444', 'Marcus Aurelius', 'marcus.fit@example.com', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+40 744 777 888', 'Endurance', 'Premium')
ON CONFLICT (email) DO NOTHING;

-- 6. Seed Initial Assigned Workouts
INSERT INTO public.workouts (client_id, client_name, exercise_name, muscle_group, sets, reps, weight_kg, duration_min, scheduled_date, status, notes)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Alex Morgan', 'Barbell Back Squats', 'Legs', 4, 8, 110.0, 25, CURRENT_DATE, 'Completed', 'Perfect depth, maintained thoracic extension throughout all sets.'),
    ('c1111111-1111-1111-1111-111111111111', 'Alex Morgan', 'Romanian Deadlift', 'Legs', 3, 10, 85.0, 20, CURRENT_DATE, 'Completed', 'Target hamstrings and glute stretch on eccentric phase.'),
    ('c2222222-2222-2222-2222-222222222222', 'David Chen', 'Incline Dumbbell Press', 'Chest', 4, 10, 34.0, 20, CURRENT_DATE, 'Pending', 'Focus on controlled 3-second negative descent.'),
    ('c3333333-3333-3333-3333-333333333333', 'Elena Vasilescu', 'Kettlebell Swing & HIIT Circuit', 'Cardio', 5, 20, 16.0, 35, CURRENT_DATE, 'Completed', 'Heart rate in zone 4, explosive hip hinge.'),
    ('c4444444-4444-4444-4444-444444444444', 'Marcus Aurelius', 'Weighted Pull-ups', 'Back', 4, 6, 15.0, 15, CURRENT_DATE, 'Pending', 'Full dead hang to chin over bar.');
