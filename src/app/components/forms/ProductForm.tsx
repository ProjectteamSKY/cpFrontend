import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ProductFormData, Product } from "../../types/product";

import { getAllCategories } from "../../service/categoryApiService";
import { getAllSubcategories } from "../../service/subcategoryApiService";
import { Category } from "../../types/category";
import { Subcategory } from "../../types/subcategory";

interface Props {
  defaultValues?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    control, // ✅ required for file inputs
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      description: "",
      min_order_qty: 100,
      max_order_qty: undefined,
      images: [],
      related_images: [],
      category_id: "",
      subcategory_id: "",
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const selectedCategory = watch("category_id");

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        return;
      }
      const data = await getAllSubcategories(selectedCategory);
      setSubcategories(data);
    };
    fetchSubcategories();
  }, [selectedCategory]);

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name,
        description: defaultValues.description ?? "",
        min_order_qty: defaultValues.min_order_qty,
        max_order_qty: defaultValues.max_order_qty,
        category_id: defaultValues.category_id,
        subcategory_id: defaultValues.subcategory_id,
        images: [],
        related_images: [],
      });
    } else {
      reset();
    }
  }, [defaultValues, reset]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (data: ProductFormData) => {
    console.log("Images:", data.images);
    console.log("Is File:", data.images?.[0] instanceof File);

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 mt-4">
      {/* Name */}
      <div>
        <Label>Name *</Label>
        <Input {...register("name", { required: true })} />
      </div>

      {/* Category */}
      <div>
        <Label>Category</Label>
        <select
          {...register("category_id")}
          className="mt-1 w-full border rounded-md p-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <Label>Subcategory</Label>
        <select
          {...register("subcategory_id")}
          className="mt-1 w-full border rounded-md p-2"
          disabled={!selectedCategory}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} rows={4} />
      </div>

      {/* Min Order */}
      <div>
        <Label>Min Order Quantity</Label>
        <Input
          type="number"
          {...register("min_order_qty", { valueAsNumber: true })}
        />
      </div>

      {/* Max Order */}
      <div>
        <Label>Max Order Quantity</Label>
        <Input
          type="number"
          {...register("max_order_qty", { valueAsNumber: true })}
        />
      </div>

      {/* ================= FILE INPUTS (IMPORTANT FIX) ================= */}

      {/* Images */}
      <Controller
        name="images"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Images</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                field.onChange(files);
              }}
            />
          </div>
        )}
      />

      {/* Related Images */}
      <Controller
        name="related_images"
        control={control}
        render={({ field }) => (
          <div>
            <Label>Related Images</Label>
            <Input
              type="file"
              multiple
              onChange={(e) => {
                const files = e.target.files
                  ? Array.from(e.target.files)
                  : [];
                field.onChange(files);
              }}
            />
          </div>
        )}
      />

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#D73D32] text-white"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}