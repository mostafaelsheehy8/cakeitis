// Placeholder product art: stylised tiramisu layers. Swap for real photos later.
export function TiramisuArt({ accent = "#6b4226", className = "" }: { accent?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-cream ${className}`} aria-hidden>
      <div className="absolute inset-x-6 bottom-6 top-8 flex flex-col overflow-hidden rounded-xl shadow-md">
        <div className="h-[14%]" style={{ background: accent, opacity: 0.9 }} />
        <div className="flex-1 bg-mascarpone" />
        <div className="h-[16%] bg-sponge" style={{ backgroundImage: `linear-gradient(${accent}33, ${accent}55)` }} />
        <div className="flex-1 bg-mascarpone" />
        <div className="h-[16%] bg-sponge" style={{ backgroundImage: `linear-gradient(${accent}33, ${accent}55)` }} />
      </div>
      <div
        className="absolute inset-x-6 top-8 h-3 rounded-t-xl"
        style={{ backgroundImage: `radial-gradient(${accent} 1px, transparent 1.5px)`, backgroundSize: "6px 6px" }}
      />
    </div>
  );
}
