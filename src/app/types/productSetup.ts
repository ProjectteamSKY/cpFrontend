export interface ProductPrice {
  id?: string;
  min_qty: number;
  max_qty: number;
  price: number;
  discount: number | null;
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
  size_name?: string;
  paper_type_name?: string;
  print_type_name?: string;
  cut_type_name?: string;
}

export interface ProductSetup {
  id: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description: string;
  min_order_qty: number;
  max_order_qty: number;
  images: string[];
  related_images: string[];
  variants: ProductVariant[];
  category_name?: string;
  subcategory_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductSetupFormData {
  id?: string;
  category_id: string;
  subcategory_id: string;
  name: string;
  description?: string;
  min_order_qty: number;
  max_order_qty?: number;
  images?: any; // FileList or string[] for existing images
  related_images?: any; // FileList or string[] for existing images
  variants: ProductVariant[];
}

export interface ProductResponse {
  products: ProductSetup[];
  total: number;
}