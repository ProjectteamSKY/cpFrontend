// components/HowItWorks.tsx
import { SectionHeader } from "./SectionHeader";

const STEPS = [
  { n: "1", t: "Choose Product", d: "Browse 100+ print products and pick what you need." },
  { n: "2", t: "Upload Artwork",  d: "Upload your design or customise one of our free templates." },
  { n: "3", t: "We Print It",     d: "Our machines print with precision on premium materials." },
  { n: "4", t: "Fast Delivery",   d: "Packed and shipped to your door in 24–48 hours." },
];

export function HowItWorks() {
  return (
    <div className="bg-white rounded-xl px-9 py-10 mb-4 border border-[#efefef]">
      <SectionHeader title="How It Works" showLink={false} />
      <div className="grid grid-cols-4 max-sm:grid-cols-2 max-sm:gap-5 mt-7">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className={`px-6 text-center max-sm:px-0 ${i < STEPS.length - 1 ? "border-r border-[#f0f0f0] max-sm:border-r-0" : ""}`}
          >
            <div className="w-[42px] h-[42px] rounded-full bg-[#fff5f5] border-2 border-[#fcc] text-[#c0392b] text-[15px] font-extrabold flex items-center justify-center mx-auto mb-3.5">
              {s.n}
            </div>
            <div className="text-sm font-bold text-[#111] mb-1.5">{s.t}</div>
            <div className="text-[12.5px] text-[#888] leading-[1.6]">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}