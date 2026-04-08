export interface AttributeValue {
  id: string;
  attribute_id: string;
  value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;

  // Optional (if backend joins attribute name)
  attribute_name?: string;
}

export interface AttributeValueFormData {
  attribute_id: string;
  value: string;
  is_active: boolean;
}