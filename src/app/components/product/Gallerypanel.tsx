import React from "react";
import { ChevronLeft, ChevronRight, ZoomIn, Share2, Heart, CheckCheck } from "lucide-react";
import { getImageUrl } from "../../utils/productutils";

interface Props {
  allImages: any[];
  selectedImageIndex: number;
  setSelectedImageIndex: (idx: number) => void;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  copied: boolean;
  onShare: () => void;
  onZoom: () => void;
  productName: string;
}

export function GalleryPanel({
  allImages,
  selectedImageIndex,
  setSelectedImageIndex,
  isFavorite,
  onFavoriteToggle,
  copied,
  onShare,
  onZoom,
  productName,
}: Props) {
  const prev = () =>
    setSelectedImageIndex(
      selectedImageIndex > 0 ? selectedImageIndex - 1 : allImages.length - 1
    );
  const next = () =>
    setSelectedImageIndex(
      selectedImageIndex < allImages.length - 1 ? selectedImageIndex + 1 : 0
    );

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex flex-col gap-2 shrink-0 w-[60px]">
          {allImages.map((img: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`w-full aspect-square rounded-xl overflow-hidden border transition-all duration-200
                ${selectedImageIndex === idx
                  ? "ring-2 ring-neutral-900 ring-offset-1 opacity-100 scale-105 border-transparent"
                  : "opacity-40 hover:opacity-75 hover:scale-105 border-neutral-100"}`}
            >
              <img
                src={getImageUrl(img.url || img)}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 rounded-3xl overflow-hidden bg-neutral-50 aspect-square group border border-neutral-100">
        <img
          src={getImageUrl(
            allImages[selectedImageIndex]?.url || allImages[selectedImageIndex]
          )}
          alt={productName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/700x700?text=";
          }}
        />

        {/* Top-left action buttons */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={onShare}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100"
          >
            {copied ? (
              <CheckCheck className="w-4 h-4 text-emerald-500" />
            ) : (
              <Share2 className="w-4 h-4 text-neutral-600" />
            )}
          </button>
          <button
            onClick={onFavoriteToggle}
            className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100"
          >
            <Heart
              className={`w-4 h-4 transition-all ${
                isFavorite
                  ? "fill-rose-500 text-rose-500 scale-110"
                  : "text-neutral-400"
              }`}
            />
          </button>
        </div>

        {/* Zoom button */}
        <button
          onClick={onZoom}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm border border-neutral-100
            text-xs font-bold text-neutral-700 flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100"
        >
          <ZoomIn className="w-3.5 h-3.5" /> Zoom
        </button>

        {/* Prev / Next arrows */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-4 h-4 text-neutral-700" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === selectedImageIndex
                      ? "w-5 h-1.5 bg-neutral-900"
                      : "w-1.5 h-1.5 bg-neutral-900/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}