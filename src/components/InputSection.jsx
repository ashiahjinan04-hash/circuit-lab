export default function InputSection() {
  return (
    <div className="bg-[#064a6e] bg-opacity-90 p-4 rounded-lg border border-white/10 mt-6">
      <h2 className="text-white text-sm mb-2 text-center tracking-wide">INPUT SECTION</h2>
      <div className="flex justify-between px-6">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-3 h-3 bg-black rounded-full border border-white/20"></div>
            <div className="w-4 h-2 rounded-full bg-white/80"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
