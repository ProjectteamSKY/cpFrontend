import React from "react";
import { useNavigate } from "react-router";
import { Heart, Eye, Share2, ShoppingCart, Star, ZoomIn, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Product } from "../../types/productlist";
import { getImageUrl } from "../../utils/productutils";

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onProductClick: (productId: string) => void; // New prop
  onQuickView: (product: Product, e: React.MouseEvent) => void;
  onImageClick: (product: Product, index: number, e: React.MouseEvent) => void;
  onToggleFavorite: (productId: string, e: React.MouseEvent) => void;
  onShare: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode,
  isFavorite,
  onProductClick,
  onQuickView,
  onImageClick,
  onToggleFavorite,
  onShare
}) => {
  const defaultImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images.find((img: any) => img.is_default) || product.images[0]
    : null;
  const allImages = Array.isArray(product.images) ? product.images : [];

  return (
    <Card
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 relative cursor-pointer transform hover:-translate-y-2 ${
        viewMode === 'list' ? 'flex flex-row' : ''
      }`}
      onClick={() => onProductClick(product.id)} // Use the prop here
    >
      {/* Gradient Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D73D32] via-[#B83227] to-[#D73D32] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        {product.popular && (
          <Badge className="bg-gradient-to-r from-[#1A1A1A] to-[#3A3A3A] text-white border-0 shadow-lg backdrop-blur-sm">
            🔥 Popular
          </Badge>
        )}
        {product.new && (
          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0 shadow-lg">
            ✨ New
          </Badge>
        )}
        {product.discount && product.discount > 0 && (
          <Badge className="bg-gradient-to-r from-[#D73D32] to-[#B83227] text-white border-0 shadow-lg font-bold">
            {product.discount}% OFF
          </Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full w-11 h-11 border-0 hover:scale-110 transition-transform"
                onClick={(e) => onToggleFavorite(product.id, e)}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-[#D73D32] text-[#D73D32]' : 'text-gray-600'
                  }`} 
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Add to wishlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full w-11 h-11 border-0 hover:scale-110 transition-transform"
                onClick={(e) => onQuickView(product, e)}
              >
                <Eye className="w-5 h-5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Quick view</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full w-11 h-11 border-0 hover:scale-110 transition-transform"
                onClick={(e) => onShare(product, e)}
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">Share product</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Image Container */}
      <div className={`relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 ${
        viewMode === 'list' ? 'w-64' : 'aspect-[4/3]'
      }`}>
        {defaultImage ? (
          <>
            <img
              src={getImageUrl(defaultImage)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
              onClick={(e) => onImageClick(product, 0, e)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=No+Image';
              }}
            />
            
            {/* Zoom Indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-xl">
                <ZoomIn className="w-6 h-6 text-[#D73D32]" />
              </div>
            </div>
            
            {/* Related Images Indicator */}
            {allImages.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 px-3">
                {allImages.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => onImageClick(product, idx, e)}
                    className="w-2 h-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-125"
                  />
                ))}
                {allImages.length > 5 && (
                  <span className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full font-medium">
                    +{allImages.length - 5}
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <Printer className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        {/* Category Tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className="bg-gradient-to-r from-[#D73D32]/10 to-[#B83227]/10 text-[#D73D32] border-0 font-semibold">
            {product.category_name || product.category_id}
          </Badge>
          {product.subcategory_name && (
            <Badge variant="outline" className="border-gray-200 text-gray-600">
              {product.subcategory_name}
            </Badge>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-[#1A1A1A] mb-2 line-clamp-2 min-h-[56px] group-hover:text-[#D73D32] transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(Number(product.rating))
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {product.rating}
            </span>
            <span className="text-xs text-gray-500">
              ({product.review_count} reviews)
            </span>
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#D73D32] to-[#B83227] bg-clip-text text-transparent">
                ₹{product.price || 0}
              </span>
              {product.mrp && product.mrp > (product.price || 0) && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 bg-gray-50 inline-block px-2 py-1 rounded-full">
              Min. {product.min_order_qty} pcs
            </p>
          </div>
          
          <Button
            className="bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product.id); // Use the prop here as well
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order
          </Button>
        </div>
      </div>
    </Card>
  );
};