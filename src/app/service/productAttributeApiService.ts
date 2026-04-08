import api from "./api";
import {
  ProductAttribute,
  ProductAttributeFormData,
} from "../types/productAttribute";

const mapFromApi = (item: any): ProductAttribute => ({
  id: item.id,
  product_id: item.product_id,
  attribute_id: item.attribute_id,

  product_name: item.product_name,       // ✅ ADD
  attribute_name: item.attribute_name,   // ✅ ADD

  is_required: Boolean(item.is_required),
  sort_order: item.sort_order ?? 0,
  is_active: Boolean(item.is_active),

  created_at: item.created_at ?? null,
  updated_at: item.updated_at ?? null,
});
// ---------------- GET BY PRODUCT ----------------
export const getProductAttributes = async (
  productId: string
): Promise<ProductAttribute[]> => {
  const res = await api.get(`/product_attribute/product/${productId}`);
  return (res.data.data || []).map(mapFromApi);
};

export const getProductAttributesall = async (
): Promise<ProductAttribute[]> => {
  const res = await api.get(`/product_attribute/list`);
  return (res.data.data || []).map(mapFromApi);
};

// ---------------- CREATE ----------------
export const createProductAttribute = async (
  payload: ProductAttributeFormData
) => {
  return await api.post("/product_attribute/create", payload);
};

// ---------------- UPDATE ----------------
export const updateProductAttribute = async (
  id: string,
  payload: Partial<ProductAttributeFormData>
) => {
  return await api.put(`/product_attribute/${id}`, payload);
};

// ---------------- DELETE ----------------
export const deleteProductAttribute = async (id: string) => {
  return await api.delete(`/product_attribute/${id}`);
};

// ---------------- ACTIVATE ----------------
export const activateProductAttribute = async (id: string) => {
  return await api.put(`/product_attribute/${id}/activate`);
};

// ---------------- DEACTIVATE ----------------
export const deactivateProductAttribute = async (id: string) => {
  return await api.put(`/product_attribute/${id}/deactivate`);
};