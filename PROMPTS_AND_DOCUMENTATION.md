# 📋 PROMPTS & DOCUMENTAȚIE PROIECT: PulseFit Coach MVP
**Curs 13359 - From Idea to Working MVP with Lovable and Supabase**
**Student:** Andrei Stoian

---

## 1. 🎯 Descrierea Proiectului
* **Denumire Aplicație:** PulseFit Coach MVP
* **Scop:** O platformă modernă dedicată antrenorilor personali și atleților pentru planificarea, atribuirea și monitorizarea în timp real a antrenamentelor și progresului de forță.
* **Tehnologii:** React 18, React Router v6, Supabase (Database & Auth), Vite.
* **Link Aplicație Live:** `https://pulsefit-coach.netlify.app` *(sau link-ul tău de pe Vercel/Netlify)*
* **Link GitHub Repository:** `https://github.com/AndrewIsaCoder/Coach-fit`

---

## 2. 🤖 Prompturile Utilizate în Instrumentul AI (Lovable)

### 📌 Promptul Inițial (Master Initial Prompt):
```text
Create a modern, high-performance React web application called "PulseFit Coach" for personal trainers to prescribe workouts, manage clients, and track athlete training progress in real-time with a Supabase backend.

Key Requirements:
1. Brand & Design System:
   - Modern athletic dark-mode theme (slate #0a0f1d, card #1e293b, neon green accent #22c55e, electric blue #38bdf8).
   - Clean typography using Google Fonts (Outfit & Plus Jakarta Sans).
   - Fully responsive layout with smooth transitions, stats widgets, and status pills.

2. Application Pages & Navigation:
   - Dashboard (/): Metric cards (Active Athletes, Total Workouts, Completion Rate, Cumulative Volume kg), recent workouts feed with quick status toggles (Pending/Completed).
   - Clients Directory (/clients): Searchable and filterable athlete directory by fitness goals (Hypertrophy, Strength, Fat Loss, Endurance).
   - Client Details View (/clients/:id): Dynamic detail page showing client profile, contact info, goal badge, and all workouts prescribed specifically to this athlete.
   - Prescribe Workout Form (/add-workout): Form to assign exercises to athletes (client selector, exercise name, muscle group, sets, reps, weight kg, duration, scheduled date, coaching notes).
   - Workouts Feed (/workouts): Global exercise registry with filter by muscle group and completion status.
   - Authentication (/login, /register): Sign in, Sign up, and Sign out using Supabase Auth.

3. Database & Supabase Integration:
   - Connect to Supabase using @supabase/supabase-js with environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
   - Tables: 'clients' (id, full_name, email, avatar_url, phone, fitness_goal, membership_tier) and 'workouts' (id, client_id, client_name, exercise_name, muscle_group, sets, reps, weight_kg, duration_min, scheduled_date, status, notes).
   - Implement graceful offline/fallback state so the application runs seamlessly even before keys are connected.
```

### 📌 Promptul de Rafinare 1 - Bază de Date & Structură Formulare:
```text
Refine the workout assignment form and database service:
- Ensure the form validates all numerical inputs (sets >= 1, reps >= 1, weight >= 0).
- When a workout is saved, immediately sync it with the Supabase 'workouts' table and navigate to the client's detailed history page.
- Add quick action buttons on each workout row to toggle status between 'Pending' and 'Completed' with live recalculation of completion metrics.
```

### 📌 Promptul de Rafinare 2 - Autentificare & Securitate Supabase:
```text
Add full user authentication support:
- Create Register and Login views connected to supabase.auth.
- Add session listener in App.jsx to update navigation header with the active coach's email and logout button.
- Provide a clean SQL schema script with Row Level Security (RLS) policies enabled.
```

---

## 3. 🗄️ Structura Bazei de Date Supabase (SQL Schema)
Pentru a crea tabelele în Supabase, s-a rulat următorul script în **Supabase Dashboard -> SQL Editor**:
```sql
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    fitness_goal TEXT DEFAULT 'Hypertrophy',
    membership_tier TEXT DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.workouts (
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

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to workouts" ON public.workouts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to workouts" ON public.workouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to workouts" ON public.workouts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to workouts" ON public.workouts FOR DELETE USING (true);
```
