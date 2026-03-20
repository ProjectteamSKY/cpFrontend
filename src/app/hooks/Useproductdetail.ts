import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Product, ProductVariant, VariantPrice } from "../types/productlist";
import { enrichProductData } from "../utils/productutils";
import { API_BASE_URL } from "../constants/productconstants";
import { useToast } from "./Usetoast";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Size {
  label?: unknown;
  id: string;
  name: string;
  dimensions?: string;
}
export interface PaperType {
  label?: unknown;
  id: string;
  name: string;
}
export interface PrintType {
  label?: unknown;
  id: string;
  name: string;
}
export interface CutType { id: string; name: string }

export interface VariantOption {
  originalPrice?: ReactNode;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const safeParse = (value: any): any[] => {
  if (!value) return [];
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
  } catch { return []; }
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProductDetail() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, show: showToast, dismiss } = useToast();

  // ── Data
  const [product,  setProduct]  = useState<Product | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [variants, setVariants] = useState<VariantOption[]>([]);

  // ── Gallery / UI
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery,        setShowGallery]        = useState(false);
  const [isFavorite,         setIsFavorite]         = useState(false);
  const [copied,             setCopied]             = useState(false);

  // ── Configuration
  const [selectedSize,      setSelectedSize]      = useState("");
  const [selectedPaperType, setSelectedPaperType] = useState("");
  const [selectedPrintType, setSelectedPrintType] = useState("");
  const [selectedCutType,   setSelectedCutType]   = useState("");
  const [selectedSides,     setSelectedSides]     = useState("1");

  // ── Quantity
  const [selectedQuantity, setSelectedQuantity] = useState<string>("");
  const [customQty,        setCustomQty]        = useState<string>("");
  const [useCustomQty,     setUseCustomQty]     = useState(false);

  // ── Pricing
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
  const [totalPrice,      setTotalPrice]      = useState(0);

  // ── Upload
  const [frontFile,    setFrontFile]    = useState<File | null>(null);
  const [backFile,     setBackFile]     = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview,  setBackPreview]  = useState<string | null>(null);

  // ─── Step progress
  const currentStep = useMemo(() => {
    if (!selectedVariant || !selectedQuantity) return 0;
    if (!frontFile) return 1;
    return 2;
  }, [selectedVariant, selectedQuantity, frontFile]);

  // ─── Fetch product
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

  // ─── Initialise variants from API data
  const initVariants = (variantData: ProductVariant[]) => {
    const processed: VariantOption[] = variantData.map((v) => {
      const prices = v.prices || [];
      const vals   = prices.map((p: VariantPrice) => p.price);
      return {
        id:            v.id,
        variantId:     v.id,
        originalPrice: undefined,
        size:          { id: v.size_id,        name: v.size_name       || "Standard", label: undefined },
        paperType:     { id: v.paper_type_id,   name: v.paper_type_name || "Standard", label: undefined },
        printType:     { id: v.print_type_id,   name: v.print_type_name || "Digital",  label: undefined },
        cutType:       { id: v.cut_type_id,     name: v.cut_type_name   || "Straight" },
        sides:         v.sides       || 1,
        orientation:   v.orientation || "Portrait",
        prices,
        minPrice: vals.length ? Math.min(...vals) : 0,
        maxPrice: vals.length ? Math.max(...vals) : 0,
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

  // ─── Derived option lists (cascaded)
  const allSizes = useMemo(() => {
    const map = new Map<string, Size>();
    variants.forEach((v) => { if (!map.has(v.size.name)) map.set(v.size.name, v.size); });
    return Array.from(map.values());
  }, [variants]);

  const availablePaperTypes = useMemo(() => {
    const map = new Map<string, PaperType>();
    variants
      .filter((v) => v.size.name === selectedSize)
      .forEach((v) => { if (!map.has(v.paperType.name)) map.set(v.paperType.name, v.paperType); });
    return Array.from(map.values());
  }, [variants, selectedSize]);

  const availablePrintTypes = useMemo(() => {
    const map = new Map<string, PrintType>();
    variants
      .filter((v) => v.size.name === selectedSize && v.paperType.name === selectedPaperType)
      .forEach((v) => { if (!map.has(v.printType.name)) map.set(v.printType.name, v.printType); });
    return Array.from(map.values());
  }, [variants, selectedSize, selectedPaperType]);

  const availableCutTypes = useMemo(() => {
    const map = new Map<string, CutType>();
    variants
      .filter(
        (v) =>
          v.size.name === selectedSize &&
          v.paperType.name === selectedPaperType &&
          v.printType.name === selectedPrintType
      )
      .forEach((v) => { if (!map.has(v.cutType.name)) map.set(v.cutType.name, v.cutType); });
    return Array.from(map.values());
  }, [variants, selectedSize, selectedPaperType, selectedPrintType]);

  // ─── Selection handlers (cascade reset downstream options)
  const handleSizeChange = useCallback(
    (name: string) => {
      setSelectedSize(name);
      const forSize = variants.filter((v) => v.size.name === name);
      if (!forSize.length) return;
      const firstPaper = forSize[0].paperType.name;
      setSelectedPaperType(firstPaper);
      const forPaper = forSize.filter((v) => v.paperType.name === firstPaper);
      const firstPrint = forPaper[0]?.printType.name ?? forSize[0].printType.name;
      setSelectedPrintType(firstPrint);
      const forPrint = forPaper.filter((v) => v.printType.name === firstPrint);
      const firstCut = forPrint[0]?.cutType.name ?? forPaper[0]?.cutType.name ?? forSize[0].cutType.name;
      setSelectedCutType(firstCut);
    },
    [variants]
  );

  const handlePaperChange = useCallback(
    (name: string) => {
      setSelectedPaperType(name);
      const forPaper = variants.filter((v) => v.size.name === selectedSize && v.paperType.name === name);
      if (!forPaper.length) return;
      const firstPrint = forPaper[0].printType.name;
      setSelectedPrintType(firstPrint);
      const forPrint = forPaper.filter((v) => v.printType.name === firstPrint);
      const firstCut = forPrint[0]?.cutType.name ?? forPaper[0].cutType.name;
      setSelectedCutType(firstCut);
    },
    [variants, selectedSize]
  );

  const handlePrintChange = useCallback(
    (name: string) => {
      setSelectedPrintType(name);
      const forPrint = variants.filter(
        (v) =>
          v.size.name === selectedSize &&
          v.paperType.name === selectedPaperType &&
          v.printType.name === name
      );
      if (forPrint.length) setSelectedCutType(forPrint[0].cutType.name);
    },
    [variants, selectedSize, selectedPaperType]
  );

  // ─── Sync selected variant when options change
  useEffect(() => {
    if (!variants.length) return;
    const match =
      variants.find(
        (v) =>
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

  // ─── Update price when quantity tier changes
  useEffect(() => {
    if (!selectedVariant || !selectedQuantity || useCustomQty) return;
    const row = selectedVariant.prices.find((p) => p.id === selectedQuantity);
    if (row) setTotalPrice(row.price);
  }, [selectedQuantity, selectedVariant, useCustomQty]);

  // ─── All images (main + related)
  const allImages = useMemo(
    () => [
      ...(Array.isArray(product?.images)         ? product!.images         : []),
      ...(Array.isArray(product?.related_images) ? product!.related_images : []),
    ],
    [product]
  );

  // ─── Custom quantity price lookup
  const customQtyPrice = useMemo(() => {
    if (!selectedVariant || !customQty) return null;
    const qty = parseInt(customQty, 10);
    if (isNaN(qty) || qty < 1) return null;
    return (
      selectedVariant.prices
        .slice()
        .sort((a, b) => b.min_qty - a.min_qty)
        .find((p) => qty >= p.min_qty)?.price ?? null
    );
  }, [customQty, selectedVariant]);

  // ─── CTA state
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

  // ─── Action handlers
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast("success", "Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFrontFile(file);
    setFrontPreview(URL.createObjectURL(file));
    showToast("success", "Front design uploaded!");
  };

  const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      const tier = selectedVariant.prices
        .slice()
        .sort((a, b) => b.min_qty - a.min_qty)
        .find((p) => parsed >= p.min_qty);
      unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
    } else {
      const row = selectedVariant.prices.find((p) => p.id === selectedQuantity);
      if (!row) { showToast("error", "Select a quantity."); return; }
      quantityNumber = row.min_qty;
      unitPrice = row.price;
    }

    navigate("/design-review", {
      state: {
        product,
        variant: selectedVariant,
        quantity: quantityNumber,
        priceId: useCustomQty ? null : selectedQuantity,
        selected_options: {
          size:       selectedVariant.size?.name      ?? "",
          material:   selectedVariant.paperType?.name ?? "",
          lamination: selectedVariant.printType?.name ?? "",
        },
        frontDesign: frontFile,
        backDesign:  selectedSides === "2" ? backFile : null,
        frontPreview,
        backPreview,
        basePrice:   unitPrice,
        totalPrice:  unitPrice,
        sides:       selectedSides,
      },
    });
  };

  return {
    // data
    id, product, loading, variants,
    // gallery
    allImages, selectedImageIndex, setSelectedImageIndex, showGallery, setShowGallery,
    // ui flags
    isFavorite, setIsFavorite, copied,
    // configuration
    selectedSize, selectedPaperType, selectedPrintType, selectedCutType, selectedSides, setSelectedSides, setSelectedCutType,
    allSizes, availablePaperTypes, availablePrintTypes, availableCutTypes,
    handleSizeChange, handlePaperChange, handlePrintChange,
    // quantity
    selectedQuantity, setSelectedQuantity, customQty, setCustomQty, useCustomQty, setUseCustomQty, customQtyPrice,
    // pricing
    selectedVariant, totalPrice,
    // upload
    frontFile, backFile, frontPreview, backPreview,
    setFrontFile, setFrontPreview, setBackFile, setBackPreview,
    // actions
    handleShare, handleFrontUpload, handleBackUpload, handleContinue,
    // cta
    ctaDisabled, ctaLabel,
    // step
    currentStep,
    // toast
    toasts, dismiss,
    // navigate
    navigate,
    showToast,
  };
}