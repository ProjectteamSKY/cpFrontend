import { ChevronLeft, ChevronRight, MessageSquare, Star, Stars } from "lucide-react";
import ProductReviews from "../customer/ReviewPage";
import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
import { useState } from "react";
import RatingBar from "./RatingBar";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection({ product }: { product: Product }) {
  const [filter,   setFilter]   = useState<number | null>(null);
  const [showAll,  setShowAll]  = useState(false);
  const productId               = product?.id;

  const avgRating    = Number(product.rating || 4.2);
  const totalReviews = product.review_count || 90;

  // Star distribution percentages
  const STAR_DATA: { star: number; pct: number; count: number }[] = [
    { star: 5, pct: 68, count: Math.round(totalReviews * 0.68) },
    { star: 4, pct: 22, count: Math.round(totalReviews * 0.22) },
    { star: 3, pct:  7, count: Math.round(totalReviews * 0.07) },
    { star: 2, pct:  2, count: Math.round(totalReviews * 0.02) },
    { star: 1, pct:  1, count: Math.round(totalReviews * 0.01) },
  ];

  function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${cls} transition-colors ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200 fill-neutral-200"}`} />
      ))}
    </div>
  );
}

const MOCK_REVIEWS = [
  { id: 1, name: "Ravi Kumar",    initials: "RK", rating: 5, date: new Date(Date.now() - 1 * 86400000).toISOString(),  text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again.", helpful: 14 },
  { id: 2, name: "Priya Sharma",  initials: "PS", rating: 4, date: new Date(Date.now() - 4 * 86400000).toISOString(),  text: "Good quality cards, delivered on time. Slight delay but overall happy with the result.", helpful: 8 },
  { id: 3, name: "Arjun Mehta",   initials: "AM", rating: 5, date: new Date(Date.now() - 32 * 86400000).toISOString(), text: "Very professional finish. The Gloss paper option looks premium. Highly recommend.", helpful: 21 },
  { id: 4, name: "Sneha Nair",    initials: "SN", rating: 3, date: new Date(Date.now() - 60 * 86400000).toISOString(), text: "Decent product but packaging could be better. Cards are good quality though.", helpful: 5 },
  { id: 5, name: "Karan Verma",   initials: "KV", rating: 5, date: new Date(Date.now() - 2 * 86400000).toISOString(),  text: "Fast turnaround, exactly what I needed for my business launch. Will order in bulk next time.", helpful: 17 },
  { id: 6, name: "Meena Pillai",  initials: "MP", rating: 4, date: new Date(Date.now() - 90 * 86400000).toISOString(), text: "Great matte finish, very elegant. The rounded corners option is a nice touch.", helpful: 9 },
];

  const filtered      = filter ? MOCK_REVIEWS.filter(r => r.rating === filter) : MOCK_REVIEWS;
  const visibleCount  = showAll ? filtered.length : Math.min(4, filtered.length);
  const visibleReviews = filtered.slice(0, visibleCount);

  // If we have a real API component, delegate to it entirely
  if (productId) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
        <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-neutral-400" />
            <h2 className="product-name text-xl font-normal text-neutral-900">Customer Reviews</h2>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            Verified purchases from our customers.
          </p>
        </div>
        <div className="p-6 lg:p-8">
          <ProductReviews PRODUCT_ID={productId} />
        </div>
      </div>
    );
  }

  // Fallback: render mock reviews with full summary UI
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
      {/* Header */}
      <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-neutral-400" />
          <h2 className="product-name text-xl font-normal text-neutral-900">Customer Reviews</h2>
        </div>
        <p className="text-xs text-neutral-400 font-medium">
          {totalReviews} verified reviews · average {avgRating.toFixed(1)} out of 5
        </p>
      </div>

      <div className="p-6 lg:p-8">
        {/* ── Two-column layout: summary sidebar + cards grid ── */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Rating Summary ── */}
          <div className="lg:w-64 lg:shrink-0">
            <div className="lg:sticky lg:top-20 space-y-5">

              {/* Big average */}
              <div className="text-center py-6 rounded-2xl bg-neutral-50 border border-neutral-100">
                <p className="text-5xl font-bold text-neutral-900 tracking-tight leading-none">
                  {avgRating.toFixed(1)}
                </p>
                <div className="flex justify-center mt-2.5">
                  <Stars rating={avgRating} size="md" />
                </div>
                <p className="text-[11px] text-neutral-400 font-semibold mt-2">
                  {totalReviews} reviews
                </p>
              </div>

              {/* Bar chart */}
              <div className="space-y-1">
                {STAR_DATA.map(({ star, pct, count }) => (
                  <RatingBar
                    key={star}
                    star={star}
                    pct={pct}
                    count={count}
                    active={filter === star}
                    onClick={() => {
                      setFilter(f => f === star ? null : star);
                      setShowAll(false);
                    }}
                  />
                ))}
              </div>

              {/* Clear filter */}
              {filter !== null && (
                <button
                  onClick={() => { setFilter(null); setShowAll(false); }}
                  className="w-full text-[11px] font-semibold text-neutral-500 hover:text-neutral-900
                    border border-neutral-200 rounded-xl py-2 transition-all hover:border-neutral-400">
                  Clear filter · Show all
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Review Cards ── */}
          <div className="flex-1 min-w-0">
            {/* Filter badge */}
            {filter !== null && (
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs text-neutral-500 font-medium">Showing</span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {filter}-star reviews
                </span>
                <span className="text-xs text-neutral-400">({filtered.length})</span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-neutral-50 border border-dashed border-neutral-200">
                <Star className="w-8 h-8 text-neutral-200 fill-neutral-100 mb-3" />
                <p className="text-sm font-semibold text-neutral-400">No {filter}-star reviews yet</p>
                <button
                  onClick={() => setFilter(null)}
                  className="mt-3 text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors">
                  Show all reviews
                </button>
              </div>
            ) : (
              <>
                {/* Cards — 1 col on mobile, 2 on xl */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {visibleReviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {/* Load more / Show less */}
                {filtered.length > 4 && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowAll(s => !s)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900
                        border border-neutral-200 hover:border-neutral-400 px-5 py-2.5 rounded-xl transition-all hover:shadow-sm">
                      {showAll ? (
                        <>Show less <ChevronLeft className="w-3.5 h-3.5 rotate-90" /></>
                      ) : (
                        <>Load {filtered.length - 4} more <ChevronRight className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}