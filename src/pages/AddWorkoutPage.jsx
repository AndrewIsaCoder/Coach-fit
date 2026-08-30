import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { fetchClients, addWorkout } from "../services/dataService";

export default function AddWorkoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    client_id: preselectedClientId,
    client_name: "",
    exercise_name: "",
    muscle_group: "Chest",
    sets: 3,
    reps: 10,
    weight_kg: 20,
    duration_min: 15,
    scheduled_date: new Date().toISOString().split("T")[0],
    status: "Pending",
    notes: ""
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const cList = await fetchClients();
      setClients(cList);

      if (preselectedClientId) {
        const found = cList.find((c) => String(c.id) === String(preselectedClientId));
        if (found) {
          setFormData((prev) => ({
            ...prev,
            client_id: found.id,
            client_name: found.full_name
          }));
        }
      } else if (cList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          client_id: cList[0].id,
          client_name: cList[0].full_name
        }));
      }
      setLoading(false);
    }
    load();
  }, [preselectedClientId]);

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    const found = clients.find((c) => String(c.id) === String(selectedId));
    setFormData((prev) => ({
      ...prev,
      client_id: selectedId,
      client_name: found ? found.full_name : ""
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.exercise_name.trim()) {
      setErrorMsg("Please specify the exercise name.");
      return;
    }

    if (!formData.client_id) {
      setErrorMsg("Please select an athlete.");
      return;
    }

    setSubmitting(true);
    try {
      await addWorkout({
        client_id: formData.client_id,
        client_name: formData.client_name,
        exercise_name: formData.exercise_name,
        muscle_group: formData.muscle_group,
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight_kg: Number(formData.weight_kg),
        duration_min: Number(formData.duration_min),
        scheduled_date: formData.scheduled_date,
        status: formData.status,
        notes: formData.notes
      });

      setSuccessMsg("Workout prescription saved successfully to Supabase database!");
      setTimeout(() => {
        navigate(`/clients/${formData.client_id}`);
      }, 1200);
    } catch (err) {
      setErrorMsg("Error saving workout to database: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescribe Athlete Workout</h1>
          <p className="page-subtitle">Add a structured exercise routine and sync directly with Supabase</p>
        </div>
      </div>

      <div className="card">
        {successMsg && <div className="alert alert-success">{successMsg}</div>}
        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading athletes...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="client_id">Select Athlete / Client *</label>
              <select
                id="client_id"
                name="client_id"
                className="form-control"
                value={formData.client_id}
                onChange={handleClientChange}
                required
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.fitness_goal}) - {c.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="exercise_name">Exercise Name *</label>
              <input
                type="text"
                id="exercise_name"
                name="exercise_name"
                className="form-control"
                placeholder="e.g. Barbell Deadlift, Dumbbell Incline Press, Pull-ups"
                value={formData.exercise_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row form-group">
              <div>
                <label className="form-label" htmlFor="muscle_group">Target Muscle Group</label>
                <select
                  id="muscle_group"
                  name="muscle_group"
                  className="form-control"
                  value={formData.muscle_group}
                  onChange={handleChange}
                >
                  <option value="Chest">Chest</option>
                  <option value="Back">Back</option>
                  <option value="Legs">Legs</option>
                  <option value="Shoulders">Shoulders</option>
                  <option value="Arms">Arms</option>
                  <option value="Core">Core</option>
                  <option value="Cardio">Cardio / HIIT</option>
                </select>
              </div>

              <div>
                <label className="form-label" htmlFor="status">Initial Status</label>
                <select
                  id="status"
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-row form-group">
              <div>
                <label className="form-label" htmlFor="sets">Sets</label>
                <input
                  type="number"
                  id="sets"
                  name="sets"
                  className="form-control"
                  min="1"
                  max="20"
                  value={formData.sets}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="reps">Reps / Set</label>
                <input
                  type="number"
                  id="reps"
                  name="reps"
                  className="form-control"
                  min="1"
                  max="100"
                  value={formData.reps}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="weight_kg">Weight (kg)</label>
                <input
                  type="number"
                  id="weight_kg"
                  name="weight_kg"
                  className="form-control"
                  min="0"
                  step="0.5"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="form-label" htmlFor="duration_min">Duration (min)</label>
                <input
                  type="number"
                  id="duration_min"
                  name="duration_min"
                  className="form-control"
                  min="1"
                  value={formData.duration_min}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="scheduled_date">Scheduled Date</label>
              <input
                type="date"
                id="scheduled_date"
                name="scheduled_date"
                className="form-control"
                value={formData.scheduled_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="notes">Coaching Notes & Execution Instructions</label>
              <textarea
                id="notes"
                name="notes"
                rows="3"
                className="form-control"
                placeholder="e.g. Keep spine neutral, 2-sec pause at peak contraction..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
                style={{ flex: 1, justifyContent: "center" }}
              >
                {submitting ? "Saving to Supabase..." : "Save Workout Prescription"}
              </button>
              <Link to="/clients" className="btn-secondary">
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
