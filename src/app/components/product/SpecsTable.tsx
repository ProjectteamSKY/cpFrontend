import React from "react";
import { FileText } from "lucide-react";
import { VariantOption } from "../../hooks/useproductdetail";

interface Props {
  variants: VariantOption[];
  selectedVariant: VariantOption | null;
  selectedQuantity: string;
}

export function SpecsTable({ variants, selectedVariant, selectedQuantity }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
      {/* Header */}
      <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-neutral-400" />
          <h2 className="product-name text-xl font-normal text-neutral-900">Product Specifications</h2>
        </div>
        <p className="text-xs text-neutral-400 font-medium">
          All variant combinations and available pricing tiers.
        </p>
      </div>

      {/* Table */}
      <div className="p-6 lg:p-8">
        <div className="overflow-x-auto rounded-2xl border border-neutral-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                {["Size", "Paper", "Print", "Cut", "Sides", "Min Qty", "Price"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {variants.flatMap((v) =>
                v.prices.map((p) => (
                  <tr
                    key={`${v.id}-${p.id}`}
                    className={`transition-colors cursor-pointer hover:bg-neutral-50 ${
                      selectedVariant?.id === v.id && selectedQuantity === p.id
                        ? "bg-blue-50/40"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-bold text-neutral-800 whitespace-nowrap">{v.size.name}</td>
                    <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.paperType.name}</td>
                    <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.printType.name}</td>
                    <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.cutType.name}</td>
                    <td className="px-4 py-3.5 text-neutral-500">{v.sides === 1 ? "Single" : "Double"}</td>
                    <td className="px-4 py-3.5 text-neutral-500">{p.min_qty}+</td>
                    <td className="px-4 py-3.5 font-bold text-neutral-900">₹{p.price.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}