export interface Variant {
  id: string;
  product_id: string;
  sku?: string;
  is_active: boolean;
}

export interface VariantAttributeValue {
  id: string;
  variant_id: string;
  attribute_id: string;
  attribute_value_id: string;
}

export interface VariantPrice {
  id: string;
  variant_id: string;
  min_qty: number;
  max_qty?: number;
  price: number;
}

export interface Attribute {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface AttributeValue {
  id: string;
  attribute_id: string;
  value: string;
}