import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { AttributeValueFormData } from "../../types/attributeValue";
import { Attribute } from "../../types/attribute";
import { attributeValueValidation } from "../../validation/attributeValueValidation";

interface Props {
  attributes: Attribute[];
  defaultValues?: any;
  onSubmit: (data: AttributeValueFormData) => Promise<void>;
  onCancel: () => void;
}

export function AttributeValueForm({
  attributes,
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttributeValueFormData>({
    defaultValues: {
      attribute_id: defaultValues?.attribute_id ?? "",
      value: defaultValues?.value ?? "",
      is_active: defaultValues?.is_active ?? true,
    },
  });

  useEffect(() => {
    reset({
      attribute_id: defaultValues?.attribute_id ?? "",
      value: defaultValues?.value ?? "",
      is_active: defaultValues?.is_active ?? true,
    });
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      
      {/* Attribute Dropdown */}
      <div>
        <label className="text-sm font-medium">Attribute *</label>
        <select
          {...register("attribute_id", { required: "Attribute is required" })}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
        >
          <option value="">Select Attribute</option>
          {attributes.map((attr) => (
            <option key={attr.id} value={attr.id}>
              {attr.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-red-500">{errors.attribute_id?.message}</p>
      </div>

      {/* Value */}
      <div>
        <label className="text-sm font-medium">Value *</label>
        <input
          {...register("value", attributeValueValidation.value)}
          className={`w-full mt-1 px-3 py-2 border rounded-lg ${
            errors.value ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-xs text-red-500">{errors.value?.message}</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
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