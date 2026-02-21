import api from "./api";
import { Product, ProductFormData } from "../types/product";

/* Map UI → FormData for FastAPI Form(...) + File uploads */
export const mapProductToFormData = (data: ProductFormData): FormData => {
  const form = new FormData();
  form.append("name", data.name);
  if (data.category_id) form.append("category_id", data.category_id);
  if (data.subcategory_id) form.append("subcategory_id", data.subcategory_id);
  if (data.description) form.append("description", data.description);
  if (data.min_order_qty !== undefined) form.append("min_order_qty", String(data.min_order_qty));
  if (data.max_order_qty !== undefined) form.append("max_order_qty", String(data.max_order_qty));

  data.images?.forEach(f => form.append("images", f));
  data.related_images?.forEach(f => form.append("related_images", f));

  return form;
};

/* API Services */
export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/product/list");
  return res.data.products || [];
};

export const createProduct = async (payload: ProductFormData): Promise<void> => {
  const body = mapProductToFormData(payload);
  await api.post("/product/create", body);
};

export const updateProduct = async (id: string, payload: ProductFormData): Promise<void> => {
  const body = mapProductToFormData(payload);
  await api.put(`/product/${id}`, body);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/product/${id}`);
};

export const activateProduct = async (id: string): Promise<void> => {
  await api.put(`/product/${id}/activate`);
};