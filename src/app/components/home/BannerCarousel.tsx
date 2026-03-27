// // components/BannerCarousel.tsx
// import { useEffect, useState, useRef, useCallback } from "react";
// import { Link, useNavigate } from "react-router";

// const BASE = "http://54.206.3.97";
// const SLIDE_MS = 6000;
// const TRANS_MS = 350;

// interface Discount {
//   id: string;
//   product_id: string;
//   description: string;
//   discount: string;
//   start_date: string;
//   end_date: string;
//   is_active: number;
//   title: string;
//   banner_image_url: string;
//   cta_text: string;
//   category?: string;
// }

// /* ─── Ticker ─── */
// const TICKER_ITEMS = [
//   "Free shipping on orders over ₹999",
//   "New: Matte Laminate finish",
//   "24-hr turnaround available",
//   "Trusted by 50,000+ businesses",
// ];

// function Ticker() {
//   const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
//   return (
//     <div className="w-full overflow-hidden bg-[#111] text-white py-[7px]">
//       <div
//         className="inline-flex gap-12 whitespace-nowrap"
//         style={{ animation: "bc-ticker 22s linear infinite" }}
//       >
//         {doubled.map((t, i) => (
//           <span key={i} className="flex-shrink-0 text-[11px] tracking-[.12em] uppercase opacity-70 font-[DM_Sans,system-ui,sans-serif]">
//             {t}
//           </span>
//         ))}
//       </div>
//       <style>{`@keyframes bc-ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
//     </div>
//   );
// }

// /* ─── Live Badge ─── */
// function LiveBadge() {
//   const [count, setCount] = useState(3241);
//   useEffect(() => {
//     const id = setInterval(() => setCount(c => c + Math.floor(Math.random() * 3)), 4000);
//     return () => clearInterval(id);
//   }, []);
//   return (
//     <div className="inline-flex items-center gap-2 text-[10.5px] text-white">
//       <span className="w-[6px] h-[6px] rounded-full bg-[#22C55E] animate-pulse flex-shrink-0" />
//       <span>
//         <span className="font-medium text-white tabular-nums">{count.toLocaleString("en-IN")}</span>
//         {" "}orders today
//       </span>
//     </div>
//   );
// }

// /* ─── Countdown ─── */
// function Countdown({ endDate }: { endDate?: string }) {
//   const getLeft = useCallback(() => {
//     const target = endDate ? new Date(endDate).getTime() : Date.now() + (8 * 3600 + 24 * 60 + 51) * 1000;
//     const diff = Math.max(0, target - Date.now());
//     return {
//       h: Math.floor(diff / 3600000),
//       m: Math.floor((diff % 3600000) / 60000),
//       s: Math.floor((diff % 60000) / 1000),
//     };
//   }, [endDate]);

//   const [t, setT] = useState(getLeft);
//   useEffect(() => {
//     const id = setInterval(() => setT(getLeft()), 1000);
//     return () => clearInterval(id);
//   }, [getLeft]);

//   const pad = (n: number) => String(n).padStart(2, "0");
//   const Unit = ({ val, label }: { val: string; label: string }) => (
//     <div className="flex flex-col items-center gap-[3px]">
//       <span
//         className="text-white bg-black/70 backdrop-blur-sm rounded-[3px] px-0 py-1 text-center tabular-nums shadow-lg border border-white/20"
//         style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: "clamp(16px,3vw,22px)", width: "clamp(28px,5vw,36px)", lineHeight: 1 }}
//       >
//         {val}
//       </span>
//       <span className="text-[9px] tracking-[.08em] uppercase text-white/80">{label}</span>
//     </div>
//   );
//   const Sep = () => (
//     <span className="text-white/60 mb-3" style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18 }}>:</span>
//   );

//   return (
//     <div className="flex items-center gap-[5px] mb-7">
//       <span className="text-[10px] tracking-[.1em] uppercase text-white/80 mr-1">Ends in</span>
//       <Unit val={pad(t.h)} label="hrs" />
//       <Sep />
//       <Unit val={pad(t.m)} label="min" />
//       <Sep />
//       <Unit val={pad(t.s)} label="sec" />
//     </div>
//   );
// }

// /* ─── Dot Progress Nav ─── */
// function DotNav({
//   count, current, onGoTo,
// }: { count: number; current: number; onGoTo: (i: number) => void }) {
//   return (
//     <div className="flex items-center gap-[6px]">
//       {Array.from({ length: count }).map((_, i) => (
//         <button
//           key={i}
//           onClick={() => onGoTo(i)}
//           aria-label={`Slide ${i + 1}`}
//           className="relative h-[2px] rounded-[1px] border-none cursor-pointer p-0 overflow-hidden transition-all duration-300"
//           style={{
//             width: i === current ? 32 : 8,
//             background: i === current ? "transparent" : "rgba(255,255,255,0.4)",
//           }}
//         >
//           {i === current && (
//             <span
//               key={current}
//               className="absolute inset-0"
//               style={{ background: "#C8392B", animation: `bc-dot-fill ${SLIDE_MS}ms linear forwards` }}
//             />
//           )}
//         </button>
//       ))}
//       <style>{`@keyframes bc-dot-fill{from{width:0%}to{width:100%}}`}</style>
//     </div>
//   );
// }

// /* ─── Skeleton ─── */
// function Skeleton() {
//   return (
//     <div className="w-full border-b border-[#E8E4E0]" style={{ background: "#FAFAF8" }}>
//       <div className="h-[30px] bg-[#111]" />
//       <div className="min-h-[400px] sm:min-h-[520px] relative bg-gray-200 animate-pulse">
//         <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]"
//           style={{ animation: "bc-shimmer 1.8s ease infinite" }} />
//       </div>
//       <style>{`@keyframes bc-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>
//     </div>
//   );
// }

// /* ─── Fallback ─── */
// function Fallback() {
//   return (
//     <div className="w-full relative" style={{ background: "#FAFAF8", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
//       <Ticker />
//       <div className="relative min-h-[400px] sm:min-h-[520px] overflow-hidden">
//         {/* Background Image */}
//         <div className="absolute inset-0">
//           <img
//             src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=1920&q=80"
//             alt="Background"
//             className="w-full h-full object-cover"
//           />
//         </div>
        
//         {/* Semi-transparent background container for text */}
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        
//         {/* Text Container */}
//         <div className="relative z-10 flex items-center min-h-[400px] sm:min-h-[520px] px-6 sm:px-10 lg:px-12">
//           <div className="max-w-2xl">
//             <LiveBadge />
//             <div className="flex items-center gap-2.5 mb-4">
//               <span className="w-[6px] h-[6px] rounded-full bg-[#C8392B] flex-shrink-0" />
//               <span className="text-[10.5px] tracking-[.14em] uppercase text-white">Professional Printing</span>
//             </div>
//             <div className="inline-flex items-center gap-1.5 bg-[#C8392B] text-white text-[10px] font-medium tracking-[.1em] uppercase px-3 py-[5px] rounded-[3px] mb-4">
//               Free Shipping Today
//             </div>
//             <h1
//               className="text-white mb-4"
//               style={{ 
//                 fontFamily: "'DM Serif Display',Georgia,serif", 
//                 fontSize: "clamp(2.2rem,4vw,3.2rem)", 
//                 lineHeight: 1.06,
//               }}
//             >
//               Professional<br />Prints. <em>Delivered</em><br />Fast.
//             </h1>
//             <p className="text-white/95 text-[13.5px] leading-[1.75] mb-6 max-w-[300px]">
//               Business cards, banners, flyers & ID cards — printed and shipped across India in 24–48 hrs.
//             </p>
//             <div className="flex gap-2.5 flex-wrap mb-6">
//               <Link to="/products">
//                 <button className="inline-flex items-center gap-2 bg-white text-[#111] text-[12.5px] font-medium px-5 py-3.5 rounded-[3px] hover:bg-[#C8392B] hover:text-white transition-colors duration-150 shadow-lg">
//                   Shop Products
//                   <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
//                 </button>
//               </Link>
//               <Link to="/products">
//                 <button className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white text-[12.5px] font-[400] px-5 py-3.5 rounded-[3px] border border-white/50 hover:bg-black/70 transition-colors duration-150">
//                   Browse Templates
//                 </button>
//               </Link>
//             </div>
//             <div className="flex gap-4 flex-wrap pt-5 border-t border-white/30">
//               {["Quality Guarantee", "Pan India Delivery", "24-hr Turnaround"].map(t => (
//                 <div key={t} className="flex items-center gap-1.5 text-[11px] text-white/90">
//                   <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#C8392B" strokeWidth="1.5"><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/></svg>
//                   {t}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════
//    MAIN CAROUSEL - FULL SCREEN IMAGE WITH SEMI-TRANSPARENT BACKGROUND
// ═══════════════════════════════════════════ */
// export function BannerCarousel() {
//   const [discounts, setDiscounts] = useState<Discount[]>([]);
//   const [cur, setCur] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [phase, setPhase] = useState<"idle" | "out">("idle");
//   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const navigate = useNavigate();

//   /* Fetch */
//   useEffect(() => {
//     fetch(`${BASE}/api/product_discount/active/last5`)
//       .then(r => r.json())
//       .then(data => {
//         const list: Discount[] = Array.isArray(data.discounts) ? data.discounts : [];
//         setDiscounts(list);
//         setCur(0);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   /* Transition logic */
//   const transition = useCallback((getNext: (prev: number, len: number) => number) => {
//     setPhase("out");
//     setTimeout(() => {
//       setCur(prev => {
//         const len = discounts.length;
//         return len > 0 ? Math.max(0, Math.min(getNext(prev, len), len - 1)) : 0;
//       });
//       setTimeout(() => setPhase("idle"), 30);
//     }, TRANS_MS);
//   }, [discounts.length]);

//   const startTimer = useCallback(() => {
//     if (timerRef.current) clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       transition((p, l) => (p + 1) % l);
//     }, SLIDE_MS);
//   }, [transition]);

//   useEffect(() => {
//     if (discounts.length > 1) startTimer();
//     return () => { if (timerRef.current) clearInterval(timerRef.current); };
//   }, [discounts.length, startTimer]);

//   const advance = useCallback((dir: 1 | -1) => {
//     if (phase !== "idle") return;
//     transition((p, l) => (p + dir + l) % l);
//     startTimer();
//   }, [phase, transition, startTimer]);

//   const goTo = useCallback((idx: number) => {
//     if (phase !== "idle" || idx === cur) return;
//     transition(() => idx);
//     startTimer();
//   }, [phase, cur, transition, startTimer]);

//   /* Guards */
//   if (loading) return <Skeleton />;
//   if (!discounts.length) return <Fallback />;

//   const safeIdx = Math.max(0, Math.min(cur, discounts.length - 1));
//   const d = discounts[safeIdx];
//   if (!d) return <Skeleton />;

//   const isOut = phase === "out";
//   const fadeStyle = (delayMs: number): React.CSSProperties => ({
//     transition: `opacity ${TRANS_MS}ms ease, transform ${TRANS_MS}ms ease`,
//     transitionDelay: isOut ? "0ms" : `${delayMs}ms`,
//     opacity: isOut ? 0 : 1,
//     transform: isOut ? "translateY(10px)" : "translateY(0)",
//   });

//   return (
//     <div
//       className="w-full relative"
//       style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}
//     >
//       {/* Font */}
  
//       <Ticker />

//       {/* Full Screen Image Carousel with Semi-Transparent Background */}
//       <div className="relative min-h-[400px] sm:min-h-[520px] md:min-h-[600px] overflow-hidden">
//         {/* Background Image */}
//         <div className="absolute inset-0">
//           <img
//             key={`img-${safeIdx}`}
//             src={`${BASE}/${d.banner_image_url}`}
//             alt={d.title}
//             className="w-full h-full object-cover"
//             style={{
//               transition: `opacity ${TRANS_MS}ms ease, transform ${TRANS_MS}ms ease`,
//               opacity: isOut ? 0 : 1,
//               transform: isOut ? "scale(1.04)" : "scale(1)",
//             }}
//             onError={e => { (e.target as HTMLImageElement).style.opacity = "0"; }}
//           />
//         </div>

//         {/* Semi-transparent gradient background for text readability */}

//         {/* Text Container */}
//         <div className="relative z-10 flex items-center min-h-[400px] sm:min-h-[520px] md:min-h-[600px] px-6 sm:px-10 lg:px-12">
//           <div className="max-w-2xl">
//             {/* Live Badge */}
//             {/* <div style={fadeStyle(0)}><LiveBadge /></div> */}

//             {/* Eyebrow */}
//             {/* <div style={fadeStyle(40)} className="flex items-center gap-2.5 mb-4">
//               <span className="w-[6px] h-[6px] rounded-full bg-[#C8392B] flex-shrink-0" />
//               <span className="text-[10.5px] tracking-[.14em] uppercase text-white">
//                 {d.category ?? "Limited Offer"}
//               </span>
//             </div> */}

//             {/* Discount Badge */}
//             <div style={fadeStyle(70)}>
//               <div className="inline-flex items-center gap-1.5 bg-[#C8392B] text-white text-[10px] font-medium tracking-[.1em] uppercase px-3 py-[5px] rounded-[3px] mb-4 shadow-lg">
//                 <svg width="9" height="9" viewBox="0 0 10 10" fill="white">
//                   <polygon points="5,1 6.2,3.8 9.5,3.8 7,5.7 7.9,9 5,7.2 2.1,9 3,5.7 0.5,3.8 3.8,3.8" />
//                 </svg>
//                 {d.discount} OFF
//               </div>
//             </div>

//             {/* Title */}
//             <h2
//               className="text-black mb-4"
//               style={{
//                 fontFamily: "'DM Serif Display',Georgia,serif",
//                 fontSize: "clamp(1.8rem,4vw,3.2rem)",
//                 lineHeight: 1.06,
//                 ...fadeStyle(100),
//               }}
//               dangerouslySetInnerHTML={{ __html: d.title }}
//             />

//             {/* Description */}
//             <p
//               className="text-black mb-4"
//              style={{
//                 fontFamily: "'DM Serif Display',Georgia,serif",
//                 fontSize: "clamp(1.8rem,4vw,3.2rem)",
//                 lineHeight: 1.06,
//                 ...fadeStyle(100),
//               }}
//             >
//               {d.description}
//             </p>

//             {/* Countdown */}
//             {/* <div style={fadeStyle(160)}>
//               <Countdown endDate={d.end_date} />
//             </div> */}

//             {/* CTAs */}
//             <div className="flex gap-2.5 flex-wrap mb-4" style={fadeStyle(190)}>
//               <button
//                 className="inline-flex items-center gap-2 bg-white text-[#111] text-[12.5px] font-medium px-5 py-3.5 rounded-[3px] border-none cursor-pointer hover:bg-[#C8392B] hover:text-white transition-colors duration-150 shadow-lg"
//                 onClick={() => navigate(`/product/${d.product_id}`)}
//               >
//                 {d.cta_text}
//                 <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
//                   <path d="M3 8h10M9 4l4 4-4 4" />
//                 </svg>
//               </button>
//               <Link to="/products">
//                 <button className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-[12.5px] font-[400] px-5 py-3.5 rounded-[3px] border border-white/50 cursor-pointer hover:bg-black/80 transition-colors duration-150">
//                   Browse All
//                 </button>
//               </Link>
//             </div>

//             {/* Trust Row */}
//             <div className="flex gap-4 flex-wrap pt-5 border-t border-white/30" style={fadeStyle(220)}>
//               {[
//                 { icon: <><path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z" /></>, label: "Quality Guarantee" },
//                 { icon: <><rect x="1" y="5" width="14" height="9" rx="1" /><path d="M5 5V4a3 3 0 016 0v1" /></>, label: "Secure Checkout" },
//                 { icon: <><path d="M1 10l3-3 3 3 4-5 4 1" /></>, label: "Pan India" },
//               ].map(({ icon, label }) => (
//                 <div key={label} className="flex items-center gap-1.5 text-[11px] text-white/90">
//                   <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#C8392B" strokeWidth="1.5">{icon}</svg>
//                   {label}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar at Bottom */}
//         {/* {discounts.length > 1 && (
//           <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/30">
//             <span
//               key={safeIdx}
//               className="block h-full bg-[#C8392B]"
//               style={{ animation: `bc-img-progress ${SLIDE_MS}ms linear forwards` }}
//             />
//           </div>
//         )} */}
//       </div>

//       {/* Navigation Bar */}
//        {discounts.length > 1 && (
//         <div className="flex items-center gap-3 px-6 sm:px-10 lg:px-12 py-4 bg-black/60 backdrop-blur-sm border-t border-white/20">
//           <DotNav count={discounts.length} current={safeIdx} onGoTo={goTo} />
//           <span className="ml-2 text-[13px] text-white/80" style={{ fontFamily: "'DM Serif Display',Georgia,serif" }}>
//             <em className="not-italic text-white">{String(safeIdx + 1).padStart(2, "0")}</em>
//             {" / "}{String(discounts.length).padStart(2, "0")}
//           </span>
//           <div className="flex-1" />
//           <button
//             onClick={() => advance(-1)}
//             className="w-[34px] h-[34px] rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 cursor-pointer hover:bg-white hover:text-black transition-all duration-150"
//             aria-label="Previous"
//           >
//             <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 4L6 8l4 4" /></svg>
//           </button>
//           <button
//             onClick={() => advance(1)}
//             className="w-[34px] h-[34px] rounded-full border border-white/40 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 cursor-pointer hover:bg-white hover:text-black transition-all duration-150"
//             aria-label="Next"
//           >
//             <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 4l4 4-4 4" /></svg>
//           </button>
//         </div>
//       )} 

//       <style>{`
//         @keyframes bc-img-progress { 
//           from { width: 0% } 
//           to { width: 100% } 
//         }
//         @keyframes bc-ticker { 
//           0% { transform: translateX(0) } 
//           100% { transform: translateX(-50%) } 
//         }
//         @keyframes bc-dot-fill { 
//           from { width: 0% } 
//           to { width: 100% } 
//         }
//       `}</style>
//     </div>
//   );
// }


// components/BannerCarousel.tsx
import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";

const BASE = "http://54.206.3.97";
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