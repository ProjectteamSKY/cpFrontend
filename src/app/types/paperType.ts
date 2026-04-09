// types/paperType.ts

export interface PaperType {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PaperTypeFormData {
  name: string;
  description: string;
  is_active: boolean;
}