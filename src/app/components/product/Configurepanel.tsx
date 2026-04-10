// ConfigurePanel.tsx
import React, { useState, useEffect } from "react";
import { ShoppingCart, Upload, Zap, AlertCircle } from "lucide-react";
import { Product } from "../../types/productlist";
import SectionLabel from "../../components/product/sectionLabel";
import { Stars } from "./Stars";
import NoDesignScreen from "./Nodesignscreen";
import type { NoDesignFormData } from "./Nodesignscreen";
import UploadScreen from "./UploadPanel";
// ---------------------------------------------------------------------------
// Types based on API response
// ---------------------------------------------------------------------------

interface AttributeValue {
  attribute_value_id: string;
  attribute_value_name: string;
}

interface Attribute {
  attribute_id: string;
  attribute_name: string;
  values: AttributeValue[];
}

interface PriceTier {
  min_qty: number;
  max_qty?: number;
  price: number;
}

interface Variant {
  variant_id: string;
  attributes: Attribute[];
  prices: PriceTier[];
}

interface FullDetailsResponse {
  status: string;
  data: {
    product_id: string;
    variants: Variant[];
  };
}

interface SelectedConfiguration {
  [key: string]: string;
}

interface Props {
  product: Product;
  productId: string;
  onConfigurationChange?: (config: SelectedConfiguration) => void;
  onPriceChange?: (price: number, qty: number) => void;
  priceCardConfig?: {
    headerText?: string;
    bestRateText?: string;
    bestRateColor?: string;
    unitPriceLabel?: string;
    quantityLabel?: string;
    totalLabel?: string;
    taxText?: string;
    currencySymbol?: string;
  };
  buttonConfig?: {
    uploadLabel?: string;
    noDesignLabel?: string;
    helperText?: string;
  };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Price Card Component - Fully Dynamic
// ---------------------------------------------------------------------------
interface PriceCardProps {
  unitPrice: number;
  qty: number;
  total: number;
  config?: {
    headerText?: string;
    bestRateText?: string;
    bestRateColor?: string;
    unitPriceLabel?: string;
    quantityLabel?: string;
    totalLabel?: string;
    taxText?: string;
    currencySymbol?: string;
  };
}

function PriceCard({ unitPrice, qty, total, config = {} }: PriceCardProps) {
  const {
    headerText = "Price Summary",
    bestRateText = "Best rate applied",
    bestRateColor = "#ffd6d4",
    unitPriceLabel = "Unit price",
    quantityLabel = "Quantity",
    totalLabel = "Total",
    taxText = "incl. all taxes",
    currencySymbol = "₹"
  } = config;

  return (
    <div className="rounded-2xl border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#D73D32" }}>
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{headerText}</p>
        {unitPrice > 0 && (
          <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: bestRateColor }}>
            <Zap className="w-3 h-3" />
            {bestRateText}
          </span>
        )}
      </div>
      <div className="px-5 py-4 space-y-2.5 bg-white">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">{unitPriceLabel}</span>
          <span className="font-semibold text-neutral-800">
            {unitPrice > 0 ? `${currencySymbol}${fmt(unitPrice)} / pc` : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500">{quantityLabel}</span>
          <span className="font-semibold text-neutral-800">
            {qty > 0 ? `${qty.toLocaleString("en-IN")} pcs` : "—"}
          </span>
        </div>
        <div className="border-t border-dashed border-neutral-200 pt-2.5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{totalLabel}</p>
              <p className="text-3xl font-bold text-neutral-900 tracking-tight leading-none">
                {total > 0 ? `${currencySymbol}${fmt(total)}` : `${currencySymbol}0.00`}
              </p>
            </div>
            {unitPrice > 0 && qty > 0 && (
              <p className="text-[10px] text-neutral-400 font-medium mb-0.5">{taxText}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main ConfigurePanel Component - Fully Dynamic
// ---------------------------------------------------------------------------
export function ConfigurePanel({
  product,
  productId,
  onConfigurationChange,
  onPriceChange,
  priceCardConfig,
  buttonConfig = {}
}: Props) {
  // State for API data
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic state for selected attribute values
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<number>(0);

  // UI state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [noDesignOpen, setNoDesignOpen] = useState(false);

  // Upload state
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const {
    uploadLabel = "Upload Design",
    noDesignLabel = "No Design",
    helperText = "No design? Our team will help you create one."
  } = buttonConfig;

  // Get all unique attribute names from variants
  const getAllAttributeNames = (): string[] => {
    const attributeNames = new Set<string>();
    variants.forEach(variant => {
      variant.attributes.forEach(attr => {
        attributeNames.add(attr.attribute_name);
      });
    });
    return Array.from(attributeNames);
  };

  // Get available options for a specific attribute from all variants
  const getAttributeOptions = (attributeName: string): AttributeValue[] => {
    const options = new Map<string, AttributeValue>();
    variants.forEach(variant => {
      const attr = variant.attributes.find(a => a.attribute_name === attributeName);
      if (attr) {
        attr.values.forEach(value => {
          options.set(value.attribute_value_id, value);
        });
      }
    });
    return Array.from(options.values());
  };

  // Find variant that matches all selected attributes
  const findMatchingVariant = (attributes: Record<string, string>): Variant | null => {
    for (const variant of variants) {
      let matches = true;

      for (const [attrName, attrValue] of Object.entries(attributes)) {
        const attr = variant.attributes.find(a => a.attribute_name === attrName);
        if (!attr) {
          matches = false;
          break;
        }

        const hasValue = attr.values.some(v => v.attribute_value_name === attrValue);
        if (!hasValue) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return variant;
      }
    }
    return null;
  };

  // Handle attribute change dynamically
  const handleAttributeChange = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedTierId(0);

      if (onConfigurationChange) {
        onConfigurationChange(newAttributes);
      }
    }
  };

  // Get current price tier
  const currentTier = selectedVariant?.prices[selectedTierId] || selectedVariant?.prices[0];
  const unitPrice = currentTier?.price || 0;
  const quantity = currentTier?.min_qty || 0;
  const totalPrice = unitPrice * quantity;

  // Get tier label for display
  const getTierLabel = (tier: PriceTier, index: number) => {
    const range = tier.max_qty && tier.max_qty !== tier.min_qty
      ? `${tier.min_qty}–${tier.max_qty}`
      : `${tier.min_qty}+`;
    return `${range} pcs — ₹${tier.price}/pc`;
  };

  // Check if all required attributes are selected
  const areAllAttributesSelected = (): boolean => {
    const attributeNames = getAllAttributeNames();
    return attributeNames.every(attrName => selectedAttributes[attrName]);
  };

  // Determine selected sides based on print location attribute
  const getSelectedSides = (): string => {
    const printLocation = selectedAttributes["print location"];

    // Check if print location includes both front and back
    if (printLocation) {
      if (printLocation === "front" || printLocation === "back") {
        return "1";
      }
      // If print location value contains both (e.g., "front, back" or similar)
      if (printLocation.includes("front") && printLocation.includes("back")) {
        return "2";
      }
    }

    // Check available options for print location
    const printLocationAttr = variants.find(v =>
      v.attributes.some(a => a.attribute_name === "print location")
    );

    if (printLocationAttr) {
      const attr = printLocationAttr.attributes.find(a => a.attribute_name === "print location");
      if (attr) {
        const hasFront = attr.values.some(v => v.attribute_value_name === "front");
        const hasBack = attr.values.some(v => v.attribute_value_name === "back");
        if (hasFront && hasBack) {
          // Default to single sided if both are available
          return "1";
        }
      }
    }

    return "1";
  };

  // Fetch product variants on mount
  useEffect(() => {
    fetchProductVariants();
  }, [productId]);

  const fetchProductVariants = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/api/variant_attribute_value/product/${productId}/full-details`
      );
      const data: FullDetailsResponse = await response.json();

      if (data.status === "success" && data.data.variants.length > 0) {
        setVariants(data.data.variants);

        const firstVariant = data.data.variants[0];
        const defaultAttributes: Record<string, string> = {};
        firstVariant.attributes.forEach(attr => {
          if (attr.values.length > 0) {
            defaultAttributes[attr.attribute_name] = attr.values[0].attribute_value_name;
          }
        });
        setSelectedAttributes(defaultAttributes);
        setSelectedVariant(firstVariant);

        if (onConfigurationChange) {
          onConfigurationChange(defaultAttributes);
        }
      } else {
        setError("No variants found for this product");
      }
    } catch (err) {
      setError("Failed to load product configuration");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle file uploads
  const handleFrontUpload = (file: File) => {
    setFrontFile(file);
    const preview = URL.createObjectURL(file);
    setFrontPreview(preview);
  };

  const handleBackUpload = (file: File) => {
    setBackFile(file);
    const preview = URL.createObjectURL(file);
    setBackPreview(preview);
  };

  const handleFrontRemove = () => {
    if (frontPreview) URL.revokeObjectURL(frontPreview);
    setFrontFile(null);
    setFrontPreview(null);
  };

  const handleBackRemove = () => {
    if (backPreview) URL.revokeObjectURL(backPreview);
    setBackFile(null);
    setBackPreview(null);
  };

  const handleNoDesignSubmit = (data: NoDesignFormData) => {
    console.log("No design order:", {
      ...data,
      product: product.name,
      selectedAttributes,
      quantity,
      totalPrice
    });
  };

  const handleUploadContinue = (uploadedFiles?: any) => {
    console.log("Continue with upload", {
      selectedAttributes,
      quantity,
      totalPrice,
      uploadedFiles
    });
    setUploadOpen(false);
    // Here you would typically navigate to cart or next step
  };

  const selectedTierLabel = currentTier ? getTierLabel(currentTier, selectedTierId) : "";
  const canOrder = quantity > 0 && totalPrice > 0 && areAllAttributesSelected();
  const attributeNames = getAllAttributeNames();
  const selectedSides = getSelectedSides();

  // Notify parent when price changes
  useEffect(() => {
    if (onPriceChange && totalPrice > 0) {
      onPriceChange(totalPrice, quantity);
    }
  }, [totalPrice, quantity, onPriceChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="relative w-10 h-10 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100" />
            <div className="absolute inset-0 rounded-full border-[3px] border-neutral-900 border-t-transparent animate-spin" />
          </div>
          <p className="text-xs text-neutral-400 font-semibold">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-neutral-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Configuration Error</h2>
            <p className="text-sm text-neutral-400 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Product header */}
        <div>
          <h1 className="text-[2rem] leading-[1.1] font-normal text-neutral-900 mb-3">
            {product.name}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <Stars rating={Number(product.rating || 4.2)} size="md" />
            <span className="text-sm font-bold text-neutral-800">
              {product.rating || 4.2}
            </span>
            <span className="text-sm text-neutral-400">
              ({product.review_count || 90} reviews)
            </span>
          </div>
        </div>

        {/* Price card */}
        <PriceCard
          unitPrice={unitPrice}
          qty={quantity}
          total={totalPrice}
          config={priceCardConfig}
        />

        {/* Configure header */}
        <div className="pb-4 border-b border-neutral-100">
          <h2 className="text-xl font-normal text-neutral-900">Configure Your Order</h2>
          <p className="text-xs text-neutral-400 mt-1.5 font-medium">
            Select the options below to customize your product
          </p>
        </div>

        {/* Dynamically render all attribute dropdowns */}
        <div className="space-y-4">
          {attributeNames.map((attributeName) => {
            const options = getAttributeOptions(attributeName);
            const currentValue = selectedAttributes[attributeName] || "";

            return (
              <div key={attributeName}>
                <SectionLabel
                  label={attributeName}
                  hint={attributeName === "Sizes" ? "Dimensions" : ""}
                />
                <select
                  className={selectClass}
                  value={currentValue}
                  onChange={(e) => handleAttributeChange(attributeName, e.target.value)}
                >
                  <option value="">Select {attributeName.toLowerCase()}</option>
                  {options.map((option) => (
                    <option key={option.attribute_value_id} value={option.attribute_value_name}>
                      {option.attribute_value_name}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}

          {/* Quantity Tiers - Dynamic based on selected variant */}
          {selectedVariant && selectedVariant.prices.length > 0 && (
            <div>
              <SectionLabel label="Quantity" hint="Best rate auto-applied" />
              <select
                className={selectClass}
                value={selectedTierId}
                onChange={(e) => setSelectedTierId(Number(e.target.value))}
              >
                {selectedVariant.prices.map((tier, index) => (
                  <option key={index} value={index}>
                    {getTierLabel(tier, index)}
                  </option>
                ))}
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
              <span className="text-xs font-bold">{uploadLabel}</span>
            </div>
            {totalPrice > 0 && (
              <span className="text-[10px] text-white/60">₹{fmt(totalPrice)}</span>
            )}
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
              <span className="text-xs font-bold">{noDesignLabel}</span>
            </div>
            {totalPrice > 0 && (
              <span className="text-[10px]" style={{ color: "#D73D32", opacity: 0.6 }}>
                ₹{fmt(totalPrice)}
              </span>
            )}
          </button>
        </div>

        <p className="text-center text-[10px] text-neutral-400 -mt-3">
          {helperText}
        </p>
      </div>

      {/* Upload Screen Modal */}
      <UploadScreen
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        product={product}
        selectedSides={selectedSides}
        selectedAttributes={selectedAttributes}  // Pass all attributes dynamically
        selectedTierLabel={selectedTierLabel}
        total={totalPrice}
        frontFile={frontFile}
        backFile={backFile}
        frontPreview={frontPreview}
        backPreview={backPreview}
        onFrontUpload={handleFrontUpload}
        onBackUpload={handleBackUpload}
        onFrontRemove={handleFrontRemove}
        onBackRemove={handleBackRemove}
        ctaDisabled={!canOrder}
        ctaLabel="Continue to Cart"
        onContinue={handleUploadContinue}
      />

      {/* No Design Screen Modal */}
      <NoDesignScreen
        open={noDesignOpen}
        onClose={() => setNoDesignOpen(false)}
        product={product}
        selectedAttributes={selectedAttributes}
        sidesMultiplier={selectedSides === "2" ? 2 : 1}
        selectedTierLabel={selectedTierLabel}
        total={totalPrice}
        userId={localStorage.getItem("user_id") || undefined}
        selectedVariant={selectedVariant ? {
          id: selectedVariant.variant_id,
          name: Object.entries(selectedAttributes).map(([key, val]) => `${key}: ${val}`).join(", "),
          prices: selectedVariant.prices.map(price => ({
            min_qty: price.min_qty,
            max_qty: price.max_qty,
            price: price.price,
            id: `${price.min_qty}-${price.max_qty || 'plus'}`
          }))
        } : null}
        selectedQuantity={String(quantity)}
        onSubmit={handleNoDesignSubmit}
      />
    </>
  );
}