import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { getAllCategories } from "../../service/categoryApiService";
import { getAllSubcategories } from "../../service/subcategoryApiService";
import { getAllSizes } from "../../service/sizeApiService";
import { getAllPaperTypes } from "../../service/paperTypeApiService";
import { getAllPrintTypes } from "../../service/printTypeApiService";
import { getAllCutTypes } from "../../service/cutTypeApiService";
import axios from "axios";
import { ProductSetupFormData } from "../../types/productSetup";

interface Props {
  defaultValues?: ProductSetupFormData | null;
  onCancel: () => void;
}

export function ProductSetupForm({ defaultValues, onCancel }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [paperTypes, setPaperTypes] = useState<any[]>([]);
  const [printTypes, setPrintTypes] = useState<any[]>([]);
  const [cutTypes, setCutTypes] = useState<any[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [relatedImages, setRelatedImages] = useState<FileList | null>(null);

  const { register, control, watch, handleSubmit } =
    useForm<ProductSetupFormData>({
      defaultValues: defaultValues || {
        category_id: "",
        subcategory_id: "",
        name: "",
        description: "",
        min_order_qty: 100,
        max_order_qty: 500,
        variants: [
          {
            size_id: "",
            paper_type_id: "",
            print_type_id: "",
            cut_type_id: "",
            sides: 1,
            two_side_cut: false,
            four_side_cut: false,
            orientation: "Landscape",
            prices: [
              { min_qty: 100, max_qty: 500, price: 0, discount: null },
            ],
          },
        ],
      },
    });

  const selectedCategory = watch("category_id");

  const { fields: variantFields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  // Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      setCategories(await getAllCategories());
      setSizes(await getAllSizes());
      setPaperTypes(await getAllPaperTypes());
      setPrintTypes(await getAllPrintTypes());
      setCutTypes(await getAllCutTypes());
    };
    fetchData();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcats = async () => {
      if (selectedCategory) {
        const subcats = await getAllSubcategories(selectedCategory);
        setSubcategories(subcats);
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcats();
  }, [selectedCategory]);

  const onSubmit = async (data: ProductSetupFormData) => {
    const formData = new FormData();

    formData.append("category_id", data.category_id);
    formData.append("subcategory_id", data.subcategory_id || "");
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("min_order_qty", data.min_order_qty.toString());
    formData.append("max_order_qty", (data.max_order_qty || 0).toString());

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    if (relatedImages) {
      Array.from(relatedImages).forEach((file) => {
        formData.append("related_images", file);
      });
    }

    formData.append("variants", JSON.stringify(data.variants));

    await axios.post(
      "http://127.0.0.1:8000/api/productsetup/create",
      formData
    );

    alert("Product Created Successfully!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white rounded shadow-md"
    >
      {/* Category */}
      <div>
        <Label>Category</Label>
        <select {...register("category_id")} className="w-full border rounded p-2">
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <Label>Subcategory</Label>
        <select {...register("subcategory_id")} className="w-full border rounded p-2">
          <option value="">Select Subcategory</option>
          {subcategories.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div>
        <Label>Name</Label>
        <input {...register("name")} className="w-full border rounded p-2" />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea {...register("description")} className="w-full border rounded p-2" />
      </div>

      {/* Min / Max */}
      <div className="flex gap-4">
        <input type="number" {...register("min_order_qty", { valueAsNumber: true })} className="border rounded p-2 w-1/2" />
        <input type="number" {...register("max_order_qty", { valueAsNumber: true })} className="border rounded p-2 w-1/2" />
      </div>

      {/* Images */}
      <div>
        <Label>Images</Label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />
      </div>

      <div>
        <Label>Related Images</Label>
        <input type="file" multiple accept="image/*" onChange={(e) => setRelatedImages(e.target.files)} />
      </div>

      {/* Variants */}
      {variantFields.map((variant, index) => (
        <div key={variant.id} className="border p-4 rounded bg-gray-50 space-y-3">
          <h3 className="font-semibold">Variant {index + 1}</h3>

          <div className="flex flex-wrap gap-3">
            <select {...register(`variants.${index}.size_id`)} className="border p-2 rounded">
              <option value="">Size</option>
              {sizes.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select {...register(`variants.${index}.paper_type_id`)} className="border p-2 rounded">
              <option value="">Paper Type</option>
              {paperTypes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select {...register(`variants.${index}.print_type_id`)} className="border p-2 rounded">
              <option value="">Print Type</option>
              {printTypes.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <select {...register(`variants.${index}.cut_type_id`)} className="border p-2 rounded">
              <option value="">Cut Type</option>
              {cutTypes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* ✅ SIDES */}
            <select
              {...register(`variants.${index}.sides`, { valueAsNumber: true })}
              className="border p-2 rounded"
            >
              <option value={1}>Single Side</option>
              <option value={2}>Double Side</option>
            </select>

            <select {...register(`variants.${index}.orientation`)} className="border p-2 rounded">
              <option value="Landscape">Landscape</option>
              <option value="Portrait">Portrait</option>
            </select>
          </div>

          {/* Prices */}
          <div className="flex gap-3">
            <input
              type="number"
              {...register(`variants.${index}.prices.0.min_qty`, { valueAsNumber: true })}
              placeholder="Min Qty"
              className="border p-2 rounded"
            />
            <input
              type="number"
              {...register(`variants.${index}.prices.0.max_qty`, { valueAsNumber: true })}
              placeholder="Max Qty"
              className="border p-2 rounded"
            />
            <input
              type="number"
              {...register(`variants.${index}.prices.0.price`, { valueAsNumber: true })}
              placeholder="Price"
              className="border p-2 rounded"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <Button type="button" onClick={() =>
          append({
            size_id: "",
            paper_type_id: "",
            print_type_id: "",
            cut_type_id: "",
            sides: 1,
            two_side_cut: false,
            four_side_cut: false,
            orientation: "Landscape",
            prices: [{ min_qty: 100, max_qty: 500, price: 0, discount: null }],
          })
        }>
          Add Variant
        </Button>

        <Button type="button" onClick={() => remove(variantFields.length - 1)}>
          Remove Variant
        </Button>
      </div>

      <div className="flex gap-4">
        <Button type="submit">Save Product</Button>
        <Button type="button" onClick={onCancel} className="bg-gray-300">
          Cancel
        </Button>
      </div>
    </form>
  );
}

  

