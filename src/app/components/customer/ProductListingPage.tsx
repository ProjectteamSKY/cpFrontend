import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../../hooks/useProduct";
import { ProductHeader } from "../../components/product/ProductHeader";
import { ProductFilters } from "../../components/product/ProductFilter";
import { ProductToolbar } from "../../components/product/ProductToolbar";
import { ProductCard } from "../../components/product/ProductCard";
import { QuickViewModal } from "../../components/product/QuickViewModal";
import { ImageGalleryModal } from "../../components/product/ImageGalleryModal";
import { ProductPagination } from "../../components/product/ProductPagination";
import { ProductSkeleton } from "../../components/product/ProductSkeleton";
import { ProductEmptyState } from "../../components/product/ProductEmptyState";
import { PRODUCTS_PER_PAGE } from "../../constants/productconstants";

export function ProductListingPage() {
  const navigate = useNavigate();
  const {
    filteredProducts,
    loading,
    favorites,
    searchQuery,
    filters,
    sortBy,
    setSearchQuery,
    setFilters,
    setSortBy,
    toggleFavorite,
    clearFilters
  } = useProducts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showQuickView, setShowQuickView] = useState<boolean>(false);
  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [galleryProduct, setGalleryProduct] = useState<any>(null);
  const [galleryImageIndex, setGalleryImageIndex] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pagination
  const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
  const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const handleFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[filterType] as string[];
      if (current.includes(value)) {
        return { ...prev, [filterType]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [filterType]: [...current, value] };
      }
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  // Handler for product card click - navigates to product detail page
  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickView = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the card click
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const handleImageClick = (product: any, imageIndex: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the card click
    setGalleryProduct(product);
    setGalleryImageIndex(imageIndex);
    setShowImageGallery(true);
  };

  const handleShare = (product: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents triggering the card click
    navigator.share?.({
      title: product.name,
      text: product.description,
      url: window.location.origin + `/product/${product.id}`
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/product/${product.id}`);
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductHeader />

        <div className="flex flex-col lg:flex-row gap-8">
          <ProductFilters
            filters={filters}
            searchQuery={searchQuery}
            showFilters={showFilters}
            onSearchChange={setSearchQuery}
            onFilterChange={handleFilterChange}
            onClearFilters={clearFilters}
            onPriceRangeChange={handlePriceRangeChange}
          />

          <div className="flex-1">
            <ProductToolbar
              totalProducts={filteredProducts.length}
              searchQuery={searchQuery}
              viewMode={viewMode}
              sortBy={sortBy}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
              onViewModeChange={setViewMode}
              onSortChange={setSortBy}
              onClearSearch={() => setSearchQuery("")}
            />

            {currentProducts.length === 0 ? (
              <ProductEmptyState onClearFilters={clearFilters} />
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      isFavorite={favorites.includes(product.id)}
                      onProductClick={handleProductClick} // New prop for navigation
                      onQuickView={handleQuickView}
                      onImageClick={handleImageClick}
                      onToggleFavorite={(id, e) => {
                        e.stopPropagation();
                        toggleFavorite(id);
                      }}
                      onShare={handleShare}
                    />
                  ))}
                </div>

                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={showQuickView}
        favorites={favorites}
        onClose={() => setShowQuickView(false)}
        onImageClick={handleImageClick}
        onToggleFavorite={(id, e) => {
          e.stopPropagation();
          toggleFavorite(id);
        }}
      />

      <ImageGalleryModal
        product={galleryProduct}
        isOpen={showImageGallery}
        initialImageIndex={galleryImageIndex}
        onClose={() => setShowImageGallery(false)}
        onIndexChange={setGalleryImageIndex}
      />
    </div>
  );
}