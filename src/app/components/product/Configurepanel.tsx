// ConfigurePanel.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Upload, Zap, X, ArrowRight, ImagePlus, Trash2, FileImage } from "lucide-react";
import { Product } from "../../types/productlist";
import {
  VariantOption,
  Size,
  PaperType,
  PrintType,
  CutType,
} from "../../hooks/useproductdetail";
import SectionLabel from "../../components/product/sectionLabel";
import { Stars } from "./Stars";
import NoDesignScreen from "./Nodesignscreen";
import type { NoDesignFormData } from "./Nodesignscreen";
import UploadScreen from "./UploadPanel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PriceTier {
  id: string;
  min_qty: number;
  max_qty?: number;
  price: number;
}

interface Props {
  product: Product;
  allSizes: Size[];
  totalPrice: number;
  availablePaperTypes: PaperType[];
  availablePrintTypes: PrintType[];
  availableCutTypes: CutType[];
  selectedSize: string;
  selectedPaperType: string;
  selectedPrintType: string;
  selectedCutType: string;
  selectedSides: string;
  selectedVariant: VariantOption | null;
  selectedQuantity: string;
  useCustomQty: boolean;
  customQty: string;
  customQtyPrice: number | null;
  onSizeChange: (name: string) => void;
  onPaperChange: (name: string) => void;
  onPrintChange: (name: string) => void;
  onCutChange: (name: string) => void;
  onSidesChange: (value: string) => void;
  onQuantitySelect: (id: string) => void;
  onCustomQtyToggle: () => void;
  onCustomQtyChange: (val: string) => void;
  // Upload props
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
  onFrontUpload: (file: File) => void;
  onBackUpload: (file: File) => void;
  onFrontRemove: () => void;
  onBackRemove: () => void;
  ctaDisabled: boolean;
  ctaLabel: string;
  onContinue: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const SIDES_OPTIONS = [
  { label: "Single Sided — Front only", value: "1" },
  { label: "Double Sided — Front & back", value: "2" },
];

export const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const selectClass =
  "w-full h-10 px-3 pr-8 border border-neutral-200 rounded-xl bg-white text-sm " +
  "text-neutral-900 appearance-none focus:outline-none focus:border-[#D73D32] " +
  "transition-colors cursor-pointer " +
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] " +
  "bg-no-repeat bg-[right_12px_center]";


function PriceCard({ unitPrice, qty, total, sides }: { unitPrice: number; qty: number; total: number; sides: string }) {
  const sidesMultiplier = Number(sides) || 1;
  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#D73D32" }}>
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Price Summary</p>
        {unitPrice > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: "#ffd6d4" }}>
            <Zap className="w-3 h-3" />
            Best rate applied
          </span>
        )}
      </div>
      <div className="px-5 py-4 space-y-2.5 bg-white">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Unit price</span>
          <span className="font-semibold text-neutral-800">{unitPrice > 0 ? `₹${fmt(unitPrice)} / pc` : "—"}</span>
        </div>
        {sidesMultiplier > 1 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Sides multiplier</span>
            <span className="font-semibold text-neutral-800">×{sidesMultiplier} = ₹{fmt(unitPrice * sidesMultiplier)} / pc</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">Quantity</span>
          <span className="font-semibold text-neutral-800">{qty > 0 ? `${qty.toLocaleString("en-IN")} pcs` : "—"}</span>
        </div>
        <div className="border-t border-dashed border-neutral-200 pt-2.5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Total</p>
              <p className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                {total > 0 ? `₹${fmt(total)}` : "₹0.00"}
              </p>
            </div>
            {unitPrice > 0 && qty > 0 && (
              <p className="text-[10px] text-neutral-400 font-medium mb-0.5">incl. all taxes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ConfigurePanel
// ---------------------------------------------------------------------------
export function ConfigurePanel({
  product,
  allSizes,
  availablePaperTypes,
  availablePrintTypes,
  availableCutTypes,
  selectedSize,
  selectedPaperType,
  selectedPrintType,
  selectedCutType,
  selectedSides,
  selectedVariant,
  selectedQuantity,
  useCustomQty,
  customQty,
  onSizeChange,
  onPaperChange,
  onPrintChange,
  onCutChange,
  onSidesChange,
  onQuantitySelect,
  onCustomQtyChange,
  frontFile,
  backFile,
  frontPreview,
  backPreview,
  onFrontUpload,
  onBackUpload,
  onFrontRemove,
  onBackRemove,
  ctaDisabled,
  ctaLabel,
  onContinue,
}: Props) {
  const tiers: PriceTier[] = selectedVariant?.prices ?? [];
  const minQty = product.min_order_qty || 1;
  const sidesMultiplier = Number(selectedSides) || 1;

  const [selectedTierId, setSelectedTierId] = useState<string>(() => tiers[0]?.id ?? "");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [noDesignOpen, setNoDesignOpen] = useState(false);

  useEffect(() => {
    if (selectedQuantity && tiers.find((t) => t.id === selectedQuantity)) {
      setSelectedTierId(selectedQuantity);
    } else if (tiers.length > 0) {
      setSelectedTierId(tiers[0].id);
    }
  }, [selectedQuantity, tiers]);

  const activeTier = tiers.find((t) => t.id === selectedTierId) ?? tiers[0] ?? null;
  const baseUnitPrice = activeTier?.price ?? 0;
  const qty = activeTier?.min_qty ?? 0;
  const total = baseUnitPrice * sidesMultiplier * qty;

  const handleQtyDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTierId(id);
    onQuantitySelect(id);
    const tier = tiers.find((t) => t.id === id);
    if (tier) onCustomQtyChange(String(tier.min_qty));
  };

  const getTierLabel = (t: PriceTier) => {
    const range = t.max_qty && t.max_qty !== t.min_qty ? `${t.min_qty}–${t.max_qty}` : `${t.min_qty}+`;
    const effectivePrice = t.price * sidesMultiplier;
    return sidesMultiplier > 1
      ? `${range} pcs — ₹${t.price.toFixed(2)} × ${sidesMultiplier} = ₹${effectivePrice.toFixed(2)}/pc`
      : `${range} pcs — ₹${t.price.toFixed(2)}/pc`;
  };

  const selectedTierLabel = activeTier ? getTierLabel(activeTier) : "";
  const canOrder = qty >= minQty && total > 0;

  const handleNoDesignSubmit = (data: NoDesignFormData) => {
    console.log("No design order:", { ...data, product: product.name, selectedSize, total });
    // TODO: send to API
  };
  const userId = localStorage.getItem("user_id");

  return (
    <>
      <div className="space-y-6">
        {/* Product header */}
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-normal text-neutral-900 mb-3">{product.name}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Stars rating={Number(product.rating || 4.2)} size="md" />
            <span className="text-sm font-bold text-neutral-800">{product.rating || 4.2}</span>
            <span className="text-sm text-neutral-400">({product.review_count || 90} reviews)</span>
          </div>
        </div>

        {/* Price card */}
        <PriceCard unitPrice={baseUnitPrice} qty={qty} total={total} sides={selectedSides} />

        {/* Configure header */}
        <div className="pb-4 border-b border-neutral-100">
          <h2 className="text-xl font-normal text-neutral-900">Configure Your Order</h2>
          <p className="text-xs text-neutral-400 mt-1.5 font-medium">
            Select size — paper, print &amp; cut auto-update to a valid match.
          </p>
        </div>

        {/* Row 1: Size + Paper */}
        <div className="grid grid-cols-2 gap-4">
          {allSizes.length > 0 && (
            <div>
              <SectionLabel label="Size" hint="Dimensions" />
              <select className={selectClass} value={selectedSize} onChange={(e) => onSizeChange(e.target.value)}>
                {allSizes.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}{s.dimensions ? ` (${s.dimensions})` : ""}</option>
                ))}
              </select>
            </div>
          )}
          {availablePaperTypes.length > 0 && (
            <div>
              <SectionLabel label="Paper Type" />
              <select className={selectClass} value={selectedPaperType} onChange={(e) => onPaperChange(e.target.value)}>
                {availablePaperTypes.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Row 2: Print + Cut */}
        <div className="grid grid-cols-2 gap-4">
          {availablePrintTypes.length > 0 && (
            <div>
              <SectionLabel label="Print Type" />
              <select className={selectClass} value={selectedPrintType} onChange={(e) => onPrintChange(e.target.value)}>
                {availablePrintTypes.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
          )}
          {availableCutTypes.length > 0 && (
            <div>
              <SectionLabel label="Cut Type" />
              <select className={selectClass} value={selectedCutType} onChange={(e) => onCutChange(e.target.value)}>
                {availableCutTypes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* Row 3: Sides + Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <SectionLabel label="Printing Sides" />
            <select className={selectClass} value={selectedSides} onChange={(e) => onSidesChange(e.target.value)}>
              {SIDES_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          {tiers.length > 0 && (
            <div>
              <SectionLabel label="Quantity" hint="Best rate auto-applied" />
              <select className={selectClass} value={selectedTierId} onChange={handleQtyDropdownChange}>
                {tiers.map((t) => <option key={t.id} value={t.id}>{getTierLabel(t)}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            disabled={!canOrder}
            onClick={() => setUploadOpen(true)}
            style={{ background: "#D73D32" }}
            className="h-14 rounded-2xl text-white font-semibold
                       flex flex-col items-center justify-center gap-1 px-3
                       transition-all duration-150 hover:opacity-90 active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span className="text-xs font-bold">Upload Design</span>
            </div>
            {total > 0 && <span className="text-[10px] text-white/60">₹{fmt(total)}</span>}
          </button>

          <button
            type="button"
            disabled={!canOrder}
            onClick={() => setNoDesignOpen(true)}
            className="h-14 rounded-2xl font-semibold border-2
                       flex flex-col items-center justify-center gap-1 px-3
                       transition-all duration-150 hover:bg-red-50 active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed bg-white"
            style={{ borderColor: "#D73D32", color: "#D73D32" }}
          >
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-xs font-bold">No Design</span>
            </div>
            {total > 0 && <span className="text-[10px]" style={{ color: "#D73D32", opacity: 0.6 }}>₹{fmt(total)}</span>}
          </button>
        </div>

        <p className="text-center text-[10px] text-neutral-400 -mt-3">
          No design? Our team will help you create one.
        </p>
      </div>


      <div className="space-y-6">
        <UploadScreen
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          product={product}
          selectedSides={selectedSides}
          selectedSize={selectedSize}
          selectedPaperType={selectedPaperType}
          selectedPrintType={selectedPrintType}
          selectedCutType={selectedCutType}
          selectedTierLabel={selectedTierLabel}
          total={total}
          frontFile={frontFile}
          backFile={backFile}
          frontPreview={frontPreview}
          backPreview={backPreview}
          onFrontUpload={onFrontUpload}
          onBackUpload={onBackUpload}
          onFrontRemove={onFrontRemove}
          onBackRemove={onBackRemove}
          ctaDisabled={ctaDisabled}
          ctaLabel={ctaLabel}
          onContinue={onContinue}
        />

        {/* Full-screen No Design */}
        <NoDesignScreen
          open={noDesignOpen}
          onClose={() => setNoDesignOpen(false)}
          product={product}
          selectedSize={selectedSize}
          selectedPaperType={selectedPaperType}
          selectedPrintType={selectedPrintType}
          selectedCutType={selectedCutType}
          selectedSides={selectedSides}
          selectedTierLabel={selectedTierLabel}
          total={total}
          userId={userId || undefined}
          selectedVariant={selectedVariant}
          selectedQuantity={selectedQuantity}
          onSubmit={handleNoDesignSubmit}
        />
      </div>
      {/* Full-screen Upload */}

    </>
  );
}