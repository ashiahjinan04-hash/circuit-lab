import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrochip,
  FaTrash,
  FaUndo,
  FaRedo,
  FaPlus,
  FaSearchPlus,
  FaSearchMinus,
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaSave
} from "react-icons/fa";
export default function BottomToolbar({
  mode,
  setMode,
  icCatalog,
  onPlaceIC,
  powerOn,
  setPowerOn,
  zoom,
  setZoom,
  onAddRow,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave
}) {
  const catalogRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIC, setSelectedIC] = useState(null);

  // Close catalog when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        mode === "placeGate" &&
        catalogRef.current &&
        !catalogRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        handleCloseCatalog();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mode, setMode]);

  // Focus search bar when opened
  useEffect(() => {
    if (mode === "placeGate" && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mode]);

  function handleCloseCatalog() {
    setMode("hand"); // Revert to default mode
    setSearchTerm("");
    setSelectedIC(null);
  }

  function handleAddSelectedIC() {
    if (selectedIC) {
      onPlaceIC(selectedIC);
      handleCloseCatalog();
    }
  }

  const filteredCatalog = Object.entries(icCatalog).filter(([code, info]) => {
    const searchString = `${code.replace(/^74/, "74LS")} ${info.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed bottom-4 w-full flex justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 
                      px-6 py-3 rounded-2xl flex items-center gap-8 shadow-lg">

        {/* Place Gate Tool */}
        <button
          ref={buttonRef}
          className={`text-xl text-white hover:text-cyan-300 ${mode === "placeGate" ? "text-cyan-400" : ""
            }`}
          onClick={() => setMode(mode === "placeGate" ? "hand" : "placeGate")}
          title="ic catalog"
        >
          <FaMicrochip />
        </button>

        {/* Delete Tool */}
        <button
          className={`text-xl text-white hover:text-red-400 ${mode === "delete" ? "text-red-400" : ""
            }`}
          onClick={() => setMode("delete")}
          title="delete ic/wire"
        >
          <FaTrash />
        </button>

        {/* Undo */}
        <button
          className="text-xl text-white hover:text-cyan-300 disabled:opacity-50 disabled:hover:text-white"
          title="undo"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <FaUndo />
        </button>

        {/* Redo */}
        <button
          className="text-xl text-white hover:text-cyan-300 disabled:opacity-50 disabled:hover:text-white"
          title="redo"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <FaRedo />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        {/* Zoom Controls */}
        <button
          className="text-xl text-white hover:text-cyan-300 disabled:opacity-50"
          onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
          title="zoom out"
        >
          <FaSearchMinus />
        </button>
        <span className="text-sm text-white min-w-[3rem] text-center font-mono">
          {Math.round(zoom * 100)}%
        </span>
        <button
          className="text-xl text-white hover:text-cyan-300 disabled:opacity-50"
          onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
          title="zoom in"
        >
          <FaSearchPlus />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        {/* Add Row Feature */}
        <button
          className="text-xl text-white hover:text-green-400"
          onClick={onAddRow}
          title="add ic row"
        >
          <FaPlus />
        </button>

        <div className="w-px h-6 bg-white/20 mx-2" />

        {/* Save Feature */}
        <button
          className="text-xl text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
          onClick={onSave}
          title="save project"
        >
          <FaSave />
        </button>
      </div>

      {/* Improved Gate Selection Modal */}
      {mode === "placeGate" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center pointer-events-auto">
          <div
            ref={catalogRef}
            className="bg-[#041226] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] w-[800px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="bg-[#071a2b] px-6 py-4 border-b border-white/10 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0ea5e9]/20 rounded-full flex items-center justify-center text-[#0ea5e9] shadow-[inset_0_0_10px_rgba(14,165,233,0.3)]">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white tracking-wide">Select IC Component</h2>
                  <p className="text-sm text-cyan-200/60">Choose an integrated circuit for your project</p>
                </div>
              </div>
              <button
                onClick={handleCloseCatalog}
                className="text-white/40 hover:text-red-400 transition-colors p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6 flex-1 overflow-y-auto bg-[#041226] hero-bg-modal">

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto mb-8">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-cyan-400/50" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search IC components..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#071a2b] border border-cyan-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 text-sm text-white placeholder-cyan-200/40 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Available Components Section */}
              <div className="flex justify-between items-end mb-5 pr-1 border-b border-white/5 pb-2">
                <h3 className="text-xs font-bold text-cyan-400/70 tracking-[0.2em] uppercase">AVAILABLE COMPONENTS</h3>
              </div>

              {/* Components Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {filteredCatalog.map(([code, info]) => {
                  const displayCode = code.replace(/^74/, "74LS");
                  const isSelected = selectedIC === code;
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedIC(code)}
                      onDoubleClick={() => {
                        setSelectedIC(code);
                        onPlaceIC(code);
                        handleCloseCatalog();
                      }}
                      className={`flex items-center gap-4 p-3 rounded-lg border text-left transition-all ${isSelected
                        ? "bg-[#0a2e4a] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        : "bg-[#071a2b] border-white/10 hover:border-cyan-400/50 hover:bg-[#0a2036]"
                        }`}
                    >
                      {/* IC Icon SVG */}
                      <div className="w-6 h-10 bg-[#1a1a1a] rounded-sm relative shadow-sm border border-[#2a2a2a] overflow-hidden flex-shrink-0">
                        {/* Pins left */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col justify-evenly">
                          {[...Array(7)].map((_, i) => <div key={i} className="w-1 h-[2px] bg-[#9ca3af] -ml-[2px]" />)}
                        </div>
                        {/* Pins right */}
                        <div className="absolute right-0 top-0 bottom-0 w-1 flex flex-col justify-evenly">
                          {[...Array(7)].map((_, i) => <div key={i} className="w-1 h-[2px] bg-[#9ca3af] -mr-[2px]" />)}
                        </div>
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-1 bg-[#3b3b3b] rounded-b-full opacity-80"></div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[14px] font-bold text-white tracking-wide font-mono">{displayCode}</span>
                        <span className="text-[11px] text-cyan-200/60 truncate" title={info.name}>
                          {info.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {filteredCatalog.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-cyan-200/40 text-sm font-light">
                    No components match your search.
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-[#071a2b] px-6 py-4 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={handleCloseCatalog}
                className="px-5 py-2 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSelectedIC}
                disabled={!selectedIC}
                className="px-6 py-2 rounded-md text-sm font-bold text-[#041226] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:shadow-none"
              >
                Add IC
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
