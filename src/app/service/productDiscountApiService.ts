import api from "./api";
import { ProductDiscount } from "../types/productDiscount";

/* ===================== API → UI Mapper ===================== */
export const mapFromApi = (d: any): ProductDiscount => ({
  id: d.id,
  product_id: d.product_id,
  product_name: d.product_name ?? "",

  title: d.title ?? "",                 // ✅ added
  description: d.description ?? "",
  discount: d.discount,

  banner_image_url: d.banner_image_url ?? "", // ✅ added
  cta_text: d.cta_text ?? "",                 // ✅ added

  start_date: d.start_date,
  end_date: d.end_date,

  is_active: Boolean(d.is_active),
  created_at: d.created_at,
  updated_at: d.updated_at,
});

/* ===================== FormData Builder ===================== */
export const buildProductDiscountFormData = (data: any) => {
  const formData = new FormData();

  formData.append("product_id", data.product_id || "");
  formData.append("title", data.title || "");
  formData.append("description", data.description || "");
  formData.append("discount", data.discount || "0%");
  formData.append("cta_text", data.cta_text || "");
  formData.append("start_date", data.start_date);
  formData.append("end_date", data.end_date);

  // ✅ file
  if (data.banner_file && data.banner_file[0]) {
    formData.append("banner_file", data.banner_file[0]);
  }

  return formData;
};

/* ============================ CRUD ============================ */

// ✅ GET
export const getAllProductDiscounts = async (): Promise<ProductDiscount[]> => {
  const res = await api.get("/product_discount/list/active");
  return (res.data.discounts || []).map(mapFromApi);
};

// ✅ CREATE (FIXED → FormData)
export const createProductDiscount = async (formData: FormData) => {
  await api.post("/product_discount/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ UPDATE (FIXED → FormData)
export const updateProductDiscount = async (
  id: string,
  formData: FormData
) => {
  await api.put(`/product_discount/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ DELETE
export const deleteProductDiscount = async (id: string) => {
  await api.delete(`/product_discount/${id}`);
};

// ✅ ACTIVATE
export const activateProductDiscount = async (id: string) => {
  await api.put(`/product_discount/${id}/activate`);
};

// ✅ DEACTIVATE
export const deactivateProductDiscount = async (id: string) => {
  await api.put(`/product_discount/${id}/deactivate`);
};