// SpecsTable.tsx
import React, { useMemo } from "react";
import { FileText } from "lucide-react";
import { DynamicVariant, PriceTier } from "../../hooks/Useproductdetail";

interface Props {
  variants: any[]; // Original variant data from API
  selectedVariant: DynamicVariant | null;
  selectedQuantity?: string | number;
  selectedAttributes?: Record<string, string>;
}

interface DisplayRow {
  id: string;
  attributes: Record<string, string>;
  prices: PriceTier[];
  variantId: string;
}

export function SpecsTable({ variants, selectedVariant, selectedAttributes = {}, selectedQuantity }: Props) {
  
  // Transform variants into display rows
  const displayRows = useMemo((): DisplayRow[] => {
    if (!variants || variants.length === 0) return [];
    
    return variants.map((variant) => {
      // Build attributes object
      const attributes: Record<string, string> = {};
      variant.attributes?.forEach((attr: any) => {
        if (attr.values && attr.values.length > 0) {
          // Join multiple values with comma
          attributes[attr.attribute_name] = attr.values.map((v: any) => v.attribute_value_name).join(", ");
        }
      });
      
      return {
        id: variant.variant_id,
        attributes,
        prices: variant.prices || [],
        variantId: variant.variant_id,
      };
    });
  }, [variants]);
  
  // Get all unique attribute names across all variants
  const attributeColumns = useMemo(() => {
    const attrSet = new Set<string>();
    displayRows.forEach(row => {
      Object.keys(row.attributes).forEach(attrName => {
        attrSet.add(attrName);
      });
    });
    return Array.from(attrSet);
  }, [displayRows]);
  
  // Check if a row matches the selected attributes
  const matchesSelectedAttributes = (row: DisplayRow): boolean => {
    // If no attributes are selected, no match
    if (Object.keys(selectedAttributes).length === 0) return false;
    
    // Check if all selected attributes match the row's attributes
    for (const [key, value] of Object.entries(selectedAttributes)) {
      const rowValue = row.attributes[key];
      // Handle cases where row might have multiple values (comma-separated)
      if (!rowValue || !rowValue.includes(value)) {
        return false;
      }
    }
    
    return true;
  };
  
  // Check if a specific price tier is selected for this row
  const isPriceTierSelected = (row: DisplayRow, price: PriceTier): boolean => {
    if (!selectedVariant) return false;
    if (row.variantId !== selectedVariant.id) return false;
    if (!matchesSelectedAttributes(row)) return false;
    
    // Check if this price tier matches the selected tier
    if (selectedQuantity !== undefined && selectedQuantity !== null) {
      const selectedTierIndex = typeof selectedQuantity === 'number' ? selectedQuantity : parseInt(selectedQuantity);
      const selectedTier = selectedVariant.prices[selectedTierIndex];
      if (selectedTier) {
        return price.min_qty === selectedTier.min_qty && price.price === selectedTier.price;
      }
    }
    
    // If no specific tier selected, highlight the first tier
    return selectedVariant.prices[0]?.min_qty === price.min_qty;
  };
  
  if (displayRows.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
        <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-neutral-400" />
            <h2 className="product-name text-xl font-normal text-neutral-900">Product Specifications</h2>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            No specifications available for this product.
          </p>
        </div>
        <div className="p-12 text-center">
          <p className="text-sm text-neutral-400">Variant information will appear here once available.</p>
        </div>
      </div>
    );
  }
  
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
                {/* Dynamic attribute columns */}
                {attributeColumns.map((attrName) => (
                  <th
                    key={attrName}
                    className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]"
                  >
                    {attrName}
                  </th>
                ))}
                <th className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]">
                  Min Qty
                </th>
                <th className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]">
                  Max Qty
                </th>
                <th className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]">
                  Price / pc
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {displayRows.flatMap((row) =>
                row.prices.map((price, priceIndex) => {
                  const isRowMatch = matchesSelectedAttributes(row);
                  const isSelected = isRowMatch && isPriceTierSelected(row, price);
                  
                  return (
                    <tr
                      key={`${row.id}-${priceIndex}`}
                      className={`transition-colors ${
                        isSelected 
                          ? "bg-red-50/60 border-l-4 border-l-[#D73D32]" 
                          : isRowMatch 
                            ? "bg-red-50/20" 
                            : "hover:bg-neutral-50"
                      }`}
                    >
                      {/* Dynamic attribute values */}
                      {attributeColumns.map((attrName) => (
                        <td
                          key={attrName}
                          className={`px-4 py-3.5 whitespace-nowrap ${
                            isSelected 
                              ? "font-semibold text-neutral-900" 
                              : "font-medium text-neutral-700"
                          }`}
                        >
                          {row.attributes[attrName] || "—"}
                        </td>
                      ))}
                      <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">
                        {price.min_qty.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600 whitespace-nowrap">
                        {price.max_qty ? price.max_qty.toLocaleString() : "∞"}
                      </td>
                      <td className={`px-4 py-3.5 whitespace-nowrap ${
                        isSelected ? "font-bold text-[#D73D32]" : "font-semibold text-neutral-900"
                      }`}>
                        ₹{price.price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}