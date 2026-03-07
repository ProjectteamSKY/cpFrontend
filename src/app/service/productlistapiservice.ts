// src/services/ProductListApiService.ts
import axios, { AxiosInstance } from "axios";

// Define the Product Image type
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

// Service class
class ProductListApiService {
  private api: AxiosInstance;

  constructor(baseURL: string = "http://127.0.0.1:8000/api") {  
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Fetch all products
  async getAllProducts() {
    try {
      const response = await this.api.get("/product/");
      return response.data; // you can type this as Product[] if you have a Product interface
    } catch (error: any) {
      console.error("Error fetching products: - productlistapiservice.ts:32", error);
      throw error;
    }
  }

  // Fetch product images by product ID
  async getProductImages(productId: string): Promise<ProductImage[]> {
    try {
      const response = await this.api.get(`/product_image/product/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching images for product ${productId}: - productlistapiservice.ts:43`, error);
      throw error;
    }
  }

  // Optional: Fetch single product by ID
  async getProductById(productId: string) {
    try {
      const response = await this.api.get(`/product/${productId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching product ${productId}: - productlistapiservice.ts:54`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export default new ProductListApiService();
