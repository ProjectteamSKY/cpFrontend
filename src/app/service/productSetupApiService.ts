// import axios from "axios";
// import { ProductSetup, ProductSetupFormData } from "../types/productSetup";



// // CREATE PRODUCT
// export const createProduct = async (
//   data: ProductSetupFormData
// ): Promise<{ status: string; product_id: string }> => {
//   const formData = new FormData();

//   // --- Basic Product Info ---
//   formData.append("category_id", data.category_id);
//   formData.append("subcategory_id", data.subcategory_id || "");
//   formData.append("name", data.name);
//   formData.append("description", data.description || "");
//   formData.append("min_order_qty", String(data.min_order_qty || 100));
//   formData.append("max_order_qty", String(data.max_order_qty || 0));

//   // --- Images ---
//   if (data.images?.length) {
//     data.images.forEach((file) => formData.append("images", file, file.name));
//   }
//   if (data.related_images?.length) {
//     data.related_images.forEach((file) =>
//       formData.append("related_images", file, file.name)
//     );
//   }

//   // --- Variants + Prices ---
//   const cleanVariants = (data.variants || []).map((variant) => ({
//     ...variant,
//     prices: (variant.prices || []).map((p) => ({
//       min_qty: p.min_qty,
//       max_qty: p.max_qty,
//       price: Number(p.price), // <-- convert to number
//       discount: undefined, // backend expects null/undefined
//     })),
//   }));

//   formData.append("variants", JSON.stringify(cleanVariants));

//   // --- Send Request ---
//   const response = await axios.post(
//     "http://127.0.0.1:8000/api/productsetup/create",
//     formData,
//     {
//       headers: { "Content-Type": "multipart/form-data" },
//     }
//   );

//   return response.data;
// };
// // DELETE PRODUCT
// export const deleteProduct = async (id: string): Promise<void> => {
//     await axios.delete(`http://127.0.0.1:8000/api/productsetup/delete/${id}`);
// };

// // LIST ALL PRODUCTS
// export const getAllProducts = async (): Promise<ProductSetup[]> => {
//     const response = await axios.get("http://127.0.0.1:8000/api/productsetup/list");
//     return response.data;
// };


import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/productsetup";

export const createProduct = async (formData: FormData) => {
  const response = await axios.post(
    `${API_BASE_URL}/create`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const updateProduct = async (
  productId: string,
  formData: FormData
) => {
  const response = await axios.put(
    `${API_BASE_URL}/update/${productId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export const getAllProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/list`);
  return response.data?.products || [];
};

export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/delete/${productId}`
  );
  return response.data;
};

export const activateProduct = async (productId: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/toggle-status/${productId}`
  );
  return response.data;
};