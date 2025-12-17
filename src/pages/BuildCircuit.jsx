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

  // Wiring state
  const [wires, setWires] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);

  // 16 INPUT SWITCHES
  const [switchStates, setSwitchStates] = useState(Array(16).fill(0));

  // 16 OUTPUT LEDs
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
     IC Base Selection
     =============================== */
  function handleSelectICBase(id) {
    if (mode !== "placeGate") return;
    setSelectedICBaseId(id);
  }

  function handlePlaceIC(icCode) {
    if (!selectedICBaseId) return;
    setIcSlots(prev =>
      prev.map(slot =>
        slot.id === selectedICBaseId ? { ...slot, type: icCode } : slot
      )
    );
    setMode("select");
  }

  /* ===============================
     Wiring Logic
     =============================== */
  function handlePinClick(pin) {
    // normal mode → toggle switch if input
    if (pin.kind === "input" && mode !== "wire") {
      toggleSwitch(pin.pin);
      return;
    }

    // not wire mode → ignore other pin clicks
    if (mode !== "wire") return;

    // first pin
    if (!selectedPin) {
      setSelectedPin(pin);
      return;
    }

    // same pin → cancel
    const same =
      selectedPin.kind === pin.kind &&
      selectedPin.compId === pin.compId &&
      selectedPin.pin === pin.pin;
    if (same) {
      setSelectedPin(null);
      return;
    }

    // prevent duplicate wires
    const exists = wires.some(
      w =>
        (w.from.kind === selectedPin.kind &&
          w.from.compId === selectedPin.compId &&
          w.from.pin === selectedPin.pin &&
          w.to.kind === pin.kind &&
          w.to.compId === pin.compId &&
          w.to.pin === pin.pin) ||
        (w.to.kind === selectedPin.kind &&
          w.to.compId === selectedPin.compId &&
          w.to.pin === selectedPin.pin &&
          w.from.kind === pin.kind &&
          w.from.compId === pin.compId &&
          w.from.pin === pin.pin)
    );
    if (exists) {
      setSelectedPin(null);
      return;
    }

    // add wire
    const newWire = { id: cryptoId(), from: selectedPin, to: pin };
    setWires(prev => [...prev, newWire]);
    setSelectedPin(null);
  }

  function handleDeleteWire(wireId) {
    setWires(prev => prev.filter(w => w.id !== wireId));
  }

  function cryptoId() {
    if (crypto?.randomUUID) return crypto.randomUUID();
    return "w_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
  }

  /* ===============================
     Switch Logic
     =============================== */

  function toggleSwitch(index) {
    if (!powerOn) return; // cannot toggle when OFF
    setSwitchStates(prev => {
      const newArr = [...prev];
      newArr[index] = newArr[index] ? 0 : 1;
      return newArr;
    });
  }

  /* ===============================
     Logic Engine Execution
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
  onSelect={handleSelectICBase}

  wires={wires}
  onPinClick={handlePinClick}
  selectedPin={selectedPin}
  mode={mode}
  onDeleteWire={handleDeleteWire}

  powerOn={powerOn}
  switchStates={switchStates}
  outputs={outputs}
  onToggleSwitch={toggleSwitch}
/>

      <BottomToolbar
        mode={mode}
        setMode={setMode}
        icCatalog={icCatalog}
        onPlaceIC={handlePlaceIC}
        powerOn={powerOn}
        setPowerOn={setPowerOn}
      />
    </div>
  );
}
