// types/subcategory.ts

export interface SubcategoryImage {
  id: string;
  url: string;
  is_default: boolean;
}

export interface Subcategory {
  is_deleted: any;
  is_deleted: any;
  id: string;
  category_id: string;
  name: string;
  description?: string;
  images?: SubcategoryImage[];
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

/* 🔥 FORM DATA */
export interface SubcategoryFormData {
  category_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  images?: FileList; // important for upload
}

/* 🔥 FORM PROPS */
export interface SubcategoryFormProps {
  defaultValues?: Subcategory | null;
  defaultCategoryId?: string;
  onSubmit: (data: SubcategoryFormData) => Promise<void>;
  onCancel: () => void;
}