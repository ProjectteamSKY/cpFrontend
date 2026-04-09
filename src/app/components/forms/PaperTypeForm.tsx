import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { PaperTypeFormData, PaperType } from "../../types/paperType";
import { paperTypeValidation } from "../../validation/paperTypeValidation";

interface Props {
  defaultValues?: PaperType | null;
  onSubmit: (data: PaperTypeFormData) => Promise<void>;
  onCancel: () => void;
}

export function PaperTypeForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PaperTypeFormData>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  // Watch the name field to ensure validation updates
  const nameValue = watch("name");

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        is_active: defaultValues.is_active ?? true,
      });
    } else {
      reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = async (data: PaperTypeFormData) => {
    console.log("SUBMIT DATA:", data);
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full space-y-6">
      {/* Name Field */}
      <div className="flex flex-col p-3">
        <label htmlFor="name" className="text-sm font-medium text-gray-800 mb-2">
          Paper Type Name <span className="text-red-500">*</span>
        </label>

        <input
          id="name"
          {...register("name", paperTypeValidation.name)}
          placeholder="e.g. Glossy, Matte"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition ${errors.name
            ? "border-red-500 ring-1 ring-red-200 focus:ring-red-500"
            : "border-gray-300 focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20"
            }`}
        />

        {/* Error Message - Always renders with min-height to prevent layout shift */}
        <p className="mt-1.5 text-xs font-medium text-red-500 min-h-[18px]">
          {errors.name?.message || ""}
        </p>
      </div>

      {/* Description Field */}
      <div className="flex flex-col px-3">
        <label htmlFor="description" className="text-sm font-medium text-gray-800 mb-2">
          Description
        </label>

        <textarea
          id="description"
          {...register("description", {
            required: "Description is required",
            maxLength: {
              value: 200,
              message: "Cannot exceed 200 characters",
            },
            setValueAs: (value) => value?.trim(), // ✅ IMPORTANT FIX
            validate: (value) => value !== "" || "Description is required",
          })}
          rows={4}
          placeholder="Short description (optional)"
          className={`w-full rounded-xl border px-4 py-2.5 text-sm outline-none resize-none transition ${errors.description
            ? "border-red-500 ring-1 ring-red-200 focus:ring-red-500"
            : "border-gray-300 focus:border-[#D73D32] focus:ring-2 focus:ring-[#D73D32]/20"
            }`}
        />

        <p className="mt-1.5 text-xs font-medium text-red-500 min-h-[18px]">
          {errors.description?.message || ""}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 px-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 rounded-xl bg-[#D73D32] text-white py-2.5 text-sm font-semibold transition ${isSubmitting
            ? "opacity-70 cursor-not-allowed"
            : "hover:bg-[#c2341f] active:scale-95"
            }`}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 rounded-xl border border-gray-300 text-gray-700 py-2.5 text-sm font-medium transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}