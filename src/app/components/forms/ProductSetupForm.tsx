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
import { productsetupValidation } from "../../validation/productSetupValidation";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import "../../../styles/index.css"
interface Props {
  defaultValues?: ProductSetupFormData | null;
  onCancel: () => void;
  onSubmitSuccess?: () => void;
  isEditing?: boolean;
}

interface ImageFile {
  file?: File;
  preview: string;
  isExisting?: boolean;
  url?: string;
  id?: string;
}

export function ProductSetupForm({ defaultValues, onCancel, onSubmitSuccess, isEditing = false }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [paperTypes, setPaperTypes] = useState<any[]>([]);
  const [printTypes, setPrintTypes] = useState<any[]>([]);
  const [cutTypes, setCutTypes] = useState<any[]>([]);

  // Image states with preview
  const [mainImages, setMainImages] = useState<ImageFile[]>([]);
  const [relatedImagesList, setRelatedImagesList] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const { register, control, watch, handleSubmit, setValue, formState: { errors } } =
    useForm<ProductSetupFormData>({
      defaultValues: defaultValues || {
        category_id: "",
        subcategory_id: "",
        name: "",
        description: "",
        min_order_qty: 100,
        max_order_qty: 500,
        images: [],
        related_images: [],
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
      try {
        setFetchingData(true);
        const [categoriesData, sizesData, paperTypesData, printTypesData, cutTypesData] = await Promise.all([
          getAllCategories(),
          getAllSizes(),
          getAllPaperTypes(),
          getAllPrintTypes(),
          getAllCutTypes()
        ]);

        console.log("Categories:", categoriesData);
        console.log("Sizes:", sizesData);
        console.log("Paper Types:", paperTypesData);
        console.log("Print Types:", printTypesData);
        console.log("Cut Types:", cutTypesData);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSizes(Array.isArray(sizesData) ? sizesData : []);
        setPaperTypes(Array.isArray(paperTypesData) ? paperTypesData : []);
        setPrintTypes(Array.isArray(printTypesData) ? printTypesData : []);
        setCutTypes(Array.isArray(cutTypesData) ? cutTypesData : []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  // Load existing images when editing
  useEffect(() => {
    if (isEditing && defaultValues) {
      console.log("Default values for editing:", defaultValues); // Debug log

      // Parse and load main images
      if (defaultValues.images) {
        try {
          // Check if images is a string (JSON) or already an array
          let imagesArray = defaultValues.images;

          if (typeof defaultValues.images === 'string') {
            imagesArray = JSON.parse(defaultValues.images);
          }

          if (Array.isArray(imagesArray)) {
            const existingMainImages = imagesArray.map((img: any) => ({
              preview: img.url ? `http://127.0.0.1:8000/${img.url}` : '', // Add base URL if needed
              isExisting: true,
              url: img.url,
              id: img.id,
              is_default: img.is_default || false
            }));

            console.log("Processed main images:", existingMainImages);
            setMainImages(existingMainImages);
          }
        } catch (error) {
          console.error("Error parsing main images:", error);
        }
      }

      // Parse and load related images
      if (defaultValues.related_images) {
        try {
          // Check if related_images is a string (JSON) or already an array
          let relatedImagesArray = defaultValues.related_images;

          if (typeof defaultValues.related_images === 'string') {
            relatedImagesArray = JSON.parse(defaultValues.related_images);
          }

          if (Array.isArray(relatedImagesArray)) {
            const existingRelatedImages = relatedImagesArray.map((img: any) => ({
              preview: img.url ? `http://127.0.0.1:8000/${img.url}` : '', // Add base URL if needed
              isExisting: true,
              url: img.url,
              id: img.id
            }));

            console.log("Processed related images:", existingRelatedImages);
            setRelatedImagesList(existingRelatedImages);
          }
        } catch (error) {
          console.error("Error parsing related images:", error);
        }
      }
    }
  }, [isEditing, defaultValues]);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubcats = async () => {
      if (selectedCategory) {
        try {
          const subcats = await getAllSubcategories(selectedCategory);
          console.log("Subcategories for category", selectedCategory, ":", subcats);
          setSubcategories(Array.isArray(subcats) ? subcats : []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubcategories([]);
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcats();
  }, [selectedCategory]);

  // Image preview handlers
  const handleMainImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false
      }));
      setMainImages(prev => [...prev, ...newImages]);
      setValue("images", files as any);
    }
  };

  const handleRelatedImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false
      }));
      setRelatedImagesList(prev => [...prev, ...newImages]);
      setValue("related_images", files as any);
    }
  };

  const removeMainImage = (index: number) => {
    setMainImages(prev => {
      const newImages = [...prev];
      // Revoke object URL if it's a new file
      if (!newImages[index].isExisting && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);

      // Update form data
      const fileList = newImages
        .filter(img => !img.isExisting && img.file)
        .map(img => img.file) as File[];

      if (fileList.length > 0) {
        const dataTransfer = new DataTransfer();
        fileList.forEach(file => dataTransfer.items.add(file));
        setValue("images", dataTransfer.files as any);
      } else {
        setValue("images", undefined as any);
      }

      return newImages;
    });
  };

  const removeRelatedImage = (index: number) => {
    setRelatedImagesList(prev => {
      const newImages = [...prev];
      // Revoke object URL if it's a new file
      if (!newImages[index].isExisting && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);

      // Update form data
      const fileList = newImages
        .filter(img => !img.isExisting && img.file)
        .map(img => img.file) as File[];

      if (fileList.length > 0) {
        const dataTransfer = new DataTransfer();
        fileList.forEach(file => dataTransfer.items.add(file));
        setValue("related_images", dataTransfer.files as any);
      } else {
        setValue("related_images", undefined as any);
      }

      return newImages;
    });
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      mainImages.forEach(img => {
        if (!img.isExisting && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
      relatedImagesList.forEach(img => {
        if (!img.isExisting && img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  // Helper function to get error message
  const getErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return null;
  };

  const onSubmit = async (data: ProductSetupFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("category_id", data.category_id);
      formData.append("subcategory_id", data.subcategory_id || "");
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("min_order_qty", data.min_order_qty.toString());
      formData.append("max_order_qty", (data.max_order_qty || 0).toString());

      // Append new main images
      const newMainImages = mainImages.filter(img => !img.isExisting && img.file);
      if (newMainImages.length > 0) {
        newMainImages.forEach(img => {
          if (img.file) formData.append("images", img.file);
        });
      }

      // Append new related images
      const newRelatedImages = relatedImagesList.filter(img => !img.isExisting && img.file);
      if (newRelatedImages.length > 0) {
        newRelatedImages.forEach(img => {
          if (img.file) formData.append("related_images", img.file);
        });
      }

      // If editing and there are existing images to keep, you might need to send their IDs
      if (isEditing) {
        const existingMainImageIds = mainImages
          .filter(img => img.isExisting && img.id)
          .map(img => img.id);

        if (existingMainImageIds.length > 0) {
          formData.append("existing_main_image_ids", JSON.stringify(existingMainImageIds));
        }

        const existingRelatedImageIds = relatedImagesList
          .filter(img => img.isExisting && img.id)
          .map(img => img.id);

        if (existingRelatedImageIds.length > 0) {
          formData.append("existing_related_image_ids", JSON.stringify(existingRelatedImageIds));
        }
      }

      formData.append("variants", JSON.stringify(data.variants));

      let response;
      if (isEditing && defaultValues?.id) {
        // Update existing product
        response = await axios.put(`http://54.206.3.97/api/productsetup/update/${defaultValues.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Product Updated Successfully!");
      } else {
        // Create new product
        response = await axios.post("http://54.206.3.97/api/productsetup/create", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Product Created Successfully!");
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      onCancel();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading form data...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

      {/* Category */}
      <div>
        <Label>Category <span className="text-red-500">*</span></Label>
        <select
          {...register("category_id", productsetupValidation.category_id)}
          className="w-full border rounded p-2"
        >
          <option value="">Select Category</option>
          {categories.length > 0 ? (
            categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.category_id)}</p>
        )}
      </div>

      {/* Subcategory */}
      <div>
        <Label>Subcategory <span className="text-red-500">*</span></Label>
        <select
          {...register("subcategory_id", productsetupValidation.subcategory_id)}
          className="w-full border rounded p-2"
          disabled={!selectedCategory}
        >
          <option value="">Select Subcategory</option>
          {subcategories.length > 0 ? (
            subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
          ) : (
            selectedCategory && <option value="" disabled>No subcategories available</option>
          )}
        </select>
        {errors.subcategory_id && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.subcategory_id)}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <Label>Name <span className="text-red-500">*</span></Label>
        <input
          {...register("name", productsetupValidation.name)}
          className="w-full border rounded p-2"
          placeholder="Product name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.name)}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          {...register("description", productsetupValidation.description)}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Product description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.description)}</p>
        )}
      </div>

      {/* Min / Max Order */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Order Quantity <span className="text-red-500">*</span></Label>
          <input
            type="number"
            {...register("min_order_qty", productsetupValidation.min_order_qty)}
            className="border rounded p-2 w-full"
          />
          {errors.min_order_qty && (
            <p className="text-red-500 text-sm">{getErrorMessage(errors.min_order_qty)}</p>
          )}
        </div>
        <div>
          <Label>Max Order Quantity <span className="text-red-500">*</span></Label>
          <input
            type="number"
            {...register("max_order_qty", productsetupValidation.max_order_qty)}
            className="border rounded p-2 w-full"
          />
          {errors.max_order_qty && (
            <p className="text-red-500 text-sm">{getErrorMessage(errors.max_order_qty)}</p>
          )}
        </div>
      </div>

      {/* Main Images with Preview */}
      <div>
        <Label>Main Images {!isEditing && <span className="text-red-500">*</span>}</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMainImagesChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview Grid */}
          {mainImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {mainImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Main ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeMainImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {image.isExisting && (
                    <span className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded">
                      Existing
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {!isEditing && errors.images && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.images)}</p>
        )}
      </div>

      {/* Related Images with Preview */}
      <div>
        <Label>Related Images</Label>
        <div className="mt-2">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleRelatedImagesChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview Grid */}
          {relatedImagesList.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              {relatedImagesList.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.preview}
                    alt={`Related ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeRelatedImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {image.isExisting && (
                    <span className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-1 rounded">
                      Existing
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.related_images && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.related_images)}</p>
        )}
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Variants <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            onClick={() =>
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
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Variant
          </Button>
        </div>

        {variantFields.map((variant, index) => (
          <div key={variant.id} className="border p-4 rounded bg-gray-50 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Variant {index + 1}</h3>
              {variantFields.length > 1 && (
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 hover:bg-red-600 text-sm"
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Size */}
              <div>
                <select
                  {...register(`variants.${index}.size_id`, { required: "Size is required" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Size</option>
                  {sizes.length > 0 ? (
                    sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                  ) : (
                    <option value="" disabled>No sizes available</option>
                  )}
                </select>
                {errors.variants?.[index]?.size_id && (
                  <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.size_id)}</p>
                )}
              </div>

              {/* Paper Type */}
              <div>
                <select
                  {...register(`variants.${index}.paper_type_id`, { required: "Paper Type is required" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Paper Type</option>
                  {paperTypes.length > 0 ? (
                    paperTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                  ) : (
                    <option value="" disabled>No paper types available</option>
                  )}
                </select>
                {errors.variants?.[index]?.paper_type_id && (
                  <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.paper_type_id)}</p>
                )}
              </div>

              {/* Print Type */}
              <div>
                <select
                  {...register(`variants.${index}.print_type_id`, { required: "Print Type is required" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Print Type</option>
                  {printTypes.length > 0 ? (
                    printTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                  ) : (
                    <option value="" disabled>No print types available</option>
                  )}
                </select>
                {errors.variants?.[index]?.print_type_id && (
                  <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.print_type_id)}</p>
                )}
              </div>

              {/* Cut Type */}
              <div>
                <select
                  {...register(`variants.${index}.cut_type_id`, { required: "Cut Type is required" })}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Cut Type</option>
                  {cutTypes.length > 0 ? (
                    cutTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                  ) : (
                    <option value="" disabled>No cut types available</option>
                  )}
                </select>
                {errors.variants?.[index]?.cut_type_id && (
                  <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.cut_type_id)}</p>
                )}
              </div>

              {/* Sides */}
              <div>
                <select
                  {...register(`variants.${index}.sides`, { required: true })}
                  className="border p-2 rounded w-full"
                >
                  <option value={1}>Single Side</option>
                  <option value={2}>Double Side</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <select
                  {...register(`variants.${index}.orientation`, { required: true })}
                  className="border p-2 rounded w-full"
                >
                  <option value="Landscape">Landscape</option>
                  <option value="Portrait">Portrait</option>
                </select>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register(`variants.${index}.two_side_cut`)}
                  className="rounded h-4 w-4"
                  id={`two_side_cut_${index}`}
                />
                <Label htmlFor={`two_side_cut_${index}`}>2 Side Cut</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register(`variants.${index}.four_side_cut`)}
                  className="rounded h-4 w-4"
                  id={`four_side_cut_${index}`}
                />
                <Label htmlFor={`four_side_cut_${index}`}>4 Side Cut</Label>
              </div>
            </div>

            {/* Prices */}
            <div className="mt-4">
              <Label className="font-medium">Price Range <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <input
                    type="number"
                    {...register(`variants.${index}.prices.0.min_qty`, {
                      required: "Min quantity required",
                      min: { value: 1, message: "Min quantity must be at least 1" }
                    })}
                    placeholder="Min Qty"
                    className="border p-2 rounded w-full"
                  />
                  {errors.variants?.[index]?.prices?.[0]?.min_qty && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.prices?.[0]?.min_qty)}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    {...register(`variants.${index}.prices.0.max_qty`, {
                      required: "Max quantity required",
                      validate: (value) => {
                        const minQty = watch(`variants.${index}.prices.0.min_qty`);
                        return Number(value) >= Number(minQty) || "Max quantity must be greater than or equal to min quantity";
                      }
                    })}
                    placeholder="Max Qty"
                    className="border p-2 rounded w-full"
                  />
                  {errors.variants?.[index]?.prices?.[0]?.max_qty && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.prices?.[0]?.max_qty)}</p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    step="0.01"
                    {...register(`variants.${index}.prices.0.price`, {
                      required: "Price required",
                      min: { value: 0, message: "Price must be greater than or equal to 0" }
                    })}
                    placeholder="Price"
                    className="border p-2 rounded w-full"
                  />
                  {errors.variants?.[index]?.prices?.[0]?.price && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[index]?.prices?.[0]?.price)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {errors.variants && !Array.isArray(errors.variants) && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.variants)}</p>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="submit" disabled={loading || fetchingData} className="bg-green-500 hover:bg-green-600">
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}