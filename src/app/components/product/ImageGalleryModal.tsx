import React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getImageUrl } from "../../utils/productutils";

interface Props {
  images: any[];
  selectedIndex: number;
  productName: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (idx: number) => void;
}

export function ImageGalleryModal({
  images,
  selectedIndex,
  productName,
  onClose,
  onPrev,
  onNext,
  onSelect,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/98 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/5">
        <div>
          <p className="text-white font-bold text-sm tracking-wide">{productName}</p>
          <p className="text-white/30 text-xs font-medium mt-0.5">
            {selectedIndex + 1} / {images.length}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center px-20 relative overflow-hidden py-6">
        <img
          src={getImageUrl(images[selectedIndex]?.url || images[selectedIndex])}
          alt={productName}
          className="max-w-full max-h-full object-contain rounded-2xl"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="absolute right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Dot strip */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 py-5 shrink-0 border-t border-white/5">
          {images.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => onSelect(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === selectedIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}