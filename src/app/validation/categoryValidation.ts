import { RegisterOptions } from "react-hook-form";
import { CategoryFormData } from "../types/category";

type CategoryValidationType = {
  name: RegisterOptions<CategoryFormData, "name">;
  description: RegisterOptions<CategoryFormData, "description">;
  is_active: RegisterOptions<CategoryFormData, "is_active">;
};

export const categoryValidation: CategoryValidationType = {
  name: {
    required: "Category name is required",
    minLength: {
      value: 3,
      message: "Category name must be at least 3 characters",
    },
    maxLength: {
      value: 50,
      message: "Category name cannot exceed 50 characters",
    },
  },

  description: {
    maxLength: {
      value: 200,
      message: "Description cannot exceed 200 characters",
    },
  },

  is_active: {},
};