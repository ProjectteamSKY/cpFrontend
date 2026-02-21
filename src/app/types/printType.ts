export interface PrintType {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface PrintTypeFormData {
  name: string;
  description?: string;
  is_active?: boolean; // optional for form
}