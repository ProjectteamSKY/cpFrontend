import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Star,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Truck,
  Shield,
  RotateCcw,
  Clock,
  Mail,
  Phone,
  Upload,
  Edit3,
  Info
} from "lucide-react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { Product, ProductVariant, VariantPrice } from "../../types/productlist";
import { getImageUrl, enrichProductData } from "../../utils/productutils";
import { API_BASE_URL } from "../../constants/productconstants";
import { useDesignUpload } from "../../hooks/useDesignUpload";
import { UploadDesignCard } from "../../components/product/UploadDesignCard";
import { AddToCartCard } from "../../components/product/AddToCartCard";
import { OrderSummaryCard } from "../../components/product/OrderSummaryCard";
// Define interfaces for the variant structure
interface Size {
  id: string;
  name: string;
  dimensions?: string;
}

interface PaperType {
  id: string;
  name: string;
  description?: string;
}

interface PrintType {
  id: string;
  name: string;
}

interface CutType {
  id: string;
  name: string;
}

interface VariantOption {
  id: string;
  variantId: string;
  size: Size;
  paperType: PaperType;
  printType: PrintType;
  cutType: CutType;
  sides: number;
  twoSideCut: number;
  fourSideCut: number;
  orientation: string;
  prices: VariantPrice[];
  minPrice: number;
  maxPrice: number;
}

// API Response interface
interface ApiResponse {
  status: string;
  product: Product;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Dynamic state based on variants
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedPaperType, setSelectedPaperType] = useState<string>("");
  const [selectedPrintType, setSelectedPrintType] = useState<string>("");
  const [selectedCutType, setSelectedCutType] = useState<string>("");
  const [selectedSides, setSelectedSides] = useState<string>("2"); // 1 or 2 sides
  const [selectedQuantity, setSelectedQuantity] = useState<string>("100");
  const [availableQuantities, setAvailableQuantities] = useState<{ min: number, max: number, price: number }[]>([]);

  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const {
    uploadedFile,
    uploadedPreview,
    uploadError,
    handleFileUpload,
    removeFile
  } = useDesignUpload();
  // Static options

  const handleUploadAndRedirect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleFileUpload(e);

    const file = e.target.files?.[0];
    if (!file || !selectedVariant) return;

    // Ensure quantity is a number
    const quantityNumber = parseInt(selectedQuantity, 10) || selectedVariant.prices[0].min_qty;
    console.log("quantityNumber", quantityNumber)
    // Build selected options dynamically
    const selectedOptions = {
      size: selectedVariant.size.name,
      material: selectedVariant.paperType.name,
      lamination: selectedVariant.printType.name,
    };

    setTimeout(() => {
      navigate("/design-review", {
        state: {
          product,
          variant: selectedVariant,
          quantity: quantityNumber,       // ✅ now a number
          priceId: selectedVariant.prices[0].id,
          selected_options: selectedOptions,
          designFile: file,
          preview: URL.createObjectURL(file),
          basePrice,
          totalPrice
        }
      });
    }, 300); // small delay to allow state update
  };

  const sidesOptions = [
    { label: "Single Sided", value: "1" },
    { label: "Double Sided", value: "2" }
  ];

  // Safe parse function for JSON strings
  const safeParse = (value: any): any[] => {
    if (!value) return [];
    try {
      if (typeof value === "string") {
        // Try to parse the string
        const parsed = JSON.parse(value);
        // If the parsed result is still a string, parse again
        if (typeof parsed === "string") {
          return JSON.parse(parsed);
        }
        return parsed;
      }
      return value;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);

        // Extract product data from response wrapper
        const rawData = res.data.product;

        // Parse image fields
        const parsedProduct = {
          ...rawData,
          images: safeParse(rawData.images),
          related_images: safeParse(rawData.related_images),
        };

        const enriched = enrichProductData(parsedProduct);
        setProduct(enriched);

        // Process variants if they exist
        if (rawData.variants && Array.isArray(rawData.variants)) {
          processVariants(rawData.variants);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Process variants into selectable options
  const processVariants = (variantData: ProductVariant[]) => {
    const processedVariants: VariantOption[] = variantData.map((v: ProductVariant) => {
      // Calculate min and max price from prices array
      const prices = v.prices || [];
      const priceValues = prices.map((p: VariantPrice) => p.price);
      const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
      const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

      // Set dimensions based on size name
      let dimensions = '89 x 51mm'; // default for business card
      if (v.size_name?.toLowerCase().includes('a4')) {
        dimensions = '210 x 297mm';
      } else if (v.size_name?.toLowerCase().includes('a5')) {
        dimensions = '148 x 210mm';
      }

      return {
        id: v.id,
        variantId: v.id,
        size: {
          id: v.size_id,
          name: v.size_name || 'Standard',
          dimensions: dimensions
        },
        paperType: {
          id: v.paper_type_id,
          name: v.paper_type_name || 'Standard'
        },
        printType: {
          id: v.print_type_id,
          name: v.print_type_name || 'Digital'
        },
        cutType: {
          id: v.cut_type_id,
          name: v.cut_type_name || 'Straight'
        },
        sides: v.sides || 2,
        twoSideCut: v.two_side_cut || 0,
        fourSideCut: v.four_side_cut || 0,
        orientation: v.orientation || 'Portrait',
        prices: prices,
        minPrice: minPrice,
        maxPrice: maxPrice
      };
    });

    setVariants(processedVariants);

    // Set default selections based on first variant
    if (processedVariants.length > 0) {
      const firstVariant = processedVariants[0];
      setSelectedVariant(firstVariant);
      setSelectedSize(firstVariant.size.name);
      setSelectedPaperType(firstVariant.paperType.name);
      setSelectedPrintType(firstVariant.printType.name);
      setSelectedCutType(firstVariant.cutType.name);
      setSelectedSides(firstVariant.sides.toString());

      // Process prices for quantity options
      if (firstVariant.prices.length > 0) {
        const firstPrice = firstVariant.prices[0];

        setSelectedQuantity(String(firstPrice.id));
        setBasePrice(firstPrice.price);
        setTotalPrice(firstPrice.price);
      }
    }
  };

  // Update selected variant when options change
  useEffect(() => {
    if (variants.length === 0) return;

    // Find variant matching current selections
    const matchingVariant = variants.find(v =>
      v.size.name === selectedSize &&
      v.paperType.name === selectedPaperType &&
      v.printType.name === selectedPrintType &&
      v.cutType.name === selectedCutType &&
      v.sides.toString() === selectedSides
    );

    if (matchingVariant) {
      setSelectedVariant(matchingVariant);

      // Update quantities and price
      if (matchingVariant.prices.length > 0) {
        const quantities = matchingVariant.prices.map((p: VariantPrice) => ({
          min: p.min_qty,
          max: p.max_qty,
          price: p.price
        }));
        setAvailableQuantities(quantities);

        // Find price for selected quantity or use first
        const quantityPrice = matchingVariant.prices.find(
          (p: VariantPrice) => p.min_qty <= parseInt(selectedQuantity) && p.max_qty >= parseInt(selectedQuantity)
        );

        if (quantityPrice) {
          setBasePrice(quantityPrice.price);
          setTotalPrice(quantityPrice.price);
        } else if (matchingVariant.prices[0]) {
          setBasePrice(matchingVariant.prices[0].price);
          setTotalPrice(matchingVariant.prices[0].price);
        }
      }
    }
  }, [selectedSize, selectedPaperType, selectedPrintType, selectedCutType, selectedSides, selectedQuantity, variants]);

  // Update price when quantity changes
  useEffect(() => {
    if (variants.length === 0) return;

    const matchingVariant = variants.find(v =>
      v.size.name === selectedSize &&
      v.paperType.name === selectedPaperType &&
      v.printType.name === selectedPrintType &&
      v.cutType.name === selectedCutType &&
      v.sides.toString() === selectedSides
    );

    if (!matchingVariant) return;

    setSelectedVariant(matchingVariant);

    if (matchingVariant.prices.length > 0) {
      const firstPrice = matchingVariant.prices[0];

      setSelectedQuantity(String(firstPrice.id));
      setBasePrice(firstPrice.price);
      setTotalPrice(firstPrice.price);
    }
  }, [
    selectedSize,
    selectedPaperType,
    selectedPrintType,
    selectedCutType,
    selectedSides,
    variants
  ]);

  useEffect(() => {
    if (!selectedVariant || !selectedQuantity) return;

    const selectedPrice = selectedVariant.prices.find(
      (p) => String(p.id) === String(selectedQuantity)
    );

    if (selectedPrice) {
      setBasePrice(selectedPrice.price);
      setTotalPrice(selectedPrice.price);
    }
  }, [selectedQuantity, selectedVariant]);

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href
      }).catch(() => {
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Get unique options for dropdowns
  const getUniqueSizes = (): Size[] => {
    const sizes = new Map<string, Size>();
    variants.forEach(v => {
      if (!sizes.has(v.size.name)) {
        sizes.set(v.size.name, v.size);
      }
    });
    return Array.from(sizes.values());
  };

  const getUniquePaperTypes = (): PaperType[] => {
    const papers = new Map<string, PaperType>();
    variants.forEach(v => {
      if (!papers.has(v.paperType.name)) {
        papers.set(v.paperType.name, v.paperType);
      }
    });
    return Array.from(papers.values());
  };

  const getUniquePrintTypes = (): PrintType[] => {
    const prints = new Map<string, PrintType>();
    variants.forEach(v => {
      if (!prints.has(v.printType.name)) {
        prints.set(v.printType.name, v.printType);
      }
    });
    return Array.from(prints.values());
  };

  const getUniqueCutTypes = (): CutType[] => {
    const cuts = new Map<string, CutType>();
    variants.forEach(v => {
      if (!cuts.has(v.cutType.name)) {
        cuts.set(v.cutType.name, v.cutType);
      }
    });
    return Array.from(cuts.values());
  };

  // Merge both image arrays
  const allImages = [
    ...(Array.isArray(product?.images) ? product.images : []),
    ...(Array.isArray(product?.related_images) ? product.related_images : [])
  ];

  const handleAddToCart = async () => {
    if (!uploadedFile || !selectedVariant || !selectedQuantity) return;

    const formData = new FormData();
    formData.append("product_id", "product.id");
    formData.append("variant_id", selectedVariant.id);
    formData.append("price_id", selectedQuantity);
    formData.append("design_file", uploadedFile);

    try {
      await axios.post(`${API_BASE_URL}/api/cart/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D73D32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate(-1)} className="bg-[#D73D32] hover:bg-[#B83227]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#D73D32] mb-6 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 items-start">

          {/* ================= IMAGE SECTION ================= */}
          <div className="lg:col-span-7 flex gap-4">

            {/* Thumbnails - NO SCROLL */}
            {allImages.length > 1 && (
              <div className="flex flex-col gap-3">
                {allImages.map((image: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                      ? 'border-[#D73D32] shadow-lg'
                      : 'border-gray-200 hover:border-[#D73D32]/50'
                      }`}
                  >
                    <img
                      src={getImageUrl(image.url || image)}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 max-w-[600px] aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl group">
              <img
                src={getImageUrl(
                  allImages[selectedImageIndex]?.url || allImages[selectedImageIndex]
                )}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />

              {/* Zoom */}
              <button
                onClick={() => setShowImageGallery(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <ZoomIn className="w-5 h-5 text-[#D73D32]" />
              </button>

              {/* Favorite */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${isFavorite
                    ? 'fill-[#D73D32] text-[#D73D32]'
                    : 'text-gray-600'
                    }`}
                />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}
          <div className="lg:col-span-5 space-y-6">

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(Number(product.rating || 4.2))
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {product.rating || 4.2} ({product.review_count || 90} Reviews)
                </span>
              </div>
            </div>

            <Card className="p-5 bg-gradient-to-r from-[#D73D32]/5 to-[#B83227]/5">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Available in {getUniqueSizes().length} size option(s)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>{getUniquePaperTypes().length} paper type option(s)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>{getUniquePrintTypes().length} print type option(s)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>{getUniqueCutTypes().length} cut type option(s)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Choose single or double sided printing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Minimum order: {product.min_order_qty || 100} pieces</span>
                </li>
              </ul>
            </Card>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
              Personalize Your Order
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select from available options to personalise your product
            </p>

            {/* Size Options */}
            {getUniqueSizes().length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Size:</Label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUniqueSizes().map((size) => (
                      <div key={size.id}>
                        <RadioGroupItem
                          value={size.name}
                          id={`size-${size.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`size-${size.id}`}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSize === size.name
                            ? "border-[#D73D32] bg-[#D73D32]/5"
                            : "border-gray-200 hover:border-[#D73D32]/50"
                            }`}
                        >
                          <span className="font-medium text-sm">{size.name}</span>
                          {size.dimensions && (
                            <span className="text-xs text-gray-500">
                              {size.dimensions}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Paper Type */}
            {getUniquePaperTypes().length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Paper Type:
                </Label>
                <RadioGroup
                  value={selectedPaperType}
                  onValueChange={setSelectedPaperType}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUniquePaperTypes().map((paper) => (
                      <div key={paper.id}>
                        <RadioGroupItem
                          value={paper.name}
                          id={`paper-${paper.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`paper-${paper.id}`}
                          className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPaperType === paper.name
                            ? "border-[#D73D32] bg-[#D73D32]/5"
                            : "border-gray-200 hover:border-[#D73D32]/50"
                            }`}
                        >
                          <span className="font-medium text-sm">{paper.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Print Type */}
            {getUniquePrintTypes().length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Print Type:
                </Label>
                <RadioGroup
                  value={selectedPrintType}
                  onValueChange={setSelectedPrintType}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUniquePrintTypes().map((print) => (
                      <div key={print.id}>
                        <RadioGroupItem
                          value={print.name}
                          id={`print-${print.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`print-${print.id}`}
                          className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedPrintType === print.name
                            ? "border-[#D73D32] bg-[#D73D32]/5"
                            : "border-gray-200 hover:border-[#D73D32]/50"
                            }`}
                        >
                          <span className="font-medium text-sm">{print.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Cut Type */}
            {getUniqueCutTypes().length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Cut Type:
                </Label>
                <RadioGroup value={selectedCutType} onValueChange={setSelectedCutType}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getUniqueCutTypes().map((cut) => (
                      <div key={cut.id}>
                        <RadioGroupItem
                          value={cut.name}
                          id={`cut-${cut.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`cut-${cut.id}`}
                          className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedCutType === cut.name
                            ? "border-[#D73D32] bg-[#D73D32]/5"
                            : "border-gray-200 hover:border-[#D73D32]/50"
                            }`}
                        >
                          <span className="font-medium text-sm">{cut.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Printing Sides */}
            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">
                Printing Sides:
              </Label>
              <RadioGroup value={selectedSides} onValueChange={setSelectedSides}>
                <div className="grid grid-cols-2 gap-3">
                  {sidesOptions.map((option) => (
                    <div key={option.value}>
                      <RadioGroupItem
                        value={option.value}
                        id={`sides-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`sides-${option.value}`}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedSides === option.value
                          ? "border-[#D73D32] bg-[#D73D32]/5"
                          : "border-gray-200 hover:border-[#D73D32]/50"
                          }`}
                      >
                        <span className="font-medium text-sm">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* ✅ FIXED Quantity Section */}
            {/* Quantity Section */}
            {selectedVariant && selectedVariant.prices && selectedVariant.prices.length > 0 && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  Quantity:
                </Label>

                <RadioGroup
                  value={selectedQuantity}
                  onValueChange={(val) => setSelectedQuantity(val)}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedVariant.prices.map((price) => (
                      <div key={price.id}>
                        <RadioGroupItem
                          value={String(price.id)}
                          id={`qty-${price.id}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`qty-${price.id}`}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedQuantity === price.id
                            ? "border-[#D73D32] bg-[#D73D32]/5"
                            : "border-gray-200 hover:border-[#D73D32]/50"
                            }`}
                        >
                          <span className="font-medium text-sm">
                            {price.min_qty} - {price.max_qty} Pieces
                          </span>
                          <span className="text-[#D73D32] font-bold">
                            ₹ {price.price.toFixed(2)}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Total Price & CTA */}

          </div>

          <div className="space-y-6">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-2 space-y-8">

              {/* Variant Selection */}
              {/* Upload Design Card */}
              <UploadDesignCard
                uploadedFile={uploadedFile}
                uploadedPreview={uploadedPreview}
                uploadError={uploadError}
                onUpload={handleUploadAndRedirect}
                onRemove={removeFile}
              />

            </div>

            {/* RIGHT SIDE ORDER SUMMARY */}
            <div>
              <OrderSummaryCard
                productName={product.name}
                variant={selectedVariant}
                quantityId={selectedQuantity}
                totalPrice={totalPrice}
                uploadedFile={uploadedFile}
                onAddToCart={handleAddToCart}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95 rounded-3xl overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-2xl">{product.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImageGallery(false)}
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-20">
              <img
                src={getImageUrl(allImages[selectedImageIndex]?.url || allImages[selectedImageIndex])}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}