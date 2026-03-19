

export default function OptionPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none overflow-hidden group
        ${active
          ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 scale-[1.02]"
          : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:scale-[1.01]"}`}>
      {active && (
        <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      {children}
    </button>
  );
}