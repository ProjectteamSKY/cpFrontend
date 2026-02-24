// import { RegisterOptions } from "react-hook-form";
// import { ProductSetupFormData, ProductPriceFormData, ProductVariantFormData, ProductDiscountPayload } from "../types/productSetup";

// // Price validation
// export const priceValidation: Record<keyof ProductPriceFormData, RegisterOptions<ProductPriceFormData, any>> = {
//   min_qty: { required: "Min quantity is required", min: { value: 1, message: "Min must be ≥1" } },
//   max_qty: { min: { value: 1, message: "Max must be ≥1" } },
//   price: { required: "Price is required", min: { value: 0, message: "Price cannot be negative" } },
//   discount: {},
//   id: {},
// };

// // Variant validation
// export const variantValidation: Record<keyof ProductVariantFormData, RegisterOptions<ProductVariantFormData, any>> = {
//   size_id: { required: "Size is required" },
//   paper_type_id: { required: "Paper Type is required" },
//   print_type_id: { required: "Print Type is required" },
//   cut_type_id: { required: "Cut Type is required" },
//   sides: { required: "Sides required", min: { value: 1, message: "Must be ≥1" } },
//   two_side_cut: {},
//   four_side_cut: {},
//   orientation: { required: "Orientation required" },
//   prices: { 
//     required: "At least one price is required", 
//     validate: (v: ProductPriceFormData[]) => v.length > 0 || "Add at least one price" 
//   },
//   id: {},
// };

// // Product validation
// export const productSetupValidation: Record<keyof ProductSetupFormData, RegisterOptions<ProductSetupFormData, any>> = {
//   id: {}, // Add this line
//   category_id: { required: "Category required" },
//   subcategory_id: { required: "Subcategory required" },
//   name: { required: "Name required" },
//   description: {},
//   min_order_qty: { required: "Min order required", min: { value: 1, message: "Min must be ≥1" } },
//   max_order_qty: { min: { value: 1, message: "Max must be ≥1" } },
//   images: {},
//   related_images: {},
//   variants: { required: "Add at least one variant", validate: (v) => v.length > 0 || "Add at least one variant" },
// };