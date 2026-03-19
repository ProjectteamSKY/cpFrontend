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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaperTypeFormData>({
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name ?? "");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", true);
    } else {
      reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [defaultValues, setValue, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full space-y-6"
    >
      {/* Hidden Active */}
      <input type="hidden" {...register("is_active")} value="true" />

      {/* Header */}
  

      {/* Name */}
      <div className="flex flex-col p-3">
        <label className="text-sm font-medium text-gray-800 mb-2">
          Paper Type Name <span className="text-red-500">*</span>
        </label>

        <input
          {...register("name", paperTypeValidation.name)}
          placeholder="e.g. Glossy, Matte"
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
          placeholder="Short description about paper type"
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