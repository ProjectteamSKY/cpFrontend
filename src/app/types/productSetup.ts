export interface ProductPriceFormData {
  min_qty: number;
  max_qty: number;
  price: number;
  discount?: number | null;
}

export interface ProductVariantFormData {
  size_id: string;
  paper_type_id: string;
  print_type_id: string;
  cut_type_id: string;
  sides: number;
  two_side_cut: boolean;
  four_side_cut: boolean;
  orientation: "Landscape" | "Portrait";
  prices: ProductPriceFormData[];
}

export interface ProductSetupFormData {
  category_id: string;
  subcategory_id?: string;
  name: string;
  description?: string;
  min_order_qty: number;
  max_order_qty?: number;

  // New: existing file paths
  images_paths?: string[];         // e.g., ["c0cf5370-fece-4057-bfd8-ecef89559bb2.jpg"]
  related_images_paths?: string[]; // e.g., ["1837a1bc-4f6e-48d2-9546-992a82da9a88.jpg"]

  // New uploads
  images?: File[];
  related_images?: File[];

  variants?: ProductVariantFormData[];
}

export interface ProductSetup {
  id: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  min_order_qty: number;
  max_order_qty: number;
  variants: ProductVariantFormData[];
  images?: string[]; // URLs returned from backend
  related_images?: string[];
}

export interface ProductDiscountPayload {
  min_qty: number;
  max_qty: number;
  discount: number;
}

// =============================
// API RESPONSE TYPES
// =============================

export interface ProductPriceResponse {
  id: string;
  variant_id: string;
  min_qty: number;
  max_qty: number;
  price: number;
  discount_id?: string | null;
  discount?: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariantResponse {
  id: string;
  product_id: string;

  size_id: string;
  size_name: string; // ✅ FROM BACKEND

  paper_type_id: string;
  paper_type_name: string; // ✅

  print_type_id: string;
  print_type_name: string; // ✅

  cut_type_id: string;
  cut_type_name: string; // ✅

  sides: number;
  two_side_cut: number; // backend returns 0/1
  four_side_cut: number;

  orientation: "Landscape" | "Portrait";
  is_active: number;

  created_at: string;
  updated_at: string;

  prices: ProductPriceResponse[];
}

export interface ProductResponse {
  id: string;
  name: string;
  description?: string;

  category_id: string;
  category_name: string; // ✅

  subcategory_id: string;
  subcategory_name: string; // ✅

  min_order_qty: number;
  max_order_qty: number;

  created_at: string;

  variants: ProductVariantResponse[];
}