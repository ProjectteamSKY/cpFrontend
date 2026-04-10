import React from "react";
import { VariantOption } from "../../hooks/Useproductdetail";

interface Props {
  selectedVariant: VariantOption | null;
  totalPrice: number;
  ctaDisabled: boolean;
  onContinue: () => void;
}

export function MobileStickyBar({
  selectedVariant,
  totalPrice,
  ctaDisabled,
  onContinue,
}: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 lg:hidden z-40 bg-white/98 backdrop-blur-md border-t border-neutral-100 px-4 pt-3 pb-4 shadow-2xl shadow-neutral-900/10">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest truncate">
            {selectedVariant
              ? `${selectedVariant.size.name} · ${selectedVariant.paperType.name}`
              : "Configure to get pricing"}
          </p>
          <p className="price-display text-xl font-normal text-neutral-900 leading-tight">
            {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
          </p>
        </div>
        <button
          onClick={onContinue}
          disabled={ctaDisabled}
          className="shrink-0 text-white px-5 py-3 rounded-xl text-[12px] font-bold transition-all
            bg-neutral-900 hover:bg-neutral-800 active:scale-95
            disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}