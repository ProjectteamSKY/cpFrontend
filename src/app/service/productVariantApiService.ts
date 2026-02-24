import api from "./api";
import {
  ProductVariant,
  ProductVariantFormData,
} from "../types/productVariant";

/* ============================
   Mapper: API → UI
============================ */
const mapFromApi = (v: any): ProductVariant => ({
  id: v.id,

  product_id: v.product_id,
  product_name: v.product_name ?? "",

  size_id: v.size_id,
  size_name: v.size_name ?? "",

  paper_type_id: v.paper_type_id ?? null,
  paper_type_name: v.paper_type_name ?? "",

  print_type_id: v.print_type_id ?? null,
  print_type_name: v.print_type_name ?? "",

  cut_type_id: v.cut_type_id ?? null,
  cut_type_name: v.cut_type_name ?? "",

  sides: v.sides ?? null,

  two_side_cut: Boolean(v.two_side_cut),
  four_side_cut: Boolean(v.four_side_cut),

  orientation: v.orientation,
  is_active: Boolean(v.is_active),

  created_at: v.created_at ?? null,
  updated_at: v.updated_at ?? null,
});

/* ============================
   Helper: Convert to FormData
============================ */
const toFormData = (data: ProductVariantFormData) => {
  const formData = new FormData();

  // Required
  formData.append("product_id", data.product_id);
  formData.append("size_id", data.size_id);

  // Optional
  if (data.paper_type_id)
    formData.append("paper_type_id", data.paper_type_id);

  if (data.print_type_id)
    formData.append("print_type_id", data.print_type_id);

  if (data.cut_type_id)
    formData.append("cut_type_id", data.cut_type_id);

  if (data.sides !== undefined && data.sides !== null)
    formData.append("sides", String(Number(data.sides)));

  // Always send booleans
  formData.append("two_side_cut", data.two_side_cut ? "true" : "false");
  formData.append("four_side_cut", data.four_side_cut ? "true" : "false");

  formData.append("orientation", data.orientation);

  return formData;
};

/* ============================
   Get All
============================ */
export const getAllProductVariants = async (): Promise<ProductVariant[]> => {
  const res = await api.get("/product_variant/list");
  return (res.data.variants || []).map(mapFromApi);
};

/* ============================
   Create
============================ */
export const createProductVariant = async (
  data: ProductVariantFormData
) => {
  await api.post("/product_variant/create", toFormData(data));
};

/* ============================
   Update
============================ */
export const updateProductVariant = async (
  id: string,
  data: ProductVariantFormData
) => {
  await api.put(`/product_variant/${id}`, toFormData(data));
};

/* ============================
   Delete
============================ */
export const deleteProductVariant = async (id: string) => {
  await api.delete(`/product_variant/${id}`);
};

/* ============================
   Activate
============================ */
export const activateProductVariant = async (id: string) => {
  await api.put(`/product_variant/${id}/activate`);
};