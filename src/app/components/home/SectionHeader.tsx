// components/SectionHeader.tsx
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  sub?: string;
  showLink?: boolean;
  linkTo?: string;
}

export function SectionHeader({ title, sub, showLink = true, linkTo = "/products" }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-[22px] bg-[#c0392b] rounded-sm" />
        <div>
          <div className="text-xl font-extrabold text-[#111] tracking-[-0.02em]">{title}</div>
          {sub && <div className="text-[13px] text-[#888] mt-0.5">{sub}</div>}
        </div>
      </div>
      {showLink && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#c0392b] no-underline border border-[#fcc] px-3 py-1.5 rounded-md hover:bg-[#fff5f5] transition-colors"
        >
          View All <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}