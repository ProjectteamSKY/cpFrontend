import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ProductFormData, Product } from "../../types/product";

interface Props {
  defaultValues?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ defaultValues, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      min_order_qty: 100,
      max_order_qty: undefined,
      images: [],
      related_images: [],
    },
  });

  useEffect(() => {
    if (defaultValues) {
      setValue("name", defaultValues.name || "");
      setValue("description", defaultValues.description || "");
      setValue("min_order_qty", defaultValues.min_order_qty);
      setValue("max_order_qty", defaultValues.max_order_qty);
    } else {
      reset({
        name: "",
        description: "",
        min_order_qty: 100,
        max_order_qty: undefined,
        images: [],
        related_images: [],
      });
    }
  }, [defaultValues, setValue, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div>
        <Label>Name *</Label>
        <Input {...register("name")} placeholder="Product name" className="mt-1" required />
      </div>

      <div>
        <Label>Category ID</Label>
        <Input {...register("category_id")} placeholder="Category ID" className="mt-1" />
      </div>

      <div>
        <Label>Subcategory ID</Label>
        <Input {...register("subcategory_id")} placeholder="Subcategory ID" className="mt-1" />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} placeholder="Description" className="mt-1" rows={4} />
      </div>

      <div>
        <Label>Min Order Quantity</Label>
        <Input type="number" {...register("min_order_qty")} className="mt-1" />
      </div>

      <div>
        <Label>Max Order Quantity</Label>
        <Input type="number" {...register("max_order_qty")} className="mt-1" />
      </div>

      <div>
        <Label>Images</Label>
        <Input type="file" multiple {...register("images")} className="mt-1" />
      </div>

      <div>
        <Label>Related Images</Label>
        <Input type="file" multiple {...register("related_images")} className="mt-1" />
      </div>

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