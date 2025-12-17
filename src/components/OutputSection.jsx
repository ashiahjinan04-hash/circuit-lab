export default function OutputSection() {
  return (
    <div className="bg-[#064a6e] bg-opacity-90 p-4 rounded-lg border border-white/10">
      <h2 className="text-white text-sm mb-2 text-center tracking-wide">OUTPUT SECTION</h2>
      <div className="flex justify-between px-6 text-white/80">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-3 h-3 bg-black rounded-full border border-white/20"></div>
        ))}
      </div>
    </div>
  );
}
