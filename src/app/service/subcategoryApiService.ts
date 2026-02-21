import { Subcategory, SubcategoryFormData } from "../types/subcategory";
import api from "../service/api";

/* ------------------- API → UI Mapper ------------------- */
const mapSubcategoryFromApi = (sub: any): Subcategory => ({
  id: sub.id,
  category_id: sub.category_id,
  name: sub.name,
  description: sub.description ?? "",
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

/* ------------------- CRUD ------------------- */
export const getAllSubcategories = async (categoryId?: string): Promise<Subcategory[]> => {
  try {
    const res = await api.get("/subcategory/list", {
      params: categoryId ? { category_id: categoryId } : {}, // query param
    });
    return (res.data.subcategories || []).map(mapSubcategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Subcategories Error: - subcategoryApiService.ts:31", error.response?.data ?? error);
    throw new Error("Failed to fetch subcategories");
  }
};

/* Fetch all subcategories (no category filter) */
export const getAllSubcategoriesss = async (): Promise<Subcategory[]> => {
  try {
    const res = await api.get("/subcategory/list"); // no params
    return (res.data.subcategories || []).map(mapSubcategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Subcategories Error: - subcategoryApiService.ts:42", error.response?.data ?? error);
    throw new Error("Failed to fetch subcategories");
  }
};

export const createSubcategory = async (data: SubcategoryFormData) => {
  if (!data.category_id) {
    throw new Error("Category ID is required to create a subcategory");
  }

  const formData = new FormData();
  formData.append("category_id", data.category_id);
  formData.append("name", data.name);
  formData.append("description", data.description ?? "");
  formData.append("is_active", String(data.is_active)); // backend expects string

  try {
    const res = await api.post("/subcategory/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // return created subcategory for UI
  } catch (error: any) {
    console.error("Create Subcategory Error: - subcategoryApiService.ts:64", error.response?.data ?? error);
    throw new Error("Failed to create subcategory");
  }
};

export const updateSubcategory = async (
  id: string,
  data: SubcategoryFormData
): Promise<void> => {
  const formData = new FormData();
  formData.append("category_id", data.category_id);
  formData.append("name", data.name);
  formData.append("description", data.description ?? "");
  formData.append("is_active", String(data.is_active)); // convert boolean to string

  try {
    await api.put(`/subcategory/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error: any) {
    console.error("Update Subcategory Error: - subcategoryApiService.ts:84", error.response?.data ?? error);
    throw new Error("Failed to update subcategory");
  }
};

export const deleteSubcategory = async (id: string): Promise<void> => {
  await api.delete(`/subcategory/${id}`);
};

export const activateSubcategory = async (id: string): Promise<void> => {
  await api.put(`/subcategory/${id}/activate`);
};

export const deactivateSubcategory = async (id: string): Promise<void> => {
  await api.put(`/subcategory/${id}/deactivate`);
};