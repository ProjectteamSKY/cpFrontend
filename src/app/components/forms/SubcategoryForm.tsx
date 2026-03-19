import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { SubcategoryFormData, Subcategory } from "../../types/subcategory";
import { subcategoryValidation } from "../../validation/subcategoryValidation";

interface Props {
  defaultValues?: Subcategory | null;
  defaultCategoryId?: string;
  onSubmit: (data: SubcategoryFormData) => Promise<void>;
  onCancel: () => void;
}

export function SubcategoryForm({
  defaultValues,
  defaultCategoryId,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SubcategoryFormData>({
    defaultValues: {
      category_id: defaultCategoryId ?? "",
      name: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setValue("category_id", defaultValues.category_id ?? "");
      setValue("name", defaultValues.name ?? "");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", true);
    } else {
      reset({
        category_id: defaultCategoryId ?? "",
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [defaultValues, defaultCategoryId, setValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      
      {/* Hidden Fields */}
      <input type="hidden" {...register("is_active")} value="true" />
      <input type="hidden" {...register("category_id")} />

      {/* Header */}
      {/* <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Add Subcategory
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage subcategories
        </p>
      </div> */}

      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Subcategory Name <span className="text-red-500">*</span>
        </label>

        <input
          {...register("name", subcategoryValidation.name)}
          placeholder="e.g. Visiting Cards, Brochures"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition
          ${
            errors.name
              ? "border-red-500 ring-1 ring-red-200"
              : "border-gray-300 focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32]"
          }`}
        />

        {errors.name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Description
        </label>

        <textarea
          {...register("description")}
          placeholder="Short description about subcategory"
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] transition"
        />

        {errors.description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#D73D32] text-white py-2.5 text-sm font-semibold shadow-md hover:shadow-lg hover:bg-[#c53028] transition disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.3"
                />
                <path
                  d="M4 12a8 8 0 018-8"
                  stroke="white"
                  strokeWidth="4"
                />
              </svg>
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}