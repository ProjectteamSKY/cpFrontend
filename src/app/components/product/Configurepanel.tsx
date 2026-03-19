import React from "react";
import { Edit3, AlertCircle } from "lucide-react";
import { Product } from "../../types/productlist";
import { VariantOption, Size, PaperType, PrintType, CutType } from "../../hooks/useproductdetail";
import SectionLabel from "../../components/product/sectionLabel";
import OptionPill from "../../components/product/OptionPill";

const SIDES_OPTIONS = [
  { label: "Single Sided", value: "1", desc: "Front only"   },
  { label: "Double Sided", value: "2", desc: "Front & back" },
];

interface Props {
  product: Product;
  allSizes: Size[];
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
}

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
  customQtyPrice,
  onSizeChange,
  onPaperChange,
  onPrintChange,
  onCutChange,
  onSidesChange,
  onQuantitySelect,
  onCustomQtyToggle,
  onCustomQtyChange,
}: Props) {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-100">
        <h2 className="product-name text-xl font-normal text-neutral-900">Configure Your Order</h2>
        <p className="text-xs text-neutral-400 mt-1.5 font-medium">
          Select size — paper, print &amp; cut auto-update to a valid match.
        </p>
      </div>

      {/* Size */}
      {allSizes.length > 0 && (
        <div>
          <SectionLabel label="Size" hint="Physical dimensions of the printed card" />
          <div className="grid grid-cols-3 gap-2">
            {allSizes.map((s) => (
              <OptionPill key={s.id} active={selectedSize === s.name} onClick={() => onSizeChange(s.name)}>
                <span className="text-[13px]">{s.name}</span>
                {s.dimensions && (
                  <span className="text-[10px] opacity-60 font-normal mt-0.5">{s.dimensions}</span>
                )}
              </OptionPill>
            ))}
          </div>
        </div>
      )}

      {/* Paper Type */}
      {availablePaperTypes.length > 0 && (
        <div>
          <SectionLabel label="Paper Type" hint="Material and finish of the paper used" />
          <div className="grid grid-cols-3 gap-2">
            {availablePaperTypes.map((p) => (
              <OptionPill key={p.id} active={selectedPaperType === p.name} onClick={() => onPaperChange(p.name)}>
                <span className="text-[13px]">{p.name}</span>
              </OptionPill>
            ))}
          </div>
        </div>
      )}

      {/* Print Type */}
      {availablePrintTypes.length > 0 && (
        <div>
          <SectionLabel label="Print Type" hint="Printing technology used for production" />
          <div className="grid grid-cols-3 gap-2">
            {availablePrintTypes.map((p) => (
              <OptionPill key={p.id} active={selectedPrintType === p.name} onClick={() => onPrintChange(p.name)}>
                <span className="text-[13px]">{p.name}</span>
              </OptionPill>
            ))}
          </div>
        </div>
      )}

      {/* Cut Type */}
      {availableCutTypes.length > 0 && (
        <div>
          <SectionLabel label="Cut Type" hint="Edge finishing style of the final card" />
          <div className="grid grid-cols-3 gap-2">
            {availableCutTypes.map((c) => (
              <OptionPill key={c.id} active={selectedCutType === c.name} onClick={() => onCutChange(c.name)}>
                <span className="text-[13px]">{c.name}</span>
              </OptionPill>
            ))}
          </div>
        </div>
      )}

      {/* Printing Sides */}
      <div>
        <SectionLabel label="Printing Sides" />
        <div className="grid grid-cols-2 gap-2">
          {SIDES_OPTIONS.map((o) => (
            <OptionPill
              key={o.value}
              active={selectedSides === o.value}
              onClick={() => onSidesChange(o.value)}
            >
              <span className="text-[13px]">{o.label}</span>
              <span className="text-[10px] opacity-60 font-normal mt-0.5">{o.desc}</span>
            </OptionPill>
          ))}
        </div>
      </div>

      {/* Quantity */}
      {selectedVariant && selectedVariant.prices.length > 0 && (
        <div>
          <SectionLabel label="Quantity" hint="Choose a tier or enter a custom amount" />
          <div className="grid grid-cols-3 gap-2">
            {selectedVariant.prices.map((price) => (
              <OptionPill
                key={price.id}
                active={!useCustomQty && selectedQuantity === price.id}
                onClick={() => onQuantitySelect(price.id)}
              >
                <span className="text-[13px] font-bold">
                  {price.min_qty}
                  {price.max_qty && price.max_qty !== price.min_qty
                    ? `–${price.max_qty}`
                    : "+"}{" "}
                  pcs
                </span>
                <span
                  className={`text-[11px] font-bold mt-0.5 transition-colors ${
                    !useCustomQty && selectedQuantity === price.id
                      ? "text-white/70"
                      : "text-neutral-400"
                  }`}
                >
                  ₹{price.price.toFixed(2)}
                </span>
              </OptionPill>
            ))}
            <OptionPill active={useCustomQty} onClick={onCustomQtyToggle}>
              <Edit3 className="w-3.5 h-3.5 mb-0.5" />
              <span className="text-[13px]">Custom</span>
              <span className="text-[10px] opacity-60 font-normal mt-0.5">Any qty</span>
            </OptionPill>
          </div>

          {useCustomQty && (
            <div className="mt-3 flex items-center gap-2.5">
              <input
                type="number"
                min={product.min_order_qty || 1}
                value={customQty}
                onChange={(e) => onCustomQtyChange(e.target.value)}
                placeholder={`Min ${product.min_order_qty || 100} pcs`}
                className="flex-1 border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-colors bg-white placeholder-neutral-300"
              />
              {customQtyPrice !== null && (
                <div className="shrink-0 text-right px-3.5 py-2.5 bg-neutral-900 text-white rounded-xl">
                  <p className="text-[9px] text-white/60 uppercase tracking-wider font-bold">Price</p>
                  <p className="text-base font-bold">₹{customQtyPrice.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {customQty &&
            parseInt(customQty) < (product.min_order_qty || 100) &&
            parseInt(customQty) > 0 && (
              <p className="text-[11px] text-amber-600 flex items-center gap-1.5 mt-2 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Minimum order is {product.min_order_qty || 100} pieces.
              </p>
            )}
        </div>
      )}
    </div>
  );
}