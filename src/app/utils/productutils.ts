import { Product, ProductImage } from "../types/productlist";

export const processProductImages = (product: any): ProductImage[] => {
  let processedImages: ProductImage[] = [];
  
  if (product.images) {
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        processedImages = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        processedImages = [{ id: '1', image_url: product.images, is_default: true }];
      }
    } else if (Array.isArray(product.images)) {
      processedImages = product.images.map((img: any, index: number) => ({
        id: img.id || `img-${index}`,
        image_url: img.image_url || img.url || img,
        is_default: img.is_default || index === 0
      }));
    } else if (typeof product.images === 'object' && product.images !== null) {
      processedImages = [{
        id: product.images.id || '1',
        image_url: product.images.image_url || product.images.url,
        is_default: true
      }];
    }
  }
  return processedImages;
};

export const processRelatedImages = (product: any): ProductImage[] => {
  let processedRelated: ProductImage[] = [];
  
  if (product.related_images) {
    if (typeof product.related_images === 'string') {
      try {
        const parsed = JSON.parse(product.related_images);
        processedRelated = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        processedRelated = [];
      }
    } else if (Array.isArray(product.related_images)) {
      processedRelated = product.related_images.map((img: any, index: number) => ({
        id: img.id || `related-${index}`,
        image_url: img.image_url || img.url || img,
        is_default: false
      }));
    }
  }
  return processedRelated;
};

export const enrichProductData = (product: any): Product => {
  const basePrice = product.price || Math.floor(Math.random() * 500) + 100;
  const mrp = product.mrp || Math.round(basePrice * 1.3);
  const discount = product.discount || Math.round(((mrp - basePrice) / mrp) * 100);
  
  return {
    ...product,
    price: basePrice,
    mrp: mrp,
    discount: discount,
    rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
    review_count: product.review_count || Math.floor(Math.random() * 500) + 10,
    new: product.new || (Math.random() > 0.7),
    specifications: product.specifications || {
      "Material": "Premium Paper",
      "Finish": "Glossy",
      "Size": "Standard"
    }
  };
};

export const getImageUrl = (image: any): string => {
  if (!image) return '';
  
  const imagePath = image.image_url || image.url || image;
  if (typeof imagePath === 'string') {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `http://127.0.0.1:8000/${cleanPath}`;
  }
  return '';
};

export const applyFilters = (
  products: Product[], 
  searchQuery: string, 
  filters: FilterState,
  sortBy: string
): Product[] => {
  let result = [...products];

  if (searchQuery) {
    result = result.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filters.categories.length > 0 && !filters.categories.includes("All")) {
    result = result.filter(product => 
      filters.categories.includes(product.category_name || product.category_id)
    );
  }

  switch (sortBy) {
    case "price-low":
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
      break;
    case "price-high":
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
      break;
    case "newest":
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case "popular":
    default:
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
  }

  return result;
};