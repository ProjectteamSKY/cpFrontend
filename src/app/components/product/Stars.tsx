import React from "react";
import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: "sm" | "md";
}

export function Stars({ rating, size = "sm" }: Props) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${cls} transition-colors ${
            i < Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-neutral-200 fill-neutral-200"
          }`}
        />
      ))}
    </div>
  );
}