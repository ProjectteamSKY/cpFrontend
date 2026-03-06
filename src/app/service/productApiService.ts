import api from "./api";
import { Product, ProductFormData } from "../types/product";
import axios from "axios";

/* ✅ Map UI → FormData for FastAPI */
export const mapProductToFormData = (
  data: ProductFormData & {
    existing_image_ids?: string[];
    existing_related_image_ids?: string[];
  }
): FormData => {
  const form = new FormData();

  form.append("name", data.name ?? "");
  form.append("category_id", data.category_id ?? "");
  form.append("subcategory_id", data.subcategory_id ?? "");
  form.append("description", data.description ?? "");

  if (data.min_order_qty !== undefined) form.append("min_order_qty", String(data.min_order_qty));
  if (data.max_order_qty !== undefined) form.append("max_order_qty", String(data.max_order_qty));

  // Append new files only
  if (Array.isArray(data.images)) {
    data.images.forEach(file => {
      if (file instanceof File) form.append("images", file);
    });
  }
  if (Array.isArray(data.related_images)) {
    data.related_images.forEach(file => {
      if (file instanceof File) form.append("related_images", file);
    });
  }

  // Append existing image IDs
  if (data.existing_image_ids) {
    data.existing_image_ids.forEach(id => form.append("existing_image_ids", id));
  }
  if (data.existing_related_image_ids) {
    data.existing_related_image_ids.forEach(id => form.append("existing_related_image_ids", id));
  }

  return form;
};
/* ================= API SERVICES ================= */

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await api.get("/product/list");
  return res.data.products || [];
};

export const getAllProductsActive = async (): Promise<Product[]> => {
  const res = await api.get("/product/active/list");
  return res.data.products || [];
};



export const createProduct = async (data: ProductFormData) => {
  const formData = mapProductToFormData(data);

  return await axios.post(
    "http://54.206.3.97/api/product/create",
    formData
  );
};

export const updateProduct = async (
  id: string,
  payload: ProductFormData & {
    existing_image_ids: string[];
    existing_related_image_ids: string[];
  }
): Promise<void> => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description || "");
  formData.append("min_order_qty", String(payload.min_order_qty));
  formData.append("max_order_qty", String(payload.max_order_qty || ""));
  formData.append("category_id", payload.category_id || "");
  formData.append("subcategory_id", payload.subcategory_id || "");

  // ✅ NEW IMAGES
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((file: File) => {
      formData.append("images", file);
    });
  }

  // ✅ NEW RELATED IMAGES
  if (payload.related_images && payload.related_images.length > 0) {
    payload.related_images.forEach((file: File) => {
      formData.append("related_images", file);
    });
  }

  // ✅ EXISTING IMAGE IDS (VERY IMPORTANT)
  if (payload.existing_image_ids?.length > 0) {
    payload.existing_image_ids.forEach((id: string) => {
      formData.append("existing_image_ids", id);
    });
  }

  // ✅ EXISTING RELATED IMAGE IDS
  if (payload.existing_related_image_ids?.length > 0) {
    payload.existing_related_image_ids.forEach((id: string) => {
      formData.append("existing_related_image_ids", id);
    });
  }
  console.log("existing_image_ids - productApiService.ts:110",payload.existing_image_ids)

  console.log("existing_related_image_ids - productApiService.ts:112",payload.existing_related_image_ids)
  await api.put(`/product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/product/${id}`);
};

export const activateProduct = async (id: string): Promise<void> => {
  await api.put(`/product/${id}/activate`);
};

export const deactivateProduct = async (id: string): Promise<void> => {
  await api.put(`/product/${id}/deactivate`);
};