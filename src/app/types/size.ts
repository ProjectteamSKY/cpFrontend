export interface Size {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SizeFormData {
  name: string;
  width: number;
  height: number;
  unit?: string;
  description?: string;
  is_active?: boolean;
}