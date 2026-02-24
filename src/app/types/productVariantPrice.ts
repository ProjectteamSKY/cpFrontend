export interface ProductVariantPrice {
  id: string;

  variant_id: string;
  variant_name: string;

  min_qty: number;
  max_qty: number;
  price: number;
  discount_id?: string;
  discount_name?: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProductVariantPriceFormData {
  variant_id: string;
  min_qty: number;
  max_qty: number;
  price: number;
  discount_id?: string;
  is_active: boolean;
}