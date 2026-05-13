import {
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Star,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import ProductReviews from "../customer/ReviewPage";
import { Product } from "../../types/productlist";
import { useState } from "react";

import RatingBar from "./RatingBar";
import ReviewCard from "./ReviewCard";

export default function ReviewsSection({
  product,
}: {
  product: Product;
}) {
  const [filter, setFilter] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const productId = product?.id;

  const avgRating = Number(product.rating || 4.2);
  const totalReviews = product.review_count || 90;

  // Brand Colors
  const COLORS = {
    primary: "#D73D32",
    secondary: "#EC7063",
    dark: "#2d4863",
    accent: "#F4A261",
  };

  // Star distribution
  const STAR_DATA: {
    star: number;
    pct: number;
    count: number;
  }[] = [
    { star: 5, pct: 68, count: Math.round(totalReviews * 0.68) },
    { star: 4, pct: 22, count: Math.round(totalReviews * 0.22) },
    { star: 3, pct: 7, count: Math.round(totalReviews * 0.07) },
    { star: 2, pct: 2, count: Math.round(totalReviews * 0.02) },
    { star: 1, pct: 1, count: Math.round(totalReviews * 0.01) },
  ];

  function Stars({
    rating,
    size = "sm",
  }: {
    rating: number;
    size?: "sm" | "md";
  }) {
    const cls = size === "md" ? "w-5 h-5" : "w-4 h-4";

    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${cls} transition-all duration-300 ${
              i < Math.round(rating)
                ? "fill-current text-[#F4A261]"
                : "fill-neutral-200 text-neutral-200"
            }`}
          />
        ))}
      </div>
    );
  }

  const MOCK_REVIEWS = [
    {
      id: 1,
      name: "Ravi Kumar",
      initials: "RK",
      rating: 5,
      date: new Date(Date.now() - 1 * 86400000).toISOString(),
      text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again.",
      helpful: 14,
    },
    {
      id: 2,
      name: "Priya Sharma",
      initials: "PS",
      rating: 4,
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      text: "Good quality cards, delivered on time. Slight delay but overall happy with the result.",
      helpful: 8,
    },
    {
      id: 3,
      name: "Arjun Mehta",
      initials: "AM",
      rating: 5,
      date: new Date(Date.now() - 32 * 86400000).toISOString(),
      text: "Very professional finish. The Gloss paper option looks premium. Highly recommend.",
      helpful: 21,
    },
    {
      id: 4,
      name: "Sneha Nair",
      initials: "SN",
      rating: 3,
      date: new Date(Date.now() - 60 * 86400000).toISOString(),
      text: "Decent product but packaging could be better. Cards are good quality though.",
      helpful: 5,
    },
    {
      id: 5,
      name: "Karan Verma",
      initials: "KV",
      rating: 5,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      text: "Fast turnaround, exactly what I needed for my business launch. Will order in bulk next time.",
      helpful: 17,
    },
    {
      id: 6,
      name: "Meena Pillai",
      initials: "MP",
      rating: 4,
      date: new Date(Date.now() - 90 * 86400000).toISOString(),
      text: "Great matte finish, very elegant. The rounded corners option is a nice touch.",
      helpful: 9,
    },
  ];

  const filtered = filter
    ? MOCK_REVIEWS.filter((r) => r.rating === filter)
    : MOCK_REVIEWS;

  const visibleCount = showAll
    ? filtered.length
    : Math.min(4, filtered.length);

  const visibleReviews = filtered.slice(0, visibleCount);

  // Real API Reviews
  if (productId) {
    return (
      <div className="rounded-[30px] border border-[#f0d7d3] bg-white shadow-sm mb-12 overflow-hidden">
        <div className="h-1 bg-[#D73D32]" />

        <div className="px-6 lg:px-10 pt-8 pb-6 border-b border-[#f4e3e0]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#fff2f0] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#D73D32]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-black">
                Customer Reviews
              </h2>

              <p className="text-sm text-neutral-500 mt-1">
                Verified customer feedback
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-10">
          <ProductReviews PRODUCT_ID={productId} />
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-[30px] border border-[#f0d7d3] bg-white shadow-sm mb-12 overflow-hidden">
      {/* Top Bar */}
      <div className="h-1 bg-[#D73D32]" />

      {/* Header */}
      <div className="px-6 lg:px-10 pt-8 pb-7 border-b border-[#f4e3e0]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fff2f0] flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#D73D32]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl lg:text-3xl font-bold text-black">
                  Customer Reviews
                </h2>

                <Sparkles className="w-5 h-5 text-[#F4A261]" />
              </div>

              <p className="text-sm text-neutral-500 mt-1">
                {totalReviews} verified reviews from customers
              </p>
            </div>
          </div>

          {/* Rating Box */}
          <div className="flex items-center gap-4 rounded-2xl border border-[#f0d7d3] bg-[#fffaf9] px-5 py-4">
            <div className="w-12 h-12 rounded-xl bg-[#D73D32] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#2d4863]">
                  {avgRating.toFixed(1)}
                </span>

                <Stars rating={avgRating} />
              </div>

              <p className="text-xs text-neutral-500 mt-1">
                Average rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

          {/* Sidebar */}
          <aside>
            <div className="rounded-3xl border border-[#f1dfdc] bg-[#fffaf9] p-6">

              {/* Big Rating */}
              <div className="text-center border-b border-[#f2e5e2] pb-6">
                <div className="w-28 h-28 rounded-full bg-[#D73D32] flex items-center justify-center mx-auto mb-5">
                  <span className="text-4xl font-bold text-white">
                    {avgRating.toFixed(1)}
                  </span>
                </div>

                <div className="flex justify-center mb-3">
                  <Stars rating={avgRating} size="md" />
                </div>

                <p className="text-sm text-neutral-500">
                  Based on {totalReviews} reviews
                </p>
              </div>

              {/* Rating Bars */}
              <div className="space-y-3 mt-6">
                {STAR_DATA.map(({ star, pct, count }) => (
                  <RatingBar
                    key={star}
                    star={star}
                    pct={pct}
                    count={count}
                    active={filter === star}
                    onClick={() => {
                      setFilter((f) => (f === star ? null : star));
                      setShowAll(false);
                    }}
                  />
                ))}
              </div>

              {/* Clear */}
              {filter !== null && (
                <button
                  onClick={() => {
                    setFilter(null);
                    setShowAll(false);
                  }}
                  className="w-full mt-5 rounded-2xl border border-[#e8c8c3] py-3 text-sm font-semibold text-[#D73D32] hover:bg-[#fff2f0] transition-all"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </aside>

          {/* Reviews */}
          <div>

            {/* Filter Badge */}
            {filter !== null && (
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-neutral-500">
                  Showing
                </span>

                <div className="flex items-center gap-2 rounded-full border border-[#f3d7b8] bg-[#fff5eb] px-4 py-2">
                  <Star className="w-4 h-4 fill-[#F4A261] text-[#F4A261]" />

                  <span className="text-sm font-semibold text-[#c77a28]">
                    {filter}-Star Reviews
                  </span>
                </div>

                <span className="text-sm text-neutral-400">
                  ({filtered.length})
                </span>
              </div>
            )}

            {/* Empty */}
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#ecd8d5] bg-[#fffaf9] py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-5 border border-[#f1dfdc]">
                  <Star className="w-10 h-10 text-[#F4A261] fill-[#F4A261]/20" />
                </div>

                <h3 className="text-xl font-semibold text-[#2d4863] mb-2">
                  No Reviews Found
                </h3>

                <p className="text-neutral-500 text-sm">
                  No {filter}-star reviews available yet.
                </p>

                <button
                  onClick={() => setFilter(null)}
                  className="mt-5 rounded-xl bg-[#D73D32] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
                >
                  Show All Reviews
                </button>
              </div>
            ) : (
              <>
                {/* Cards */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {visibleReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                    />
                  ))}
                </div>

                {/* Load More */}
                {filtered.length > 4 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => setShowAll((s) => !s)}
                      className="inline-flex items-center gap-3 rounded-2xl bg-[#D73D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c9342a] transition-all"
                    >
                      {showAll ? (
                        <>
                          Show Less
                          <ChevronLeft className="w-4 h-4 rotate-90" />
                        </>
                      ) : (
                        <>
                          Load {filtered.length - 4} More
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}