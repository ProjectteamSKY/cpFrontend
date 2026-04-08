import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Attribute, AttributeFormData } from "../../types/attribute";
import { attributeValidation } from "../../validation/attributeValidation";

interface Props {
  defaultValues?: Attribute | null;
  onSubmit: (data: AttributeFormData) => Promise<void>;
  onCancel: () => void;
}

export function AttributeForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttributeFormData>({
    mode: "onTouched",
    defaultValues: {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  useEffect(() => {
    reset({
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      is_active: defaultValues?.is_active ?? true,
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="text-sm font-medium">
          Attribute Name <span className="text-red-500">*</span>
        </label>
        <input
          {...register("name", attributeValidation.name)}
          className={`w-full mt-1 px-3 py-2 border rounded-lg ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-xs text-red-500">{errors.name?.message}</p>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description", attributeValidation.description)}
          className={`w-full mt-1 px-3 py-2 border rounded-lg ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-xs text-red-500">{errors.description?.message}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#D73D32] text-white py-2 rounded-lg"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}