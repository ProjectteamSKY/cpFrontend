import { Subcategory, SubcategoryFormData } from "../types/subcategory";
import api from "../service/api";

/* ------------------- API → UI Mapper ------------------- */
const mapSubcategoryFromApi = (sub: any): Subcategory => ({
  id: sub.id,
  category_id: sub.category_id,
  name: sub.name,
  description: sub.description ?? "",
  images: sub.images ?? [],   // ✅ IMPORTANT
  is_active: Boolean(sub.is_active),
  created_at: sub.created_at ?? null,
  updated_at: sub.updated_at ?? null,
});

/* ------------------- UI → API Mapper ------------------- */
const mapSubcategoryToApi = (data: SubcategoryFormData) => ({
  name: data.name,
  description: data.description ?? "",
  is_active: Boolean(data.is_active),
  category_id: data.category_id,
});


export const getSubcategoriesByCategoryId = async (
  categoryId?: string
): Promise<Subcategory[]> => {
  const response = await api.get("/subcategory/list", {
    params: categoryId ? { category_id: categoryId } : {},
  });

  return response.data.subcategories;   // 👈 RETURN ARRAY ONLY
};

/* ------------------- CRUD ------------------- */
export const getAllSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  try {
    const res = await api.get("/subcategory/list", {
      params: categoryId ? { category_id: categoryId } : {}, // query param
    });
    console.log("SUBCATEGORY RESPONSE: - subcategoryApiService.ts:41", res);
    return (res.data.subcategories || []).map(mapSubcategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Subcategories Error: - subcategoryApiService.ts:44", error.response?.data ?? error);
    throw new Error("Failed to fetch subcategories");
  }
};

/* Fetch all subcategories (no category filter) */
export const getAllSubcategoriesss = async (): Promise<Subcategory[]> => {
  try {
    const res = await api.get("/subcategory/list"); // no params
    return (res.data.subcategories || []).map(mapSubcategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Subcategories Error: - subcategoryApiService.ts:55", error.response?.data ?? error);
    throw new Error("Failed to fetch subcategories");
  }
};

// createSubcategory

export const createSubcategory = async (data: SubcategoryFormData) => {
  const formData = new FormData();

  formData.append("category_id", data.category_id);
  formData.append("name", data.name);
  formData.append("description", data.description ?? "");
  formData.append("is_active", String(data.is_active));

  // ✅ IMAGES
  if (data.images) {
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
  }

  const res = await api.post("/subcategory/create", formData);
  return res.data;
};

// updateSubcategory

export const updateSubcategory = async (
  id: string,
  data: SubcategoryFormData
) => {
  const formData = new FormData();

  formData.append("category_id", data.category_id);
  formData.append("name", data.name);
  formData.append("description", data.description ?? "");
  formData.append("is_active", String(data.is_active));

  // ✅ IMAGES
  if (data.images) {
    Array.from(data.images).forEach((file) => {
      formData.append("images", file);
    });
  }

  await api.put(`/subcategory/update/${id}`, formData);
};

export const deleteSubcategory = async (id: string): Promise<void> => {
  await api.delete(`/subcategory/delete/subcategory/${id}`);  
};

export const activateSubcategory = async (id: string): Promise<void> => {
  await api.put(`/subcategory/${id}/activate`);
};

export const deactivateSubcategory = async (id: string): Promise<void> => {
  await api.put(`/subcategory/${id}/deactivate`);
};