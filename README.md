# ⚡ PulseFit Coach MVP

A modern, high-performance coaching and workout prescription web application built with **React**, **Vite**, and **Supabase**.

---

## ✨ Features
- 📊 **Coach Dashboard**: Key performance indicators, active athletes, volume calculation, and live activity feed.
- 👥 **Athlete Directory**: Filterable client registry by fitness goals (Hypertrophy, Strength, Fat Loss, Endurance).
- 🔍 **Athlete Detail History**: Dedicated view for every client displaying their prescribed exercises and performance logs.
- 📝 **Prescription Form**: Interactive workout logger with instant Supabase database persistence.
- ⚡ **Global Workouts Feed**: Filter exercises by muscle group and toggle completion status.
- 🔐 **Supabase Authentication**: Coach registration, login, and secure session management.

---

## 🚀 Quick Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root folder:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase)
Run the SQL script located in `supabase/schema.sql` inside your Supabase Dashboard SQL Editor to generate the `clients` and `workouts` tables.
