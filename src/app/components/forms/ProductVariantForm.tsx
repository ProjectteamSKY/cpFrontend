import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  ProductVariant,
  ProductVariantFormData,
} from "../../types/productVariant";

import { getAllProducts } from "../../service/productApiService";
import { getAllSizes } from "../../service/sizeApiService";
import { getAllPaperTypes } from "../../service/paperTypeApiService";
import { getAllPrintTypes } from "../../service/printTypeApiService";
import { getAllCutTypes } from "../../service/cutTypeApiService";

interface Props {
  defaultValues?: ProductVariant | null;
  onSubmit: (data: ProductVariantFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProductVariantForm({
  defaultValues,
  onSubmit,
  onCancel,
}: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [paperTypes, setPaperTypes] = useState<any[]>([]);
  const [printTypes, setPrintTypes] = useState<any[]>([]);
  const [cutTypes, setCutTypes] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  /* =========================
     Load Dropdown Data
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      const [products, sizes, papers, prints, cuts] = await Promise.all([
        getAllProducts(),
        getAllSizes(),
        getAllPaperTypes(),
        getAllPrintTypes(),
        getAllCutTypes(),
      ]);

      setProducts(products);
      setSizes(sizes);
      setPaperTypes(papers);
      setPrintTypes(prints);
      setCutTypes(cuts);

      setLoadingOptions(false);
    };

    loadData();
  }, []);

  /* =========================
     React Hook Form
  ========================= */
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductVariantFormData>({
    values: defaultValues
      ? {
        product_id: defaultValues.product_id ?? "",
        size_id: defaultValues.size_id ?? "",
        paper_type_id: defaultValues.paper_type_id ?? "",
        print_type_id: defaultValues.print_type_id ?? "",
        cut_type_id: defaultValues.cut_type_id ?? "",
        sides: Number(defaultValues.sides) || 1,
        orientation: defaultValues.orientation ?? "Portrait",
        two_side_cut: !!defaultValues.two_side_cut,
        four_side_cut: !!defaultValues.four_side_cut,
        is_active: defaultValues.is_active ?? true, // ✅ add this
      }
      : {
        product_id: "",
        size_id: "",
        paper_type_id: "",
        print_type_id: "",
        cut_type_id: "",
        sides: 1,
        orientation: "Portrait",
        two_side_cut: false,
        four_side_cut: false,
        is_active: true, // ✅ add this
      },
  });

  if (loadingOptions) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit((data: ProductVariantFormData) => onSubmit(data))} className="space-y-4">
      {/* Product */}
      <div>
        <Label>Product *</Label>
        <select
          {...register("product_id", { required: "Product is required" })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.product_id && (
          <p className="text-red-500 text-sm">{errors.product_id.message}</p>
        )}
      </div>

      {/* Size */}
      <div>
        <Label>Size *</Label>
        <select
          {...register("size_id", { required: "Size is required" })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Size</option>
          {sizes.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        {errors.size_id && (
          <p className="text-red-500 text-sm">{errors.size_id.message}</p>
        )}
      </div>

      {/* Paper Type */}
      <div>
        <Label>Paper Type</Label>
        <select
          {...register("paper_type_id")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Paper Type</option>
          {paperTypes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Print Type */}
      <div>
        <Label>Print Type</Label>
        <select
          {...register("print_type_id")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Print Type</option>
          {printTypes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Cut Type */}
      <div>
        <Label>Cut Type</Label>
        <select
          {...register("cut_type_id")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Cut Type</option>
          {cutTypes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sides */}
      <div>
        <Label>Sides *</Label>
        <div className="flex gap-6 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="1" // use string "1"
              {...register("sides", { required: true })}
              checked={String(defaultValues?.sides ?? 1) === "1"} // sets default correctly
            />
            Single Side
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="2" // use string "2"
              {...register("sides", { required: true })}
              checked={String(defaultValues?.sides ?? 1) === "2"} // sets default correctly
            />
            Double Side
          </label>
        </div>
        {errors.sides && (
          <p className="text-red-500 text-sm">Please select sides</p>
        )}
      </div>

      {/* Orientation */}
      <div>
        <Label>Orientation *</Label>
        <select
          {...register("orientation")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="Portrait">Portrait</option>
          <option value="Landscape">Landscape</option>
        </select>
      </div>

      {/* Cut Options */}
      <div className="flex gap-6 pt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("two_side_cut")} />
          Two Side Cut
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("four_side_cut")} />
          Four Side Cut
        </label>
      </div>

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