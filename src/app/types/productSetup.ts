export interface ProductDiscount {
  id?: string;
  description?: string;
  discount: number;
  start_date?: string;
  end_date?: string;
}

export interface ProductPrice {
  id?: string;
  min_qty: number;
  price: number;
  discount?: ProductDiscount | null;
}

export interface ProductVariant {
  id?: string;
  size_id: string;
  paper_type_id: string;
  print_type_id: string;
  cut_type_id: string;
  sides: number;
  two_side_cut: boolean;
  four_side_cut: boolean;
  orientation: string;
  prices: ProductPrice[];
  // Optional display fields
  size_name?: string;
  paper_type_name?: string;
  print_type_name?: string;
  cut_type_name?: string;
}

export interface ProductImage {
  id?: string;
  url: string;
  is_default?: boolean;
}

export interface ProductSetup {
  id: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description: string;
  min_order_qty: number;
  max_order_qty?: number | null; // Add max_order_qty at product level
  images: ProductImage[];
  related_images: ProductImage[];
  variants: ProductVariant[];
  category_name?: string;
  subcategory_name?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface ProductSetupFormData {
  id?: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  min_order_qty: number;
  max_order_qty?: number | null; // Add max_order_qty at product level
  images?: any; // FileList for new uploads or array for existing
  related_images?: any; // FileList for new uploads or array for existing
  variants: ProductVariant[];
}

export interface ProductResponse {
  status: string;
  count?: number;
  product?: ProductSetup;
  products?: ProductSetup[];
}

