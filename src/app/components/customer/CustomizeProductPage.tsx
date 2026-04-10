import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  ZoomIn,
  Check,
  Upload,
  Minus,
  Plus,
  Package,
  Truck,
  Shield,
  Clock,
  FileText,
  Image as ImageIcon,
  X,
  Info,
  Sparkles,
  Palette,
  Layers,
  Settings,
  Award,
  TrendingUp
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import axios from "axios";

// TypeScript interfaces
interface ProductImage {
  id: string;
  image_url: string;
  url?: string;
  is_default: boolean;
}

interface Product {
  id: string;
  name: string;
  category_id: string;
  category_name?: string;
  subcategory_id: string;
  subcategory_name?: string;
  description: string;
  min_order_qty: number;
  max_order_qty: number;
  price?: number;
  mrp?: number;
  discount?: number;
  images: ProductImage[];
  related_images?: ProductImage[];
  rating?: number;
  review_count?: number;
  specifications?: Record<string, string>;
}

interface CustomizationOptions {
  size: string;
  paperType: string;
  finish: string;
  orientation: string;
  color: string;
  quantity: number;
  customText?: string;
  uploadedFiles: File[];
}

export function CustomizeProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [customization, setCustomization] = useState<CustomizationOptions>({
    size: "A4",
    paperType: "Matte",
    finish: "Standard",
    orientation: "Portrait",
    color: "Full Color",
    quantity: 100,
    customText: "",
    uploadedFiles: []
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState("3-5 business days");

  // Options
  const sizeOptions = [
    { value: "A4", label: "A4 (210 × 297 mm)", popular: true },
    { value: "A3", label: "A3 (297 × 420 mm)", popular: false },
    { value: "A5", label: "A5 (148 × 210 mm)", popular: true },
    { value: "DL", label: "DL (99 × 210 mm)", popular: false },
    { value: "Square", label: "Square (210 × 210 mm)", popular: false },
    { value: "Custom", label: "Custom Size", popular: false }
  ];

  const paperTypeOptions = [
    { value: "Matte", label: "Matte Paper", description: "Non-reflective finish", price: 0 },
    { value: "Glossy", label: "Glossy Paper", description: "Shiny, reflective finish", price: 50 },
    { value: "Premium", label: "Premium Paper", description: "Thick, high-quality", price: 100 },
    { value: "Recycled", label: "Recycled Paper", description: "Eco-friendly option", price: 30 },
    { value: "Textured", label: "Textured Paper", description: "Unique texture feel", price: 80 }
  ];

  const finishOptions = [
    { value: "Standard", label: "Standard", price: 0 },
    { value: "Laminated", label: "Laminated", price: 100 },
    { value: "UV Coated", label: "UV Coated", price: 150 },
    { value: "Embossed", label: "Embossed", price: 200 },
    { value: "Foil Stamped", label: "Foil Stamped", price: 250 }
  ];

  const orientationOptions = [
    { value: "Portrait", label: "Portrait", icon: "📄" },
    { value: "Landscape", label: "Landscape", icon: "📃" }
  ];

  const colorOptions = [
    { value: "Full Color", label: "Full Color (CMYK)", price: 0 },
    { value: "Black & White", label: "Black & White", price: -50 },
    { value: "Spot Color", label: "Spot Color", price: 30 }
  ];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://54.206.3.97/api/product/${productId}`);
        const productData = res.data;

        // Process images
        let processedImages: ProductImage[] = [];
        if (productData.images) {
          if (typeof productData.images === 'string') {
            try {
              const parsed = JSON.parse(productData.images);
              processedImages = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              processedImages = [{ id: '1', image_url: productData.images, is_default: true }];
            }
          } else if (Array.isArray(productData.images)) {
            processedImages = productData.images.map((img: any, index: number) => ({
              id: img.id || `img-${index}`,
              image_url: img.image_url || img.url || img,
              is_default: img.is_default || index === 0
            }));
          }
        }

        let processedRelated: ProductImage[] = [];
        if (productData.related_images) {
          if (typeof productData.related_images === 'string') {
            try {
              const parsed = JSON.parse(productData.related_images);
              processedRelated = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              processedRelated = [];
            }
          } else if (Array.isArray(productData.related_images)) {
            processedRelated = productData.related_images.map((img: any, index: number) => ({
              id: img.id || `related-${index}`,
              image_url: img.image_url || img.url || img,
              is_default: false
            }));
          }
        }

        const allImages = [...processedImages, ...processedRelated];

        setProduct({
          ...productData,
          images: allImages.length > 0 ? allImages : processedImages,
          related_images: processedRelated,
          price: productData.price || 500,
          mrp: productData.mrp || 650,
          discount: productData.discount || 23,
          rating: productData.rating || 4.5,
          review_count: productData.review_count || 234
        });

        // Set initial quantity to minimum order qty
        setCustomization(prev => ({
          ...prev,
          quantity: productData.min_order_qty || 100
        }));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Calculate price based on customization
  useEffect(() => {
    if (!product) return;

    let basePrice = product.price || 500;
    let totalPrice = basePrice;

    // Add paper type cost
    const paperType = paperTypeOptions.find(p => p.value === customization.paperType);
    if (paperType) totalPrice += paperType.price;

    // Add finish cost
    const finish = finishOptions.find(f => f.value === customization.finish);
    if (finish) totalPrice += finish.price;

    // Add color cost
    const color = colorOptions.find(c => c.value === customization.color);
    if (color) totalPrice += color.price;

    // Multiply by quantity
    totalPrice *= customization.quantity;

    // Apply bulk discounts
    if (customization.quantity >= 1000) {
      totalPrice *= 0.85; // 15% discount
    } else if (customization.quantity >= 500) {
      totalPrice *= 0.90; // 10% discount
    } else if (customization.quantity >= 250) {
      totalPrice *= 0.95; // 5% discount
    }

    setCalculatedPrice(Math.round(totalPrice));

    // Update estimated delivery
    if (customization.quantity >= 1000) {
      setEstimatedDelivery("7-10 business days");
    } else if (customization.quantity >= 500) {
      setEstimatedDelivery("5-7 business days");
    } else {
      setEstimatedDelivery("3-5 business days");
    }
  }, [customization, product]);

  const getImageUrl = (image: any): string => {
    if (!image) return '';
    const imagePath = image.image_url || image.url || image;
    if (typeof imagePath === 'string') {
      if (imagePath.startsWith('http')) return imagePath;
      const cleanPath = imagePath.replace(/\\/g, '/');
      return `http://54.206.3.97/${cleanPath}`;
    }
    return '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setCustomization(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setCustomization(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }));
  };

  const handleQuantityChange = (delta: number) => {
    if (!product) return;
    const newQty = Math.max(
      product.min_order_qty,
      Math.min(product.max_order_qty, customization.quantity + delta)
    );
    setCustomization(prev => ({ ...prev, quantity: newQty }));
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log("Adding to cart:", { product, customization, calculatedPrice });
    alert("Added to cart successfully!");
  };

  const handleShare = () => {
    navigator.share?.({
      title: product?.name,
      text: product?.description,
      url: window.location.href
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D73D32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Product not found</h2>
          <Button onClick={() => navigate('/products')} className="bg-gradient-to-r from-[#D73D32] to-[#B83227]">
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const allImages = product.images || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-[#D73D32] transition-colors">Home</button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate('/products')} className="hover:text-[#D73D32] transition-colors">Products</button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#D73D32] font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="relative overflow-hidden rounded-2xl shadow-xl border-0 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
              <div className="aspect-square relative overflow-hidden rounded-xl group cursor-pointer">
                <img
                  src={getImageUrl(allImages[selectedImageIndex])}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onClick={() => {
                    setGalleryImageIndex(selectedImageIndex);
                    setShowImageGallery(true);
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                    <ZoomIn className="w-8 h-8 text-[#D73D32]" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount && product.discount > 0 && (
                    <Badge className="bg-gradient-to-r from-[#D73D32] to-[#B83227] text-white border-0 shadow-lg">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsFavorite(!isFavorite);
                          }}
                        >
                          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#D73D32] text-[#D73D32]' : 'text-gray-600'}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add to wishlist</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          className="bg-white/95 hover:bg-white backdrop-blur-sm shadow-xl rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                          }}
                        >
                          <Share2 className="w-5 h-5 text-gray-600" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share product</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {allImages.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all transform hover:scale-105 ${
                      selectedImageIndex === idx
                        ? 'border-[#D73D32] shadow-lg ring-2 ring-[#D73D32]/30'
                        : 'border-gray-200 hover:border-[#D73D32]/50'
                    }`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Product Info Card - Mobile */}
            <Card className="lg:hidden bg-white rounded-2xl shadow-lg border-0 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-gradient-to-r from-[#D73D32]/10 to-[#B83227]/10 text-[#D73D32] border-0 font-semibold">
                  {product.category_name}
                </Badge>
                {product.subcategory_name && (
                  <Badge variant="outline">{product.subcategory_name}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </Card>
          </div>

          {/* Right Side - Customization Options */}
          <div className="space-y-6">
            {/* Product Info - Desktop Only */}
            <Card className="hidden lg:block bg-white rounded-2xl shadow-lg border-0 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-gradient-to-r from-[#D73D32]/10 to-[#B83227]/10 text-[#D73D32] border-0 font-semibold">
                  {product.category_name}
                </Badge>
                {product.subcategory_name && (
                  <Badge variant="outline">{product.subcategory_name}</Badge>
                )}
              </div>

              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold">{product.rating}</span>
                <span className="text-sm text-gray-500">({product.review_count} reviews)</span>
              </div>

              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </Card>

            {/* Customization Options */}
            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-[#D73D32] to-[#B83227] p-6">
                <div className="flex items-center gap-3 text-white">
                  <Sparkles className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Customize Your Order</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <Tabs defaultValue="design" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="design" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Palette className="w-4 h-4 mr-2" />
                      Design
                    </TabsTrigger>
                    <TabsTrigger value="specs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Layers className="w-4 h-4 mr-2" />
                      Specs
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </TabsTrigger>
                  </TabsList>

                  {/* Design Tab */}
                  <TabsContent value="design" className="space-y-6 mt-6">
                    {/* Size Selection */}
                    <div>
                      <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[#D73D32]" />
                        Size
                      </Label>
                      <RadioGroup value={customization.size} onValueChange={(value) => setCustomization(prev => ({ ...prev, size: value }))}>
                        <div className="grid grid-cols-2 gap-3">
                          {sizeOptions.map((option) => (
                            <div key={option.value} className="relative">
                              <RadioGroupItem value={option.value} id={`size-${option.value}`} className="peer sr-only" />
                              <Label
                                htmlFor={`size-${option.value}`}
                                className="flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-[#D73D32]/50 peer-data-[state=checked]:border-[#D73D32] peer-data-[state=checked]:bg-[#D73D32]/5"
                              >
                                <span className="font-semibold text-sm">{option.value}</span>
                                <span className="text-xs text-gray-500 mt-1">{option.label.split('(')[1]?.replace(')', '') || option.label}</span>
                                {option.popular && (
                                  <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs border-0">Popular</Badge>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Orientation */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Orientation</Label>
                      <RadioGroup value={customization.orientation} onValueChange={(value) => setCustomization(prev => ({ ...prev, orientation: value }))}>
                        <div className="grid grid-cols-2 gap-3">
                          {orientationOptions.map((option) => (
                            <div key={option.value} className="relative">
                              <RadioGroupItem value={option.value} id={`orient-${option.value}`} className="peer sr-only" />
                              <Label
                                htmlFor={`orient-${option.value}`}
                                className="flex items-center justify-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-[#D73D32]/50 peer-data-[state=checked]:border-[#D73D32] peer-data-[state=checked]:bg-[#D73D32]/5"
                              >
                                <span className="text-2xl">{option.icon}</span>
                                <span className="font-semibold">{option.label}</span>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Color */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Color Mode</Label>
                      <Select value={customization.color} onValueChange={(value) => setCustomization(prev => ({ ...prev, color: value }))}>
                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                {option.price !== 0 && (
                                  <span className="text-sm text-gray-500 ml-4">
                                    {option.price > 0 ? `+₹${option.price}` : `₹${option.price}`}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Text */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Custom Text (Optional)</Label>
                      <Textarea
                        placeholder="Add any custom text, special instructions, or notes..."
                        value={customization.customText}
                        onChange={(e) => setCustomization(prev => ({ ...prev, customText: e.target.value }))}
                        className="min-h-[100px] bg-gray-50 border-gray-200 rounded-xl"
                      />
                    </div>
                  </TabsContent>

                  {/* Specifications Tab */}
                  <TabsContent value="specs" className="space-y-6 mt-6">
                    {/* Paper Type */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Paper Type</Label>
                      <RadioGroup value={customization.paperType} onValueChange={(value) => setCustomization(prev => ({ ...prev, paperType: value }))}>
                        <div className="space-y-3">
                          {paperTypeOptions.map((option) => (
                            <div key={option.value} className="relative">
                              <RadioGroupItem value={option.value} id={`paper-${option.value}`} className="peer sr-only" />
                              <Label
                                htmlFor={`paper-${option.value}`}
                                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all hover:border-[#D73D32]/50 peer-data-[state=checked]:border-[#D73D32] peer-data-[state=checked]:bg-[#D73D32]/5"
                              >
                                <div>
                                  <span className="font-semibold block">{option.label}</span>
                                  <span className="text-sm text-gray-500">{option.description}</span>
                                </div>
                                {option.price > 0 && (
                                  <Badge className="bg-gray-100 text-gray-700 border-0">+₹{option.price}</Badge>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Finish */}
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Finish</Label>
                      <Select value={customization.finish} onValueChange={(value) => setCustomization(prev => ({ ...prev, finish: value }))}>
                        <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {finishOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center justify-between w-full">
                                <span>{option.label}</span>
                                {option.price > 0 && (
                                  <span className="text-sm text-gray-500 ml-4">+₹{option.price}</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Product Specifications */}
                    {product.specifications && (
                      <div className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#D73D32]" />
                          Product Specifications
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-sm text-gray-500 block">{key}</span>
                              <span className="font-semibold text-gray-800">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* Upload Tab */}
                  <TabsContent value="upload" className="space-y-6 mt-6">
                    {/* File Upload */}
                    <div>
                      <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#D73D32]" />
                        Upload Your Design Files
                      </Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#D73D32] transition-colors bg-gray-50">
                        <input
                          type="file"
                          id="file-upload"
                          multiple
                          accept=".pdf,.ai,.psd,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
                            <span className="text-[#D73D32] font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-sm text-gray-500">PDF, AI, PSD, PNG, JPG (max. 50MB)</p>
                        </label>
                      </div>

                      {/* Uploaded Files */}
                      {customization.uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {customization.uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#D73D32]/10 rounded-lg">
                                  <FileText className="w-4 h-4 text-[#D73D32]" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Design Guidelines */}
                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-900">
                          <p className="font-semibold mb-2">Design Guidelines:</p>
                          <ul className="space-y-1 text-blue-800">
                            <li>• Use high-resolution images (300 DPI minimum)</li>
                            <li>• Include 3mm bleed on all sides</li>
                            <li>• Convert all text to outlines or embed fonts</li>
                            <li>• Use CMYK color mode for print files</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>

            {/* Quantity & Price */}
            <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-base font-semibold">Quantity</Label>
                    <span className="text-sm text-gray-500">
                      Min: {product.min_order_qty} | Max: {product.max_order_qty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-50)}
                      disabled={customization.quantity <= product.min_order_qty}
                      className="h-12 w-12 rounded-xl border-2 border-gray-200 hover:border-[#D73D32]"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>
                    <Input
                      type="number"
                      value={customization.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || product.min_order_qty;
                        setCustomization(prev => ({
                          ...prev,
                          quantity: Math.max(product.min_order_qty, Math.min(product.max_order_qty, val))
                        }));
                      }}
                      className="text-center text-xl font-bold h-12 rounded-xl border-2 border-gray-200 focus:border-[#D73D32]"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(50)}
                      disabled={customization.quantity >= product.max_order_qty}
                      className="h-12 w-12 rounded-xl border-2 border-gray-200 hover:border-[#D73D32]"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Bulk Discount Info */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <p className="text-sm font-semibold text-green-900 mb-2">💰 Bulk Discounts Available!</p>
                    <div className="space-y-1 text-xs text-green-800">
                      <div className="flex justify-between">
                        <span>250-499 units:</span>
                        <span className="font-semibold">5% OFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>500-999 units:</span>
                        <span className="font-semibold">10% OFF</span>
                      </div>
                      <div className="flex justify-between">
                        <span>1000+ units:</span>
                        <span className="font-semibold">15% OFF</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price Summary */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Unit Price:</span>
                    <span className="font-semibold">₹{product.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{customization.quantity} units</span>
                  </div>
                  {customization.quantity >= 250 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="font-medium">Bulk Discount:</span>
                      <span className="font-semibold">
                        -{customization.quantity >= 1000 ? '15%' : customization.quantity >= 500 ? '10%' : '5%'}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">Total Price:</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#D73D32] to-[#B83227] bg-clip-text text-transparent">
                        ₹{calculatedPrice.toLocaleString()}
                      </span>
                      {product.mrp && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{(product.mrp * customization.quantity).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Delivery Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-[#D73D32]" />
                    <div>
                      <p className="font-semibold text-gray-700">Estimated Delivery</p>
                      <p className="text-gray-600">{estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-[#D73D32]" />
                    <div>
                      <p className="font-semibold text-gray-700">Quality Guarantee</p>
                      <p className="text-gray-600">100% satisfaction or money back</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-[#D73D32]" />
                    <div>
                      <p className="font-semibold text-gray-700">Production Time</p>
                      <p className="text-gray-600">2-3 business days</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-14 bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleAddToCart();
                      navigate('/checkout');
                    }}
                    className="w-full h-14 border-2 border-[#D73D32] text-[#D73D32] hover:bg-[#D73D32] hover:text-white text-lg font-bold rounded-xl transition-all"
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-6 h-6 text-[#D73D32] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Secure Payment</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 text-[#D73D32] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Certified Quality</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-[#D73D32] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Best Price</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <Card className="bg-white rounded-2xl shadow-lg border-0 p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none h-auto p-0">
              <TabsTrigger 
                value="description" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D73D32] data-[state=active]:bg-transparent px-6 py-3"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D73D32] data-[state=active]:bg-transparent px-6 py-3"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#D73D32] data-[state=active]:bg-transparent px-6 py-3"
              >
                Reviews ({product.review_count})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">About This Product</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Our premium printing services ensure that your designs come to life with vibrant colors, 
                  crisp details, and professional finishing. We use state-of-the-art printing technology 
                  and the highest quality materials to deliver exceptional results every time.
                </p>
                <h4 className="text-lg font-bold text-[#1A1A1A] mb-3 mt-6">Key Features:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D73D32] flex-shrink-0 mt-0.5" />
                    <span>High-quality printing with vibrant, accurate colors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D73D32] flex-shrink-0 mt-0.5" />
                    <span>Multiple paper and finishing options available</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D73D32] flex-shrink-0 mt-0.5" />
                    <span>Fast turnaround time with express options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D73D32] flex-shrink-0 mt-0.5" />
                    <span>Bulk order discounts for large quantities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D73D32] flex-shrink-0 mt-0.5" />
                    <span>100% satisfaction guarantee</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Min Order Quantity:</span>
                  <span className="text-gray-600">{product.min_order_qty} units</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-700">Max Order Quantity:</span>
                  <span className="text-gray-600">{product.max_order_qty} units</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Overall Rating */}
                <div className="flex items-center gap-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#D73D32] mb-2">{product.rating}</div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{product.review_count} reviews</p>
                  </div>
                  <Separator orientation="vertical" className="h-24" />
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3 mb-2">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#D73D32] to-[#B83227]"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6 border-0 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D73D32] to-[#B83227] flex items-center justify-center text-white font-bold">
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">Customer {i}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, idx) => (
                                <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Excellent quality and fast delivery! The printing came out perfect and the colors are vibrant. 
                            Highly recommend for anyone looking for professional printing services.
                          </p>
                          <p className="text-sm text-gray-400">2 days ago</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Full Image Gallery Modal */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95 rounded-3xl overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-2xl">{product.name}</h3>
                  <p className="text-white/70 text-sm mt-1">
                    Image {galleryImageIndex + 1} of {allImages.length}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowImageGallery(false)}
                  className="text-white hover:bg-white/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 flex items-center justify-center p-20">
              <img
                src={getImageUrl(allImages[galleryImageIndex])}
                alt={`${product.name} - Image ${galleryImageIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                }}
              />
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGalleryImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full w-14 h-14 shadow-xl"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setGalleryImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full w-14 h-14 shadow-xl"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex gap-3 overflow-x-auto pb-2 justify-center scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                  {allImages.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setGalleryImageIndex(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 transition-all transform hover:scale-110 ${
                        galleryImageIndex === idx
                          ? 'border-white shadow-2xl ring-4 ring-white/50'
                          : 'border-white/30 hover:border-white/70'
                      }`}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}