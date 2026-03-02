import api from "./api";
import { Product, ProductFormData } from "../types/product";
import axios from "axios";

/* ✅ Map UI → FormData for FastAPI */
export const mapProductToFormData = (
  data: ProductFormData
): FormData => {
  const form = new FormData();

  form.append("name", data.name ?? "");
  form.append("category_id", data.category_id ?? "");
  form.append("subcategory_id", data.subcategory_id ?? "");
  form.append("description", data.description ?? "");

  if (data.min_order_qty !== undefined)
    form.append("min_order_qty", String(data.min_order_qty));

  if (data.max_order_qty !== undefined)
    form.append("max_order_qty", String(data.max_order_qty));

  if (Array.isArray(data.images)) {
    data.images.forEach((file) => {
      if (file instanceof File) {
        form.append("images", file);
      }
    });
  }

  if (Array.isArray(data.related_images)) {
    data.related_images.forEach((file) => {
      if (file instanceof File) {
        form.append("related_images", file);
      }
    });
  }

  return form;
};
/* ================= API SERVICES ================= */

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/product/list");
  return res.data.products || [];
};

export const createProduct = async (data: ProductFormData) => {
  const formData = mapProductToFormData(data);

  return await axios.post(
    "http://127.0.0.1:8000/api/product/create",
    formData
  );
};

export const updateProduct = async (
  id: string,
  payload: ProductFormData
): Promise<void> => {
  const body = mapProductToFormData(payload);
  await api.put(`/product/${id}`, body);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/product/${id}`);
};

export const activateProduct = async (id: string): Promise<void> => {
  await api.put(`/product/${id}/activate`);
};