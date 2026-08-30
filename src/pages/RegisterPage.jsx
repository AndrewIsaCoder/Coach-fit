import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function RegisterPage({ onLogin }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) {
        if (email && password) {
          const demoUser = { email, user_metadata: { full_name: fullName }, id: "demo-" + Date.now() };
          if (onLogin) onLogin(demoUser);
          navigate("/");
          return;
        }
        throw error;
      }

      if (onLogin) onLogin(data.user);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.message || "Failed to create coach account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "440px", paddingTop: "40px" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span style={{ fontSize: "2.5rem" }}>⚡</span>
          <h1 style={{ fontSize: "1.8rem", marginTop: "8px" }}>Coach Onboarding</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Create your coach account to start tracking athletes
          </p>
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              className="form-control"
              placeholder="Coach Andrei"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="andrei@pulsefit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password (min 6 characters)</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}
          >
            {loading ? "Creating Account..." : "Complete Coach Registration"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-green)", fontWeight: "600", textDecoration: "none" }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
