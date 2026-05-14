import { useState, useEffect } from "react";

interface Review {
    id: string;
    product_id: string;
    user_id: string;
    customer_name: string;
    rating: number;
    comment: string;
    image_url: string | null;
    is_active: number;
    is_deleted: number;
    created_at: string;
    updated_at: string;
}

interface ReviewApiResponse {
    status: string;
    reviews: Review[];
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const AVATAR_TINTS = [
    { bg: "#EEF2FF", text: "#4338CA" },
    { bg: "#FFF7ED", text: "#C2410C" },
    { bg: "#F0FDF4", text: "#15803D" },
    { bg: "#FDF4FF", text: "#9333EA" },
    { bg: "#FFF1F2", text: "#BE123C" },
    { bg: "#F0F9FF", text: "#0369A1" },
];

function getAvatarTint(initials: string) {
    const idx =
        (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) %
        AVATAR_TINTS.length;

    return AVATAR_TINTS[idx];
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) return dateStr;

    const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

// ── Sub-components ─────────────────────────────────────────────────────────────

const StarRow = ({
    rating,
    size = 18,
}: {
    rating: number;
    size?: number;
}) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg
                key={i}
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill={i < Math.round(rating) ? "#FBBF24" : "none"}
                stroke={i < Math.round(rating) ? "#FBBF24" : "#E5E7EB"}
                strokeWidth="1.5"
            >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
        ))}
    </div>
);

const RatingBar = ({
    star,
    count,
    total,
    active,
    onClick,
}: {
    star: number;
    count: number;
    total: number;
    active: boolean;
    onClick: () => void;
}) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full group rounded-lg px-2 py-1.5 transition-all
            ${active ? "bg-amber-50" : "hover:bg-neutral-50"}`}
        >
            <span
                className={`text-sm font-bold w-5 shrink-0 text-right transition-colors
                ${
                    active
                        ? "text-amber-600"
                        : "text-neutral-400 group-hover:text-neutral-600"
                }`}
            >
                {star}
            </span>

            <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={active ? "#FBBF24" : "#E5E7EB"}
                stroke={active ? "#FBBF24" : "#D1D5DB"}
                strokeWidth="1.5"
                className="shrink-0"
            >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>

            <div className="flex-1 h-2 rounded-full bg-neutral-100 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500
                    ${active ? "bg-amber-400" : "bg-neutral-300"}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <span
                className={`text-xs font-semibold w-7 shrink-0 text-right
                ${active ? "text-amber-600" : "text-neutral-400"}`}
            >
                {count}
            </span>
        </button>
    );
};

const Skeleton = () => (
    <div className="space-y-4">
        {[100, 80, 90].map((w, i) => (
            <div
                key={i}
                className="p-6 rounded-2xl border border-neutral-100 bg-white"
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse shrink-0" />

                    <div className="flex-1 space-y-3">
                        <div
                            className="h-4 rounded-full bg-neutral-100 animate-pulse"
                            style={{ width: `${w * 0.4}px` }}
                        />

                        <div className="h-3 rounded-full bg-neutral-100 animate-pulse w-24" />

                        <div
                            className="h-4 rounded-full bg-neutral-100 animate-pulse"
                            style={{ width: `${w}%` }}
                        />

                        <div
                            className="h-4 rounded-full bg-neutral-100 animate-pulse"
                            style={{ width: `${w * 0.7}%` }}
                        />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const ReviewCard = ({
    review,
    index,
}: {
    review: Review;
    index: number;
}) => {
    const [helpful, setHelpful] = useState(0);
    const [voted, setVoted] = useState(false);

    const initials = review.customer_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const tint = getAvatarTint(initials);

    return (
        <div
            className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-sm
            hover:shadow-md hover:border-neutral-300 transition-all duration-200
            opacity-0 animate-[reviewFadeIn_0.4s_ease_forwards]"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center
                        text-sm font-bold shrink-0 tracking-wider"
                        style={{
                            background: tint.bg,
                            color: tint.text,
                        }}
                    >
                        {initials}
                    </div>

                    <div>
                        <p className="text-base font-bold text-neutral-800 leading-none mb-1.5">
                            {review.customer_name}
                        </p>

                        <p className="text-xs text-neutral-400 font-medium">
                            {formatDate(review.created_at)}
                        </p>
                    </div>
                </div>

                <div className="shrink-0 pt-0.5">
                    <StarRow rating={review.rating} size={16} />
                </div>
            </div>

            {/* Comment */}
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
                "{review.comment}"
            </p>

            {/* Review image */}
            {review.image_url && (
                <img
                    src={`https://api.citizenprintz.in/${review.image_url}`}
                    alt="Review"
                    className="mt-4 max-w-[140px] rounded-xl border border-neutral-100 object-cover"
                />
            )}

            {/* Footer */}
            <div className="mt-5 pt-4 border-t border-neutral-50 flex items-center justify-between gap-3">
                <span
                    className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100
                    text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide"
                >
                    <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <polyline points="20,6 9,17 4,12" />
                    </svg>

                    Verified Purchase
                </span>

                <button
                    onClick={() => {
                        if (!voted) {
                            setHelpful((h) => h + 1);
                            setVoted(true);
                        }
                    }}
                    className={`flex items-center gap-1.5 text-xs font-semibold
                    px-3 py-1.5 rounded-lg transition-all
                    ${
                        voted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border border-transparent"
                    }`}
                >
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>

                    Helpful{helpful > 0 ? ` (${helpful})` : ""}
                </button>
            </div>
        </div>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const ProductReviews = ({
    PRODUCT_ID,
}: {
    PRODUCT_ID: string;
}) => {
    const API_URL = `https://api.citizenprintz.in/api/review/product/${PRODUCT_ID}/latest`;

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(API_URL);

                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}`);
                }

                const data: ReviewApiResponse = await res.json();

                if (data.status !== "success") {
                    throw new Error("Failed to fetch reviews");
                }

                const activeReviews = data.reviews.filter(
                    (r) => r.is_active === 1 && r.is_deleted === 0
                );

                setReviews(activeReviews);
            } catch (err: any) {
                console.error("Review fetch error:", err);
                setError(err.message || "Something went wrong");
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        if (PRODUCT_ID) {
            fetchReviews();
        }
    }, [PRODUCT_ID]);

    const totalReviews = reviews.length;

    const avgRating =
        totalReviews > 0
            ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
            : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
    }));

    const filtered =
        filter !== null
            ? reviews.filter((r) => r.rating === filter)
            : reviews;

    const visibleCount = showAll
        ? filtered.length
        : Math.min(4, filtered.length);

    const visibleReviews = filtered.slice(0, visibleCount);

    // ── Loading ────────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <>
                <style>{`
                    @keyframes reviewFadeIn{
                        from{
                            opacity:0;
                            transform:translateY(10px)
                        }
                        to{
                            opacity:1;
                            transform:translateY(0)
                        }
                    }
                `}</style>

                <Skeleton />
            </>
        );
    }

    // ── Error ──────────────────────────────────────────────────────────────────

    if (error) {
        return (
            <div
                className="flex flex-col items-center justify-center py-16 text-center
                rounded-2xl border border-dashed border-red-200 bg-red-50"
            >
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                    className="mb-4 opacity-60"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>

                <p className="text-base font-semibold text-red-600">
                    Could not load reviews
                </p>

                <p className="text-sm text-red-400 mt-1">{error}</p>
            </div>
        );
    }

    // ── Empty ──────────────────────────────────────────────────────────────────

    if (totalReviews === 0) {
        return (
            <div
                className="flex flex-col items-center justify-center py-20 text-center
                rounded-2xl border border-dashed border-neutral-200 bg-neutral-50"
            >
                <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D1D5DB"
                    strokeWidth="1.2"
                    className="mb-4"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                <p className="text-base font-semibold text-neutral-400">
                    No reviews yet
                </p>

                <p className="text-sm text-neutral-300 mt-1">
                    Be the first to share your experience!
                </p>
            </div>
        );
    }

    // ── Main UI ────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{`
                @keyframes reviewFadeIn{
                    from{
                        opacity:0;
                        transform:translateY(10px)
                    }
                    to{
                        opacity:1;
                        transform:translateY(0)
                    }
                }
            `}</style>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left Summary */}
                <div className="lg:w-72 lg:shrink-0">
                    <div className="lg:sticky lg:top-20 space-y-6">
                        <div className="text-center py-8 rounded-2xl bg-neutral-50 border border-neutral-100">
                            <p className="text-6xl font-bold text-neutral-900 tracking-tight leading-none">
                                {avgRating.toFixed(1)}
                            </p>

                            <div className="flex justify-center mt-3">
                                <StarRow rating={avgRating} size={20} />
                            </div>

                            <p className="text-sm text-neutral-400 font-semibold mt-3">
                                {totalReviews} review
                                {totalReviews !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="space-y-2">
                            {ratingCounts.map(({ star, count }) => (
                                <RatingBar
                                    key={star}
                                    star={star}
                                    count={count}
                                    total={totalReviews}
                                    active={filter === star}
                                    onClick={() => {
                                        setFilter((f) =>
                                            f === star ? null : star
                                        );
                                        setShowAll(false);
                                    }}
                                />
                            ))}
                        </div>

                        {filter !== null && (
                            <button
                                onClick={() => {
                                    setFilter(null);
                                    setShowAll(false);
                                }}
                                className="w-full text-sm font-semibold text-neutral-500 hover:text-neutral-900
                                border border-neutral-200 rounded-xl py-2.5 transition-all hover:border-neutral-400"
                            >
                                Clear filter · Show all
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Reviews */}
                <div className="flex-1 min-w-0">
                    {filtered.length === 0 ? (
                        <div
                            className="flex flex-col items-center justify-center py-20 text-center
                            rounded-2xl bg-neutral-50 border border-dashed border-neutral-200"
                        >
                            <p className="text-base font-semibold text-neutral-400">
                                No matching reviews found
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {visibleReviews.map((review, i) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        index={i}
                                    />
                                ))}
                            </div>

                            {filtered.length > 4 && (
                                <div className="mt-8 flex justify-center">
                                    <button
                                        onClick={() =>
                                            setShowAll((s) => !s)
                                        }
                                        className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600
                                        hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400
                                        px-6 py-3 rounded-xl transition-all hover:shadow-sm"
                                    >
                                        {showAll
                                            ? "Show less"
                                            : `Load ${
                                                  filtered.length - 4
                                              } more`}
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductReviews;