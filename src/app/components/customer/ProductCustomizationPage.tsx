// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useParams, useNavigate } from "react-router";
// import {
//   Star, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn,
//   Edit3, PackageCheck, Layers, Scissors, Printer, Check,
//   Info, FileText, MessageSquare, Truck, ShieldCheck, RefreshCw,
//   Clock, CheckCheck, AlertCircle, X, Upload, Trash2, Image,
//   ArrowRight, Sparkles, Shield, Zap, ThumbsUp,
// } from "lucide-react";
// import axios from "axios";
// import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
// import { getImageUrl, enrichProductData } from "../../utils/productutils";
// import { API_BASE_URL } from "../../constants/productconstants";
// import ProductReviews from "./ReviewPage";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Size      { id: string; name: string; dimensions?: string }
// interface PaperType { id: string; name: string }
// interface PrintType { id: string; name: string }
// interface CutType   { id: string; name: string }

// interface VariantOption {
//   id: string;
//   variantId: string;
//   size: Size;
//   paperType: PaperType;
//   printType: PrintType;
//   cutType: CutType;
//   sides: number;
//   orientation: string;
//   prices: VariantPrice[];
//   minPrice: number;
//   maxPrice: number;
// }

// interface ApiResponse { status: string; product: Product }

// // ─── Constants ────────────────────────────────────────────────────────────────

// const safeParse = (value: any): any[] => {
//   if (!value) return [];
//   try {
//     const parsed = typeof value === "string" ? JSON.parse(value) : value;
//     return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
//   } catch { return []; }
// };

// const SIDES_OPTIONS = [
//   { label: "Single Sided", value: "1", desc: "Front only"   },
//   { label: "Double Sided", value: "2", desc: "Front & back" },
// ];

// // ─── Relative date helper ─────────────────────────────────────────────────────
// function formatReviewDate(dateStr: string): string {
//   const parsed = new Date(dateStr);
//   const isRealDate = !isNaN(parsed.getTime());

//   if (!isRealDate) return dateStr;

//   const now = new Date();
//   const diffMs = now.getTime() - parsed.getTime();
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

//   if (diffDays === 0) return "Today";
//   if (diffDays === 1) return "Yesterday";
//   if (diffDays <= 7)  return `${diffDays} days ago`;

//   return parsed.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
// }

// const MOCK_REVIEWS = [
//   { id: 1, name: "Ravi Kumar",    initials: "RK", rating: 5, date: new Date(Date.now() - 1 * 86400000).toISOString(),  text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again.", helpful: 14 },
//   { id: 2, name: "Priya Sharma",  initials: "PS", rating: 4, date: new Date(Date.now() - 4 * 86400000).toISOString(),  text: "Good quality cards, delivered on time. Slight delay but overall happy with the result.", helpful: 8 },
//   { id: 3, name: "Arjun Mehta",   initials: "AM", rating: 5, date: new Date(Date.now() - 32 * 86400000).toISOString(), text: "Very professional finish. The Gloss paper option looks premium. Highly recommend.", helpful: 21 },
//   { id: 4, name: "Sneha Nair",    initials: "SN", rating: 3, date: new Date(Date.now() - 60 * 86400000).toISOString(), text: "Decent product but packaging could be better. Cards are good quality though.", helpful: 5 },
//   { id: 5, name: "Karan Verma",   initials: "KV", rating: 5, date: new Date(Date.now() - 2 * 86400000).toISOString(),  text: "Fast turnaround, exactly what I needed for my business launch. Will order in bulk next time.", helpful: 17 },
//   { id: 6, name: "Meena Pillai",  initials: "MP", rating: 4, date: new Date(Date.now() - 90 * 86400000).toISOString(), text: "Great matte finish, very elegant. The rounded corners option is a nice touch.", helpful: 9 },
// ];

// const STEPS = ["Configure", "Upload Design", "Review & Order"];

// // ─── Avatar color map ─────────────────────────────────────────────────────────
// const AVATAR_COLORS = [
//   { bg: "#EEF2FF", text: "#4338CA" },
//   { bg: "#FFF7ED", text: "#C2410C" },
//   { bg: "#F0FDF4", text: "#15803D" },
//   { bg: "#FDF4FF", text: "#9333EA" },
//   { bg: "#FFF1F2", text: "#BE123C" },
//   { bg: "#F0F9FF", text: "#0369A1" },
// ];

// function avatarColor(initials: string) {
//   const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
//   return AVATAR_COLORS[idx];
// }

// // ─── Toast ────────────────────────────────────────────────────────────────────

// interface ToastMsg { id: number; type: "success" | "error" | "info"; text: string }

// function useToast() {
//   const [toasts, setToasts] = useState<ToastMsg[]>([]);
//   const show = useCallback((type: ToastMsg["type"], text: string) => {
//     const id = Date.now();
//     setToasts(t => [...t, { id, type, text }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
//   }, []);
//   const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);
//   return { toasts, show, dismiss };
// }

// function ToastStack({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: number) => void }) {
//   if (!toasts.length) return null;
//   return (
//     <div className="fixed bottom-28 right-5 z-50 flex flex-col gap-2.5 lg:bottom-8">
//       {toasts.map(t => (
//         <div key={t.id}
//           className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-[280px]
//             ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-rose-600" : "bg-neutral-900"}`}
//           style={{ animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
//           {t.type === "success" ? <CheckCheck className="w-4 h-4 shrink-0" />
//            : t.type === "error"  ? <AlertCircle className="w-4 h-4 shrink-0" />
//            :                       <Info className="w-4 h-4 shrink-0" />}
//           <span className="flex-1 text-[13px]">{t.text}</span>
//           <button onClick={() => onDismiss(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
//             <X className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Stars ────────────────────────────────────────────────────────────────────

// function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
//   const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
//   return (
//     <div className="flex gap-0.5">
//       {[...Array(5)].map((_, i) => (
//         <Star key={i} className={`${cls} transition-colors ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200 fill-neutral-200"}`} />
//       ))}
//     </div>
//   );
// }

// // ─── Step Progress ────────────────────────────────────────────────────────────

// function StepProgress({ current }: { current: number }) {
//   return (
//     <div className="flex items-center mb-10">
//       {STEPS.map((step, i) => (
//         <React.Fragment key={step}>
//           <div className="flex items-center gap-2.5 shrink-0">
//             <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
//               ${i < current   ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/30"
//               : i === current ? "bg-white border-2 border-neutral-900 text-neutral-900 shadow-md shadow-neutral-900/10"
//               :                 "bg-white border-2 border-neutral-200 text-neutral-300"}`}>
//               {i < current
//                 ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
//                 : <span className="font-bold">{i + 1}</span>}
//               {i === current && (
//                 <span className="absolute inset-0 rounded-full border-2 border-neutral-900 animate-ping opacity-20" />
//               )}
//             </div>
//             <span className={`text-[11px] font-bold uppercase tracking-widest hidden sm:block transition-colors duration-300
//               ${i === current ? "text-neutral-900" : i < current ? "text-neutral-500" : "text-neutral-300"}`}>
//               {step}
//             </span>
//           </div>
//           {i < STEPS.length - 1 && (
//             <div className="flex-1 h-px mx-4 overflow-hidden rounded-full bg-neutral-100">
//               <div className={`h-full bg-neutral-900 transition-all duration-700 ease-out ${i < current ? "w-full" : "w-0"}`} />
//             </div>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// // ─── Section Label ────────────────────────────────────────────────────────────

// function SectionLabel({ label, hint }: { label: string; hint?: string }) {
//   return (
//     <div className="flex items-center gap-2 mb-3">
//       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">{label}</p>
//       {hint && (
//         <span className="group relative cursor-help">
//           <Info className="w-3 h-3 text-neutral-300 hover:text-neutral-500 transition-colors" />
//           <span className="absolute left-5 -top-1 w-52 text-xs bg-neutral-900 text-white px-3 py-2 rounded-xl
//             opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 shadow-2xl leading-relaxed font-medium">
//             {hint}
//           </span>
//         </span>
//       )}
//     </div>
//   );
// }

// // ─── Option Pill ─────────────────────────────────────────────────────────────

// function OptionPill({
//   active, onClick, children,
// }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none overflow-hidden group
//         ${active
//           ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 scale-[1.02]"
//           : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:scale-[1.01]"}`}>
//       {active && (
//         <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
//       )}
//       {children}
//     </button>
//   );
// }

// // ─── Upload Zone ─────────────────────────────────────────────────────────────

// function UploadZone({
//   label, file, preview, onUpload, onRemove,
// }: {
//   label: string;
//   file: File | null;
//   preview: string | null;
//   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemove: () => void;
// }) {
//   const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
//   return (
//     <div>
//       <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">{label}</p>
//       {!file ? (
//         <label htmlFor={inputId}
//           className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border-2 border-dashed border-neutral-200
//             bg-white cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-300 group">
//           <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
//             <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
//           </div>
//           <div className="text-center">
//             <p className="text-xs text-neutral-500 font-semibold">
//               Drop file or <span className="text-neutral-900 underline underline-offset-2">browse</span>
//             </p>
//             <p className="text-[10px] text-neutral-400 mt-1 font-medium">PNG · JPG · PDF · AI · EPS · Max 50MB</p>
//           </div>
//           <input id={inputId} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.ai,.eps" onChange={onUpload} />
//         </label>
//       ) : (
//         <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white group shadow-sm">
//           {preview ? (
//             <img src={preview} alt={label} className="w-full h-40 object-cover" />
//           ) : (
//             <div className="w-full h-40 flex items-center justify-center bg-neutral-50">
//               <Image className="w-8 h-8 text-neutral-300" />
//             </div>
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-4">
//             <div className="flex items-center gap-2 w-full">
//               <p className="text-xs text-white font-bold flex-1 truncate">{file.name}</p>
//               <button onClick={onRemove}
//                 className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-rose-500 text-white transition-all">
//                 <Trash2 className="w-3.5 h-3.5" />
//               </button>
//             </div>
//           </div>
//           <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
//             ✓ Ready
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Order Summary ────────────────────────────────────────────────────────────

// function OrderSummaryStrip({
//   variant, quantityId, useCustomQty, customQty, totalPrice, frontFile, sides, backFile,
// }: {
//   variant: VariantOption | null;
//   quantityId: string;
//   useCustomQty: boolean;
//   customQty: string;
//   totalPrice: number;
//   frontFile: File | null;
//   sides: string;
//   backFile: File | null;
// }) {
//   if (!variant) return null;
//   const row = variant.prices.find(p => p.id === quantityId);
//   const qty = useCustomQty ? customQty : row ? `${row.min_qty}` : "—";

//   const items = [
//     { label: "Size",   value: variant.size.name       },
//     { label: "Paper",  value: variant.paperType.name  },
//     { label: "Print",  value: variant.printType.name  },
//     { label: "Cut",    value: variant.cutType.name    },
//     { label: "Sides",  value: sides === "1" ? "Single" : "Double" },
//     { label: "Qty",    value: qty !== "—" ? `${qty} pcs` : "—"   },
//   ];

//   return (
//     <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
//       <div className="px-4 pt-4 pb-3 border-b border-neutral-100 bg-black">
//         <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">Order Summary</p>
//       </div>
//       <div className="px-4 py-3">
//         <div className="grid grid-cols-3 gap-0">
//           {items.map(({ label, value }, idx) => (
//             <div key={label} className={`py-2 ${idx % 3 !== 2 ? "border-r border-neutral-100 pr-3 mr-3" : ""}`}>
//               <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{label}</p>
//               <p className="text-[11px] font-bold text-neutral-800 truncate">{value}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="px-4 pb-4 flex items-center justify-between border-t border-neutral-100 pt-3">
//         <div>
//           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Design Files</p>
//           <div className="flex items-center gap-2">
//             {frontFile
//               ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Front</span>
//               : <span className="text-[10px] text-neutral-300 font-semibold">No design</span>}
//             {sides === "2" && (
//               backFile
//                 ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Back</span>
//                 : <span className="text-[10px] text-amber-500 font-bold">Back required</span>
//             )}
//           </div>
//         </div>
//         <div className="text-right">
//           <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Total</p>
//           <p className="text-2xl font-bold text-neutral-900 tracking-tight">
//             {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Review Card ──────────────────────────────────────────────────────────────

// function ReviewCard({ review }: { review: typeof MOCK_REVIEWS[0] }) {
//   const [helpful, setHelpful] = useState(review.helpful);
//   const [voted, setVoted]     = useState(false);
//   const colors = avatarColor(review.initials);

//   return (
//     <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 space-y-4">
//       <div className="flex items-start justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div
//             className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tracking-wider"
//             style={{ background: colors.bg, color: colors.text }}>
//             {review.initials}
//           </div>
//           <div>
//             <p className="text-[13px] font-bold text-neutral-800 leading-none mb-1">{review.name}</p>
//             <p className="text-[10px] text-neutral-400 font-medium">{formatReviewDate(review.date)}</p>
//           </div>
//         </div>
//         <div className="shrink-0 pt-0.5">
//           <Stars rating={review.rating} />
//         </div>
//       </div>
//       <p className="text-[13px] text-neutral-600 leading-relaxed">{review.text}</p>
//       <div className="flex items-center gap-2 pt-1 border-t border-neutral-50">
//         <button
//           onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
//           className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all
//             ${voted
//               ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
//               : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border border-transparent"}`}>
//           <ThumbsUp className="w-3 h-3" />
//           Helpful ({helpful})
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Rating Bar ───────────────────────────────────────────────────────────────

// function RatingBar({ star, pct, count, active, onClick }: {
//   star: number; pct: number; count: number; active: boolean; onClick: () => void;
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2.5 w-full group rounded-lg px-2 py-1 transition-all
//         ${active ? "bg-amber-50" : "hover:bg-neutral-50"}`}>
//       <span className={`text-[11px] font-bold w-4 shrink-0 text-right transition-colors
//         ${active ? "text-amber-600" : "text-neutral-400 group-hover:text-neutral-600"}`}>
//         {star}
//       </span>
//       <Star className={`w-3 h-3 shrink-0 transition-colors
//         ${active ? "text-amber-400 fill-amber-400" : "text-neutral-300 fill-neutral-200"}`} />
//       <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-500
//             ${active ? "bg-amber-400" : "bg-neutral-300"}`}
//           style={{ width: `${pct}%` }}
//         />
//       </div>
//       <span className={`text-[10px] font-semibold w-6 shrink-0 text-right transition-colors
//         ${active ? "text-amber-600" : "text-neutral-400"}`}>
//         {count}
//       </span>
//     </button>
//   );
// }

// // ─── Reviews Section — FIXED ──────────────────────────────────────────────────
// // Key fixes:
// //  1. Full-width container matching specs table (no mis-aligned inner width)
// //  2. Consistent rounded-3xl + border + shadow-sm card shell
// //  3. Left panel (summary + bars) is a proper sticky sidebar on lg screens
// //  4. Right panel scrolls the review cards in a responsive grid
// //  5. Star filter bar properly filters the mock reviews
// //  6. "Load more" pagination instead of showing all at once
// //  7. ProductReviews (API) is rendered if productId is available, otherwise
// //     falls back to MOCK_REVIEWS — no blank/empty state

// function ReviewsSection({ product }: { product: Product }) {
//   const [filter,   setFilter]   = useState<number | null>(null);
//   const [showAll,  setShowAll]  = useState(false);
//   const productId               = product?.id;

//   const avgRating    = Number(product.rating || 4.2);
//   const totalReviews = product.review_count || 90;

//   // Star distribution percentages
//   const STAR_DATA: { star: number; pct: number; count: number }[] = [
//     { star: 5, pct: 68, count: Math.round(totalReviews * 0.68) },
//     { star: 4, pct: 22, count: Math.round(totalReviews * 0.22) },
//     { star: 3, pct:  7, count: Math.round(totalReviews * 0.07) },
//     { star: 2, pct:  2, count: Math.round(totalReviews * 0.02) },
//     { star: 1, pct:  1, count: Math.round(totalReviews * 0.01) },
//   ];

//   const filtered      = filter ? MOCK_REVIEWS.filter(r => r.rating === filter) : MOCK_REVIEWS;
//   const visibleCount  = showAll ? filtered.length : Math.min(4, filtered.length);
//   const visibleReviews = filtered.slice(0, visibleCount);

//   // If we have a real API component, delegate to it entirely
//   if (productId) {
//     return (
//       <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
//         <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
//           <div className="flex items-center gap-2 mb-1">
//             <MessageSquare className="w-4 h-4 text-neutral-400" />
//             <h2 className="product-name text-xl font-normal text-neutral-900">Customer Reviews</h2>
//           </div>
//           <p className="text-xs text-neutral-400 font-medium">
//             Verified purchases from our customers.
//           </p>
//         </div>
//         <div className="p-6 lg:p-8">
//           <ProductReviews PRODUCT_ID={productId} />
//         </div>
//       </div>
//     );
//   }

//   // Fallback: render mock reviews with full summary UI
//   return (
//     <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
//       {/* Header */}
//       <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
//         <div className="flex items-center gap-2 mb-1">
//           <MessageSquare className="w-4 h-4 text-neutral-400" />
//           <h2 className="product-name text-xl font-normal text-neutral-900">Customer Reviews</h2>
//         </div>
//         <p className="text-xs text-neutral-400 font-medium">
//           {totalReviews} verified reviews · average {avgRating.toFixed(1)} out of 5
//         </p>
//       </div>

//       <div className="p-6 lg:p-8">
//         {/* ── Two-column layout: summary sidebar + cards grid ── */}
//         <div className="flex flex-col lg:flex-row gap-8">

//           {/* ── Left: Rating Summary ── */}
//           <div className="lg:w-64 lg:shrink-0">
//             <div className="lg:sticky lg:top-20 space-y-5">

//               {/* Big average */}
//               <div className="text-center py-6 rounded-2xl bg-neutral-50 border border-neutral-100">
//                 <p className="text-5xl font-bold text-neutral-900 tracking-tight leading-none">
//                   {avgRating.toFixed(1)}
//                 </p>
//                 <div className="flex justify-center mt-2.5">
//                   <Stars rating={avgRating} size="md" />
//                 </div>
//                 <p className="text-[11px] text-neutral-400 font-semibold mt-2">
//                   {totalReviews} reviews
//                 </p>
//               </div>

//               {/* Bar chart */}
//               <div className="space-y-1">
//                 {STAR_DATA.map(({ star, pct, count }) => (
//                   <RatingBar
//                     key={star}
//                     star={star}
//                     pct={pct}
//                     count={count}
//                     active={filter === star}
//                     onClick={() => {
//                       setFilter(f => f === star ? null : star);
//                       setShowAll(false);
//                     }}
//                   />
//                 ))}
//               </div>

//               {/* Clear filter */}
//               {filter !== null && (
//                 <button
//                   onClick={() => { setFilter(null); setShowAll(false); }}
//                   className="w-full text-[11px] font-semibold text-neutral-500 hover:text-neutral-900
//                     border border-neutral-200 rounded-xl py-2 transition-all hover:border-neutral-400">
//                   Clear filter · Show all
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* ── Right: Review Cards ── */}
//           <div className="flex-1 min-w-0">
//             {/* Filter badge */}
//             {filter !== null && (
//               <div className="flex items-center gap-2 mb-5">
//                 <span className="text-xs text-neutral-500 font-medium">Showing</span>
//                 <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
//                   <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
//                   {filter}-star reviews
//                 </span>
//                 <span className="text-xs text-neutral-400">({filtered.length})</span>
//               </div>
//             )}

//             {filtered.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-neutral-50 border border-dashed border-neutral-200">
//                 <Star className="w-8 h-8 text-neutral-200 fill-neutral-100 mb-3" />
//                 <p className="text-sm font-semibold text-neutral-400">No {filter}-star reviews yet</p>
//                 <button
//                   onClick={() => setFilter(null)}
//                   className="mt-3 text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors">
//                   Show all reviews
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {/* Cards — 1 col on mobile, 2 on xl */}
//                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//                   {visibleReviews.map(review => (
//                     <ReviewCard key={review.id} review={review} />
//                   ))}
//                 </div>

//                 {/* Load more / Show less */}
//                 {filtered.length > 4 && (
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       onClick={() => setShowAll(s => !s)}
//                       className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900
//                         border border-neutral-200 hover:border-neutral-400 px-5 py-2.5 rounded-xl transition-all hover:shadow-sm">
//                       {showAll ? (
//                         <>Show less <ChevronLeft className="w-3.5 h-3.5 rotate-90" /></>
//                       ) : (
//                         <>Load {filtered.length - 4} more <ChevronRight className="w-3.5 h-3.5" /></>
//                       )}
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export function ProductDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { toasts, show: showToast, dismiss } = useToast();

//   const [product,  setProduct]  = useState<Product | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [variants, setVariants] = useState<VariantOption[]>([]);

//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showGallery,        setShowGallery]        = useState(false);
//   const [isFavorite,         setIsFavorite]         = useState(false);
//   const [copied,             setCopied]             = useState(false);

//   const [selectedSize,      setSelectedSize]      = useState("");
//   const [selectedPaperType, setSelectedPaperType] = useState("");
//   const [selectedPrintType, setSelectedPrintType] = useState("");
//   const [selectedCutType,   setSelectedCutType]   = useState("");
//   const [selectedSides,     setSelectedSides]     = useState("1");

//   const [selectedQuantity, setSelectedQuantity] = useState<string>("");
//   const [customQty,        setCustomQty]        = useState<string>("");
//   const [useCustomQty,     setUseCustomQty]     = useState(false);

//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [totalPrice,      setTotalPrice]      = useState(0);

//   const [frontFile,    setFrontFile]    = useState<File | null>(null);
//   const [backFile,     setBackFile]     = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview,  setBackPreview]  = useState<string | null>(null);

//   const currentStep = useMemo(() => {
//     if (!selectedVariant || !selectedQuantity) return 0;
//     if (!frontFile) return 1;
//     return 2;
//   }, [selectedVariant, selectedQuantity, frontFile]);

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
//         const raw = res.data.product;
//         const parsed = {
//           ...raw,
//           images:         safeParse(raw.images),
//           related_images: safeParse(raw.related_images),
//         };
//         setProduct(enrichProductData(parsed));
//         if (Array.isArray(raw.variants) && raw.variants.length > 0) {
//           initVariants(raw.variants);
//         }
//       } catch {
//         showToast("error", "Failed to load product.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const initVariants = (variantData: ProductVariant[]) => {
//     const processed: VariantOption[] = variantData.map(v => {
//       const prices = v.prices || [];
//       const vals   = prices.map((p: VariantPrice) => p.price);
//       return {
//         id:          v.id,
//         variantId:   v.id,
//         size:        { id: v.size_id,       name: v.size_name       || "Standard" },
//         paperType:   { id: v.paper_type_id,  name: v.paper_type_name || "Standard" },
//         printType:   { id: v.print_type_id,  name: v.print_type_name || "Digital"  },
//         cutType:     { id: v.cut_type_id,    name: v.cut_type_name   || "Straight" },
//         sides:       v.sides        || 1,
//         orientation: v.orientation  || "Portrait",
//         prices,
//         minPrice:    vals.length ? Math.min(...vals) : 0,
//         maxPrice:    vals.length ? Math.max(...vals) : 0,
//       };
//     });
//     setVariants(processed);

//     const first = processed[0];
//     setSelectedSize(first.size.name);
//     setSelectedPaperType(first.paperType.name);
//     setSelectedPrintType(first.printType.name);
//     setSelectedCutType(first.cutType.name);
//     setSelectedSides(String(first.sides));
//     setSelectedVariant(first);
//     if (first.prices.length) {
//       setSelectedQuantity(first.prices[0].id);
//       setTotalPrice(first.prices[0].price);
//     }
//   };

//   const allSizes = useMemo(() => {
//     const map = new Map<string, Size>();
//     variants.forEach(v => { if (!map.has(v.size.name)) map.set(v.size.name, v.size); });
//     return Array.from(map.values());
//   }, [variants]);

//   const availablePaperTypes = useMemo(() => {
//     const map = new Map<string, PaperType>();
//     variants.filter(v => v.size.name === selectedSize)
//       .forEach(v => { if (!map.has(v.paperType.name)) map.set(v.paperType.name, v.paperType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize]);

//   const availablePrintTypes = useMemo(() => {
//     const map = new Map<string, PrintType>();
//     variants.filter(v => v.size.name === selectedSize && v.paperType.name === selectedPaperType)
//       .forEach(v => { if (!map.has(v.printType.name)) map.set(v.printType.name, v.printType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize, selectedPaperType]);

//   const availableCutTypes = useMemo(() => {
//     const map = new Map<string, CutType>();
//     variants.filter(v =>
//       v.size.name === selectedSize &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType
//     ).forEach(v => { if (!map.has(v.cutType.name)) map.set(v.cutType.name, v.cutType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize, selectedPaperType, selectedPrintType]);

//   const handleSizeChange = useCallback((name: string) => {
//     setSelectedSize(name);
//     const forSize = variants.filter(v => v.size.name === name);
//     if (!forSize.length) return;
//     const firstPaper = forSize[0].paperType.name;
//     setSelectedPaperType(firstPaper);
//     const forPaper = forSize.filter(v => v.paperType.name === firstPaper);
//     const firstPrint = forPaper[0]?.printType.name ?? forSize[0].printType.name;
//     setSelectedPrintType(firstPrint);
//     const forPrint = forPaper.filter(v => v.printType.name === firstPrint);
//     const firstCut = forPrint[0]?.cutType.name ?? forPaper[0]?.cutType.name ?? forSize[0].cutType.name;
//     setSelectedCutType(firstCut);
//   }, [variants]);

//   const handlePaperChange = useCallback((name: string) => {
//     setSelectedPaperType(name);
//     const forPaper = variants.filter(v => v.size.name === selectedSize && v.paperType.name === name);
//     if (!forPaper.length) return;
//     const firstPrint = forPaper[0].printType.name;
//     setSelectedPrintType(firstPrint);
//     const forPrint = forPaper.filter(v => v.printType.name === firstPrint);
//     const firstCut = forPrint[0]?.cutType.name ?? forPaper[0].cutType.name;
//     setSelectedCutType(firstCut);
//   }, [variants, selectedSize]);

//   const handlePrintChange = useCallback((name: string) => {
//     setSelectedPrintType(name);
//     const forPrint = variants.filter(v =>
//       v.size.name === selectedSize && v.paperType.name === selectedPaperType && v.printType.name === name
//     );
//     if (forPrint.length) setSelectedCutType(forPrint[0].cutType.name);
//   }, [variants, selectedSize, selectedPaperType]);

//   useEffect(() => {
//     if (!variants.length) return;
//     const match = variants.find(v =>
//       v.size.name === selectedSize &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType &&
//       v.cutType.name === selectedCutType
//     ) ?? null;
//     setSelectedVariant(match);
//     if (match?.prices.length) {
//       setSelectedQuantity(match.prices[0].id);
//       setUseCustomQty(false);
//       setCustomQty("");
//       setTotalPrice(match.prices[0].price);
//     } else {
//       setTotalPrice(0);
//     }
//   }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, variants]);

//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity || useCustomQty) return;
//     const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//     if (row) setTotalPrice(row.price);
//   }, [selectedQuantity, selectedVariant, useCustomQty]);

//   const allImages = useMemo(() => [
//     ...(Array.isArray(product?.images)         ? product!.images         : []),
//     ...(Array.isArray(product?.related_images) ? product!.related_images : []),
//   ], [product]);

//   const customQtyPrice = useMemo(() => {
//     if (!selectedVariant || !customQty) return null;
//     const qty = parseInt(customQty, 10);
//     if (isNaN(qty) || qty < 1) return null;
//     return selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty)
//       .find(p => qty >= p.min_qty)?.price ?? null;
//   }, [customQty, selectedVariant]);

//   const ctaDisabled =
//     !selectedVariant ||
//     (!useCustomQty && !selectedQuantity) ||
//     (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
//     !frontFile ||
//     (selectedSides === "2" && !backFile);

//   const ctaLabel = useMemo(() => {
//     if (!selectedVariant)                   return "Select options to continue";
//     if (!selectedQuantity && !useCustomQty) return "Select a quantity";
//     if (!frontFile)                         return "Upload front design to continue";
//     if (selectedSides === "2" && !backFile) return "Upload back design to continue";
//     return "Continue to Design Review";
//   }, [selectedVariant, selectedQuantity, useCustomQty, frontFile, selectedSides, backFile]);

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     showToast("success", "Link copied to clipboard!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setFrontFile(file);
//     setFrontPreview(URL.createObjectURL(file));
//     showToast("success", "Front design uploaded!");
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setBackFile(file);
//     setBackPreview(URL.createObjectURL(file));
//     showToast("success", "Back design uploaded!");
//   };

//   const handleContinue = () => {
//     if (!selectedVariant || !frontFile) return;
//     if (selectedSides === "2" && !backFile) {
//       showToast("error", "Please upload the back design too.");
//       return;
//     }
//     let quantityNumber: number;
//     let unitPrice: number;
//     if (useCustomQty) {
//       const parsed = parseInt(customQty, 10);
//       if (isNaN(parsed) || parsed < 1) { showToast("error", "Enter a valid quantity."); return; }
//       quantityNumber = parsed;
//       const tier = selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty)
//         .find(p => parsed >= p.min_qty);
//       unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
//     } else {
//       const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//       if (!row) { showToast("error", "Select a quantity."); return; }
//       quantityNumber = row.min_qty;
//       unitPrice = row.price;
//     }
//     navigate("/design-review", {
//       state: {
//         product, variant: selectedVariant, quantity: quantityNumber,
//         priceId: useCustomQty ? null : selectedQuantity,
//         selected_options: {
//           size: selectedVariant.size?.name ?? "",
//           material: selectedVariant.paperType?.name ?? "",
//           lamination: selectedVariant.printType?.name ?? "",
//         },
//         frontDesign: frontFile, backDesign: selectedSides === "2" ? backFile : null,
//         frontPreview, backPreview, basePrice: unitPrice, totalPrice: unitPrice, sides: selectedSides,
//       },
//     });
//   };

//   // ── Loading & Error States ────────────────────────────────────────────────

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="text-center space-y-4">
//         <div className="relative w-10 h-10 mx-auto">
//           <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100" />
//           <div className="absolute inset-0 rounded-full border-[3px] border-neutral-900 border-t-transparent animate-spin" />
//         </div>
//         <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">Loading</p>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="min-h-screen flex items-center justify-center bg-white">
//       <div className="text-center space-y-5">
//         <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto">
//           <AlertCircle className="w-6 h-6 text-neutral-400" />
//         </div>
//         <div>
//           <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
//           <p className="text-sm text-neutral-400 mt-1">This product may have been removed or the link is invalid.</p>
//         </div>
//         <button onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:gap-3 transition-all">
//           <ChevronLeft className="w-4 h-4" /> Go back
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>

//       {/* Global style injection */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
//         @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
//         @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
//         .fade-up { animation: fadeUp 0.4s ease forwards; }
//         .price-display { font-family: 'DM Serif Display', serif; }
//         .product-name  { font-family: 'DM Serif Display', serif; }
//       `}</style>

//       {/* ── Breadcrumb ─────────────────────────────────────────────── */}
//       <div className="bg-white border-b border-neutral-100 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto">
//           <button onClick={() => navigate("/")}
//             className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide">Home</button>
//           <span className="text-neutral-200 font-light">/</span>
//           <button onClick={() => navigate("/products")}
//             className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide">Products</button>
//           <span className="text-neutral-200 font-light">/</span>
//           <span className="text-neutral-700 font-semibold truncate">{product.name}</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">

//         <StepProgress current={currentStep} />

//         {/* ══════════════════════════════════════════════════════════
//             ROW 1 — Image Gallery + Product Hero Info
//         ══════════════════════════════════════════════════════════ */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 mb-12">

//           {/* ── Image Panel ── */}
//           <div className="flex gap-3">
//             {allImages.length > 1 && (
//               <div className="flex flex-col gap-2 shrink-0 w-[60px]">
//                 {allImages.map((img: any, idx: number) => (
//                   <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                     className={`w-full aspect-square rounded-xl overflow-hidden border transition-all duration-200
//                       ${selectedImageIndex === idx
//                         ? "ring-2 ring-neutral-900 ring-offset-1 opacity-100 scale-105 border-transparent"
//                         : "opacity-40 hover:opacity-75 hover:scale-105 border-neutral-100"}`}>
//                     <img src={getImageUrl(img.url || img)} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div className="relative flex-1 rounded-3xl overflow-hidden bg-neutral-50 aspect-square group border border-neutral-100">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
//                 onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x700?text="; }}
//               />

//               <div className="absolute top-4 left-4 flex flex-col gap-2">
//                 <button onClick={handleShare}
//                   className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100">
//                   {copied
//                     ? <CheckCheck className="w-4 h-4 text-emerald-500" />
//                     : <Share2 className="w-4 h-4 text-neutral-600" />}
//                 </button>
//                 <button onClick={() => setIsFavorite(f => !f)}
//                   className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100">
//                   <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "text-neutral-400"}`} />
//                 </button>
//               </div>

//               <button onClick={() => setShowGallery(true)}
//                 className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm border border-neutral-100
//                   text-xs font-bold text-neutral-700 flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100">
//                 <ZoomIn className="w-3.5 h-3.5" /> Zoom
//               </button>

//               {allImages.length > 1 && (
//                 <>
//                   <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
//                     <ChevronLeft className="w-4 h-4 text-neutral-700" />
//                   </button>
//                   <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
//                     <ChevronRight className="w-4 h-4 text-neutral-700" />
//                   </button>
//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
//                     {allImages.map((_: any, i: number) => (
//                       <button key={i} onClick={() => setSelectedImageIndex(i)}
//                         className={`rounded-full transition-all duration-300 ${i === selectedImageIndex ? "w-5 h-1.5 bg-neutral-900" : "w-1.5 h-1.5 bg-neutral-900/30"}`} />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* ── Product Info ── */}
//           <div className="space-y-6 fade-up">
//             <div className="flex items-center gap-2 flex-wrap">
//               <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-[0.15em]">
//                 {product.sku}
//               </span>
//               <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
//                 In Stock
//               </span>
//             </div>

//             <div>
//               <h1 className="product-name text-[2rem] leading-[1.1] font-normal text-neutral-900 mb-3">{product.name}</h1>
//               <div className="flex items-center gap-3 flex-wrap">
//                 <Stars rating={Number(product.rating || 4.2)} size="md" />
//                 <span className="text-sm font-bold text-neutral-800">{product.rating || 4.2}</span>
//                 <span className="text-sm text-neutral-400">({product.review_count || 90} reviews)</span>
//               </div>
//             </div>

//             {/* Price Block */}
//             <div className="flex items-end gap-3 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
//               <div>
//                 <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Starting from</p>
//                 <p className="price-display text-5xl font-normal text-neutral-900 tracking-tight leading-none">
//                   ₹{totalPrice > 0
//                     ? totalPrice.toFixed(2)
//                     : (selectedVariant?.minPrice ?? 0).toFixed(2)}
//                 </p>
//               </div>
//               {selectedVariant && (
//                 <div className="mb-1.5">
//                   <p className="text-xs text-neutral-400 font-medium">
//                     {useCustomQty
//                       ? `/ ${customQty || "—"} pcs`
//                       : (() => {
//                           const r = selectedVariant.prices.find(p => p.id === selectedQuantity);
//                           return r ? `/ ${r.min_qty}+ pcs` : "";
//                         })()}
//                   </p>
//                   {selectedVariant.minPrice !== selectedVariant.maxPrice && (
//                     <p className="text-[10px] text-neutral-400 mt-0.5">
//                       ₹{selectedVariant.minPrice.toFixed(0)}–{selectedVariant.maxPrice.toFixed(0)} range
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Quick Spec Chips */}
//             <div className="grid grid-cols-4 gap-2">
//               {[
//                 { icon: <Layers className="w-4 h-4" />,      label: "Sizes",  value: `${allSizes.length}`            },
//                 { icon: <PackageCheck className="w-4 h-4" />, label: "Papers", value: `${availablePaperTypes.length}` },
//                 { icon: <Printer className="w-4 h-4" />,      label: "Prints", value: `${availablePrintTypes.length}` },
//                 { icon: <Scissors className="w-4 h-4" />,     label: "Cuts",   value: `${availableCutTypes.length}`   },
//               ].map(({ icon, label, value }) => (
//                 <div key={label}
//                   className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white border border-neutral-200 text-center hover:border-neutral-300 hover:shadow-sm transition-all">
//                   <div className="text-neutral-500">{icon}</div>
//                   <p className="text-lg font-bold text-neutral-900 leading-none">{value}</p>
//                   <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Min Order */}
//             <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
//               <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
//               <span className="text-[12px] text-amber-800 font-semibold">
//                 Minimum order: <strong>{product.min_order_qty || 100} pieces</strong>
//               </span>
//             </div>

//             {/* Trust Badges */}
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { icon: <Truck className="w-3.5 h-3.5" />,    label: "Fast Delivery",    sub: "3–5 business days",   icon_bg: "bg-blue-600"   },
//                 { icon: <Shield className="w-3.5 h-3.5" />,   label: "Quality Assured",  sub: "100% satisfaction",   icon_bg: "bg-emerald-600" },
//                 { icon: <RefreshCw className="w-3.5 h-3.5" />, label: "Easy Reorder",     sub: "Save your design",    icon_bg: "bg-violet-600"  },
//                 { icon: <Zap className="w-3.5 h-3.5" />,      label: "Quick Turnaround", sub: "Same-day processing", icon_bg: "bg-amber-500"   },
//               ].map(b => (
//                 <div key={b.label}
//                   className="flex items-center gap-2.5 bg-white rounded-xl border border-neutral-200 px-3.5 py-3 hover:border-neutral-300 hover:shadow-sm transition-all">
//                   <div className={`w-7 h-7 rounded-lg ${b.icon_bg} text-white flex items-center justify-center shrink-0`}>
//                     {b.icon}
//                   </div>
//                   <div>
//                     <p className="text-[11px] font-bold text-neutral-800 leading-none">{b.label}</p>
//                     <p className="text-[10px] text-neutral-400 mt-0.5">{b.sub}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════
//             ROW 2 — Configure + Upload
//         ══════════════════════════════════════════════════════════ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

//           {/* ── Configure Panel ── */}
//           <div className="space-y-7">
//             <div className="pb-4 border-b border-neutral-100">
//               <h2 className="product-name text-xl font-normal text-neutral-900">Configure Your Order</h2>
//               <p className="text-xs text-neutral-400 mt-1.5 font-medium">
//                 Select size — paper, print &amp; cut auto-update to a valid match.
//               </p>
//             </div>

//             {allSizes.length > 0 && (
//               <div>
//                 <SectionLabel label="Size" hint="Physical dimensions of the printed card" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {allSizes.map(s => (
//                     <OptionPill key={s.id} active={selectedSize === s.name} onClick={() => handleSizeChange(s.name)}>
//                       <span className="text-[13px]">{s.name}</span>
//                       {s.dimensions && <span className="text-[10px] opacity-60 font-normal mt-0.5">{s.dimensions}</span>}
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {availablePaperTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Paper Type" hint="Material and finish of the paper used" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {availablePaperTypes.map(p => (
//                     <OptionPill key={p.id} active={selectedPaperType === p.name} onClick={() => handlePaperChange(p.name)}>
//                       <span className="text-[13px]">{p.name}</span>
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {availablePrintTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Print Type" hint="Printing technology used for production" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {availablePrintTypes.map(p => (
//                     <OptionPill key={p.id} active={selectedPrintType === p.name} onClick={() => handlePrintChange(p.name)}>
//                       <span className="text-[13px]">{p.name}</span>
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {availableCutTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Cut Type" hint="Edge finishing style of the final card" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {availableCutTypes.map(c => (
//                     <OptionPill key={c.id} active={selectedCutType === c.name} onClick={() => setSelectedCutType(c.name)}>
//                       <span className="text-[13px]">{c.name}</span>
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div>
//               <SectionLabel label="Printing Sides" />
//               <div className="grid grid-cols-2 gap-2">
//                 {SIDES_OPTIONS.map(o => (
//                   <OptionPill key={o.value} active={selectedSides === o.value} onClick={() => setSelectedSides(o.value)}>
//                     <span className="text-[13px]">{o.label}</span>
//                     <span className="text-[10px] opacity-60 font-normal mt-0.5">{o.desc}</span>
//                   </OptionPill>
//                 ))}
//               </div>
//             </div>

//             {selectedVariant && selectedVariant.prices.length > 0 && (
//               <div>
//                 <SectionLabel label="Quantity" hint="Choose a tier or enter a custom amount" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {selectedVariant.prices.map(price => (
//                     <OptionPill
//                       key={price.id}
//                       active={!useCustomQty && selectedQuantity === price.id}
//                       onClick={() => { setSelectedQuantity(price.id); setUseCustomQty(false); setCustomQty(""); }}>
//                       <span className="text-[13px] font-bold">
//                         {price.min_qty}
//                         {price.max_qty && price.max_qty !== price.min_qty ? `–${price.max_qty}` : "+"}
//                         {" "}pcs
//                       </span>
//                       <span className={`text-[11px] font-bold mt-0.5 transition-colors ${
//                         !useCustomQty && selectedQuantity === price.id ? "text-white/70" : "text-neutral-400"}`}>
//                         ₹{price.price.toFixed(2)}
//                       </span>
//                     </OptionPill>
//                   ))}
//                   <OptionPill active={useCustomQty} onClick={() => { setUseCustomQty(true); setSelectedQuantity(""); }}>
//                     <Edit3 className="w-3.5 h-3.5 mb-0.5" />
//                     <span className="text-[13px]">Custom</span>
//                     <span className="text-[10px] opacity-60 font-normal mt-0.5">Any qty</span>
//                   </OptionPill>
//                 </div>

//                 {useCustomQty && (
//                   <div className="mt-3 flex items-center gap-2.5">
//                     <input
//                       type="number"
//                       min={product.min_order_qty || 1}
//                       value={customQty}
//                       onChange={e => setCustomQty(e.target.value)}
//                       placeholder={`Min ${product.min_order_qty || 100} pcs`}
//                       className="flex-1 border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-colors bg-white placeholder-neutral-300"
//                     />
//                     {customQtyPrice !== null && (
//                       <div className="shrink-0 text-right px-3.5 py-2.5 bg-neutral-900 text-white rounded-xl">
//                         <p className="text-[9px] text-white/60 uppercase tracking-wider font-bold">Price</p>
//                         <p className="text-base font-bold">₹{customQtyPrice.toFixed(2)}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {customQty && parseInt(customQty) < (product.min_order_qty || 100) && parseInt(customQty) > 0 && (
//                   <p className="text-[11px] text-amber-600 flex items-center gap-1.5 mt-2 font-semibold">
//                     <AlertCircle className="w-3.5 h-3.5 shrink-0" />
//                     Minimum order is {product.min_order_qty || 100} pieces.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* ── Upload + Summary + CTA ── */}
//           <div className="space-y-5">
//             <div className="pb-4 border-b border-neutral-100">
//               <h2 className="product-name text-xl font-normal text-neutral-900">Upload Your Design</h2>
//               <p className="text-xs text-neutral-400 mt-1.5 font-medium">High-resolution artwork recommended (PDF, AI, PNG at 300dpi+).</p>
//             </div>

//             <UploadZone
//               label="Front Design"
//               file={frontFile}
//               preview={frontPreview}
//               onUpload={handleFrontUpload}
//               onRemove={() => { setFrontFile(null); setFrontPreview(null); }}
//             />

//             {selectedSides === "2" && (
//               <UploadZone
//                 label="Back Design"
//                 file={backFile}
//                 preview={backPreview}
//                 onUpload={handleBackUpload}
//                 onRemove={() => { setBackFile(null); setBackPreview(null); }}
//               />
//             )}

//             <OrderSummaryStrip
//               variant={selectedVariant}
//               quantityId={selectedQuantity}
//               useCustomQty={useCustomQty}
//               customQty={customQty}
//               totalPrice={totalPrice}
//               frontFile={frontFile}
//               sides={selectedSides}
//               backFile={backFile}
//             />

//             {/* Desktop CTA */}
//             <button
//               onClick={handleContinue}
//               disabled={ctaDisabled}
//               className="hidden lg:flex w-full items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-300
//                 bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5
//                 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
//               <span>{ctaLabel}</span>
//               {!ctaDisabled && <ArrowRight className="w-4 h-4" />}
//             </button>
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════
//             ROW 3 — Specs Table
//         ══════════════════════════════════════════════════════════ */}
//         <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
//           <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
//             <div className="flex items-center gap-2 mb-1">
//               <FileText className="w-4 h-4 text-neutral-400" />
//               <h2 className="product-name text-xl font-normal text-neutral-900">Product Specifications</h2>
//             </div>
//             <p className="text-xs text-neutral-400 font-medium">All variant combinations and available pricing tiers.</p>
//           </div>

//           <div className="p-6 lg:p-8">
//             <div className="overflow-x-auto rounded-2xl border border-neutral-200">
//               <table className="w-full text-xs">
//                 <thead>
//                   <tr className="bg-neutral-50 border-b border-neutral-200">
//                     {["Size", "Paper", "Print", "Cut", "Sides", "Min Qty", "Price"].map(h => (
//                       <th key={h} className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-neutral-100">
//                   {variants.flatMap(v => v.prices.map(p => (
//                     <tr key={`${v.id}-${p.id}`}
//                       className={`transition-colors cursor-pointer hover:bg-neutral-50
//                         ${selectedVariant?.id === v.id && selectedQuantity === p.id ? "bg-blue-50/40" : ""}`}>
//                       <td className="px-4 py-3.5 font-bold text-neutral-800 whitespace-nowrap">{v.size.name}</td>
//                       <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.paperType.name}</td>
//                       <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.printType.name}</td>
//                       <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.cutType.name}</td>
//                       <td className="px-4 py-3.5 text-neutral-500">{v.sides === 1 ? "Single" : "Double"}</td>
//                       <td className="px-4 py-3.5 text-neutral-500">{p.min_qty}+</td>
//                       <td className="px-4 py-3.5 font-bold text-neutral-900">₹{p.price.toFixed(2)}</td>
//                     </tr>
//                   )))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* ══════════════════════════════════════════════════════════
//             ROW 4 — Reviews Section
//         ══════════════════════════════════════════════════════════ */}
//         <ReviewsSection product={product} />

//       </div>

//       {/* ── Mobile Sticky CTA ──────────────────────────────────────── */}
//       <div className="fixed bottom-0 inset-x-0 lg:hidden z-40 bg-white/98 backdrop-blur-md border-t border-neutral-100 px-4 pt-3 pb-4 shadow-2xl shadow-neutral-900/10">
//         <div className="flex items-center gap-3 max-w-lg mx-auto">
//           <div className="flex-1 min-w-0">
//             <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest truncate">
//               {selectedVariant
//                 ? `${selectedVariant.size.name} · ${selectedVariant.paperType.name}`
//                 : "Configure to get pricing"}
//             </p>
//             <p className="price-display text-xl font-normal text-neutral-900 leading-tight">
//               {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
//             </p>
//           </div>
//           <button
//             onClick={handleContinue}
//             disabled={ctaDisabled}
//             className="shrink-0 text-white px-5 py-3 rounded-xl text-[12px] font-bold transition-all
//               bg-neutral-900 hover:bg-neutral-800 active:scale-95
//               disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed">
//             Continue →
//           </button>
//         </div>
//       </div>

//       {/* ── Image Gallery Modal ───────────────────────────────────── */}
//       {showGallery && (
//         <div className="fixed inset-0 z-50 bg-neutral-950/98 flex flex-col">
//           <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/5">
//             <div>
//               <p className="text-white font-bold text-sm tracking-wide">{product.name}</p>
//               <p className="text-white/30 text-xs font-medium mt-0.5">{selectedImageIndex + 1} / {allImages.length}</p>
//             </div>
//             <button onClick={() => setShowGallery(false)}
//               className="text-white/50 hover:text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="flex-1 flex items-center justify-center px-20 relative overflow-hidden py-6">
//             <img
//               src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//               alt={product.name}
//               className="max-w-full max-h-full object-contain rounded-2xl"
//             />
//             {allImages.length > 1 && (
//               <>
//                 <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                   className="absolute left-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                   className="absolute right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </>
//             )}
//           </div>

//           {allImages.length > 1 && (
//             <div className="flex justify-center gap-2 py-5 shrink-0 border-t border-white/5">
//               {allImages.map((_: any, idx: number) => (
//                 <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                   className={`rounded-full transition-all duration-300 ${idx === selectedImageIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <ToastStack toasts={toasts} onDismiss={dismiss} />
//     </div>
//   );
// }


import React from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";

import StepProgress   from "../product/StepProgress";
import ReviewsSection from "../product/ReviewsSection";
import { GalleryPanel } from "../product/Gallerypanel";
import { ProductHero } from "../product/Productinfo";
import { ConfigurePanel } from "../product/Configurepanel";
import { UploadPanel } from "../product/UploadPanel";
import { SpecsTable } from "../product/SpecsTable";
import { MobileStickyBar } from "../product/MobileStickyBar";
import { ImageGalleryModal } from "../product/ImageGalleryModal";
import { ToastStack } from "../ui/ToasterStack";
import { useProductDetail } from "../../hooks/useproductdetail";



// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProductDetailPage() {
  const ctx = useProductDetail();

  // ── Loading ───────────────────────────────────────────────────────────────
  if (ctx.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="relative w-10 h-10 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-900 border-t-transparent animate-spin" />
          </div>
          <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">Loading</p>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!ctx.product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-neutral-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
            <p className="text-sm text-neutral-400 mt-1">
              This product may have been removed or the link is invalid.
            </p>
          </div>
          <button
            onClick={() => ctx.navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:gap-3 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>
      {/* <GlobalStyles /> */}

      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto">
          <button
            onClick={() => ctx.navigate("/")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide"
          >
            Home
          </button>
          <span className="text-neutral-200 font-light">/</span>
          <button
            onClick={() => ctx.navigate("/products")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide"
          >
            Products
          </button>
          <span className="text-neutral-200 font-light">/</span>
          <span className="text-neutral-700 font-semibold truncate">{ctx.product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">
        <StepProgress current={ctx.currentStep} />

        {/* ══ ROW 1 — Gallery + Hero ══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 mb-12">
          <GalleryPanel
            allImages={ctx.allImages}
            selectedImageIndex={ctx.selectedImageIndex}
            setSelectedImageIndex={ctx.setSelectedImageIndex}
            isFavorite={ctx.isFavorite}
            onFavoriteToggle={() => ctx.setIsFavorite((f) => !f)}
            copied={ctx.copied}
            onShare={ctx.handleShare}
            onZoom={() => ctx.setShowGallery(true)}
            productName={ctx.product.name}
          />

          <ProductHero
            product={ctx.product}
            selectedVariant={ctx.selectedVariant}
            totalPrice={ctx.totalPrice}
            selectedQuantity={ctx.selectedQuantity}
            useCustomQty={ctx.useCustomQty}
            customQty={ctx.customQty}
            allSizesCount={ctx.allSizes.length}
            availablePaperCount={ctx.availablePaperTypes.length}
            availablePrintCount={ctx.availablePrintTypes.length}
            availableCutCount={ctx.availableCutTypes.length}
          />
        </div>

        {/* ══ ROW 2 — Configure + Upload ══════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <ConfigurePanel
            product={ctx.product}
            allSizes={ctx.allSizes}
            availablePaperTypes={ctx.availablePaperTypes}
            availablePrintTypes={ctx.availablePrintTypes}
            availableCutTypes={ctx.availableCutTypes}
            selectedSize={ctx.selectedSize}
            selectedPaperType={ctx.selectedPaperType}
            selectedPrintType={ctx.selectedPrintType}
            selectedCutType={ctx.selectedCutType}
            selectedSides={ctx.selectedSides}
            selectedVariant={ctx.selectedVariant}
            selectedQuantity={ctx.selectedQuantity}
            useCustomQty={ctx.useCustomQty}
            customQty={ctx.customQty}
            customQtyPrice={ctx.customQtyPrice}
            onSizeChange={ctx.handleSizeChange}
            onPaperChange={ctx.handlePaperChange}
            onPrintChange={ctx.handlePrintChange}
            onCutChange={ctx.setSelectedCutType}
            onSidesChange={ctx.setSelectedSides}
            onQuantitySelect={(id) => {
              ctx.setSelectedQuantity(id);
              ctx.setUseCustomQty(false);
              ctx.setCustomQty("");
            }}
            onCustomQtyToggle={() => {
              ctx.setUseCustomQty(true);
              ctx.setSelectedQuantity("");
            }}
            onCustomQtyChange={ctx.setCustomQty}
          />

          <UploadPanel
            selectedSides={ctx.selectedSides}
            frontFile={ctx.frontFile}
            backFile={ctx.backFile}
            frontPreview={ctx.frontPreview}
            backPreview={ctx.backPreview}
            onFrontUpload={ctx.handleFrontUpload}
            onBackUpload={ctx.handleBackUpload}
            onFrontRemove={() => { ctx.setFrontFile(null); ctx.setFrontPreview(null); }}
            onBackRemove={() => { ctx.setBackFile(null); ctx.setBackPreview(null); }}
            selectedVariant={ctx.selectedVariant}
            selectedQuantity={ctx.selectedQuantity}
            useCustomQty={ctx.useCustomQty}
            customQty={ctx.customQty}
            totalPrice={ctx.totalPrice}
            ctaDisabled={ctx.ctaDisabled}
            ctaLabel={ctx.ctaLabel}
            onContinue={ctx.handleContinue}
          />
        </div>

        {/* ══ ROW 3 — Specs Table ═════════════════════════════════════ */}
        <SpecsTable
          variants={ctx.variants}
          selectedVariant={ctx.selectedVariant}
          selectedQuantity={ctx.selectedQuantity}
        />

        {/* ══ ROW 4 — Reviews ═════════════════════════════════════════ */}
        <ReviewsSection product={ctx.product} />
      </div>

      {/* ── Mobile sticky bar ──────────────────────────────────────── */}
      <MobileStickyBar
        selectedVariant={ctx.selectedVariant}
        totalPrice={ctx.totalPrice}
        ctaDisabled={ctx.ctaDisabled}
        onContinue={ctx.handleContinue}
      />

      {/* ── Gallery modal ──────────────────────────────────────────── */}
      {ctx.showGallery && (
        <ImageGalleryModal
          images={ctx.allImages}
          selectedIndex={ctx.selectedImageIndex}
          productName={ctx.product.name}
          onClose={() => ctx.setShowGallery(false)}
          onPrev={() =>
            ctx.setSelectedImageIndex(
              ctx.selectedImageIndex > 0
                ? ctx.selectedImageIndex - 1
                : ctx.allImages.length - 1
            )
          }
          onNext={() =>
            ctx.setSelectedImageIndex(
              ctx.selectedImageIndex < ctx.allImages.length - 1
                ? ctx.selectedImageIndex + 1
                : 0
            )
          }
          onSelect={ctx.setSelectedImageIndex}
        />
      )}

      {/* ── Toasts ────────────────────────────────────────────────── */}
      <ToastStack toasts={ctx.toasts} onDismiss={ctx.dismiss} />
    </div>
  );
}


