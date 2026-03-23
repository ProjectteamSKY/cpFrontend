// components/Testimonials.tsx
import { BadgeCheck } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const REVIEWS = [
  {
    stars: 5,
    text: "Ordered 500 business cards for our team. Print quality is outstanding, delivered in 2 days. Will definitely reorder!",
    name: "Ramesh K.",
    role: "Operations Manager, Dindigul",
  },
  {
    stars: 5,
    text: "Used them for our event banners. Colors were vibrant and sharp. The free design help saved us so much time!",
    name: "Priya S.",
    role: "Event Coordinator, Madurai",
  },
  {
    stars: 4,
    text: "Great quality flyers at very competitive rates. Express delivery worked perfectly for our last-minute campaign.",
    name: "Arjun M.",
    role: "Marketing Head, Coimbatore",
  },
];

export function Testimonials() {
  return (
    <div className="mb-4">
      <SectionHeader title="What Customers Say" showLink={false} />
      <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        {REVIEWS.map(t => (
          <div key={t.name} className="bg-white rounded-[10px] px-[22px] pt-[22px] pb-5 border border-[#efefef]">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className={`text-[13px] ${s <= t.stars ? "text-amber-400" : "text-[#e5e5e5]"}`}>★</span>
                ))}
              </div>
              <div className="flex items-center gap-[3px] text-[10px] text-[#16a34a] font-semibold">
                <BadgeCheck size={11} /> Verified Purchase
              </div>
            </div>
            <div className="text-[13.5px] text-[#444] leading-[1.7] mb-4">"{t.text}"</div>
            <div className="text-[13px] font-bold text-[#111]">{t.name}</div>
            <div className="text-[11px] text-[#aaa] mt-[1px]">{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}