import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

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
      setValue("is_active", defaultValues.is_active ?? true);
    } else {
      reset({
        name: "",
        description: "",
        is_active: true,
      });
    }
  }, [defaultValues, setValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* Name */}
      <div>
        <Label>Paper Type Name *</Label>
        <Input
          {...register("name", paperTypeValidation.name)}
          placeholder="Enter paper type name"
          className="mt-1"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          {...register("description")}
          placeholder="Enter description"
          rows={4}
          className="mt-1"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Active */}
      <div className="flex items-center gap-2">
        <Input type="checkbox" {...register("is_active")} className="w-4 h-4" />
        <Label>Active</Label>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>

        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}