import React, { useEffect, useRef, useState } from "react";
import ICBase from "./ICBase";

export default function TrainerBoard({
  icSlots,
  selectedICBaseId,
  onSelect,

  wires = [],
  mode,
  onDeleteWire,

  powerOn,
  switchStates = [],
  setSwitchStates,
  outputs = [],

  // 🔹 NEW drag wiring props
  onPinMouseDown,
  onPinMouseUp,
  dragWire
}) {
  const boardRef = useRef(null);
  const [wirePaths, setWirePaths] = useState([]);

  function genPinId(pin) {
    return `pin-${pin.kind}-${pin.compId}-${pin.pin}`;
  }

  function getPinCenter(pinId) {
    const el = document.getElementById(pinId);
    const board = boardRef.current;
    if (!el || !board) return null;

    const e = el.getBoundingClientRect();
    const b = board.getBoundingClientRect();

    return {
      x: e.left + e.width / 2 - b.left,
      y: e.top + e.height / 2 - b.top
    };
  }

  function buildOrthogonalPath(p1, p2) {
  if (!p1 || !p2) return "";

  const PIN_EXIT = 10;   // how far wire exits from pin
  const PIN_TOUCH = 4;  // small inset to avoid stub
  const LANE_GAP = 12;  // spacing between wires

  const goUp = p2.y < p1.y;

  const laneY = goUp
    ? Math.min(p1.y, p2.y) - LANE_GAP
    : Math.max(p1.y, p2.y) + LANE_GAP;

  const exitX1 = p1.x < p2.x ? p1.x + PIN_EXIT : p1.x - PIN_EXIT;
  const exitX2 = p2.x < p1.x ? p2.x + PIN_EXIT : p2.x - PIN_EXIT;

  const endX =
    p2.x > p1.x ? p2.x - PIN_TOUCH : p2.x + PIN_TOUCH;

  return `
    M ${p1.x} ${p1.y}
    L ${exitX1} ${p1.y}
    L ${exitX1} ${laneY}
    L ${exitX2} ${laneY}
    L ${exitX2} ${p2.y}
    L ${endX} ${p2.y}
  `;
}



  useEffect(() => {
    const paths = wires.map(w => {
      const p1 = getPinCenter(genPinId(w.from));
      const p2 = getPinCenter(genPinId(w.to));
      if (!p1 || !p2) return null;
      return { id: w.id, d: buildOrthogonalPath(p1, p2) };
    }).filter(Boolean);

    setWirePaths(paths);
  }, [wires, icSlots]);

  return (
    <div className="w-full flex justify-center">
      <div
  id="trainer-board"
  ref={boardRef}
  className="bg-[#05304b] w-[90%] rounded-xl px-10 py-8 relative overflow-visible"
>


        {/* SVG WIRES */}
        <svg
  className="absolute inset-0 w-full h-full z-10 pointer-events-none"
>

          {wirePaths.map(w => (
            <path
              key={w.id}
              d={w.d}
              stroke="#4ee7ff"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* DELETE HIT AREA */}
          {wirePaths.map(w => (
            <path
  key={w.id + "_hit"}
  d={w.d}
  stroke="transparent"
  strokeWidth={18}
  fill="none"
  pointerEvents="stroke"
  style={{ cursor: mode === "delete" ? "pointer" : "default" }}
  onClick={(e) => {
    e.stopPropagation();
    if (mode === "delete") onDeleteWire(w.id);
  }}
/>

          ))}

          {/* DRAG PREVIEW */}
          {/* DRAG PREVIEW */}
{dragWire && (
  <path
    d={buildOrthogonalPath(
      getPinCenter(genPinId(dragWire.from)),
      dragWire.to
    )}
    stroke="#4ee7ff"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
)}

        </svg>
{/* VCC & GND */}
<div className="absolute top-2 left-2 flex flex-col gap-8 z-20">

  {/* VCC */}
  <div className="flex items-center gap-2">
    <div
      id="pin-vcc-board-1"
      onMouseDown={(e) =>
        onPinMouseDown({ kind: "vcc", compId: "board", pin: 1 }, e)
      }
      onMouseUp={() =>
        onPinMouseUp({ kind: "vcc", compId: "board", pin: 1 })
      }
      className="w-4 h-4 rounded-full bg-red-500 shadow-md cursor-pointer"
    />
    <span className="text-xs text-red-300 font-semibold">VCC</span>
  </div>

  {/* GND */}
  <div className="flex items-center gap-2">
    <div
      id="pin-gnd-board-1"
      onMouseDown={(e) =>
        onPinMouseDown({ kind: "gnd", compId: "board", pin: 1 }, e)
      }
      onMouseUp={() =>
        onPinMouseUp({ kind: "gnd", compId: "board", pin: 1 })
      }
      className="w-4 h-4 rounded-full bg-gray-400 shadow-md cursor-pointer"
    />
    <span className="text-xs text-gray-300 font-semibold">GND</span>
  </div>

</div>

        {/* OUTPUT LEDS */}
        <div className="flex justify-between mb-10">
          {outputs.map((v, i) => (
            <div key={i} className="flex flex-col items-center mx-2">
              <div
                id={`pin-output-out-${i}`}
                onMouseDown={(e) =>
                  onPinMouseDown({ kind: "output", compId: "out", pin: i }, e)
                }
                onMouseUp={() =>
                  onPinMouseUp({ kind: "output", compId: "out", pin: i })
                }
                className={`w-4 h-4 rounded-full ${
                  v && powerOn ? "bg-cyan-300" : "bg-gray-200"
                }`}
              />
            </div>
          ))}
        </div>

        {/* IC SLOTS */}
        <div className="flex justify-between my-10">
          {icSlots.map(slot => (
            <ICBase
              key={slot.id}
              id={slot.id}
              type={slot.type}
              selected={selectedICBaseId === slot.id}
              onClick={() => onSelect(slot.id)}
              onPinMouseDown={onPinMouseDown}
              onPinMouseUp={onPinMouseUp}
            />
          ))}
        </div>

        {/* INPUT SWITCHES */}
        <div className="flex justify-between">
          {switchStates.map((on, i) => (
            <div key={i} className="flex flex-col items-center mx-2">
              <div
  id={`pin-input-in-${i}`}
  onClick={(e) => {
    e.stopPropagation(); // important: don’t start wiring
    setSwitchStates(prev => {
      const next = [...prev];
      next[i] = prev[i] ? 0 : 1;
      return next;
    });
  }}
  onMouseDown={(e) =>
    onPinMouseDown({ kind: "input", compId: "in", pin: i }, e)
  }
  onMouseUp={() =>
    onPinMouseUp({ kind: "input", compId: "in", pin: i })
  }
  className={`w-4 h-4 rounded-full cursor-pointer ${
    switchStates[i] && powerOn ? "bg-yellow-400" : "bg-white"
  }`}
/>
              <div className="w-4 h-1 bg-gray-400 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
