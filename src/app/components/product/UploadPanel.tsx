import React from "react";
import { ArrowRight } from "lucide-react";
import { VariantOption } from "../../hooks/useproductdetail";
import UploadZone from "../../components/product/UploadZone";
import OrderSummaryStrip from "../../components/product/OrderSummary";

interface Props {
  selectedSides: string;
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
  onFrontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBackUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrontRemove: () => void;
  onBackRemove: () => void;
  selectedVariant: VariantOption | null;
  selectedQuantity: string;
  useCustomQty: boolean;
  customQty: string;
  totalPrice: number;
  ctaDisabled: boolean;
  ctaLabel: string;
  onContinue: () => void;
}

export function UploadPanel({
  selectedSides,
  frontFile,
  backFile,
  frontPreview,
  backPreview,
  onFrontUpload,
  onBackUpload,
  onFrontRemove,
  onBackRemove,
  selectedVariant,
  selectedQuantity,
  useCustomQty,
  customQty,
  totalPrice,
  ctaDisabled,
  ctaLabel,
  onContinue,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pb-4 border-b border-neutral-100">
        <h2 className="product-name text-xl font-normal text-neutral-900">Upload Your Design</h2>
        <p className="text-xs text-neutral-400 mt-1.5 font-medium">
          High-resolution artwork recommended (PDF, AI, PNG at 300dpi+).
        </p>
      </div>

      {/* Front */}
      <UploadZone
        label="Front Design"
        file={frontFile}
        preview={frontPreview}
        onUpload={onFrontUpload}
        onRemove={onFrontRemove}
      />

      {/* Back (conditional) */}
      {selectedSides === "2" && (
        <UploadZone
          label="Back Design"
          file={backFile}
          preview={backPreview}
          onUpload={onBackUpload}
          onRemove={onBackRemove}
        />
      )}

      {/* Order summary */}
      <OrderSummaryStrip
        variant={selectedVariant}
        quantityId={selectedQuantity}
        useCustomQty={useCustomQty}
        customQty={customQty}
        totalPrice={totalPrice}
        frontFile={frontFile}
        sides={selectedSides}
        backFile={backFile}
      />

      {/* Desktop CTA */}
      <button
        onClick={onContinue}
        disabled={ctaDisabled}
        className="hidden lg:flex w-full items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-300
          bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5
          disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
      >
        <span>{ctaLabel}</span>
        {!ctaDisabled && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}