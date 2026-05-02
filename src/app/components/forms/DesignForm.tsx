import { useEffect, useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DesignFormData, DesignRequest } from "../../types/design";
import { getAllProducts } from "../../service/productApiService";
import { Product } from "../../types/product";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Upload, X, Loader2, Image as ImageIcon, FileUp } from "lucide-react";
import { designValidation } from "../../validation/designValidation";

const BASE_URL = "https://api.citizenprintz.in";

interface Props {
    defaultValues?: DesignRequest | null;
    onSubmit: (data: DesignFormData) => Promise<void>;
    onCancel: () => void;
}

function designFormKey(design: DesignRequest | null | undefined): string {
    return design?.id ? `edit-${design.id}` : "create";
}

export function DesignForm({ defaultValues, onSubmit, onCancel }: Props) {
    const formKey = designFormKey(defaultValues);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DesignFormData>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            product_id: "",
            design_notes: "",
            logo_images: [],
            designed_images: [],
            design_price: 0,
        },
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState<string | null>(null);

    const [existingLogoImages, setExistingLogoImages] = useState<string[]>([]);
    const [existingDesignedImages, setExistingDesignedImages] = useState<string[]>([]);
    const [logoPreviews, setLogoPreviews] = useState<(string | File)[]>([]);
    const [designedPreviews, setDesignedPreviews] = useState<(string | File)[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const getFullImageUrl = useCallback((imagePath: string) => {
        if (imagePath.startsWith("http")) return imagePath;
        return `${BASE_URL}/${imagePath}`;
    }, []);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            setProductsError(null);
            try {
                const data = await getAllProducts();
                setProducts(data || []);
            } catch (error) {
                setProductsError("Failed to load products. Please refresh the page.");
                setProducts([]);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Edit Mode
    useEffect(() => {
        if (!defaultValues) return;

        // First reset basic fields
        reset({
            name: defaultValues.name || "",
            email: defaultValues.email || "",
            phone: defaultValues.phone || "",
            product_id: "", // set later after products load
            design_notes: defaultValues.design_notes || "",
            logo_images: [],
            designed_images: [],
            design_price: defaultValues.design_price || 0,
        });

        setExistingLogoImages(defaultValues.logo_images ?? []);
        setExistingDesignedImages(defaultValues.designed_images ?? []);

        setLogoPreviews(
            (defaultValues.logo_images ?? []).map((img) => getFullImageUrl(img))
        );
        setDesignedPreviews(
            (defaultValues.designed_images ?? []).map((img) => getFullImageUrl(img))
        );
    }, [formKey, defaultValues, reset, getFullImageUrl]);

    useEffect(() => {
        if (!defaultValues || products.length === 0) return;

        // Ensure product exists in list
        const exists = products.find(p => p.id === defaultValues.product_id);

        if (exists) {
            setValue("product_id", String(defaultValues.product_id));
        }
    }, [products, defaultValues, setValue]);
    // Image Handlers
    const validateAndAddFiles = (files: File[], setPreviews: any, fieldOnChange: any) => {
        const validFiles: File[] = [];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        setUploadError(null);

        files.forEach((file) => {
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
            setPreviews((prev: any) => [...prev, ...validFiles]);
        }
    };

    const handleLogoImageChange = (files: File[], fieldOnChange: any) =>
        validateAndAddFiles(files, setLogoPreviews, fieldOnChange);

    const handleDesignedImageChange = (files: File[], fieldOnChange: any) =>
        validateAndAddFiles(files, setDesignedPreviews, fieldOnChange);

    const removeImage = (
        index: number,
        previews: (string | File)[],
        setPreviews: any,
        existing: string[],
        setExisting: any
    ) => {
        const removed = previews[index];
        if (typeof removed === "string") {
            const filename = removed.split("/").pop();
            setExisting((prev: string[]) => prev.filter((img) => img.split("/").pop() !== filename));
        }
        setPreviews((prev: any[]) => prev.filter((_, i) => i !== index));
    };

    // Submit
    const submitHandler = async (data: DesignFormData) => {
        setUploadError(null);
        if (logoPreviews.length === 0) {
            setUploadError("At least one logo reference image is required.");
            return;
        }
        if (logoPreviews.length > 5) {
            setUploadError("Maximum 5 logo images allowed.");
            return;
        }
        try {
            await onSubmit({
                ...data,
                design_price: data.design_price && !isNaN(data.design_price) ? data.design_price : 0,
            });
        } catch (error) {
            setUploadError("Failed to save design request. Please try again.");
            console.error(error);
        }
    };



    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            {/* Client Information Card */}
            <Card className="border shadow-sm">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name — REQUIRED */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Client Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name", designValidation.name)}
                                placeholder="Enter client name"
                                className={`${errors.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Email — REQUIRED */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", designValidation.email)}
                                placeholder="client@example.com"
                                className={`${errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Phone — REQUIRED */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="phone"
                                {...register("phone", designValidation.phone)}
                                placeholder="Enter phone number"
                                className={`${errors.phone
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    }`}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        {/* Product — REQUIRED */}
                        <div className="space-y-2">
                            <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                                Product <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="product_id"
                                control={control}
                                rules={designValidation.product_id}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => field.onChange(String(val))}
                                        value={field.value ? String(field.value) : ""}
                                        disabled={isLoadingProducts}
                                    >
                                        <SelectTrigger
                                            className={`${productsError ? "border-red-500" : "border-gray-300"
                                                } focus:ring-[#D73D32] focus:border-[#D73D32]`}
                                        >
                                            <SelectValue
                                                placeholder={
                                                    isLoadingProducts ? "Loading products..." : "Select a product"
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.length > 0 ? (
                                                products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                !isLoadingProducts && (
                                                    <div className="px-2 py-4 text-sm text-gray-500 text-center">
                                                        No products available
                                                    </div>
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.product_id && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.product_id.message}
                                </p>
                            )}
                            {productsError && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {productsError}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Design Details Card */}
            <Card className="border shadow-sm">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Design Price — OPTIONAL */}
                        <div className="space-y-2">
                            <Label htmlFor="design_price" className="text-sm font-medium text-gray-700">
                                Design Price (₹)
                            </Label>
                            <Input
                                id="design_price"
                                type="number"
                                {...register("design_price", designValidation.design_price)}
                                placeholder="0"
                                className="border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
                            />
                        </div>

                        {/* Placeholder for future fields */}
                        <div></div>

                        {/* Design Notes — OPTIONAL */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="design_notes" className="text-sm font-medium text-gray-700">
                                Design Notes / Requirements
                            </Label>
                            <Textarea
                                id="design_notes"
                                {...register("design_notes", designValidation.design_notes)}
                                placeholder="Enter any special requirements or notes for the designer"
                                rows={4}
                                className="resize-none border-gray-300 focus:border-[#D73D32] focus:ring-[#D73D32]"
                            />
                            {errors.design_notes && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.design_notes.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logo Reference Images Card */}
            <Card className="border shadow-sm">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Reference Images</h3>

                    {uploadError && (
                        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                <ImageIcon className="w-4 h-4" />
                                Logo Images <span className="text-red-500">*</span>
                                <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                                    {logoPreviews.length} {logoPreviews.length === 1 ? "image" : "images"}
                                </Badge>
                            </Label>

                            <Controller
                                name="logo_images"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-3">
                                        <div
                                            className="flex items-center justify-center w-full"
                                            onClick={() => document.getElementById("logo-upload")?.click()}
                                        >
                                            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D73D32] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100">
                                                <Upload className="w-6 h-6 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-600">
                                                    Click to upload logo reference images
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    PNG, JPG, WEBP, GIF up to 5MB (max 5 images)
                                                </span>
                                            </div>
                                            <Input
                                                id="logo-upload"
                                                type="file"
                                                multiple
                                                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const files = e.target.files ? Array.from(e.target.files) : [];
                                                    handleLogoImageChange(files, field.onChange);
                                                    e.target.value = "";
                                                }}
                                            />
                                        </div>

                                        {logoPreviews.length > 0 && (
                                            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
                                                {logoPreviews.map((src, index) => (
                                                    <div key={index} className="relative group aspect-square">
                                                        <img
                                                            src={typeof src === "string" ? src : URL.createObjectURL(src)}
                                                            alt={`Logo ${index + 1}`}
                                                            className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-[#D73D32] transition-colors"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index, logoPreviews, setLogoPreviews, existingLogoImages, setExistingLogoImages)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        {typeof src === "string" && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="absolute bottom-1 left-1 text-xs bg-black/50 text-white border-0"
                                                            >
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

            {/* Designed Files Upload Card - Only for Edit Mode */}
            {defaultValues && (
                <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Designed Files</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload the final design files for this request
                        </p>

                        <div className="space-y-4">
                            <div>
                                <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                    <FileUp className="w-4 h-4" />
                                    Designed Images
                                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                                        {designedPreviews.length} {designedPreviews.length === 1 ? "image" : "images"}
                                    </Badge>
                                </Label>

                                <Controller
                                    name="designed_images"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="space-y-3">
                                            <div
                                                className="flex items-center justify-center w-full"
                                                onClick={() => document.getElementById("designed-upload")?.click()}
                                            >
                                                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#D73D32] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100">
                                                    <Upload className="w-6 h-6 text-gray-500" />
                                                    <span className="text-sm font-medium text-gray-600">
                                                        Click to upload designed images
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        PNG, JPG, WEBP, GIF up to 5MB (max 5 images)
                                                    </span>
                                                </div>
                                                <Input
                                                    id="designed-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                                        handleDesignedImageChange(files, field.onChange);
                                                        e.target.value = "";
                                                    }}
                                                />
                                            </div>

                                            {designedPreviews.length > 0 && (
                                                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-4">
                                                    {designedPreviews.map((src, index) => (
                                                        <div key={index} className="relative group aspect-square">
                                                            <img
                                                                src={typeof src === "string" ? src : URL.createObjectURL(src)}
                                                                alt={`Design ${index + 1}`}
                                                                className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-[#D73D32] transition-colors"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index, designedPreviews, setDesignedPreviews, existingDesignedImages, setExistingDesignedImages)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            {typeof src === "string" && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="absolute bottom-1 left-1 text-xs bg-black/50 text-white border-0"
                                                                >
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
            )}

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
                            {defaultValues ? "Updating..." : "Creating..."}
                        </>
                    ) : defaultValues ? (
                        "Update Design Request"
                    ) : (
                        "Create Design Request"
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