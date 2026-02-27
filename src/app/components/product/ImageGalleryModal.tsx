import React from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Product } from "../../types/productlist";
import { getImageUrl } from "../../utils/productutils";

interface ImageGalleryModalProps {
  product: Product | null;
  isOpen: boolean;
  initialImageIndex: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
  product,
  isOpen,
  initialImageIndex,
  onClose,
  onIndexChange
}) => {
  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95 rounded-3xl overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-2xl">{product.name}</h3>
                <p className="text-white/70 text-sm mt-1">
                  Image {initialImageIndex + 1} of {images.length}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center p-20">
            <img
              src={getImageUrl(images[initialImageIndex])}
              alt={`${product.name} - Image ${initialImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600?text=No+Image';
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onIndexChange(initialImageIndex > 0 ? initialImageIndex - 1 : images.length - 1)}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full w-14 h-14 shadow-xl"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onIndexChange(initialImageIndex < images.length - 1 ? initialImageIndex + 1 : 0)}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full w-14 h-14 shadow-xl"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex gap-3 overflow-x-auto pb-2 justify-center scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                {images.map((image: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => onIndexChange(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all transform hover:scale-110 ${
                      initialImageIndex === idx 
                        ? 'border-white shadow-2xl ring-4 ring-white/50' 
                        : 'border-white/30 hover:border-white/70'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};