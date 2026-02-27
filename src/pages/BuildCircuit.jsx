// src/pages/BuildCircuit.jsx
import React, { useEffect, useState } from "react";
import TrainerBoard from "../components/TrainerBoard";
import Logo from "../components/Logo";
import BottomToolbar from "../components/BottomToolbar";
import { computeLogic } from "../logic/logicEngine";

export default function BuildCircuit() {
  const [selectedICBaseId, setSelectedICBaseId] = useState(null);
  const [mode, setMode] = useState("select");
  const [powerOn, setPowerOn] = useState(false);

  // wiring
  const [wires, setWires] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [dragWire, setDragWire] = useState(null);

  // switches & outputs
  const [switchStates, setSwitchStates] = useState(Array(16).fill(0));
  const [outputs, setOutputs] = useState(Array(16).fill(0));

  // IC slots
  const [icSlots, setIcSlots] = useState([
    { id: 1, type: null },
    { id: 2, type: null },
    { id: 3, type: null },
    { id: 4, type: null },
    { id: 5, type: null }
  ]);

  const icCatalog = {
    "7404": { name: "NOT Gate" },
    "7408": { name: "AND Gate" },
    "7432": { name: "OR Gate" }
  };

  /* ===============================
     Helpers
     =============================== */

  function getMousePos(e) {
  const board = document.querySelector("#trainer-board");
  if (!board) return { x: e.clientX, y: e.clientY };

  const rect = board.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
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

  return (
    <div className="min-h-screen bg-[#031327] text-white relative pt-20">
      <Logo />

      <TrainerBoard
        icSlots={icSlots}
        selectedICBaseId={selectedICBaseId}
        onSelect={(id) => {
          setSelectedICBaseId(id); // ✅ always allow selection
        }}

        wires={wires}
        mode={mode}
        onDeleteWire={(id) =>
          setWires(w => w.filter(x => x.id !== id))
        }

        powerOn={powerOn}
        switchStates={switchStates}
        setSwitchStates={setSwitchStates}
        outputs={outputs}

        onPinMouseDown={onPinMouseDown}
        onPinMouseUp={onPinMouseUp}
        dragWire={dragWire}
      />
      <BottomToolbar 
        mode={mode} 
        setMode={setMode} 
        icCatalog={icCatalog} 
        onPlaceIC={(code) => {
    if (!selectedICBaseId) return; // 🚫 no base selected

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
      />
    </div>
  );
}
