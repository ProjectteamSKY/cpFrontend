// components/WhyUs.tsx
import { SectionHeader } from "./SectionHeader";

const OFFERS = [
  {
    ico: "🎯",
    title: "Bulk Order Savings",
    desc: "Order 500+ pieces of any product and save up to 40%. Perfect for offices and events.",
    pill: "Up to 40% OFF",
  },
  {
    ico: "⚡",
    title: "Express 24-hr Prints",
    desc: "Need it fast? Select express printing and get your order ready the next business day.",
    pill: "Same Day Available",
  },
  {
    ico: "🎨",
    title: "Free Design Support",
    desc: "Our in-house designers help you create print-ready artwork — completely free of charge.",
    pill: "Worth ₹499 — FREE",
  },
];

export function WhyUs() {
  return (
    <div className="mb-4">
      <SectionHeader title="Why Citizen Prints?" showLink={false} />
      <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
        {OFFERS.map(o => (
          <div key={o.title} className="bg-white rounded-[10px] p-5 px-[22px] flex items-start gap-3.5 border border-[#efefef]">
            <div className="text-[30px] leading-none shrink-0 mt-0.5">{o.ico}</div>
            <div>
              <div className="text-sm font-bold text-[#111] mb-1">{o.title}</div>
              <div className="text-[12.5px] text-[#777] leading-[1.55]">{o.desc}</div>
              <div className="inline-block mt-1.5 text-[11px] font-bold text-[#c0392b] bg-[#fff5f5] px-2 py-[2px] rounded">
                {o.pill}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}