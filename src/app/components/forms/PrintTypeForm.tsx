import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PrintTypeFormData, PrintType } from "../../types/printType";

interface Props {
  defaultValues?: PrintType | null;
  onSubmit: (data: PrintTypeFormData) => Promise<void>;
  onCancel: () => void;
}

export function PrintTypeForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PrintTypeFormData>({
    defaultValues: { name: "", description: "", is_active: true },
  });

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name ?? "");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", true); // always true
    } else {
      reset({ name: "", description: "", is_active: true });
    }
  }, [defaultValues, setValue, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 space-y-6 bg-white p-6 rounded-xl shadow-sm"
    >
      {/* Hidden is_active */}
      <input type="hidden" {...register("is_active")} value="true" />

      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-2">
          Print Type Name <span className="text-red-600">*</span>
        </label>
        <input
          {...register("name", {
            required: "Print Type name is required",
            minLength: { value: 2, message: "Minimum 2 characters" },
          })}
          placeholder="Enter print type name"
          className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition 
            ${errors.name ? "border-red-500 ring-1 ring-red-200" : "border-gray-300 focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32]"}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-900 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Enter description"
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-[#D73D32] focus:border-[#D73D32] transition"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#D73D32] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#c03028] disabled:opacity-60 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#D73D32] transition"
        >
          {isSubmitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Saving…
            </>
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