type RegisterOptions<T = any> = {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  validate?: (value: T, formValues?: any) => boolean | string;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
};

export const productsetupValidation: Record<string, RegisterOptions<any>> = {
  name: {
    required: "Product name is required",
    minLength: { value: 3, message: "Product name must be at least 3 characters" },
    maxLength: { value: 100, message: "Product name cannot exceed 100 characters" },
  },
  category_id: { required: "Category is required" },
  subcategory_id: { required: "Subcategory is required" },
  description: { 
    maxLength: { value: 500, message: "Description cannot exceed 500 characters" } 
  },
  min_order_qty: { 
    required: "Minimum order quantity is required", 
    min: { value: 1, message: "Min order must be at least 1" } 
  },
  max_order_qty: {
    validate: (value: number, formValues: any) => {
      if (!value) return "Maximum order quantity is required";
      if (value < formValues?.min_order_qty) {
        return "Max order must be greater than or equal to min order";
      }
      return true;
    },
  },
  images: {
    validate: (files: FileList) => {
      if (!files || files.length === 0) return "At least one image is required";
      if (files.length > 5) return "Maximum 5 images allowed";
      
      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          return `File ${files[i].name} is not a valid image type. Allowed: JPG, PNG, GIF`;
        }
      }
      
      // Validate file size (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          return `File ${files[i].name} exceeds 5MB limit`;
        }
      }
      
      return true;
    },
  },
  related_images: {
    validate: (files: FileList) => {
      if (!files) return true; // Related images are optional
      if (files.length > 5) return "Maximum 5 related images allowed";
      
      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      for (let i = 0; i < files.length; i++) {
        if (!allowedTypes.includes(files[i].type)) {
          return `File ${files[i].name} is not a valid image type. Allowed: JPG, PNG, GIF`;
        }
      }
      
      // Validate file size (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > maxSize) {
          return `File ${files[i].name} exceeds 5MB limit`;
        }
      }
      
      return true;
    },
  },
};