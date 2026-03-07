import React, { useEffect, useState } from "react";
import TrainerBoard from "../components/TrainerBoard";
import BottomToolbar from "../components/BottomToolbar";
import { computeLogic } from "../logic/logicEngine";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "../components/ProfileDropdown";
import SaveProjectModal from "../components/SaveProjectModal";
import RequiresLoginModal from "../components/RequiresLoginModal";
import { projectService } from "../services/projectService";

export default function BuildCircuit() {
  const { user, openLogin, openSignup, token } = useAuth();
  const location = useLocation();
  const initialData = location.state?.projectData;

  const [selectedICBaseId, setSelectedICBaseId] = useState(null);
  const [mode, setMode] = useState("select");
  const [powerOn, setPowerOn] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  // Modal & Project State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(initialData?.id || null);
  const [currentProjectName, setCurrentProjectName] = useState(initialData?.project_name || "");

  // wiring
  const [wires, setWires] = useState(initialData?.circuit_data?.wires || []);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dragWire, setDragWire] = useState(null);

  // switches & outputs
  const [switchStates, setSwitchStates] = useState(initialData?.circuit_data?.switchStates || Array(16).fill(0));
  const [outputs, setOutputs] = useState(Array(16).fill(0));

  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // IC slots
  const [icSlots, setIcSlots] = useState(initialData?.circuit_data?.icSlots || [
    { id: 1, type: null },
    { id: 2, type: null },
    { id: 3, type: null },
    { id: 4, type: null },
    { id: 5, type: null }
  ]);

  const icCatalog = {
    "7400": { name: "NAND Gate" },
    "7402": { name: "NOR Gate" },
    "7404": { name: "NOT Gate" },
    "7408": { name: "AND Gate" },
    "7432": { name: "OR Gate" },
    "7486": { name: "XOR Gate" }
  };

  /* ===============================
     Save Logic
     =============================== */
  function onSaveClick() {
    if (!user) {
      setIsLoginPromptOpen(true);
    } else {
      setIsSaveModalOpen(true);
    }
  }

  async function handleConfirmSave(projectName) {
    setIsSaving(true);
    try {
      const circuitData = { wires, icSlots, switchStates };

      if (currentProjectId) {
        // Update existing
        await projectService.updateProject(token, currentProjectId, {
          circuit_data: circuitData,
          circuit_version: 1
        });
        setCurrentProjectName(projectName);
      } else {
        // Create new
        const newProject = await projectService.createProject(token, {
          project_name: projectName,
          circuit_data: circuitData,
          circuit_version: 1
        });
        setCurrentProjectId(newProject.id);
        setCurrentProjectName(newProject.project_name);
      }
      setIsSaveModalOpen(false);
    } catch (error) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  }

  /* ===============================
     History (Undo/Redo)
     =============================== */

  function pushHistory() {
    setHistory(prev => [...prev, { wires, icSlots }]);
    setRedoStack([]);
  }

  function handleUndo() {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];

    setRedoStack(prev => [...prev, { wires, icSlots }]);
    setHistory(prev => prev.slice(0, -1));
    setWires(previousState.wires);
    setIcSlots(previousState.icSlots);
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];

    setHistory(prev => [...prev, { wires, icSlots }]);
    setRedoStack(prev => prev.slice(0, -1));
    setWires(nextState.wires);
    setIcSlots(nextState.icSlots);
  }

  /* ===============================
     Helpers
     =============================== */

  function getMousePos(e) {
    const board = document.querySelector("#trainer-board");
    if (!board) return { x: e.clientX, y: e.clientY };

    const rect = board.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom
    };
  }


  function samePin(a, b) {
    return a.kind === b.kind && a.compId === b.compId && a.pin === b.pin;
  }

  function cancelDrag() {
    setSelectedPin(null);
    setDragWire(null);
  }

  function cryptoSafeId() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return "w_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
  }

  /* ===============================
     Drag Wiring Logic
     =============================== */

  function onPinMouseDown(pin, e) {
    e.stopPropagation();

    setMode("wire"); // ensure wiring mode
    setSelectedPin(pin);
    setDragWire({ from: pin, to: getMousePos(e) });
  }



  function onPinMouseUp(pin) {
    if (mode !== "wire" || !selectedPin) return;

    if (samePin(selectedPin, pin)) {
      cancelDrag();
      return;
    }
    // ❌ Prevent output → output
    if (
      selectedPin.kind === "output" &&
      pin.kind === "output"
    ) {
      cancelDrag();
      return;
    }

    // ❌ Prevent vcc ↔ gnd
    if (
      (selectedPin.kind === "vcc" && pin.kind === "gnd") ||
      (selectedPin.kind === "gnd" && pin.kind === "vcc")
    ) {
      cancelDrag();
      return;
    }

    const exists = wires.some(w =>
      (samePin(w.from, selectedPin) && samePin(w.to, pin)) ||
      (samePin(w.from, pin) && samePin(w.to, selectedPin))
    );

    if (!exists) {
      pushHistory();
      setWires(prev => [
        ...prev,
        { id: cryptoSafeId(), from: selectedPin, to: pin }
      ]);
    }

    cancelDrag();
  }

  useEffect(() => {
    function onMove(e) {
      if (!dragWire) return;
      setDragWire(prev => ({ ...prev, to: getMousePos(e) }));
    }

    function onUp() {
      if (dragWire) cancelDrag();
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragWire]);

  /* ===============================
     Logic Engine
     =============================== */

  useEffect(() => {
    const { outputs: newOutputs } = computeLogic(
      wires,
      icSlots,
      switchStates,
      powerOn
    );
    setOutputs(newOutputs);
  }, [wires, icSlots, switchStates, powerOn]);

  /* ===============================
     Render
     =============================== */

  function handleAddRow() {
    pushHistory();
    setIcSlots(prev => {
      const startId = prev.length + 1;
      return [
        ...prev,
        { id: startId, type: null },
        { id: startId + 1, type: null },
        { id: startId + 2, type: null },
        { id: startId + 3, type: null },
        { id: startId + 4, type: null }
      ];
    });
  }

  return (
    <div className="min-h-screen bg-[#031327] text-white relative pt-16 overflow-hidden flex flex-col items-center">

      {/* Top Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-2 flex items-center justify-between transition-all duration-300 ${scrolled ? "bg-[#0a1a2f]/80 backdrop-blur-md shadow-lg shadow-cyan-500/10" : "bg-transparent"}`}>
        <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Circuit Lab Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-lg" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-cyan-200 leading-tight">Circuit Lab</span>
            {currentProjectName && <span className="text-xs text-slate-400 leading-tight truncate max-w-[150px]">{currentProjectName}</span>}
          </div>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              <button onClick={openLogin} className="text-slate-200 hover:text-white hover:underline text-sm font-medium transition-colors">Login</button>
              <button onClick={openSignup} className="py-2 px-4 rounded-md btn-neon text-white text-sm font-medium whitespace-nowrap">Sign Up</button>
            </>
          )}
        </div>
      </header>

      <div
        className="flex-1 w-full overflow-auto flex justify-center p-10"
        style={{ maxHeight: 'calc(100vh - 160px)' }}
        onScroll={(e) => setScrolled(e.target.scrollTop > 10)}
      >
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <TrainerBoard
            icSlots={icSlots}
            selectedICBaseId={selectedICBaseId}
            onSelect={(id) => {
              setSelectedICBaseId(id); // ✅ always allow selection
            }}

            wires={wires}
            mode={mode}
            zoom={zoom}
            onDeleteWire={(id) => {
              pushHistory();
              setWires(w => w.filter(x => x.id !== id));
            }}
            onDeleteIC={(id) => {
              pushHistory();
              // 1. Clear the IC type
              setIcSlots(prev => prev.map(slot => slot.id === id ? { ...slot, type: null } : slot));

              // 2. Remove any wires connected to this IC
              setWires(prev => prev.filter(w => {
                const isConnectedToIC = (w.from.kind === 'ic' && w.from.compId === id) ||
                  (w.to.kind === 'ic' && w.to.compId === id);
                return !isConnectedToIC;
              }));

              if (selectedICBaseId === id) setSelectedICBaseId(null);
            }}

            powerOn={powerOn}
            setPowerOn={setPowerOn}
            switchStates={switchStates}
            setSwitchStates={setSwitchStates}
            outputs={outputs}

            onPinMouseDown={onPinMouseDown}
            onPinMouseUp={onPinMouseUp}
            dragWire={dragWire}
          />
        </div>
      </div>
      <BottomToolbar
        mode={mode}
        setMode={setMode}
        icCatalog={icCatalog}
        onPlaceIC={(code) => {
          if (!selectedICBaseId) return; // 🚫 no base selected

          pushHistory();
          setIcSlots(prev =>
            prev.map(slot =>
              slot.id === selectedICBaseId
                ? { ...slot, type: code }
                : slot
            )
          );

          setSelectedICBaseId(null); // ✅ clear highlight
          setMode("select");        // ✅ exit placement mode
        }}
        powerOn={powerOn}
        setPowerOn={setPowerOn}
        zoom={zoom}
        setZoom={setZoom}
        onAddRow={handleAddRow}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onSave={onSaveClick}
      />

      <SaveProjectModal
        isOpen={isSaveModalOpen}
        onClose={() => !isSaving && setIsSaveModalOpen(false)}
        onSave={handleConfirmSave}
        isLoading={isSaving}
        defaultName={currentProjectName}
      />

      <RequiresLoginModal
        isOpen={isLoginPromptOpen}
        onClose={() => setIsLoginPromptOpen(false)}
      />
    </div>
  );
}
