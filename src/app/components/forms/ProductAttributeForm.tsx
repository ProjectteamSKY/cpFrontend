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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductAttributeFormData>({
    mode: "onTouched",
    defaultValues: {
      product_id: defaultValues?.product_id ?? "",
      attribute_id: defaultValues?.attribute_id ?? "",
      is_required: defaultValues?.is_required ?? true,
      sort_order: defaultValues?.sort_order ?? 0,
    },
  });

  // 🔥 Fetch dropdown data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [attrRes, prodRes] = await Promise.all([
          getAllAttributes(),
          getAllProductsActive(),
        ]);

        setAttributes(attrRes);
        setProducts(prodRes);
      } catch {
        console.error("Failed to load dropdown data");
      }
    };

    loadData();
  }, []);

  // 🔥 Reset on edit
  useEffect(() => {
    if (defaultValues) {
      reset({
        product_id: defaultValues.product_id,
        attribute_id: defaultValues.attribute_id,
        is_required: defaultValues.is_required,
        sort_order: defaultValues.sort_order,
      });
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: ProductAttributeFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="w-full space-y-6">
      {/* Product */}
      <div className="flex flex-col px-3">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Product <span className="text-red-500">*</span>
        </label>

        <select
          {...register("product_id", productAttributeValidation.product_id)}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
            errors.product_id
              ? "border-red-500 ring-1 ring-red-200"
              : "border-gray-300 focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20"
          }`}
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <p className="mt-1.5 text-xs text-red-500 min-h-[18px]">
          {errors.product_id?.message || ""}
        </p>
      </div>

      {/* Attribute */}
      <div className="flex flex-col px-3">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Attribute <span className="text-red-500">*</span>
        </label>

        <select
          {...register("attribute_id", productAttributeValidation.attribute_id)}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
            errors.attribute_id
              ? "border-red-500 ring-1 ring-red-200"
              : "border-gray-300 focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20"
          }`}
        >
          <option value="">Select Attribute</option>
          {attributes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <p className="mt-1.5 text-xs text-red-500 min-h-[18px]">
          {errors.attribute_id?.message || ""}
        </p>
      </div>

      {/* Sort Order */}
      <div className="flex flex-col px-3">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Sort Order <span className="text-red-500">*</span>
        </label>

        <input
          type="number"
          {...register("sort_order", productAttributeValidation.sort_order)}
          placeholder="0"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${
            errors.sort_order
              ? "border-red-500 ring-1 ring-red-200"
              : "border-gray-300 focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20"
          }`}
        />

        <p className="mt-1.5 text-xs text-red-500 min-h-[18px]">
          {errors.sort_order?.message || ""}
        </p>
      </div>

      {/* Required Toggle */}
      <div className="flex items-center justify-between px-3">
        <span className="text-sm font-medium text-gray-800">
          Is Required
        </span>

        <input
          type="checkbox"
          {...register("is_required")}
          className="h-5 w-5 accent-[#D73D32]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 px-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 rounded-xl bg-[#D73D32] text-white py-2.5 text-sm font-semibold transition ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-[#c2341f]"
          }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-gray-300 text-gray-700 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}