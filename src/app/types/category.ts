export interface Category {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  is_active: boolean;
}