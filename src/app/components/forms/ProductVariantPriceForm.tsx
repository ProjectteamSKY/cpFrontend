import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Label } from "../ui/label";

import {
  ProductVariantPrice,
  ProductVariantPriceFormData,
} from "../../types/productVariantPrice";

import { getAllProductVariants } from "../../service/productVariantApiService";
import { getAllProductDiscounts } from "../../service/productDiscountApiService";
import { productVariantPriceValidation } from "../../validation/productVariantPriceValidation";

interface Props {
  defaultValues?: ProductVariantPrice | null;
  onSubmit: (data: ProductVariantPriceFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductVariantPriceForm({
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const [variants, setVariants] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      const [variantData, discountData] = await Promise.all([
        getAllProductVariants(),
        getAllProductDiscounts(),
      ]);
      setVariants(variantData);
      setDiscounts(discountData);
      setLoadingOptions(false);
    };
    loadOptions();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductVariantPriceFormData>({
    values: defaultValues
      ? {
          variant_id: defaultValues.variant_id,
          min_qty: defaultValues.min_qty,
          price: defaultValues.price,
          discount_id: defaultValues.discount_id ?? "",
          is_active: true, // always true
        }
      : {
          variant_id: "",
          min_qty: 1,
          price: 0,
          discount_id: "",
          is_active: true,
        },
  });

  if (loadingOptions)
    return <p className="text-center py-4 text-gray-500">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      {/* ✅ Hidden Active */}
      <input type="hidden" {...register("is_active")} value="true" />

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Variant Pricing
        </h2>
        <p className="text-sm text-gray-500">
          Configure pricing for product variants
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Variant */}
        <div className="col-span-2">
          <Label className="mb-1 block">Variant *</Label>
          <select
            {...register(
              "variant_id",
              productVariantPriceValidation.variant_id
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="">Select Variant</option>
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.product_name} - {v.size_name}
              </option>
            ))}
          </select>
          {errors.variant_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.variant_id.message}
            </p>
          )}
        </div>

        {/* Discount */}
        <div className="col-span-2">
          <Label className="mb-1 block">Discount</Label>
          <select
            {...register("discount_id")}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="">No Discount</option>
            {discounts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.product_name} - {d.description} ({d.discount})
              </option>
            ))}
          </select>
        </div>

        {/* Min Qty */}
        <div>
          <Label className="mb-1 block">Min Qty *</Label>
          <input
            type="number"
            {...register(
              "min_qty",
              productVariantPriceValidation.min_qty
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.min_qty && (
            <p className="text-red-500 text-xs mt-1">
              {errors.min_qty.message}
            </p>
          )}
        </div>

        {/* Price */}
        <div>
          <Label className="mb-1 block">Unit Price *</Label>
          <input
            type="number"
            step="0.01"
            {...register(
              "price",
              productVariantPriceValidation.price
            )}
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
        >
          {isSubmitting ? "Saving..." : "Save Price"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1 py-2.5 rounded-xl text-sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}