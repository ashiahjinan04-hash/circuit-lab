export default function ICBase({
  id,
  type,
  selected,
  mode,
  onClick,
  onDelete,
  onPinMouseDown,
  onPinMouseUp
}) {
  const leftPins = [1, 2, 3, 4, 5, 6, 7];
  const rightPins = [14, 13, 12, 11, 10, 9, 8];

  const icName = type ? type.replace(/^74/, "74LS") : `IC BASE ${id}`;

  const pinId = (num) => `pin-ic-${id}-${num}`;

  return (
    <div className="relative mx-8 my-4 font-sans select-none">
      {/* IC BODY (reference element) */}
      <div
        onClick={(e) => {
          if (mode === "delete" && type) {
            e.stopPropagation();
            onDelete(id);
          } else {
            onClick(e);
          }
        }}
        className={`relative border rounded-sm py-3 shadow-2xl w-[70px] overflow-visible ${mode === "delete" && type ? "cursor-pointer ring-2 ring-red-500" : "cursor-pointer"
          } ${selected && mode !== "delete" ? "ring-2 ring-cyan-400" : ""} ${!type ? "bg-[#3b3b3b] border-gray-600 opacity-90 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]" : "bg-[#444444] border-gray-600"
          }`}
      >
        {/* Notch - matches board background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-2 bg-[#05304b] rounded-b-full border-b border-gray-600/50 z-10"></div>

        {/* Inserted IC Graphic */}
        {type && (
          <div className="absolute top-[1px] bottom-[1px] left-[1px] right-[1px] bg-[#1a1a1a] shadow-lg rounded-sm flex items-center justify-center opacity-100 border border-[#2a2a2a] z-0">
            {/* Inner IC Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-1.5 bg-[#3b3b3b] rounded-b-full"></div>

            <span className="rotate-90 text-white/90 text-[13px] tracking-[0.2em] font-mono whitespace-nowrap opacity-90 pb-1">
              {icName}
            </span>
          </div>
        )}

        {/* Empty Base Text */}
        {!type && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <span className="rotate-90 text-white/60 text-[11px] tracking-[0.25em] font-sans whitespace-nowrap font-bold">
              {icName}
            </span>
          </div>
        )}

        <div className="flex justify-between relative z-10 w-full h-full pointer-events-none px-[1px]">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-between" style={{ height: "140px" }}>
            {leftPins.map(num => (
              <div key={num} className="relative flex items-center justify-center h-[12px] pointer-events-auto">
                {/* NUMBER (outside) */}
                <span className="absolute -left-[28px] text-[10px] text-white/60 font-mono text-right w-[18px]">
                  {num}
                </span>

                {/* PIN */}
                <div
                  id={pinId(num)}
                  onMouseDown={(e) => onPinMouseDown?.({ kind: "ic", compId: id, pin: num }, e)}
                  onMouseUp={() => onPinMouseUp?.({ kind: "ic", compId: id, pin: num })}
                  className="absolute -left-[14px] w-[14px] h-[3px] bg-[#9ca3af] rounded-l-[1px] shadow-sm hover:bg-white transition-colors cursor-crosshair border-y border-[#6b7280]/50"
                />

                {/* Solder Pad / Hole (visual detail on base) */}
                <div className="w-[6px] h-[6px] rounded-full bg-[#1e1e1e] border border-gray-500/30 opacity-60 ml-0.5"></div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col justify-between" style={{ height: "140px" }}>
            {rightPins.map(num => (
              <div key={num} className="relative flex items-center justify-center h-[12px] pointer-events-auto">
                {/* NUMBER (outside) */}
                <span className="absolute -right-[30px] text-[10px] text-white/60 font-mono text-left w-[18px]">
                  {num}
                </span>

                {/* PIN */}
                <div
                  id={pinId(num)}
                  onMouseDown={(e) => onPinMouseDown?.({ kind: "ic", compId: id, pin: num }, e)}
                  onMouseUp={() => onPinMouseUp?.({ kind: "ic", compId: id, pin: num })}
                  className="absolute -right-[14px] w-[14px] h-[3px] bg-[#9ca3af] rounded-r-[1px] shadow-sm hover:bg-white transition-colors cursor-crosshair border-y border-[#6b7280]/50"
                />

                {/* Solder Pad / Hole (visual detail on base) */}
                <div className="w-[6px] h-[6px] rounded-full bg-[#1e1e1e] border border-gray-500/30 opacity-60 mr-0.5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
