// types/subcategory.ts

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SubcategoryFormData {
  category_id: string; // required when creating a subcategory
  name: string;
  description?: string;
  is_active: boolean;
}