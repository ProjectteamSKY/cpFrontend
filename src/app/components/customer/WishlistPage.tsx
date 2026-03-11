import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useWishlist } from "../../hooks/useWishlist";
import { ProductCard } from "../../components/product/ProductCard";
import { ProductSkeleton } from "../../components/product/ProductSkeleton";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { getProductsByIds } from "../../service/productApiService";
import { toast } from "react-toastify";
import { Toaster } from "../../components/ui/toaster";

export const WishlistPage = () => {
  const navigate = useNavigate();

  // Get userId from session/local storage
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
  const { wishlist, loading, isFavorite, toggleWishlist, refresh } = useWishlist(userId || "");

  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  // Fetch product details for wishlist items
  const fetchWishlistProducts = async () => {
    if (!wishlist || wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }

    setProductsLoading(true);
    try {
      // toast.success("Loading your wishlist...");
      const productIds = wishlist.map(item => item.product_id);
      const products = await getProductsByIds(productIds);
      setWishlistProducts(products);
      toast.success("Wishlist loaded successfully!");
    } catch (err) {
      console.error("Error fetching wishlist products:", err);
      toast.error("Failed to load wishlist products");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
  }, [wishlist]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Quick view feature coming soon!");
    console.log("Quick view clicked for product:", product);
  };

  const handleImageClick = (product: any, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Gallery view coming soon!");
    console.log("Open gallery for product:", product, "at index:", index);
  };

  const handleShare = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.share?.({
        title: product.name,
        text: product.description,
        url: window.location.origin + `/product/${product.id}`
      }).catch(() => {
        navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
        toast("Product link copied to clipboard!");
      });
    } catch (err) {
      toast("Share feature not available");
    }
  };

  // Toggle wishlist with toast feedback
  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      toggleWishlist(id);
      toast(isFavorite(id) ? "Removed from wishlist!" : "Added to wishlist!");
    } catch (err) {
      toast.error("Failed to update wishlist");
      console.error("Wishlist toggle error:", err);
    }
  };

  if (loading || productsLoading) {
    return <ProductSkeleton />;
  }

  if (!wishlistProducts.length) {
    return <ProductEmptyState onClearFilters={() => {
      refresh();
      toast.warning("Wishlist refreshed");
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode="grid"
              isFavorite={isFavorite(product.id)}
              onProductClick={handleProductClick}
              onQuickView={handleQuickView}
              onImageClick={handleImageClick}
              onToggleFavorite={handleToggleFavorite}
              onShare={handleShare}
            />
          ))}
        </div>
      </div>
      <Toaster />
    </div>
  );
};
