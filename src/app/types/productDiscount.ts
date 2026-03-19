export interface ProductDiscount {
  id: string;
  product_id: string;
  product_name?: string;

  title: string;                 // ✅ added
  description?: string;
  discount: string;

  banner_image_url?: string;     // ✅ added (from backend)
  cta_text?: string;             // ✅ added

  start_date: string;
  end_date: string;

  is_active: boolean;
  created_at: string;
  updated_at: string;
}


export interface ProductDiscountFormData {
  product_id: string;

  title: string;                      // ✅ required
  description?: string;

  discount: string;

  cta_text?: string;                  // ✅ optional
  banner_file?: FileList;             // ✅ file upload

  start_date: string;
  end_date: string;

  is_active: boolean;
}