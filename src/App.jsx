import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import BuildCircuit from "./pages/BuildCircuit";

export default function App() {
  return (
    <div className="min-h-screen bg-[#031327] text-white">
      
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

        {/* Circuit Builder Page (no navbar, no footer) */}
        <Route 
          path="/build" 
          element={<BuildCircuit />} 
        />
      </Routes>

    </div>
  );
}
