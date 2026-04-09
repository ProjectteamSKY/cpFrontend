import axios from "axios";
import { Variant, VariantAttributeValue, VariantPrice, Attribute, AttributeValue } from "../types/productvarientsetup";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// ------------------ VARIANTS (product_variant_combinations) ------------------
export const createVariant = (payload: Partial<Variant>) =>
  api.post("/product_variant_combinations/create", payload);

export const getVariants = (productId: string) =>
  api.get(`/product_variant_combinations/product/${productId}`);

export const updateVariant = (id: string, payload: Partial<Variant>) =>
  api.put(`/product_variant_combinations/${id}`, payload);

export const deleteVariant = (id: string) =>
  api.delete(`/product_variant_combinations/${id}`);

// ------------------ VARIANT ATTRIBUTE VALUES ------------------
export const createVariantAttributeValue = (payload: Partial<VariantAttributeValue>) =>
  api.post("/variant_attribute_value/create", payload);

export const getVariantAttributeValues = async (variantId: string) => {
  const res = await api.get(`/variant_attribute_value/variant/${variantId}`);
  return res.data.data; // only return the array
};

// Move this to your service file (productvarientsetupApiService.ts)
export const updateVariantAttributeValue = async (payload: {
  variant_id: string;
  attribute_id: string;
  attribute_value_ids: string[];
}) => {
  const res = await api.put(`/variant_attribute_value/update`, payload);
  // or use api.post depending on your backend
  // const res = await api.post(`/variant_attribute_value/update`, payload);
  return res.data.data;
};


export const deleteVariantAttributeValue = (id: string) =>
  api.delete(`/variant_attribute_value/${id}`);

// ------------------ VARIANT PRICES ------------------
export const createVariantPrice = (payload: Partial<VariantPrice>) =>
  api.post("/variant_price/create", payload);

export const getVariantPrices = async (variantId: string) => {
  const res = await api.get(`/variant_price/variant/${variantId}`);
  return res.data.data;
};

export const deleteVariantPrice = (id: string) =>
  api.delete(`/variant_price/${id}`);

// ------------------ ATTRIBUTES ------------------
// API returns { status, data: [...] }
export const getAttributes = () =>
  api.get<{ status: string; data: Attribute[] }>("/attribute/list");

export const getAttributeValues = () =>
  api.get<{ status: string; data: AttributeValue[] }>("/attribute_value/list");