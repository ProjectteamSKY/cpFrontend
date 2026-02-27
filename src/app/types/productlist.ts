// export interface ProductImage {
//   id: string;
//   image_url: string;
//   url?: string;
//   is_default: boolean;
// }

// export interface Product {
//   id: string;
//   name: string;
//   category_id: string;
//   category_name?: string;
//   subcategory_id: string;
//   subcategory_name?: string;
//   product_type_id?: string;
//   description: string;
//   min_order_qty: number;
//   max_order_qty: number;
//   price?: number;
//   mrp?: number;
//   discount?: number;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   images: ProductImage[] | string | any;
//   related_images?: ProductImage[] | string | any;
//   popular?: boolean;
//   new?: boolean;
//   rating?: number;
//   review_count?: number;
//   specifications?: Record<string, string>;
// }

// export interface FilterState {
//   categories: string[];
//   sizes: string[];
//   paperTypes: string[];
//   finishes: string[];
//   priceRange: [number, number];
//   quantity: string;
// }

// export interface ProductListingProps {
//   initialProducts?: Product[];
// }


export interface ProductImage {
  id: string;
  image_url: string;
  url?: string;
  is_default: boolean;
}

export interface VariantPrice {
  id: string;
  variant_id: string;
  discount_id: string | null;
  min_qty: number;
  max_qty: number;
  price: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  discount: any | null;
}

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
  two_side_cut: number;
  four_side_cut: number;
  orientation: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  prices: VariantPrice[];
}

export interface Product {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  subcategory_id: string;
  subcategory_name?: string;
  product_type_id?: string;
  description: string;
  min_order_qty: number;
  max_order_qty: number;
  price?: number;
  mrp?: number;
  discount?: number;
  is_active: boolean | number;
  created_at: string;
  updated_at: string;
  images: ProductImage[] | string | any;
  related_images?: ProductImage[] | string | any;
  popular?: boolean;
  new?: boolean;
  rating?: number;
  review_count?: number;
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  paperTypes: string[];
  finishes: string[];
  priceRange: [number, number];
  quantity: string;
}

export interface ProductListingProps {
  initialProducts?: Product[];
}