import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotesList from "./pages/NotesList";
import NoteForm from "./pages/NoteForm";
import Navbar from "./components/Navbar";
import './App.css';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Call this after login success
  const handleLogin = () => setIsLoggedIn(true);

  // Call this after logout
  const handleLogout = () => setIsLoggedIn(false);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/notes" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <Signup onLogin={handleLogin} />
            ) : (
              <Navigate to="/notes" />
            )
          }
        />
        <Route
          path="/notes"
          element={
            isLoggedIn ? (
              <NotesList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notes/new"
          element={
            isLoggedIn ? (
              <NoteForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/notes/edit/:id"
          element={
            isLoggedIn ? (
              <NoteForm />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={isLoggedIn ? "/notes" : "/signup"} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
