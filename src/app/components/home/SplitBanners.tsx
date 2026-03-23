// components/SplitBanners.tsx
import { Link, useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

export function SplitBanners() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3 mb-4 max-sm:grid-cols-1">
      {/* Banner A */}
      <div
        className="rounded-xl px-7 py-8 relative overflow-hidden cursor-pointer min-h-[150px] flex flex-col justify-end hover:-translate-y-0.5 transition-transform bg-gradient-to-br from-[#111] to-[#222]"
        onClick={() => navigate("/products")}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] opacity-[0.08] pointer-events-none">📦</div>
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/45 mb-1.5">Bulk Orders Welcome</div>
        <div className="text-[1.3rem] font-extrabold text-white leading-[1.2] mb-3">
          Order 1000+ pcs<br />& Save 40%
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white no-underline w-fit border-b border-white/30 pb-[1px]"
        >
          Get a Quote <ArrowRight size={13} />
        </Link>
      </div>

      {/* Banner B */}
      <div
        className="rounded-xl px-7 py-8 relative overflow-hidden cursor-pointer min-h-[150px] flex flex-col justify-end hover:-translate-y-0.5 transition-transform bg-gradient-to-br from-[#7f1d1d] to-[#c0392b]"
        onClick={() => navigate("/products")}
      >
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[80px] opacity-[0.08] pointer-events-none">🚀</div>
        <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/45 mb-1.5">Rush Printing Available</div>
        <div className="text-[1.3rem] font-extrabold text-white leading-[1.2] mb-3">
          Same-Day<br />Express Printing
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white no-underline w-fit border-b border-white/30 pb-[1px]"
        >
          Order Now <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}