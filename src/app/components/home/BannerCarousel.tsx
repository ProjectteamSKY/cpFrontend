// components/BannerCarousel.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";

const BASE = "http://127.0.0.1:8000";
const SLIDE_MS = 6000;
const TRANS_MS = 350;

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
  category?: string;
}

/* ─── Ticker ─── */
const TICKER_ITEMS = [
  "Free shipping on orders over ₹999",
  "New: Matte Laminate finish",
  "24-hr turnaround available",
  "Trusted by 50,000+ businesses",
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full overflow-hidden bg-[#111] text-white py-[7px]">
      <div
        className="inline-flex gap-12 whitespace-nowrap"
        style={{ animation: "bc-ticker 22s linear infinite" }}
      >
        {doubled.map((t, i) => (
          <span key={i} className="flex-shrink-0 text-[11px] tracking-[.12em] uppercase opacity-70 font-[DM_Sans,system-ui,sans-serif]">
            {t}
          </span>
        ))}
      </div>
      <style>{`@keyframes bc-ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ─── Dot Progress Nav ─── */
function DotNav({
  count, current, onGoTo,
}: { count: number; current: number; onGoTo: (i: number) => void }) {
  return (
    <div className="flex items-center gap-[6px]">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGoTo(i)}
          aria-label={`Slide ${i + 1}`}
          className="relative h-[2px] rounded-[1px] border-none cursor-pointer p-0 overflow-hidden transition-all duration-300"
          style={{
            width: i === current ? 32 : 8,
            background: i === current ? "transparent" : "rgba(255,255,255,0.4)",
          }}
        >
          {i === current && (
            <span
              key={current}
              className="absolute inset-0"
              style={{ background: "#C8392B", animation: `bc-dot-fill ${SLIDE_MS}ms linear forwards` }}
            />
          )}
        </button>
      ))}
      <style>{`@keyframes bc-dot-fill{from{width:0%}to{width:100%}}`}</style>
    </div>
  );
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="w-full border-b border-[#E8E4E0]" style={{ background: "#FAFAF8" }}>
      <div className="h-[30px] bg-[#111]" />
      <div className="min-h-[400px] sm:min-h-[520px] relative bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
          style={{ animation: "bc-shimmer 1.8s ease infinite" }} />
      </div>
      <style>{`@keyframes bc-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
    </div>
  );
}

/* ─── Fallback ─── */
function Fallback() {
  return (
    <div className="w-full relative" style={{ background: "#FAFAF8", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <Ticker />
      <div className="relative min-h-[400px] sm:min-h-[520px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=1920&q=80"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Buttons - Only show on hover */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <button
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-200"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-200"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dot Navigation - Bottom center */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <DotNav count={5} current={0} onGoTo={() => {}} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN CAROUSEL - FULL SCREEN IMAGE WITH HOVER BUTTONS
═══════════════════════════════════════════ */
export function BannerCarousel() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [cur, setCur] = useState(0);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"idle" | "out">("idle");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  /* Fetch */
  useEffect(() => {
    fetch(`${BASE}/api/product_discount/active/last5`)
      .then(r => r.json())
      .then(data => { 
        const list: Discount[] = Array.isArray(data.discounts) ? data.discounts : [];
        setDiscounts(list);
        setCur(0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* Transition logic */
  const transition = useCallback((getNext: (prev: number, len: number) => number) => {
    setPhase("out");
    setTimeout(() => {
      setCur(prev => {
        const len = discounts.length;
        return len > 0 ? Math.max(0, Math.min(getNext(prev, len), len - 1)) : 0;
      });
      setTimeout(() => setPhase("idle"), 30);
    }, TRANS_MS);
  }, [discounts.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      transition((p, l) => (p + 1) % l);
    }, SLIDE_MS);
  }, [transition]);

  useEffect(() => {
    if (discounts.length > 1) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [discounts.length, startTimer]);

  const advance = useCallback((dir: 1 | -1) => {
    if (phase !== "idle") return;
    transition((p, l) => (p + dir + l) % l);
    startTimer();
  }, [phase, transition, startTimer]);

  const goTo = useCallback((idx: number) => {
    if (phase !== "idle" || idx === cur) return;
    transition(() => idx);
    startTimer();
  }, [phase, cur, transition, startTimer]);

  /* Guards */
  if (loading) return <Skeleton />;
  if (!discounts.length) return <Fallback />;

  const safeIdx = Math.max(0, Math.min(cur, discounts.length - 1));
  const d = discounts[safeIdx];
  if (!d) return <Skeleton />;

  const isOut = phase === "out";

  return (
    <div
      className="w-full relative"
      style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}
    >
      <Ticker />

      {/* Full Screen Image Carousel with Hover Buttons */}
      <div className="relative min-h-full sm:min-h-[520px] md:min-h-[600px] overflow-hidden group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            key={`img-${safeIdx}`}
            src={`${BASE}/${d.banner_image_url}`}
            alt={d.title}
            className="w-full h-full object-cover"
            style={{
              transition: `opacity ${TRANS_MS}ms ease, transform ${TRANS_MS}ms ease`,
              opacity: isOut ? 0 : 1,
              transform: isOut ? "scale(1.04)" : "scale(1)",
            }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>

        {/* Navigation Buttons - Only show on hover */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
          <button
            onClick={() => advance(-1)}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-200 pointer-events-auto"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => advance(1)}
            className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 hover:scale-110 transition-all duration-200 pointer-events-auto"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* Dot Navigation - Bottom center */}
        {discounts.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
            <DotNav count={discounts.length} current={safeIdx} onGoTo={goTo} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes bc-img-progress { 
          from { width: 0% } 
          to { width: 100% } 
        }
        @keyframes bc-ticker { 
          0% { transform: translateX(0) } 
          100% { transform: translateX(-50%) } 
        }
        @keyframes bc-dot-fill { 
          from { width: 0% } 
          to { width: 100% } 
        }
      `}</style>
    </div>
  );
}