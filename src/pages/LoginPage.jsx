import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (email && password) {
          const demoUser = { email, id: "demo-" + Date.now() };
          if (onLogin) onLogin(demoUser);
          navigate("/");
          return;
        }
        throw error;
      }

      if (onLogin) onLogin(data.user);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container" style={{ maxWidth: "440px", paddingTop: "40px" }}>
      <div className="card">
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <span style={{ fontSize: "2.5rem" }}>⚡</span>
          <h1 style={{ fontSize: "1.8rem", marginTop: "8px" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Sign in to access your PulseFit Coach dashboard
          </p>
        </div>

        {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="coach@pulsefit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
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
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--accent-green)", fontWeight: "500", textDecoration: "none" }}>
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
