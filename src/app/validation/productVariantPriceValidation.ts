import { RegisterOptions } from "react-hook-form";
import { ProductVariantPriceFormData } from "../types/productVariantPrice";

type PriceValidationType = {
  variant_id: RegisterOptions<ProductVariantPriceFormData, "variant_id">;
  min_qty: RegisterOptions<ProductVariantPriceFormData, "min_qty">;
  price: RegisterOptions<ProductVariantPriceFormData, "price">;
};

export const productVariantPriceValidation: PriceValidationType = {
  variant_id: {
    required: "Variant is required",
  },
  min_qty: {
    required: "Minimum quantity is required",
    min: { value: 1, message: "Minimum quantity must be at least 1" },
  },
  price: {
    required: "Price is required",
    min: { value: 0, message: "Price cannot be negative" },
  },
};