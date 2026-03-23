// components/ServiceBand.tsx
import { Truck, ShieldCheck, Zap, Headphones } from "lucide-react";

const SERVICES = [
  { icon: <Truck size={18} />, title: "Free Delivery", sub: "On orders above ₹999" },
  { icon: <ShieldCheck size={18} />, title: "100% Quality", sub: "Satisfaction guaranteed" },
  { icon: <Zap size={18} />, title: "Express Printing", sub: "Ready in 24 hours" },
  { icon: <Headphones size={18} />, title: "Expert Support", sub: "Mon–Sat, 9am–6pm" },
];

export function ServiceBand() {
  return (
    <div className="bg-white border-t border-b border-[#eee] mb-4">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-4 max-sm:grid-cols-2">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className={`flex items-center gap-3 py-4 px-5 ${i < SERVICES.length - 1 ? "border-r border-[#f0f0f0]" : ""}`}
          >
            <div className="w-[38px] h-[38px] rounded-[9px] bg-[#fff5f5] flex items-center justify-center shrink-0">
              <span className="text-[#c0392b]">{s.icon}</span>
            </div>
            <div>
              <div className="text-[13px] font-bold text-[#111]">{s.title}</div>
              <div className="text-[11.5px] text-[#888] mt-[1px]">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}