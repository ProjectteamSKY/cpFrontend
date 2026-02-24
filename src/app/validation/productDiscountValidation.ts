import { RegisterOptions } from "react-hook-form";
import { ProductDiscountFormData } from "../types/productDiscount";

type DiscountValidationType = {
  discount: RegisterOptions<ProductDiscountFormData, "discount">;
  start_date: RegisterOptions<ProductDiscountFormData, "start_date">;
  end_date: RegisterOptions<ProductDiscountFormData, "end_date">;
};

export const productDiscountValidation: DiscountValidationType = {
  discount: {
    required: "Discount is required",
  },
  start_date: {
    required: "Start date is required",
  },
  end_date: {
    required: "End date is required",
    validate: (value, formValues) =>
      new Date(value) >= new Date(formValues.start_date) || "End date cannot be before start date",
  },
};