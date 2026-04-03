// components/product/UploadZone.tsx
import React, { useRef, useState, useCallback } from "react";
import { FileImage, ImagePlus, Trash2 } from "lucide-react";

interface UploadZoneProps {
  label: string;
  file: File | null;
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export default function UploadZone({
  label,
  file,
  preview,
  onUpload,
  onRemove,
}: UploadZoneProps) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  // ── Filled state ──────────────────────────────────────────────────────────
  if (file && preview) {
    return (
      <div className="rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-[#D73D32]" />
            <span className="text-xs font-semibold text-neutral-700">
              {label}
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

  // ── Empty / drop state ────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer
        ${
          dragging
            ? "border-[#D73D32] bg-red-50"
            : "border-neutral-200 bg-white hover:border-[#D73D32] hover:bg-red-50/30"
        }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
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
            Click or drag &amp; drop · PDF, AI, PNG, JPG (300 dpi+)
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