// components/forms/SubcategoryForm.tsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  SubcategoryFormData,
  SubcategoryFormProps,
} from "../../types/subcategory";
import { subcategoryValidation } from "../../validation/subcategoryValidation";

// ✅ BASE URL
const BASE_URL = "http://127.0.0.1:8000";

export function SubcategoryForm({
  defaultValues,
  defaultCategoryId,
  onSubmit,
  onCancel,
}: SubcategoryFormProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryFormData>({
    defaultValues: {
      category_id: defaultCategoryId ?? "",
      name: "",
      description: "",
      is_active: true,
    },
  });

  /* ---------------- IMAGE PREVIEW (UPLOAD) ---------------- */
  const watchImages = watch("images");

  useEffect(() => {
    if (watchImages && watchImages.length > 0) {
      const urls = Array.from(watchImages).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(urls);
    }
  }, [watchImages]);

  /* ---------------- DEFAULT VALUES (EDIT MODE) ---------------- */
  useEffect(() => {
    if (defaultValues) {
      setValue("category_id", defaultValues.category_id ?? "");
      setValue("name", defaultValues.name ?? "");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", defaultValues.is_active ?? true);

      // ✅ FIXED IMAGE URL HANDLING
      if (defaultValues.images && defaultValues.images.length > 0) {
        setPreviewImages(
          defaultValues.images.map((img) =>
            img.url.startsWith("http")
              ? img.url
              : `${BASE_URL}/${img.url}`
          )
        );
      }
    } else {
      reset({
        category_id: defaultCategoryId ?? "",
        name: "",
        description: "",
        is_active: true,
      });
      setPreviewImages([]);
    }
  }, [defaultValues, defaultCategoryId, setValue, reset]);

  /* ---------------- SUBMIT HANDLER ---------------- */
  const handleFormSubmit = (data: SubcategoryFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
      
      {/* Hidden Fields */}
      <input type="hidden" {...register("category_id")} />
      <input type="hidden" {...register("is_active")} value="true" />

      {/* NAME */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">
          Subcategory Name *
        </label>

        <input
          {...register("name", subcategoryValidation.name)}
          placeholder="e.g. Visiting Cards"
          className={`border rounded-xl px-4 py-2 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />

        {errors.name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Description</label>

        <textarea
          {...register("description")}
          rows={3}
          className="border border-gray-300 rounded-xl px-4 py-2"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-2">Upload Images</label>

        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
        />

        {/* PREVIEW */}
        <div className="flex gap-3 mt-3 flex-wrap">
          {previewImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="preview"
              className="w-20 h-20 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#D73D32] text-white py-2 rounded-xl"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded-xl py-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}