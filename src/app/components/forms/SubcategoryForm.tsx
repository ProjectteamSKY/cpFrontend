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
  const [previewImage, setPreviewImage] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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
      const file = watchImages[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
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
        const imgUrl = defaultValues.images[0].url.startsWith("http")
          ? defaultValues.images[0].url
          : `${BASE_URL}/${defaultValues.images[0].url}`;
        setPreviewImage(imgUrl);
      }
    } else {
      reset({
        category_id: defaultCategoryId ?? "",
        name: "",
        description: "",
        is_active: true,
      });
      setPreviewImage("");
      setImageFile(null);
    }
  }, [defaultValues, defaultCategoryId, setValue, reset]);

  /* ---------------- IMAGE HANDLERS ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file");
        return;
      }
      
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setValue("images", [file] as any);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = Array.from(e.dataTransfer.files).find(
      (file) => file.type.startsWith("image/")
    );
    
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setValue("images", [file] as any);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setPreviewImage("");
    setImageFile(null);
    setValue("images", []);
    
    // Clear the file input
    const fileInput = document.getElementById("image-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  /* ---------------- SUBMIT HANDLER ---------------- */
  const handleFormSubmit = (data: SubcategoryFormData) => {
    // Ensure all required fields are present
    const submitData = {
      ...data,
      images: imageFile ? [imageFile] : data.images,
    };
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
      {/* Hidden Fields */}
      <input type="hidden" {...register("category_id")} />
      <input type="hidden" {...register("is_active")} value="true" />

      {/* NAME FIELD - REQUIRED */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">
          Subcategory Name <span className="text-red-500">*</span>
        </label>

        <input
          {...register("name", subcategoryValidation.name)}
          placeholder="e.g. Visiting Cards, Brochures, Flyers"
          className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D73D32] focus:border-transparent transition-all ${
            errors.name ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
        />

        {errors.name && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span></span> {errors.name.message}
          </p>
        )}
      </div>

      {/* DESCRIPTION FIELD - REQUIRED */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>

        <textarea
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
            maxLength: {
              value: 500,
              message: "Description cannot exceed 500 characters",
            },
          })}
          rows={3}
          placeholder="Describe the subcategory in detail..."
          className={`border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D73D32] focus:border-transparent transition-all resize-none ${
            errors.description ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
        />

        {errors.description && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <span></span> {errors.description.message}
          </p>
        )}

        <div className="text-right mt-1">
          <span className="text-xs text-gray-400">
            {watch("description")?.length || 0}/500 characters
          </span>
        </div>
      </div>

      {/* IMAGE UPLOAD - REQUIRED (Single Image) */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-2">
          Featured Image <span className="text-red-500">*</span>
        </label>

        {!previewImage ? (
          /* Drag & Drop Zone (No Image) */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-[#D73D32] bg-red-50"
                : errors.images
                ? "border-red-500 bg-red-50"
                : "border-gray-300 hover:border-[#D73D32] bg-gray-50"
            }`}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              {...register("images", {
                required: !defaultValues && "Image is required",
              })}
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-2">
              <svg
                className={`w-12 h-12 ${
                  isDragging ? "text-[#D73D32]" : "text-gray-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-[#D73D32]">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 5MB (Single image only)
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Image Preview (Has Image) */
          <div className="relative group">
            <div className="relative">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-xl border-2 border-gray-200 group-hover:border-[#D73D32] transition-all"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click the ✕ button to change image
            </p>
          </div>
        )}

        {errors.images && (
          <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
            <span></span> {errors.images.message}
          </p>
        )}
      </div>

      {/* FORM ACTIONS */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#D73D32] hover:bg-[#c0342a] text-white font-semibold py-2.5 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Subcategory"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2.5 rounded-xl transition-all hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {/* Required Fields Hint */}
      {/* <div className="text-xs text-gray-400 text-center">
        <span className="text-red-500">*</span> Required fields
      </div> */}
    </form>
  );
}