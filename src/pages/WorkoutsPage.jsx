import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWorkouts, toggleWorkoutStatus, deleteWorkout } from "../services/dataService";

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    const next = currentStatus === "Completed" ? "Pending" : "Completed";
    const updated = await toggleWorkoutStatus(id, next);
    setWorkouts(updated);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this workout from database?")) {
      const updated = await deleteWorkout(id);
      setWorkouts(updated);
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    const matchesMuscle = muscleFilter === "All" || w.muscle_group === muscleFilter;
    const matchesStatus = statusFilter === "All" || w.status === statusFilter;
    return matchesMuscle && matchesStatus;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Global Workouts Registry</h1>
          <p className="page-subtitle">Inspect, filter, and track status for all prescribed exercise routines</p>
        </div>
        <Link to="/add-workout" className="btn-primary">
          <span>+</span> Assign New Workout
        </Link>
      </div>

      <div className="card" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Filter by Muscle Group</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["All", "Chest", "Back", "Legs", "Shoulders", "Arms", "Cardio"].map((m) => (
                <button
                  key={m}
                  type="button"
                  className={muscleFilter === m ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
                  onClick={() => setMuscleFilter(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px" }}>Filter by Status</div>
            <div style={{ display: "flex", gap: "8px" }}>
              {["All", "Pending", "Completed"].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={statusFilter === s ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p style={{ color: "var(--text-secondary)", padding: "30px 0" }}>Loading workouts...</p>
        ) : filteredWorkouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <p>No workouts found matching the active filters.</p>
          </div>
        ) : (
          <div className="workouts-table-container">
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Athlete</th>
                  <th>Exercise</th>
                  <th>Target Muscle</th>
                  <th>Prescription</th>
                  <th>Weight</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((w) => (
                  <tr key={w.id}>
                    <td>
                      <Link
                        to={`/clients/${w.client_id}`}
                        style={{ color: "var(--accent-blue)", fontWeight: "500", textDecoration: "none" }}
                      >
                        {w.client_name}
                      </Link>
                    </td>
                    <td style={{ fontWeight: "500" }}>{w.exercise_name}</td>
                    <td>
                      <span className={`client-tag tag-${w.muscle_group?.toLowerCase() || "strength"}`}>
                        {w.muscle_group}
                      </span>
                    </td>
                    <td>
                      {w.sets} sets &times; {w.reps} reps
                    </td>
                    <td>{w.weight_kg} kg</td>
                    <td>{w.scheduled_date}</td>
                    <td>
                      <span className={`status-badge status-${w.status?.toLowerCase()}`}>
                        {w.status === "Completed" ? "✓ Completed" : "⏳ Pending"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => handleToggle(w.id, w.status)}
                          className="btn-secondary btn-sm"
                        >
                          {w.status === "Completed" ? "Mark Pending" : "Mark Done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(w.id)}
                          className="btn-danger btn-sm"
                        >
                          ✕
                        </button>
                      </div>
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
