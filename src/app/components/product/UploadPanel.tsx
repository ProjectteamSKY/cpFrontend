// UploadScreen.tsx - FIXED VERSION
import { ArrowRight, FileImage, ImagePlus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Product } from "../../types/productlist";
import { fmt } from "./Configurepanel";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface UploadZoneProps {
  label: string;
  file: File | null;
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  required?: boolean;
}

interface AttributeMetadata {
  attribute_id: string;
  attribute_value_id: string;
  attribute_value_name: string;
}

// ✅ FIX: Define return type for uploaded files
export interface UploadedFilesData {
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
}

interface UploadScreenProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  selectedSides: string;
  selectedAttributes: Record<string, string>;
  attributeMetadata?: Record<string, AttributeMetadata>;
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
  // ✅ FIX: Update callback to accept files object
  onContinue: (uploadedFiles?: UploadedFilesData) => void;
  selectedVariant?: any;
  selectedTierId?: string;
}

// ---------------------------------------------------------------------------
// Upload Zone Component
// ---------------------------------------------------------------------------
function UploadZone({ label, file, preview, onUpload, onRemove, required = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const f = files[0];
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/postscript'];
      if (!allowedTypes.includes(f.type) && !f.name.match(/\.(ai|eps)$/i)) {
        alert("Invalid file type. Please upload PNG, JPG, PDF, AI, or EPS files.");
        return;
      }
      
      if (f.size > 10 * 1024 * 1024) {
        alert("File too large. Maximum size is 10MB.");
        return;
      }
      
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
    e.target.value = "";
  };

  if (file && preview) {
    return (
      <div className="rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-[#D73D32]" />
            <span className="text-xs font-semibold text-neutral-700">
              {label} {required && <span className="text-red-500">*</span>}
            </span>
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
    <div>
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
            <p className="text-sm font-semibold text-neutral-800">
              {label} {required && <span className="text-red-500">*</span>}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Click or drag & drop · PDF, AI, PNG, JPG (300dpi+, max 10MB)
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Upload Screen Component
// ---------------------------------------------------------------------------
export default function UploadScreen({
  open,
  onClose,
  product,
  selectedSides,
  selectedAttributes,
  attributeMetadata,
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
  selectedVariant,
  selectedTierId,
}: UploadScreenProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const validatePrintLocation = (): { valid: boolean; message: string } => {
    const printLocation = selectedAttributes["print location"];
    
    if (printLocation && typeof printLocation === "string") {
      if (printLocation === "front" && !frontFile) {
        return { valid: false, message: "Front design is required for front-only printing" };
      }
      if (printLocation === "back" && !backFile) {
        return { valid: false, message: "Back design is required for back-only printing" };
      }
      if (printLocation.toLowerCase().includes("front") && printLocation.toLowerCase().includes("back")) {
        if (!frontFile || !backFile) {
          return { valid: false, message: "Both front and back designs are required" };
        }
      }
    }
    
    if (selectedSides === "2") {
      if (!frontFile || !backFile) {
        return { valid: false, message: "Both front and back designs are required for double-sided printing" };
      }
    } else {
      if (!frontFile) {
        return { valid: false, message: "Front design is required" };
      }
    }
    
    return { valid: true, message: "" };
  };

  const isReady = () => {
    const validation = validatePrintLocation();
    return validation.valid && !ctaDisabled;
  };

  // ✅ FIX: Pass files object to parent
  const handleContinue = () => {
    const validation = validatePrintLocation();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // ✅ FIX: Call with files data
    onContinue({
      frontFile,
      backFile,
      frontPreview,
      backPreview,
    });
    onClose();
  };

  const attributeEntries = Object.entries(selectedAttributes);
  const validation = validatePrintLocation();

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
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Product</span>
                <span className="font-semibold text-neutral-700 text-right max-w-[60%] truncate">
                  {product.name}
                </span>
              </div>

              {attributeEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-neutral-400 capitalize">{key}</span>
                  <span className="font-semibold text-neutral-700 text-right max-w-[60%] truncate">
                    {value}
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Print Type</span>
                <span className="font-semibold text-neutral-700 text-right">
                  {selectedSides === "2" ? "Double Sided" : "Single Sided"}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Quantity</span>
                <span className="font-semibold text-neutral-700 text-right">
                  {selectedTierLabel}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Total</span>
                <span className="font-semibold text-neutral-700 text-right">
                  ₹{fmt(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Upload zones */}
          <UploadZone
            label="Front Design"
            file={frontFile}
            preview={frontPreview}
            onUpload={onFrontUpload}
            onRemove={onFrontRemove}
            required={true}
          />

          {(selectedSides === "2" || 
            (selectedAttributes["print location"] && typeof selectedAttributes["print location"] === "string" && 
             (selectedAttributes["print location"] === "back" || selectedAttributes["print location"].toLowerCase().includes("back")))) && (
            <UploadZone
              label="Back Design"
              file={backFile}
              preview={backPreview}
              onUpload={onBackUpload}
              onRemove={onBackRemove}
              required={selectedSides === "2" || selectedAttributes["print location"] === "back"}
            />
          )}

          {!validation.valid && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-xs font-semibold text-red-700">{validation.message}</p>
            </div>
          )}

          {/* Specs note */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">File Requirements</p>
            <ul className="text-xs text-amber-600 space-y-0.5 list-disc list-inside">
              <li>300 DPI or higher for best print quality</li>
              <li>PDF, AI, EPS, PNG or JPG accepted</li>
              <li>Include bleed area (3mm recommended)</li>
              <li>CMYK color mode preferred</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="px-5 py-4 border-t border-neutral-100 bg-white shrink-0">
        <div className="max-w-lg mx-auto space-y-3">
          <button
            onClick={handleContinue}
            disabled={!isReady()}
            className="w-full h-13 rounded-2xl text-white font-bold text-sm
                       flex items-center justify-center gap-2.5 transition-all
                       hover:opacity-90 active:scale-[0.98]
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#D73D32" }}
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>z
      </div>
    </div>
  );
}