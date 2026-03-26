import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SizeFormData, Size } from "../../types/size";
import { sizeValidation } from "../../validation/sizeValidation";

interface Props {
  defaultValues?: Size | null;
  onSubmit: (data: SizeFormData) => Promise<void>;
  onCancel: () => void;
}

export function SizeForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SizeFormData>({
    defaultValues: {
      name: "",
      width: 0,
      height: 0,
      unit: "mm",
      description: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name ?? "");
      setValue("width", defaultValues.width ?? 0);
      setValue("height", defaultValues.height ?? 0);
      setValue("unit", defaultValues.unit ?? "mm");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", true);
    } else {
      reset({
        name: "",
        width: 0,
        height: 0,
        unit: "mm",
        description: "",
        is_active: true,
      });
    }
  }, [defaultValues, setValue, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-6 bg-white p-6 rounded-xl shadow-sm max-w-lg mx-auto"
    >
      {/* Hidden is_active */}
      <input type="hidden" {...register("is_active")} value="true" />

      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-2">
          Size Name <span className="text-red-600">*</span>
        </label>
        <input
          {...register("name", sizeValidation.name)}
          placeholder="Enter size name"
          className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition 
            ${errors.name ? "border-red-500 ring-1 ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32]"}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Width & Height */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-2">
            Width *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("width", sizeValidation.width)}
            placeholder="Width"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition 
              ${errors.width ? "border-red-500 ring-1 ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32]"}`}
          />
          {errors.width && (
            <p className="mt-1 text-xs text-red-500">{errors.width.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-900 mb-2">
            Height *
          </label>
          <input
            type="number"
            step="0.01"
            {...register("height", sizeValidation.height)}
            placeholder="Height"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition 
              ${errors.height ? "border-red-500 ring-1 ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32]"}`}
          />
          {errors.height && (
            <p className="mt-1 text-xs text-red-500">{errors.height.message}</p>
          )}
        </div>
      </div>

      {/* Unit */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-2">
          Unit
        </label>
        <input
          {...register("unit", sizeValidation.unit)}
          placeholder="mm / cm / in"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] transition"
        />
        {errors.unit && (
          <p className="mt-1 text-xs text-red-500">{errors.unit.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          {...register("description", sizeValidation.description)}
          placeholder="Enter description"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] transition"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#D73D32] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#c03028] disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D73D32] transition"
        >
          {isSubmitting ? (
            <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            "Save"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}