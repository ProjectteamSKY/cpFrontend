import api from "./api";
import { ProductVariantPrice, ProductVariantPriceFormData } from "../types/productVariantPrice";

/* Mapper API → UI */
const mapFromApi = (p: any): ProductVariantPrice => ({
  id: p.id,
  variant_id: p.variant_id,
  variant_name: p.product_name ?? "N/A",
  min_qty: p.min_qty,
  max_qty: p.max_qty,
  price: p.price,
  discount_id: p.discount_id ?? null,
  discount_name: p.discount_name ?? "N/A",
  is_active: Boolean(p.is_active),
  created_at: p.created_at ?? null,
  updated_at: p.updated_at ?? null,
});

/* Convert form data to FormData */
const toFormData = (data: ProductVariantPriceFormData) => {
  const formData = new FormData();
  formData.append("variant_id", data.variant_id);
  formData.append("min_qty", String(data.min_qty));
  formData.append("max_qty", String(data.max_qty));
  formData.append("price", String(data.price));
  if (data.discount_id) formData.append("discount_id", data.discount_id);
  formData.append("is_active", data.is_active ? "true" : "false");
  return formData;
};

/* Get all */
export const getAllProductVariantPrices = async (): Promise<ProductVariantPrice[]> => {
  const res = await api.get("/product_variant_price/list");
  return (res.data.prices || []).map(mapFromApi);
};

/* Create */
export const createProductVariantPrice = async (data: ProductVariantPriceFormData) => {
  await api.post("/product_variant_price/create", toFormData(data));
};

/* Update */
export const updateProductVariantPrice = async (id: string, data: ProductVariantPriceFormData) => {
  await api.put(`/product_variant_price/${id}`, toFormData(data));
};

/* Delete */
export const deleteProductVariantPrice = async (id: string) => {
  await api.delete(`/product_variant_price/${id}`);
};

/* Activate */
export const activateProductVariantPrice = async (id: string) => {
  await api.put(`/product_variant_price/${id}/activate`);
};