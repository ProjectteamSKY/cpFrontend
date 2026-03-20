export interface FAQ {
  id: string;
  question: string;
  answer: string;
  type: "general" | "category" | "product";
  category_id?: string | null;
  product_id?: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface FAQFormData {
  question: string;
  answer: string;
  type: string;
  category_id?: string | null;
  product_id?: string | null;
  sort_order: number;
}