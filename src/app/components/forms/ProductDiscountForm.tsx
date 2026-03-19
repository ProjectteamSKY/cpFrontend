import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  ProductDiscount,
  ProductDiscountFormData,
} from "../../types/productDiscount";
import { getAllProductsActive } from "../../service/productApiService";
import { productDiscountValidation } from "../../validation/productDiscountValidation";

interface Props {
  defaultValues?: ProductDiscount | null;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

const BASE_URL = "http://54.206.3.97";

export function ProductDiscountForm({
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      const data = await getAllProductsActive();
      setProducts(data);
      setLoadingOptions(false);
    };
    loadProducts();
  }, []);

  // Format date
  const formatDateForInput = (date?: string) => {
    if (!date) return "";
    return date.split("T")[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductDiscountFormData>({
    defaultValues: {
      product_id: "",
      title: "",
      description: "",
      discount: "0%",
      cta_text: "",
      start_date: "",
      end_date: "",
      is_active: true,
    },
  });

  // ✅ Helper to resolve image URL — handles relative paths from API
  const resolveImageUrl = (imageUrl?: string | null): string | null => {
    if (!imageUrl) return null;
    return imageUrl.startsWith("http")
      ? imageUrl
      : `${BASE_URL}/${imageUrl}`;
  };

  // Set default values (edit mode)
  useEffect(() => {
    if (defaultValues) {
      setValue("product_id", defaultValues.product_id);
      setValue("title", (defaultValues as any).title ?? "");
      setValue("description", defaultValues.description ?? "");
      setValue("discount", defaultValues.discount);
      setValue("cta_text", (defaultValues as any).cta_text ?? "");
      setValue("start_date", formatDateForInput(defaultValues.start_date));
      setValue("end_date", formatDateForInput(defaultValues.end_date));
      setValue("is_active", true);

      // ✅ API field is "banner_image_url" — was wrongly "banner_image" before
      const existingImage = (defaultValues as any)?.banner_image_url;
      setPreviewUrl(resolveImageUrl(existingImage));

      // Reset file input so stale selection doesn't persist between edits
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      reset();
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [defaultValues, setValue, reset]);

  // Cleanup blob URL on unmount only
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  // ✅ Handle file input change for live preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Revoke previous blob URL to avoid memory leaks
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (file) {
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      // Fall back to existing server image if file selection is cleared
      const existingImage = (defaultValues as any)?.banner_image_url;
      setPreviewUrl(resolveImageUrl(existingImage));
    }
  };

  // Submit
  const handleFormSubmit = async (data: ProductDiscountFormData) => {
    const formData = new FormData();

    formData.append("product_id", data.product_id || "");
    formData.append("title", (data as any).title || "");
    formData.append("description", data.description || "");
    formData.append("discount", data.discount);
    formData.append("cta_text", (data as any).cta_text || "");
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("is_active", data.is_active ? "true" : "false");

    // ✅ Read file directly from ref (not from watch/register)
    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.append("banner_file", file);
    }

    await onSubmit(formData);
  };

  if (loadingOptions)
    return <p className="text-center py-4 text-gray-500">Loading...</p>;

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    >
      {/* Hidden */}
      <input type="hidden" {...register("is_active")} />

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Product Discount</h2>
        <p className="text-sm text-gray-500">Create and manage discount campaigns</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">

        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            {...register("title" as any, { required: "Title is required" })}
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.title && (
            <p className="text-red-500 text-xs">{(errors as any).title?.message}</p>
          )}
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-medium mb-1">Product *</label>
          <select
            {...register("product_id")}
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm font-medium mb-1">Discount *</label>
          <input
            {...register("discount", productDiscountValidation.discount)}
            placeholder="10%"
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
          {errors.discount && (
            <p className="text-red-500 text-xs">{errors.discount.message}</p>
          )}
        </div>

        {/* CTA */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">CTA Text</label>
          <input
            {...register("cta_text" as any)}
            placeholder="Buy Now"
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Banner Upload + Preview */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2">Banner Image</label>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-black transition">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              id="bannerUpload"
            />

            <label
              htmlFor="bannerUpload"
              className="cursor-pointer text-sm text-gray-500 block"
            >
              {previewUrl ? "Click to change image" : "Click to upload"}
            </label>

            {/* ✅ Shows existing banner_image_url on edit, or blob URL on new upload */}
            {previewUrl && (
              <div className="mt-3 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Banner Preview"
                  className="h-32 rounded-lg object-cover border"
                  onError={() => setPreviewUrl(null)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div>
          <label className="block text-sm font-medium mb-1">Start Date *</label>
          <input
            type="date"
            {...register("start_date")}
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">End Date *</label>
          <input
            type="date"
            {...register("end_date")}
            className="w-full px-3 py-2 border rounded-xl text-sm
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full px-3 py-2 border rounded-xl text-sm h-24 resize-none
              focus:outline-none focus:ring-2 focus:ring-black/20"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-black text-white py-2.5 rounded-xl text-sm hover:opacity-90"
        >
          {isSubmitting ? "Saving..." : "Save Discount"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border py-2.5 rounded-xl text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}