type RegisterOptions<T = any> = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  min?: { value: number; message: string };
  max?: { value: number; message: string };
};

export const productSetupValidation: Record<string, RegisterOptions<any>> = {
  name: {
    required: "Product name is required",
    minLength: { value: 3, message: "Product name must be at least 3 characters" },
    maxLength: { value: 100, message: "Product name cannot exceed 100 characters" },
  },
  category_id: { 
    required: "Category is required" 
  },
  subcategory_id: { 
    required: "Subcategory is required" 
  },
  description: { 
    maxLength: { value: 500, message: "Description cannot exceed 500 characters" } 
  },
  min_order_qty: { 
    required: "Minimum order quantity is required", 
    min: { value: 1, message: "Min order must be at least 1" } 
  },
};