import api from "./api";
import { ProductDiscount, ProductDiscountFormData } from "../types/productDiscount";

/* API → UI Mapper */
export const mapFromApi = (d: any): ProductDiscount => ({
  id: d.id,
  product_id: d.product_id,
  product_name: d.product_name ?? "", // comes from SQL join
  description: d.description,
  discount: d.discount,
  start_date: d.start_date,
  end_date: d.end_date,
  is_active: Boolean(d.is_active),
  created_at: d.created_at,
  updated_at: d.updated_at,
});

/* Convert FormData */
const toFormData = (data: ProductDiscountFormData) => {
  const formData = new FormData();
  if (data.product_id) formData.append("product_id", data.product_id);
  if (data.description) formData.append("description", data.description);
  formData.append("discount", data.discount);
  formData.append("start_date", data.start_date);
  formData.append("end_date", data.end_date);
  formData.append("is_active", data.is_active ? "true" : "false");
  return formData;
};

/* ============================ CRUD ============================ */
export const getAllProductDiscounts = async (): Promise<ProductDiscount[]> => {
  const res = await api.get("/product_discount/list");
  return (res.data.discounts || []).map(mapFromApi);
};

export const createProductDiscount = async (data: ProductDiscountFormData) => {
  await api.post("/product_discount/create", {
    ...data,
    is_active: data.is_active ? true : false
  });
};

export const updateProductDiscount = async (id: string, data: ProductDiscountFormData) => {
  await api.put(`/product_discount/${id}`, toFormData(data));
};

export const deleteProductDiscount = async (id: string) => {
  await api.delete(`/product_discount/${id}`);
};

export const activateProductDiscount = async (id: string) => {
  await api.put(`/product_discount/${id}/activate`);
};