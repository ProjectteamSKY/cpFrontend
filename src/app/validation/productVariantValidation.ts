import { RegisterOptions } from "react-hook-form";
import { ProductVariantFormData } from "../types/productVariant";

type VariantValidationType = {
  product_id: RegisterOptions<ProductVariantFormData, "product_id">;
  size_id: RegisterOptions<ProductVariantFormData, "size_id">;
  sides: RegisterOptions<ProductVariantFormData, "sides">;
  orientation: RegisterOptions<ProductVariantFormData, "orientation">;
};

export const productVariantValidation: VariantValidationType = {
  product_id: {
    required: "Product ID is required",
  },

  size_id: {
    required: "Size ID is required",
  },

  sides: {
    min: {
      value: 1,
      message: "Sides must be at least 1",
    },
  },

  orientation: {
    required: "Orientation is required",
  },
};