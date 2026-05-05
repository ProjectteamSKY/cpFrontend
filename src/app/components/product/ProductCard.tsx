import React from "react";
import { Heart, ShoppingCart, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Product } from "../../types/productlist";
import { getImageUrl } from "../../utils/productutils";

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  isFavorite: boolean;
  onProductClick: (productId: string) => void;
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
  onImageClick,
  onToggleFavorite
}) => {

  const defaultImage =
    product.images?.find((img: any) => img.is_default) ||
    product.images?.[0] ||
    null;

  const formatProductName = (name: string) => {
    if (!name) return "";
    return name
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <Card
      className={`
        relative bg-white rounded-xl overflow-hidden border border-gray-100
        shadow-sm hover:shadow-xl transition-all duration-300
        cursor-pointer group h-full
        ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}
      `}
      onClick={() => onProductClick(product.id)}
    >
      {/* Favorite Button */}
      <div className="absolute top-3 right-3 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="
                  backdrop-blur-md bg-white/80 border border-gray-200
                  shadow-md rounded-full w-9 h-9
                  hover:scale-105 hover:bg-white transition-all
                "
                onClick={(e) => onToggleFavorite(product.id, e)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite
                      ? 'fill-red-600 text-red-600'
                      : 'text-gray-400 group-hover:text-red-500'
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Image Section - TRUE h-full */}
      <div className="bg-gray-100 overflow-hidden flex-1 h-full">
        {defaultImage ? (
          <img
            src={
              defaultImage?.mobile?.url
                ? getImageUrl(defaultImage.mobile.url)
                : defaultImage?.thumbnail?.url
                  ? getImageUrl(defaultImage.thumbnail.url)
                  : defaultImage?.original?.url
                    ? getImageUrl(defaultImage.original.url)
                    : "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={product.name}
            className="
              w-full h-full object-cover
              transition-transform duration-500
              group-hover:scale-105
            "
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product.id);
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/400x300?text=No+Image";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Printer className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-3">
          {formatProductName(product.name)}
        </h3>

        <button
          className="
            mt-auto w-full rounded-lg px-4 py-2 text-sm font-medium
            text-white flex items-center justify-center gap-2
            bg-gradient-to-r from-red-600 to-red-500
            hover:from-red-700 hover:to-red-600
            shadow-md hover:shadow-lg
            transition-all duration-300
          "
          onClick={(e) => {
            e.stopPropagation();
            onProductClick(product.id);
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          Order
        </button>
      </div>
    </Card>
  );
};