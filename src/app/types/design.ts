// types/design.ts

export interface DesignRequest {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  email: string;
  product_id: string;
  product_name: string;
  variant_id: string;
  product_variant_price_id: string;
  design_notes: string;
  logo_images: string[]; // Array of image paths
  designed_images: string[]; // Array of designed image paths
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
  is_approved: number; // 0 = false, 1 = true
  design_price: number;
  created_at: string;
  updated_at: string;
}

// In your types/design.ts file
// In your types/design.ts file
export interface DesignFormData {
    name: string;
    email: string;
    phone: string;
    product_id: string;
    design_notes: string;
    logo_images: File[];
    designed_images: File[];
    design_price: number;
    existing_logo_images?: string[];
    existing_designed_images?: string[];
}

export interface DesignApiResponse {
  status: string;
  data: DesignRequest[];
}

export interface DesignUpdatePayload {
  name?: string;
  email?: string;
  phone?: string;
  product_id?: string;
  design_notes?: string;
  design_price?: number;
  status?: string;
}