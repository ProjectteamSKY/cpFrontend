import React from "react";
import {
  PackageCheck, Layers, Scissors, Printer,
  Truck, Shield, RefreshCw, Zap,
} from "lucide-react";
import { Product } from "../../types/productlist";
import { Stars } from "./Stars";
import { VariantOption } from "../../hooks/useproductdetail";

interface Props {
  product: Product;
  selectedVariant: VariantOption | null;
  totalPrice: number;
  selectedQuantity: string;
  useCustomQty: boolean;
  customQty: string;
  allSizesCount: number;
  availablePaperCount: number;
  availablePrintCount: number;
  availableCutCount: number;
}

export function ProductHero({
  product,
  selectedVariant,
  totalPrice,
  selectedQuantity,
  useCustomQty,
  customQty,
  allSizesCount,
  availablePaperCount,
  availablePrintCount,
  availableCutCount,
}: Props) {
  return (
    <div className="space-y-6 fade-up">
      {/* Badges */}
        

      {/* Name + Rating */}
      <div>
        <h1 className="product-name text-[2rem] leading-[1.1] font-normal text-neutral-900 mb-3">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Stars rating={Number(product.rating || 4.2)} size="md" />
          <span className="text-sm font-bold text-neutral-800">{product.rating || 4.2}</span>
          <span className="text-sm text-neutral-400">({product.review_count || 90} reviews)</span>
        </div>
      </div>

      {/* Price block */}
      <div className="flex items-end gap-3 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
        <div>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
            Starting from
          </p>
          <p className="price-display text-5xl font-normal text-neutral-900 tracking-tight leading-none">
            ₹{totalPrice > 0
              ? totalPrice.toFixed(2)
              : (selectedVariant?.minPrice ?? 0).toFixed(2)}
          </p>
        </div>
        {selectedVariant && (
          <div className="mb-1.5">
            <p className="text-xs text-neutral-400 font-medium">
              {useCustomQty
                ? `/ ${customQty || "—"} pcs`
                : (() => {
                    const r = selectedVariant.prices.find((p) => p.id === selectedQuantity);
                    return r ? `/ ${r.min_qty}+ pcs` : "";
                  })()}
            </p>
            {selectedVariant.minPrice !== selectedVariant.maxPrice && (
              <p className="text-[10px] text-neutral-400 mt-0.5">
                ₹{selectedVariant.minPrice.toFixed(0)}–{selectedVariant.maxPrice.toFixed(0)} range
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick spec chips */}
      {/* <div className="grid grid-cols-4 gap-2">
        {[
          { icon: <Layers className="w-4 h-4" />,      label: "Sizes",  value: `${allSizesCount}`      },
          { icon: <PackageCheck className="w-4 h-4" />, label: "Papers", value: `${availablePaperCount}` },
          { icon: <Printer className="w-4 h-4" />,      label: "Prints", value: `${availablePrintCount}` },
          { icon: <Scissors className="w-4 h-4" />,     label: "Cuts",   value: `${availableCutCount}`   },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white border border-neutral-200 text-center hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <div className="text-neutral-500">{icon}</div>
            <p className="text-lg font-bold text-neutral-900 leading-none">{value}</p>
            <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div> */}

      {/* Min order banner */}
      {/* <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-[12px] text-amber-800 font-semibold">
          Minimum order: <strong>{product.min_order_qty || 100} pieces</strong>
        </span>
      </div> */}

      {/* Trust badges */}
      {/* <div className="grid grid-cols-2 gap-2">
        {[
          { icon: <Truck className="w-3.5 h-3.5" />,     label: "Fast Delivery",    sub: "3–5 business days",   icon_bg: "bg-blue-600"   },
          { icon: <Shield className="w-3.5 h-3.5" />,    label: "Quality Assured",  sub: "100% satisfaction",   icon_bg: "bg-emerald-600" },
          { icon: <RefreshCw className="w-3.5 h-3.5" />, label: "Easy Reorder",     sub: "Save your design",    icon_bg: "bg-violet-600"  },
          { icon: <Zap className="w-3.5 h-3.5" />,       label: "Quick Turnaround", sub: "Same-day processing", icon_bg: "bg-amber-500"   },
        ].map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-2.5 bg-white rounded-xl border border-neutral-200 px-3.5 py-3 hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <div
              className={`w-7 h-7 rounded-lg ${b.icon_bg} text-white flex items-center justify-center shrink-0`}
            >
              {b.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-800 leading-none">{b.label}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{b.sub}</p>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}