import { Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
const MOCK_REVIEWS = [
  { id: 1, name: "Ravi Kumar",    initials: "RK", rating: 5, date: new Date(Date.now() - 1 * 86400000).toISOString(),  text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again.", helpful: 14 },
  { id: 2, name: "Priya Sharma",  initials: "PS", rating: 4, date: new Date(Date.now() - 4 * 86400000).toISOString(),  text: "Good quality cards, delivered on time. Slight delay but overall happy with the result.", helpful: 8 },
  { id: 3, name: "Arjun Mehta",   initials: "AM", rating: 5, date: new Date(Date.now() - 32 * 86400000).toISOString(), text: "Very professional finish. The Gloss paper option looks premium. Highly recommend.", helpful: 21 },
  { id: 4, name: "Sneha Nair",    initials: "SN", rating: 3, date: new Date(Date.now() - 60 * 86400000).toISOString(), text: "Decent product but packaging could be better. Cards are good quality though.", helpful: 5 },
  { id: 5, name: "Karan Verma",   initials: "KV", rating: 5, date: new Date(Date.now() - 2 * 86400000).toISOString(),  text: "Fast turnaround, exactly what I needed for my business launch. Will order in bulk next time.", helpful: 17 },
  { id: 6, name: "Meena Pillai",  initials: "MP", rating: 4, date: new Date(Date.now() - 90 * 86400000).toISOString(), text: "Great matte finish, very elegant. The rounded corners option is a nice touch.", helpful: 9 },
];

export default function ReviewCard({ review }: { review: typeof MOCK_REVIEWS[0] }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted]     = useState(false);
  const colors = avatarColor(review.initials);
  
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
const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" },
  { bg: "#FFF7ED", text: "#C2410C" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FDF4FF", text: "#9333EA" },
  { bg: "#FFF1F2", text: "#BE123C" },
  { bg: "#F0F9FF", text: "#0369A1" },
];

function avatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function formatReviewDate(dateStr: string): string {
  const parsed = new Date(dateStr);
  const isRealDate = !isNaN(parsed.getTime());

  if (!isRealDate) return dateStr;

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7)  return `${diffDays} days ago`;

  return parsed.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}
  return (
    <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tracking-wider"
            style={{ background: colors.bg, color: colors.text }}>
            {review.initials}
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-800 leading-none mb-1">{review.name}</p>
            <p className="text-[10px] text-neutral-400 font-medium">{formatReviewDate(review.date)}</p>
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <Stars rating={review.rating} />
        </div>
      </div>
      <p className="text-[13px] text-neutral-600 leading-relaxed">{review.text}</p>
      <div className="flex items-center gap-2 pt-1 border-t border-neutral-50">
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all
            ${voted
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border border-transparent"}`}>
          <ThumbsUp className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
}