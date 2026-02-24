import { RegisterOptions } from "react-hook-form";
import { ProductFormData } from "../types/product";

type ProductValidationType = {
  name: RegisterOptions<ProductFormData, "name">;
  category_id: RegisterOptions<ProductFormData, "category_id">;
  subcategory_id: RegisterOptions<ProductFormData, "subcategory_id">;
  description: RegisterOptions<ProductFormData, "description">;
  min_order_qty: RegisterOptions<ProductFormData, "min_order_qty">;
  max_order_qty: RegisterOptions<ProductFormData, "max_order_qty">;
  images: RegisterOptions<ProductFormData, "images">;
  related_images: RegisterOptions<ProductFormData, "related_images">;
};

export const productValidation: ProductValidationType = {
  name: {
    required: "Product name is required",
    minLength: {
      value: 3,
      message: "Product name must be at least 3 characters",
    },
    maxLength: {
      value: 100,
      message: "Product name cannot exceed 100 characters",
    },
  },

  category_id: {
    required: "Category is required",
  },

  subcategory_id: {
    required: "Subcategory is required",
  },

  description: {
    maxLength: {
      value: 500,
      message: "Description cannot exceed 500 characters",
    },
  },

  min_order_qty: {
    required: "Minimum order quantity is required",
    valueAsNumber: true,
    min: {
      value: 1,
      message: "Minimum order must be at least 1",
    },
  },

  max_order_qty: {
    valueAsNumber: true,
    validate: (value, formValues) => {
      if (
        value !== undefined &&
        formValues.min_order_qty !== undefined &&
        value < formValues.min_order_qty
      ) {
        return "Max order quantity must be greater than or equal to Min order quantity";
      }
      return true;
    },
  },

  images: {
    validate: (files) => {
      if (!files || files.length === 0) {
        return "At least one image is required";
      }

      if (files.length > 5) {
        return "Maximum 5 images allowed";
      }

      return true;
    },
  },

  related_images: {
    validate: (files) => {
      if (files && files.length > 5) {
        return "Maximum 5 related images allowed";
      }
      return true;
    },
  },
};