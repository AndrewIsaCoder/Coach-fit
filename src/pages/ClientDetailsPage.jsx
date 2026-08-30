import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchClientById, fetchWorkoutsByClientId, toggleWorkoutStatus, deleteWorkout } from "../services/dataService";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [c, w] = await Promise.all([fetchClientById(id), fetchWorkoutsByClientId(id)]);
      setClient(c);
      setWorkouts(w);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleToggle = async (workoutId, currentStatus) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    const updatedAll = await toggleWorkoutStatus(workoutId, nextStatus);
    setWorkouts(updatedAll.filter((w) => String(w.client_id) === String(id)));
  };

  const handleDelete = async (workoutId) => {
    if (window.confirm("Are you sure you want to remove this workout session?")) {
      const updatedAll = await deleteWorkout(workoutId);
      setWorkouts(updatedAll.filter((w) => String(w.client_id) === String(id)));
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-secondary)", padding: "40px 0" }}>Loading athlete profile details...</p>;
  }

  if (!client) {
    return (
      <div className="card empty-state">
        <h2>Athlete Not Found</h2>
        <p style={{ margin: "16px 0", color: "var(--text-secondary)" }}>
          No athlete profile found with identifier {id}.
        </p>
        <Link to="/clients" className="btn-primary">
          Back to Athletes Directory
        </Link>
      </div>
    );
  }

  const completedCount = workouts.filter((w) => w.status === "Completed").length;
  const totalVolume = workouts.reduce(
    (sum, w) => sum + (Number(w.weight_kg) || 0) * (Number(w.sets) || 1) * (Number(w.reps) || 1),
    0
  );

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/clients" style={{ color: "var(--accent-green)", textDecoration: "none", fontWeight: "500" }}>
          &larr; Back to Athletes Directory
        </Link>
      </div>

      <div className="card" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
          <img
            src={client.avatar_url}
            alt={client.full_name}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(232, 185, 138, 0.5)"
            }}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"; }}
          />
          <div style={{ flex: 1, minWidth: "220px" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "4px" }}>{client.full_name}</h1>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "8px" }}>
              <span>📧 {client.email}</span> &bull; <span>📞 {client.phone || "N/A"}</span>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <span className={`client-tag tag-${client.fitness_goal?.toLowerCase() || "strength"}`}>
                Goal: {client.fitness_goal}
              </span>
              <span className="client-tag" style={{ background: "rgba(255, 255, 255, 0.1)", color: "#fff" }}>
                Tier: {client.membership_tier || "Standard"}
              </span>
            </div>
          </div>
          <Link to={`/add-workout?clientId=${client.id}`} className="btn-primary">
            <span>+</span> Prescribe Exercise
          </Link>
        </div>

        <hr style={{ borderColor: "var(--border-color)", margin: "24px 0" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Total Assigned</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: "400" }}>{workouts.length}</div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Completed</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: "400", color: "var(--accent-green)" }}>
              {completedCount}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Pending</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: "400", color: "var(--accent-orange)" }}>
              {workouts.length - completedCount}
            </div>
          </div>
          <div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cumulative Volume</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: "400", color: "var(--accent-blue)" }}>
              {totalVolume.toLocaleString()} kg
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">
          <span>Assigned Workouts & History for {client.full_name}</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "400" }}>
            {workouts.length} recorded session(s)
          </span>
        </div>

        {workouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No workouts have been assigned to this athlete yet.</p>
            <div style={{ marginTop: "16px" }}>
              <Link to={`/add-workout?clientId=${client.id}`} className="btn-primary btn-sm">
                Assign First Workout
              </Link>
            </div>
          </div>
        ) : (
          <div className="workouts-table-container">
            <table className="workouts-table">
              <thead>
                <tr>
                  <th>Exercise Name</th>
                  <th>Muscle Group</th>
                  <th>Sets & Reps</th>
                  <th>Weight</th>
                  <th>Duration</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {workouts.map((w) => (
                  <tr key={w.id}>
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
                    <td>{w.duration_min} min</td>
                    <td>{w.scheduled_date}</td>
                    <td>
                      <span className={`status-badge status-${w.status?.toLowerCase()}`}>
                        {w.status === "Completed" ? "✓ Done" : "⏳ Pending"}
                      </span>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "200px" }}>
                      {w.notes || "-"}
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
