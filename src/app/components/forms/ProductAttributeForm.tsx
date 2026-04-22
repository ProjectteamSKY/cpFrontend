import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  ProductAttribute,
  ProductAttributeFormData,
} from "../../types/productAttribute";

import { productAttributeValidation } from "../../validation/productAttributeValidation";

import { getAllAttributes } from "../../service/attributeApiService";
import { getAllProductsActive } from "../../service/productApiService";

interface Attribute {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
}

interface Props {
  defaultValues?: ProductAttribute | null;
  onSubmit: (data: ProductAttributeFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductAttributeForm({
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductAttributeFormData>({
    mode: "onTouched",
  });

  const selectedProduct = watch("product_id");
  const selectedAttribute = watch("attribute_id");

  // 🔥 Load dropdown data FIRST
  useEffect(() => {
    const loadData = async () => {
      try {
        const [attrRes, prodRes] = await Promise.all([
          getAllAttributes(),
          getAllProductsActive(),
        ]);

        setAttributes(attrRes || []);
        setProducts(prodRes || []);

        // ✅ AFTER data loaded → set form values
        if (defaultValues) {
          reset({
            product_id: defaultValues.product_id || "",
            attribute_id: defaultValues.attribute_id || "",
            is_required: defaultValues.is_required ?? true,
            sort_order: defaultValues.sort_order ?? 0,
          });
        } else {
          reset({
            product_id: "",
            attribute_id: "",
            is_required: true,
            sort_order: 0,
          });
        }
      } catch (err) {
        console.error("Dropdown load failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [defaultValues, reset]);

  const submitHandler = async (data: ProductAttributeFormData) => {
    await onSubmit(data);
  };

  if (loading) {
    return <p className="text-center py-6">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

      {/* Product */}
      <div>
        <label className="text-sm font-medium">Product *</label>
        <select
          value={selectedProduct || ""}
          {...register("product_id", productAttributeValidation.product_id)}
          className="w-full border rounded-xl px-3 py-2"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-red-500">{errors.product_id?.message}</p>
      </div>

      {/* Attribute */}
      <div>
        <label className="text-sm font-medium">Attribute *</label>
        <select
          value={selectedAttribute || ""}
          {...register("attribute_id", productAttributeValidation.attribute_id)}
          className="w-full border rounded-xl px-3 py-2"
        >
          <option value="">Select Attribute</option>
          {attributes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-red-500">{errors.attribute_id?.message}</p>
      </div>

      {/* Sort Order */}
      <div>
        <label className="text-sm font-medium">Sort Order *</label>
        <input
          type="number"
          {...register("sort_order", productAttributeValidation.sort_order)}
          className="w-full border rounded-xl px-3 py-2"
        />
        <p className="text-xs text-red-500">{errors.sort_order?.message}</p>
      </div>

      {/* Required */}
      <div className="flex justify-between">
        <span>Is Required</span>
        <input type="checkbox" {...register("is_required")} />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-red-500 text-white py-2 rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border py-2 rounded-xl"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}