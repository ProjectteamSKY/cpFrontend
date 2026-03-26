// import { Link, useNavigate } from "react-router";
// import {
//   ArrowRight, Truck, ShieldCheck, RefreshCcw, Headphones,
//   Star, ChevronRight, Search, ShoppingCart, User, Heart,
//   Zap, BadgeCheck, Clock, Layers, Phone
// } from "lucide-react";
// import { useProducts } from "../../hooks/useProduct";
// import { useEffect, useState, useRef } from "react";

// function getValidImage(product: any): string | null {
//   let images = product.images;
//   if (typeof images === "string") {
//     try { images = JSON.parse(images); } catch { return null; }
//   }
//   if (!Array.isArray(images) || images.length === 0) return null;
//   for (const img of images) {
//     if (img && typeof img === "object" && typeof img.url === "string" && img.url.startsWith("media/products/")) return img.url;
//     if (typeof img === "string" && img.startsWith("media/products/")) return img;
//   }
//   return null;
// }

// const BASE = "http://54.206.3.97";

// // ── BANNER CAROUSEL (Hero replacement — full-width text-overlay) ─────────────
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
// }

// // ── BANNER CAROUSEL (8/4 split — image right, text left) ─────────────────────
// function BannerCarousel() {
//   const [discounts, setDiscounts] = useState<Discount[]>([]);
//   const [current, setCurrent] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [animating, setAnimating] = useState(false);
//   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${BASE}/api/product_discount/active/last5`)
//       .then(r => r.json())
//       .then(data => { setDiscounts(data.discounts || []); setLoading(false); })
//       .catch(() => setLoading(false));
//   }, []);

//   const startInterval = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//     intervalRef.current = setInterval(() => goNext(), 5500);
//   };

//   useEffect(() => {
//     if (discounts.length > 1) startInterval();
//     return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
//   }, [discounts.length, current]);

//   const goTo = (idx: number) => {
//     if (animating || idx === current) return;
//     setAnimating(true);
//     setTimeout(() => { setCurrent(idx); setAnimating(false); }, 380);
//     startInterval();
//   };
//   const goNext = () => {
//     setAnimating(true);
//     setTimeout(() => { setCurrent(prev => (prev + 1) % discounts.length); setAnimating(false); }, 380);
//   };
//   const goPrev = () => {
//     setAnimating(true);
//     setTimeout(() => { setCurrent(prev => (prev - 1 + discounts.length) % discounts.length); setAnimating(false); }, 380);
//   };

//   /* ── SKELETON ── */
//   if (loading) {
//     return (
//       <div className="pgc-root pgc-skeleton">
//         <div className="pgc-skeleton-panel" />
//         <div className="pgc-skeleton-img" />
//       </div>
//     );
//   }

//   /* ── FALLBACK (no discounts) ── */
//   if (!discounts.length) {
//     return (
//       <div className="pgc-root pgc-fallback">
//         {/* Text panel — 4 cols */}
//         <div className="pgc-panel">
//           <div className="pgc-eyebrow">Trusted by 50,000+ Businesses</div>
//           <h1 className="pgc-h1">
//             Professional<br />
//             Prints.<br />
//             <span className="pgc-h1-accent">Delivered Fast.</span>
//           </h1>
//           <p className="pgc-desc">
//             Business cards, banners, flyers, ID cards & more. Upload your design or use our free templates — printed and shipped in 24–48 hrs.
//           </p>
//           <div className="pgc-ctas">
//             <Link to="/products"><button className="pg-cta-red">Shop Products <ArrowRight size={14} /></button></Link>
//             <Link to="/products"><button className="pg-cta-outline-dark">Browse Templates</button></Link>
//           </div>
//           <div className="pgc-trust-row">
//             <div className="pgc-trust-item"><BadgeCheck size={13} /> Quality Guaranteed</div>
//             <div className="pgc-trust-item"><Truck size={13} /> Pan India</div>
//             <div className="pgc-trust-item"><Clock size={13} /> 24-hr Turnaround</div>
//           </div>
//           {/* Counter */}
//           <div className="pgc-badge">
//             <span className="pgc-badge-val">3,200+</span>
//             <span className="pgc-badge-label">orders this month</span>
//           </div>
//         </div>

//         {/* Image panel — 8 cols */}
//         <div className="pgc-img-panel pgc-fallback-img-panel">
//           <div className="pgc-img-overlay" />
//           <div className="pgc-fallback-pattern" />
//         </div>
//       </div>
//     );
//   }

//   const d = discounts[current];

//   return (
//     <div className="pgc-root">
//       {/* ── LEFT: Text panel (4 cols) ── */}
//       <div className={`pgc-panel${animating ? " pgc-panel--out" : " pgc-panel--in"}`}>
//         <div className="pgc-discount-pill">{d.discount} OFF</div>
//         <h2 className="pgc-title">{d.title}</h2>
//         <p className="pgc-desc">{d.description}</p>

//         <div className="pgc-ctas">
//           <button
//             className="pg-cta-red"
//             onClick={() => navigate(`/product/${d.product_id}`)}
//           >
//             {d.cta_text} <ArrowRight size={14} />
//           </button>
//           <Link to="/products">
//             <button className="pg-cta-outline-dark">All Products</button>
//           </Link>
//         </div>

//         <div className="pgc-trust-row">
//           <div className="pgc-trust-item"><BadgeCheck size={13} /> Quality</div>
//           <div className="pgc-trust-item"><Truck size={13} /> Pan India</div>
//           <div className="pgc-trust-item"><Clock size={13} /> 24-hr</div>
//         </div>

//         {/* Slide navigation — bottom of panel */}
//         {discounts.length > 1 && (
//           <div className="pgc-nav">
//             <button className="pgc-arrow" onClick={goPrev} aria-label="Previous">
//               <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
//             </button>
//             <div className="pgc-dots">
//               {discounts.map((_, i) => (
//                 <button
//                   key={i}
//                   className={`pgc-dot${i === current ? " active" : ""}`}
//                   onClick={() => goTo(i)}
//                   aria-label={`Slide ${i + 1}`}
//                 />
//               ))}
//             </div>
//             <button className="pgc-arrow" onClick={goNext} aria-label="Next">
//               <ChevronRight size={16} />
//             </button>
//             <span className="pgc-counter">
//               <b>{String(current + 1).padStart(2, "0")}</b>
//               <span> / {String(discounts.length).padStart(2, "0")}</span>
//             </span>
//           </div>
//         )}

//         {/* Stats badge */}
//         <div className="pgc-badge">
//           <span className="pgc-badge-val">3,200+</span>
//           <span className="pgc-badge-label">orders this month ✓</span>
//         </div>
//       </div>

//       {/* ── RIGHT: Image panel (8 cols) ── */}
//       <div className="pgc-img-panel">
//         <div
//           className={`pgc-img-wrap${animating ? " pgc-img--out" : " pgc-img--in"}`}
//         >
//           <img
//             src={`${BASE}/${d.banner_image_url}`}
//             alt={d.title}
//             className="pgc-img"
//             onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
//           />
//         </div>
//         {/* Subtle left-edge blend into white panel */}
//         <div className="pgc-img-fade-left" />

//         {/* Progress bar along bottom of image panel */}
//         {discounts.length > 1 && (
//           <div className="pgc-progress-bar">
//             <div key={current} className="pgc-progress-fill" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function HomePage() {
//   const navigate = useNavigate();
//   const { filteredProducts, loading } = useProducts();
//   const withImg = filteredProducts.filter((p: any) => getValidImage(p) !== null);
//   const featured = withImg.slice(0, 8);
//   const newArrivals = withImg.slice(0, 4);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//         .pg {
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           background: #f4f4f4;
//           color: #1c1c1c;
//           overflow-x: hidden;
//         }

//         /* ── PROMO BAR ── */
//         .pg-promo-bar {
//           background: #1c1c1c;
//           color: #fff;
//           font-size: 12.5px;
//           font-weight: 500;
//           text-align: center;
//           padding: 10px 16px;
//           letter-spacing: .01em;
//         }
//         .pg-promo-bar a { color: #fbbf24; text-decoration: underline; cursor: pointer; }

//         /* ── NAV ── */
//         .pg-nav {
//           background: #fff;
//           border-bottom: 1px solid #e8e8e8;
//           position: sticky;
//           top: 0;
//           z-index: 100;
//         }
//         .pg-nav-top {
//           max-width: 1280px;
//           margin: 0 auto;
//           padding: 0 24px;
//           height: 64px;
//           display: flex;
//           align-items: center;
//           gap: 24px;
//         }
//         .pg-logo {
//           font-size: 22px;
//           font-weight: 800;
//           color: #c0392b;
//           text-decoration: none;
//           white-space: nowrap;
//           letter-spacing: -0.5px;
//         }
//         .pg-search {
//           flex: 1;
//           max-width: 560px;
//           display: flex;
//           align-items: center;
//           background: #f5f5f5;
//           border: 1.5px solid #e5e5e5;
//           border-radius: 8px;
//           padding: 0 14px;
//           gap: 8px;
//           height: 42px;
//           transition: border-color .15s;
//         }
//         .pg-search:focus-within { border-color: #c0392b; background: #fff; }
//         .pg-search input {
//           border: none;
//           background: transparent;
//           outline: none;
//           font-size: 14px;
//           font-family: inherit;
//           width: 100%;
//           color: #1c1c1c;
//         }
//         .pg-search input::placeholder { color: #aaa; }
//         .pg-search svg { color: #aaa; flex-shrink: 0; }
//         .pg-nav-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
//         .pg-nav-btn {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           padding: 8px 12px;
//           border-radius: 7px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #444;
//           cursor: pointer;
//           background: transparent;
//           border: none;
//           transition: background .15s;
//           text-decoration: none;
//           white-space: nowrap;
//         }
//         .pg-nav-btn:hover { background: #f5f5f5; }
//         .pg-nav-btn.primary {
//           background: #c0392b;
//           color: #fff;
//           padding: 8px 18px;
//         }
//         .pg-nav-btn.primary:hover { background: #a93226; }

//         .pg-nav-cats {
//           border-top: 1px solid #f0f0f0;
//           background: #fff;
//         }
//         .pg-nav-cats-inner {
//           max-width: 1280px;
//           margin: 0 auto;
//           padding: 0 24px;
//           display: flex;
//           gap: 0;
//           overflow-x: auto;
//           scrollbar-width: none;
//         }
//         .pg-nav-cats-inner::-webkit-scrollbar { display: none; }
//         .pg-nav-cat {
//           padding: 10px 16px;
//           font-size: 13px;
//           font-weight: 600;
//           color: #444;
//           white-space: nowrap;
//           cursor: pointer;
//           border-bottom: 2px solid transparent;
//           transition: color .15s, border-color .15s;
//           text-decoration: none;
//         }
//         .pg-nav-cat:hover, .pg-nav-cat.active { color: #c0392b; border-bottom-color: #c0392b; }

//         /* ── CONTENT WRAP ── */
//         .pg-wrap { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

//         /* ══════════════════════════════════════════
//            HERO CAROUSEL — Full-width text overlay
//         ══════════════════════════════════════════ */
//         .pg-hero-carousel {
//           position: relative;
//           width: 100%;
//           height: 520px;
//           overflow: hidden;
//           background: #1c1c1c;
//           margin-bottom: 16px;
//         }
//         @media(max-width: 768px) {
//           .pg-hero-carousel { height: 420px; }
//         }
//         @media(max-width: 480px) {
//           .pg-hero-carousel { height: 360px; }
//         }

//         /* Background image layer */
//         .pg-carousel-bg {
//           position: absolute;
//           inset: 0;
//           z-index: 0;
//         }
//         .pg-carousel-bg-img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           object-position: center top;
//           display: block;
//         }
//         .pg-carousel-bg--in {
//           opacity: 1;
//           transition: opacity .5s ease;
//         }
//         .pg-carousel-bg--out {
//           opacity: 0;
//           transition: opacity .4s ease;
//         }

//         /* Gradient overlay for text readability */
//         .pg-carousel-overlay {
//           position: absolute;
//           inset: 0;
//           z-index: 1;
//           background:
//             linear-gradient(
//               to right,
//               rgba(5,5,5,0.96) 0%,
//               rgba(5,5,5,0.90) 35%,
//               rgba(5,5,5,0.55) 60%,
//               rgba(5,5,5,0.10) 100%
//             );
//         }

//         /* Text content overlay */
//         .pg-carousel-overlay-content {
//           position: absolute;
//           inset: 0;
//           z-index: 2;
//           display: flex;
//           flex-direction: column;
//           justify-content: center;
//           padding: 48px 64px;
//           max-width: 600px;
//         }
//         @media(max-width: 768px) {
//           .pg-carousel-overlay-content { padding: 32px 24px; max-width: 100%; }
//         }

//         .pg-carousel-content--in {
//           opacity: 1;
//           transform: translateY(0);
//           transition: opacity .45s ease .1s, transform .45s ease .1s;
//         }
//         .pg-carousel-content--out {
//           opacity: 0;
//           transform: translateY(14px);
//           transition: opacity .3s ease, transform .3s ease;
//         }

//         .pg-carousel-discount-pill {
//           display: inline-flex;
//           align-items: center;
//           background: #c0392b;
//           color: #fff;
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: .12em;
//           text-transform: uppercase;
//           padding: 5px 14px;
//           border-radius: 20px;
//           width: fit-content;
//           margin-bottom: 18px;
//         }

//         .pg-carousel-hero-title {
//           font-size: clamp(1.7rem, 3.5vw, 2.6rem);
//           font-weight: 800;
//           color: #fff;
//           line-height: 1.12;
//           letter-spacing: -0.03em;
//           margin-bottom: 12px;
//           text-shadow: 0 2px 24px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,1);
//         }

//         .pg-carousel-hero-desc {
//           font-size: 14px;
//           color: rgba(255,255,255,.92);
//           line-height: 1.68;
//           margin-bottom: 26px;
//           max-width: 420px;
//           text-shadow: 0 1px 8px rgba(0,0,0,0.8);
//         }
//         @media(max-width: 480px) {
//           .pg-carousel-hero-desc { font-size: 13px; }
//         }

//         .pg-carousel-hero-ctas {
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           margin-bottom: 28px;
//         }

//         /* Fallback hero */
//         .pg-hero-fallback { background: linear-gradient(120deg, #111 0%, #1c1c1c 100%); }
//         .pg-hero-fallback-overlay {
//           position: absolute; inset: 0; z-index: 1;
//           background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(192,57,43,.2) 0%, transparent 60%);
//         }

//         .pg-hero-kicker {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: .1em;
//           text-transform: uppercase;
//           color: #fbbf24;
//           margin-bottom: 16px;
//           position: relative;
//           z-index: 2;
//         }
//         .pg-hero-kicker::before {
//           content: '';
//           width: 28px; height: 2px;
//           background: #fbbf24;
//           display: block;
//         }

//         .pg-hero-h1 {
//           font-size: clamp(2rem, 4vw, 3.2rem);
//           font-weight: 800;
//           line-height: 1.1;
//           letter-spacing: -0.025em;
//           color: #fff;
//           margin-bottom: 16px;
//           text-shadow: 0 2px 12px rgba(0,0,0,.3);
//           position: relative; z-index: 2;
//         }
//         .pg-hero-h1 span { color: #c0392b; }

//         .pg-hero-sub {
//           font-size: 15px;
//           color: rgba(255,255,255,.65);
//           line-height: 1.7;
//           max-width: 440px;
//           margin-bottom: 28px;
//           position: relative; z-index: 2;
//         }

//         .pg-hero-ctas { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; position: relative; z-index: 2; }

//         /* CTAs */
//         .pg-cta-red {
//           display: inline-flex; align-items: center; gap: 8px;
//           background: #c0392b; color: #fff;
//           font-size: 14px; font-weight: 700;
//           padding: 13px 26px; border-radius: 8px;
//           border: none; cursor: pointer; text-decoration: none;
//           transition: background .15s, transform .15s;
//           font-family: inherit;
//         }
//         .pg-cta-red:hover { background: #a93226; transform: translateY(-1px); }

//         .pg-cta-outline-light {
//           display: inline-flex; align-items: center; gap: 8px;
//           background: rgba(255,255,255,.12); color: #fff;
//           font-size: 14px; font-weight: 600;
//           padding: 13px 24px; border-radius: 8px;
//           border: 1.5px solid rgba(255,255,255,.3); cursor: pointer; text-decoration: none;
//           transition: background .15s, border-color .15s;
//           font-family: inherit; backdrop-filter: blur(4px);
//         }
//         .pg-cta-outline-light:hover { background: rgba(255,255,255,.2); border-color: rgba(255,255,255,.5); }

//         /* Trust row */
//         .pg-hero-trust {
//           display: flex; gap: 16px; flex-wrap: wrap;
//           position: relative; z-index: 2;
//         }
//         .pg-trust-item {
//           display: flex; align-items: center; gap: 6px;
//           font-size: 12px; font-weight: 600; color: #555;
//         }
//         .pg-trust-item svg { color: #c0392b; }
//         .pg-trust-light { color: rgba(255,255,255,.55) !important; }
//         .pg-trust-light svg { color: rgba(255,255,255,.5) !important; }

//         /* Stats badge — bottom right corner */
//         .pg-hero-stat-badge {
//           position: absolute;
//           bottom: 24px;
//           right: 28px;
//           z-index: 3;
//           background: rgba(255,255,255,.96);
//           border: 1px solid rgba(0,0,0,.07);
//           border-radius: 10px;
//           padding: 12px 18px;
//           box-shadow: 0 6px 24px rgba(0,0,0,.2);
//           text-align: center;
//         }
//         @media(max-width: 480px) { .pg-hero-stat-badge { display: none; } }
//         .pg-hero-badge-top { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 2px; }
//         .pg-hero-badge-val { font-size: 20px; font-weight: 800; color: #111; }
//         .pg-hero-badge-sub { font-size: 11px; color: #c0392b; font-weight: 600; }

//         /* Slide counter */
//         .pg-carousel-counter {
//           position: absolute;
//           top: 24px;
//           right: 28px;
//           z-index: 3;
//           font-size: 13px;
//           font-weight: 700;
//           color: rgba(255,255,255,.5);
//         }
//         .pg-carousel-counter-cur {
//           font-size: 22px;
//           font-weight: 800;
//           color: #fff;
//           line-height: 1;
//         }

//         /* Arrow controls */
//         .pg-carousel-arrow {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 42px;
//           height: 42px;
//           border-radius: 50%;
//           background: rgba(255,255,255,.15);
//           border: 1.5px solid rgba(255,255,255,.3);
//           backdrop-filter: blur(6px);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 4;
//           transition: background .15s, transform .15s;
//           color: #fff;
//         }
//         .pg-carousel-arrow:hover {
//           background: rgba(255,255,255,.28);
//           transform: translateY(-50%) scale(1.08);
//         }
//         .pg-carousel-arrow--prev { left: 20px; }
//         .pg-carousel-arrow--next { right: 20px; }
//         @media(max-width: 480px) {
//           .pg-carousel-arrow { width: 34px; height: 34px; }
//           .pg-carousel-arrow--prev { left: 10px; }
//           .pg-carousel-arrow--next { right: 10px; }
//         }

//         /* Dot indicators */
//         .pg-carousel-dots {
//           position: absolute;
//           bottom: 20px;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 7px;
//           z-index: 4;
//         }
//         .pg-carousel-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: rgba(255,255,255,.35);
//           border: none;
//           cursor: pointer;
//           transition: background .2s, width .25s;
//           padding: 0;
//         }
//         .pg-carousel-dot.active {
//           background: #fff;
//           width: 24px;
//           border-radius: 4px;
//         }

//         /* Progress bar */
//         .pg-carousel-progress-bar {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           width: 100%;
//           height: 3px;
//           background: rgba(255,255,255,.15);
//           z-index: 4;
//         }
//         .pg-carousel-progress-fill {
//           height: 100%;
//           background: #c0392b;
//           animation: pg-progress 5s linear forwards;
//         }
//         @keyframes pg-progress {
//           from { width: 0%; }
//           to   { width: 100%; }
//         }

//         /* Skeleton */
//         .pg-carousel-skeleton {
//           background: #2a2a2a;
//         }
//         .pg-carousel-skeleton-inner {
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%);
//           background-size: 200% 100%;
//           animation: pg-shimmer 1.4s infinite;
//         }
//         @keyframes pg-shimmer {
//           0%   { background-position: 200% 0; }
//           100% { background-position: -200% 0; }
//         }

//         /* ── SERVICE BAND ── */
//         .pg-band {
//           background: #fff;
//           border-top: 1px solid #eee;
//           border-bottom: 1px solid #eee;
//           margin-bottom: 16px;
//         }
//         .pg-band-inner {
//           max-width: 1280px; margin: 0 auto; padding: 0 24px;
//           display: grid; grid-template-columns: repeat(4,1fr);
//         }
//         @media(max-width:700px){ .pg-band-inner{ grid-template-columns:repeat(2,1fr); } }
//         .pg-band-item {
//           display: flex; align-items: center; gap: 12px;
//           padding: 16px 20px;
//           border-right: 1px solid #f0f0f0;
//         }
//         .pg-band-item:last-child { border-right: none; }
//         .pg-band-icon {
//           width: 38px; height: 38px; border-radius: 9px;
//           background: #fff5f5; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .pg-band-icon svg { color: #c0392b; }
//         .pg-band-title { font-size: 13px; font-weight: 700; color: #111; }
//         .pg-band-sub { font-size: 11.5px; color: #888; margin-top: 1px; }

//         /* ── SECTION HEADERS ── */
//         .pg-sh {
//           display: flex; align-items: center; justify-content: space-between;
//           margin-bottom: 16px;
//         }
//         .pg-sh-left { display: flex; align-items: center; gap: 10px; }
//         .pg-sh-bar { width: 4px; height: 22px; background: #c0392b; border-radius: 2px; }
//         .pg-sh-title { font-size: 20px; font-weight: 800; color: #111; letter-spacing: -0.02em; }
//         .pg-sh-sub { font-size: 13px; color: #888; margin-top: 2px; }
//         .pg-sh-link {
//           display: inline-flex; align-items: center; gap: 4px;
//           font-size: 13px; font-weight: 600; color: #c0392b;
//           text-decoration: none; border: 1px solid #fcc; padding: 6px 12px; border-radius: 6px;
//           transition: background .15s;
//         }
//         .pg-sh-link:hover { background: #fff5f5; }

//         /* ── CATEGORIES ── */
//         .pg-cats {
//           display: grid;
//           grid-template-columns: repeat(8, 1fr);
//           gap: 10px;
//           margin-bottom: 16px;
//         }
//         @media(max-width:900px){ .pg-cats{ grid-template-columns:repeat(4,1fr); } }
//         @media(max-width:480px){ .pg-cats{ grid-template-columns:repeat(4,1fr); } }

//         .pg-cat {
//           background: #fff;
//           border-radius: 10px;
//           padding: 18px 8px 14px;
//           display: flex; flex-direction: column; align-items: center; gap: 9px;
//           cursor: pointer;
//           border: 1.5px solid transparent;
//           text-decoration: none;
//           transition: border-color .15s, box-shadow .15s, transform .15s;
//         }
//         .pg-cat:hover {
//           border-color: #c0392b;
//           box-shadow: 0 4px 16px rgba(192,57,43,.1);
//           transform: translateY(-2px);
//         }
//         .pg-cat-emoji { font-size: 26px; line-height: 1; }
//         .pg-cat-label { font-size: 11px; font-weight: 600; color: #333; text-align: center; line-height: 1.3; }

//         /* ── PRODUCT GRID ── */
//         .pg-grid {
//           display: grid;
//           grid-template-columns: repeat(4, 1fr);
//           gap: 12px;
//           margin-bottom: 16px;
//         }
//         @media(max-width:900px){ .pg-grid{ grid-template-columns:repeat(3,1fr); } }
//         @media(max-width:600px){ .pg-grid{ grid-template-columns:repeat(2,1fr); } }

//         .pg-card {
//           background: #fff;
//           border-radius: 10px;
//           overflow: hidden;
//           border: 1px solid #efefef;
//           cursor: pointer;
//           transition: box-shadow .18s, transform .18s;
//           display: flex; flex-direction: column;
//           position: relative;
//         }
//         .pg-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.1); transform: translateY(-3px); }

//         .pg-card-wishlist {
//           position: absolute; top: 10px; right: 10px; z-index: 2;
//           width: 30px; height: 30px; border-radius: 50%;
//           background: rgba(255,255,255,.9); border: 1px solid #e8e8e8;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer; transition: background .15s;
//         }
//         .pg-card-wishlist:hover { background: #fff5f5; }
//         .pg-card-wishlist svg { color: #bbb; }

//         .pg-card-img { overflow: hidden; aspect-ratio: 1/1; background: #f7f7f7; }
//         .pg-card-img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .45s; }
//         .pg-card:hover .pg-card-img img { transform: scale(1.06); }

//         .pg-card-tag {
//           position: absolute; top: 10px; left: 10px;
//           font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px;
//           text-transform: uppercase; letter-spacing: .04em;
//           pointer-events: none;
//         }
//         .pg-card-tag.sale { background: #c0392b; color: #fff; }
//         .pg-card-tag.new  { background: #16a34a; color: #fff; }
//         .pg-card-tag.hot  { background: #ea580c; color: #fff; }
//         .pg-card-tag.best { background: #7c3aed; color: #fff; }

//         .pg-card-body { padding: 13px 14px 15px; flex: 1; display: flex; flex-direction: column; }
//         .pg-card-cat { font-size: 10.5px; font-weight: 600; color: #c0392b; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 4px; }
//         .pg-card-name { font-size: 14px; font-weight: 700; color: #111; line-height: 1.35; margin-bottom: 5px; }
//         .pg-card-desc { font-size: 12px; color: #888; line-height: 1.55; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }

//         .pg-card-stars { display: flex; align-items: center; gap: 3px; margin-bottom: 10px; }
//         .pg-star { font-size: 12px; color: #fbbf24; line-height: 1; }
//         .pg-star.off { color: #e5e5e5; }
//         .pg-card-rc { font-size: 11px; color: #bbb; margin-left: 2px; }

//         .pg-card-foot {
//           display: flex; align-items: center; justify-content: space-between;
//           padding-top: 10px; border-top: 1px solid #f5f5f5;
//         }
//         .pg-price { font-size: 16px; font-weight: 800; color: #c0392b; }
//         .pg-price-orig { font-size: 11.5px; color: #c0c0c0; text-decoration: line-through; margin-left: 4px; font-weight: 500; }
//         .pg-card-order {
//           display: flex; align-items: center; gap: 4px;
//           background: #c0392b; color: #fff;
//           font-size: 12px; font-weight: 700;
//           padding: 7px 13px; border-radius: 6px;
//           border: none; cursor: pointer;
//           transition: background .15s;
//           font-family: inherit;
//         }
//         .pg-card-order:hover { background: #a93226; }

//         /* ── OFFER CARDS ── */
//         .pg-offers {
//           display: grid; grid-template-columns: repeat(3,1fr);
//           gap: 12px; margin-bottom: 16px;
//         }
//         @media(max-width:700px){ .pg-offers{ grid-template-columns:1fr; } }

//         .pg-offer {
//           background: #fff; border-radius: 10px; padding: 20px 22px;
//           display: flex; align-items: flex-start; gap: 14px;
//           border: 1px solid #efefef;
//         }
//         .pg-offer-ico { font-size: 30px; line-height: 1; flex-shrink: 0; margin-top: 2px; }
//         .pg-offer-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 4px; }
//         .pg-offer-desc { font-size: 12.5px; color: #777; line-height: 1.55; }
//         .pg-offer-pill {
//           display: inline-block; margin-top: 6px;
//           font-size: 11px; font-weight: 700; color: #c0392b;
//           background: #fff5f5; padding: 2px 8px; border-radius: 4px;
//         }

//         /* ── HOW IT WORKS ── */
//         .pg-how {
//           background: #fff;
//           border-radius: 12px;
//           padding: 40px 36px;
//           margin-bottom: 16px;
//           border: 1px solid #efefef;
//         }
//         .pg-how-grid {
//           display: grid; grid-template-columns: repeat(4,1fr);
//           gap: 0; margin-top: 28px;
//         }
//         @media(max-width:700px){ .pg-how-grid{ grid-template-columns:repeat(2,1fr); gap:20px; } }
//         .pg-how-step { padding: 0 24px; border-right: 1px solid #f0f0f0; text-align: center; }
//         .pg-how-step:last-child { border-right: none; }
//         @media(max-width:700px){ .pg-how-step{ border-right:none; padding:0; } }
//         .pg-how-num {
//           width: 42px; height: 42px; border-radius: 50%;
//           background: #fff5f5; border: 2px solid #fcc;
//           color: #c0392b; font-size: 15px; font-weight: 800;
//           display: flex; align-items: center; justify-content: center;
//           margin: 0 auto 14px;
//         }
//         .pg-how-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
//         .pg-how-desc { font-size: 12.5px; color: #888; line-height: 1.6; }

//         /* ── SPLIT BANNERS ── */
//         .pg-split { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
//         @media(max-width:600px){ .pg-split{ grid-template-columns:1fr; } }
//         .pg-split-card {
//           border-radius: 12px; padding: 32px 28px; position: relative; overflow: hidden;
//           cursor: pointer; min-height: 150px; display: flex; flex-direction: column; justify-content: flex-end;
//           transition: transform .18s;
//         }
//         .pg-split-card:hover { transform: translateY(-2px); }
//         .pg-split-a { background: linear-gradient(120deg, #111 0%, #222 100%); }
//         .pg-split-b { background: linear-gradient(120deg, #7f1d1d 0%, #c0392b 100%); }
//         .pg-split-deco { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 80px; opacity: .08; pointer-events: none; }
//         .pg-split-ey { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.45); margin-bottom: 6px; }
//         .pg-split-title { font-size: 1.3rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 12px; }
//         .pg-split-link {
//           display: inline-flex; align-items: center; gap: 5px;
//           font-size: 13px; font-weight: 600; color: #fff;
//           text-decoration: none; width: fit-content;
//           border-bottom: 1px solid rgba(255,255,255,.3); padding-bottom: 1px;
//         }

//         /* ── TESTIMONIALS ── */
//         .pg-testi {
//           display: grid; grid-template-columns: repeat(3,1fr);
//           gap: 12px; margin-bottom: 16px;
//         }
//         @media(max-width:700px){ .pg-testi{ grid-template-columns:1fr; } }
//         .pg-testi-card {
//           background: #fff; border-radius: 10px; padding: 22px 22px 20px;
//           border: 1px solid #efefef;
//         }
//         .pg-testi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
//         .pg-testi-stars { display: flex; gap: 2px; }
//         .pg-testi-verified { font-size: 10px; color: #16a34a; font-weight: 600; display: flex; align-items: center; gap: 3px; }
//         .pg-testi-text { font-size: 13.5px; color: #444; line-height: 1.7; margin-bottom: 16px; }
//         .pg-testi-name { font-size: 13px; font-weight: 700; color: #111; }
//         .pg-testi-role { font-size: 11px; color: #aaa; margin-top: 1px; }

//         /* ── NEWSLETTER ── */
//         .pg-nl {
//           background: #1c1c1c;
//           border-radius: 12px;
//           padding: 48px 40px;
//           margin-bottom: 16px;
//           display: grid; grid-template-columns: 1fr auto;
//           gap: 40px; align-items: center;
//           position: relative; overflow: hidden;
//         }
//         @media(max-width:700px){ .pg-nl{ grid-template-columns:1fr; padding:36px 28px; } }
//         .pg-nl::before {
//           content: ''; position: absolute; inset: 0;
//           background: radial-gradient(ellipse 55% 80% at 10% 50%, rgba(192,57,43,.25) 0%, transparent 60%);
//           pointer-events: none;
//         }
//         .pg-nl-title { font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 6px; position: relative; z-index: 1; }
//         .pg-nl-sub { font-size: 14px; color: rgba(255,255,255,.45); position: relative; z-index: 1; }
//         .pg-nl-form { display: flex; gap: 8px; position: relative; z-index: 1; }
//         .pg-nl-input {
//           padding: 13px 16px; border-radius: 8px; border: 1.5px solid rgba(255,255,255,.12);
//           background: rgba(255,255,255,.07); color: #fff; font-size: 14px;
//           font-family: inherit; outline: none; width: 260px;
//           transition: border-color .15s;
//         }
//         .pg-nl-input::placeholder { color: rgba(255,255,255,.3); }
//         .pg-nl-input:focus { border-color: rgba(255,255,255,.3); }
//         .pg-nl-btn {
//           padding: 13px 22px; border-radius: 8px;
//           background: #c0392b; color: #fff; font-size: 14px; font-weight: 700;
//           border: none; cursor: pointer; white-space: nowrap;
//           transition: background .15s;
//           font-family: inherit;
//         }
//         .pg-nl-btn:hover { background: #a93226; }

//         /* ── FOOTER ── */
//         .pg-footer { background: #fff; border-top: 1px solid #efefef; margin-top: 16px; }
//         .pg-footer-main {
//           max-width: 1280px; margin: 0 auto; padding: 40px 24px 32px;
//           display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
//         }
//         @media(max-width:900px){ .pg-footer-main{ grid-template-columns:1fr 1fr; } }
//         @media(max-width:500px){ .pg-footer-main{ grid-template-columns:1fr; } }

//         .pg-foot-logo { font-size: 22px; font-weight: 800; color: #c0392b; margin-bottom: 10px; letter-spacing: -0.5px; }
//         .pg-foot-about { font-size: 13px; color: #777; line-height: 1.7; max-width: 230px; margin-bottom: 18px; }
//         .pg-foot-contact { display: flex; flex-direction: column; gap: 8px; }
//         .pg-foot-contact-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #555; }
//         .pg-foot-contact-row svg { color: #c0392b; flex-shrink: 0; }

//         .pg-foot-heading { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #111; margin-bottom: 14px; }
//         .pg-foot-links { display: flex; flex-direction: column; gap: 9px; }
//         .pg-foot-link { font-size: 13px; color: #666; text-decoration: none; transition: color .15s; }
//         .pg-foot-link:hover { color: #c0392b; }

//         .pg-footer-bottom {
//           border-top: 1px solid #f0f0f0;
//           padding: 16px 24px;
//           max-width: 1280px; margin: 0 auto;
//           display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
//         }
//         .pg-footer-bottom-text { font-size: 12px; color: #aaa; }
//         .pg-pay-icons { display: flex; gap: 6px; }
//         .pg-pay-icon {
//           background: #f5f5f5; border: 1px solid #e5e5e5; border-radius: 4px;
//           padding: 3px 8px; font-size: 11px; font-weight: 700; color: #555;
//         }

//         /* ═══════════════════════════════════════════════════
//    BANNER CAROUSEL — 4-col text | 8-col image split
// ═══════════════════════════════════════════════════ */

// /* Outline button for light background */
// .pg-cta-outline-dark {
//   display: inline-flex; align-items: center; gap: 8px;
//   background: transparent; color: #1c1c1c;
//   font-size: 14px; font-weight: 600;
//   padding: 13px 22px; border-radius: 8px;
//   border: 1.5px solid #d0d0d0; cursor: pointer;
//   transition: background .15s, border-color .15s;
//   font-family: inherit;
// }
// .pg-cta-outline-dark:hover { background: #f5f5f5; border-color: #bbb; }

// /* Root: 12-column grid, fixed height */
// .pgc-root {
//   display: grid;
//   grid-template-columns: 4fr 8fr;   /* 4 text : 8 image */
//   height: 500px;
//   background: #fff;
//   overflow: hidden;
//   margin-bottom: 16px;
//   border-bottom: 1px solid #efefef;
// }
// @media (max-width: 900px) {
//   .pgc-root { grid-template-columns: 1fr; height: auto; }
// }

// /* ── TEXT PANEL ── */
// .pgc-panel {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   padding: 44px 40px 40px 40px;
//   background: #fff;
//   position: relative;
//   z-index: 2;
// }
// @media (max-width: 900px) {
//   .pgc-panel { padding: 36px 24px 28px; order: 2; }
// }

// .pgc-panel--in {
//   opacity: 1;
//   transform: translateX(0);
//   transition: opacity .42s ease .08s, transform .42s ease .08s;
// }
// .pgc-panel--out {
//   opacity: 0;
//   transform: translateX(-12px);
//   transition: opacity .28s ease, transform .28s ease;
// }

// .pgc-eyebrow {
//   font-size: 11px; font-weight: 700; letter-spacing: .12em;
//   text-transform: uppercase; color: #c0392b;
//   margin-bottom: 14px;
//   display: flex; align-items: center; gap: 8px;
// }
// .pgc-eyebrow::before {
//   content: ''; width: 22px; height: 2px; background: #c0392b; display: block;
// }

// .pgc-discount-pill {
//   display: inline-flex; align-items: center;
//   background: #fef2f2; color: #c0392b;
//   border: 1px solid #fcc; border-radius: 20px;
//   font-size: 11px; font-weight: 800; letter-spacing: .1em;
//   text-transform: uppercase; padding: 5px 14px;
//   width: fit-content; margin-bottom: 16px;
// }

// .pgc-h1 {
//   font-size: clamp(1.9rem, 3vw, 2.8rem);
//   font-weight: 800; line-height: 1.08;
//   letter-spacing: -0.03em; color: #111;
//   margin-bottom: 14px;
// }
// .pgc-h1-accent { color: #c0392b; }

// .pgc-title {
//   font-size: clamp(1.5rem, 2.5vw, 2.2rem);
//   font-weight: 800; line-height: 1.1;
//   letter-spacing: -0.03em; color: #111;
//   margin-bottom: 12px;
// }

// .pgc-desc {
//   font-size: 13.5px; color: #666;
//   line-height: 1.7; margin-bottom: 24px;
//   max-width: 340px;
// }
// @media (max-width: 900px) { .pgc-desc { max-width: 100%; } }

// .pgc-ctas {
//   display: flex; gap: 10px; flex-wrap: wrap;
//   margin-bottom: 22px;
// }

// .pgc-trust-row {
//   display: flex; gap: 14px; flex-wrap: wrap;
//   margin-bottom: 20px;
// }
// .pgc-trust-item {
//   display: flex; align-items: center; gap: 5px;
//   font-size: 11.5px; font-weight: 600; color: #888;
// }
// .pgc-trust-item svg { color: #c0392b; }

// /* Navigation controls inside panel */
// .pgc-nav {
//   display: flex; align-items: center; gap: 8px;
//   margin-top: auto; padding-top: 8px;
// }
// .pgc-arrow {
//   width: 32px; height: 32px; border-radius: 50%;
//   background: #f5f5f5; border: 1px solid #e5e5e5;
//   display: flex; align-items: center; justify-content: center;
//   cursor: pointer; color: #555;
//   transition: background .15s, color .15s;
// }
// .pgc-arrow:hover { background: #fef2f2; border-color: #fcc; color: #c0392b; }

// .pgc-dots { display: flex; gap: 5px; }
// .pgc-dot {
//   width: 7px; height: 7px; border-radius: 50%;
//   background: #ddd; border: none; cursor: pointer;
//   transition: background .2s, width .25s;
//   padding: 0;
// }
// .pgc-dot.active { background: #c0392b; width: 20px; border-radius: 4px; }

// .pgc-counter {
//   font-size: 12px; color: #bbb; margin-left: 4px; white-space: nowrap;
// }
// .pgc-counter b { color: #111; font-size: 14px; }

// /* Stats badge */
// .pgc-badge {
//   display: flex; flex-direction: column;
//   margin-top: 20px; padding-top: 16px;
//   border-top: 1px solid #f0f0f0;
// }
// .pgc-badge-val {
//   font-size: 22px; font-weight: 800; color: #111; line-height: 1;
// }
// .pgc-badge-label { font-size: 11.5px; color: #c0392b; font-weight: 600; margin-top: 3px; }

// /* ── IMAGE PANEL ── */
// .pgc-img-panel {
//   position: relative;
//   overflow: hidden;
//   background: #f4f4f4;
// }
// @media (max-width: 900px) {
//   .pgc-img-panel { height: 260px; order: 1; }
// }

// .pgc-img-wrap {
//   position: absolute; inset: 0;
// }
// .pgc-img--in {
//   opacity: 1;
//   transform: scale(1);
//   transition: opacity .5s ease, transform .5s ease;
// }
// .pgc-img--out {
//   opacity: 0;
//   transform: scale(1.03);
//   transition: opacity .3s ease, transform .3s ease;
// }

// .pgc-img {
//   width: 100%; height: 100%;
//   object-fit: cover; object-position: center;
//   display: block;
// }

// /* Left-edge white fade blending into the text panel */
// .pgc-img-fade-left {
//   position: absolute;
//   top: 0; left: 0;
//   width: 80px; height: 100%;
//   background: linear-gradient(to right, #fff 0%, transparent 100%);
//   z-index: 1;
//   pointer-events: none;
// }
// @media (max-width: 900px) {
//   .pgc-img-fade-left { display: none; }
// }

// /* Progress bar at bottom of image panel */
// .pgc-progress-bar {
//   position: absolute; bottom: 0; left: 0;
//   width: 100%; height: 3px;
//   background: rgba(0,0,0,.08); z-index: 2;
// }
// .pgc-progress-fill {
//   height: 100%; background: #c0392b;
//   animation: pgc-progress 5.5s linear forwards;
// }
// @keyframes pgc-progress {
//   from { width: 0%; } to { width: 100%; }
// }

// /* Fallback */
// .pgc-fallback-img-panel {
//   background: linear-gradient(135deg, #f7f7f7 0%, #efefef 100%);
// }
// .pgc-fallback-pattern {
//   position: absolute; inset: 0;
//   background-image: radial-gradient(circle, #e0e0e0 1px, transparent 1px);
//   background-size: 28px 28px;
//   opacity: .5;
// }
// .pgc-img-overlay {
//   position: absolute; inset: 0; z-index: 1;
//   background: linear-gradient(to right, #fff 0%, transparent 30%);
// }

// /* Skeleton */
// .pgc-skeleton { background: #f5f5f5; }
// .pgc-skeleton-panel {
//   background: linear-gradient(90deg, #ebebeb 25%, #f5f5f5 50%, #ebebeb 75%);
//   background-size: 200% 100%;
//   animation: pgc-shimmer 1.4s infinite;
// }
// .pgc-skeleton-img {
//   background: linear-gradient(90deg, #e0e0e0 25%, #ebebeb 50%, #e0e0e0 75%);
//   background-size: 200% 100%;
//   animation: pgc-shimmer 1.4s infinite .2s;
// }
// @keyframes pgc-shimmer {
//   0%   { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }
//       `}</style>

//       <div className="pg">

//         {/* ── PROMO BAR ── */}
//         <div className="pg-promo-bar">
//           🎉 Get <strong>20% OFF</strong> your first order — Use code <strong>FIRST20</strong> &nbsp;·&nbsp;
//           <a>Free shipping</a> on orders above ₹999
//         </div>

//         {/* ── NAV ── */}
//         <nav className="pg-nav">
//           <div className="pg-nav-top">
//             <Link to="/" className="pg-logo">Citizen Prints</Link>
//             <div className="pg-search">
//               <Search size={15} />
//               <input type="text" placeholder="Search for business cards, banners, flyers…" />
//             </div>
//             <div className="pg-nav-actions">
//               <a className="pg-nav-btn"><User size={16} /> Account</a>
//               <a className="pg-nav-btn"><Heart size={16} /></a>
//               <a className="pg-nav-btn"><ShoppingCart size={16} /> Cart</a>
//               <Link to="/products" className="pg-nav-btn primary">Order Now</Link>
//             </div>
//           </div>
//           <div className="pg-nav-cats">
//             <div className="pg-nav-cats-inner">
//               {["All Products", "Business Cards", "Banners & Signage", "Flyers & Brochures",
//                 "Stickers & Labels", "ID Cards", "Posters", "Wedding Cards", "Packaging", "Bulk Orders"].map((c, i) => (
//                   <Link to="/products" key={c} className={`pg-nav-cat${i === 0 ? " active" : ""}`}>{c}</Link>
//                 ))}
//             </div>
//           </div>
//         </nav>

//         {/* ── HERO: BANNER CAROUSEL (full-width text-overlay) ── */}
//         <BannerCarousel />

//         {/* ── SERVICE BAND ── */}
//         <div className="pg-band">
//           <div className="pg-band-inner">
//             {[
//               { icon: <Truck size={18} />, title: "Free Delivery", sub: "On orders above ₹999" },
//               { icon: <ShieldCheck size={18} />, title: "100% Quality", sub: "Satisfaction guaranteed" },
//               { icon: <Zap size={18} />, title: "Express Printing", sub: "Ready in 24 hours" },
//               { icon: <Headphones size={18} />, title: "Expert Support", sub: "Mon–Sat, 9am–6pm" },
//             ].map(s => (
//               <div className="pg-band-item" key={s.title}>
//                 <div className="pg-band-icon">{s.icon}</div>
//                 <div>
//                   <div className="pg-band-title">{s.title}</div>
//                   <div className="pg-band-sub">{s.sub}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="pg-wrap">

//           {/* ── CATEGORIES ── */}
//           <div style={{ marginBottom: 16 }}>
//             <div className="pg-sh">
//               <div className="pg-sh-left">
//                 <div className="pg-sh-bar" />
//                 <div>
//                   <div className="pg-sh-title">Shop by Category</div>
//                 </div>
//               </div>
//               <Link to="/products" className="pg-sh-link">View All <ChevronRight size={13} /></Link>
//             </div>
//             <div className="pg-cats">
//               {[
//                 { label: "Business Cards", emoji: "🪪" },
//                 { label: "Banners", emoji: "🎌" },
//                 { label: "Brochures", emoji: "📄" },
//                 { label: "Flyers", emoji: "📋" },
//                 { label: "ID Cards", emoji: "💳" },
//                 { label: "Stickers", emoji: "🏷️" },
//                 { label: "Posters", emoji: "🖼️" },
//                 { label: "Wedding Cards", emoji: "💌" },
//               ].map(c => (
//                 <Link to="/products" key={c.label} className="pg-cat">
//                   <span className="pg-cat-emoji">{c.emoji}</span>
//                   <span className="pg-cat-label">{c.label}</span>
//                 </Link>
//               ))}
//             </div>
//           </div>

//           {/* ── FEATURED PRODUCTS ── */}
//           <div style={{ marginBottom: 16 }}>
//             <div className="pg-sh">
//               <div className="pg-sh-left">
//                 <div className="pg-sh-bar" />
//                 <div>
//                   <div className="pg-sh-title">🔥 Best Sellers</div>
//                   <div className="pg-sh-sub">Top-ordered products this month</div>
//                 </div>
//               </div>
//               <Link to="/products" className="pg-sh-link">View All <ChevronRight size={13} /></Link>
//             </div>
//             {loading ? (
//               <div style={{ background: "#fff", borderRadius: 10, padding: 48, textAlign: "center", color: "#bbb" }}>Loading…</div>
//             ) : featured.length === 0 ? (
//               <div style={{ background: "#fff", borderRadius: 10, padding: 48, textAlign: "center", color: "#bbb" }}>No products found</div>
//             ) : (
//               <div className="pg-grid">
//                 {featured.map((p: any, i: number) => {
//                   const img = getValidImage(p)!;
//                   const tags = ["best", "sale", "hot", "new", "best", "sale", "hot", "new"];
//                   const tagLabels: Record<string, string> = { best: "BESTSELLER", sale: "SALE", hot: "HOT", new: "NEW" };
//                   const ratings = [5, 5, 4, 5, 5, 4, 5, 4];
//                   const prices = [199, 299, 249, 399, 179, 349, 219, 279];
//                   const orig = [299, 449, 349, 549, 249, 499, 299, 399];
//                   const reviews = [124, 89, 67, 203, 55, 91, 143, 38];
//                   const tag = tags[i % tags.length];
//                   return (
//                     <div key={p.id} className="pg-card" onClick={() => navigate(`/product/${p.id}`)}>
//                       <div className={`pg-card-tag ${tag}`}>{tagLabels[tag]}</div>
//                       <button className="pg-card-wishlist" onClick={e => e.stopPropagation()}>
//                         <Heart size={13} />
//                       </button>
//                       <div className="pg-card-img">
//                         <img src={`${BASE}/${img}`} alt={p.name}
//                           onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }} />
//                       </div>
//                       <div className="pg-card-body">
//                         {p.category_name && <div className="pg-card-cat">{p.category_name}</div>}
//                         <div className="pg-card-name">{p.name}</div>
//                         <div className="pg-card-desc">{p.description}</div>
//                         <div className="pg-card-stars">
//                           {[1, 2, 3, 4, 5].map(s => <span key={s} className={`pg-star${s > ratings[i % ratings.length] ? " off" : ""}`}>★</span>)}
//                           <span className="pg-card-rc">({reviews[i % reviews.length]})</span>
//                         </div>
//                         <div className="pg-card-foot">
//                           <div>
//                             <span className="pg-price">₹{prices[i % prices.length]}</span>
//                             <span className="pg-price-orig">₹{orig[i % orig.length]}</span>
//                           </div>
//                           <button className="pg-card-order" onClick={e => { e.stopPropagation(); navigate(`/product/${p.id}`); }}>
//                             Order <ArrowRight size={11} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* ── SPECIAL OFFERS ── */}
//           <div style={{ marginBottom: 16 }}>
//             <div className="pg-sh">
//               <div className="pg-sh-left">
//                 <div className="pg-sh-bar" />
//                 <div><div className="pg-sh-title">Why Citizen Prints?</div></div>
//               </div>
//             </div>
//             <div className="pg-offers">
//               {[
//                 { ico: "🎯", title: "Bulk Order Savings", desc: "Order 500+ pieces of any product and save up to 40%. Perfect for offices and events.", pill: "Up to 40% OFF" },
//                 { ico: "⚡", title: "Express 24-hr Prints", desc: "Need it fast? Select express printing and get your order ready the next business day.", pill: "Same Day Available" },
//                 { ico: "🎨", title: "Free Design Support", desc: "Our in-house designers help you create print-ready artwork — completely free of charge.", pill: "Worth ₹499 — FREE" },
//               ].map(o => (
//                 <div className="pg-offer" key={o.title}>
//                   <div className="pg-offer-ico">{o.ico}</div>
//                   <div>
//                     <div className="pg-offer-title">{o.title}</div>
//                     <div className="pg-offer-desc">{o.desc}</div>
//                     <div className="pg-offer-pill">{o.pill}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── HOW IT WORKS ── */}
//           <div className="pg-how" style={{ marginBottom: 16 }}>
//             <div className="pg-sh" style={{ marginBottom: 0 }}>
//               <div className="pg-sh-left">
//                 <div className="pg-sh-bar" />
//                 <div><div className="pg-sh-title">How It Works</div></div>
//               </div>
//             </div>
//             <div className="pg-how-grid">
//               {[
//                 { n: "1", t: "Choose Product", d: "Browse 100+ print products and pick what you need." },
//                 { n: "2", t: "Upload Artwork", d: "Upload your design or customise one of our free templates." },
//                 { n: "3", t: "We Print It", d: "Our machines print with precision on premium materials." },
//                 { n: "4", t: "Fast Delivery", d: "Packed and shipped to your door in 24–48 hours." },
//               ].map(s => (
//                 <div className="pg-how-step" key={s.n}>
//                   <div className="pg-how-num">{s.n}</div>
//                   <div className="pg-how-title">{s.t}</div>
//                   <div className="pg-how-desc">{s.d}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── NEW ARRIVALS ── */}
//           {newArrivals.length > 0 && (
//             <div style={{ marginBottom: 16 }}>
//               <div className="pg-sh">
//                 <div className="pg-sh-left">
//                   <div className="pg-sh-bar" />
//                   <div>
//                     <div className="pg-sh-title">✨ New Arrivals</div>
//                     <div className="pg-sh-sub">Just added to our catalogue</div>
//                   </div>
//                 </div>
//                 <Link to="/products" className="pg-sh-link">View All <ChevronRight size={13} /></Link>
//               </div>
//               <div className="pg-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
//                 {newArrivals.map((p: any, i: number) => {
//                   const img = getValidImage(p)!;
//                   const prices = [149, 249, 199, 349];
//                   return (
//                     <div key={`na-${p.id}`} className="pg-card" onClick={() => navigate(`/product/${p.id}`)}>
//                       <div className="pg-card-tag new">NEW</div>
//                       <div className="pg-card-img">
//                         <img src={`${BASE}/${img}`} alt={p.name}
//                           onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }} />
//                       </div>
//                       <div className="pg-card-body">
//                         {p.category_name && <div className="pg-card-cat">{p.category_name}</div>}
//                         <div className="pg-card-name">{p.name}</div>
//                         <div className="pg-card-foot" style={{ marginTop: "auto" }}>
//                           <span className="pg-price">₹{prices[i % prices.length]}</span>
//                           <button className="pg-card-order" onClick={e => { e.stopPropagation(); navigate(`/product/${p.id}`); }}>
//                             Order <ArrowRight size={11} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* ── SPLIT CTAs ── */}
//           <div className="pg-split">
//             <div className="pg-split-card pg-split-a" onClick={() => navigate("/products")}>
//               <div className="pg-split-deco">📦</div>
//               <div className="pg-split-ey">Bulk Orders Welcome</div>
//               <div className="pg-split-title">Order 1000+ pcs<br />& Save 40%</div>
//               <Link to="/products" className="pg-split-link">Get a Quote <ArrowRight size={13} /></Link>
//             </div>
//             <div className="pg-split-card pg-split-b" onClick={() => navigate("/products")}>
//               <div className="pg-split-deco">🚀</div>
//               <div className="pg-split-ey">Rush Printing Available</div>
//               <div className="pg-split-title">Same-Day<br />Express Printing</div>
//               <Link to="/products" className="pg-split-link">Order Now <ArrowRight size={13} /></Link>
//             </div>
//           </div>

//           {/* ── TESTIMONIALS ── */}
//           <div style={{ marginBottom: 16 }}>
//             <div className="pg-sh">
//               <div className="pg-sh-left">
//                 <div className="pg-sh-bar" />
//                 <div><div className="pg-sh-title">What Customers Say</div></div>
//               </div>
//             </div>
//             <div className="pg-testi">
//               {[
//                 { stars: 5, text: "Ordered 500 business cards for our team. Print quality is outstanding, delivered in 2 days. Will definitely reorder!", name: "Ramesh K.", role: "Operations Manager, Dindigul" },
//                 { stars: 5, text: "Used them for our event banners. Colors were vibrant and sharp. The free design help saved us so much time!", name: "Priya S.", role: "Event Coordinator, Madurai" },
//                 { stars: 4, text: "Great quality flyers at very competitive rates. Express delivery worked perfectly for our last-minute campaign.", name: "Arjun M.", role: "Marketing Head, Coimbatore" },
//               ].map(t => (
//                 <div className="pg-testi-card" key={t.name}>
//                   <div className="pg-testi-top">
//                     <div className="pg-testi-stars">
//                       {[1, 2, 3, 4, 5].map(s => <span key={s} style={{ fontSize: 13, color: s <= t.stars ? "#fbbf24" : "#e5e5e5" }}>★</span>)}
//                     </div>
//                     <div className="pg-testi-verified"><BadgeCheck size={11} /> Verified Purchase</div>
//                   </div>
//                   <div className="pg-testi-text">"{t.text}"</div>
//                   <div className="pg-testi-name">{t.name}</div>
//                   <div className="pg-testi-role">{t.role}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── NEWSLETTER ── */}
//           <div className="pg-nl">
//             <div>
//               <div className="pg-nl-title">Get 20% off your first order</div>
//               <div className="pg-nl-sub">Subscribe for exclusive deals, new product launches & design tips</div>
//             </div>
//             <div className="pg-nl-form">
//               <input className="pg-nl-input" type="email" placeholder="Enter your email address" />
//               <button className="pg-nl-btn">Subscribe</button>
//             </div>
//           </div>

//         </div>

//         {/* ── FOOTER ── */}
//         <div className="pg-footer">
//           <div className="pg-footer-main">
//             <div>
//               <div className="pg-foot-logo">Citizen Prints</div>
//               <div className="pg-foot-about">Your trusted print partner across India. Premium quality, fast delivery, unbeatable prices — since 2015.</div>
//               <div className="pg-foot-contact">
//                 <div className="pg-foot-contact-row"><Phone size={13} /> +91 98765 43210</div>
//                 <div className="pg-foot-contact-row"><Layers size={13} /> hello@citizenprints.in</div>
//               </div>
//             </div>
//             <div>
//               <div className="pg-foot-heading">Products</div>
//               <div className="pg-foot-links">
//                 {["Business Cards", "Brochures", "Banners", "Flyers", "Posters", "ID Cards", "Stickers"].map(l =>
//                   <Link to="/products" key={l} className="pg-foot-link">{l}</Link>)}
//               </div>
//             </div>
//             <div>
//               <div className="pg-foot-heading">Company</div>
//               <div className="pg-foot-links">
//                 {["About Us", "Bulk Orders", "Design Services", "Blog", "Careers", "Affiliates"].map(l =>
//                   <a key={l} href="#" className="pg-foot-link">{l}</a>)}
//               </div>
//             </div>
//             <div>
//               <div className="pg-foot-heading">Support</div>
//               <div className="pg-foot-links">
//                 {["Track Order", "FAQ", "Shipping Info", "Return Policy", "Contact Us", "WhatsApp Chat"].map(l =>
//                   <a key={l} href="#" className="pg-foot-link">{l}</a>)}
//               </div>
//             </div>
//           </div>
//           <div style={{ borderTop: "1px solid #f0f0f0" }}>
//             <div className="pg-footer-bottom" style={{ maxWidth: 1280, margin: "0 auto" }}>
//               <span className="pg-footer-bottom-text">© 2025 Citizen Prints. All rights reserved. Made with ❤️ in Tamil Nadu</span>
//               <div className="pg-pay-icons">
//                 {["UPI", "GPay", "Paytm", "Visa", "MC"].map(p => <span key={p} className="pg-pay-icon">{p}</span>)}
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </>
//   );
// }

// pages/HomePage.tsx
import { ArrowRight, CheckCircle, Link, Printer, Star, Truck } from "lucide-react";
import { useProducts } from "../../hooks/useProduct";
import { BannerCarousel } from "../home/BannerCarousel";
import { CategoryGrid } from "../home/CategoryGrid";
import { FeaturedProducts } from "../home/FeaturedProducts";
import { Footer } from "../home/Footer";
import { HowItWorks } from "../home/HowItWorks";
import { Navbar } from "../home/Navbar";
import { NewArrivals } from "../home/NewArrivals";
import { Newsletter } from "../home/Newsletter";
import { PromoBar } from "../home/PromoBar";
import { ServiceBand } from "../home/ServiceBand";
import { SplitBanners } from "../home/SplitBanners";
import { Testimonials } from "../home/Testimonials";
import { WhyUs } from "../home/WhyUs";
import { Card } from "../ui/card";
import { Button } from "../ui/button";


// ── Helper: extract a valid product image URL ──────────────────────────────
function getValidImage(product: any): string | null {
  let images = product.images;
  if (typeof images === "string") {
    try { images = JSON.parse(images); } catch { return null; }
  }
  if (!Array.isArray(images) || images.length === 0) return null;
  for (const img of images) {
    if (img && typeof img === "object" && typeof img.url === "string" && img.url.startsWith("media/products/"))
      return img.url;
    if (typeof img === "string" && img.startsWith("media/products/"))
      return img;
  }
  return null;
}

export function HomePage() {
  const { filteredProducts, loading } = useProducts();

  return (
    <div className="font-[Plus_Jakarta_Sans,sans-serif] bg-[#f4f4f4] text-[#1c1c1c] overflow-x-hidden">
      {/* ── Top bar ── */}
      {/* <PromoBar /> */}

      {/* ── Navigation ── */}
      {/* <Navbar /> */}

      {/* ── Hero carousel ── */}
      <BannerCarousel />

      {/* ── Trust band ── */}
      <ServiceBand />

      {/* Trust Badges */}
      <section className="max-w-[1440px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <CheckCircle className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">10,000+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Star className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">4.9/5</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Truck className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">24-48hrs</div>
            <div className="text-sm text-gray-600">Delivery Time</div>
          </Card>
          <Card className="bg-white p-6 text-center border-0 shadow-sm">
            <Printer className="w-12 h-12 text-[#1A1A1A] mx-auto mb-3" />
            <div className="text-2xl font-bold text-[#1A1A1A]">50,000+</div>
            <div className="text-sm text-gray-600">Orders Completed</div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1440px] mx-auto px-8">
        <Card className="bg-gradient-to-r from-[#D73D32] to-[#D73D32]/90 text-white p-12 text-center border-0 shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of satisfied customers and experience premium printing quality
          </p>
          <Link to="/products">
            <Button
              size="lg"
              className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white px-8 py-6 text-lg"
            >
              Start Your Order Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}