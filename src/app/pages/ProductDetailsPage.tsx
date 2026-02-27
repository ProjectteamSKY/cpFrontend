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
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { Product } from "../types/productlist";
import { getImageUrl, enrichProductData } from "../utils/productutils";
import { API_BASE_URL } from "../constants/productconstants";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  
  // Product customization states
  const [selectedSize, setSelectedSize] = useState<string>("Standard Size");
  const [selectedQuantity, setSelectedQuantity] = useState<string>("100 Pieces");
  const [selectedPaper, setSelectedPaper] = useState<string>("Standard");
  const [selectedLamination, setSelectedLamination] = useState<string>("none");
  
  // Pricing
  const [basePrice, setBasePrice] = useState<number>(179);
  const [totalPrice, setTotalPrice] = useState<number>(179);

  // Quantity options with pricing
  const quantityOptions = [
    { label: "100 Pieces", price: 179, value: "100 Pieces" },
    { label: "200 Pieces", price: 289, value: "200 Pieces" },
    { label: "300 Pieces", price: 469, value: "300 Pieces" },
    { label: "More Quantities +", price: 589.13, value: "more" }
  ];

  // Paper options with pricing
  const paperOptions = [
    { label: "Standard", price: 0, value: "Standard" },
    { label: "Stiff", price: 0, value: "Stiff" },
    { label: "Extra Stiff", price: 160, value: "Extra Stiff" },
    { label: "Super White", price: 160, value: "Super White" },
    { label: "White Textured", price: 180, value: "White Textured" },
    { label: "Metallic", price: 260, value: "Metallic" },
    { label: "Cream Textured", price: 260, value: "Cream Textured" },
    { label: "White Checks", price: 160, value: "White Checks" }
  ];

  // Lamination options
  const laminationOptions = [
    { label: "Non Tearable", price: 260, value: "Non Tearable" },
    { label: "Cream Checks", price: 260, value: "Cream Checks" },
    { label: "Recycled", price: 160, value: "Recycled" }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/product/${id}`);
        const productData = enrichProductData(res.data);
        setProduct(productData);
        
        // Set default selections
        setSelectedQuantity(quantityOptions[0].value);
        setSelectedPaper(paperOptions[0].value);
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

  // Calculate total price when selections change
  useEffect(() => {
    let price = basePrice;
    
    // Add paper price
    const paper = paperOptions.find(p => p.value === selectedPaper);
    if (paper) price += paper.price;
    
    // Add lamination price
    const lamination = laminationOptions.find(l => l.value === selectedLamination);
    if (lamination) price += lamination.price;
    
    setTotalPrice(price);
  }, [selectedPaper, selectedLamination, basePrice]);

  const handleQuantitySelect = (value: string) => {
    setSelectedQuantity(value);
    const quantity = quantityOptions.find(q => q.value === value);
    if (quantity) {
      setBasePrice(quantity.price);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

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

  const allImages = product?.images ? (Array.isArray(product.images) ? product.images : []) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </Card>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl group">
              <img
                src={getImageUrl(allImages[selectedImageIndex])}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                }}
              />
              
              {/* Zoom Button */}
              <button
                onClick={() => setShowImageGallery(true)}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <ZoomIn className="w-5 h-5 text-[#D73D32]" />
              </button>

              {/* Favorite Button */}
              <button
                onClick={toggleFavorite}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-[#D73D32] text-[#D73D32]' : 'text-gray-600'
                  }`} 
                />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-110"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                {allImages.map((image: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-[#D73D32] shadow-lg' 
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

            {/* Delivery Info Cards */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <Card className="p-3 text-center bg-white shadow-sm">
                <Truck className="w-5 h-5 text-[#D73D32] mx-auto mb-1" />
                <p className="text-xs font-semibold">Free Shipping</p>
              </Card>
              <Card className="p-3 text-center bg-white shadow-sm">
                <Shield className="w-5 h-5 text-[#D73D32] mx-auto mb-1" />
                <p className="text-xs font-semibold">Quality Guaranteed</p>
              </Card>
              <Card className="p-3 text-center bg-white shadow-sm">
                <RotateCcw className="w-5 h-5 text-[#D73D32] mx-auto mb-1" />
                <p className="text-xs font-semibold">Easy Returns</p>
              </Card>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number(product.rating || 4.2))
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

            {/* Key Features */}
            <Card className="p-5 bg-gradient-to-r from-[#D73D32]/5 to-[#B83227]/5">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Single sided visiting card.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Standard size: 89x51mm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Choose from Multiple Paper options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Select from Matte or Glass Lamination options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Select straight or round edges.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D73D32] font-bold">•</span>
                  <span>Preview your designs before placing order.</span>
                </li>
              </ul>
            </Card>

            {/* Important Notice */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  We cannot print Visiting Cards for the Government, Educational Institutes, 
                  Press, Airlines, Banks, Large Corporate Companies etc. If you are ordering 
                  for an Educational Institute or Large Corporate Company, then a letter of 
                  authorisation is required from the organisation to process the order. 
                  Orders will be automatically cancelled in the absence of authorisation.
                </p>
              </div>
            </Card>

            {/* Brand & Price Info */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Brand:</p>
                <p className="font-semibold text-[#1A1A1A]">PrintStop</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Price:</p>
                <p className="text-2xl font-bold text-[#D73D32]">₹{totalPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">For 100 pieces</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Delivery:</p>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-600" />
                  <p className="font-semibold text-green-600">3 Days</p>
                </div>
                <p className="text-xs text-gray-500">(Mon to Sat)</p>
              </div>
            </div>

            <Separator />

            {/* Customization Section */}
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">Customise this product</h2>
              <p className="text-sm text-gray-500 mb-6">Select from a range of options to personalise your product</p>

              {/* Size */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Size:</Label>
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-[#D73D32] cursor-pointer">
                  <p className="font-medium">Standard Size</p>
                  <p className="text-sm text-gray-500">89x51mm</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Quantity:</Label>
                <RadioGroup value={selectedQuantity} onValueChange={handleQuantitySelect}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {quantityOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem
                          value={option.value}
                          id={`qty-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`qty-${option.value}`}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedQuantity === option.value
                              ? 'border-[#D73D32] bg-[#D73D32]/5'
                              : 'border-gray-200 hover:border-[#D73D32]/50'
                          }`}
                        >
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-[#D73D32] font-bold">₹ {option.price.toFixed(2)}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Paper Options */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Paper:</Label>
                <RadioGroup value={selectedPaper} onValueChange={setSelectedPaper}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {paperOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem
                          value={option.value}
                          id={`paper-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`paper-${option.value}`}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPaper === option.value
                              ? 'border-[#D73D32] bg-[#D73D32]/5'
                              : 'border-gray-200 hover:border-[#D73D32]/50'
                          }`}
                        >
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-[#D73D32] font-bold text-sm">
                            {option.price === 0 ? 'Free' : `₹ ${option.price}`}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Lamination Options */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Lamination:</Label>
                <RadioGroup value={selectedLamination} onValueChange={setSelectedLamination}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {laminationOptions.map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem
                          value={option.value}
                          id={`lam-${option.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`lam-${option.value}`}
                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedLamination === option.value
                              ? 'border-[#D73D32] bg-[#D73D32]/5'
                              : 'border-gray-200 hover:border-[#D73D32]/50'
                          }`}
                        >
                          <span className="font-medium text-sm">{option.label}</span>
                          <span className="text-[#D73D32] font-bold text-sm">₹ {option.price}</span>
                        </Label>
                      </div>
                    ))}
                    {/* None option */}
                    <div>
                      <RadioGroupItem
                        value="none"
                        id="lam-none"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="lam-none"
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedLamination === 'none'
                            ? 'border-[#D73D32] bg-[#D73D32]/5'
                            : 'border-gray-200 hover:border-[#D73D32]/50'
                        }`}
                      >
                        <span className="font-medium text-sm">No Lamination</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Personalisation Options */}
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Personalise this product</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-2 border-dashed hover:border-[#D73D32] hover:bg-[#D73D32]/5"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <p className="font-semibold">Upload your own design</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 border-2 border-dashed hover:border-[#D73D32] hover:bg-[#D73D32]/5"
                  >
                    <Edit3 className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <p className="font-semibold">Make your own design</p>
                      <p className="text-xs text-gray-500">Use our designer tool</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Total Price & CTA */}
              <Card className="p-6 bg-gradient-to-r from-[#D73D32] to-[#B83227] text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Total Price</p>
                    <p className="text-3xl font-bold">₹{totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90">Delivery</p>
                    <p className="font-semibold">3-5 Business Days</p>
                  </div>
                </div>
                <Button className="w-full bg-white text-[#D73D32] hover:bg-white/90 h-14 text-lg font-semibold rounded-xl">
                  Add to Cart
                </Button>
              </Card>

              {/* Contact Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Need more customisation options?</p>
                <div className="flex items-center gap-4">
                  <a href="mailto:support@printstop.co.in" className="flex items-center gap-2 text-[#D73D32] hover:underline">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">support@printstop.co.in</span>
                  </a>
                  <a href="tel:+919920905050" className="flex items-center gap-2 text-[#D73D32] hover:underline">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91 9920905050</span>
                  </a>
                </div>
              </div>
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
                src={getImageUrl(allImages[selectedImageIndex])}
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