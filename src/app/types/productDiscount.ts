export interface ProductDiscount {
  id: string;
  product_id: string;
  product_name?: string; // ✅ added
  description: string;
  discount: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface ProductDiscountFormData {
  product_id?: string;
  description?: string;
  discount: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}