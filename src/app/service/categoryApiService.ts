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
    // const res = await api.get("/category/list");
    const res = await api.get("/category/list");
    return (res.data.categories || []).map(mapCategoryFromApi);
  } catch (error: any) {
    console.error("Fetch Categories Error: - categoryApiService.ts:44", error.response?.data);
    throw new Error("Failed to fetch categories");
  }
};

export const getAllsubCategoriesbasedOnCategory = async () => {
    try {
        const response = await api.get("/category/category_list");
        console.log('API Response from category_list: - categoryApiService.ts:52', response.data);
        
        // Return the entire response data
        return response.data;
    } catch (error) {
        console.error('Error fetching categories: - categoryApiService.ts:57', error);
        throw error;
    }
};



/* =========================================================
   Create Category
========================================================= */
export const createCategory = async (
  payload: CategoryFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const body = mapCategoryToApi(payload);

    console.log("Sending body: - categoryApiService.ts:73", body);

    await api.post("/category/create", body);

    return { success: true, message: "Category created successfully" };
  } catch (error: any) {
    if (error.isAxiosError && error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 400 && data?.detail) {
        // Return the exact backend message
        return { success: false, message: data.detail };
      }

      // Other backend errors
      return { success: false, message: data?.detail || "Server error" };
    }

    // Network or unexpected errors
    return { success: false, message: "Failed to create category" };
  }
};

/* =========================================================
   Update Category
========================================================= */
export const updateCategory = async (
  id: string,
  payload: CategoryFormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const body = mapCategoryToApi(payload);

    await api.put(`/category/${id}`, body);

    return { success: true, message: "Category updated successfully" };
  } catch (error: any) {
    console.error("Update Category Error: - categoryApiService.ts:111", error.response?.data);

    return {
      success: false,
      message: error.response?.data?.detail || "Failed to update category",
    };
  }
};

/* =========================================================
   Delete Category
========================================================= */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await api.delete(`/category/${id}`);
  } catch (error: any) {
    console.log("DELETE ERROR: - categoryApiService.ts:127", error.response?.data);

    // ✅ Extract backend message properly
    const message =
      error?.response?.data?.detail || // FastAPI message
      error?.message ||
      "Failed to delete category";

    // ✅ THROW REAL MESSAGE
    throw new Error(message);
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
    console.error("Toggle Status Error: - categoryApiService.ts:152", error.response?.data);
    throw new Error("Failed to toggle category status");
  }
};

export const activateCategory = async (id: string): Promise<void> => {
  try {
    await api.put(`/category/${id}/activate`);
    console.log(`Category ${id} activated - categoryApiService.ts:160`);
  } catch (error: any) {
    console.error("Activate Category Error: - categoryApiService.ts:162", error.response?.data);
    throw new Error("Failed to activate category");
  }
};

export const deactivateCategory = async (id: string): Promise<void> => {
  try {
    await api.put(`/category/${id}/deactivate`);
    console.log(`Category ${id} deactivated - categoryApiService.ts:170`);
  } catch (error: any) {
    console.error("Deactivate Category Error: - categoryApiService.ts:172", error.response?.data);
    throw new Error("Failed to deactivate category");
  }
};