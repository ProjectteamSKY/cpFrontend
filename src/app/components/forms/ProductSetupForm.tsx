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
import { productSetupValidation } from "../../validation/productSetupValidation";
import { X, Upload } from "lucide-react";
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
  is_default?: boolean;
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
      defaultValues: defaultValues ? {
        ...defaultValues,
        // Ensure max_order_qty is properly set
        max_order_qty: defaultValues.max_order_qty || null,
        // Parse images if they're strings
        images: typeof defaultValues.images === 'string'
          ? JSON.parse(defaultValues.images)
          : defaultValues.images,
        related_images: typeof defaultValues.related_images === 'string'
          ? JSON.parse(defaultValues.related_images)
          : defaultValues.related_images,
      } : {
        category_id: "",
        subcategory_id: "",
        name: "",
        description: "",
        min_order_qty: 100,
        max_order_qty: null, // Add max_order_qty at product level
        images: [],
        related_images: [],
        variants: [
          {
            id: undefined,
            size_id: "",
            paper_type_id: "",
            print_type_id: "",
            cut_type_id: "",
            sides: 1,
            two_side_cut: false,
            four_side_cut: false,
            orientation: "Landscape",
            prices: [
              {
                id: undefined,
                min_qty: 100,
                price: 0,
                discount: null
              },
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
      // Parse and load main images
      if (defaultValues.images) {
        try {
          let imagesArray = defaultValues.images;
          if (typeof defaultValues.images === 'string') {
            imagesArray = JSON.parse(defaultValues.images);
          }

          if (Array.isArray(imagesArray)) {
            const existingMainImages = imagesArray.map((img: any) => ({
              preview: img.url ? `http://127.0.0.1:8000/${img.url}` : '',
              isExisting: true,
              url: img.url,
              id: img.id,
              is_default: img.is_default || false
            }));
            setMainImages(existingMainImages);
          }
        } catch (error) {
          console.error("Error parsing main images:", error);
        }
      }

      // Parse and load related images
      if (defaultValues.related_images) {
        try {
          let relatedImagesArray = defaultValues.related_images;
          if (typeof defaultValues.related_images === 'string') {
            relatedImagesArray = JSON.parse(defaultValues.related_images);
          }

          if (Array.isArray(relatedImagesArray)) {
            const existingRelatedImages = relatedImagesArray.map((img: any) => ({
              preview: img.url ? `http://127.0.0.1:8000/${img.url}` : '',
              isExisting: true,
              url: img.url,
              id: img.id
            }));
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
    }
  };

  const removeMainImage = (index: number) => {
    setMainImages(prev => {
      const newImages = [...prev];
      if (!newImages[index].isExisting && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const removeRelatedImage = (index: number) => {
    setRelatedImagesList(prev => {
      const newImages = [...prev];
      if (!newImages[index].isExisting && newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
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

  // Add price range to a variant
  const addPriceRange = (variantIndex: number) => {
    const currentPrices = watch(`variants.${variantIndex}.prices`) || [];
    const lastPrice = currentPrices[currentPrices.length - 1];
    const newMinQty = lastPrice ? lastPrice.min_qty + 100 : 100;

    // Use field array append or manual update
    const newPrices = [
      ...currentPrices,
      {
        id: undefined,
        min_qty: newMinQty,
        price: 0,
        discount: null
      }
    ];

    setValue(`variants.${variantIndex}.prices`, newPrices);
  };

  // Remove price range from a variant
  const removePriceRange = (variantIndex: number, priceIndex: number) => {
    const currentPrices = watch(`variants.${variantIndex}.prices`) || [];
    if (currentPrices.length > 1) {
      const newPrices = currentPrices.filter((_, index) => index !== priceIndex);
      setValue(`variants.${variantIndex}.prices`, newPrices);
    }
  };

  const onSubmit = async (data: ProductSetupFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();

      // Append basic product info
      formData.append("category_id", data.category_id);
      formData.append("subcategory_id", data.subcategory_id || "");
      formData.append("name", data.name);
      formData.append("description", data.description || "");
      formData.append("min_order_qty", data.min_order_qty.toString());

      // Append max_order_qty if it exists (product level)
      if (data.max_order_qty) {
        formData.append("max_order_qty", data.max_order_qty.toString());
      }

      // Append new main images
      const newMainImages = mainImages.filter(img => !img.isExisting && img.file);
      newMainImages.forEach(img => {
        if (img.file) formData.append("images", img.file);
      });

      // Append new related images
      const newRelatedImages = relatedImagesList.filter(img => !img.isExisting && img.file);
      newRelatedImages.forEach(img => {
        if (img.file) formData.append("related_images", img.file);
      });

      // Prepare variants data - WITH variant IDs for updates
      const variantsData = data.variants.map(variant => {
        // Create the base variant object
        const variantObj: any = {
          size_id: variant.size_id,
          paper_type_id: variant.paper_type_id,
          print_type_id: variant.print_type_id,
          cut_type_id: variant.cut_type_id,
          sides: Number(variant.sides),
          two_side_cut: variant.two_side_cut === true,
          four_side_cut: variant.four_side_cut === true,
          orientation: variant.orientation,
          prices: variant.prices.map(price => {
            // Create the base price object
            const priceObj: any = {
              min_qty: Number(price.min_qty),
              price: Number(price.price),
            };

            // Add price id if it exists (for updates)
            if (price.id) {
              priceObj.id = price.id;
            }

            // Add discount if exists
            if (price.discount && price.discount.discount > 0) {
              const discountObj: any = {
                description: price.discount.description || "",
                discount: Number(price.discount.discount),
                start_date: price.discount.start_date,
                end_date: price.discount.end_date
              };

              // Add discount id if it exists (for updates)
              if (price.discount.id) {
                discountObj.id = price.discount.id;
              }

              priceObj.discount = discountObj;
            }

            return priceObj;
          })
        };

        // Add variant id if it exists (for updates)
        if (variant.id) {
          variantObj.id = variant.id;
        }

        return variantObj;
      });

      console.log("Sending variants data:", JSON.stringify(variantsData, null, 2));

      const variantsJson = JSON.stringify(variantsData);
      formData.append("variants", variantsJson);

      let response;
      if (isEditing && defaultValues?.id) {
        console.log("Updating product with ID:", defaultValues.id);

        // Use fetch instead of axios to see more details
        const fetchResponse = await fetch(
          `http://127.0.0.1:8000/api/productsetup/update/${defaultValues.id}`,
          {
            method: 'PUT',
            body: formData,
            // Don't set Content-Type header - browser will set it with boundary
          }
        );

        const responseData = await fetchResponse.json();
        console.log("Fetch response status:", fetchResponse.status);
        console.log("Fetch response data:", responseData);

        if (!fetchResponse.ok) {
          throw new Error(responseData.detail || 'Update failed');
        }

        if (responseData.status === "success") {
          alert("Product Updated Successfully!");
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        }
      } else {
        response = await axios.post("http://127.0.0.1:8000/api/productsetup/create", formData);

        console.log("Create response:", response.data);

        if (response.data.status === "success") {
          alert("Product Created Successfully!");
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        }
      }

      onCancel();
    } catch (error) {
      console.error("Error saving product:", error);

      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);

        let errorMessage = 'Failed to save product';
        if (error.response.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail.map((err: any) => err.msg).join(', ');
          } else {
            errorMessage = error.response.data.detail;
          }
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }

        alert(`Error: ${errorMessage}`);
      } else {
        alert("Error saving product. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error: any): string | null => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    return null;
  };

  if (fetchingData) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading form data...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white rounded shadow-md max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

      {/* Category */}
      <div>
        <Label>Category <span className="text-red-500">*</span></Label>
        <select
          {...register("category_id", productSetupValidation.category_id)}
          className="w-full border rounded p-2"
        >
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {errors.category_id && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.category_id)}</p>
        )}
      </div>

      {/* Subcategory */}
      <div>
        <Label>Subcategory <span className="text-red-500">*</span></Label>
        <select
          {...register("subcategory_id", productSetupValidation.subcategory_id)}
          className="w-full border rounded p-2"
          disabled={!selectedCategory}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {errors.subcategory_id && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.subcategory_id)}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <Label>Name <span className="text-red-500">*</span></Label>
        <input
          {...register("name", productSetupValidation.name)}
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
          {...register("description", productSetupValidation.description)}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Product description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{getErrorMessage(errors.description)}</p>
        )}
      </div>

      {/* Order Quantity Range - Product Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Order Quantity <span className="text-red-500">*</span></Label>
          <input
            type="number"
            {...register("min_order_qty", productSetupValidation.min_order_qty)}
            className="border rounded p-2 w-full"
          />
          {errors.min_order_qty && (
            <p className="text-red-500 text-sm">{getErrorMessage(errors.min_order_qty)}</p>
          )}
        </div>
        <div>
          <Label>Max Order Quantity</Label>
          <input
            type="number"
            {...register("max_order_qty")}
            className="border rounded p-2 w-full"
            placeholder="Optional"
          />
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
                  {image.is_default && (
                    <span className="absolute bottom-0 left-0 bg-blue-500 text-white text-xs px-1 rounded">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="text-lg font-semibold">Variants <span className="text-red-500">*</span></Label>
          <Button
            type="button"
            onClick={() =>
              append({
                id: undefined,
                size_id: "",
                paper_type_id: "",
                print_type_id: "",
                cut_type_id: "",
                sides: 1,
                two_side_cut: false,
                four_side_cut: false,
                orientation: "Landscape",
                prices: [
                  {
                    id: undefined,
                    min_qty: 100,
                    price: 0,
                    discount: null
                  },
                ],
              })
            }
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Variant
          </Button>
        </div>

        {variantFields.map((variant, variantIndex) => {
          const prices = watch(`variants.${variantIndex}.prices`) || [];

          return (
            <div key={variant.id} className="border p-4 rounded bg-gray-50 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Variant {variantIndex + 1}</h3>
                {variantFields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(variantIndex)}
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
                    {...register(`variants.${variantIndex}.size_id`, { required: "Size is required" })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Size</option>
                    {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  {errors.variants?.[variantIndex]?.size_id && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[variantIndex]?.size_id)}</p>
                  )}
                </div>

                {/* Paper Type */}
                <div>
                  <select
                    {...register(`variants.${variantIndex}.paper_type_id`, { required: "Paper Type is required" })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Paper Type</option>
                    {paperTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {errors.variants?.[variantIndex]?.paper_type_id && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[variantIndex]?.paper_type_id)}</p>
                  )}
                </div>

                {/* Print Type */}
                <div>
                  <select
                    {...register(`variants.${variantIndex}.print_type_id`, { required: "Print Type is required" })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Print Type</option>
                    {printTypes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  {errors.variants?.[variantIndex]?.print_type_id && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[variantIndex]?.print_type_id)}</p>
                  )}
                </div>

                {/* Cut Type */}
                <div>
                  <select
                    {...register(`variants.${variantIndex}.cut_type_id`, { required: "Cut Type is required" })}
                    className="border p-2 rounded w-full"
                  >
                    <option value="">Select Cut Type</option>
                    {cutTypes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {errors.variants?.[variantIndex]?.cut_type_id && (
                    <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[variantIndex]?.cut_type_id)}</p>
                  )}
                </div>

                {/* Sides */}
                <div>
                  <select
                    {...register(`variants.${variantIndex}.sides`, { required: true })}
                    className="border p-2 rounded w-full"
                  >
                    <option value={1}>Single Side</option>
                    <option value={2}>Double Side</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <select
                    {...register(`variants.${variantIndex}.orientation`, { required: true })}
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
                    {...register(`variants.${variantIndex}.two_side_cut`)}
                    className="rounded h-4 w-4"
                    id={`two_side_cut_${variantIndex}`}
                  />
                  <Label htmlFor={`two_side_cut_${variantIndex}`}>2 Side Cut</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register(`variants.${variantIndex}.four_side_cut`)}
                    className="rounded h-4 w-4"
                    id={`four_side_cut_${variantIndex}`}
                  />
                  <Label htmlFor={`four_side_cut_${variantIndex}`}>4 Side Cut</Label>
                </div>
              </div>

              {/* Prices - NO MAX QTY */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <Label className="font-medium">Price Ranges <span className="text-red-500">*</span></Label>
                  <Button
                    type="button"
                    onClick={() => addPriceRange(variantIndex)}
                    className="bg-green-500 hover:bg-green-600 text-sm"
                    size="sm"
                  >
                    Add Price Range
                  </Button>
                </div>

                {prices.map((price, priceIndex) => (
                  <div key={priceIndex} className="grid grid-cols-2 gap-3 mt-2 relative">
                    <div>
                      <input
                        type="number"
                        {...register(`variants.${variantIndex}.prices.${priceIndex}.min_qty`, {
                          required: "Min quantity required",
                          min: { value: 1, message: "Min quantity must be at least 1" }
                        })}
                        placeholder="Min Qty"
                        className="border p-2 rounded w-full"
                      />
                      {errors.variants?.[variantIndex]?.prices?.[priceIndex]?.min_qty && (
                        <p className="text-red-500 text-sm">{getErrorMessage(errors.variants[variantIndex]?.prices?.[priceIndex]?.min_qty)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        {...register(`variants.${variantIndex}.prices.${priceIndex}.price`, {
                          required: "Price required",
                          min: { value: 0, message: "Price must be greater than or equal to 0" }
                        })}
                        placeholder="Price"
                        className="border p-2 rounded w-full"
                      />
                      {prices.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePriceRange(variantIndex, priceIndex)}
                          className="bg-red-500 hover:bg-red-600 text-sm px-2"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {errors.variants?.[variantIndex]?.prices?.[priceIndex]?.price && (
                      <p className="text-red-500 text-sm col-span-2">{getErrorMessage(errors.variants[variantIndex]?.prices?.[priceIndex]?.price)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-end sticky bottom-0 bg-white py-4 border-t">
        <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
          {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
        </Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}