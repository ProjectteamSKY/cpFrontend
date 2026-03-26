import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useWishlist } from "../../hooks/useWishlist";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface ProductImage {
  id: string;
  url: string;
  is_default?: boolean;
}

interface Price {
  id: string;
  price: number;
  min_qty: number;
}

interface Variant {
  id: string;
  size_id: string;
  paper_type_id: string;
  print_type_id: string;
  cut_type_id: string;
  sides: number;
  orientation: string;
  prices: Price[];
}

interface Product {
  id: string;
  category_id: string;
  subcategory_id?: string;
  name: string;
  description: string;
  min_order_qty?: number;
  max_order_qty?: number;
  image?: ProductImage;
  images: string | ProductImage[];
  related_images: string | ProductImage[];
  is_active?: number;
  created_at?: string;
  sku?: string;
  variants?: Variant[];
}

/* ─────────────────────────────────────────
   Helpers
───────────────────────────────────────── */
const BASE_URL = "http://54.206.3.97";

function parseImages(raw: string | ProductImage[] | undefined): ProductImage[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw) || []; } catch { return []; }
}

function getImageUrl(raw?: string | ProductImage[] | ProductImage): string {
  if (!raw) return "https://placehold.co/600x800/fafaf9/d4c5b0?text=—";
  if (typeof raw === "object" && !Array.isArray(raw) && (raw as ProductImage).url) {
    const img = raw as ProductImage;
    return img.url.startsWith("http") ? img.url : `${BASE_URL}/${img.url}`;
  }
  const imgs = parseImages(raw as string | ProductImage[]);
  const def = imgs.find((i) => i.is_default) || imgs[0];
  if (!def) return "https://placehold.co/600x800/fafaf9/d4c5b0?text=—";
  return def.url.startsWith("http") ? def.url : `${BASE_URL}/${def.url}`;
}

function getMinPrice(variants?: Variant[]): number | null {
  if (!variants?.length) return null;
  const all = variants.flatMap((v) => v.prices.map((p) => p.price));
  return all.length ? Math.min(...all) : null;
}

function getMinQty(variants?: Variant[]): number | null {
  if (!variants?.length) return null;
  const all = variants.flatMap((v) => v.prices.map((p) => p.min_qty));
  return all.length ? Math.min(...all) : null;
}

/* ─────────────────────────────────────────
   Breadcrumb
───────────────────────────────────────── */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <svg
                className="w-3.5 h-3.5 text-stone-300 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
            {isLast ? (
              <span
                className="text-xs sm:text-sm font-semibold text-stone-700 truncate max-w-[180px] sm:max-w-[240px]"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || "#"}
                className="text-xs sm:text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors duration-150 truncate max-w-[100px] sm:max-w-[140px]"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ─────────────────────────────────────────
   Skeleton
───────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl overflow-hidden border border-stone-100 bg-white shadow-sm">
      <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[2/3] bg-stone-100" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="h-3 bg-stone-100 rounded-full w-1/4" />
        <div className="h-5 bg-stone-100 rounded-full w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-stone-100 rounded-full w-1/3" />
          <div className="h-10 w-24 bg-stone-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="animate-pulse flex gap-4 py-4 sm:py-5 border-b border-stone-100">
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-stone-100 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2.5 pt-1">
        <div className="h-3 bg-stone-100 rounded-full w-1/5" />
        <div className="h-5 bg-stone-100 rounded-full w-2/5" />
        <div className="h-4 bg-stone-100 rounded-full w-3/5" />
      </div>
      <div className="h-5 bg-stone-100 rounded-full w-16 self-center" />
    </div>
  );
}

/* ─────────────────────────────────────────
   Product Card — Grid (Image Height Increased, Name Below Div)
───────────────────────────────────────── */
function ProductCard({
  product,
  isFavorite,
  onToggleWishlist,
  onClick,
  index,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleWishlist: () => void;
  onClick: () => void;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const minPrice = getMinPrice(product.variants);
  const minQty = getMinQty(product.variants) ?? product.min_order_qty;
  const variantCount = product.variants?.length ?? 0;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-stone-200/80 hover:border-stone-300 shadow-sm hover:shadow-xl hover:shadow-stone-200/60 transition-all duration-300 hover:-translate-y-0.5 flex flex-col h-full"
      style={{ animation: "fadeUp 0.35s ease both", animationDelay: `${index * 45}ms` }}
    >
      {/* Image — Increased height on all screen sizes */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4] xl:aspect-[2/3] overflow-hidden bg-stone-50 flex-shrink-0">
        <img
          src={imgError ? "https://placehold.co/600x800/fafaf9/d4c5b0?text=—" : getImageUrl(product.image || product.images)}
          onError={() => setImgError(true)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-1.5">
            {product.is_active === 1 && (
              <span className="text-[10px] sm:text-xs font-bold tracking-wide bg-white/95 backdrop-blur-sm text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-full shadow-sm">
                Active
              </span>
            )}
            {variantCount > 0 && (
              <span className="text-[10px] sm:text-xs font-semibold bg-white/90 backdrop-blur-sm text-stone-500 border border-stone-200/80 px-2.5 py-1 rounded-full shadow-sm">
                {variantCount} options
              </span>
            )}
          </div>

          {/* Wishlist btn */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
            className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-110 active:scale-95
              ${isFavorite
                ? "bg-rose-500 border-rose-400"
                : "bg-white/90 border-stone-200/80 hover:border-rose-300 hover:bg-white"
              }`}
            aria-label="Toggle wishlist"
          >
            <svg
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-150 ${isFavorite ? "fill-white text-white" : "text-stone-400 hover:text-rose-400"}`}
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isFavorite ? 0 : 1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Text body — Product name and details below */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {product.sku && (
          <p className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-stone-400 uppercase mb-1.5">{product.sku}</p>
        )}
        
        {/* Product name only - description removed */}
        <h3 className="text-sm sm:text-base lg:text-[15px] font-bold text-stone-800 leading-snug line-clamp-2 group-hover:text-stone-950 transition-colors mb-3">
          {product.name}
        </h3>

        {/* Footer with price and order button */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
          {minPrice !== null ? (
            <div className="flex flex-col">
              <p className="text-[10px] sm:text-xs text-stone-400 leading-none mb-0.5">From</p>
              <span className="text-base sm:text-lg font-black text-stone-800 tabular-nums leading-none">₹{minPrice.toFixed(2)}</span>
              {minQty && (
                <p className="text-[10px] text-amber-600 mt-0.5">MOQ: {minQty}</p>
              )}
            </div>
          ) : (
            <span className="text-xs text-stone-400">Price on request</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#D73D32] hover:bg-[#c23529] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-150 active:scale-95 shadow-sm"
          >
            Order
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────
   Product Row — List (Increased Thumbnail Size, Description Removed)
───────────────────────────────────────── */
function ProductRow({
  product,
  isFavorite,
  onToggleWishlist,
  onClick,
  isLast,
}: {
  product: Product;
  isFavorite: boolean;
  onToggleWishlist: () => void;
  onClick: () => void;
  isLast: boolean;
}) {
  const minPrice = getMinPrice(product.variants);
  const minQty = getMinQty(product.variants) ?? product.min_order_qty;
  const variantCount = product.variants?.length ?? 0;

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 sm:gap-4 md:gap-5 py-4 sm:py-5 md:py-6 cursor-pointer hover:bg-stone-50 -mx-3 px-3 rounded-xl transition-colors duration-150 ${!isLast ? "border-b border-stone-100" : ""}`}
    >
      {/* Thumbnail — Larger on all screens */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
        <img
          src={getImageUrl(product.image || product.images)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/128x128/fafaf9/d4c5b0?text=—"; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {product.sku && (
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] text-stone-400 uppercase">{product.sku}</span>
          )}
          {product.is_active === 1 && (
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Active</span>
          )}
        </div>
        {/* Product name only - description removed */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-stone-800 group-hover:text-stone-950 truncate transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {minQty && <span className="text-xs sm:text-sm font-semibold text-amber-600">MOQ: {minQty}</span>}
          {variantCount > 0 && <span className="text-xs sm:text-sm text-stone-400">{variantCount} variants</span>}
        </div>
      </div>

      {/* Price — visible from sm */}
      <div className="shrink-0 text-right hidden sm:block min-w-[100px] md:min-w-[120px]">
        {minPrice !== null ? (
          <>
            <p className="text-base sm:text-lg md:text-xl font-black text-stone-900 tabular-nums">₹{minPrice.toFixed(2)}</p>
            <p className="text-xs text-stone-400">/unit</p>
          </>
        ) : (
          <p className="text-sm text-stone-400">Price on request</p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(); }}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border transition-all duration-150 hover:scale-110 active:scale-95
            ${isFavorite
              ? "bg-rose-500 border-rose-400"
              : "bg-white border-stone-200 hover:border-rose-300"
            }`}
        >
          <svg
            className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-white text-white" : "text-stone-300 group-hover:text-stone-400"}`}
            viewBox="0 0 24 24"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={isFavorite ? 0 : 1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-white bg-[#D73D32] hover:bg-[#c23529] px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-95 shadow-sm"
        >
          Order
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0 sm:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Filter Bar
───────────────────────────────────────── */
function FilterBar({
  search, setSearch,
  sortBy, setSortBy,
  activeFilter, setActiveFilter,
  viewMode, setViewMode,
  counts,
}: {
  search: string; setSearch: (v: string) => void;
  sortBy: string; setSortBy: (v: string) => void;
  activeFilter: string | null; setActiveFilter: (v: string | null) => void;
  viewMode: "grid" | "list"; setViewMode: (v: "grid" | "list") => void;
  counts: { all: number; active: number; variants: number; favorites: number };
}) {
  const pills = [
    { key: null, label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "variants", label: "Has variants", count: counts.variants },
    { key: "favorites", label: "Saved", count: counts.favorites },
  ];

  const isDirty = search || activeFilter || sortBy !== "default";

  return (
    <div className="space-y-3 mb-6 sm:mb-8">
      {/* Search + controls row */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search — full width on mobile */}
        <div className="relative w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="text"
            className="w-full pl-10 sm:pl-11 pr-9 py-3 sm:py-2.5 text-sm sm:text-base bg-stone-50 border border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:bg-white rounded-xl outline-none transition-all duration-200 placeholder:text-stone-400 text-stone-800"
            placeholder="Search products, SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-stone-200 hover:bg-stone-300 transition-colors"
            >
              <svg className="w-3 h-3 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="w-px h-7 bg-stone-200 hidden sm:block" />

        {/* Sort — full width on mobile */}
        <div className="relative w-full sm:w-auto shrink-0">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <select
            className="w-full sm:w-auto appearance-none pl-9 pr-8 py-3 sm:py-2.5 text-sm font-medium text-stone-600 bg-stone-50 border border-stone-200 hover:border-stone-300 focus:border-stone-400 focus:bg-white rounded-xl outline-none transition-all duration-200 cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Default order</option>
            <option value="price_asc">Price: low → high</option>
            <option value="price_desc">Price: high → low</option>
            <option value="name_asc">Name A → Z</option>
            <option value="name_desc">Name Z → A</option>
            <option value="qty_asc">Min qty first</option>
            <option value="variants_desc">Most variants</option>
            <option value="newest">Newest first</option>
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div className="flex-1 hidden sm:block" />

        {/* View toggle */}
        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden shrink-0 bg-stone-50 p-1 gap-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 sm:p-2 rounded-lg transition-all duration-150 ${viewMode === "grid" ? "bg-stone-900 text-white shadow-sm" : "text-stone-400 hover:text-stone-600 hover:bg-white"}`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 16 16">
              <rect x="0" y="0" width="7" height="7" rx="1.5" />
              <rect x="9" y="0" width="7" height="7" rx="1.5" />
              <rect x="0" y="9" width="7" height="7" rx="1.5" />
              <rect x="9" y="9" width="7" height="7" rx="1.5" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 sm:p-2 rounded-lg transition-all duration-150 ${viewMode === "list" ? "bg-stone-900 text-white shadow-sm" : "text-stone-400 hover:text-stone-600 hover:bg-white"}`}
            aria-label="List view"
          >
            <svg className="w-4 h-4 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 11h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Pills — horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {pills.map(({ key, label, count }) => (
          <button
            key={String(key)}
            onClick={() => setActiveFilter(key)}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2 rounded-full border transition-all duration-150 whitespace-nowrap shrink-0 ${activeFilter === key
                ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700"
              }`}
          >
            {label}
            <span className={`text-[10px] sm:text-xs font-bold tabular-nums px-1.5 py-0.5 rounded-full ${activeFilter === key ? "bg-white/20 text-white" : "bg-stone-100 text-stone-400"
              }`}>
              {count}
            </span>
          </button>
        ))}

        {isDirty && (
          <button
            onClick={() => { setSearch(""); setActiveFilter(null); setSortBy("default"); }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-400 hover:text-stone-600 transition-colors ml-1 border border-stone-200 hover:border-stone-300 px-3 py-2 rounded-full whitespace-nowrap shrink-0"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
───────────────────────────────────────── */
export function ProductListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category") || "";
  const categoryName = searchParams.get("categoryName") || "Products";

  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id") || null;
  const { isFavorite, toggleWishlist } = useWishlist(userId);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/api/product/category/${categoryId}`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => { setAllProducts(data.products || []); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [categoryId]);

  useEffect(() => {
    setSearch(""); setSortBy("default"); setActiveFilter(null);
  }, [categoryId]);

  const filteredProducts = React.useMemo(() => {
    let list = [...allProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }

    if (activeFilter === "active") list = list.filter((p) => p.is_active === 1);
    if (activeFilter === "favorites") list = list.filter((p) => isFavorite(p.id));
    if (activeFilter === "variants") list = list.filter((p) => (p.variants?.length ?? 0) > 0);

    if (sortBy === "name_asc") list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name_desc") list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "price_asc") list.sort((a, b) => (getMinPrice(a.variants) ?? Infinity) - (getMinPrice(b.variants) ?? Infinity));
    if (sortBy === "price_desc") list.sort((a, b) => (getMinPrice(b.variants) ?? -Infinity) - (getMinPrice(a.variants) ?? -Infinity));
    if (sortBy === "qty_asc") list.sort((a, b) => (getMinQty(a.variants) ?? a.min_order_qty ?? Infinity) - (getMinQty(b.variants) ?? b.min_order_qty ?? Infinity));
    if (sortBy === "variants_desc") list.sort((a, b) => (b.variants?.length ?? 0) - (a.variants?.length ?? 0));
    if (sortBy === "newest" && list[0]?.created_at)
      list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

    return list;
  }, [allProducts, search, sortBy, activeFilter, isFavorite]);

  const counts = {
    all: allProducts.length,
    active: allProducts.filter((p) => p.is_active === 1).length,
    variants: allProducts.filter((p) => (p.variants?.length ?? 0) > 0).length,
    favorites: allProducts.filter((p) => isFavorite(p.id)).length,
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Catalogue", href: "/catalogue" },
    { label: categoryName },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="plp-root min-h-screen bg-white">

        {/* ── Sticky Header ── */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">

            {/* Breadcrumb */}
            <div className="mb-2 sm:mb-2.5">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Title row */}
            <div className="flex items-end gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight leading-none truncate">
                  {categoryName}
                </h1>
                <p className="text-xs sm:text-sm text-stone-400 mt-1 sm:mt-1.5 font-light tracking-wide">
                  {loading
                    ? "Loading…"
                    : `${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""}${filteredProducts.length !== allProducts.length ? ` of ${allProducts.length}` : ""}`
                  }
                </p>
              </div>

              {/* Saved shortcut */}
              {counts.favorites > 0 && (
                <button
                  onClick={() => setActiveFilter(activeFilter === "favorites" ? null : "favorites")}
                  className="shrink-0 flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-150"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-rose-400 text-rose-400" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {counts.favorites} saved
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          <FilterBar
            search={search} setSearch={setSearch}
            sortBy={sortBy} setSortBy={setSortBy}
            activeFilter={activeFilter} setActiveFilter={setActiveFilter}
            viewMode={viewMode} setViewMode={setViewMode}
            counts={counts}
          />

          {/* Error */}
          {error && (
            <div className="flex items-start gap-4 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm sm:text-base font-semibold text-red-700">Failed to load products</p>
                <p className="text-xs sm:text-sm text-red-400 mt-0.5">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm font-medium text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && viewMode === "grid" && (
            <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}
          {loading && viewMode === "list" && (
            <div>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}</div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 text-center">
              <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mb-5 shadow-sm">
                <svg className="w-7 h-7 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-stone-700 mb-2">No products match</p>
              <p className="text-sm sm:text-base text-stone-400 max-w-xs">Try different keywords or remove active filters.</p>
              <button
                onClick={() => { setSearch(""); setActiveFilter(null); setSortBy("default"); }}
                className="mt-6 text-sm font-semibold text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-5 py-2.5 rounded-xl transition-all duration-150"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Grid view - with increased image height and name below */}
          {!loading && filteredProducts.length > 0 && viewMode === "grid" && (
            <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleWishlist={() => toggleWishlist(product.id)}
                  onClick={() => navigate(`/product/${product.id}`)}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* List view - with larger thumbnails and description removed */}
          {!loading && filteredProducts.length > 0 && viewMode === "list" && (
            <div className="rounded-2xl border border-stone-200/80 bg-white shadow-sm overflow-hidden">
              <div className="px-3 divide-y divide-stone-100">
                {filteredProducts.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    isFavorite={isFavorite(product.id)}
                    onToggleWishlist={() => toggleWishlist(product.id)}
                    onClick={() => navigate(`/product/${product.id}`)}
                    isLast={index === filteredProducts.length - 1}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="h-12" />
        </main>
      </div>
    </>
  );
}

