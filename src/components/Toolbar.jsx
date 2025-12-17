import React from "react";

export default function Toolbar({ mode, setMode, icCatalog, onPlaceIC }) {
  return (
    <div className="flex justify-center mt-6 relative">

      <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-xl border border-white/20 flex gap-6 shadow-lg">


        {/* Place Gate Button */}
        <button
          onClick={() => setMode("placeGate")}
          className={`text-white ${mode === "placeGate" ? "text-cyan-400" : ""}`}
        >
          Place Gate
        </button>

      </div>

      {/* Gate Selection Menu */}
      {mode === "placeGate" && (
  <div className="absolute bottom-20 bg-white/10 border border-white/10 px-4 py-3 rounded-lg backdrop-blur-lg z-50">
    {Object.entries(icCatalog).map(([code, info]) => (
      <button
        key={code}
        onClick={() => onPlaceIC(code)}
        className="block text-white hover:text-cyan-300 text-left whitespace-nowrap py-1"
      >
        {code} — {info.name}
      </button>
    ))}
  </div>
)}

    </div>
  );
}
