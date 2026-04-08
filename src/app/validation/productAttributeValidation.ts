import { RegisterOptions } from "react-hook-form";
import { ProductAttributeFormData } from "../types/productAttribute";

export const productAttributeValidation: {
  product_id: RegisterOptions<ProductAttributeFormData, "product_id">;
  attribute_id: RegisterOptions<ProductAttributeFormData, "attribute_id">;
  sort_order: RegisterOptions<ProductAttributeFormData, "sort_order">;
} = {
  product_id: {
    required: "Product is required",
  },

  attribute_id: {
    required: "Attribute is required",
  },

  sort_order: {
    required: "Sort order is required",
    valueAsNumber: true,
    validate: {
      nonNegative: (value: number) =>
        value >= 0 || "Sort order must be >= 0",
    },
  },
};