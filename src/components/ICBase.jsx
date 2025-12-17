export default function ICBase({ id, type, selected, onClick, onPinClick }) {
  const leftPins = [1, 2, 3, 4, 5, 6, 7];
  const rightPins = [14, 13, 12, 11, 10, 9, 8];

  const icName = {
    "7404": "NOT",
    "7408": "AND",
    "7432": "OR",
  }[type] || `IC BASE ${id}`;

  function pinId(num) {
    return `pin-ic-${id}-${num}`;
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col items-center mx-6 cursor-pointer
        transition-all overflow-visible
        ${selected ? "ring-2 ring-cyan-400 scale-105" : ""}
      `}
    >

      {/* IC body */}
      <div className="bg-[#0d1a24] border border-white/10 rounded-lg px-6 py-6 shadow-lg overflow-visible relative">
        <p className="text-xs text-white/80 text-center mb-3">{icName}</p>

        <div className="grid grid-cols-[auto_1fr_auto] gap-x-2">
          <div className="flex flex-col justify-between text-white/70 text-[11px] pr-1">
            {leftPins.map(num => <span key={num}>{num}</span>)}
          </div>

          <div></div>

          <div className="flex flex-col justify-between text-white/70 text-[11px] pl-1 text-right">
            {rightPins.map(num => <span key={num}>{num}</span>)}
          </div>
        </div>
      </div>

      {/* Left Pins */}
      <div className="absolute left-0 top-[60px] h-[112px] flex flex-col justify-between translate-x-[-14px]">
        {leftPins.map(num => (
          <div
            key={num}
            id={pinId(num)}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick({ kind: "ic", compId: id, pin: num });
            }}
            className="w-4 h-[3px] bg-gray-300 rounded-sm cursor-pointer relative z-20"
          ></div>
        ))}
      </div>

      {/* Right Pins */}
      <div className="absolute right-0 top-[60px] h-[112px] flex flex-col justify-between translate-x-[14px]">
        {rightPins.map(num => (
          <div
            key={num}
            id={pinId(num)}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick({ kind: "ic", compId: id, pin: num });
            }}
            className="w-4 h-[3px] bg-gray-300 rounded-sm cursor-pointer relative z-20"
          ></div>
        ))}
      </div>
    </div>
  );
}
