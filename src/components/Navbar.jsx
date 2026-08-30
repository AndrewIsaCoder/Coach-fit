import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    if (onLogout) onLogout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo-link">
          <span style={{ color: "var(--accent-green)", fontSize: "1.6rem" }}>⚡</span>
          <span>PulseFit</span>
          <span className="logo-badge">COACH MVP</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/" end>Dashboard</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/clients">Clients</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/workouts">Workouts</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/add-workout">Assign Workout</NavLink>
          </li>
        </ul>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-secondary btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <Link to="/login" className="btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
