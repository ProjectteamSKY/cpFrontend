import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ShoppingCart, Star, ZoomIn } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Product } from "../../types/productlist";
import { getImageUrl } from "../../utils/productutils";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  favorites: string[];
  onClose: () => void;
  onImageClick: (product: Product, index: number, e: React.MouseEvent) => void;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  favorites,
  onClose,
  onImageClick,
  onToggleFavorite
}) => {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-3xl">
        <div className="flex flex-col md:flex-row">
          {/* Image Gallery */}
          <div className="md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="aspect-square relative overflow-hidden rounded-2xl mb-4 shadow-lg group">
              <img
                src={getImageUrl(
                  Array.isArray(product.images) && product.images[selectedImageIndex]
                )}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                onClick={(e) => onImageClick(product, selectedImageIndex, e)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl">
                  <ZoomIn className="w-6 h-6 text-[#D73D32]" />
                </div>
              </div>
            </div>
            
            {/* Thumbnails */}
            {product.images && Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {product.images.map((image: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                      selectedImageIndex === idx 
                        ? 'border-[#D73D32] shadow-lg ring-2 ring-[#D73D32]/30' 
                        : 'border-gray-200 hover:border-[#D73D32]/50'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8 overflow-y-auto max-h-[80vh]">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-gradient-to-r from-[#D73D32]/10 to-[#B83227]/10 text-[#D73D32] border-0 font-semibold">
                {product.category_name}
              </Badge>
              {product.subcategory_name && (
                <Badge variant="outline" className="border-gray-200">
                  {product.subcategory_name}
                </Badge>
              )}
            </div>

            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              {product.name}
            </h2>

            {product.rating && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(Number(product.rating))
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-700">
                  {product.rating}
                </span>
                <span className="text-sm text-gray-500">
                  ({product.review_count} reviews)
                </span>
              </div>
            )}

            <div className="mb-5 p-4 bg-gradient-to-r from-[#D73D32]/5 to-[#B83227]/5 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold bg-gradient-to-r from-[#D73D32] to-[#B83227] bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
                {product.mrp && product.mrp > (product.price || 0) && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{product.mrp}
                    </span>
                    <Badge className="bg-green-600 text-white border-0">
                      Save {product.discount}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications */}
            {product.specifications && (
              <div className="mb-6 p-5 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-lg mb-3 text-[#1A1A1A]">Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500 block mb-1">{key}</span>
                      <span className="font-semibold text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Minimum Order</p>
                  <p className="text-lg font-bold text-gray-800">{product.min_order_qty} pieces</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Maximum Order</p>
                  <p className="text-lg font-bold text-gray-800">{product.max_order_qty} pieces</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => {
                  onClose();
                  navigate(`/product/${product.id}`);
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Customize Now
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => onToggleFavorite(product.id, e as any)}
                className="border-2 border-gray-300 hover:border-[#D73D32] h-14 w-14 rounded-xl"
              >
                <Heart className={`w-6 h-6 ${favorites.includes(product.id) ? 'fill-[#D73D32] text-[#D73D32]' : 'text-gray-600'}`} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};