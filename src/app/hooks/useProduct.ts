import { useState, useEffect } from "react";
import axios from "axios";
import { Product, FilterState } from "../types/productlist";
import { processProductImages, processRelatedImages, enrichProductData, applyFilters } from "../utils/productutils";
import { API_BASE_URL } from "../constants/productconstants";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    paperTypes: [],
    finishes: [],
    priceRange: [0, 10000],
    quantity: "all"
  });
  const [sortBy, setSortBy] = useState<string>("popular");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<{ products: Product[] } | Product[]>(`${API_BASE_URL}/api/product/list`);
        
        const productsData = Array.isArray(res.data) ? res.data : res.data.products || [];
        
        const processedProducts = productsData.map((product: any) => {
          const processedImages = processProductImages(product);
          const processedRelated = processRelatedImages(product);
          const allImages = [...processedImages, ...processedRelated];
          
          return enrichProductData({
            ...product,
            images: allImages.length > 0 ? allImages : processedImages,
            related_images: processedRelated
          });
        });
        
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } catch (error) {
        console.error("Error fetching products: - useProduct.ts:45", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const result = applyFilters(products, searchQuery, filters, sortBy);
    setFilteredProducts(result);
  }, [searchQuery, filters, sortBy, products]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      paperTypes: [],
      finishes: [],
      priceRange: [0, 10000],
      quantity: "all"
    });
    setSearchQuery("");
  };

  return {
    products,
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
  };
};