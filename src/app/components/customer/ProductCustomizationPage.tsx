// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router";
// import {
//   Star,
//   Heart,
//   Share2,
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   Truck,
//   Shield,
//   RotateCcw,
//   Clock,
//   Mail,
//   Phone,
//   Upload,
//   Edit3,
//   Info
// } from "lucide-react";
// import axios from "axios";
// import { Button } from "../../components/ui/button";
// import { Card } from "../../components/ui/card";
// import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
// import { Label } from "../../components/ui/label";
// import { Separator } from "../../components/ui/separator";
// import { Dialog, DialogContent } from "../../components/ui/dialog";
// import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
// import { getImageUrl, enrichProductData } from "../../utils/productutils";
// import { API_BASE_URL } from "../../constants/productconstants";
// import { useDesignUpload } from "../../hooks/useDesignUpload";
// import { UploadDesignCard } from "../../components/product/UploadDesignCard";
// import { AddToCartCard } from "../../components/product/AddToCartCard";
// import { OrderSummaryCard } from "../../components/product/OrderSummaryCard";
// import { toast } from "react-toastify";
// import { Toaster } from "../ui/toaster";

// // Define interfaces for the variant structure
// interface Size {
//   id: string;
//   name: string;
//   dimensions?: string;
// }

// interface PaperType {
//   id: string;
//   name: string;
//   description?: string;
// }

// interface PrintType {
//   id: string;
//   name: string;
// }

// interface CutType {
//   id: string;
//   name: string;
// }

// interface VariantOption {
//   id: string;
//   variantId: string;
//   size: Size;
//   paperType: PaperType;
//   printType: PrintType;
//   cutType: CutType;
//   sides: number;
//   twoSideCut: number;
//   fourSideCut: number;
//   orientation: string;
//   prices: VariantPrice[];
//   minPrice: number;
//   maxPrice: number;
// }

// // API Response interface
// interface ApiResponse {
//   status: string;
//   product: Product;
// }

// export function ProductDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
//   const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
//   const [isFavorite, setIsFavorite] = useState<boolean>(false);

//   // Dynamic state based on variants
//   const [variants, setVariants] = useState<VariantOption[]>([]);
//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [selectedSize, setSelectedSize] = useState<string>("");
//   const [selectedPaperType, setSelectedPaperType] = useState<string>("");
//   const [selectedPrintType, setSelectedPrintType] = useState<string>("");
//   const [selectedCutType, setSelectedCutType] = useState<string>("");
//   const [selectedSides, setSelectedSides] = useState<string>("2"); // 1 or 2 sides
//   const [selectedQuantity, setSelectedQuantity] = useState<string>("100");
//   const [availableQuantities, setAvailableQuantities] = useState<{ min: number, max: number, price: number }[]>([]);

//   const [basePrice, setBasePrice] = useState<number>(0);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const {
//     uploadedFile,
//     uploadedPreview,
//     uploadError,
//     handleFileUpload,
//     removeFile
//   } = useDesignUpload();
//   // Static options
//   const [frontFile, setFrontFile] = useState<File | null>(null);
//   const [backFile, setBackFile] = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview, setBackPreview] = useState<string | null>(null);
//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setFrontFile(file);
//     setFrontPreview(URL.createObjectURL(file));
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setBackFile(file);
//     setBackPreview(URL.createObjectURL(file));
//   };

//   const handleUploadAndRedirect = () => {
//     if (!selectedVariant || !selectedQuantity) return;

//     // 🔒 Validation
//     if (!frontFile) {
//       alert("Front design is required.");
//       return;
//     }

//     if (selectedSides === "2" && !backFile) {
//       alert("Back design is required for double-sided printing.");
//       return;
//     }

//     // Find selected price
//     const selectedPriceObj = selectedVariant.prices.find(
//       (p) => String(p.id) === String(selectedQuantity)
//     );

//     if (!selectedPriceObj) {
//       console.warn("Selected quantity does not match any price.");
//       return;
//     }

//     const quantityNumber = Number(selectedPriceObj.min_qty);

//     const selectedOptions = {
//       size: selectedVariant.size?.name ?? "",
//       material: selectedVariant.paperType?.name ?? "",
//       lamination: selectedVariant.printType?.name ?? "",
//     };

//     navigate("/design-review", {
//       state: {
//         product,
//         variant: selectedVariant,
//         quantity: quantityNumber,
//         priceId: selectedPriceObj.id,
//         selected_options: selectedOptions,

//         // 🔥 NEW STRUCTURE
//         frontDesign: frontFile,
//         backDesign: selectedSides === "2" ? backFile : null,

//         frontPreview: frontPreview,
//         backPreview: backPreview,

//         basePrice: selectedPriceObj.price,
//         totalPrice: selectedPriceObj.price,
//         sides: selectedSides,
//       }
//     });
//   };

//   const sidesOptions = [
//     { label: "Single Sided", value: "1" },
//     { label: "Double Sided", value: "2" }
//   ];

//   // Safe parse function for JSON strings
//   const safeParse = (value: any): any[] => {
//     if (!value) return [];
//     try {
//       if (typeof value === "string") {
//         // Try to parse the string
//         const parsed = JSON.parse(value);
//         // If the parsed result is still a string, parse again
//         if (typeof parsed === "string") {
//           return JSON.parse(parsed);
//         }
//         return parsed;
//       }
//       return value;
//     } catch {
//       return [];
//     }
//   };

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);

//         // Extract product data from response wrapper
//         const rawData = res.data.product;

//         // Parse image fields
//         const parsedProduct = {
//           ...rawData,
//           images: safeParse(rawData.images),
//           related_images: safeParse(rawData.related_images),
//         };

//         const enriched = enrichProductData(parsedProduct);
//         setProduct(enriched);

//         // Process variants if they exist
//         if (rawData.variants && Array.isArray(rawData.variants)) {
//           processVariants(rawData.variants);
//         }
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchProduct();
//     }
//   }, [id]);

//   // Process variants into selectable options
//   const processVariants = (variantData: ProductVariant[]) => {
//     const processedVariants: VariantOption[] = variantData.map((v: ProductVariant) => {
//       // Calculate min and max price from prices array
//       const prices = v.prices || [];
//       const priceValues = prices.map((p: VariantPrice) => p.price);
//       const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
//       const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

//       // Set dimensions based on size name
//       let dimensions = '89 x 51mm'; // default for business card
//       if (v.size_name?.toLowerCase().includes('a4')) {
//         dimensions = '210 x 297mm';
//       } else if (v.size_name?.toLowerCase().includes('a5')) {
//         dimensions = '148 x 210mm';
//       }

//       return {
//         id: v.id,
//         variantId: v.id,
//         size: {
//           id: v.size_id,
//           name: v.size_name || 'Standard',
//           dimensions: dimensions
//         },
//         paperType: {
//           id: v.paper_type_id,
//           name: v.paper_type_name || 'Standard'
//         },
//         printType: {
//           id: v.print_type_id,
//           name: v.print_type_name || 'Digital'
//         },
//         cutType: {
//           id: v.cut_type_id,
//           name: v.cut_type_name || 'Straight'
//         },
//         sides: v.sides || 2,
//         twoSideCut: v.two_side_cut || 0,
//         fourSideCut: v.four_side_cut || 0,
//         orientation: v.orientation || 'Portrait',
//         prices: prices,
//         minPrice: minPrice,
//         maxPrice: maxPrice
//       };
//     });

//     setVariants(processedVariants);

//     // Set default selections based on first variant
//     if (processedVariants.length > 0) {
//       const firstVariant = processedVariants[0];
//       setSelectedVariant(firstVariant);
//       setSelectedSize(firstVariant.size.name);
//       setSelectedPaperType(firstVariant.paperType.name);
//       setSelectedPrintType(firstVariant.printType.name);
//       setSelectedCutType(firstVariant.cutType.name);
//       setSelectedSides(firstVariant.sides.toString());

//       // Process prices for quantity options
//       if (firstVariant.prices.length > 0) {
//         const firstPrice = firstVariant.prices[0];

//         setSelectedQuantity(String(firstPrice.id));
//         setBasePrice(firstPrice.price);
//         setTotalPrice(firstPrice.price);
//       }
//     }
//   };

//   // Update selected variant when options change
//   useEffect(() => {
//     if (variants.length === 0) return;

//     // Find variant matching current selections
//     const matchingVariant = variants.find(v =>
//       v.size.name === selectedSize &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType &&
//       v.cutType.name === selectedCutType &&
//       v.sides.toString() === selectedSides
//     );

//     if (matchingVariant) {
//       setSelectedVariant(matchingVariant);

//       // Update quantities and price
//       if (matchingVariant.prices.length > 0) {
//         const quantities = matchingVariant.prices.map((p: VariantPrice) => ({
//           min: p.min_qty,
//           max: p.max_qty,
//           price: p.price
//         }));
//         setAvailableQuantities(quantities);

//         // Find price for selected quantity or use first
//         const quantityPrice = matchingVariant.prices.find(
//           (p: VariantPrice) => p.min_qty <= parseInt(selectedQuantity) && p.max_qty >= parseInt(selectedQuantity)
//         );

//         if (quantityPrice) {
//           setBasePrice(quantityPrice.price);
//           setTotalPrice(quantityPrice.price);
//         } else if (matchingVariant.prices[0]) {
//           setBasePrice(matchingVariant.prices[0].price);
//           setTotalPrice(matchingVariant.prices[0].price);
//         }
//       }
//     }
//   }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, selectedSides, selectedQuantity, variants]);

//   // Update price when quantity changes
//   useEffect(() => {
//     if (variants.length === 0) return;

//     const matchingVariant = variants.find(v =>
//       v.size.name === selectedSize &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType &&
//       v.cutType.name === selectedCutType &&
//       v.sides.toString() === selectedSides
//     );

//     if (!matchingVariant) return;

//     setSelectedVariant(matchingVariant);

//     if (matchingVariant.prices.length > 0) {
//       const firstPrice = matchingVariant.prices[0];

//       setSelectedQuantity(String(firstPrice.id));
//       setBasePrice(firstPrice.price);
//       setTotalPrice(firstPrice.price);
//     }
//   }, [
//     selectedSize,
//     selectedPaperType,
//     selectedPrintType,
//     selectedCutType,
//     selectedSides,
//     variants
//   ]);

//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity) return;

//     const selectedPrice = selectedVariant.prices.find(
//       (p) => String(p.id) === String(selectedQuantity)
//     );

//     if (selectedPrice) {
//       setBasePrice(selectedPrice.price);
//       setTotalPrice(selectedPrice.price);
//     }
//   }, [selectedQuantity, selectedVariant]);

//   const toggleFavorite = () => setIsFavorite(!isFavorite);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product?.name,
//         text: product?.description,
//         url: window.location.href
//       }).catch(() => {
//         navigator.clipboard.writeText(window.location.href);
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//     }
//   };

//   // Get unique options for dropdowns
//   const getUniqueSizes = (): Size[] => {
//     const sizes = new Map<string, Size>();
//     variants.forEach(v => {
//       if (!sizes.has(v.size.name)) {
//         sizes.set(v.size.name, v.size);
//       }
//     });
//     return Array.from(sizes.values());
//   };

//   const getUniquePaperTypes = (): PaperType[] => {
//     const papers = new Map<string, PaperType>();
//     variants.forEach(v => {
//       if (!papers.has(v.paperType.name)) {
//         papers.set(v.paperType.name, v.paperType);
//       }
//     });
//     return Array.from(papers.values());
//   };

//   const getUniquePrintTypes = (): PrintType[] => {
//     const prints = new Map<string, PrintType>();
//     variants.forEach(v => {
//       if (!prints.has(v.printType.name)) {
//         prints.set(v.printType.name, v.printType);
//       }
//     });
//     return Array.from(prints.values());
//   };

//   const getUniqueCutTypes = (): CutType[] => {
//     const cuts = new Map<string, CutType>();
//     variants.forEach(v => {
//       if (!cuts.has(v.cutType.name)) {
//         cuts.set(v.cutType.name, v.cutType);
//       }
//     });
//     return Array.from(cuts.values());
//   };

//   // Merge both image arrays
//   const allImages = [
//     ...(Array.isArray(product?.images) ? product.images : []),
//     ...(Array.isArray(product?.related_images) ? product.related_images : [])
//   ];

//   const handleAddToCart = async () => {
//     if (!uploadedFile || !selectedVariant || !selectedQuantity) return;

//     const formData = new FormData();
//     formData.append("product_id", "product.id");
//     formData.append("variant_id", selectedVariant.id);
//     formData.append("price_id", selectedQuantity);
//     formData.append("design_file", uploadedFile);

//     try {
//       await axios.post(`${API_BASE_URL}/api/cart/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       alert("Added to cart successfully!");
//       navigate("/cart");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to add to cart");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-[#D73D32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading product details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
//           <Button onClick={() => navigate(-1)} className="bg-[#D73D32] hover:bg-[#B83227]">
//             Go Back
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-2 text-gray-600 hover:text-[#D73D32] mb-6 transition-colors group"
//         >
//           <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//           <span>Back to Products</span>
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 items-start">

//           {/* ================= IMAGE SECTION ================= */}
//           <div className="lg:col-span-7 flex gap-4">

//             {/* Thumbnails - NO SCROLL */}
//             {allImages.length > 1 && (
//               <div className="flex flex-col gap-3">
//                 {allImages.map((image: any, idx: number) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImageIndex(idx)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
//                       ? 'border-[#D73D32] shadow-lg'
//                       : 'border-gray-200 hover:border-[#D73D32]/50'
//                       }`}
//                   >
//                     <img
//                       src={getImageUrl(image.url || image)}
//                       alt={`${product.name} ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Main Image */}
//             <div className="relative flex-1 max-w-[600px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl group">
//               <img
//                 src={getImageUrl(
//                   allImages[selectedImageIndex]?.url || allImages[selectedImageIndex]
//                 )}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.src = 'https://via.placeholder.com/600x600?text=No+Image';
//                 }}
//               />

//               {/* Zoom */}
//               <button
//                 onClick={() => setShowImageGallery(true)}
//                 className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
//               >
//                 <ZoomIn className="w-5 h-5 text-[#D73D32]" />
//               </button>

//               {/* Favorite */}
//               <button
//                 onClick={toggleFavorite}
//                 className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
//               >
//                 <Heart
//                   className={`w-5 h-5 transition-colors ${isFavorite
//                     ? 'fill-[#D73D32] text-[#D73D32]'
//                     : 'text-gray-600'
//                     }`}
//                 />
//               </button>

//               {/* Share */}
//               <button
//                 onClick={handleShare}
//                 className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
//               >
//                 <Share2 className="w-5 h-5 text-gray-600" />
//               </button>
//             </div>
//           </div>

//           {/* ================= PRODUCT DETAILS ================= */}
//           <div className="lg:col-span-5 space-y-6">

//             <div>
//               <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">
//                 {product.name}
//               </h1>

//               <div className="flex items-center gap-3">
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className={`w-4 h-4 ${i < Math.floor(Number(product.rating || 4.2))
//                         ? 'text-yellow-400 fill-yellow-400'
//                         : 'text-gray-300'
//                         }`}
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm font-semibold text-gray-700">
//                   {product.rating || 4.2} ({product.review_count || 90} Reviews)
//                 </span>
//               </div>
//             </div>

//             <Card className="p-5 bg-gradient-to-r from-[#D73D32]/5 to-[#B83227]/5">
//               <ul className="space-y-2 text-sm text-gray-700">
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>Available in {getUniqueSizes().length} size option(s)</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>{getUniquePaperTypes().length} paper type option(s)</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>{getUniquePrintTypes().length} print type option(s)</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>{getUniqueCutTypes().length} cut type option(s)</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>Choose single or double sided printing</span>
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-[#D73D32] font-bold">•</span>
//                   <span>Minimum order: {product.min_order_qty || 100} pieces</span>
//                 </li>
//               </ul>
//             </Card>

//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           <div className="space-y-4">
//             <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
//               Personalize Your Order
//             </h2>
//             <p className="text-sm text-gray-500 mb-6">
//               Select from available options to personalise your product
//             </p>

//             {/* Size Options */}
//             {getUniqueSizes().length > 0 && (
//               <div className="mb-6">
//                 <Label className="text-base font-semibold mb-3 block">Size:</Label>
//                 <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {getUniqueSizes().map((size) => (
//                       <div key={size.id}>
//                         <RadioGroupItem
//                           value={size.name}
//                           id={`size-${size.id}`}
//                           className="peer sr-only"
//                         />
//                         <Label
//                           htmlFor={`size-${size.id}`}
//                           className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSize === size.name
//                             ? "border-[#D73D32] bg-[#D73D32]/5"
//                             : "border-gray-200 hover:border-[#D73D32]/50"
//                             }`}
//                         >
//                           <span className="font-medium text-sm">{size.name}</span>
//                           {size.dimensions && (
//                             <span className="text-xs text-gray-500">
//                               {size.dimensions}
//                             </span>
//                           )}
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Paper Type */}
//             {getUniquePaperTypes().length > 0 && (
//               <div className="mb-6">
//                 <Label className="text-base font-semibold mb-3 block">
//                   Paper Type:
//                 </Label>
//                 <RadioGroup
//                   value={selectedPaperType}
//                   onValueChange={setSelectedPaperType}
//                 >
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {getUniquePaperTypes().map((paper) => (
//                       <div key={paper.id}>
//                         <RadioGroupItem
//                           value={paper.name}
//                           id={`paper-${paper.id}`}
//                           className="peer sr-only"
//                         />
//                         <Label
//                           htmlFor={`paper-${paper.id}`}
//                           className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPaperType === paper.name
//                             ? "border-[#D73D32] bg-[#D73D32]/5"
//                             : "border-gray-200 hover:border-[#D73D32]/50"
//                             }`}
//                         >
//                           <span className="font-medium text-sm">{paper.name}</span>
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Print Type */}
//             {getUniquePrintTypes().length > 0 && (
//               <div className="mb-6">
//                 <Label className="text-base font-semibold mb-3 block">
//                   Print Type:
//                 </Label>
//                 <RadioGroup
//                   value={selectedPrintType}
//                   onValueChange={setSelectedPrintType}
//                 >
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {getUniquePrintTypes().map((print) => (
//                       <div key={print.id}>
//                         <RadioGroupItem
//                           value={print.name}
//                           id={`print-${print.id}`}
//                           className="peer sr-only"
//                         />
//                         <Label
//                           htmlFor={`print-${print.id}`}
//                           className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPrintType === print.name
//                             ? "border-[#D73D32] bg-[#D73D32]/5"
//                             : "border-gray-200 hover:border-[#D73D32]/50"
//                             }`}
//                         >
//                           <span className="font-medium text-sm">{print.name}</span>
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Cut Type */}
//             {getUniqueCutTypes().length > 0 && (
//               <div className="mb-6">
//                 <Label className="text-base font-semibold mb-3 block">
//                   Cut Type:
//                 </Label>
//                 <RadioGroup value={selectedCutType} onValueChange={setSelectedCutType}>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {getUniqueCutTypes().map((cut) => (
//                       <div key={cut.id}>
//                         <RadioGroupItem
//                           value={cut.name}
//                           id={`cut-${cut.id}`}
//                           className="peer sr-only"
//                         />
//                         <Label
//                           htmlFor={`cut-${cut.id}`}
//                           className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedCutType === cut.name
//                             ? "border-[#D73D32] bg-[#D73D32]/5"
//                             : "border-gray-200 hover:border-[#D73D32]/50"
//                             }`}
//                         >
//                           <span className="font-medium text-sm">{cut.name}</span>
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Printing Sides */}
//             <div className="mb-6">
//               <Label className="text-base font-semibold mb-3 block">
//                 Printing Sides:
//               </Label>
//               <RadioGroup value={selectedSides} onValueChange={setSelectedSides}>
//                 <div className="grid grid-cols-2 gap-3">
//                   {sidesOptions.map((option) => (
//                     <div key={option.value}>
//                       <RadioGroupItem
//                         value={option.value}
//                         id={`sides-${option.value}`}
//                         className="peer sr-only"
//                       />
//                       <Label
//                         htmlFor={`sides-${option.value}`}
//                         className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSides === option.value
//                           ? "border-[#D73D32] bg-[#D73D32]/5"
//                           : "border-gray-200 hover:border-[#D73D32]/50"
//                           }`}
//                       >
//                         <span className="font-medium text-sm">{option.label}</span>
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </RadioGroup>
//             </div>

//             {/* ✅ FIXED Quantity Section */}
//             {/* Quantity Section */}
//             {selectedVariant && selectedVariant.prices && selectedVariant.prices.length > 0 && (
//               <div className="mb-6">
//                 <Label className="text-base font-semibold mb-3 block">
//                   Quantity:
//                 </Label>

//                 <RadioGroup
//                   value={selectedQuantity}
//                   onValueChange={(val) => setSelectedQuantity(val)}
//                 >
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {selectedVariant.prices.map((price) => (
//                       <div key={price.id}>
//                         <RadioGroupItem
//                           value={String(price.id)}
//                           id={`qty-${price.id}`}
//                           className="peer sr-only"
//                         />
//                         <Label
//                           htmlFor={`qty-${price.id}`}
//                           className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedQuantity === price.id
//                             ? "border-[#D73D32] bg-[#D73D32]/5"
//                             : "border-gray-200 hover:border-[#D73D32]/50"
//                             }`}
//                         >
//                           <span className="font-medium text-sm">
//                             {price.min_qty} - {price.max_qty} Pieces
//                           </span>
//                           <span className="text-[#D73D32] font-bold">
//                             ₹ {price.price.toFixed(2)}
//                           </span>
//                         </Label>
//                       </div>
//                     ))}
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}

//             {/* Total Price & CTA */}

//           </div>

//           <div className="space-y-6">

//             {/* LEFT CONTENT */}
//             <div className="lg:col-span-2 space-y-8">

//               {/* Variant Selection */}
//               {/* Upload Design Card */}
//               <UploadDesignCard
//                 sides={selectedSides}
//                 frontFile={frontFile}
//                 backFile={backFile}
//                 frontPreview={frontPreview}
//                 backPreview={backPreview}
//                 onUploadFront={handleFrontUpload}
//                 onUploadBack={handleBackUpload}
//                 onRemoveFront={() => {
//                   setFrontFile(null);
//                   setFrontPreview(null);
//                 }}
//                 onRemoveBack={() => {
//                   setBackFile(null);
//                   setBackPreview(null);
//                 }}
//               />
//               <div className="mt-8 flex justify-end">
//                 <Button
//                   onClick={handleUploadAndRedirect}
//                   disabled={
//                     !selectedVariant ||
//                     !selectedQuantity ||
//                     !frontFile ||
//                     (selectedSides === "2" && !backFile)
//                   }
//                   className="bg-[#D73D32] hover:bg-[#b83228] px-8 py-3 text-white rounded-xl"
//                 >
//                   Continue to Design Review
//                 </Button>
//               </div>
//             </div>

//             {/* RIGHT SIDE ORDER SUMMARY */}
//             <div>
//               <OrderSummaryCard
//                 productName={product.name}
//                 variant={selectedVariant}
//                 quantityId={selectedQuantity}
//                 totalPrice={totalPrice}
//                 uploadedFile={uploadedFile}
//                 onAddToCart={handleAddToCart}
//               />
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Image Gallery Modal */}
//       <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
//         <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95 rounded-3xl overflow-hidden">
//           <div className="relative w-full h-full flex flex-col">
//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-white font-bold text-2xl">{product.name}</h3>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowImageGallery(false)}
//                   className="text-white hover:bg-white/10 rounded-full"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </Button>
//               </div>
//             </div>

//             {/* Main Image */}
//             <div className="flex-1 flex items-center justify-center p-20">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="max-w-full max-h-full object-contain"
//               />
//             </div>

//             {/* Navigation */}
//             {allImages.length > 1 && (
//               <>
//                 <button
//                   onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
//                   className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={() => setSelectedImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
//                   className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Toaster />

//     </div>
//   );
// }


// import React, { useState, useEffect, useRef } from "react";
// import { useParams, useNavigate } from "react-router";
// import {
//   Star,
//   Heart,
//   Share2,
//   ChevronLeft,
//   ChevronRight,
//   ZoomIn,
//   Edit3,
//   PackageCheck,
//   Layers,
//   Scissors,
//   Printer,
// } from "lucide-react";
// import axios from "axios";
// import { Button } from "../../components/ui/button";
// import { Card } from "../../components/ui/card";
// import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
// import { Label } from "../../components/ui/label";
// import { Dialog, DialogContent } from "../../components/ui/dialog";
// import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
// import { getImageUrl, enrichProductData } from "../../utils/productutils";
// import { API_BASE_URL } from "../../constants/productconstants";
// import { UploadDesignCard } from "../../components/product/UploadDesignCard";
// import { OrderSummaryCard } from "../../components/product/OrderSummaryCard";
// import { useDesignUpload } from "../../hooks/useDesignUpload";
// import { Toaster } from "../ui/toaster";

// // ─── Interfaces ────────────────────────────────────────────────────────────────

// interface Size       { id: string; name: string; dimensions?: string }
// interface PaperType  { id: string; name: string; description?: string }
// interface PrintType  { id: string; name: string }
// interface CutType    { id: string; name: string }

// interface VariantOption {
//   id: string;
//   variantId: string;
//   size: Size;
//   paperType: PaperType;
//   printType: PrintType;
//   cutType: CutType;
//   sides: number;
//   twoSideCut: number;
//   fourSideCut: number;
//   orientation: string;
//   prices: VariantPrice[];
//   minPrice: number;
//   maxPrice: number;
// }

// interface ApiResponse { status: string; product: Product }

// // ─── Helpers ───────────────────────────────────────────────────────────────────

// const safeParse = (value: any): any[] => {
//   if (!value) return [];
//   try {
//     const parsed = typeof value === "string" ? JSON.parse(value) : value;
//     return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
//   } catch { return []; }
// };

// const SIDES_OPTIONS = [
//   { label: "Single Sided", value: "1" },
//   { label: "Double Sided", value: "2" },
// ];

// // ─── Component ─────────────────────────────────────────────────────────────────

// export function ProductDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // ── Data ──
//   const [product,  setProduct]  = useState<Product | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [variants, setVariants] = useState<VariantOption[]>([]);

//   // ── UI ──
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showImageGallery,   setShowImageGallery]   = useState(false);
//   const [isFavorite,         setIsFavorite]         = useState(false);

//   // ── Variant selectors ──
//   const [selectedSize,      setSelectedSize]      = useState("");
//   const [selectedPaperType, setSelectedPaperType] = useState("");
//   const [selectedPrintType, setSelectedPrintType] = useState("");
//   const [selectedCutType,   setSelectedCutType]   = useState("");
//   const [selectedSides,     setSelectedSides]     = useState("1");

//   // ── Quantity ──
//   // selectedQuantity stores the price-row UUID
//   const [selectedQuantity,  setSelectedQuantity]  = useState<string>("");
//   const [customQty,         setCustomQty]         = useState<string>("");
//   const [useCustomQty,      setUseCustomQty]      = useState(false);

//   // ── Derived ──
//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [totalPrice,      setTotalPrice]      = useState(0);

//   // ── Upload ──
//   const { uploadedFile } = useDesignUpload();
//   const [frontFile,    setFrontFile]    = useState<File | null>(null);
//   const [backFile,     setBackFile]     = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview,  setBackPreview]  = useState<string | null>(null);

//   // ── Fetch ──────────────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
//         const raw = res.data.product;
//         const parsed = { ...raw, images: safeParse(raw.images), related_images: safeParse(raw.related_images) };
//         setProduct(enrichProductData(parsed));
//         if (Array.isArray(raw.variants) && raw.variants.length > 0) {
//           initVariants(raw.variants);
//         }
//       } catch (e) {
//         console.error(e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   // ── Init variants ──────────────────────────────────────────────────────────

//   const initVariants = (variantData: ProductVariant[]) => {
//     const processed: VariantOption[] = variantData.map((v) => {
//       const prices = v.prices || [];
//       const vals   = prices.map((p: VariantPrice) => p.price);
//       return {
//         id: v.id, variantId: v.id,
//         size:      { id: v.size_id,       name: v.size_name       || "Standard" },
//         paperType: { id: v.paper_type_id,  name: v.paper_type_name || "Standard" },
//         printType: { id: v.print_type_id,  name: v.print_type_name || "Digital"  },
//         cutType:   { id: v.cut_type_id,    name: v.cut_type_name   || "Straight" },
//         sides:     v.sides        || 1,
//         twoSideCut:  v.two_side_cut  || 0,
//         fourSideCut: v.four_side_cut || 0,
//         orientation: v.orientation  || "Portrait",
//         prices,
//         minPrice: vals.length ? Math.min(...vals) : 0,
//         maxPrice: vals.length ? Math.max(...vals) : 0,
//       };
//     });

//     setVariants(processed);

//     const first = processed[0];
//     setSelectedSize(first.size.name);
//     setSelectedPaperType(first.paperType.name);
//     setSelectedPrintType(first.printType.name);
//     setSelectedCutType(first.cutType.name);
//     setSelectedSides(String(first.sides));
//     setSelectedVariant(first);

//     if (first.prices.length > 0) {
//       const fp = first.prices[0];
//       setSelectedQuantity(fp.id);
//       setTotalPrice(fp.price);
//     }
//   };

//   // ── Sync variant when selectors change ────────────────────────────────────

//   useEffect(() => {
//     if (!variants.length) return;

//     const match = variants.find(v =>
//       v.size.name       === selectedSize      &&
//       v.paperType.name  === selectedPaperType &&
//       v.printType.name  === selectedPrintType &&
//       v.cutType.name    === selectedCutType
//     ) ?? null;

//     setSelectedVariant(match);

//     if (match && match.prices.length > 0) {
//       const fp = match.prices[0];
//       setSelectedQuantity(fp.id);
//       setUseCustomQty(false);
//       setCustomQty("");
//       setTotalPrice(fp.price);
//     } else {
//       setTotalPrice(0);
//     }
//   }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, variants]);

//   // ── Sync price when quantity row changes ──────────────────────────────────

//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity || useCustomQty) return;
//     const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//     if (row) setTotalPrice(row.price);
//   }, [selectedQuantity, selectedVariant, useCustomQty]);

//   // ── Unique option helpers ──────────────────────────────────────────────────

//   const unique = <T extends { id: string; name: string }>(
//     selector: (v: VariantOption) => T
//   ): T[] => {
//     const map = new Map<string, T>();
//     variants.forEach(v => { const o = selector(v); if (!map.has(o.name)) map.set(o.name, o); });
//     return Array.from(map.values());
//   };

//   const uniqueSizes      = () => unique(v => v.size);
//   const uniquePaperTypes = () => unique(v => v.paperType);
//   const uniquePrintTypes = () => unique(v => v.printType);
//   const uniqueCutTypes   = () => unique(v => v.cutType);

//   // ── Images ────────────────────────────────────────────────────────────────

//   const allImages = [
//     ...(Array.isArray(product?.images) ? product!.images : []),
//     ...(Array.isArray(product?.related_images) ? product!.related_images : []),
//   ];

//   // ── Upload handlers ───────────────────────────────────────────────────────

//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setFrontFile(file);
//     setFrontPreview(URL.createObjectURL(file));
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setBackFile(file);
//     setBackPreview(URL.createObjectURL(file));
//   };

//   // ── Navigate to design review ─────────────────────────────────────────────

//   const handleContinue = () => {
//     if (!selectedVariant || !frontFile) return;
//     if (selectedSides === "2" && !backFile) { alert("Back design is required."); return; }

//     // Determine quantity number
//     let quantityNumber: number;
//     let unitPrice: number;

//     if (useCustomQty) {
//       const parsed = parseInt(customQty, 10);
//       if (isNaN(parsed) || parsed < 1) { alert("Please enter a valid quantity."); return; }
//       quantityNumber = parsed;
//       // Find best price tier for custom qty
//       const tier = selectedVariant.prices
//         .slice()
//         .sort((a, b) => b.min_qty - a.min_qty)
//         .find(p => parsed >= p.min_qty);
//       unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
//     } else {
//       const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//       if (!row) { alert("Please select a quantity."); return; }
//       quantityNumber = row.min_qty;
//       unitPrice      = row.price;
//     }

//     navigate("/design-review", {
//       state: {
//         product,
//         variant: selectedVariant,
//         quantity: quantityNumber,
//         priceId: useCustomQty ? null : selectedQuantity,
//         selected_options: {
//           size:       selectedVariant.size?.name      ?? "",
//           material:   selectedVariant.paperType?.name ?? "",
//           lamination: selectedVariant.printType?.name ?? "",
//         },
//         frontDesign:  frontFile,
//         backDesign:   selectedSides === "2" ? backFile : null,
//         frontPreview,
//         backPreview,
//         basePrice:  unitPrice,
//         totalPrice: unitPrice,
//         sides:      selectedSides,
//       }
//     });
//   };

//   const handleAddToCart = async () => {
//     if (!uploadedFile || !selectedVariant || !selectedQuantity) return;
//     const formData = new FormData();
//     formData.append("product_id", product?.id ?? "");
//     formData.append("variant_id",  selectedVariant.id);
//     formData.append("price_id",    selectedQuantity);
//     formData.append("design_file", uploadedFile);
//     try {
//       await axios.post(`${API_BASE_URL}/api/cart/add`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Added to cart!");
//       navigate("/cart");
//     } catch { alert("Failed to add to cart"); }
//   };

//   // ── Render ─────────────────────────────────────────────────────────────────

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center space-y-4">
//         <div className="w-14 h-14 border-4 border-[#D73D32] border-t-transparent rounded-full animate-spin mx-auto" />
//         <p className="text-gray-500 text-sm font-medium">Loading product…</p>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center space-y-4">
//         <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
//         <Button onClick={() => navigate(-1)} className="bg-[#D73D32] hover:bg-[#B83227]">Go Back</Button>
//       </div>
//     </div>
//   );

//   // ── Option card style helper ──
//   const optionCls = (active: boolean) =>
//     `flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium select-none
//      ${active
//        ? "border-[#D73D32] bg-[#D73D32]/5 text-[#D73D32] shadow-sm"
//        : "border-gray-200 text-gray-700 hover:border-[#D73D32]/40 hover:bg-gray-50"}`;

//   return (
//     <div className="min-h-screen bg-[#FAFAFA]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

//         {/* Back */}
//         <button
//           onClick={() => navigate(-1)}
//           className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#D73D32] mb-7 transition-colors group"
//         >
//           <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
//           Back to Products
//         </button>

//         {/* ═══════════ TOP ROW: Image + Info ═══════════ */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

//           {/* Images */}
//           <div className="lg:col-span-7 flex gap-3">
//             {allImages.length > 1 && (
//               <div className="flex flex-col gap-2.5">
//                 {allImages.map((img: any, idx: number) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelectedImageIndex(idx)}
//                     className={`w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all shrink-0
//                       ${selectedImageIndex === idx ? "border-[#D73D32] shadow-md" : "border-gray-200 hover:border-[#D73D32]/40"}`}
//                   >
//                     <img src={getImageUrl(img.url || img)} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg group">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
//                 onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600?text=No+Image"; }}
//               />
//               <button onClick={() => setShowImageGallery(true)}
//                 className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition-all hover:scale-110">
//                 <ZoomIn className="w-4 h-4 text-[#D73D32]" />
//               </button>
//               <button onClick={() => setIsFavorite(f => !f)}
//                 className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition-all hover:scale-110">
//                 <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-[#D73D32] text-[#D73D32]" : "text-gray-500"}`} />
//               </button>
//               <button onClick={() => { navigator.clipboard.writeText(window.location.href); }}
//                 className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition-all hover:scale-110">
//                 <Share2 className="w-4 h-4 text-gray-500" />
//               </button>
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="lg:col-span-5 space-y-5">
//             <div>
//               <p className="text-xs font-semibold text-[#D73D32] uppercase tracking-widest mb-1">
//                 {product.sku}
//               </p>
//               <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3">{product.name}</h1>
//               <div className="flex items-center gap-2">
//                 <div className="flex">
//                   {[...Array(5)].map((_, i) => (
//                     <Star key={i} className={`w-4 h-4 ${i < Math.floor(Number(product.rating || 4.2)) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-500">{product.rating || 4.2} ({product.review_count || 90} reviews)</span>
//               </div>
//             </div>

//             {/* Price badge */}
//             {selectedVariant && totalPrice > 0 && (
//               <div className="inline-flex items-baseline gap-1.5 bg-[#D73D32]/8 border border-[#D73D32]/20 rounded-xl px-4 py-2.5">
//                 <span className="text-xs text-gray-500 font-medium">From</span>
//                 <span className="text-3xl font-bold text-[#D73D32]">₹{totalPrice.toFixed(2)}</span>
//               </div>
//             )}

//             {/* Quick specs */}
//             <Card className="p-4 border-0 bg-white shadow-sm rounded-2xl">
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { icon: <Layers className="w-4 h-4" />,    label: "Sizes",       value: `${uniqueSizes().length} options`      },
//                   { icon: <PackageCheck className="w-4 h-4" />, label: "Paper",    value: `${uniquePaperTypes().length} types`   },
//                   { icon: <Printer className="w-4 h-4" />,   label: "Print",       value: `${uniquePrintTypes().length} types`   },
//                   { icon: <Scissors className="w-4 h-4" />,  label: "Cut",         value: `${uniqueCutTypes().length} types`     },
//                 ].map(({ icon, label, value }) => (
//                   <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
//                     <div className="text-[#D73D32]">{icon}</div>
//                     <div>
//                       <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
//                       <p className="text-sm font-semibold text-gray-800">{value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500 flex items-center gap-1.5">
//                 <PackageCheck className="w-4 h-4 text-green-500" />
//                 Min order: <span className="font-semibold text-gray-700">{product.min_order_qty || 100} pieces</span>
//               </div>
//             </Card>

//             {product.description && (
//               <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
//             )}
//           </div>
//         </div>

//         {/* ═══════════ BOTTOM ROW: Personalise + Upload + Summary ═══════════ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* ── Left: Options ── */}
//           <div className="space-y-7">
//             <div>
//               <h2 className="text-lg font-bold text-gray-900 mb-1">Personalise Your Order</h2>
//               <p className="text-sm text-gray-400">Choose from the available options below.</p>
//             </div>

//             {/* Size */}
//             {uniqueSizes().length > 0 && (
//               <Section label="Size">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniqueSizes().map(s => (
//                     <button key={s.id} onClick={() => setSelectedSize(s.name)} className={optionCls(selectedSize === s.name)}>
//                       <span>{s.name}</span>
//                       {s.dimensions && <span className="text-[10px] text-gray-400 mt-0.5">{s.dimensions}</span>}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {/* Paper Type */}
//             {uniquePaperTypes().length > 0 && (
//               <Section label="Paper Type">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniquePaperTypes().map(p => (
//                     <button key={p.id} onClick={() => setSelectedPaperType(p.name)} className={optionCls(selectedPaperType === p.name)}>
//                       {p.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {/* Print Type */}
//             {uniquePrintTypes().length > 0 && (
//               <Section label="Print Type">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniquePrintTypes().map(p => (
//                     <button key={p.id} onClick={() => setSelectedPrintType(p.name)} className={optionCls(selectedPrintType === p.name)}>
//                       {p.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {/* Cut Type */}
//             {uniqueCutTypes().length > 0 && (
//               <Section label="Cut Type">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniqueCutTypes().map(c => (
//                     <button key={c.id} onClick={() => setSelectedCutType(c.name)} className={optionCls(selectedCutType === c.name)}>
//                       {c.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {/* Sides */}
//             <Section label="Printing Sides">
//               <div className="grid grid-cols-2 gap-2.5">
//                 {SIDES_OPTIONS.map(o => (
//                   <button key={o.value} onClick={() => setSelectedSides(o.value)} className={optionCls(selectedSides === o.value)}>
//                     {o.label}
//                   </button>
//                 ))}
//               </div>
//             </Section>

//             {/* Quantity */}
//             {selectedVariant && selectedVariant.prices.length > 0 && (
//               <Section label="Quantity">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {selectedVariant.prices.map(price => (
//                     <button
//                       key={price.id}
//                       onClick={() => { setSelectedQuantity(price.id); setUseCustomQty(false); setCustomQty(""); }}
//                       className={optionCls(!useCustomQty && selectedQuantity === price.id)}
//                     >
//                       <span className="font-semibold">
//                         {/* API only provides min_qty; show just that */}
//                         {price.min_qty}{price.max_qty && price.max_qty !== price.min_qty ? `–${price.max_qty}` : "+"} pcs
//                       </span>
//                       <span className={`text-xs mt-0.5 font-bold ${!useCustomQty && selectedQuantity === price.id ? "text-[#D73D32]" : "text-gray-500"}`}>
//                         ₹{price.price.toFixed(2)}
//                       </span>
//                     </button>
//                   ))}

//                   {/* Custom quantity tile */}
//                   <button
//                     onClick={() => { setUseCustomQty(true); setSelectedQuantity(""); }}
//                     className={optionCls(useCustomQty)}
//                   >
//                     <Edit3 className="w-3.5 h-3.5 mb-0.5" />
//                     <span>Custom</span>
//                   </button>
//                 </div>

//                 {/* Custom qty input */}
//                 {useCustomQty && (
//                   <div className="mt-3 flex items-center gap-3">
//                     <div className="flex-1 relative">
//                       <input
//                         type="number"
//                         min="1"
//                         value={customQty}
//                         onChange={e => setCustomQty(e.target.value)}
//                         placeholder={`Min ${product.min_order_qty || 100} pieces`}
//                         className="w-full border-2 border-[#D73D32]/40 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D73D32] transition-colors"
//                       />
//                     </div>
//                     {customQty && parseInt(customQty) > 0 && (
//                       <div className="text-sm font-bold text-[#D73D32] whitespace-nowrap">
//                         ₹ {(() => {
//                           const qty = parseInt(customQty);
//                           const tier = selectedVariant.prices
//                             .slice()
//                             .sort((a, b) => b.min_qty - a.min_qty)
//                             .find(p => qty >= p.min_qty);
//                           return tier ? tier.price.toFixed(2) : "—";
//                         })()}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </Section>
//             )}
//           </div>

//           {/* ── Right: Upload + Summary ── */}
//           <div className="space-y-6">
//             <UploadDesignCard
//               sides={selectedSides}
//               frontFile={frontFile}
//               backFile={backFile}
//               frontPreview={frontPreview}
//               backPreview={backPreview}
//               onUploadFront={handleFrontUpload}
//               onUploadBack={handleBackUpload}
//               onRemoveFront={() => { setFrontFile(null); setFrontPreview(null); }}
//               onRemoveBack={() => { setBackFile(null); setBackPreview(null); }}
//             />

//             <Button
//               onClick={handleContinue}
//               disabled={
//                 !selectedVariant ||
//                 (!useCustomQty && !selectedQuantity) ||
//                 (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
//                 !frontFile ||
//                 (selectedSides === "2" && !backFile)
//               }
//               className="w-full bg-[#D73D32] hover:bg-[#b83228] text-white py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Continue to Design Review
//             </Button>

//             <OrderSummaryCard
//               productName={product.name}
//               variant={selectedVariant}
//               quantityId={useCustomQty ? undefined : selectedQuantity}
//               totalPrice={totalPrice}
//               uploadedFile={uploadedFile}
//               onAddToCart={handleAddToCart}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Image Gallery Modal */}
//       <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
//         <DialogContent className="max-w-5xl h-[88vh] p-0 bg-black/96 rounded-3xl overflow-hidden">
//           <div className="relative w-full h-full flex flex-col">
//             <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-5 flex justify-between items-center">
//               <h3 className="text-white font-bold text-xl">{product.name}</h3>
//               <button onClick={() => setShowImageGallery(false)} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition">✕</button>
//             </div>
//             <div className="flex-1 flex items-center justify-center p-20">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="max-w-full max-h-full object-contain rounded-xl"
//               />
//             </div>
//             {allImages.length > 1 && (
//               <>
//                 <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm">
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 backdrop-blur-sm">
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Toaster />
//     </div>
//   );
// }

// // ── Small helper component ──────────────────────────────────────────────────────

// function Section({ label, children }: { label: string; children: React.ReactNode }) {
//   return (
//     <div>
//       <p className="text-sm font-semibold text-gray-700 mb-2.5">{label}</p>
//       {children}
//     </div>
//   );
// }



// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router";
// import {
//   Star, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn,
//   Edit3, PackageCheck, Layers, Scissors, Printer, Check,
//   Info, FileText, MessageSquare, Truck, ShieldCheck, RefreshCw,
//   Clock, CheckCheck, AlertCircle, X,
// } from "lucide-react";
// import { ChevronRight as BreadcrumbArrow } from "lucide-react";
// import axios from "axios";
// import { Button } from "../../components/ui/button";
// import { Card } from "../../components/ui/card";
// import { Dialog, DialogContent } from "../../components/ui/dialog";
// import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
// import { getImageUrl, enrichProductData } from "../../utils/productutils";
// import { API_BASE_URL } from "../../constants/productconstants";
// import { UploadDesignCard } from "../../components/product/UploadDesignCard";
// import { OrderSummaryCard } from "../../components/product/OrderSummaryCard";
// import { useDesignUpload } from "../../hooks/useDesignUpload";

// // ─── Types ─────────────────────────────────────────────────────────────────────

// interface Size      { id: string; name: string; dimensions?: string }
// interface PaperType { id: string; name: string; description?: string }
// interface PrintType { id: string; name: string }
// interface CutType   { id: string; name: string }

// interface VariantOption {
//   id: string;
//   variantId: string;
//   size: Size;
//   paperType: PaperType;
//   printType: PrintType;
//   cutType: CutType;
//   sides: number;
//   twoSideCut: number;
//   fourSideCut: number;
//   orientation: string;
//   prices: VariantPrice[];
//   minPrice: number;
//   maxPrice: number;
// }

// interface ApiResponse { status: string; product: Product }
// type TabId = "details" | "specs" | "reviews";

// // ─── Constants ─────────────────────────────────────────────────────────────────

// const safeParse = (value: any): any[] => {
//   if (!value) return [];
//   try {
//     const parsed = typeof value === "string" ? JSON.parse(value) : value;
//     return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
//   } catch { return []; }
// };

// const SIDES_OPTIONS = [
//   { label: "Single Sided", value: "1", desc: "Print on front only"  },
//   { label: "Double Sided", value: "2", desc: "Print on both sides"  },
// ];

// const MOCK_REVIEWS = [
//   { id: 1, name: "Ravi Kumar",   rating: 5, date: "Feb 2026", text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again." },
//   { id: 2, name: "Priya Sharma", rating: 4, date: "Jan 2026", text: "Good quality cards, delivered on time. Slight delay but overall happy with the result." },
//   { id: 3, name: "Arjun Mehta",  rating: 5, date: "Dec 2025", text: "Very professional finish. The Gloss paper option looks premium. Highly recommend." },
// ];

// const TRUST_BADGES = [
//   { icon: <Truck className="w-4 h-4" />,       label: "Fast Delivery",    sub: "3–5 business days"   },
//   { icon: <ShieldCheck className="w-4 h-4" />, label: "Quality Assured",  sub: "100% satisfaction"   },
//   { icon: <RefreshCw className="w-4 h-4" />,   label: "Easy Reorder",     sub: "Save your design"    },
//   { icon: <Clock className="w-4 h-4" />,       label: "Quick Turnaround", sub: "Same-day processing" },
// ];

// const STEPS = ["Choose Options", "Upload Design", "Review & Order"];

// // ─── Sub-components ─────────────────────────────────────────────────────────────

// function StepProgress({ current }: { current: number }) {
//   return (
//     <div className="flex items-center gap-0 mb-8">
//       {STEPS.map((step, i) => (
//         <React.Fragment key={step}>
//           <div className="flex items-center gap-2">
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
//               ${i < current   ? "bg-[#D73D32] border-[#D73D32] text-white"
//               : i === current ? "border-[#D73D32] text-[#D73D32] bg-white"
//               :                 "border-gray-200 text-gray-400 bg-white"}`}>
//               {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
//             </div>
//             <span className={`text-xs font-medium hidden sm:block ${i === current ? "text-gray-900" : "text-gray-400"}`}>
//               {step}
//             </span>
//           </div>
//           {i < STEPS.length - 1 && (
//             <div className={`flex-1 h-[2px] mx-2 rounded-full transition-all ${i < current ? "bg-[#D73D32]" : "bg-gray-200"}`} />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// interface ToastMsg { id: number; type: "success" | "error" | "info"; text: string }

// function useToast() {
//   const [toasts, setToasts] = useState<ToastMsg[]>([]);
//   const show = useCallback((type: ToastMsg["type"], text: string) => {
//     const id = Date.now();
//     setToasts(t => [...t, { id, type, text }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
//   }, []);
//   const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);
//   return { toasts, show, dismiss };
// }

// function ToastStack({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: number) => void }) {
//   if (!toasts.length) return null;
//   return (
//     <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 lg:bottom-6">
//       {toasts.map(t => (
//         <div key={t.id}
//           className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white max-w-xs
//             ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-gray-800"}`}>
//           {t.type === "success" ? <CheckCheck className="w-4 h-4 shrink-0" />
//            : t.type === "error"  ? <AlertCircle className="w-4 h-4 shrink-0" />
//            :                       <Info className="w-4 h-4 shrink-0" />}
//           <span className="flex-1">{t.text}</span>
//           <button onClick={() => onDismiss(t.id)} className="opacity-70 hover:opacity-100 transition-opacity">
//             <X className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// function Section({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-2.5">
//       <div className="flex items-center gap-2">
//         <p className="text-sm font-semibold text-gray-800">{label}</p>
//         {hint && (
//           <span className="group relative cursor-help">
//             <Info className="w-3.5 h-3.5 text-gray-400" />
//             <span className="absolute left-5 -top-1 w-52 text-xs bg-gray-900 text-white px-2.5 py-1.5 rounded-lg
//               opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg leading-relaxed">
//               {hint}
//             </span>
//           </span>
//         )}
//       </div>
//       {children}
//     </div>
//   );
// }

// function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
//   const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
//   return (
//     <div className="flex gap-0.5">
//       {[...Array(5)].map((_, i) => (
//         <Star key={i} className={`${cls} ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
//       ))}
//     </div>
//   );
// }

// // ─── Main Component ────────────────────────────────────────────────────────────

// export function ProductDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { toasts, show: showToast, dismiss } = useToast();

//   // Data
//   const [product,  setProduct]  = useState<Product | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [variants, setVariants] = useState<VariantOption[]>([]);

//   // UI
//   const [activeTab,          setActiveTab]          = useState<TabId>("details");
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showImageGallery,   setShowImageGallery]   = useState(false);
//   const [isFavorite,         setIsFavorite]         = useState(false);
//   const [copied,             setCopied]             = useState(false);

//   // Variant selectors
//   const [selectedSize,      setSelectedSize]      = useState("");
//   const [selectedPaperType, setSelectedPaperType] = useState("");
//   const [selectedPrintType, setSelectedPrintType] = useState("");
//   const [selectedCutType,   setSelectedCutType]   = useState("");
//   const [selectedSides,     setSelectedSides]     = useState("1");

//   // Quantity
//   const [selectedQuantity, setSelectedQuantity] = useState<string>("");
//   const [customQty,        setCustomQty]        = useState<string>("");
//   const [useCustomQty,     setUseCustomQty]     = useState(false);

//   // Derived
//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [totalPrice,      setTotalPrice]      = useState(0);

//   // Upload
//   const { uploadedFile } = useDesignUpload();
//   const [frontFile,    setFrontFile]    = useState<File | null>(null);
//   const [backFile,     setBackFile]     = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview,  setBackPreview]  = useState<string | null>(null);

//   // ── Step ──
//   const currentStep = useMemo(() => {
//     if (!selectedVariant || !selectedQuantity) return 0;
//     if (!frontFile) return 1;
//     return 2;
//   }, [selectedVariant, selectedQuantity, frontFile]);

//   // ── Fetch ────────────────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
//         const raw = res.data.product;
//         const parsed = { ...raw, images: safeParse(raw.images), related_images: safeParse(raw.related_images) };
//         setProduct(enrichProductData(parsed));
//         if (Array.isArray(raw.variants) && raw.variants.length > 0) initVariants(raw.variants);
//       } catch {
//         showToast("error", "Failed to load product. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   // ── Init variants ─────────────────────────────────────────────────────────────

//   const initVariants = (variantData: ProductVariant[]) => {
//     const processed: VariantOption[] = variantData.map(v => {
//       const prices = v.prices || [];
//       const vals   = prices.map((p: VariantPrice) => p.price);
//       return {
//         id: v.id, variantId: v.id,
//         size:      { id: v.size_id,       name: v.size_name       || "Standard" },
//         paperType: { id: v.paper_type_id,  name: v.paper_type_name || "Standard" },
//         printType: { id: v.print_type_id,  name: v.print_type_name || "Digital"  },
//         cutType:   { id: v.cut_type_id,    name: v.cut_type_name   || "Straight" },
//         sides:       v.sides        || 1,
//         twoSideCut:  v.two_side_cut  || 0,
//         fourSideCut: v.four_side_cut || 0,
//         orientation: v.orientation  || "Portrait",
//         prices,
//         minPrice: vals.length ? Math.min(...vals) : 0,
//         maxPrice: vals.length ? Math.max(...vals) : 0,
//       };
//     });
//     setVariants(processed);
//     const first = processed[0];
//     setSelectedSize(first.size.name);
//     setSelectedPaperType(first.paperType.name);
//     setSelectedPrintType(first.printType.name);
//     setSelectedCutType(first.cutType.name);
//     setSelectedSides(String(first.sides));
//     setSelectedVariant(first);
//     if (first.prices.length > 0) {
//       setSelectedQuantity(first.prices[0].id);
//       setTotalPrice(first.prices[0].price);
//     }
//   };

//   // ── Sync variant ──────────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!variants.length) return;
//     const match = variants.find(v =>
//       v.size.name      === selectedSize      &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType &&
//       v.cutType.name   === selectedCutType
//     ) ?? null;
//     setSelectedVariant(match);
//     if (match?.prices.length) {
//       setSelectedQuantity(match.prices[0].id);
//       setUseCustomQty(false);
//       setCustomQty("");
//       setTotalPrice(match.prices[0].price);
//     } else {
//       setTotalPrice(0);
//     }
//   }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, variants]);

//   // ── Sync price ────────────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity || useCustomQty) return;
//     const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//     if (row) setTotalPrice(row.price);
//   }, [selectedQuantity, selectedVariant, useCustomQty]);

//   // ── Unique helpers ────────────────────────────────────────────────────────────

//   const uniqueBy = <T extends { id: string; name: string }>(sel: (v: VariantOption) => T, deps: VariantOption[]): T[] => {
//     const map = new Map<string, T>();
//     deps.forEach(v => { const o = sel(v); if (!map.has(o.name)) map.set(o.name, o); });
//     return Array.from(map.values());
//   };

//   const uniqueSizes      = useMemo(() => uniqueBy(v => v.size,      variants), [variants]);
//   const uniquePaperTypes = useMemo(() => uniqueBy(v => v.paperType, variants), [variants]);
//   const uniquePrintTypes = useMemo(() => uniqueBy(v => v.printType, variants), [variants]);
//   const uniqueCutTypes   = useMemo(() => uniqueBy(v => v.cutType,   variants), [variants]);

//   // ── Images ────────────────────────────────────────────────────────────────────

//   const allImages = useMemo(() => [
//     ...(Array.isArray(product?.images)         ? product!.images         : []),
//     ...(Array.isArray(product?.related_images) ? product!.related_images : []),
//   ], [product]);

//   // ── Handlers ──────────────────────────────────────────────────────────────────

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     showToast("success", "Link copied to clipboard!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleFavorite = () => {
//     setIsFavorite(f => !f);
//     showToast("info", isFavorite ? "Removed from wishlist" : "Added to wishlist ♥");
//   };

//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setFrontFile(file); setFrontPreview(URL.createObjectURL(file));
//     showToast("success", "Front design uploaded!");
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setBackFile(file); setBackPreview(URL.createObjectURL(file));
//     showToast("success", "Back design uploaded!");
//   };

//   const handleContinue = () => {
//     if (!selectedVariant || !frontFile) return;
//     if (selectedSides === "2" && !backFile) { showToast("error", "Back design required for double-sided."); return; }

//     let quantityNumber: number;
//     let unitPrice: number;

//     if (useCustomQty) {
//       const parsed = parseInt(customQty, 10);
//       if (isNaN(parsed) || parsed < 1) { showToast("error", "Please enter a valid quantity."); return; }
//       quantityNumber = parsed;
//       const tier = selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty).find(p => parsed >= p.min_qty);
//       unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
//     } else {
//       const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//       if (!row) { showToast("error", "Please select a quantity."); return; }
//       quantityNumber = row.min_qty;
//       unitPrice      = row.price;
//     }

//     navigate("/design-review", {
//       state: {
//         product, variant: selectedVariant,
//         quantity: quantityNumber,
//         priceId: useCustomQty ? null : selectedQuantity,
//         selected_options: {
//           size:       selectedVariant.size?.name      ?? "",
//           material:   selectedVariant.paperType?.name ?? "",
//           lamination: selectedVariant.printType?.name ?? "",
//         },
//         frontDesign: frontFile,
//         backDesign:  selectedSides === "2" ? backFile : null,
//         frontPreview, backPreview,
//         basePrice: unitPrice, totalPrice: unitPrice,
//         sides: selectedSides,
//       }
//     });
//   };

//   const handleAddToCart = async () => {
//     if (!uploadedFile || !selectedVariant || !selectedQuantity) return;
//     const formData = new FormData();
//     formData.append("product_id",  product?.id ?? "");
//     formData.append("variant_id",  selectedVariant.id);
//     formData.append("price_id",    selectedQuantity);
//     formData.append("design_file", uploadedFile);
//     try {
//       await axios.post(`${API_BASE_URL}/api/cart/add`, formData, { headers: { "Content-Type": "multipart/form-data" } });
//       showToast("success", "Added to cart successfully!");
//       navigate("/cart");
//     } catch { showToast("error", "Failed to add to cart. Please try again."); }
//   };

//   // ── Computed ──────────────────────────────────────────────────────────────────

//   const customQtyPrice = useMemo(() => {
//     if (!selectedVariant || !customQty) return null;
//     const qty = parseInt(customQty, 10);
//     if (isNaN(qty) || qty < 1) return null;
//     return selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty).find(p => qty >= p.min_qty)?.price ?? null;
//   }, [customQty, selectedVariant]);

//   const ctaDisabled =
//     !selectedVariant ||
//     (!useCustomQty && !selectedQuantity) ||
//     (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
//     !frontFile ||
//     (selectedSides === "2" && !backFile);

//   // ── Style helpers ─────────────────────────────────────────────────────────────

//   const optionCls = (active: boolean) =>
//     `flex flex-col items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium select-none
//      ${active
//        ? "border-[#D73D32] bg-[#D73D32]/5 text-[#D73D32] shadow-sm scale-[1.01]"
//        : "border-gray-200 text-gray-700 hover:border-[#D73D32]/40 hover:bg-gray-50 hover:scale-[1.01]"}`;

//   const tabCls = (t: TabId) =>
//     `flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap
//      ${activeTab === t ? "border-[#D73D32] text-[#D73D32]" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`;

//   // ─── Guards ───────────────────────────────────────────────────────────────────

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
//       <div className="text-center space-y-4">
//         <div className="relative w-14 h-14 mx-auto">
//           <div className="absolute inset-0 rounded-full border-4 border-[#D73D32]/20" />
//           <div className="absolute inset-0 rounded-full border-4 border-[#D73D32] border-t-transparent animate-spin" />
//         </div>
//         <p className="text-gray-500 text-sm font-medium">Loading product…</p>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
//       <div className="text-center space-y-4">
//         <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto">
//           <AlertCircle className="w-10 h-10 text-[#D73D32]" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
//         <p className="text-sm text-gray-500">This product may have been removed.</p>
//         <Button onClick={() => navigate(-1)} className="bg-[#D73D32] hover:bg-[#B83227] rounded-xl px-6">← Back</Button>
//       </div>
//     </div>
//   );

//   // ─── Render ───────────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-[#F7F7F8]">

//       {/* Breadcrumb */}
//       <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-1 text-xs text-gray-500 overflow-x-auto">
//           <button onClick={() => navigate("/")}         className="hover:text-[#D73D32] transition-colors font-medium shrink-0">Home</button>
//           <BreadcrumbArrow className="w-3 h-3 text-gray-300 shrink-0" />
//           <button onClick={() => navigate("/products")} className="hover:text-[#D73D32] transition-colors font-medium shrink-0">Products</button>
//           <BreadcrumbArrow className="w-3 h-3 text-gray-300 shrink-0" />
//           <span className="text-gray-800 font-semibold truncate">{product.name}</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10">

//         {/* Step progress */}
//         <StepProgress current={currentStep} />

//         {/* ═══ TOP ROW: Image + Info ═══ */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-8">

//           {/* Images */}
//           <div className="lg:col-span-6 flex gap-3">
//             {allImages.length > 1 && (
//               <div className="flex flex-col gap-2 shrink-0">
//                 {allImages.map((img: any, idx: number) => (
//                   <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                     className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
//                       ${selectedImageIndex === idx
//                         ? "border-[#D73D32] shadow-md ring-2 ring-[#D73D32]/20"
//                         : "border-gray-200 hover:border-[#D73D32]/40 opacity-70 hover:opacity-100"}`}>
//                     <img src={getImageUrl(img.url || img)} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div className="relative flex-1 rounded-2xl overflow-hidden bg-white shadow-md group aspect-square">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
//                 onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600?text=No+Image"; }}
//               />
//               <button onClick={handleShare}
//                 className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition-all hover:scale-110">
//                 {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-gray-600" />}
//               </button>
//               <button onClick={handleFavorite}
//                 className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow hover:bg-white transition-all hover:scale-110">
//                 <Heart className={`w-4 h-4 transition-colors ${isFavorite ? "fill-[#D73D32] text-[#D73D32]" : "text-gray-500"}`} />
//               </button>
//               <button onClick={() => setShowImageGallery(true)}
//                 className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow hover:bg-white transition-all flex items-center gap-1.5 text-xs font-medium text-gray-700">
//                 <ZoomIn className="w-3.5 h-3.5 text-[#D73D32]" /> View Full
//               </button>
//               {allImages.length > 1 && (
//                 <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
//                   {selectedImageIndex + 1} / {allImages.length}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Product info */}
//           <div className="lg:col-span-6 space-y-4">
//             <div>
//               <div className="flex items-center gap-2 mb-1.5">
//                 <span className="text-[10px] font-bold text-[#D73D32] uppercase tracking-widest bg-[#D73D32]/8 px-2 py-0.5 rounded-full border border-[#D73D32]/20">
//                   {product.sku}
//                 </span>
//                 <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
//                   In Stock
//                 </span>
//               </div>
//               <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
//             </div>

//             {/* Rating */}
//             <div className="flex items-center gap-3 flex-wrap">
//               <Stars rating={Number(product.rating || 4.2)} size="md" />
//               <span className="text-sm font-bold text-gray-700">{product.rating || 4.2}</span>
//               <span className="text-sm text-gray-400">({product.review_count || 90} reviews)</span>
//               <button onClick={() => setActiveTab("reviews")}
//                 className="text-xs text-[#D73D32] underline underline-offset-2 font-semibold hover:no-underline transition-all">
//                 Read all
//               </button>
//             </div>

//             {/* Price panel */}
//             <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
//               <div>
//                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Price</p>
//                 <div className="flex items-baseline gap-1.5">
//                   <span className="text-3xl font-bold text-[#D73D32]">
//                     ₹{totalPrice > 0 ? totalPrice.toFixed(2) : (selectedVariant?.minPrice ?? 0).toFixed(2)}
//                   </span>
//                   {selectedVariant && (
//                     <span className="text-xs text-gray-400 font-medium">
//                       / {useCustomQty
//                         ? `${customQty || "—"} pcs`
//                         : (() => { const r = selectedVariant.prices.find(p => p.id === selectedQuantity); return r ? `${r.min_qty}+ pcs` : "selected qty"; })()}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               {selectedVariant && selectedVariant.minPrice !== selectedVariant.maxPrice && (
//                 <div className="ml-auto text-right border-l border-gray-100 pl-4">
//                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Range</p>
//                   <p className="text-sm font-bold text-gray-600">
//                     ₹{selectedVariant.minPrice.toFixed(0)} – ₹{selectedVariant.maxPrice.toFixed(0)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Spec grid */}
//             <div className="grid grid-cols-2 gap-2">
//               {[
//                 { icon: <Layers className="w-3.5 h-3.5" />,      label: "Sizes",  value: `${uniqueSizes.length} options`      },
//                 { icon: <PackageCheck className="w-3.5 h-3.5" />, label: "Paper",  value: `${uniquePaperTypes.length} types`   },
//                 { icon: <Printer className="w-3.5 h-3.5" />,      label: "Print",  value: `${uniquePrintTypes.length} types`   },
//                 { icon: <Scissors className="w-3.5 h-3.5" />,     label: "Cut",    value: `${uniqueCutTypes.length} types`     },
//               ].map(({ icon, label, value }) => (
//                 <div key={label} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-gray-100">
//                   <div className="p-1.5 rounded-lg bg-[#D73D32]/8 text-[#D73D32]">{icon}</div>
//                   <div>
//                     <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
//                     <p className="text-xs font-bold text-gray-800">{value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Min order */}
//             <div className="flex items-center gap-2 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
//               <PackageCheck className="w-4 h-4 text-amber-500 shrink-0" />
//               <span>Minimum order: <strong className="text-gray-800">{product.min_order_qty || 100} pieces</strong></span>
//             </div>

//             {/* Trust badges */}
//             <div className="grid grid-cols-2 gap-3">
//               {TRUST_BADGES.map(b => (
//                 <div key={b.label} className="flex items-center gap-2">
//                   <div className="p-1.5 rounded-lg bg-gray-100 text-[#D73D32]">{b.icon}</div>
//                   <div>
//                     <p className="text-xs font-bold text-gray-800 leading-none mb-0.5">{b.label}</p>
//                     <p className="text-[10px] text-gray-400">{b.sub}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ═══ TABS ═══ */}
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
//           <div className="flex border-b border-gray-100 px-4 overflow-x-auto gap-0">
//             {([
//               { id: "details" as TabId, icon: <Info className="w-3.5 h-3.5" />,          label: "Details"  },
//               { id: "specs"   as TabId, icon: <FileText className="w-3.5 h-3.5" />,       label: "Specs"    },
//               { id: "reviews" as TabId, icon: <MessageSquare className="w-3.5 h-3.5" />,  label: `Reviews (${product.review_count || 90})` },
//             ]).map(tab => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabCls(tab.id)}>
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="p-5 lg:p-6">
//             {/* Details */}
//             {activeTab === "details" && (
//               <div className="space-y-4 max-w-2xl">
//                 <p className="text-gray-600 leading-relaxed text-sm">
//                   {product.description || "Premium quality printing with vibrant colours and sharp detail. Perfect for business cards, promotional materials, and professional use."}
//                 </p>
//                 <div className="grid sm:grid-cols-2 gap-0 border border-gray-100 rounded-xl overflow-hidden">
//                   {[
//                     { label: "Product Name",   value: product.name },
//                     { label: "SKU",            value: product.sku  },
//                     { label: "Min Order",      value: `${product.min_order_qty || 100} pcs` },
//                     { label: "Max Order",      value: `${product.max_order_qty || 1000} pcs` },
//                     { label: "Orientation",    value: selectedVariant?.orientation || "Portrait" },
//                     { label: "Available Since",value: new Date(product.created_at || "").toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
//                   ].map(({ label, value }, i) => (
//                     <div key={label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"} border-b border-gray-100 last:border-0`}>
//                       <span className="text-gray-500 font-medium">{label}</span>
//                       <span className="text-gray-800 font-semibold text-right">{value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Specs */}
//             {activeTab === "specs" && (
//               <div>
//                 <p className="text-sm text-gray-500 mb-4">All available variant combinations and pricing.</p>
//                 <div className="overflow-x-auto rounded-xl border border-gray-100">
//                   <table className="w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         {["Size", "Paper", "Print", "Cut", "Sides", "Min Qty", "Price"].map(h => (
//                           <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-50">
//                       {variants.flatMap(v => v.prices.map(p => (
//                         <tr key={`${v.id}-${p.id}`}
//                           className={`transition-colors hover:bg-[#D73D32]/3 ${
//                             selectedVariant?.id === v.id && selectedQuantity === p.id ? "bg-[#D73D32]/5" : ""}`}>
//                           <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{v.size.name}</td>
//                           <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.paperType.name}</td>
//                           <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.printType.name}</td>
//                           <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{v.cutType.name}</td>
//                           <td className="px-4 py-3 text-gray-600">{v.sides === 1 ? "Single" : "Double"}</td>
//                           <td className="px-4 py-3 text-gray-600">{p.min_qty}+</td>
//                           <td className="px-4 py-3 font-bold text-[#D73D32]">₹{p.price.toFixed(2)}</td>
//                         </tr>
//                       )))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* Reviews */}
//             {activeTab === "reviews" && (
//               <div className="space-y-5">
//                 <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-xl">
//                   <div className="text-center shrink-0">
//                     <p className="text-5xl font-bold text-gray-900 leading-none">{product.rating || 4.2}</p>
//                     <Stars rating={Number(product.rating || 4.2)} size="md" />
//                     <p className="text-xs text-gray-500 mt-1.5">{product.review_count || 90} reviews</p>
//                   </div>
//                   <div className="flex-1 space-y-1.5">
//                     {[5, 4, 3, 2, 1].map(star => {
//                       const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
//                       return (
//                         <div key={star} className="flex items-center gap-2 text-xs">
//                           <span className="text-gray-500 w-2 shrink-0">{star}</span>
//                           <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
//                           <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                             <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
//                           </div>
//                           <span className="text-gray-400 w-8 text-right shrink-0">{pct}%</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {MOCK_REVIEWS.map(r => (
//                     <div key={r.id} className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D73D32] to-[#ff7a72] flex items-center justify-center text-white text-sm font-bold shrink-0">
//                             {r.name[0]}
//                           </div>
//                           <div>
//                             <p className="text-sm font-bold text-gray-800">{r.name}</p>
//                             <p className="text-[10px] text-gray-400">{r.date}</p>
//                           </div>
//                         </div>
//                         <Stars rating={r.rating} />
//                       </div>
//                       <p className="text-xs text-gray-600 leading-relaxed">{r.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ═══ BOTTOM ROW ═══ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* Left: Personalise */}
//           <div className="space-y-6">
//             <div className="flex items-start justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-gray-900">Personalise Your Order</h2>
//                 <p className="text-sm text-gray-400 mt-0.5">Select all options to configure your product.</p>
//               </div>
//               {selectedVariant && (
//                 <div className="text-right shrink-0 ml-3">
//                   <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold">Active</p>
//                   <p className="text-xs font-bold text-[#D73D32] leading-snug">{selectedVariant.size.name}<br />{selectedVariant.paperType.name}</p>
//                 </div>
//               )}
//             </div>

//             {uniqueSizes.length > 0 && (
//               <Section label="Size" hint="Physical dimensions of the printed card">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniqueSizes.map(s => (
//                     <button key={s.id} onClick={() => setSelectedSize(s.name)} className={optionCls(selectedSize === s.name)}>
//                       <span className="font-bold">{s.name}</span>
//                       {s.dimensions && <span className="text-[10px] text-gray-400 mt-0.5">{s.dimensions}</span>}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {uniquePaperTypes.length > 0 && (
//               <Section label="Paper Type" hint="Material and finish of the paper used">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniquePaperTypes.map(p => (
//                     <button key={p.id} onClick={() => setSelectedPaperType(p.name)} className={optionCls(selectedPaperType === p.name)}>
//                       {p.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {uniquePrintTypes.length > 0 && (
//               <Section label="Print Type" hint="Printing technology used for production">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniquePrintTypes.map(p => (
//                     <button key={p.id} onClick={() => setSelectedPrintType(p.name)} className={optionCls(selectedPrintType === p.name)}>
//                       {p.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             {uniqueCutTypes.length > 0 && (
//               <Section label="Cut Type" hint="Edge finishing style of the final card">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {uniqueCutTypes.map(c => (
//                     <button key={c.id} onClick={() => setSelectedCutType(c.name)} className={optionCls(selectedCutType === c.name)}>
//                       {c.name}
//                     </button>
//                   ))}
//                 </div>
//               </Section>
//             )}

//             <Section label="Printing Sides">
//               <div className="grid grid-cols-2 gap-2.5">
//                 {SIDES_OPTIONS.map(o => (
//                   <button key={o.value} onClick={() => setSelectedSides(o.value)} className={optionCls(selectedSides === o.value)}>
//                     <span className="font-bold">{o.label}</span>
//                     <span className="text-[10px] text-gray-400 mt-0.5">{o.desc}</span>
//                   </button>
//                 ))}
//               </div>
//             </Section>

//             {selectedVariant && selectedVariant.prices.length > 0 && (
//               <Section label="Quantity" hint="Choose a preset tier or type a custom amount">
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
//                   {selectedVariant.prices.map(price => (
//                     <button key={price.id}
//                       onClick={() => { setSelectedQuantity(price.id); setUseCustomQty(false); setCustomQty(""); }}
//                       className={optionCls(!useCustomQty && selectedQuantity === price.id)}>
//                       <span className="font-bold text-sm">
//                         {price.min_qty}{price.max_qty && price.max_qty !== price.min_qty ? `–${price.max_qty}` : "+"} pcs
//                       </span>
//                       <span className={`text-xs font-bold mt-0.5 ${!useCustomQty && selectedQuantity === price.id ? "text-[#D73D32]" : "text-gray-500"}`}>
//                         ₹{price.price.toFixed(2)}
//                       </span>
//                     </button>
//                   ))}
//                   <button onClick={() => { setUseCustomQty(true); setSelectedQuantity(""); }} className={optionCls(useCustomQty)}>
//                     <Edit3 className="w-3.5 h-3.5 mb-0.5" />
//                     <span className="font-bold">Custom</span>
//                     <span className="text-[10px] text-gray-400 mt-0.5">Enter qty</span>
//                   </button>
//                 </div>

//                 {useCustomQty && (
//                   <div className="mt-3 space-y-2">
//                     <div className="flex items-center gap-3">
//                       <input
//                         type="number"
//                         min={product.min_order_qty || 1}
//                         value={customQty}
//                         onChange={e => setCustomQty(e.target.value)}
//                         placeholder={`Min ${product.min_order_qty || 100} pieces`}
//                         className="flex-1 border-2 border-[#D73D32]/40 focus:border-[#D73D32] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors bg-white"
//                       />
//                       {customQtyPrice !== null && (
//                         <div className="shrink-0 text-center px-3 py-2 bg-[#D73D32]/5 rounded-xl border border-[#D73D32]/20">
//                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Price</p>
//                           <p className="text-base font-bold text-[#D73D32]">₹{customQtyPrice.toFixed(2)}</p>
//                         </div>
//                       )}
//                     </div>
//                     {customQty && parseInt(customQty) < (product.min_order_qty || 100) && parseInt(customQty) > 0 && (
//                       <p className="text-xs text-amber-600 flex items-center gap-1.5">
//                         <AlertCircle className="w-3.5 h-3.5 shrink-0" />
//                         Minimum order is {product.min_order_qty || 100} pieces.
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </Section>
//             )}
//           </div>

//           {/* Right: Upload + Summary */}
//           <div className="space-y-5">
//             <UploadDesignCard
//               sides={selectedSides}
//               frontFile={frontFile}
//               backFile={backFile}
//               frontPreview={frontPreview}
//               backPreview={backPreview}
//               onUploadFront={handleFrontUpload}
//               onUploadBack={handleBackUpload}
//               onRemoveFront={() => { setFrontFile(null); setFrontPreview(null); }}
//               onRemoveBack={() => { setBackFile(null); setBackPreview(null); }}
//             />

//             {/* Desktop CTA */}
//             <div className="hidden lg:block">
//               <Button
//                 onClick={handleContinue}
//                 disabled={ctaDisabled}
//                 className="w-full bg-[#D73D32] hover:bg-[#b83228] text-white py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 {ctaDisabled
//                   ? !selectedVariant ? "← Select Options First"
//                   : !frontFile       ? "↑ Upload Design to Continue"
//                   :                    "Select Quantity"
//                   : "Continue to Design Review →"}
//               </Button>
//             </div>

//             <OrderSummaryCard
//               productName={product.name}
//               variant={selectedVariant}
//               quantityId={useCustomQty ? undefined : selectedQuantity}
//               totalPrice={totalPrice}
//               uploadedFile={uploadedFile}
//               onAddToCart={handleAddToCart}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Mobile sticky CTA */}
//       <div className="fixed bottom-0 inset-x-0 lg:hidden z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-3 shadow-2xl">
//         <div className="flex items-center gap-3 max-w-lg mx-auto">
//           <div className="flex-1 min-w-0">
//             <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide truncate">
//               {selectedVariant ? `${selectedVariant.size.name} · ${selectedVariant.paperType.name}` : "No variant selected"}
//             </p>
//             <p className="text-lg font-bold text-[#D73D32] leading-tight">
//               {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "Select options"}
//             </p>
//           </div>
//           <Button
//             onClick={handleContinue}
//             disabled={ctaDisabled}
//             className="shrink-0 bg-[#D73D32] hover:bg-[#b83228] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow disabled:opacity-40 disabled:cursor-not-allowed"
//           >
//             Continue →
//           </Button>
//         </div>
//       </div>

//       {/* Image gallery modal */}
//       <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
//         <DialogContent className="max-w-5xl h-[90vh] p-0 bg-black/96 rounded-3xl overflow-hidden border-0">
//           <div className="relative w-full h-full flex flex-col">
//             <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-5 flex justify-between items-center">
//               <div>
//                 <h3 className="text-white font-bold text-lg leading-none">{product.name}</h3>
//                 <p className="text-white/50 text-xs mt-1">{selectedImageIndex + 1} of {allImages.length}</p>
//               </div>
//               <button onClick={() => setShowImageGallery(false)}
//                 className="text-white/70 hover:text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition">
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="flex-1 flex items-center justify-center p-16">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="max-w-full max-h-full object-contain rounded-xl"
//               />
//             </div>

//             {allImages.length > 1 && (
//               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 flex justify-center gap-2">
//                 {allImages.map((_: any, idx: number) => (
//                   <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                     className={`rounded-full transition-all ${idx === selectedImageIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/70"}`} />
//                 ))}
//               </div>
//             )}

//             {allImages.length > 1 && (
//               <>
//                 <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                   className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110">
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 backdrop-blur-sm transition-all hover:scale-110">
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Toasts */}
//       <ToastStack toasts={toasts} onDismiss={dismiss} />
//     </div>
//   );
// }


// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useParams, useNavigate } from "react-router";
// import {
//   Star, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn,
//   Edit3, PackageCheck, Layers, Scissors, Printer, Check,
//   Info, FileText, MessageSquare, Truck, ShieldCheck, RefreshCw,
//   Clock, CheckCheck, AlertCircle, X, Upload, Trash2, Image,
// } from "lucide-react";
// import axios from "axios";
// import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
// import { getImageUrl, enrichProductData } from "../../utils/productutils";
// import { API_BASE_URL } from "../../constants/productconstants";

// // ─── Types ──────────────────────────────────────────────────────────────────

// interface Size      { id: string; name: string; dimensions?: string }
// interface PaperType { id: string; name: string }
// interface PrintType { id: string; name: string }
// interface CutType   { id: string; name: string }

// interface VariantOption {
//   id: string;
//   variantId: string;
//   size: Size;
//   paperType: PaperType;
//   printType: PrintType;
//   cutType: CutType;
//   sides: number;
//   orientation: string;
//   prices: VariantPrice[];
//   minPrice: number;
//   maxPrice: number;
// }

// interface ApiResponse { status: string; product: Product }
// type TabId = "details" | "specs" | "reviews";

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const safeParse = (value: any): any[] => {
//   if (!value) return [];
//   try {
//     const parsed = typeof value === "string" ? JSON.parse(value) : value;
//     return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
//   } catch { return []; }
// };

// const SIDES_OPTIONS = [
//   { label: "Single Sided", value: "1", desc: "Front only"   },
//   { label: "Double Sided", value: "2", desc: "Front & back" },
// ];

// const MOCK_REVIEWS = [
//   { id: 1, name: "Ravi Kumar",   initials: "RK", rating: 5, date: "Feb 2026", text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again." },
//   { id: 2, name: "Priya Sharma", initials: "PS", rating: 4, date: "Jan 2026", text: "Good quality cards, delivered on time. Slight delay but overall happy with the result." },
//   { id: 3, name: "Arjun Mehta",  initials: "AM", rating: 5, date: "Dec 2025", text: "Very professional finish. The Gloss paper option looks premium. Highly recommend." },
// ];

// // ─── Toast ───────────────────────────────────────────────────────────────────

// interface ToastMsg { id: number; type: "success" | "error" | "info"; text: string }

// function useToast() {
//   const [toasts, setToasts] = useState<ToastMsg[]>([]);
//   const show = useCallback((type: ToastMsg["type"], text: string) => {
//     const id = Date.now();
//     setToasts(t => [...t, { id, type, text }]);
//     setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
//   }, []);
//   const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);
//   return { toasts, show, dismiss };
// }

// function ToastStack({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: number) => void }) {
//   if (!toasts.length) return null;
//   return (
//     <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 lg:bottom-6">
//       {toasts.map(t => (
//         <div key={t.id}
//           className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium text-white max-w-xs animate-in slide-in-from-right-4
//             ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-gray-800"}`}>
//           {t.type === "success" ? <CheckCheck className="w-4 h-4 shrink-0" />
//            : t.type === "error"  ? <AlertCircle className="w-4 h-4 shrink-0" />
//            :                       <Info className="w-4 h-4 shrink-0" />}
//           <span className="flex-1">{t.text}</span>
//           <button onClick={() => onDismiss(t.id)} className="opacity-60 hover:opacity-100">
//             <X className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Stars ───────────────────────────────────────────────────────────────────

// function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
//   const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
//   return (
//     <div className="flex gap-0.5">
//       {[...Array(5)].map((_, i) => (
//         <Star key={i} className={`${cls} ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`} />
//       ))}
//     </div>
//   );
// }

// // ─── Step Progress ────────────────────────────────────────────────────────────

// const STEPS = ["Configure", "Upload Design", "Review & Order"];

// function StepProgress({ current }: { current: number }) {
//   return (
//     <div className="flex items-center gap-0 mb-7">
//       {STEPS.map((step, i) => (
//         <React.Fragment key={step}>
//           <div className="flex items-center gap-2">
//             <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
//               ${i < current   ? "bg-[#D73D32] text-white"
//               : i === current ? "border-2 border-[#D73D32] text-[#D73D32] bg-white"
//               :                 "border-2 border-gray-200 text-gray-300 bg-white"}`}>
//               {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
//             </div>
//             <span className={`text-xs font-semibold hidden sm:block ${i === current ? "text-gray-900" : "text-gray-400"}`}>{step}</span>
//           </div>
//           {i < STEPS.length - 1 && (
//             <div className={`flex-1 h-px mx-3 transition-all ${i < current ? "bg-[#D73D32]" : "bg-gray-200"}`} />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

// // ─── Section Label ────────────────────────────────────────────────────────────

// function SectionLabel({ label, hint }: { label: string; hint?: string }) {
//   return (
//     <div className="flex items-center gap-2 mb-3">
//       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
//       {hint && (
//         <span className="group relative cursor-help">
//           <Info className="w-3.5 h-3.5 text-gray-300" />
//           <span className="absolute left-5 -top-1 w-52 text-xs bg-gray-900 text-white px-2.5 py-1.5 rounded-xl
//             opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 shadow-lg leading-relaxed">
//             {hint}
//           </span>
//         </span>
//       )}
//     </div>
//   );
// }

// // ─── Option Pill ─────────────────────────────────────────────────────────────

// function OptionPill({
//   active, onClick, children,
// }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl border text-sm font-semibold transition-all select-none
//         ${active
//           ? "border-[#D73D32] bg-[#D73D32]/5 text-[#D73D32]"
//           : "border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50"}`}>
//       {children}
//     </button>
//   );
// }

// // ─── Upload Zone ─────────────────────────────────────────────────────────────

// function UploadZone({
//   label, file, preview, onUpload, onRemove,
// }: {
//   label: string; file: File | null; preview: string | null;
//   onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemove: () => void;
// }) {
//   const inputId = `upload-${label.replace(/\s/g, "-").toLowerCase()}`;
//   return (
//     <div>
//       <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
//       {!file ? (
//         <label htmlFor={inputId}
//           className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-gray-200
//             bg-gray-50/60 cursor-pointer hover:border-[#D73D32]/40 hover:bg-[#D73D32]/3 transition-all group">
//           <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:shadow">
//             <Upload className="w-4 h-4 text-[#D73D32]" />
//           </div>
//           <span className="text-xs text-gray-500 font-medium">Click to upload <span className="text-[#D73D32] font-semibold">{label}</span></span>
//           <span className="text-[10px] text-gray-400">PNG, JPG, PDF · Max 50MB</span>
//           <input id={inputId} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.ai,.eps" onChange={onUpload} />
//         </label>
//       ) : (
//         <div className="relative rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
//           {preview ? (
//             <img src={preview} alt={label} className="w-full h-36 object-cover" />
//           ) : (
//             <div className="w-full h-36 flex items-center justify-center bg-gray-50">
//               <Image className="w-8 h-8 text-gray-300" />
//             </div>
//           )}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
//             <p className="text-xs text-white font-semibold flex-1 truncate">{file.name}</p>
//             <button onClick={onRemove}
//               className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500/80 text-white transition-all ml-2">
//               <Trash2 className="w-3.5 h-3.5" />
//             </button>
//           </div>
//           <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
//             Uploaded
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Order Summary Strip ──────────────────────────────────────────────────────

// function OrderSummaryStrip({
//   variant, quantityId, useCustomQty, customQty, totalPrice, frontFile, sides, backFile,
// }: {
//   variant: VariantOption | null; quantityId: string; useCustomQty: boolean; customQty: string;
//   totalPrice: number; frontFile: File | null; sides: string; backFile: File | null;
// }) {
//   if (!variant) return null;
//   const row = variant.prices.find(p => p.id === quantityId);
//   const qty  = useCustomQty ? customQty : row ? `${row.min_qty}` : "—";

//   return (
//     <div className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
//       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Order Summary</p>
//       <div className="grid grid-cols-2 gap-2 text-xs">
//         {[
//           { label: "Size",   value: variant.size.name      },
//           { label: "Paper",  value: variant.paperType.name },
//           { label: "Print",  value: variant.printType.name },
//           { label: "Cut",    value: variant.cutType.name   },
//           { label: "Sides",  value: sides === "1" ? "Single" : "Double" },
//           { label: "Qty",    value: `${qty} pcs` },
//         ].map(({ label, value }) => (
//           <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50">
//             <span className="text-gray-400 font-medium">{label}</span>
//             <span className="text-gray-700 font-semibold">{value}</span>
//           </div>
//         ))}
//       </div>
//       <div className="flex items-center justify-between pt-1">
//         <div>
//           <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mb-0.5">Design</p>
//           <p className="text-xs font-semibold text-gray-700">
//             {frontFile ? <span className="text-emerald-600">✓ Front uploaded</span> : <span className="text-gray-300">No design yet</span>}
//             {sides === "2" && (
//               <> · {backFile ? <span className="text-emerald-600">✓ Back</span> : <span className="text-amber-500">Back required</span>}</>
//             )}
//           </p>
//         </div>
//         <div className="text-right">
//           <p className="text-[10px] text-gray-400 uppercase tracking-wide font-bold mb-0.5">Total</p>
//           <p className="text-lg font-bold text-[#D73D32]">₹{totalPrice > 0 ? totalPrice.toFixed(2) : "—"}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────

// export function ProductDetailPage() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { toasts, show: showToast, dismiss } = useToast();

//   const [product,  setProduct]  = useState<Product | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [variants, setVariants] = useState<VariantOption[]>([]);

//   const [activeTab,          setActiveTab]          = useState<TabId>("details");
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showGallery,        setShowGallery]        = useState(false);
//   const [isFavorite,         setIsFavorite]         = useState(false);
//   const [copied,             setCopied]             = useState(false);

//   const [selectedSize,      setSelectedSize]      = useState("");
//   const [selectedPaperType, setSelectedPaperType] = useState("");
//   const [selectedPrintType, setSelectedPrintType] = useState("");
//   const [selectedCutType,   setSelectedCutType]   = useState("");
//   const [selectedSides,     setSelectedSides]     = useState("1");
//   const [selectedQuantity,  setSelectedQuantity]  = useState<string>("");
//   const [customQty,         setCustomQty]         = useState<string>("");
//   const [useCustomQty,      setUseCustomQty]      = useState(false);

//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [totalPrice,      setTotalPrice]      = useState(0);

//   const [frontFile,    setFrontFile]    = useState<File | null>(null);
//   const [backFile,     setBackFile]     = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview,  setBackPreview]  = useState<string | null>(null);

//   // Step logic: 0 = configure, 1 = upload, 2 = review
//   const currentStep = useMemo(() => {
//     if (!selectedVariant || !selectedQuantity) return 0;
//     if (!frontFile) return 1;
//     return 2;
//   }, [selectedVariant, selectedQuantity, frontFile]);

//   // ── Fetch ──────────────────────────────────────────────────────────────────

//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
//         const raw = res.data.product;
//         const parsed = { ...raw, images: safeParse(raw.images), related_images: safeParse(raw.related_images) };
//         setProduct(enrichProductData(parsed));
//         if (Array.isArray(raw.variants) && raw.variants.length > 0) initVariants(raw.variants);
//       } catch {
//         showToast("error", "Failed to load product.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   const initVariants = (variantData: ProductVariant[]) => {
//     const processed: VariantOption[] = variantData.map(v => {
//       const prices = v.prices || [];
//       const vals   = prices.map((p: VariantPrice) => p.price);
//       return {
//         id: v.id, variantId: v.id,
//         size:      { id: v.size_id,      name: v.size_name       || "Standard" },
//         paperType: { id: v.paper_type_id, name: v.paper_type_name || "Standard" },
//         printType: { id: v.print_type_id, name: v.print_type_name || "Digital"  },
//         cutType:   { id: v.cut_type_id,   name: v.cut_type_name   || "Straight" },
//         sides:       v.sides       || 1,
//         orientation: v.orientation || "Portrait",
//         prices,
//         minPrice: vals.length ? Math.min(...vals) : 0,
//         maxPrice: vals.length ? Math.max(...vals) : 0,
//       };
//     });
//     setVariants(processed);
//     const first = processed[0];
//     setSelectedSize(first.size.name);
//     setSelectedPaperType(first.paperType.name);
//     setSelectedPrintType(first.printType.name);
//     setSelectedCutType(first.cutType.name);
//     setSelectedSides(String(first.sides));
//     setSelectedVariant(first);
//     if (first.prices.length) { setSelectedQuantity(first.prices[0].id); setTotalPrice(first.prices[0].price); }
//   };

//   useEffect(() => {
//     if (!variants.length) return;
//     const match = variants.find(v =>
//       v.size.name      === selectedSize      &&
//       v.paperType.name === selectedPaperType &&
//       v.printType.name === selectedPrintType &&
//       v.cutType.name   === selectedCutType
//     ) ?? null;
//     setSelectedVariant(match);
//     if (match?.prices.length) {
//       setSelectedQuantity(match.prices[0].id);
//       setUseCustomQty(false); setCustomQty("");
//       setTotalPrice(match.prices[0].price);
//     } else { setTotalPrice(0); }
//   }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, variants]);

//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity || useCustomQty) return;
//     const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//     if (row) setTotalPrice(row.price);
//   }, [selectedQuantity, selectedVariant, useCustomQty]);

//   // ── Unique options ─────────────────────────────────────────────────────────

//   const uniqueBy = <T extends { id: string; name: string }>(sel: (v: VariantOption) => T): T[] => {
//     const map = new Map<string, T>();
//     variants.forEach(v => { const o = sel(v); if (!map.has(o.name)) map.set(o.name, o); });
//     return Array.from(map.values());
//   };

//   const uniqueSizes      = useMemo(() => uniqueBy(v => v.size),      [variants]);
//   const uniquePaperTypes = useMemo(() => uniqueBy(v => v.paperType), [variants]);
//   const uniquePrintTypes = useMemo(() => uniqueBy(v => v.printType), [variants]);
//   const uniqueCutTypes   = useMemo(() => uniqueBy(v => v.cutType),   [variants]);

//   const allImages = useMemo(() => [
//     ...(Array.isArray(product?.images)         ? product!.images         : []),
//     ...(Array.isArray(product?.related_images) ? product!.related_images : []),
//   ], [product]);

//   // ── Custom qty price ───────────────────────────────────────────────────────

//   const customQtyPrice = useMemo(() => {
//     if (!selectedVariant || !customQty) return null;
//     const qty = parseInt(customQty, 10);
//     if (isNaN(qty) || qty < 1) return null;
//     return selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty).find(p => qty >= p.min_qty)?.price ?? null;
//   }, [customQty, selectedVariant]);

//   // ── CTA state ─────────────────────────────────────────────────────────────

//   const ctaDisabled =
//     !selectedVariant ||
//     (!useCustomQty && !selectedQuantity) ||
//     (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
//     !frontFile ||
//     (selectedSides === "2" && !backFile);

//   // ── Handlers ──────────────────────────────────────────────────────────────

//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     showToast("success", "Link copied!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setFrontFile(file); setFrontPreview(URL.createObjectURL(file));
//     showToast("success", "Front design uploaded!");
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]; if (!file) return;
//     setBackFile(file); setBackPreview(URL.createObjectURL(file));
//     showToast("success", "Back design uploaded!");
//   };

//   const handleContinue = () => {
//     if (!selectedVariant || !frontFile) return;
//     if (selectedSides === "2" && !backFile) { showToast("error", "Please upload the back design."); return; }

//     let quantityNumber: number;
//     let unitPrice: number;

//     if (useCustomQty) {
//       const parsed = parseInt(customQty, 10);
//       if (isNaN(parsed) || parsed < 1) { showToast("error", "Enter a valid quantity."); return; }
//       quantityNumber = parsed;
//       const tier = selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty).find(p => parsed >= p.min_qty);
//       unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
//     } else {
//       const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
//       if (!row) { showToast("error", "Select a quantity."); return; }
//       quantityNumber = row.min_qty;
//       unitPrice      = row.price;
//     }

//     navigate("/design-review", {
//       state: {
//         product, variant: selectedVariant,
//         quantity: quantityNumber,
//         priceId: useCustomQty ? null : selectedQuantity,
//         selected_options: {
//           size:       selectedVariant.size?.name      ?? "",
//           material:   selectedVariant.paperType?.name ?? "",
//           lamination: selectedVariant.printType?.name ?? "",
//         },
//         frontDesign: frontFile, backDesign: selectedSides === "2" ? backFile : null,
//         frontPreview, backPreview,
//         basePrice: unitPrice, totalPrice: unitPrice,
//         sides: selectedSides,
//       },
//     });
//   };

//   // ── Guards ────────────────────────────────────────────────────────────────

//   if (loading) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
//       <div className="text-center space-y-3">
//         <div className="relative w-12 h-12 mx-auto">
//           <div className="absolute inset-0 rounded-full border-4 border-[#D73D32]/20" />
//           <div className="absolute inset-0 rounded-full border-4 border-[#D73D32] border-t-transparent animate-spin" />
//         </div>
//         <p className="text-sm text-gray-400 font-medium">Loading…</p>
//       </div>
//     </div>
//   );

//   if (!product) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
//       <div className="text-center space-y-4">
//         <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
//           <AlertCircle className="w-8 h-8 text-[#D73D32]" />
//         </div>
//         <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
//         <button onClick={() => navigate(-1)} className="text-sm text-[#D73D32] font-semibold hover:underline">← Go back</button>
//       </div>
//     </div>
//   );

//   // ─── Tab classes ──────────────────────────────────────────────────────────

//   const tabCls = (t: TabId) =>
//     `flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer whitespace-nowrap
//      ${activeTab === t ? "border-[#D73D32] text-[#D73D32]" : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"}`;

//   // ─── Render ───────────────────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-white">

//       {/* ── Breadcrumb ── */}
//       <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center gap-1.5 text-xs text-gray-400 overflow-x-auto">
//           <button onClick={() => navigate("/")}         className="hover:text-[#D73D32] transition-colors font-semibold shrink-0">Home</button>
//           <span className="text-gray-200">/</span>
//           <button onClick={() => navigate("/products")} className="hover:text-[#D73D32] transition-colors font-semibold shrink-0">Products</button>
//           <span className="text-gray-200">/</span>
//           <span className="text-gray-700 font-semibold truncate">{product.name}</span>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-10">

//         <StepProgress current={currentStep} />

//         {/* ═══ TOP: Image + Info ═══ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

//           {/* Images */}
//           <div className="flex gap-3">
//             {allImages.length > 1 && (
//               <div className="flex flex-col gap-2 shrink-0 w-14">
//                 {allImages.map((img: any, idx: number) => (
//                   <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                     className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all
//                       ${selectedImageIndex === idx ? "border-[#D73D32]" : "border-transparent opacity-50 hover:opacity-80"}`}>
//                     <img src={getImageUrl(img.url || img)} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}

//             <div className="relative flex-1 rounded-2xl overflow-hidden bg-white aspect-square">
//               <img
//                 src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//                 alt={product.name}
//                 className="w-full h-full object-cover"
//                 onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/600x600?text=No+Image"; }}
//               />

//               {/* Actions */}
//               <div className="absolute top-3 left-3 flex gap-2">
//                 <button onClick={handleShare}
//                   className="bg-white/95 p-2 rounded-full shadow-sm hover:bg-white transition-all">
//                   {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-gray-500" />}
//                 </button>
//                 <button onClick={() => setIsFavorite(f => !f)}
//                   className="bg-white/95 p-2 rounded-full shadow-sm hover:bg-white transition-all">
//                   <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#D73D32] text-[#D73D32]" : "text-gray-400"}`} />
//                 </button>
//               </div>

//               <button onClick={() => setShowGallery(true)}
//                 className="absolute bottom-3 right-3 bg-white/95 px-3 py-1.5 rounded-full shadow-sm text-xs font-semibold text-gray-600 flex items-center gap-1.5 hover:bg-white transition-all">
//                 <ZoomIn className="w-3.5 h-3.5 text-[#D73D32]" /> View full
//               </button>

//               {allImages.length > 1 && (
//                 <>
//                   <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-all">
//                     <ChevronLeft className="w-4 h-4 text-gray-600" />
//                   </button>
//                   <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-sm hover:bg-white transition-all">
//                     <ChevronRight className="w-4 h-4 text-gray-600" />
//                   </button>
//                   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
//                     {allImages.map((_: any, i: number) => (
//                       <button key={i} onClick={() => setSelectedImageIndex(i)}
//                         className={`rounded-full transition-all ${i === selectedImageIndex ? "w-4 h-1.5 bg-[#D73D32]" : "w-1.5 h-1.5 bg-white/60"}`} />
//                     ))}
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Product Info */}
//           <div className="space-y-5">
//             {/* Header */}
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
//                   {product.sku}
//                 </span>
//                 <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
//                   In Stock
//                 </span>
//               </div>
//               <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
//             </div>

//             {/* Rating */}
//             <div className="flex items-center gap-2.5 flex-wrap">
//               <Stars rating={Number(product.rating || 4.2)} size="md" />
//               <span className="text-sm font-bold text-gray-700">{product.rating || 4.2}</span>
//               <span className="text-sm text-gray-400">({product.review_count || 90} reviews)</span>
//               <button onClick={() => setActiveTab("reviews")}
//                 className="text-xs text-[#D73D32] font-semibold hover:underline">Read all</button>
//             </div>

//             {/* Price */}
//             <div className="flex items-baseline gap-2 px-4 py-3.5 bg-white rounded-2xl border border-gray-100">
//               <span className="text-3xl font-bold text-[#D73D32]">
//                 ₹{totalPrice > 0 ? totalPrice.toFixed(2) : (selectedVariant?.minPrice ?? 0).toFixed(2)}
//               </span>
//               {selectedVariant && (
//                 <span className="text-xs text-gray-400 font-medium">
//                   / {useCustomQty
//                       ? `${customQty || "—"} pcs`
//                       : (() => { const r = selectedVariant.prices.find(p => p.id === selectedQuantity); return r ? `${r.min_qty}+ pcs` : "selected qty"; })()}
//                 </span>
//               )}
//               {selectedVariant && selectedVariant.minPrice !== selectedVariant.maxPrice && (
//                 <span className="ml-auto text-xs text-gray-400">
//                   ₹{selectedVariant.minPrice.toFixed(0)}–{selectedVariant.maxPrice.toFixed(0)} range
//                 </span>
//               )}
//             </div>

//             {/* Quick specs */}
//             <div className="grid grid-cols-4 gap-2">
//               {[
//                 { icon: <Layers className="w-4 h-4" />,      label: "Sizes",  value: `${uniqueSizes.length}`      },
//                 { icon: <PackageCheck className="w-4 h-4" />, label: "Paper",  value: `${uniquePaperTypes.length}` },
//                 { icon: <Printer className="w-4 h-4" />,      label: "Print",  value: `${uniquePrintTypes.length}` },
//                 { icon: <Scissors className="w-4 h-4" />,     label: "Cut",    value: `${uniqueCutTypes.length}`   },
//               ].map(({ icon, label, value }) => (
//                 <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-gray-100 text-center">
//                   <div className="text-[#D73D32]">{icon}</div>
//                   <p className="text-xs font-bold text-gray-800">{value}</p>
//                   <p className="text-[10px] text-gray-400">{label}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Min order */}
//             <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5">
//               <PackageCheck className="w-4 h-4 text-amber-500 shrink-0" />
//               <span>Min. order: <strong className="text-gray-800">{product.min_order_qty || 100} pieces</strong></span>
//             </div>

//             {/* Trust row */}
//             <div className="grid grid-cols-2 gap-2.5">
//               {[
//                 { icon: <Truck className="w-3.5 h-3.5" />,       label: "Fast Delivery",    sub: "3–5 business days"   },
//                 { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: "Quality Assured",  sub: "100% satisfaction"   },
//                 { icon: <RefreshCw className="w-3.5 h-3.5" />,   label: "Easy Reorder",     sub: "Save your design"    },
//                 { icon: <Clock className="w-3.5 h-3.5" />,       label: "Quick Turnaround", sub: "Same-day processing" },
//               ].map(b => (
//                 <div key={b.label} className="flex items-center gap-2.5 bg-white rounded-xl border border-gray-100 px-3 py-2">
//                   <div className="p-1.5 rounded-lg bg-gray-50 text-[#D73D32]">{b.icon}</div>
//                   <div>
//                     <p className="text-xs font-bold text-gray-700 leading-none">{b.label}</p>
//                     <p className="text-[10px] text-gray-400 mt-0.5">{b.sub}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ═══ TABS ═══ */}
//         <div className="bg-white rounded-2xl border border-gray-100 mb-8 overflow-hidden">
//           <div className="flex border-b border-gray-100 overflow-x-auto">
//             {([
//               { id: "details" as TabId, icon: <Info className="w-3.5 h-3.5" />,         label: "Details"  },
//               { id: "specs"   as TabId, icon: <FileText className="w-3.5 h-3.5" />,      label: "Specs"    },
//               { id: "reviews" as TabId, icon: <MessageSquare className="w-3.5 h-3.5" />, label: `Reviews (${product.review_count || 90})` },
//             ]).map(tab => (
//               <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabCls(tab.id)}>
//                 {tab.icon} {tab.label}
//               </button>
//             ))}
//           </div>

//           <div className="p-5 lg:p-6">
//             {activeTab === "details" && (
//               <div className="space-y-5 max-w-2xl">
//                 <p className="text-sm text-gray-500 leading-relaxed">
//                   {product.description || "Premium quality printing with vibrant colours and sharp detail. Perfect for business cards, promotional materials, and professional use."}
//                 </p>
//                 <div className="rounded-xl overflow-hidden border border-gray-100">
//                   {[
//                     { label: "Product Name",    value: product.name },
//                     { label: "SKU",             value: product.sku  },
//                     { label: "Min Order",       value: `${product.min_order_qty || 100} pcs` },
//                     { label: "Max Order",       value: `${product.max_order_qty || 1000} pcs` },
//                     { label: "Orientation",     value: selectedVariant?.orientation || "Portrait" },
//                     { label: "Available Since", value: new Date(product.created_at || "").toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
//                   ].map(({ label, value }, i) => (
//                     <div key={label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} border-b border-gray-50 last:border-0`}>
//                       <span className="text-gray-400 font-medium">{label}</span>
//                       <span className="text-gray-700 font-semibold text-right">{value}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {activeTab === "specs" && (
//               <div>
//                 <p className="text-xs text-gray-400 mb-4 font-medium">All variant combinations and pricing tiers.</p>
//                 <div className="overflow-x-auto rounded-xl border border-gray-100">
//                   <table className="w-full text-xs">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         {["Size", "Paper", "Print", "Cut", "Sides", "Min Qty", "Price"].map(h => (
//                           <th key={h} className="px-4 py-3 text-left font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-50">
//                       {variants.flatMap(v => v.prices.map(p => (
//                         <tr key={`${v.id}-${p.id}`}
//                           className={`transition-colors hover:bg-[#D73D32]/3 ${
//                             selectedVariant?.id === v.id && selectedQuantity === p.id ? "bg-[#D73D32]/5" : ""}`}>
//                           <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">{v.size.name}</td>
//                           <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.paperType.name}</td>
//                           <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.printType.name}</td>
//                           <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{v.cutType.name}</td>
//                           <td className="px-4 py-3 text-gray-500">{v.sides === 1 ? "Single" : "Double"}</td>
//                           <td className="px-4 py-3 text-gray-500">{p.min_qty}+</td>
//                           <td className="px-4 py-3 font-bold text-[#D73D32]">₹{p.price.toFixed(2)}</td>
//                         </tr>
//                       )))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {activeTab === "reviews" && (
//               <div className="space-y-5">
//                 <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-xl">
//                   <div className="text-center shrink-0">
//                     <p className="text-5xl font-bold text-gray-900 leading-none">{product.rating || 4.2}</p>
//                     <Stars rating={Number(product.rating || 4.2)} size="md" />
//                     <p className="text-xs text-gray-400 mt-1.5">{product.review_count || 90} reviews</p>
//                   </div>
//                   <div className="flex-1 space-y-1.5">
//                     {[5, 4, 3, 2, 1].map(star => {
//                       const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1;
//                       return (
//                         <div key={star} className="flex items-center gap-2 text-xs">
//                           <span className="text-gray-400 w-2 shrink-0">{star}</span>
//                           <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
//                           <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                             <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
//                           </div>
//                           <span className="text-gray-400 w-7 text-right shrink-0">{pct}%</span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div className="grid sm:grid-cols-3 gap-3">
//                   {MOCK_REVIEWS.map(r => (
//                     <div key={r.id} className="p-4 rounded-xl border border-gray-100 bg-white space-y-3">
//                       <div className="flex items-center gap-2.5">
//                         <div className="w-8 h-8 rounded-full bg-[#D73D32]/10 text-[#D73D32] flex items-center justify-center text-xs font-bold shrink-0">
//                           {r.initials}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-xs font-bold text-gray-800 truncate">{r.name}</p>
//                           <p className="text-[10px] text-gray-400">{r.date}</p>
//                         </div>
//                         <Stars rating={r.rating} />
//                       </div>
//                       <p className="text-xs text-gray-500 leading-relaxed">{r.text}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* ═══ BOTTOM: Configure + Upload ═══ */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

//           {/* Left: Configure */}
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-base font-bold text-gray-900">Configure Your Order</h2>
//               <p className="text-xs text-gray-400 mt-0.5">Choose all options below to proceed.</p>
//             </div>

//             {uniqueSizes.length > 0 && (
//               <div>
//                 <SectionLabel label="Size" hint="Physical dimensions of the printed card" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {uniqueSizes.map(s => (
//                     <OptionPill key={s.id} active={selectedSize === s.name} onClick={() => setSelectedSize(s.name)}>
//                       {s.name}
//                       {s.dimensions && <span className="text-[10px] text-gray-400 font-normal mt-0.5">{s.dimensions}</span>}
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {uniquePaperTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Paper Type" hint="Material and finish of the paper used" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {uniquePaperTypes.map(p => (
//                     <OptionPill key={p.id} active={selectedPaperType === p.name} onClick={() => setSelectedPaperType(p.name)}>
//                       {p.name}
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {uniquePrintTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Print Type" hint="Printing technology used for production" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {uniquePrintTypes.map(p => (
//                     <OptionPill key={p.id} active={selectedPrintType === p.name} onClick={() => setSelectedPrintType(p.name)}>
//                       {p.name}
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {uniqueCutTypes.length > 0 && (
//               <div>
//                 <SectionLabel label="Cut Type" hint="Edge finishing style of the final card" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {uniqueCutTypes.map(c => (
//                     <OptionPill key={c.id} active={selectedCutType === c.name} onClick={() => setSelectedCutType(c.name)}>
//                       {c.name}
//                     </OptionPill>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <div>
//               <SectionLabel label="Printing Sides" />
//               <div className="grid grid-cols-2 gap-2">
//                 {SIDES_OPTIONS.map(o => (
//                   <OptionPill key={o.value} active={selectedSides === o.value} onClick={() => setSelectedSides(o.value)}>
//                     <span>{o.label}</span>
//                     <span className="text-[10px] text-gray-400 font-normal mt-0.5">{o.desc}</span>
//                   </OptionPill>
//                 ))}
//               </div>
//             </div>

//             {selectedVariant && selectedVariant.prices.length > 0 && (
//               <div>
//                 <SectionLabel label="Quantity" hint="Choose a tier or enter a custom amount" />
//                 <div className="grid grid-cols-3 gap-2">
//                   {selectedVariant.prices.map(price => (
//                     <OptionPill key={price.id}
//                       active={!useCustomQty && selectedQuantity === price.id}
//                       onClick={() => { setSelectedQuantity(price.id); setUseCustomQty(false); setCustomQty(""); }}>
//                       <span className="text-sm font-bold">
//                         {price.min_qty}{price.max_qty && price.max_qty !== price.min_qty ? `–${price.max_qty}` : "+"} pcs
//                       </span>
//                       <span className={`text-xs font-bold mt-0.5 ${!useCustomQty && selectedQuantity === price.id ? "text-[#D73D32]" : "text-gray-400"}`}>
//                         ₹{price.price.toFixed(2)}
//                       </span>
//                     </OptionPill>
//                   ))}
//                   <OptionPill active={useCustomQty} onClick={() => { setUseCustomQty(true); setSelectedQuantity(""); }}>
//                     <Edit3 className="w-3.5 h-3.5 mb-0.5" />
//                     <span>Custom</span>
//                     <span className="text-[10px] text-gray-400 font-normal mt-0.5">Enter qty</span>
//                   </OptionPill>
//                 </div>

//                 {useCustomQty && (
//                   <div className="mt-3 flex items-center gap-2.5">
//                     <input
//                       type="number"
//                       min={product.min_order_qty || 1}
//                       value={customQty}
//                       onChange={e => setCustomQty(e.target.value)}
//                       placeholder={`Min ${product.min_order_qty || 100} pcs`}
//                       className="flex-1 border border-[#D73D32]/30 focus:border-[#D73D32] rounded-xl px-4 py-2.5 text-sm outline-none transition-colors bg-white"
//                     />
//                     {customQtyPrice !== null && (
//                       <div className="shrink-0 text-right px-3 py-2 bg-[#D73D32]/5 rounded-xl border border-[#D73D32]/15">
//                         <p className="text-[9px] text-gray-400 uppercase tracking-wide font-bold">Per 100</p>
//                         <p className="text-base font-bold text-[#D73D32]">₹{customQtyPrice.toFixed(2)}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//                 {customQty && parseInt(customQty) < (product.min_order_qty || 100) && parseInt(customQty) > 0 && (
//                   <p className="text-xs text-amber-600 flex items-center gap-1.5 mt-2">
//                     <AlertCircle className="w-3.5 h-3.5 shrink-0" />
//                     Minimum order is {product.min_order_qty || 100} pieces.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right: Upload + Summary + CTA */}
//           <div className="space-y-5">
//             <div>
//               <h2 className="text-base font-bold text-gray-900">Upload Your Design</h2>
//               <p className="text-xs text-gray-400 mt-0.5">Upload high-resolution artwork (PNG, PDF, AI).</p>
//             </div>

//             <UploadZone
//               label="Front Design"
//               file={frontFile}
//               preview={frontPreview}
//               onUpload={handleFrontUpload}
//               onRemove={() => { setFrontFile(null); setFrontPreview(null); }}
//             />

//             {selectedSides === "2" && (
//               <UploadZone
//                 label="Back Design"
//                 file={backFile}
//                 preview={backPreview}
//                 onUpload={handleBackUpload}
//                 onRemove={() => { setBackFile(null); setBackPreview(null); }}
//               />
//             )}

//             <OrderSummaryStrip
//               variant={selectedVariant}
//               quantityId={selectedQuantity}
//               useCustomQty={useCustomQty}
//               customQty={customQty}
//               totalPrice={totalPrice}
//               frontFile={frontFile}
//               sides={selectedSides}
//               backFile={backFile}
//             />

//             {/* Desktop CTA */}
//             <button
//               onClick={handleContinue}
//               disabled={ctaDisabled}
//               className="hidden lg:flex w-full items-center justify-center gap-2 bg-[#D73D32] hover:bg-[#b83228] disabled:opacity-40 disabled:cursor-not-allowed
//                 text-white py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow">
//               {ctaDisabled
//                 ? !selectedVariant ? "← Select options first"
//                 : !frontFile       ? "↑ Upload a design to continue"
//                 :                    "Select quantity"
//                 : "Continue to Design Review →"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ── Mobile sticky CTA ── */}
//       <div className="fixed bottom-0 inset-x-0 lg:hidden z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-4 py-3">
//         <div className="flex items-center gap-3 max-w-lg mx-auto">
//           <div className="flex-1 min-w-0">
//             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide truncate">
//               {selectedVariant ? `${selectedVariant.size.name} · ${selectedVariant.paperType.name}` : "No variant selected"}
//             </p>
//             <p className="text-base font-bold text-[#D73D32] leading-tight">
//               {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "Select options"}
//             </p>
//           </div>
//           <button
//             onClick={handleContinue}
//             disabled={ctaDisabled}
//             className="shrink-0 bg-[#D73D32] hover:bg-[#b83228] disabled:opacity-40 disabled:cursor-not-allowed
//               text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all">
//             Continue →
//           </button>
//         </div>
//       </div>

//       {/* ── Image Gallery Modal ── */}
//       {showGallery && (
//         <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
//           <div className="flex items-center justify-between px-6 py-4">
//             <div>
//               <p className="text-white font-bold text-sm">{product.name}</p>
//               <p className="text-white/40 text-xs">{selectedImageIndex + 1} / {allImages.length}</p>
//             </div>
//             <button onClick={() => setShowGallery(false)}
//               className="text-white/60 hover:text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition">
//               <X className="w-4 h-4" />
//             </button>
//           </div>

//           <div className="flex-1 flex items-center justify-center px-16 relative">
//             <img
//               src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
//               alt={product.name}
//               className="max-w-full max-h-full object-contain rounded-xl"
//             />
//             {allImages.length > 1 && (
//               <>
//                 <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
//                   className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all">
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
//                   className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all">
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </>
//             )}
//           </div>

//           {allImages.length > 1 && (
//             <div className="flex justify-center gap-1.5 py-5">
//               {allImages.map((_: any, idx: number) => (
//                 <button key={idx} onClick={() => setSelectedImageIndex(idx)}
//                   className={`rounded-full transition-all ${idx === selectedImageIndex ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`} />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       <ToastStack toasts={toasts} onDismiss={dismiss} />
//     </div>
//   );
// }



import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Star, Heart, Share2, ChevronLeft, ChevronRight, ZoomIn,
  Edit3, PackageCheck, Layers, Scissors, Printer, Check,
  Info, FileText, MessageSquare, Truck, ShieldCheck, RefreshCw,
  Clock, CheckCheck, AlertCircle, X, Upload, Trash2, Image,
  ArrowRight, Sparkles, Shield, Zap, ThumbsUp,
} from "lucide-react";
import axios from "axios";
import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
import { getImageUrl, enrichProductData } from "../../utils/productutils";
import { API_BASE_URL } from "../../constants/productconstants";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Size      { id: string; name: string; dimensions?: string }
interface PaperType { id: string; name: string }
interface PrintType { id: string; name: string }
interface CutType   { id: string; name: string }

interface VariantOption {
  id: string;
  variantId: string;
  size: Size;
  paperType: PaperType;
  printType: PrintType;
  cutType: CutType;
  sides: number;
  orientation: string;
  prices: VariantPrice[];
  minPrice: number;
  maxPrice: number;
}

interface ApiResponse { status: string; product: Product }

// ─── Constants ────────────────────────────────────────────────────────────────

const safeParse = (value: any): any[] => {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
  } catch { return []; }
};

const SIDES_OPTIONS = [
  { label: "Single Sided", value: "1", desc: "Front only"   },
  { label: "Double Sided", value: "2", desc: "Front & back" },
];

// ─── Relative date helper ─────────────────────────────────────────────────────
// If the review date is within the last 7 days, show "X days ago" (or "Today" / "Yesterday").
// Otherwise show the formatted month + year string.
function formatReviewDate(dateStr: string): string {
  // Try to parse as a real date first
  const parsed = new Date(dateStr);
  const isRealDate = !isNaN(parsed.getTime());

  if (!isRealDate) {
    // Already a display string like "Feb 2026" — return as-is
    return dateStr;
  }

  const now = new Date();
  const diffMs = now.getTime() - parsed.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7)  return `${diffDays} days ago`;

  return parsed.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

const MOCK_REVIEWS = [
  { id: 1, name: "Ravi Kumar",    initials: "RK", rating: 5, date: new Date(Date.now() - 1 * 86400000).toISOString(),  text: "Excellent print quality. Colours came out vibrant and sharp. Will definitely order again.", helpful: 14 },
  { id: 2, name: "Priya Sharma",  initials: "PS", rating: 4, date: new Date(Date.now() - 4 * 86400000).toISOString(),  text: "Good quality cards, delivered on time. Slight delay but overall happy with the result.", helpful: 8 },
  { id: 3, name: "Arjun Mehta",   initials: "AM", rating: 5, date: new Date(Date.now() - 32 * 86400000).toISOString(), text: "Very professional finish. The Gloss paper option looks premium. Highly recommend.", helpful: 21 },
  { id: 4, name: "Sneha Nair",    initials: "SN", rating: 3, date: new Date(Date.now() - 60 * 86400000).toISOString(), text: "Decent product but packaging could be better. Cards are good quality though.", helpful: 5 },
  { id: 5, name: "Karan Verma",   initials: "KV", rating: 5, date: new Date(Date.now() - 2 * 86400000).toISOString(),  text: "Fast turnaround, exactly what I needed for my business launch. Will order in bulk next time.", helpful: 17 },
  { id: 6, name: "Meena Pillai",  initials: "MP", rating: 4, date: new Date(Date.now() - 90 * 86400000).toISOString(), text: "Great matte finish, very elegant. The rounded corners option is a nice touch.", helpful: 9 },
];

const STEPS = ["Configure", "Upload Design", "Review & Order"];

// ─── Avatar color map ─────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { bg: "#EEF2FF", text: "#4338CA" },
  { bg: "#FFF7ED", text: "#C2410C" },
  { bg: "#F0FDF4", text: "#15803D" },
  { bg: "#FDF4FF", text: "#9333EA" },
  { bg: "#FFF1F2", text: "#BE123C" },
  { bg: "#F0F9FF", text: "#0369A1" },
];

function avatarColor(initials: string) {
  const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg { id: number; type: "success" | "error" | "info"; text: string }

function useToast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const show = useCallback((type: ToastMsg["type"], text: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  const dismiss = useCallback((id: number) => setToasts(t => t.filter(x => x.id !== id)), []);
  return { toasts, show, dismiss };
}

function ToastStack({ toasts, onDismiss }: { toasts: ToastMsg[]; onDismiss: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-28 right-5 z-50 flex flex-col gap-2.5 lg:bottom-8">
      {toasts.map(t => (
        <div key={t.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white max-w-[280px]
            ${t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-rose-600" : "bg-neutral-900"}`}
          style={{ animation: "slideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
          {t.type === "success" ? <CheckCheck className="w-4 h-4 shrink-0" />
           : t.type === "error"  ? <AlertCircle className="w-4 h-4 shrink-0" />
           :                       <Info className="w-4 h-4 shrink-0" />}
          <span className="flex-1 text-[13px]">{t.text}</span>
          <button onClick={() => onDismiss(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-4 h-4" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${cls} transition-colors ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-neutral-200 fill-neutral-200"}`} />
      ))}
    </div>
  );
}

// ─── Step Progress ────────────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-10">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500
              ${i < current   ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/30"
              : i === current ? "bg-white border-2 border-neutral-900 text-neutral-900 shadow-md shadow-neutral-900/10"
              :                 "bg-white border-2 border-neutral-200 text-neutral-300"}`}>
              {i < current
                ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                : <span className="font-bold">{i + 1}</span>}
              {i === current && (
                <span className="absolute inset-0 rounded-full border-2 border-neutral-900 animate-ping opacity-20" />
              )}
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-widest hidden sm:block transition-colors duration-300
              ${i === current ? "text-neutral-900" : i < current ? "text-neutral-500" : "text-neutral-300"}`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-px mx-4 overflow-hidden rounded-full bg-neutral-100">
              <div className={`h-full bg-neutral-900 transition-all duration-700 ease-out ${i < current ? "w-full" : "w-0"}`} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">{label}</p>
      {hint && (
        <span className="group relative cursor-help">
          <Info className="w-3 h-3 text-neutral-300 hover:text-neutral-500 transition-colors" />
          <span className="absolute left-5 -top-1 w-52 text-xs bg-neutral-900 text-white px-3 py-2 rounded-xl
            opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 shadow-2xl leading-relaxed font-medium">
            {hint}
          </span>
        </span>
      )}
    </div>
  );
}

// ─── Option Pill ─────────────────────────────────────────────────────────────

function OptionPill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 select-none overflow-hidden group
        ${active
          ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/20 scale-[1.02]"
          : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 hover:scale-[1.01]"}`}>
      {active && (
        <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      )}
      {children}
    </button>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────

function UploadZone({
  label, file, preview, onUpload, onRemove,
}: {
  label: string;
  file: File | null;
  preview: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  const inputId = `upload-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2.5">{label}</p>
      {!file ? (
        <label htmlFor={inputId}
          className="flex flex-col items-center justify-center gap-3 p-7 rounded-2xl border-2 border-dashed border-neutral-200
            bg-white cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-300 group">
          <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Upload className="w-5 h-5 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 font-semibold">
              Drop file or <span className="text-neutral-900 underline underline-offset-2">browse</span>
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 font-medium">PNG · JPG · PDF · AI · EPS · Max 50MB</p>
          </div>
          <input id={inputId} type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.ai,.eps" onChange={onUpload} />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-white group shadow-sm">
          {preview ? (
            <img src={preview} alt={label} className="w-full h-40 object-cover" />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-neutral-50">
              <Image className="w-8 h-8 text-neutral-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end p-4">
            <div className="flex items-center gap-2 w-full">
              <p className="text-xs text-white font-bold flex-1 truncate">{file.name}</p>
              <button onClick={onRemove}
                className="p-1.5 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-rose-500 text-white transition-all">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            ✓ Ready
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────

function OrderSummaryStrip({
  variant, quantityId, useCustomQty, customQty, totalPrice, frontFile, sides, backFile,
}: {
  variant: VariantOption | null;
  quantityId: string;
  useCustomQty: boolean;
  customQty: string;
  totalPrice: number;
  frontFile: File | null;
  sides: string;
  backFile: File | null;
}) {
  if (!variant) return null;
  const row = variant.prices.find(p => p.id === quantityId);
  const qty = useCustomQty ? customQty : row ? `${row.min_qty}` : "—";

  const items = [
    { label: "Size",   value: variant.size.name       },
    { label: "Paper",  value: variant.paperType.name  },
    { label: "Print",  value: variant.printType.name  },
    { label: "Cut",    value: variant.cutType.name    },
    { label: "Sides",  value: sides === "1" ? "Single" : "Double" },
    { label: "Qty",    value: qty !== "—" ? `${qty} pcs` : "—"   },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
      <div className="px-4 pt-4 pb-3 border-b border-neutral-100 bg-black">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em]">Order Summary</p>
      </div>
      <div className="px-4 py-3">
        <div className="grid grid-cols-3 gap-0">
          {items.map(({ label, value }, idx) => (
            <div key={label} className={`py-2 ${idx % 3 !== 2 ? "border-r border-neutral-100 pr-3 mr-3" : ""}`}>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-[11px] font-bold text-neutral-800 truncate">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 pb-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <div>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Design Files</p>
          <div className="flex items-center gap-2">
            {frontFile
              ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Front</span>
              : <span className="text-[10px] text-neutral-300 font-semibold">No design</span>}
            {sides === "2" && (
              backFile
                ? <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><Check className="w-3 h-3" /> Back</span>
                : <span className="text-[10px] text-amber-500 font-bold">Back required</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-neutral-900 tracking-tight">
            {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: typeof MOCK_REVIEWS[0] }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted]     = useState(false);
  const colors = avatarColor(review.initials);

  return (
    <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 tracking-wider"
            style={{ background: colors.bg, color: colors.text }}>
            {review.initials}
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-800 leading-none mb-1">{review.name}</p>
            <p className="text-[10px] text-neutral-400 font-medium">{formatReviewDate(review.date)}</p>
          </div>
        </div>
        <div className="shrink-0 pt-0.5">
          <Stars rating={review.rating} />
        </div>
      </div>

      {/* Body */}
      <p className="text-[13px] text-neutral-600 leading-relaxed">{review.text}</p>

      {/* Helpful */}
      <div className="flex items-center gap-2 pt-1 border-t border-neutral-50">
        <button
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg transition-all
            ${voted
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 border border-transparent"}`}>
          <ThumbsUp className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsSection({ product }: { product: Product }) {
  const [filter, setFilter] = useState<number | null>(null);

  const filtered = filter
    ? MOCK_REVIEWS.filter(r => r.rating === filter)
    : MOCK_REVIEWS;

  const avgRating = Number(product.rating || 4.2);
  const totalReviews = product.review_count || 90;

  const STAR_PCT: Record<number, number> = { 5: 68, 4: 22, 3: 7, 2: 2, 1: 1 };

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mt-10">
      {/* Section Header */}
      <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-4 h-4 text-neutral-400" />
          <h2 className="product-name text-xl font-normal text-neutral-900">Customer Reviews</h2>
        </div>
        <p className="text-xs text-neutral-400 font-medium">What our customers say about this product</p>
      </div>

      <div className="px-6 lg:px-8 py-6 space-y-7">
        {/* Rating Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
          {/* Big score */}
          <div className="flex flex-col items-center justify-center px-4 sm:pr-8 sm:border-r sm:border-neutral-200">
            <p className="price-display text-6xl font-normal text-neutral-900 leading-none">{avgRating}</p>
            <Stars rating={avgRating} size="md" />
            <p className="text-[10px] text-neutral-400 mt-2 font-semibold uppercase tracking-wider">{totalReviews} reviews</p>
          </div>

          {/* Breakdown bars */}
          <div className="flex flex-col justify-center space-y-2.5">
            {[5, 4, 3, 2, 1].map(star => {
              const pct = STAR_PCT[star] ?? 0;
              return (
                <button
                  key={star}
                  onClick={() => setFilter(f => f === star ? null : star)}
                  className={`flex items-center gap-3 text-xs group transition-all rounded-lg px-2 py-1 -mx-2
                    ${filter === star ? "bg-amber-50" : "hover:bg-neutral-100/60"}`}>
                  <div className="flex items-center gap-1 w-6 shrink-0">
                    <span className={`font-bold tabular-nums ${filter === star ? "text-amber-700" : "text-neutral-500"}`}>{star}</span>
                    <Star className={`w-3 h-3 ${filter === star ? "text-amber-500 fill-amber-500" : "text-amber-400 fill-amber-400"}`} />
                  </div>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${filter === star ? "bg-amber-500" : "bg-neutral-900"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`w-8 text-right shrink-0 font-semibold tabular-nums ${filter === star ? "text-amber-700" : "text-neutral-400"}`}>
                    {pct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter badge */}
        {filter && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-medium">Showing:</span>
            <button
              onClick={() => setFilter(null)}
              className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-all">
              {filter} star reviews
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Review Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-neutral-300" />
            </div>
            <p className="text-sm font-semibold text-neutral-500">No reviews found</p>
            <p className="text-xs text-neutral-400 mt-1">Try a different star filter</p>
          </div>
        )}

        {/* Load more stub */}
        <div className="flex justify-center pt-2">
          <button className="text-xs font-bold text-neutral-500 hover:text-neutral-900 border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm px-5 py-2.5 rounded-xl transition-all">
            Load more reviews
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProductDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, show: showToast, dismiss } = useToast();

  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [variants, setVariants] = useState<VariantOption[]>([]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery,        setShowGallery]        = useState(false);
  const [isFavorite,         setIsFavorite]         = useState(false);
  const [copied,             setCopied]             = useState(false);

  const [selectedSize,      setSelectedSize]      = useState("");
  const [selectedPaperType, setSelectedPaperType] = useState("");
  const [selectedPrintType, setSelectedPrintType] = useState("");
  const [selectedCutType,   setSelectedCutType]   = useState("");
  const [selectedSides,     setSelectedSides]     = useState("1");

  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [customQty,        setCustomQty]        = useState<string>("");
  const [useCustomQty,     setUseCustomQty]     = useState(false);

  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
  const [totalPrice,      setTotalPrice]      = useState(0);

  const [frontFile,    setFrontFile]    = useState<File | null>(null);
  const [backFile,     setBackFile]     = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview,  setBackPreview]  = useState<string | null>(null);

  const currentStep = useMemo(() => {
    if (!selectedVariant || !selectedQuantity) return 0;
    if (!frontFile) return 1;
    return 2;
  }, [selectedVariant, selectedQuantity, frontFile]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
        const raw = res.data.product;
        const parsed = {
          ...raw,
          images:         safeParse(raw.images),
          related_images: safeParse(raw.related_images),
        };
        setProduct(enrichProductData(parsed));
        if (Array.isArray(raw.variants) && raw.variants.length > 0) {
          initVariants(raw.variants);
        }
      } catch {
        showToast("error", "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const initVariants = (variantData: ProductVariant[]) => {
    const processed: VariantOption[] = variantData.map(v => {
      const prices = v.prices || [];
      const vals   = prices.map((p: VariantPrice) => p.price);
      return {
        id:          v.id,
        variantId:   v.id,
        size:        { id: v.size_id,       name: v.size_name       || "Standard" },
        paperType:   { id: v.paper_type_id,  name: v.paper_type_name || "Standard" },
        printType:   { id: v.print_type_id,  name: v.print_type_name || "Digital"  },
        cutType:     { id: v.cut_type_id,    name: v.cut_type_name   || "Straight" },
        sides:       v.sides        || 1,
        orientation: v.orientation  || "Portrait",
        prices,
        minPrice:    vals.length ? Math.min(...vals) : 0,
        maxPrice:    vals.length ? Math.max(...vals) : 0,
      };
    });
    setVariants(processed);

    const first = processed[0];
    setSelectedSize(first.size.name);
    setSelectedPaperType(first.paperType.name);
    setSelectedPrintType(first.printType.name);
    setSelectedCutType(first.cutType.name);
    setSelectedSides(String(first.sides));
    setSelectedVariant(first);
    if (first.prices.length) {
      setSelectedQuantity(first.prices[0].id);
      setTotalPrice(first.prices[0].price);
    }
  };

  const allSizes = useMemo(() => {
    const map = new Map<string, Size>();
    variants.forEach(v => { if (!map.has(v.size.name)) map.set(v.size.name, v.size); });
    return Array.from(map.values());
  }, [variants]);

  const availablePaperTypes = useMemo(() => {
    const map = new Map<string, PaperType>();
    variants.filter(v => v.size.name === selectedSize)
      .forEach(v => { if (!map.has(v.paperType.name)) map.set(v.paperType.name, v.paperType); });
    return Array.from(map.values());
  }, [variants, selectedSize]);

  const availablePrintTypes = useMemo(() => {
    const map = new Map<string, PrintType>();
    variants.filter(v => v.size.name === selectedSize && v.paperType.name === selectedPaperType)
      .forEach(v => { if (!map.has(v.printType.name)) map.set(v.printType.name, v.printType); });
    return Array.from(map.values());
  }, [variants, selectedSize, selectedPaperType]);

  const availableCutTypes = useMemo(() => {
    const map = new Map<string, CutType>();
    variants.filter(v =>
      v.size.name === selectedSize &&
      v.paperType.name === selectedPaperType &&
      v.printType.name === selectedPrintType
    ).forEach(v => { if (!map.has(v.cutType.name)) map.set(v.cutType.name, v.cutType); });
    return Array.from(map.values());
  }, [variants, selectedSize, selectedPaperType, selectedPrintType]);

  const handleSizeChange = useCallback((name: string) => {
    setSelectedSize(name);
    const forSize = variants.filter(v => v.size.name === name);
    if (!forSize.length) return;
    const firstPaper = forSize[0].paperType.name;
    setSelectedPaperType(firstPaper);
    const forPaper = forSize.filter(v => v.paperType.name === firstPaper);
    const firstPrint = forPaper[0]?.printType.name ?? forSize[0].printType.name;
    setSelectedPrintType(firstPrint);
    const forPrint = forPaper.filter(v => v.printType.name === firstPrint);
    const firstCut = forPrint[0]?.cutType.name ?? forPaper[0]?.cutType.name ?? forSize[0].cutType.name;
    setSelectedCutType(firstCut);
  }, [variants]);

  const handlePaperChange = useCallback((name: string) => {
    setSelectedPaperType(name);
    const forPaper = variants.filter(v => v.size.name === selectedSize && v.paperType.name === name);
    if (!forPaper.length) return;
    const firstPrint = forPaper[0].printType.name;
    setSelectedPrintType(firstPrint);
    const forPrint = forPaper.filter(v => v.printType.name === firstPrint);
    const firstCut = forPrint[0]?.cutType.name ?? forPaper[0].cutType.name;
    setSelectedCutType(firstCut);
  }, [variants, selectedSize]);

  const handlePrintChange = useCallback((name: string) => {
    setSelectedPrintType(name);
    const forPrint = variants.filter(v =>
      v.size.name === selectedSize && v.paperType.name === selectedPaperType && v.printType.name === name
    );
    if (forPrint.length) setSelectedCutType(forPrint[0].cutType.name);
  }, [variants, selectedSize, selectedPaperType]);

  useEffect(() => {
    if (!variants.length) return;
    const match = variants.find(v =>
      v.size.name === selectedSize &&
      v.paperType.name === selectedPaperType &&
      v.printType.name === selectedPrintType &&
      v.cutType.name === selectedCutType
    ) ?? null;
    setSelectedVariant(match);
    if (match?.prices.length) {
      setSelectedQuantity(match.prices[0].id);
      setUseCustomQty(false);
      setCustomQty("");
      setTotalPrice(match.prices[0].price);
    } else {
      setTotalPrice(0);
    }
  }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, variants]);

  useEffect(() => {
    if (!selectedVariant || !selectedQuantity || useCustomQty) return;
    const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
    if (row) setTotalPrice(row.price);
  }, [selectedQuantity, selectedVariant, useCustomQty]);

  const allImages = useMemo(() => [
    ...(Array.isArray(product?.images)         ? product!.images         : []),
    ...(Array.isArray(product?.related_images) ? product!.related_images : []),
  ], [product]);

  const customQtyPrice = useMemo(() => {
    if (!selectedVariant || !customQty) return null;
    const qty = parseInt(customQty, 10);
    if (isNaN(qty) || qty < 1) return null;
    return selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty)
      .find(p => qty >= p.min_qty)?.price ?? null;
  }, [customQty, selectedVariant]);

  const ctaDisabled =
    !selectedVariant ||
    (!useCustomQty && !selectedQuantity) ||
    (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
    !frontFile ||
    (selectedSides === "2" && !backFile);

  const ctaLabel = useMemo(() => {
    if (!selectedVariant)                   return "Select options to continue";
    if (!selectedQuantity && !useCustomQty) return "Select a quantity";
    if (!frontFile)                         return "Upload front design to continue";
    if (selectedSides === "2" && !backFile) return "Upload back design to continue";
    return "Continue to Design Review";
  }, [selectedVariant, selectedQuantity, useCustomQty, frontFile, selectedSides, backFile]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast("success", "Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
    showToast("success", "Front design uploaded!");
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setBackFile(file);
    setBackPreview(URL.createObjectURL(file));
    showToast("success", "Back design uploaded!");
  };

  const handleContinue = () => {
    if (!selectedVariant || !frontFile) return;
    if (selectedSides === "2" && !backFile) {
      showToast("error", "Please upload the back design too.");
      return;
    }
    let quantityNumber: number;
    let unitPrice: number;
    if (useCustomQty) {
      const parsed = parseInt(customQty, 10);
      if (isNaN(parsed) || parsed < 1) { showToast("error", "Enter a valid quantity."); return; }
      quantityNumber = parsed;
      const tier = selectedVariant.prices.slice().sort((a, b) => b.min_qty - a.min_qty)
        .find(p => parsed >= p.min_qty);
      unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
    } else {
      const row = selectedVariant.prices.find(p => p.id === selectedQuantity);
      if (!row) { showToast("error", "Select a quantity."); return; }
      quantityNumber = row.min_qty;
      unitPrice = row.price;
    }
    navigate("/design-review", {
      state: {
        product, variant: selectedVariant, quantity: quantityNumber,
        priceId: useCustomQty ? null : selectedQuantity,
        selected_options: {
          size: selectedVariant.size?.name ?? "",
          material: selectedVariant.paperType?.name ?? "",
          lamination: selectedVariant.printType?.name ?? "",
        },
        frontDesign: frontFile, backDesign: selectedSides === "2" ? backFile : null,
        frontPreview, backPreview, basePrice: unitPrice, totalPrice: unitPrice, sides: selectedSides,
      },
    });
  };

  // ── Loading & Error States ────────────────────────────────────────────────

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="relative w-10 h-10 mx-auto">
          <div className="absolute inset-0 rounded-full border-[3px] border-neutral-100" />
          <div className="absolute inset-0 rounded-full border-[3px] border-neutral-900 border-t-transparent animate-spin" />
        </div>
        <p className="text-xs text-neutral-400 font-semibold uppercase tracking-widest">Loading</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 text-neutral-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Product Not Found</h2>
          <p className="text-sm text-neutral-400 mt-1">This product may have been removed or the link is invalid.</p>
        </div>
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 hover:gap-3 transition-all">
          <ChevronLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif" }}>

      {/* Global style injection */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes slideIn { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(8px);  } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .price-display { font-family: 'DM Serif Display', serif; }
        .product-name  { font-family: 'DM Serif Display', serif; }
      `}</style>

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center gap-2 text-[11px] text-neutral-400 overflow-x-auto">
          <button onClick={() => navigate("/")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide">Home</button>
          <span className="text-neutral-200 font-light">/</span>
          <button onClick={() => navigate("/products")}
            className="hover:text-neutral-900 transition-colors font-semibold shrink-0 tracking-wide">Products</button>
          <span className="text-neutral-200 font-light">/</span>
          <span className="text-neutral-700 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">

        <StepProgress current={currentStep} />

        {/* ══════════════════════════════════════════════════════════
            ROW 1 — Image Gallery + Product Hero Info
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 mb-12">

          {/* ── Image Panel ── */}
          <div className="flex gap-3">
            {allImages.length > 1 && (
              <div className="flex flex-col gap-2 shrink-0 w-[60px]">
                {allImages.map((img: any, idx: number) => (
                  <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                    className={`w-full aspect-square rounded-xl overflow-hidden border transition-all duration-200
                      ${selectedImageIndex === idx
                        ? "ring-2 ring-neutral-900 ring-offset-1 opacity-100 scale-105 border-transparent"
                        : "opacity-40 hover:opacity-75 hover:scale-105 border-neutral-100"}`}>
                    <img src={getImageUrl(img.url || img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="relative flex-1 rounded-3xl overflow-hidden bg-neutral-50 aspect-square group border border-neutral-100">
              <img
                src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                onError={e => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x700?text="; }}
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button onClick={handleShare}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100">
                  {copied
                    ? <CheckCheck className="w-4 h-4 text-emerald-500" />
                    : <Share2 className="w-4 h-4 text-neutral-600" />}
                </button>
                <button onClick={() => setIsFavorite(f => !f)}
                  className="w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all border border-neutral-100">
                  <Heart className={`w-4 h-4 transition-all ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "text-neutral-400"}`} />
                </button>
              </div>

              <button onClick={() => setShowGallery(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-2 rounded-full shadow-sm border border-neutral-100
                  text-xs font-bold text-neutral-700 flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100">
                <ZoomIn className="w-3.5 h-3.5" /> Zoom
              </button>

              {allImages.length > 1 && (
                <>
                  <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-4 h-4 text-neutral-700" />
                  </button>
                  <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-neutral-100 hover:bg-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-4 h-4 text-neutral-700" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_: any, i: number) => (
                      <button key={i} onClick={() => setSelectedImageIndex(i)}
                        className={`rounded-full transition-all duration-300 ${i === selectedImageIndex ? "w-5 h-1.5 bg-neutral-900" : "w-1.5 h-1.5 bg-neutral-900/30"}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-6 fade-up">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full uppercase tracking-[0.15em]">
                {product.sku}
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                In Stock
              </span>
            </div>

            <div>
              <h1 className="product-name text-[2rem] leading-[1.1] font-normal text-neutral-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <Stars rating={Number(product.rating || 4.2)} size="md" />
                <span className="text-sm font-bold text-neutral-800">{product.rating || 4.2}</span>
                <span className="text-sm text-neutral-400">({product.review_count || 90} reviews)</span>
              </div>
            </div>

            {/* Price Block */}
            <div className="flex items-end gap-3 p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              <div>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Starting from</p>
                <p className="price-display text-5xl font-normal text-neutral-900 tracking-tight leading-none">
                  ₹{totalPrice > 0
                    ? totalPrice.toFixed(2)
                    : (selectedVariant?.minPrice ?? 0).toFixed(2)}
                </p>
              </div>
              {selectedVariant && (
                <div className="mb-1.5">
                  <p className="text-xs text-neutral-400 font-medium">
                    {useCustomQty
                      ? `/ ${customQty || "—"} pcs`
                      : (() => {
                          const r = selectedVariant.prices.find(p => p.id === selectedQuantity);
                          return r ? `/ ${r.min_qty}+ pcs` : "";
                        })()}
                  </p>
                  {selectedVariant.minPrice !== selectedVariant.maxPrice && (
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      ₹{selectedVariant.minPrice.toFixed(0)}–{selectedVariant.maxPrice.toFixed(0)} range
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quick Spec Chips */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Layers className="w-4 h-4" />,      label: "Sizes",  value: `${allSizes.length}`            },
                { icon: <PackageCheck className="w-4 h-4" />, label: "Papers", value: `${availablePaperTypes.length}` },
                { icon: <Printer className="w-4 h-4" />,      label: "Prints", value: `${availablePrintTypes.length}` },
                { icon: <Scissors className="w-4 h-4" />,     label: "Cuts",   value: `${availableCutTypes.length}`   },
              ].map(({ icon, label, value }) => (
                <div key={label}
                  className="flex flex-col items-center gap-1.5 py-3.5 rounded-xl bg-white border border-neutral-200 text-center hover:border-neutral-300 hover:shadow-sm transition-all">
                  <div className="text-neutral-500">{icon}</div>
                  <p className="text-lg font-bold text-neutral-900 leading-none">{value}</p>
                  <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Min Order */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
              <PackageCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[12px] text-amber-800 font-semibold">
                Minimum order: <strong>{product.min_order_qty || 100} pieces</strong>
              </span>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Truck className="w-3.5 h-3.5" />,    label: "Fast Delivery",    sub: "3–5 business days",   bg: "bg-blue-50",   icon_bg: "bg-blue-600"   },
                { icon: <Shield className="w-3.5 h-3.5" />,   label: "Quality Assured",  sub: "100% satisfaction",   bg: "bg-emerald-50", icon_bg: "bg-emerald-600" },
                { icon: <RefreshCw className="w-3.5 h-3.5" />, label: "Easy Reorder",     sub: "Save your design",    bg: "bg-violet-50",  icon_bg: "bg-violet-600"  },
                { icon: <Zap className="w-3.5 h-3.5" />,      label: "Quick Turnaround", sub: "Same-day processing", bg: "bg-amber-50",  icon_bg: "bg-amber-500"   },
              ].map(b => (
                <div key={b.label}
                  className={`flex items-center gap-2.5 bg-white rounded-xl border border-neutral-200 px-3.5 py-3 hover:border-neutral-300 hover:shadow-sm transition-all`}>
                  <div className={`w-7 h-7 rounded-lg ${b.icon_bg} text-white flex items-center justify-center shrink-0`}>
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-800 leading-none">{b.label}</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ROW 2 — Configure + Upload
        ══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* ── Configure Panel ── */}
          <div className="space-y-7 bg-blue!">
            <div className="pb-4 border-b border-neutral-100">
              <h2 className="product-name text-xl font-normal text-neutral-900">Configure Your Order</h2>
              <p className="text-xs text-neutral-400 mt-1.5 font-medium">
                Select size — paper, print &amp; cut auto-update to a valid match.
              </p>
            </div>

            {allSizes.length > 0 && (
              <div>
                <SectionLabel label="Size" hint="Physical dimensions of the printed card" />
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map(s => (
                    <OptionPill key={s.id} active={selectedSize === s.name} onClick={() => handleSizeChange(s.name)}>
                      <span className="text-[13px]">{s.name}</span>
                      {s.dimensions && <span className="text-[10px] opacity-60 font-normal mt-0.5">{s.dimensions}</span>}
                    </OptionPill>
                  ))}
                </div>
              </div>
            )}

            {availablePaperTypes.length > 0 && (
              <div>
                <SectionLabel label="Paper Type" hint="Material and finish of the paper used" />
                <div className="grid grid-cols-3 gap-2">
                  {availablePaperTypes.map(p => (
                    <OptionPill key={p.id} active={selectedPaperType === p.name} onClick={() => handlePaperChange(p.name)}>
                      <span className="text-[13px]">{p.name}</span>
                    </OptionPill>
                  ))}
                </div>
              </div>
            )}

            {availablePrintTypes.length > 0 && (
              <div>
                <SectionLabel label="Print Type" hint="Printing technology used for production" />
                <div className="grid grid-cols-3 gap-2">
                  {availablePrintTypes.map(p => (
                    <OptionPill key={p.id} active={selectedPrintType === p.name} onClick={() => handlePrintChange(p.name)}>
                      <span className="text-[13px]">{p.name}</span>
                    </OptionPill>
                  ))}
                </div>
              </div>
            )}

            {availableCutTypes.length > 0 && (
              <div>
                <SectionLabel label="Cut Type" hint="Edge finishing style of the final card" />
                <div className="grid grid-cols-3 gap-2">
                  {availableCutTypes.map(c => (
                    <OptionPill key={c.id} active={selectedCutType === c.name} onClick={() => setSelectedCutType(c.name)}>
                      <span className="text-[13px]">{c.name}</span>
                    </OptionPill>
                  ))}
                </div>
              </div>
            )}

            <div>
              <SectionLabel label="Printing Sides" />
              <div className="grid grid-cols-2 gap-2">
                {SIDES_OPTIONS.map(o => (
                  <OptionPill key={o.value} active={selectedSides === o.value} onClick={() => setSelectedSides(o.value)}>
                    <span className="text-[13px]">{o.label}</span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">{o.desc}</span>
                  </OptionPill>
                ))}
              </div>
            </div>

            {selectedVariant && selectedVariant.prices.length > 0 && (
              <div>
                <SectionLabel label="Quantity" hint="Choose a tier or enter a custom amount" />
                <div className="grid grid-cols-3 gap-2">
                  {selectedVariant.prices.map(price => (
                    <OptionPill
                      key={price.id}
                      active={!useCustomQty && selectedQuantity === price.id}
                      onClick={() => { setSelectedQuantity(price.id); setUseCustomQty(false); setCustomQty(""); }}>
                      <span className="text-[13px] font-bold">
                        {price.min_qty}
                        {price.max_qty && price.max_qty !== price.min_qty ? `–${price.max_qty}` : "+"}
                        {" "}pcs
                      </span>
                      <span className={`text-[11px] font-bold mt-0.5 transition-colors ${
                        !useCustomQty && selectedQuantity === price.id ? "text-white/70" : "text-neutral-400"}`}>
                        ₹{price.price.toFixed(2)}
                      </span>
                    </OptionPill>
                  ))}
                  <OptionPill active={useCustomQty} onClick={() => { setUseCustomQty(true); setSelectedQuantity(""); }}>
                    <Edit3 className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-[13px]">Custom</span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">Any qty</span>
                  </OptionPill>
                </div>

                {useCustomQty && (
                  <div className="mt-3 flex items-center gap-2.5">
                    <input
                      type="number"
                      min={product.min_order_qty || 1}
                      value={customQty}
                      onChange={e => setCustomQty(e.target.value)}
                      placeholder={`Min ${product.min_order_qty || 100} pcs`}
                      className="flex-1 border border-neutral-200 focus:border-neutral-900 rounded-xl px-4 py-2.5 text-sm font-medium outline-none transition-colors bg-white placeholder-neutral-300"
                    />
                    {customQtyPrice !== null && (
                      <div className="shrink-0 text-right px-3.5 py-2.5 bg-neutral-900 text-white rounded-xl">
                        <p className="text-[9px] text-white/60 uppercase tracking-wider font-bold">Price</p>
                        <p className="text-base font-bold">₹{customQtyPrice.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                )}

                {customQty && parseInt(customQty) < (product.min_order_qty || 100) && parseInt(customQty) > 0 && (
                  <p className="text-[11px] text-amber-600 flex items-center gap-1.5 mt-2 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Minimum order is {product.min_order_qty || 100} pieces.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Upload + Summary + CTA ── */}
          <div className="space-y-5 ">
            <div className="pb-4 border-b border-neutral-100">
              <h2 className="product-name text-xl font-normal text-neutral-900">Upload Your Design</h2>
              <p className="text-xs text-neutral-400 mt-1.5 font-medium">High-resolution artwork recommended (PDF, AI, PNG at 300dpi+).</p>
            </div>

            <UploadZone
              label="Front Design"
              file={frontFile}
              preview={frontPreview}
              onUpload={handleFrontUpload}
              onRemove={() => { setFrontFile(null); setFrontPreview(null); }}
            />

            {selectedSides === "2" && (
              <UploadZone
                label="Back Design"
                file={backFile}
                preview={backPreview}
                onUpload={handleBackUpload}
                onRemove={() => { setBackFile(null); setBackPreview(null); }}
              />
            )}

            <OrderSummaryStrip
              variant={selectedVariant}
              quantityId={selectedQuantity}
              useCustomQty={useCustomQty}
              customQty={customQty}
              totalPrice={totalPrice}
              frontFile={frontFile}
              sides={selectedSides}
              backFile={backFile}
            />

            {/* Desktop CTA */}
            <button
              onClick={handleContinue}
              disabled={ctaDisabled}
              className="hidden lg:flex w-full items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all duration-300
                bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/25 hover:-translate-y-0.5
                disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0">
              <span>{ctaLabel}</span>
              {!ctaDisabled && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ROW 3 — Specs Table (standalone, no tabs)
        ══════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm mb-10">
          <div className="px-6 lg:px-8 pt-7 pb-5 border-b border-neutral-100">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-neutral-400" />
              <h2 className="product-name text-xl font-normal text-neutral-900">Product Specifications</h2>
            </div>
            <p className="text-xs text-neutral-400 font-medium">All variant combinations and available pricing tiers.</p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200">
                    {["Size", "Paper", "Print", "Cut", "Sides", "Min Qty", "Price"].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left font-bold text-neutral-400 uppercase tracking-[0.1em] whitespace-nowrap text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {variants.flatMap(v => v.prices.map(p => (
                    <tr key={`${v.id}-${p.id}`}
                      className={`transition-colors cursor-pointer hover:bg-neutral-50
                        ${selectedVariant?.id === v.id && selectedQuantity === p.id ? "bg-blue-50/40" : ""}`}>
                      <td className="px-4 py-3.5 font-bold text-neutral-800 whitespace-nowrap">{v.size.name}</td>
                      <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.paperType.name}</td>
                      <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.printType.name}</td>
                      <td className="px-4 py-3.5 text-neutral-500 whitespace-nowrap">{v.cutType.name}</td>
                      <td className="px-4 py-3.5 text-neutral-500">{v.sides === 1 ? "Single" : "Double"}</td>
                      <td className="px-4 py-3.5 text-neutral-500">{p.min_qty}+</td>
                      <td className="px-4 py-3.5 font-bold text-neutral-900">₹{p.price.toFixed(2)}</td>
                    </tr>
                  )))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════
            ROW 4 — Reviews Section (standalone, below specs)
        ══════════════════════════════════════════════════════════ */}
        <ReviewsSection product={product} />

      </div>

      {/* ── Mobile Sticky CTA ──────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 lg:hidden z-40 bg-white/98 backdrop-blur-md border-t border-neutral-100 px-4 pt-3 pb-4 shadow-2xl shadow-neutral-900/10">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest truncate">
              {selectedVariant
                ? `${selectedVariant.size.name} · ${selectedVariant.paperType.name}`
                : "Configure to get pricing"}
            </p>
            <p className="price-display text-xl font-normal text-neutral-900 leading-tight">
              {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : "—"}
            </p>
          </div>
          <button
            onClick={handleContinue}
            disabled={ctaDisabled}
            className="shrink-0 text-white px-5 py-3 rounded-xl text-[12px] font-bold transition-all
              bg-neutral-900 hover:bg-neutral-800 active:scale-95
              disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed">
            Continue →
          </button>
        </div>
      </div>

      {/* ── Image Gallery Modal ───────────────────────────────────── */}
      {showGallery && (
        <div className="fixed inset-0 z-50 bg-neutral-950/98 flex flex-col">
          <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-white/5">
            <div>
              <p className="text-white font-bold text-sm tracking-wide">{product.name}</p>
              <p className="text-white/30 text-xs font-medium mt-0.5">{selectedImageIndex + 1} / {allImages.length}</p>
            </div>
            <button onClick={() => setShowGallery(false)}
              className="text-white/50 hover:text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center px-20 relative overflow-hidden py-6">
            <img
              src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-2xl"
            />
            {allImages.length > 1 && (
              <>
                <button onClick={() => setSelectedImageIndex(p => p > 0 ? p - 1 : allImages.length - 1)}
                  className="absolute left-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setSelectedImageIndex(p => p < allImages.length - 1 ? p + 1 : 0)}
                  className="absolute right-5 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:scale-110">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {allImages.length > 1 && (
            <div className="flex justify-center gap-2 py-5 shrink-0 border-t border-white/5">
              {allImages.map((_: any, idx: number) => (
                <button key={idx} onClick={() => setSelectedImageIndex(idx)}
                  className={`rounded-full transition-all duration-300 ${idx === selectedImageIndex ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/20 hover:bg-white/40"}`} />
              ))}
            </div>
          )}
        </div>
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}