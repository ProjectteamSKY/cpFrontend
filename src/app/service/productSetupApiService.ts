import axios from "axios";
import { ProductSetup, ProductSetupFormData } from "../types/productSetup";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export const getAllProducts = async (): Promise<ProductSetup[] | { products: ProductSetup[], total?: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productsetup/list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products: - productSetupApiService.ts:11", error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<ProductSetup> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productsetup/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}: - productSetupApiService.ts:21`, error);
    throw error;
  }
};

export const createProduct = async (formData: FormData): Promise<ProductSetup> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/productsetup/create`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product: - productSetupApiService.ts:33", error);
    throw error;
  }
};

export const updateProduct = async (id: string, formData: FormData): Promise<ProductSetup> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/productsetup/update/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}: - productSetupApiService.ts:45`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/productsetup/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}: - productSetupApiService.ts:54`, error);
    throw error;
  }
};