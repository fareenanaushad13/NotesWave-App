import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";


function Navbar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
  <div className="navbar-content">
    <h3>Notes App</h3>
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  </div>
</nav>

  );
}

export default Navbar;
