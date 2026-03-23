// components/BannerCarousel.tsx
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, ChevronRight, BadgeCheck, Truck, Clock } from "lucide-react";

const BASE = "http://54.206.3.97";

interface Discount {
  id: string;
  product_id: string;
  description: string;
  discount: string;
  start_date: string;
  end_date: string;
  is_active: number;
  title: string;
  banner_image_url: string;
  cta_text: string;
}

/* ── Skeleton ── */
function BannerSkeleton() {
  return (
    <div className="grid grid-cols-[4fr_8fr] h-[500px] bg-[#f5f5f5] overflow-hidden mb-4 border-b border-[#efefef]">
      <div className="animate-pulse bg-gradient-to-r from-[#ebebeb] via-[#f5f5f5] to-[#ebebeb] bg-[length:200%_100%]" />
      <div className="animate-pulse bg-gradient-to-r from-[#e0e0e0] via-[#ebebeb] to-[#e0e0e0] bg-[length:200%_100%]" />
    </div>
  );
}

/* ── Fallback (no discounts) ── */
function BannerFallback() {
  return (
    <div className="grid grid-cols-[4fr_8fr] h-[500px] bg-white overflow-hidden mb-4 border-b border-[#efefef]">
      {/* Text panel */}
      <div className="flex flex-col justify-center px-10 py-11 bg-white relative z-[2]">
        <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#c0392b] mb-3.5 flex items-center gap-2">
          <span className="w-[22px] h-[2px] bg-[#c0392b] block" />
          Trusted by 50,000+ Businesses
        </div>
        <h1 className="text-[clamp(1.9rem,3vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#111] mb-3.5">
          Professional<br />Prints.<br />
          <span className="text-[#c0392b]">Delivered Fast.</span>
        </h1>
        <p className="text-[13.5px] text-[#666] leading-[1.7] mb-6 max-w-[340px]">
          Business cards, banners, flyers, ID cards & more. Upload your design or use our free
          templates — printed and shipped in 24–48 hrs.
        </p>
        <div className="flex gap-2.5 flex-wrap mb-5">
          <Link to="/products">
            <button className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-bold px-6 py-3 rounded-lg border-none cursor-pointer hover:bg-[#a93226] transition-colors">
              Shop Products <ArrowRight size={14} />
            </button>
          </Link>
          <Link to="/products">
            <button className="inline-flex items-center gap-2 bg-transparent text-[#1c1c1c] text-sm font-semibold px-[22px] py-3 rounded-lg border border-[#d0d0d0] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
              Browse Templates
            </button>
          </Link>
        </div>
        <div className="flex gap-3.5 flex-wrap mb-5">
          {[
            { icon: <BadgeCheck size={13} />, label: "Quality Guaranteed" },
            { icon: <Truck size={13} />, label: "Pan India" },
            { icon: <Clock size={13} />, label: "24-hr Turnaround" },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#888]">
              <span className="text-[#c0392b]">{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col pt-4 border-t border-[#f0f0f0] mt-5">
          <span className="text-[22px] font-extrabold text-[#111] leading-none">3,200+</span>
          <span className="text-[11.5px] text-[#c0392b] font-semibold mt-[3px]">orders this month</span>
        </div>
      </div>
      {/* Image placeholder */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#f7f7f7] to-[#efefef]">
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, #e0e0e0 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="absolute inset-0 z-[1]" style={{ background: "linear-gradient(to right, #fff 0%, transparent 30%)" }} />
      </div>
    </div>
  );
}

export function BannerCarousel() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${BASE}/api/product_discount/active/last5`)
      .then(r => r.json())
      .then(data => { setDiscounts(data.discounts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => goNext(), 5500);
  };

  useEffect(() => {
    if (discounts.length > 1) startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [discounts.length, current]);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 380);
    startInterval();
  };

  const goNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(prev => (prev + 1) % discounts.length);
      setAnimating(false);
    }, 380);
  };

  const goPrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(prev => (prev - 1 + discounts.length) % discounts.length);
      setAnimating(false);
    }, 380);
  };

  if (loading) return <BannerSkeleton />;
  if (!discounts.length) return <BannerFallback />;

  const d = discounts[current];

  return (
    <div className="grid grid-cols-[4fr_8fr] h-[500px] bg-white overflow-hidden mb-4 border-b border-[#efefef] max-md:grid-cols-1 max-md:h-auto">

      {/* ── Text Panel ── */}
      <div
        className={`flex flex-col justify-center px-10 py-11 bg-white relative z-[2] transition-all duration-[420ms]
          ${animating ? "opacity-0 -translate-x-3" : "opacity-100 translate-x-0"}`}
      >
        <div className="inline-flex items-center bg-[#fef2f2] text-[#c0392b] border border-[#fcc] rounded-full text-[11px] font-extrabold tracking-[0.1em] uppercase px-3.5 py-[5px] w-fit mb-4">
          {d.discount} OFF
        </div>
        <h2 className="text-[clamp(1.5rem,2.5vw,2.2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111] mb-3">
          {d.title}
        </h2>
        <p className="text-[13.5px] text-[#666] leading-[1.7] mb-6 max-w-[340px]">
          {d.description}
        </p>

        <div className="flex gap-2.5 flex-wrap mb-5">
          <button
            className="inline-flex items-center gap-2 bg-[#c0392b] text-white text-sm font-bold px-6 py-3 rounded-lg border-none cursor-pointer hover:bg-[#a93226] hover:-translate-y-px transition-all"
            onClick={() => navigate(`/product/${d.product_id}`)}
          >
            {d.cta_text} <ArrowRight size={14} />
          </button>
          <Link to="/products">
            <button className="inline-flex items-center gap-2 bg-transparent text-[#1c1c1c] text-sm font-semibold px-[22px] py-3 rounded-lg border border-[#d0d0d0] cursor-pointer hover:bg-[#f5f5f5] transition-colors">
              All Products
            </button>
          </Link>
        </div>

        <div className="flex gap-3.5 flex-wrap mb-5">
          {[
            { icon: <BadgeCheck size={13} />, label: "Quality" },
            { icon: <Truck size={13} />, label: "Pan India" },
            { icon: <Clock size={13} />, label: "24-hr" },
          ].map(t => (
            <div key={t.label} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#888]">
              <span className="text-[#c0392b]">{t.icon}</span> {t.label}
            </div>
          ))}
        </div>

        {/* Nav controls */}
        {discounts.length > 1 && (
          <div className="flex items-center gap-2 mt-auto pt-2">
            <button
              className="w-8 h-8 rounded-full bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center cursor-pointer text-[#555] hover:bg-[#fef2f2] hover:border-[#fcc] hover:text-[#c0392b] transition-colors"
              onClick={goPrev} aria-label="Previous"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <div className="flex gap-[5px]">
              {discounts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-[7px] border-none cursor-pointer p-0 rounded-full transition-all duration-[250ms]
                    ${i === current ? "w-5 bg-[#c0392b]" : "w-[7px] bg-[#ddd]"}`}
                />
              ))}
            </div>
            <button
              className="w-8 h-8 rounded-full bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center cursor-pointer text-[#555] hover:bg-[#fef2f2] hover:border-[#fcc] hover:text-[#c0392b] transition-colors"
              onClick={goNext} aria-label="Next"
            >
              <ChevronRight size={16} />
            </button>
            <span className="text-[12px] text-[#bbb] ml-1 whitespace-nowrap">
              <b className="text-[#111] text-sm">{String(current + 1).padStart(2, "0")}</b>
              <span> / {String(discounts.length).padStart(2, "0")}</span>
            </span>
          </div>
        )}

        {/* Badge */}
        <div className="flex flex-col mt-5 pt-4 border-t border-[#f0f0f0]">
          <span className="text-[22px] font-extrabold text-[#111] leading-none">3,200+</span>
          <span className="text-[11.5px] text-[#c0392b] font-semibold mt-[3px]">orders this month ✓</span>
        </div>
      </div>

      {/* ── Image Panel ── */}
      <div className="relative overflow-hidden bg-[#f4f4f4] max-md:h-[260px] max-md:order-first">
        <div
          className={`absolute inset-0 transition-all duration-500
            ${animating ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"}`}
        >
          <img
            src={`${BASE}/${d.banner_image_url}`}
            alt={d.title}
            className="w-full h-full object-cover object-center block"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>

        {/* Left-edge fade */}
        <div
          className="absolute top-0 left-0 w-20 h-full z-[1] pointer-events-none max-md:hidden"
          style={{ background: "linear-gradient(to right, #fff 0%, transparent 100%)" }}
        />

        {/* Progress bar */}
        {discounts.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10 z-[2]">
            <div
              key={current}
              className="h-full bg-[#c0392b]"
              style={{ animation: "pgc-progress 5.5s linear forwards" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pgc-progress { from { width: 0% } to { width: 100% } }
      `}</style>
    </div>
  );
}