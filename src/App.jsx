import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import BuildCircuit from "./pages/BuildCircuit";
import AuthModals from "./components/AuthModals";
import Profile from "./pages/Profile";
import ProjectsDashboard from "./pages/ProjectsDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-[#031327] text-white">
      <AuthModals />

      {/* Navbar should show only on Home, not on Builder */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<ProjectsDashboard />} />

        {/* Circuit Builder Page (no navbar, no footer) */}
        <Route
          path="/build"
          element={<BuildCircuit />}
        />
      </Routes>

    </div>
  );
}
