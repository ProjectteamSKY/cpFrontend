// import React from "react";
// import { ArrowRight } from "lucide-react";
// import { VariantOption } from "../../hooks/useproductdetail";
// import UploadZone from "../../components/product/UploadZone";
// import OrderSummaryStrip from "../../components/product/OrderSummary";

import { ArrowRight, FileImage, ImagePlus, Trash2, X } from "lucide-react";
import {useCallback, useEffect, useRef, useState } from "react";
import { Product } from "../../types/productlist";
import { fmt } from "./Configurepanel";

// interface Props {
//   selectedSides: string;
//   frontFile: File | null;
//   backFile: File | null;
//   frontPreview: string | null;
//   backPreview: string | null;
//   onFrontUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBackUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onFrontRemove: () => void;
//   onBackRemove: () => void;
//   selectedVariant: VariantOption | null;
//   selectedQuantity: string;
//   useCustomQty: boolean;
//   customQty: string;
//   totalPrice: number;
//   ctaDisabled: boolean;
//   ctaLabel: string;
//   onContinue: () => void;
// }

// export function UploadPanel({
//   selectedSides,
//   frontFile,
//   backFile,
//   frontPreview,
//   backPreview,
//   onFrontUpload,
//   onBackUpload,
//   onFrontRemove,
//   onBackRemove,
//   selectedVariant,
//   selectedQuantity,
//   useCustomQty,
//   customQty,
//   totalPrice,
//   ctaDisabled,
//   ctaLabel,
//   onContinue,
// }: Props) {
//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="pb-4 border-b border-neutral-100">
//         <h2 className="product-name text-xl font-normal text-neutral-900">Upload Your Design</h2>
//         <p className="text-xs text-neutral-400 mt-1.5 font-medium">
//           High-resolution artwork recommended (PDF, AI, PNG at 300dpi+).
//         </p>
//       </div>

//       {/* Front */}
//       <UploadZone
//         label="Front Design"
//         file={frontFile}
//         preview={frontPreview}
//         onUpload={onFrontUpload}
//         onRemove={onFrontRemove}
//       />

//       {/* Back (conditional) */}
//       {selectedSides === "2" && (
//         <UploadZone
//           label="Back Design"
//           file={backFile}
//           preview={backPreview}
//           onUpload={onBackUpload}
//           onRemove={onBackRemove}
//         />
//       )}

//       {/* Order summary */}
//       <OrderSummaryStrip
//         variant={selectedVariant}
//         quantityId={selectedQuantity}
//         useCustomQty={useCustomQty}
//         customQty={customQty}
//         totalPrice={totalPrice}
//         frontFile={frontFile}
//         sides={selectedSides}
//         backFile={backFile}
//       />

//       {/* Desktop CTA */}
//       <button
//         onClick={onContinue}
//         disabled={ctaDisabled}
//         className="hidden lg:flex w-full items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-300
//           bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5
//           disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
//       >
//         <span>{ctaLabel}</span>
//         {!ctaDisabled && <ArrowRight className="w-4 h-4" />}
//       </button>
//     </div>
//   );
// }


interface UploadZoneProps {
  label: string;
  file: File | null;
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function UploadZone({ label, file, preview, onUpload, onRemove }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const f = files[0];
      if (f) onUpload(f);
    },
    [onUpload]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  if (file && preview) {
    return (
      <div className="rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-[#D73D32]" />
            <span className="text-xs font-semibold text-neutral-700">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-semibold text-[#D73D32] hover:underline"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="relative bg-neutral-100" style={{ minHeight: 180 }}>
          <img
            src={preview}
            alt={label}
            className="w-full object-contain"
            style={{ maxHeight: 260 }}
          />
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg truncate max-w-[70%]">
              {file.name}
            </span>
            <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf,.ai,.eps"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer
        ${dragging ? "border-[#D73D32] bg-red-50" : "border-neutral-200 bg-white hover:border-[#D73D32] hover:bg-red-50/30"}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-10 px-6 gap-3 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(215,61,50,0.08)" }}
        >
          <ImagePlus className="w-7 h-7" style={{ color: "#D73D32" }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-800">{label}</p>
          <p className="text-xs text-neutral-400 mt-1">
            Click or drag & drop · PDF, AI, PNG, JPG (300dpi+)
          </p>
        </div>
        <span
          className="px-5 py-2 rounded-xl text-white text-xs font-semibold"
          style={{ background: "#D73D32" }}
        >
          Choose File
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf,.ai,.eps"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full-screen Upload Panel
// ---------------------------------------------------------------------------
interface UploadScreenProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  selectedSides: string;
  selectedSize: string;
  selectedPaperType: string;
  selectedPrintType: string;
  selectedCutType: string;
  selectedTierLabel: string;
  total: number;
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

export default function UploadScreen({
  open,
  onClose,
  product,
  selectedSides,
  selectedSize,
  selectedPaperType,
  selectedPrintType,
  selectedCutType,
  selectedTierLabel,
  total,
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
}: UploadScreenProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isReady =
    frontFile !== null && (selectedSides !== "2" || backFile !== null);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-neutral-100"
        style={{ background: "#D73D32" }}
      >
        <div>
          <h3 className="text-base font-bold text-white">Upload Your Design</h3>
          <p className="text-xs text-white/60 mt-0.5">{product.name}</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

          {/* Order config strip */}
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
              Your Configuration
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {[
                ["Product", product.name],
                ["Size", selectedSize],
                ["Paper", selectedPaperType],
                ["Print", selectedPrintType],
                ["Cut", selectedCutType],
                ["Sides", selectedSides === "2" ? "Double Sided" : "Single Sided"],
                ["Quantity", selectedTierLabel],
                ["Total", `₹${fmt(total)}`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-neutral-400">{label}</span>
                  <span className="font-semibold text-neutral-700 text-right max-w-[60%] truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upload zones */}
          <UploadZone
            label="Front Design"
            file={frontFile}
            preview={frontPreview}
            onUpload={onFrontUpload}
            onRemove={onFrontRemove}
          />

          {selectedSides === "2" && (
            <UploadZone
              label="Back Design"
              file={backFile}
              preview={backPreview}
              onUpload={onBackUpload}
              onRemove={onBackRemove}
            />
          )}

          {/* Specs note */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">File Requirements</p>
            <ul className="text-xs text-amber-600 space-y-0.5 list-disc list-inside">
              <li>300 DPI or higher for best print quality</li>
              <li>PDF, AI, EPS, PNG or JPG accepted</li>
              <li>Include bleed area (3mm recommended)</li>
              <li>CMYK color mode preferred</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="px-5 py-4 border-t border-neutral-100 bg-white shrink-0">
        <div className="max-w-lg mx-auto space-y-3">
          {!isReady && (
            <p className="text-center text-xs text-neutral-400">
              {selectedSides === "2"
                ? "Upload both front and back designs to continue"
                : "Upload your front design to continue"}
            </p>
          )}
          <button
            onClick={() => { onContinue(); onClose(); }}
            disabled={!isReady || ctaDisabled}
            className="w-full h-13 rounded-2xl text-white font-bold text-sm
                       flex items-center justify-center gap-2.5 transition-all
                       hover:opacity-90 active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#D73D32" }}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


