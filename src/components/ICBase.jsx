export default function ICBase({
  id,
  type,
  selected,
  onClick,
  onPinMouseDown,
  onPinMouseUp
}) {
  const leftPins = [1, 2, 3, 4, 5, 6, 7];
  const rightPins = [14, 13, 12, 11, 10, 9, 8];

  const icName =
    { "7404": "NOT", "7408": "AND", "7432": "OR" }[type] || `IC BASE ${id}`;

  const pinId = (num) => `pin-ic-${id}-${num}`;

  return (
    <div className="relative mx-6">

  


      {/* IC BODY (reference element) */}
      <div
  onClick={onClick}
  className={`relative bg-[#0d1a24] border border-white/10 rounded-lg px-4 py-4 shadow-lg w-[140px] overflow-visible cursor-pointer ${
    selected ? "ring-2 ring-cyan-400" : ""
  }`}
>


  <p className="text-xs text-white/80 text-center mb-3">
    {icName}
  </p>

  <div className="flex justify-between">

    {/* LEFT SIDE */}
    <div className="flex flex-col gap-[10px]">
      {leftPins.map(num => (
        <div key={num} className="relative flex items-center">
          
          {/* PIN (outside) */}
          <div
            id={pinId(num)}
            onMouseDown={(e) =>
              onPinMouseDown?.({ kind: "ic", compId: id, pin: num }, e)
            }
            onMouseUp={() =>
              onPinMouseUp?.({ kind: "ic", compId: id, pin: num })
            }
            className="absolute -left-[32px] w-5 h-[3px] bg-gray-300 rounded-sm"

          />

          {/* NUMBER */}
          <span className="text-[11px] text-white/70 ml-2">
            {num}
          </span>
        </div>
      ))}
    </div>

    {/* RIGHT SIDE */}
    <div className="flex flex-col gap-[10px] items-end">
      {rightPins.map(num => (
        <div key={num} className="relative flex items-center justify-end">
          
          {/* NUMBER */}
          <span className="text-[11px] text-white/70 mr-2">
            {num}
          </span>

          {/* PIN (outside) */}
          <div
            id={pinId(num)}
            onMouseDown={(e) =>
              onPinMouseDown?.({ kind: "ic", compId: id, pin: num }, e)
            }
            onMouseUp={() =>
              onPinMouseUp?.({ kind: "ic", compId: id, pin: num })
            }
            className="absolute -right-[32px] w-5 h-[3px] bg-gray-300 rounded-sm"

          />
        </div>
      ))}
    </div>
  </div>
</div>

    </div>
  );
}
