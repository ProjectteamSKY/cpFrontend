import { Info } from "lucide-react";

export default function SectionLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">{label}</p>
      {hint && (
        <span className="group relative cursor-help">
          <Info className="w-3 h-3 text-neutral-300 hover:text-neutral-500 transition-colors" />
          <span className="absolute left-5 -top-1 w-52 text-xs bg-neutral-900 text-white px-3 py-2 rounded-xl
            opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 shadow-2xl leading-relaxed font-medium">
            {hint}
          </span>
        </span>
      )}
    </div>
  );
}