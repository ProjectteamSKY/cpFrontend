export interface ProductVariant {
  id: string;

  product_id: string;
  product_name: string;

  size_id: string;
  size_name: string;

  paper_type_id: string;
  paper_type_name: string;

  print_type_id: string;
  print_type_name: string;

  cut_type_id: string;
  cut_type_name: string;

  sides: number;
  two_side_cut: boolean;
  four_side_cut: boolean;
  orientation: string;
  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface ProductVariantFormData {
  product_id: string;
  size_id: string;
  paper_type_id: string;
  print_type_id: string;
  cut_type_id: string;
  sides: number;
  two_side_cut: boolean;
  four_side_cut: boolean;
  orientation: string;
  is_active: boolean;
}