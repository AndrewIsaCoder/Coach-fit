import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import { fetchClients, fetchWorkouts, toggleWorkoutStatus } from "../services/dataService";

export default function DashboardPage() {
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cData, wData] = await Promise.all([fetchClients(), fetchWorkouts()]);
      setClients(cData);
      setWorkouts(wData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    const updated = await toggleWorkoutStatus(id, nextStatus);
    setWorkouts(updated);
  };

  const totalVolumeKg = workouts.reduce((sum, w) => sum + (Number(w.weight_kg) || 0) * (Number(w.sets) || 1) * (Number(w.reps) || 1), 0);
  const completedCount = workouts.filter((w) => w.status === "Completed").length;
  const completionRate = workouts.length ? Math.round((completedCount / workouts.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Coach Dashboard</h1>
          <p className="page-subtitle">Overview of athlete performance, assigned regimens & metrics</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/add-workout" className="btn-primary">
            <span>+</span> Assign New Workout
          </Link>
          <Link to="/clients" className="btn-secondary">
            View All Clients
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Active Athletes"
          value={clients.length}
          icon="👥"
          color="green"
        />
        <StatCard
          label="Total Workouts Assigned"
          value={workouts.length}
          icon="🏋️"
          color="blue"
        />
        <StatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          icon="⚡"
          color="orange"
        />
        <StatCard
          label="Estimated Volume Moved"
          value={`${totalVolumeKg.toLocaleString()} kg`}
          icon="🔥"
          color="purple"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "28px", marginBottom: "32px" }}>
        <div className="card">
          <div className="card-title">
            <span>Featured Athletes</span>
            <Link to="/clients" style={{ fontSize: "0.85rem", color: "var(--accent-green)", textDecoration: "none" }}>
              See all &rarr;
            </Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {clients.slice(0, 3).map((client) => (
              <Link
                key={client.id}
                to={`/clients/${client.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--bg-secondary)",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "inherit",
                  border: "1px solid var(--border-color)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    src={client.avatar_url}
                    alt={client.full_name}
                    style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover" }}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"; }}
                  />
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "0.95rem" }}>{client.full_name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{client.fitness_goal}</div>
                  </div>
                </div>
                <span className="btn-secondary btn-sm">Inspect Profile &rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span>Quick Workout Logger</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "20px" }}>
            Quickly assign a new exercise prescription with custom sets, reps, and target weights directly to any registered athlete profile.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <Link to="/add-workout" className="btn-primary" style={{ justifyContent: "center" }}>
              Open Assignment Form
            </Link>
            <Link to="/workouts" className="btn-secondary" style={{ justifyContent: "center" }}>
              Explore Full Workouts Feed
            </Link>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Recent Workout Activity Feed</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400" }}>
            Real-time Supabase Database Records
          </span>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "20px 0" }}>Loading athlete workouts from database...</p>
        ) : workouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏋️</div>
            <p>No workouts recorded yet. Start by assigning one!</p>
          </div>
        ) : (
          <div className="workouts-table-container">
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Exercise</th>
                  <th>Muscle Group</th>
                  <th>Prescription</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workouts.slice(0, 6).map((workout) => (
                  <tr key={workout.id}>
                    <td>
                      <Link
                        to={`/clients/${workout.client_id}`}
                        style={{ color: "var(--accent-blue)", fontWeight: "600", textDecoration: "none" }}
                      >
                        {workout.client_name}
                      </Link>
                    </td>
                    <td style={{ fontWeight: "700" }}>{workout.exercise_name}</td>
                    <td>
                      <span className={`client-tag tag-${workout.muscle_group?.toLowerCase() || "strength"}`}>
                        {workout.muscle_group}
                      </span>
                    </td>
                    <td>
                      {workout.sets} &times; {workout.reps} @ {workout.weight_kg} kg
                    </td>
                    <td>{workout.scheduled_date}</td>
                    <td>
                      <span className={`status-badge status-${workout.status?.toLowerCase()}`}>
                        {workout.status === "Completed" ? "✓ Completed" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggle(workout.id, workout.status)}
                        className="btn-secondary btn-sm"
                      >
                        {workout.status === "Completed" ? "Mark Pending" : "Mark Done"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
