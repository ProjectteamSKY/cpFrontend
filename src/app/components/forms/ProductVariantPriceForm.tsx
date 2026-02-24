import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { ProductVariantPrice, ProductVariantPriceFormData } from "../../types/productVariantPrice";
import { getAllProductVariants } from "../../service/productVariantApiService";
import { getAllProductDiscounts } from "../../service/productDiscountApiService";
import { productVariantPriceValidation } from "../../validation/productVariantPriceValidation";

interface Props {
  defaultValues?: ProductVariantPrice | null;
  onSubmit: (data: ProductVariantPriceFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductVariantPriceForm({ defaultValues, onSubmit, onCancel }: Props) {
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

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductVariantPriceFormData>({
    values: defaultValues
      ? {
          variant_id: defaultValues.variant_id,
          min_qty: defaultValues.min_qty,
          max_qty: defaultValues.max_qty,
          price: defaultValues.price,
          discount_id: defaultValues.discount_id ?? "",
          is_active: defaultValues.is_active ?? true,
        }
      : { variant_id: "", min_qty: 1, max_qty: 1, price: 0, discount_id: "", is_active: true },
  });

  if (loadingOptions) return <p className="text-center py-4">Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Variant */}
      <div>
        <Label>Variant *</Label>
        <select {...register("variant_id", productVariantPriceValidation.variant_id)} className="w-full border rounded px-3 py-2">
          <option value="">Select Variant</option>
          {variants.map(v => (
            <option key={v.id} value={v.id}>
              {v.product_name} - {v.size_name}
            </option>
          ))}
        </select>
        {errors.variant_id && <p className="text-red-500 text-sm">{errors.variant_id.message}</p>}
      </div>

       <div>
        <Label>Discount</Label>
        <select {...register("discount_id")} className="w-full border rounded px-3 py-2">
          <option value="">No Discount</option>
          {discounts.map(d => (
            <option key={d.id} value={d.id}>
              {d.product_name} - {d.description} ({d.discount})
            </option>
          ))}
        </select>
      </div>

      {/* Min Qty */}
      <div>
        <Label>Min Qty *</Label>
        <input type="number" {...register("min_qty", productVariantPriceValidation.min_qty)} className="w-full border rounded px-3 py-2"/>
        {errors.min_qty && <p className="text-red-500 text-sm">{errors.min_qty.message}</p>}
      </div>

      {/* Max Qty */}
      <div>
        <Label>Max Qty *</Label>
        <input type="number" {...register("max_qty", productVariantPriceValidation.max_qty)} className="w-full border rounded px-3 py-2"/>
        {errors.max_qty && <p className="text-red-500 text-sm">{errors.max_qty.message}</p>}
      </div>

      {/* Price */}
      <div>
        <Label>Price *</Label>
        <input type="number" step="0.01" {...register("price", productVariantPriceValidation.price)} className="w-full border rounded px-3 py-2"/>
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>

      {/* Discount */}
     

      {/* Active */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")}/>
        <Label>Active</Label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#D73D32] text-white">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
      </div>

    </form>
  );
}