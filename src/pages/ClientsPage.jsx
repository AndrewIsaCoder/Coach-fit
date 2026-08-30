import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchClients, fetchWorkouts } from "../services/dataService";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [cData, wData] = await Promise.all([fetchClients(), fetchWorkouts()]);
      setClients(cData);
      setWorkouts(wData);
      setLoading(false);
    }
    load();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGoal = selectedGoal === "All" || client.fitness_goal === selectedGoal;
    return matchesSearch && matchesGoal;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Athletes & Clients Directory</h1>
          <p className="page-subtitle">
            Click on any athlete to inspect their dedicated workout history and performance details
          </p>
        </div>
        <Link to="/add-workout" className="btn-primary">
          <span>+</span> Assign New Workout
        </Link>
      </div>

      <div className="card" style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <input
              type="text"
              placeholder="Search athlete by name or email..."
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", "Hypertrophy", "Strength", "Fat Loss", "Endurance"].map((goal) => (
              <button
                key={goal}
                type="button"
                className={selectedGoal === goal ? "btn-primary btn-sm" : "btn-secondary btn-sm"}
                onClick={() => setSelectedGoal(goal)}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Loading athletes...</p>
      ) : filteredClients.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">👥</div>
          <p>No athletes found matching your search filter.</p>
        </div>
      ) : (
        <div className="clients-grid">
          {filteredClients.map((client) => {
            const clientWorkouts = workouts.filter((w) => String(w.client_id) === String(client.id));
            const completed = clientWorkouts.filter((w) => w.status === "Completed").length;

            return (
              <Link key={client.id} to={`/clients/${client.id}`} className="client-card">
                <div className="client-header">
                  <img
                    src={client.avatar_url}
                    alt={client.full_name}
                    className="client-avatar"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"; }}
                  />
                  <div>
                    <div className="client-name">{client.full_name}</div>
                    <div className="client-email">{client.email}</div>
                    <span className={`client-tag tag-${client.fitness_goal?.toLowerCase() || "strength"}`}>
                      {client.fitness_goal}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "var(--bg-secondary)",
                    borderRadius: "8px",
                    fontSize: "0.88rem",
                    marginBottom: "14px"
                  }}
                >
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Assigned: </span>
                    <strong>{clientWorkouts.length}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Done: </span>
                    <strong style={{ color: "var(--accent-green)" }}>{completed}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--text-muted)" }}>Tier: </span>
                    <strong style={{ color: "var(--accent-blue)" }}>{client.membership_tier || "Standard"}</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right", color: "var(--accent-green)", fontSize: "0.9rem", fontWeight: "700" }}>
                  View Full Regimen &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
