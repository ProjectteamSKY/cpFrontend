import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ProductFormData, Product, ProductImage } from "../../types/product";
import { getAllCategories } from "../../service/categoryApiService";
import { getAllSubcategories } from "../../service/subcategoryApiService";
import { Category } from "../../types/category";
import { Subcategory } from "../../types/subcategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Image as ImageIcon,
  X,
  Upload,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";


// base url changes 
const BASE_URL = "http://54.206.3.97";

interface Props {
  defaultValues?: Product | null;
  onSubmit: (
    data: ProductFormData & {
      existing_image_ids: string[];
      existing_related_image_ids: string[];
    }
  ) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ defaultValues, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
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
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [subcategoriesError, setSubcategoriesError] = useState<string | null>(null);

  const selectedCategory = watch("category_id");

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [existingRelatedImages, setExistingRelatedImages] = useState<ProductImage[]>([]);
  const [imagePreviews, setImagePreviews] = useState<(string | File)[]>([]);
  const [relatedImagePreviews, setRelatedImagePreviews] = useState<(string | File)[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const getFullImageUrl = useCallback((imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${BASE_URL}/${imagePath}`;
  }, []);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoriesError("Failed to load categories. Please refresh the page.");
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) {
        setSubcategories([]);
        setValue("subcategory_id", "");
        return;
      }

      setIsLoadingSubcategories(true);
      setSubcategoriesError(null);
      try {
        const data = await getAllSubcategories(selectedCategory);
        setSubcategories(data || []);

        // Clear subcategory if current one doesn't belong to selected category
        const currentSubcategory = watch("subcategory_id");
        if (currentSubcategory && !data.some(sub => sub.id === currentSubcategory)) {
          setValue("subcategory_id", "");
        }
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
        setSubcategoriesError("Failed to load subcategories.");
        setSubcategories([]);
      } finally {
        setIsLoadingSubcategories(false);
      }
    };
    fetchSubcategories();
  }, [selectedCategory, setValue, watch]);

  /* ================= EDIT MODE ================= */
  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (defaultValues) {
      // Set category and subcategory FIRST (before reset)
      setValue("category_id", defaultValues.category_id);
      setValue("subcategory_id", defaultValues.subcategory_id);

      // Then reset other fields
      reset({
        name: defaultValues.name,
        description: defaultValues.description ?? "",
        min_order_qty: defaultValues.min_order_qty,
        max_order_qty: defaultValues.max_order_qty,
        category_id: defaultValues.category_id,  // This will be set but won't trigger useEffect
        subcategory_id: defaultValues.subcategory_id,  // Same here
        images: [],
        related_images: [],
      });

      // Set existing images
      setExistingImages(defaultValues.images ?? []);
      setExistingRelatedImages(defaultValues.related_images ?? []);

      // Set image previews with full URLs
      setImagePreviews((defaultValues.images ?? []).map(img => getFullImageUrl(img.url)));
      setRelatedImagePreviews((defaultValues.related_images ?? []).map(img => getFullImageUrl(img.url)));
    }
  }, [defaultValues, reset, setValue, getFullImageUrl]);


  /* ================= IMAGE HANDLERS ================= */
  const handleImageChange = (files: File[], fieldOnChange: (files: File[]) => void) => {
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    setUploadError(null);

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`${file.name} is not supported. Use JPG, PNG, WEBP, or GIF.`);
        return;
      }
      if (file.size > maxSize) {
        setUploadError(`${file.name} exceeds 5MB limit.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      fieldOnChange(validFiles);
      setImagePreviews(prev => [...prev, ...validFiles]);
    }
  };

  const handleRelatedImageChange = (files: File[], fieldOnChange: (files: File[]) => void) => {
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    setUploadError(null);

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        setUploadError(`${file.name} is not supported. Use JPG, PNG, WEBP, or GIF.`);
        return;
      }
      if (file.size > maxSize) {
        setUploadError(`${file.name} exceeds 5MB limit.`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      fieldOnChange(validFiles);
      setRelatedImagePreviews(prev => [...prev, ...validFiles]);
    }
  };

  const removeImage = (index: number) => {
    const removed = imagePreviews[index];

    if (typeof removed === "string") {
      // Extract filename from URL
      const urlParts = removed.split('/');
      const filename = urlParts[urlParts.length - 1];
      setExistingImages(prev => prev.filter(img => {
        const imgUrlParts = img.url.split('/');
        const imgFilename = imgUrlParts[imgUrlParts.length - 1];
        return imgFilename !== filename;
      }));
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeRelatedImage = (index: number) => {
    const removed = relatedImagePreviews[index];

    if (typeof removed === "string") {
      const urlParts = removed.split('/');
      const filename = urlParts[urlParts.length - 1];
      setExistingRelatedImages(prev => prev.filter(img => {
        const imgUrlParts = img.url.split('/');
        const imgFilename = imgUrlParts[imgUrlParts.length - 1];
        return imgFilename !== filename;
      }));
    }

    setRelatedImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const submitHandler = async (data: ProductFormData) => {
    setUploadError(null);
    try {
      await onSubmit({
        ...data,
        existing_image_ids: existingImages.map(img => img.id),
        existing_related_image_ids: existingRelatedImages.map(img => img.id),
      });
    } catch (error) {
      setUploadError("Failed to save product. Please try again.");
      console.error("Submit error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      {/* Basic Information Card */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                {...register("name", {
                  required: "Product name is required",
                  minLength: { value: 3, message: "Name must be at least 3 characters" }
                })}
                placeholder="Enter product name"
                className={`${errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                Category
              </Label>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger className={`${categoriesError ? "border-red-500" : "border-gray-300"} focus:ring-[#D73D32] focus:border-[#D73D32]`}>
                      <SelectValue placeholder={
                        isLoadingCategories ? "Loading categories..." : "Select a category"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        !isLoadingCategories && (
                          <div className="px-2 py-4 text-sm text-gray-500 text-center">
                            No categories available
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {categoriesError && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {categoriesError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-sm font-medium text-gray-700">
                Subcategory
              </Label>
              <Controller
                name="subcategory_id"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!selectedCategory || isLoadingSubcategories || subcategories.length === 0}
                  >
                    <SelectTrigger className={`${subcategoriesError ? "border-red-500" : "border-gray-300"} focus:ring-[#D73D32] focus:border-[#D73D32]`}>
                      <SelectValue placeholder={
                        !selectedCategory
                          ? "Select a category first"
                          : isLoadingSubcategories
                            ? "Loading subcategories..."
                            : subcategories.length === 0
                              ? "No subcategories available"
                              : "Select a subcategory"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.length > 0 ? (
                        subcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))
                      ) : (
                        !isLoadingSubcategories && selectedCategory && (
                          <div className="px-2 py-4 text-sm text-gray-500 text-center">
                            No subcategories found
                          </div>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {subcategoriesError && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {subcategoriesError}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter product description"
                rows={4}
                className="resize-none border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Quantity Card */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Quantity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="min_order_qty" className="text-sm font-medium text-gray-700">
                Minimum Order Quantity
              </Label>
              <Input
                id="min_order_qty"
                type="number"
                {...register("min_order_qty", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Minimum quantity must be at least 1" },
                  required: "Minimum order quantity is required"
                })}
                placeholder="e.g., 100"
                className={`${errors.min_order_qty ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"}`}
              />
              {errors.min_order_qty && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.min_order_qty.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_order_qty" className="text-sm font-medium text-gray-700">
                Maximum Order Quantity
              </Label>
              <Input
                id="max_order_qty"
                type="number"
                {...register("max_order_qty", {
                  valueAsNumber: true,
                  min: { value: 1, message: "Maximum quantity must be at least 1" }
                })}
                placeholder="Optional"
                className="border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
              />
              {errors.max_order_qty && (
                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.max_order_qty.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images Card */}
      <Card className="border shadow-sm">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>

          {uploadError && (
            <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* Main Images */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                <ImageIcon className="w-4 h-4" />
                Main Images
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                  {imagePreviews.length} {imagePreviews.length === 1 ? 'image' : 'images'}
                </Badge>
              </Label>

              <Controller
                name="images"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-center w-full"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D73D32] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Click to upload images</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WEBP, GIF up to 5MB</span>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={e => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          handleImageChange(files, field.onChange);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
                        {imagePreviews.map((src, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={typeof src === "string" ? src : URL.createObjectURL(src)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-[#D73D32] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {typeof src === "string" && (
                              <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs bg-black/50 text-white border-0">
                                Existing
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>

            <Separator className="bg-gray-200" />

            {/* Related Images */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                <ImageIcon className="w-4 h-4" />
                Related Images
                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                  {relatedImagePreviews.length} {relatedImagePreviews.length === 1 ? 'image' : 'images'}
                </Badge>
              </Label>

              <Controller
                name="related_images"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-center w-full"
                      onClick={() => document.getElementById('related-image-upload')?.click()}
                    >
                      <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D73D32] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100">
                        <Upload className="w-6 h-6 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Click to upload related images</span>
                        <span className="text-xs text-gray-500">PNG, JPG, WEBP, GIF up to 5MB</span>
                      </div>
                      <Input
                        id="related-image-upload"
                        type="file"
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={e => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          handleRelatedImageChange(files, field.onChange);
                          e.target.value = '';
                        }}
                      />
                    </div>

                    {relatedImagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
                        {relatedImagePreviews.map((src, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img
                              src={typeof src === "string" ? src : URL.createObjectURL(src)}
                              alt={`Related preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-[#D73D32] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => removeRelatedImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {typeof src === "string" && (
                              <Badge variant="secondary" className="absolute bottom-1 left-1 text-xs bg-black/50 text-white border-0">
                                Existing
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white p-4 border-t shadow-lg rounded-b-lg">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-[#D73D32] to-[#B83229] hover:from-[#C83227] hover:to-[#A8271F] text-white shadow-lg font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-[#D73D32] focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {defaultValues ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            defaultValues ? 'Update Product' : 'Create Product'
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}