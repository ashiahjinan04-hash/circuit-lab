import React from "react";
import {
  FaHandPaper,
  FaMicrochip,
  FaTrash,
  FaUndo,
  FaRedo,
  FaBolt,
  FaLink
} from "react-icons/fa";

export default function BottomToolbar({
  mode,
  setMode,
  icCatalog,
  onPlaceIC,
  powerOn,
  setPowerOn
}) {
  return (
    <div className="fixed bottom-4 w-full flex justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 
                      px-6 py-3 rounded-2xl flex items-center gap-8 shadow-lg">

        {/* Hand Tool */}
        <button
          className={`text-xl text-white hover:text-cyan-300 ${
            mode === "hand" ? "text-cyan-400" : ""
          }`}
          onClick={() => setMode("hand")}
        >
          <FaHandPaper />
        </button>

        {/* Place Gate Tool */}
        <button
          className={`text-xl text-white hover:text-cyan-300 ${
            mode === "placeGate" ? "text-cyan-400" : ""
          }`}
          onClick={() => setMode("placeGate")}
        >
          <FaMicrochip />
        </button>

        {/* Wire Tool */}
        <button
          className={`text-xl text-white hover:text-cyan-300 ${
            mode === "wire" ? "text-cyan-400" : ""
          }`}
          onClick={() => setMode("wire")}
          title="Wire tool (click first pin then second pin)"
        >
          <FaLink />
        </button>

        {/* Delete Tool */}
        <button
          className={`text-xl text-white hover:text-red-400 ${
            mode === "delete" ? "text-red-400" : ""
          }`}
          onClick={() => setMode("delete")}
        >
          <FaTrash />
        </button>

        {/* Undo */}
        <button className="text-xl text-white hover:text-cyan-300">
          <FaUndo />
        </button>

        {/* Redo */}
        <button className="text-xl text-white hover:text-cyan-300">
          <FaRedo />
        </button>

        {/* Power Toggle Button */}
        <button
          className={`text-xl transition ${
            powerOn ? "text-green-400" : "text-yellow-400"
          } hover:text-green-300`}
          onClick={() => setPowerOn(!powerOn)}
          title="Toggle Power"
        >
          <FaBolt />
        </button>
      </div>

      {/* Gate Selection Popup */}
      {mode === "placeGate" && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 
                        bg-white/10 border border-white/10 backdrop-blur-lg 
                        px-4 py-3 rounded-lg shadow-xl z-[9999]">
          {Object.entries(icCatalog).map(([code, info]) => (
            <button
              key={code}
              onClick={() => onPlaceIC(code)}
              className="block text-white hover:text-cyan-300 whitespace-nowrap py-1"
            >
              {code} — {info.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
