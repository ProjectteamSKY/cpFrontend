import { Star } from "lucide-react";

export default function RatingBar({ star, pct, count, active, onClick }: {
  star: number; pct: number; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 w-full group rounded-lg px-2 py-1 transition-all
        ${active ? "bg-amber-50" : "hover:bg-neutral-50"}`}>
      <span className={`text-[11px] font-bold w-4 shrink-0 text-right transition-colors
        ${active ? "text-amber-600" : "text-neutral-400 group-hover:text-neutral-600"}`}>
        {star}
      </span>
      <Star className={`w-3 h-3 shrink-0 transition-colors
        ${active ? "text-amber-400 fill-amber-400" : "text-neutral-300 fill-neutral-200"}`} />
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500
            ${active ? "bg-amber-400" : "bg-neutral-300"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-semibold w-6 shrink-0 text-right transition-colors
        ${active ? "text-amber-600" : "text-neutral-400"}`}>
        {count}
      </span>
    </button>
  );
}