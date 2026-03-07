import React, { useEffect, useRef, useState } from "react";
import { FaPowerOff } from "react-icons/fa";
import ICBase from "./ICBase";

export default function TrainerBoard({
  icSlots,
  selectedICBaseId,
  onSelect,

  wires = [],
  mode,
  onDeleteWire,
  onDeleteIC,

  powerOn,
  setPowerOn,
  switchStates = [],
  setSwitchStates,
  outputs = [],

  onPinMouseDown,
  onPinMouseUp,
  dragWire,
  zoom = 1
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
      x: (e.left + e.width / 2 - b.left) / zoom,
      y: (e.top + e.height / 2 - b.top) / zoom
    };
  }

  function buildOrthogonalPath(p1, p2, pin1, pin2) {
    if (!p1 || !p2) return "";

    const PIN_TOUCH = 4;
    const hash = Math.floor(Math.abs(p1.x * 13 + p2.x * 17 + p1.y * 19 + p2.y * 23));

    function getDirAndExit(pin, p, isFrom) {
      if (!pin) return { dx: 0, dist: 0 };
      if (pin.kind === "ic") {
        return { dx: pin.pin <= 7 ? -1 : 1, dist: 28 }; // Increased significantly to avoid hitting pins vertically
      }
      return { dx: 0, dist: 0 };
    }

    const { dx: dir1, dist: dist1 } = getDirAndExit(pin1, p1, true);
    const { dx: dir2, dist: dist2 } = getDirAndExit(pin2, p2, false);

    // Apply micro shifts BEFORE calculating the exit points so the straight parts 
    // shooting out of the pins are completely perfectly horizontal

    const microShiftX1 = dir1 !== 0 ? ((hash + 5) % 18) - 9 : 0;
    const microShiftX2 = dir2 !== 0 ? ((hash + 11) % 18) - 9 : 0;

    const exitX1 = p1.x + (dir1 * dist1) + microShiftX1;
    const exitX2 = p2.x + (dir2 * dist2) + microShiftX2;
    // Connect right to the tip of the pin based on its direction
    const endX = p2.x;

    const isSameRow = Math.abs(p1.y - p2.y) < 40;

    // Same side or adjacent pins
    if (dir1 === dir2 && dir1 !== 0 && Math.abs(p1.x - p2.x) < 40 && isSameRow) {
      const shiftX = (hash % 16) - 8;
      const sharedExitX = (dir1 === -1 ? Math.min(exitX1, exitX2) - 10 : Math.max(exitX1, exitX2) + 10) + shiftX;
      return `
        M ${p1.x} ${p1.y}
        L ${sharedExitX} ${p1.y}
        L ${sharedExitX} ${p2.y}
        L ${endX} ${p2.y}
      `;
    }

    // Facing direct connection
    if (dir1 !== dir2 && dir1 !== 0 && dir2 !== 0 && isSameRow) {
      if ((dir1 === 1 && p1.x < p2.x && exitX1 <= exitX2) ||
        (dir1 === -1 && p1.x > p2.x && exitX1 >= exitX2)) {
        const shiftX = (hash % 16) - 8;
        const midX = ((exitX1 + exitX2) / 2) + shiftX;
        return `
          M ${p1.x} ${p1.y}
          L ${midX} ${p1.y}
          L ${midX} ${p2.y}
          L ${endX} ${p2.y}
        `;
      }
    }

    // Dynamically calculate Safe Horizontal Lanes from the DOM
    let lanes = [Math.min(p1.y, p2.y) - 60, Math.max(p1.y, p2.y) + 60];
    if (boardRef.current) {
      const boardBg = boardRef.current.getBoundingClientRect();

      const getCenterY = (id1, id2) => {
        const e1 = document.getElementById(id1);
        const e2 = document.getElementById(id2);
        if (e1 && e2) return ((e1.getBoundingClientRect().bottom + e2.getBoundingClientRect().top) / 2 - boardBg.top) / zoom;
        return null;
      };

      const getOffsetY = (id, isTop, offset) => {
        const e = document.getElementById(id);
        if (e) return ((isTop ? e.getBoundingClientRect().top : e.getBoundingClientRect().bottom) - boardBg.top) / zoom + offset;
        return null;
      };

      const possibleLanes = [];
      possibleLanes.push(getOffsetY("row-outputs", true, -30));

      const rowCount = Math.ceil(icSlots.length / 5);

      // Between outputs and first row
      if (rowCount > 0) possibleLanes.push(getCenterY("row-outputs", "row-ics-0"));

      // Between rows
      for (let i = 0; i < rowCount - 1; i++) {
        possibleLanes.push(getCenterY(`row-ics-${i}`, `row-ics-${i + 1}`));
      }

      // Between last row and inputs
      if (rowCount > 0) possibleLanes.push(getCenterY(`row-ics-${rowCount - 1}`, "row-inputs"));

      possibleLanes.push(getOffsetY("row-inputs", false, 30));

      const validLanes = possibleLanes.filter(l => l !== null);
      if (validLanes.length > 0) lanes = validLanes;
    }

    // Pick the safe lane closest to the midpoint Y of the two pins
    const avgY = (p1.y + p2.y) / 2;
    let bestLane = lanes[0];
    let minDiff = Infinity;
    for (const lane of lanes) {
      const diff = Math.abs(lane - avgY);
      if (diff < minDiff) {
        minDiff = diff;
        bestLane = lane;
      }
    }

    // Apply a micro-shift based on the pin coordinates modulo something so that 
    // wires traveling the same lane don't perfectly overlap
    const microShiftY = (hash % 20) - 10;
    const laneY = bestLane + microShiftY;

    // Apply micro-shift to X coordinates too so vertical lines don't overlap perfectly
    return `
      M ${p1.x} ${p1.y}
      L ${exitX1} ${p1.y}
      L ${exitX1} ${laneY}
      L ${exitX2} ${laneY}
      L ${exitX2} ${p2.y}
      L ${endX} ${p2.y}
    `;
  }

  /* ================================
     IC PIN CLASSIFICATION
  ================================= */

  function isICOutput(type, pin) {
    if (["7400", "7408", "7432", "7486"].includes(type)) {
      return [3, 6, 8, 11].includes(pin);
    }

    if (type === "7402") {
      return [1, 4, 10, 13].includes(pin);
    }

    if (type === "7404") {
      return [2, 4, 6, 8, 10, 12].includes(pin);
    }

    return false;
  }

  function getWireColor(wire) {
    const source = wire.from;

    // Switch inputs
    if (source.kind === "input") return "#facc15"; // Yellow

    // Output LEDs
    if (source.kind === "output") return "#22c55e"; // Green

    // Power
    if (source.kind === "vcc") return "#ef4444"; // Red
    if (source.kind === "gnd") return "#9ca3af"; // Gray

    // IC pins
    if (source.kind === "ic") {
      const ic = icSlots.find(s => s.id === source.compId);
      if (!ic) return "#4ee7ff";

      const outputPin = isICOutput(ic.type, source.pin);
      return outputPin ? "#22c55e" : "#facc15";
    }

    return "#4ee7ff"; // fallback
  }

  /* ================================
     BUILD WIRES
  ================================= */

  useEffect(() => {
    const paths = wires.map(w => {
      const p1 = getPinCenter(genPinId(w.from));
      const p2 = getPinCenter(genPinId(w.to));
      if (!p1 || !p2) return null;

      return {
        id: w.id,
        d: buildOrthogonalPath(p1, p2, w.from, w.to),
        wire: w
      };
    }).filter(Boolean);

    setWirePaths(paths);
  }, [wires, icSlots, zoom]);

  return (
    <div className="w-full flex justify-center pb-32">
      <div
        id="trainer-board"
        ref={boardRef}
        className="bg-[#05304b] min-w-[90%] w-max rounded-xl px-10 py-10 flex flex-col relative min-h-max select-none"
      >

        {/* ================= SVG WIRES ================= */}
        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">

          {wirePaths.map(w => (
            <path
              key={w.id}
              d={w.d}
              stroke={getWireColor(w.wire)}
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Delete hit area */}
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

          {/* Drag preview */}
          {dragWire && (
            <path
              d={buildOrthogonalPath(
                getPinCenter(genPinId(dragWire.from)),
                dragWire.to,
                dragWire.from,
                null
              )}
              stroke={getWireColor({ from: dragWire.from })}
              strokeWidth={1.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {/* ================= OUTPUT LEDS AND VCC ================= */}
        <div id="row-outputs" className="flex justify-start mb-10 relative z-20 gap-3 ml-20 items-end">

          <div className="flex bg-[#0a2e4a] rounded-md px-4 py-2 mt-4 ml-6 items-center gap-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-white/20 mr-8">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-white/80 font-bold tracking-wider">VCC</span>
              <div
                id="pin-vcc-board-1"
                onMouseDown={(e) =>
                  onPinMouseDown({ kind: "vcc", compId: "board", pin: 1 }, e)
                }
                onMouseUp={() =>
                  onPinMouseUp({ kind: "vcc", compId: "board", pin: 1 })
                }
                className="w-4 h-4 rounded-full bg-red-500 shadow-md cursor-pointer hover:ring-2 ring-white/50"
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-cyan-400 font-bold tracking-[0.25em] mb-4">OUTPUT SECTION</div>
            <div className="flex gap-3">
              {outputs.map((v, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-[11px] text-white/70 mb-2 font-mono">{15 - i}</div>
                  <div
                    id={`pin-output-out-${i}`}
                    onMouseDown={(e) =>
                      onPinMouseDown({ kind: "output", compId: "out", pin: i }, e)
                    }
                    onMouseUp={() =>
                      onPinMouseUp({ kind: "output", compId: "out", pin: i })
                    }
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 cursor-pointer ${v && powerOn ? "bg-red-500 shadow-[0_0_15px_#ef4444]" : "bg-[#1e3a51] border border-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                      }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= POWER BUTTON ================= */}
        <div className="absolute top-10 right-14 flex flex-col items-center gap-2 z-[9999] pointer-events-auto">
          <span className="text-xs text-white/80 font-bold tracking-wider">POWER</span>
          <button
            onClick={() => setPowerOn(!powerOn)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] border cursor-pointer pointer-events-auto ${powerOn
              ? "bg-[#112536] text-green-400 border-green-500 shadow-[0_0_15px_#22c55e]"
              : "bg-[#0a192f] text-gray-500 border-gray-600 hover:text-white/50"
              }`}
            title="Toggle Power"
          >
            <FaPowerOff />
          </button>
        </div>

        {Array.from({ length: Math.ceil(icSlots.length / 5) }).map((_, rowIndex) => {
          const rowSlots = icSlots.slice(rowIndex * 5, (rowIndex + 1) * 5);
          return (
            <div key={rowIndex} id={`row-ics-${rowIndex}`} className="flex justify-between my-10 relative z-20">
              {rowSlots.map(slot => (
                <ICBase
                  key={slot.id}
                  id={slot.id}
                  type={slot.type}
                  selected={selectedICBaseId === slot.id}
                  mode={mode}
                  onClick={() => onSelect(slot.id)}
                  onDelete={() => onDeleteIC(slot.id)}
                  onPinMouseDown={onPinMouseDown}
                  onPinMouseUp={onPinMouseUp}
                />
              ))}
            </div>
          );
        })}

        {/* ================= INPUT SWITCHES AND GND ================= */}
        <div id="row-inputs" className="flex justify-start mt-auto pt-6 relative z-20 pb-4 gap-3 ml-20 items-start">

          <div className="flex bg-[#0a2e4a] rounded-md px-4 py-2 ml-6 items-center gap-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-white/20 mr-8">
            <div className="flex flex-col items-center gap-2">
              <div
                id="pin-gnd-board-1"
                onMouseDown={(e) =>
                  onPinMouseDown({ kind: "gnd", compId: "board", pin: 1 }, e)
                }
                onMouseUp={() =>
                  onPinMouseUp({ kind: "gnd", compId: "board", pin: 1 })
                }
                className="w-4 h-4 rounded-full bg-gray-400 shadow-md cursor-pointer hover:ring-2 ring-white/50"
              />
              <span className="text-xs text-white/80 font-bold tracking-wider">GND</span>
            </div>
          </div>

          <div className="flex flex-col items-center relative">
            <div className="flex gap-3">
              {switchStates.map((on, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div
                    id={`pin-input-in-${i}`}
                    onMouseDown={(e) =>
                      onPinMouseDown({ kind: "input", compId: "in", pin: i }, e)
                    }
                    onMouseUp={() =>
                      onPinMouseUp({ kind: "input", compId: "in", pin: i })
                    }
                    className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 border mb-1 ${switchStates[i] && powerOn ? "bg-gray-900 border-gray-500 shadow-[0_0_15px_#9ca3af]" : "bg-white border-transparent"
                      }`}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSwitchStates(prev => {
                        const next = [...prev];
                        next[i] = prev[i] ? 0 : 1;
                        return next;
                      });
                    }}
                    className="w-3 h-6 bg-[#1a1c23] rounded-sm cursor-pointer relative shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] border border-gray-500 hover:border-gray-400 transition-colors"
                  >
                    <div
                      className={`w-2.5 h-[10px] rounded-sm shadow-md transition-all duration-200 absolute left-[1px] ${switchStates[i] ? "top-[1px] bg-white border border-gray-300" : "bottom-[1px] bg-gray-400 border border-gray-600"
                        }`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-sm text-cyan-400 font-bold tracking-[0.25em] mt-6">INPUT SECTION</div>
          </div>
        </div>

      </div>
    </div >
  );
}