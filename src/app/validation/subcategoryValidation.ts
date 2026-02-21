import { RegisterOptions } from "react-hook-form";
import { SubcategoryFormData } from "../types/subcategory";

export const subcategoryValidation: {
  [K in keyof SubcategoryFormData]?: RegisterOptions<SubcategoryFormData, K>;
} = {
  name: {
    required: "Subcategory name is required",
    minLength: { value: 3, message: "Must be at least 3 characters" },
    maxLength: { value: 50, message: "Cannot exceed 50 characters" },
  },
  description: {
    maxLength: { value: 200, message: "Cannot exceed 200 characters" },
  },
  is_active: {},
  category_id: {
    required: "Category ID is required",
  },
};