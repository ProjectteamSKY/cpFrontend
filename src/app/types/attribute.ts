export interface Attribute {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AttributeFormData {
  name: string;
  description: string;
  is_active: boolean;
}