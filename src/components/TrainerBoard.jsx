import React, { useEffect, useRef, useState } from "react";
import ICBase from "./ICBase";

/*
props:
 - icSlots
 - selectedICBaseId
 - onSelect
 - wires
 - onPinClick(pin)
 - selectedPin
 - mode
 - onDeleteWire(wireId)
 - powerOn
 - inputStates
 - outputs
*/

export default function TrainerBoard({
  icSlots,
  selectedICBaseId,
  onSelect,
  wires = [],
  onPinClick,
  selectedPin,
  mode,
  onDeleteWire,
  powerOn,
  inputStates = {},
  outputs = [],
  switchStates = [],      // ✅ ADD THIS
  onToggleSwitch          // ✅ AND THIS
}) {

  const boardRef = useRef(null);
  const [wirePaths, setWirePaths] = useState([]); // array of {id, d, bbox} for rendering & hit testing

  function getPinCenter(pinId) {
    const el = document.getElementById(pinId);
    const board = boardRef.current;
    if (!el || !board) return null;
    const eRect = el.getBoundingClientRect();
    const bRect = board.getBoundingClientRect();
    const x = eRect.left + eRect.width / 2 - bRect.left;
    const y = eRect.top + eRect.height / 2 - bRect.top;
    return { x, y };
  }

  function buildPath(p1, p2) {
    const dx = Math.abs(p2.x - p1.x);
    const controlOffset = Math.max(40, dx * 0.4);
    const c1x = p1.x + controlOffset;
    const c1y = p1.y;
    const c2x = p2.x - controlOffset;
    const c2y = p2.y;
    return `M ${p1.x} ${p1.y} C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }

  useEffect(() => {
    function recompute() {
      const newPaths = wires.map(w => {
        const fromId = genPinId(w.from);
        const toId = genPinId(w.to);
        const p1 = getPinCenter(fromId);
        const p2 = getPinCenter(toId);
        if (!p1 || !p2) return null;
        const d = buildPath(p1, p2);
        return { id: w.id, d, fromId, toId, p1, p2 };
      }).filter(Boolean);
      setWirePaths(newPaths);
    }
    recompute();
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute);
    const obs = new MutationObserver(recompute);
    if (boardRef.current) obs.observe(boardRef.current, { attributes: true, childList: true, subtree: true });
    return () => {
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute);
      obs.disconnect();
    };
  }, [wires, icSlots, selectedPin]);

  function genPinId(pin) {
    return `pin-${pin.kind}-${pin.compId}-${pin.pin}`;
  }

  function onWireClick(wireId, e) {
    e.stopPropagation();
    if (mode === "delete") {
      onDeleteWire && onDeleteWire(wireId);
    }
  }

  return (
    <div className="w-full flex justify-center mt-0">
      <div ref={boardRef} className="bg-[#05304b] w-[90%] rounded-xl px-10 py-8 overflow-visible relative">

        {/* SVG LAYER - wires behind components */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {wirePaths.map(w => (
            <path
              key={w.id}
              d={w.d}
              stroke="#4ee7ff"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 6px 10px rgba(78,231,255,0.06))", pointerEvents: "none" }}
            />
          ))}

          {wirePaths.map(w => (
            <path
              key={w.id + "_hit"}
              d={w.d}
              stroke="transparent"
              strokeWidth={18}
              fill="none"
              style={{
                cursor: mode === "delete" ? "pointer" : "default",
                pointerEvents: mode === "delete" ? "auto" : "none"
              }}
              onClick={(e) => onWireClick(w.id, e)}
            />
          ))}
        </svg>

        {/* POWER TERMINALS */}
        <div className="absolute left-6 top-6 flex flex-col gap-4 z-20">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-red-300 mb-1">VCC</span>
            <div
              id="pin-vcc-vcc-5"
              onClick={(e) => { e.stopPropagation(); onPinClick && onPinClick({ kind: "vcc", compId: "vcc", pin: 5 }); }}
              className="w-4 h-4 rounded-full bg-red-400 cursor-pointer"
            ></div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-300 mb-1">GND</span>
            <div
              id="pin-gnd-gnd-0"
              onClick={(e) => { e.stopPropagation(); onPinClick && onPinClick({ kind: "gnd", compId: "gnd", pin: 0 }); }}
              className="w-4 h-4 rounded-full bg-gray-500 cursor-pointer"
            ></div>
          </div>
        </div>

        {/* === OUTPUT SECTION (top row small dots) === */}
        <div className="flex justify-between mb-10">
          {Array.from({ length: 16 }).map((_, i) => {
            const pin = { kind: "output", compId: "out", pin: i };
            const pinId = `pin-${pin.kind}-${pin.compId}-${pin.pin}`;
            const on = outputs[i] === 1 && powerOn;
            return (
              <div key={i} className="flex flex-col items-center mx-2">
                <div
                  id={pinId}
                  onClick={(e) => { e.stopPropagation(); onPinClick && onPinClick(pin); }}
                  className={`w-4 h-4 rounded-full ${on ? "bg-cyan-300" : "bg-gray-200"} cursor-pointer`}
                ></div>
              </div>
            );
          })}
        </div>

        {/* === IC SLOT SECTION === */}
        <div className="flex justify-between mt-6 mb-10 overflow-visible">
          {icSlots.map(slot => (
            <ICBase
              key={slot.id}
              id={slot.id}
              type={slot.type}
              selected={selectedICBaseId === slot.id}
              onClick={() => onSelect(slot.id)}
              onPinClick={onPinClick}
            />
          ))}
        </div>

        {/* === INPUT SECTION (togglable switches) === */}
<div className="flex justify-between mt-10">
  {Array.from({ length: 16 }).map((_, i) => {
    const pin = { kind: "input", compId: "in", pin: i };
    const pinId = `pin-${pin.kind}-${pin.compId}-${pin.pin}`;
    const isOn = switchStates[i] && powerOn;

    return (
      <div key={i} className="flex flex-col items-center mx-2">
        
        {/* Switch circle */}
        <div
          id={pinId}
          onClick={(e) => {
            e.stopPropagation();
            onToggleSwitch(i);
            onPinClick && onPinClick(pin);
          }}
          className={`
            w-4 h-4 rounded-full cursor-pointer mb-1
            ${isOn ? "bg-yellow-400" : "bg-white"}
          `}
        ></div>

        {/* Switch base */}
        <div className="w-4 h-1 rounded-full bg-gray-400"></div>
      </div>
    );
  })}
</div>


      </div>
    </div>
  );
}
