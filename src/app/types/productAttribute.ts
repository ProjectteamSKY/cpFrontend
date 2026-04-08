export interface ProductAttribute {
  id: string;
  product_id: string;
  attribute_id: string;

  product_name?: string;      // ✅ ADD
  attribute_name?: string;    // ✅ ADD

  is_required: boolean;
  sort_order: number;
  is_active: boolean;

  created_at?: string;
  updated_at?: string;
}

export interface ProductAttributeFormData {
  product_id: string;
  attribute_id: string;
  is_required: boolean;
  sort_order: number;
}