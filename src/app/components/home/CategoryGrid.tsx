// components/CategoryGrid.tsx
import { Link } from "react-router";
import { SectionHeader } from "./SectionHeader";

const CATEGORIES = [
  { label: "Business Cards", emoji: "🪪" },
  { label: "Banners",        emoji: "🎌" },
  { label: "Brochures",      emoji: "📄" },
  { label: "Flyers",         emoji: "📋" },
  { label: "ID Cards",       emoji: "💳" },
  { label: "Stickers",       emoji: "🏷️" },
  { label: "Posters",        emoji: "🖼️" },
  { label: "Wedding Cards",  emoji: "💌" },
];

export function CategoryGrid() {
  return (
    <div className="mb-4">
      <SectionHeader title="Shop by Category" />
      <div className="grid grid-cols-8 gap-2.5 max-md:grid-cols-4 max-[480px]:grid-cols-4">
        {CATEGORIES.map(c => (
          <Link
            to="/products"
            key={c.label}
            className="bg-white rounded-[10px] py-[18px] px-2 pb-3.5 flex flex-col items-center gap-[9px] cursor-pointer border border-[1.5px] border-transparent no-underline hover:border-[#c0392b] hover:shadow-[0_4px_16px_rgba(192,57,43,0.1)] hover:-translate-y-0.5 transition-all"
          >
            <span className="text-[26px] leading-none">{c.emoji}</span>
            <span className="text-[11px] font-semibold text-[#333] text-center leading-[1.3]">{c.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}