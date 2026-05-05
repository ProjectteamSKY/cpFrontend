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
import { AlertCircle, Upload, X, Loader2, Image as ImageIcon, FileUp, CheckCircle } from "lucide-react";
import { designValidation } from "../../validation/designValidation";

const BASE_URL = "https://api.citizenprintz.in";

interface Props {
    defaultValues?: DesignRequest | null;
    onSubmit: (data: DesignFormData) => Promise<void>;
    onCancel: () => void;
    onUploadDesigns?: (designId: string, files: File[]) => Promise<void>;
}

// Helper function to extract image paths from designed_images
function extractDesignedImages(designedImages: any): string[] {
    if (!designedImages) return [];
    
    if (Array.isArray(designedImages) && designedImages.length > 0 && typeof designedImages[0] === 'string') {
        return designedImages;
    }
    
    if (Array.isArray(designedImages) && designedImages.length > 0 && designedImages[0]?.images) {
        const latestItem = designedImages[designedImages.length - 1];
        return latestItem.images || [];
    }
    
    if (typeof designedImages === 'string') {
        try {
            const parsed = JSON.parse(designedImages);
            if (Array.isArray(parsed)) {
                if (parsed.length > 0 && parsed[0]?.images) {
                    const latestItem = parsed[parsed.length - 1];
                    return latestItem.images || [];
                }
                return parsed;
            }
            return [];
        } catch {
            return [];
        }
    }
    
    return [];
}

function designFormKey(design: DesignRequest | null | undefined): string {
    return design?.id ? `edit-${design.id}` : "create";
}

export function DesignForm({ defaultValues, onSubmit, onCancel, onUploadDesigns }: Props) {
    const formKey = designFormKey(defaultValues);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        getValues,
        watch,
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
    const [isInitialized, setIsInitialized] = useState(false);

    const [existingLogoImages, setExistingLogoImages] = useState<string[]>([]);
    const [existingDesignedImages, setExistingDesignedImages] = useState<string[]>([]);
    const [logoPreviews, setLogoPreviews] = useState<(string | File)[]>([]);
    const [designedPreviews, setDesignedPreviews] = useState<(string | File)[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploadingDesigns, setIsUploadingDesigns] = useState(false);
    const [selectedPrintLocation, setSelectedPrintLocation] = useState<string>("front");

    const watchSelectedAttributes = watch("selected_attributes");

    const getFullImageUrl = useCallback((imagePath: string) => {
        if (!imagePath) return "";
        if (imagePath.startsWith("http")) return imagePath;
        const cleanPath = imagePath.replace(/\\/g, "/");
        return `${BASE_URL}/${cleanPath}`;
    }, []);

    // Get print location from selected attributes
    const getPrintLocation = useCallback((attributes: any[]) => {
        if (!attributes || !Array.isArray(attributes)) return selectedPrintLocation;
        const printLocationAttr = attributes.find(
            attr => attr?.attribute_name?.toLowerCase() === "print location" || 
                    attr?.attribute_name?.toLowerCase() === "print_location"
        );
        return printLocationAttr?.attribute_value_name?.toLowerCase() || selectedPrintLocation;
    }, [selectedPrintLocation]);

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true);
            setProductsError(null);
            try {
                const data = await getAllProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
                setProductsError("Failed to load products. Please refresh the page.");
                setProducts([]);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Initialize form with defaultValues
    useEffect(() => {
        if (!defaultValues) {
            setIsInitialized(false);
            return;
        }

        // Parse selected attributes if they exist
        let selectedAttributes = defaultValues.selected_attributes || [];
        if (typeof selectedAttributes === 'string') {
            try {
                selectedAttributes = JSON.parse(selectedAttributes);
            } catch {
                selectedAttributes = [];
            }
        }

        // Set print location from selected attributes
        if (selectedAttributes && selectedAttributes.length > 0) {
            const printLocationAttr = selectedAttributes.find(
                attr => attr?.attribute_name?.toLowerCase() === "print location" || 
                        attr?.attribute_name?.toLowerCase() === "print_location"
            );
            if (printLocationAttr?.attribute_value_name) {
                setSelectedPrintLocation(printLocationAttr.attribute_value_name.toLowerCase());
            }
        }

        reset({
            name: defaultValues.name || "",
            email: defaultValues.email || "",
            phone: defaultValues.phone || "",
            product_id: defaultValues.product_id || "",
            design_notes: defaultValues.design_notes || "",
            logo_images: [],
            designed_images: [],
            design_price: defaultValues.design_price || 0,
        });

        let logoImagesArray: string[] = [];
        if (Array.isArray(defaultValues.logo_images)) {
            logoImagesArray = defaultValues.logo_images;
        } else if (typeof defaultValues.logo_images === 'string' && defaultValues.logo_images) {
            try {
                const parsed = JSON.parse(defaultValues.logo_images);
                logoImagesArray = Array.isArray(parsed) ? parsed : [];
            } catch {
                logoImagesArray = [];
            }
        }
        
        setExistingLogoImages(logoImagesArray);
        setLogoPreviews(logoImagesArray.map((img: string) => getFullImageUrl(img)));

        const designedImagesArray = extractDesignedImages(defaultValues.designed_images);
        setExistingDesignedImages(designedImagesArray);
        setDesignedPreviews(designedImagesArray.map((img: string) => getFullImageUrl(img)));
        
        setIsInitialized(true);
        
    }, [formKey, defaultValues, reset, getFullImageUrl]);

    // Set product_id in form
    useEffect(() => {
        if (isInitialized && products.length > 0 && defaultValues?.product_id) {
            const productExists = products.some(p => p.id === defaultValues.product_id);
            if (productExists) {
                const currentValue = getValues("product_id");
                if (currentValue !== defaultValues.product_id) {
                    setValue("product_id", defaultValues.product_id);
                }
            }
        }
    }, [isInitialized, products, defaultValues, setValue, getValues]);

    // Handle designed images upload and auto-update status
    const handleDesignedImageUpload = async (files: File[], designId: string) => {
        if (!onUploadDesigns || !designId) return;
        
        setIsUploadingDesigns(true);
        try {
            await onUploadDesigns(designId, files);
            toast.success("Designs uploaded and status updated to Design Completed!");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload designs");
        } finally {
            setIsUploadingDesigns(false);
        }
    };

    // NEW VALIDATION: Check back print requirement
    const validateBackPrintRequirement = useCallback((totalImages: number) => {
        const printLocation = getPrintLocation(watchSelectedAttributes);
        if (printLocation === "back" && totalImages < 2) {
            setUploadError("Back print requires at least 2 design images (front + back)");
            return false;
        }
        return true;
    }, [watchSelectedAttributes, getPrintLocation]);

    // Image Handlers
    const validateAndAddFiles = (
        files: File[], 
        setPreviews: React.Dispatch<React.SetStateAction<(string | File)[]>>, 
        fieldOnChange: any,
        currentPreviews: (string | File)[],
        maxFiles: number = 5,
        isDesignedImage: boolean = false,
        designId?: string
    ) => {
        const validFiles: File[] = [];
        const maxSize = 5 * 1024 * 1024;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        
        setUploadError(null);

        if (currentPreviews.length + files.length > maxFiles) {
            setUploadError(`Maximum ${maxFiles} images allowed.`);
            return;
        }

        // NEW VALIDATION: Check back print requirement for designed images
        if (isDesignedImage) {
            const totalAfterAdd = currentPreviews.length + files.length;
            if (!validateBackPrintRequirement(totalAfterAdd)) {
                return;
            }
        }

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
            
            // Auto-upload designed images if it's a design upload and we have design ID
            if (isDesignedImage && designId && validFiles.length > 0) {
                handleDesignedImageUpload(validFiles, designId);
            }
        }
    };

    const handleLogoImageChange = (files: File[], fieldOnChange: any) =>
        validateAndAddFiles(files, setLogoPreviews, fieldOnChange, logoPreviews, 5, false);

    const handleDesignedImageChange = (files: File[], fieldOnChange: any) => {
        const designId = defaultValues?.id;
        validateAndAddFiles(files, setDesignedPreviews, fieldOnChange, designedPreviews, 10, true, designId);
    };

    const removeImage = (
        index: number,
        previews: (string | File)[],
        setPreviews: React.Dispatch<React.SetStateAction<(string | File)[]>>,
        existing: string[],
        setExisting: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const removed = previews[index];
        if (typeof removed === "string") {
            const imageUrl = removed;
            setExisting((prev: string[]) => prev.filter((img) => {
                const fullImgUrl = getFullImageUrl(img);
                return fullImgUrl !== imageUrl;
            }));
        }
        setPreviews((prev: any[]) => prev.filter((_, i) => i !== index));
        
        // NEW VALIDATION: Re-validate after removal
        setTimeout(() => {
            const newTotal = previews.filter((_, i) => i !== index).length;
            validateBackPrintRequirement(newTotal);
        }, 100);
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

        // NEW VALIDATION: Final check for back print requirement before submission
        const printLocation = getPrintLocation(watchSelectedAttributes);
        if (printLocation === "back" && designedPreviews.length < 2) {
            setUploadError("Back print requires at least 2 design images (front + back). Please upload both front and back designs.");
            return;
        }

        const submissionData: any = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            product_id: data.product_id,
            design_notes: data.design_notes,
            design_price: data.design_price && !isNaN(data.design_price) ? data.design_price : 0,
            logo_images: logoPreviews.filter((item): item is File => item instanceof File),
            designed_images: designedPreviews.filter((item): item is File => item instanceof File),
        };

        if (existingLogoImages.length > 0) {
            submissionData.existing_logo_images = existingLogoImages;
        }
        
        if (existingDesignedImages.length > 0) {
            submissionData.existing_designed_images = existingDesignedImages;
        }

        // NEW VALIDATION: Add selected_attributes to submission if available
        if (defaultValues?.selected_attributes) {
            submissionData.selected_attributes = defaultValues.selected_attributes;
        }

        try {
            await onSubmit(submissionData);
        } catch (error) {
            setUploadError("Failed to save design request. Please try again.");
            console.error(error);
        }
    };

    // NEW VALIDATION: Get current print location for display
    const currentPrintLocation = getPrintLocation(watchSelectedAttributes);

    return (
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            {/* Client Information Card */}
            <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)' }}>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d4863' }}>Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Client Name <span className="text-[#D73D32]">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name", designValidation.name)}
                                placeholder="Enter client name"
                                className={`${errors.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    } transition-all`}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email <span className="text-[#D73D32]">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email", designValidation.email)}
                                placeholder="client@example.com"
                                className={`${errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    } transition-all`}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                Phone <span className="text-[#D73D32]">*</span>
                            </Label>
                            <Input
                                id="phone"
                                {...register("phone", designValidation.phone)}
                                placeholder="Enter phone number"
                                className={`${errors.phone
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32]"
                                    } transition-all`}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                                Product <span className="text-[#D73D32]">*</span>
                            </Label>
                            <Controller
                                name="product_id"
                                control={control}
                                rules={designValidation.product_id}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(val) => {
                                            field.onChange(String(val));
                                        }}
                                        value={field.value ? String(field.value) : ""}
                                        disabled={isLoadingProducts}
                                    >
                                        <SelectTrigger
                                            className={`${productsError ? "border-red-500" : "border-gray-200"}
                                                focus:ring-[#D73D32] focus:border-[#D73D32] transition-all`}
                                        >
                                            <SelectValue 
                                                placeholder={
                                                    isLoadingProducts ? "Loading products..." : 
                                                    productsError ? "Error loading products" :
                                                    "Select a product"
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
                                                !isLoadingProducts && !productsError && (
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
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Design Details Card */}
            <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)' }}>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d4863' }}>Design Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="design_price" className="text-sm font-medium text-gray-700">
                                Design Price (₹)
                            </Label>
                            <Input
                                id="design_price"
                                type="number"
                                step="0.01"
                                {...register("design_price", designValidation.design_price)}
                                placeholder="0"
                                className="border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32] transition-all"
                            />
                        </div>

                        <div></div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="design_notes" className="text-sm font-medium text-gray-700">
                                Design Notes / Requirements
                            </Label>
                            <Textarea
                                id="design_notes"
                                {...register("design_notes", designValidation.design_notes)}
                                placeholder="Enter any special requirements or notes for the designer"
                                rows={4}
                                className="resize-none border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32] transition-all"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logo Reference Images Card */}
            <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)' }}>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#2d4863' }}>Logo Reference Images</h3>

                    {uploadError && (
                        <Alert variant="destructive" className="mb-4 bg-red-50 border-red-200">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700">{uploadError}</AlertDescription>
                        </Alert>
                    )}

                    {/* NEW VALIDATION: Warning for back print requirement */}
                    {currentPrintLocation === "back" && designedPreviews.length < 2 && (
                        <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-700">
                                Back print selected. You need to upload at least 2 design images (front + back).
                                Current: {designedPreviews.length} image(s)
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                <ImageIcon className="w-4 h-4" style={{ color: '#F4A261' }} />
                                Logo Images <span className="text-[#D73D32]">*</span>
                                <Badge className="ml-2 bg-[#2d4863]/10 text-[#2d4863] border-0">
                                    {logoPreviews.length} / 5
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
                                            <div className="w-full h-32 border-2 border-dashed rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100"
                                                style={{ borderColor: '#EC7063/30', hover: { borderColor: '#D73D32' } }}>
                                                <Upload className="w-6 h-6" style={{ color: '#F4A261' }} />
                                                <span className="text-sm font-medium" style={{ color: '#2d4863' }}>
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
                                                    if (files.length > 0) {
                                                        handleLogoImageChange(files, field.onChange);
                                                    }
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
                                                            className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index, logoPreviews, setLogoPreviews, existingLogoImages, setExistingLogoImages)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                        {typeof src === "string" && (
                                                            <Badge
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
                <Card className="border-0 shadow-md" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)' }}>
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#2d4863' }}>Upload Designed Files</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Upload the final design files - Status will automatically update to "Design Completed"
                        </p>

                        {isUploadingDesigns && (
                            <div className="mb-4 p-3 rounded-lg bg-[#EC7063]/10 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#D73D32' }} />
                                <span className="text-sm" style={{ color: '#2d4863' }}>Uploading designs and updating status...</span>
                            </div>
                        )}

                        {/* NEW VALIDATION: Enhanced warning for back print */}
                        {currentPrintLocation === "back" && designedPreviews.length < 2 && (
                            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-yellow-700">
                                    ⚠️ Back print selected. You need to upload at least 2 design images (front + back).
                                    Current: {designedPreviews.length} image(s)
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div>
                                <Label className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                                    <FileUp className="w-4 h-4" style={{ color: '#F4A261' }} />
                                    Designed Images
                                    <Badge className="ml-2 bg-[#2d4863]/10 text-[#2d4863] border-0">
                                        {designedPreviews.length} images
                                    </Badge>
                                    {/* NEW VALIDATION: Badge indicator for back print requirement */}
                                    {currentPrintLocation === "back" && designedPreviews.length < 2 && (
                                        <Badge className="ml-2 bg-red-100 text-red-700 border-0">
                                            Requires 2+ images
                                        </Badge>
                                    )}
                                    {currentPrintLocation === "back" && designedPreviews.length >= 2 && (
                                        <Badge className="ml-2 bg-green-100 text-green-700 border-0">
                                            ✓ Requirements met
                                        </Badge>
                                    )}
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
                                                <div className="w-full h-32 border-2 border-dashed rounded-lg transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EC7063]/5 to-[#F4A261]/5 hover:from-[#EC7063]/10 hover:to-[#F4A261]/10"
                                                    style={{ borderColor: '#EC7063/30' }}>
                                                    <Upload className="w-6 h-6" style={{ color: '#D73D32' }} />
                                                    <span className="text-sm font-medium" style={{ color: '#2d4863' }}>
                                                        Click to upload designed images
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        PNG, JPG, WEBP, GIF up to 5MB
                                                    </span>
                                                    <Badge className="mt-1 bg-[#EC7063]/20 text-[#D73D32] border-0">
                                                        Auto-updates status to Design Completed
                                                    </Badge>
                                                </div>
                                                <Input
                                                    id="designed-upload"
                                                    type="file"
                                                    multiple
                                                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const files = e.target.files ? Array.from(e.target.files) : [];
                                                        if (files.length > 0) {
                                                            handleDesignedImageChange(files, field.onChange);
                                                        }
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
                                                                className="w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index, designedPreviews, setDesignedPreviews, existingDesignedImages, setExistingDesignedImages)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                            {typeof src === "string" && (
                                                                <Badge
                                                                    className="absolute bottom-1 left-1 text-xs bg-black/50 text-white border-0"
                                                                >
                                                                    Existing
                                                                </Badge>
                                                            )}
                                                            {/* NEW VALIDATION: Front/Back labels */}
                                                            {currentPrintLocation === "back" && index === 0 && (
                                                                <Badge
                                                                    className="absolute top-1 left-1 text-xs bg-blue-500/80 text-white border-0"
                                                                >
                                                                    Front
                                                                </Badge>
                                                            )}
                                                            {currentPrintLocation === "back" && index === 1 && (
                                                                <Badge
                                                                    className="absolute top-1 left-1 text-xs bg-purple-500/80 text-white border-0"
                                                                >
                                                                    Back
                                                                </Badge>
                                                            )}
                                                            {designedPreviews.length > 0 && (
                                                                <div className="absolute top-1 right-1">
                                                                    <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
                                                                </div>
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
                    disabled={isSubmitting || isLoadingProducts}
                    className="flex-1 bg-gradient-to-r from-[#D73D32] to-[#EC7063] hover:from-[#C83227] hover:to-[#D73D32] text-white shadow-lg font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
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
                    className="flex-1 border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}