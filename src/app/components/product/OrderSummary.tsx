import { Check } from "lucide-react";
import { Product, ProductVariant, VariantPrice } from "../../types/productlist";

interface Size      { id: string; name: string; dimensions?: string }
interface PaperType { id: string; name: string }
interface PrintType { id: string; name: string }
interface CutType   { id: string; name: string }

interface VariantOption {
  id: string;
  variantId: string;
  size: Size;
  paperType: PaperType;
  printType: PrintType;
  cutType: CutType;
  sides: number;
  orientation: string;
  prices: VariantPrice[];
  minPrice: number;
  maxPrice: number;
}

export default function OrderSummaryStrip({
  variant, quantityId, useCustomQty, customQty, totalPrice, frontFile, sides, backFile,
}: {
  variant: VariantOption | null;
  quantityId: string;
  useCustomQty: boolean;
  customQty: string;
  totalPrice: number;
  frontFile: File | null;
  sides: string;
  backFile: File | null;
}) {
  if (!variant) return null;
  const row = variant.prices.find(p => p.id === quantityId);
  const qty = useCustomQty ? customQty : row ? `${row.min_qty}` : "—";

  const items = [
    { label: "Size",   value: variant.size.name       },
    { label: "Paper",  value: variant.paperType.name  },
    { label: "Print",  value: variant.printType.name  },
    { label: "Cut",    value: variant.cutType.name    },
    { label: "Sides",  value: sides === "1" ? "Single" : "Double" },
    { label: "Qty",    value: qty !== "—" ? `${qty} pcs` : "—"   },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-3 border-b border-neutral-100 bg-black">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">Order Summary</p>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-0">
          {items.map(({ label, value }, idx) => (
            <div key={label} className={`py-2 ${idx % 3 !== 2 ? "border-r border-neutral-100 pr-3 mr-3" : ""}`}>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-[11px] font-bold text-neutral-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Design Files</p>
          <div className="flex items-center gap-2">
            {frontFile
              ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Front</span>
              : <span className="text-[10px] text-neutral-300 font-semibold">No design</span>}
            {sides === "2" && (
              backFile
                ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Back</span>
                : <span className="text-[10px] text-amber-500 font-bold">Back required</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}