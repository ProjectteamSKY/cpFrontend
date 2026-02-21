export interface ProductImage {
  id: string;
  url: string;
  is_default?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category_id?: string;
  subcategory_id?: string;
  description?: string;
  min_order_qty: number;
  max_order_qty?: number;
  images: ProductImage[];
  related_images: ProductImage[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  category_id?: string;
  subcategory_id?: string;
  description?: string;
  min_order_qty?: number;
  max_order_qty?: number;
  images?: File[];
  related_images?: File[];
}