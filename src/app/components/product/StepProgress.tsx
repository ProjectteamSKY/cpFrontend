import { Check } from "lucide-react";

export default function StepProgress({ current }: { current: number }) {
  const STEPS = ["Configure", "Upload Design", "Review & Order"];

  return (
    <div className="flex items-center w-full mb-10">
      {STEPS.map((step, i) => (
        <div
          key={step}
          className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}
        >
          {/* Step bubble + label */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Bubble */}
            <div
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
                ${i < current
                  ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/30"
                  : i === current
                  ? "bg-white border-2 border-neutral-900 text-neutral-900 shadow-md shadow-neutral-900/10"
                  : "bg-white border-2 border-neutral-200 text-neutral-300"}`}
            >
              {i < current ? (
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2.5} />
              ) : (
                <span className="font-bold text-[10px] sm:text-xs">{i + 1}</span>
              )}
              {i === current && (
                <span className="absolute inset-0 rounded-full border-2 border-neutral-900 animate-ping opacity-20" />
              )}
            </div>

            {/* Label — hidden on xs, visible from sm */}
            <span
              className={`hidden sm:block text-[10px] lg:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-300
                ${i === current
                  ? "text-neutral-900"
                  : i < current
                  ? "text-neutral-500"
                  : "text-neutral-300"}`}
            >
              {step}
            </span>
          </div>

          {/* Connector line — only between steps */}
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-px mx-2 sm:mx-3 lg:mx-4 overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full bg-neutral-900 transition-all duration-700 ease-out ${
                  i < current ? "w-full" : "w-0"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}