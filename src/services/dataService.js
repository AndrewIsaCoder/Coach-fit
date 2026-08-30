import { supabase } from "./supabase";

const defaultClients = [
  {
    id: "1",
    full_name: "Alex Morgan",
    email: "alex.m@example.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+40 721 000 111",
    fitness_goal: "Hypertrophy",
    membership_tier: "Elite Pro"
  },
  {
    id: "2",
    full_name: "David Chen",
    email: "david.c@example.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+40 722 333 444",
    fitness_goal: "Strength",
    membership_tier: "Standard"
  },
  {
    id: "3",
    full_name: "Elena Vasilescu",
    email: "elena.v@example.com",
    avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    phone: "+40 733 555 666",
    fitness_goal: "Fat Loss",
    membership_tier: "Elite Pro"
  },
  {
    id: "4",
    full_name: "Marcus Aurelius",
    email: "marcus.fit@example.com",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+40 744 777 888",
    fitness_goal: "Endurance",
    membership_tier: "Premium"
  }
];

const defaultWorkouts = [
  {
    id: "101",
    client_id: "1",
    client_name: "Alex Morgan",
    exercise_name: "Barbell Back Squats",
    muscle_group: "Legs",
    sets: 4,
    reps: 8,
    weight_kg: 110,
    duration_min: 25,
    scheduled_date: "2026-08-30",
    status: "Completed",
    notes: "Perfect depth, maintained thoracic extension throughout all sets."
  },
  {
    id: "102",
    client_id: "1",
    client_name: "Alex Morgan",
    exercise_name: "Romanian Deadlift",
    muscle_group: "Legs",
    sets: 3,
    reps: 10,
    weight_kg: 85,
    duration_min: 20,
    scheduled_date: "2026-08-30",
    status: "Completed",
    notes: "Target hamstrings and glute stretch on eccentric phase."
  },
  {
    id: "103",
    client_id: "2",
    client_name: "David Chen",
    exercise_name: "Incline Dumbbell Press",
    muscle_group: "Chest",
    sets: 4,
    reps: 10,
    weight_kg: 34,
    duration_min: 20,
    scheduled_date: "2026-08-31",
    status: "Pending",
    notes: "Focus on controlled 3-second negative descent."
  },
  {
    id: "104",
    client_id: "3",
    client_name: "Elena Vasilescu",
    exercise_name: "Kettlebell Swing & HIIT Circuit",
    muscle_group: "Cardio",
    sets: 5,
    reps: 20,
    weight_kg: 16,
    duration_min: 35,
    scheduled_date: "2026-08-30",
    status: "Completed",
    notes: "Heart rate in zone 4, explosive hip hinge."
  },
  {
    id: "105",
    client_id: "4",
    client_name: "Marcus Aurelius",
    exercise_name: "Weighted Pull-ups",
    muscle_group: "Back",
    sets: 4,
    reps: 6,
    weight_kg: 15,
    duration_min: 15,
    scheduled_date: "2026-09-01",
    status: "Pending",
    notes: "Full dead hang to chin over bar."
  }
];

function getStoredClients() {
  const stored = localStorage.getItem("pulsefit_clients");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem("pulsefit_clients", JSON.stringify(defaultClients));
  return defaultClients;
}

function getStoredWorkouts() {
  const stored = localStorage.getItem("pulsefit_workouts");
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem("pulsefit_workouts", JSON.stringify(defaultWorkouts));
  return defaultWorkouts;
}

export async function fetchClients() {
  try {
    const { data, error } = await supabase.from("clients").select("*").order("full_name");
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {}
  return getStoredClients();
}

export async function fetchClientById(id) {
  try {
    const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
    if (!error && data) return data;
  } catch (err) {}
  const local = getStoredClients();
  return local.find((c) => String(c.id) === String(id)) || null;
}

export async function fetchWorkouts() {
  try {
    const { data, error } = await supabase.from("workouts").select("*").order("scheduled_date", { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {}
  return getStoredWorkouts();
}

export async function fetchWorkoutsByClientId(clientId) {
  try {
    const { data, error } = await supabase.from("workouts").select("*").eq("client_id", clientId).order("scheduled_date", { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {}
  const all = getStoredWorkouts();
  return all.filter((w) => String(w.client_id) === String(clientId));
}

export async function addWorkout(workoutData) {
  const newId = Date.now().toString();
  const fullWorkout = { id: newId, ...workoutData };

  try {
    const { data, error } = await supabase.from("workouts").insert([workoutData]).select();
    if (!error && data && data.length > 0) {
      return data[0];
    }
  } catch (err) {}

  const current = getStoredWorkouts();
  const updated = [fullWorkout, ...current];
  localStorage.setItem("pulsefit_workouts", JSON.stringify(updated));
  return fullWorkout;
}

export async function toggleWorkoutStatus(workoutId, newStatus) {
  try {
    await supabase.from("workouts").update({ status: newStatus }).eq("id", workoutId);
  } catch (err) {}

  const current = getStoredWorkouts();
  const updated = current.map((w) => (String(w.id) === String(workoutId) ? { ...w, status: newStatus } : w));
  localStorage.setItem("pulsefit_workouts", JSON.stringify(updated));
  return updated;
}

export async function deleteWorkout(workoutId) {
  try {
    await supabase.from("workouts").delete().eq("id", workoutId);
  } catch (err) {}

  const current = getStoredWorkouts();
  const updated = current.filter((w) => String(w.id) !== String(workoutId));
  localStorage.setItem("pulsefit_workouts", JSON.stringify(updated));
  return updated;
}
