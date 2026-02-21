import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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

  /*  Proper reset */
  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name ?? "");
      setValue("width", defaultValues.width ?? 0);
      setValue("height", defaultValues.height ?? 0);
      setValue("unit", defaultValues.unit ?? "mm");
      setValue("description", defaultValues.description ?? "");
      setValue("is_active", defaultValues.is_active ?? true);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* Name */}
      <div>
        <Label>Size Name *</Label>
        <Input {...register("name", sizeValidation.name)} placeholder="Enter size name" className="mt-1" />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Width */}
      <div>
        <Label>Width *</Label>
        <Input type="number" step="0.01" {...register("width", sizeValidation.width)} placeholder="Width" className="mt-1" />
        {errors.width && <p className="text-red-500 text-sm mt-1">{errors.width.message}</p>}
      </div>

      {/* Height */}
      <div>
        <Label>Height *</Label>
        <Input type="number" step="0.01" {...register("height", sizeValidation.height)} placeholder="Height" className="mt-1" />
        {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
      </div>

      {/* Unit */}
      <div>
        <Label>Unit</Label>
        <Input {...register("unit")} placeholder="mm / cm / in" className="mt-1" />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} placeholder="Enter description" rows={4} className="mt-1" />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <Input type="checkbox" {...register("is_active")} className="w-4 h-4" />
        <Label>Active</Label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}