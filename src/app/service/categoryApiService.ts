import { Category, CategoryFormData } from "../types/category";
import api from "../service/api";

/* =========================================================
   Axios instance (recommended)
========================================================= */

/* =========================================================
   Mapper: API → UI
   Convert number (0/1) → boolean
========================================================= */
const mapCategoryFromApi = (cat: any): Category => {
  return {
    id: cat.id,
    name: cat.name,
    description: cat.description ?? "",
    is_active: Boolean(cat.is_active),
    created_at: cat.created_at ?? null,
    updated_at: cat.updated_at ?? null,
  };
};

/* =========================================================
   Mapper: UI → API
   Keep boolean for FastAPI
========================================================= */
const mapCategoryToApi = (data: CategoryFormData) => {
  return {
    name: data.name,
    description: data.description ?? "",
    is_active: Boolean(data.is_active),
  };
};

/* =========================================================
   Get All Categories
========================================================= */
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await api.get("/category/list");

    return (res.data.categories || []).map(mapCategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Categories Error: - categoryApiService.ts:44", error.response?.data);
    throw new Error("Failed to fetch categories");
  }
};

/* =========================================================
   Create Category
========================================================= */
export const createCategory = async (
  payload: CategoryFormData
): Promise<void> => {
  try {
    const body = mapCategoryToApi(payload);

    console.log("Sending body: - categoryApiService.ts:58", body);

    await api.post("/category/create", body);
  } catch (error: any) {
    console.error("Create Category Error: - categoryApiService.ts:62", error.response?.data);
    throw new Error("Failed to create category");
  }
};

/* =========================================================
   Update Category
========================================================= */
export const updateCategory = async (
  id: string,
  payload: CategoryFormData
): Promise<void> => {
  try {
    const body = mapCategoryToApi(payload);

    await api.put(`/category/${id}`, body);
  } catch (error: any) {
    console.error("Update Category Error: - categoryApiService.ts:79", error.response?.data);
    throw new Error("Failed to update category");
  }
};

/* =========================================================
   Delete Category
========================================================= */
export const deleteCategory = async (
  id: string
): Promise<void> => {
  try {
    await api.delete(`/category/${id}`);
  } catch (error: any) {
    console.error("Delete Category Error: - categoryApiService.ts:93", error.response?.data);
    throw new Error("Failed to delete category");
  }
};

/* =========================================================
   Toggle Status
========================================================= */
export const toggleCategoryStatus = async (
  id: string,
  is_active: boolean
): Promise<void> => {
  try {
    await api.put(`/category/${id}/activate`, {
      is_active: Boolean(is_active),
    });
  } catch (error: any) {
    console.error("Toggle Status Error: - categoryApiService.ts:110", error.response?.data);
    throw new Error("Failed to toggle category status");
  }
};

export const activateCategory = async (id: string): Promise<void> => {
  try {
    await api.put(`/category/${id}/activate`);
    console.log(`Category ${id} activated - categoryApiService.ts:118`);
  } catch (error: any) {
    console.error("Activate Category Error: - categoryApiService.ts:120", error.response?.data);
    throw new Error("Failed to activate category");
  }
};

export const deactivateCategory = async (id: string): Promise<void> => {
  try {
    await api.put(`/category/${id}/deactivate`);
    console.log(`Category ${id} deactivated - categoryApiService.ts:128`);
  } catch (error: any) {
    console.error("Deactivate Category Error: - categoryApiService.ts:130", error.response?.data);
    throw new Error("Failed to deactivate category");
  }
};