// import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
// import { useParams, useNavigate } from "react-router";
// import axios from "axios";
// import { Product, ProductVariant, VariantPrice } from "../types/productlist";
// import { enrichProductData } from "../utils/productutils";
// import { API_BASE_URL } from "../constants/productconstants";
// import { useToast } from "./Usetoast";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface Size {
//   label?: unknown;
//   id: string;
//   name: string;
//   dimensions?: string;
// }
// export interface PaperType {
//   label?: unknown;
//   id: string;
//   name: string;
// }
// export interface PrintType {
//   label?: unknown;
//   id: string;
//   name: string;
// }
// export interface CutType { id: string; name: string }

// export interface VariantOption {
//   originalPrice?: ReactNode;
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

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const safeParse = (value: any): any[] => {
//   if (!value) return [];
//   try {
//     const parsed = typeof value === "string" ? JSON.parse(value) : value;
//     return typeof parsed === "string" ? JSON.parse(parsed) : parsed;
//   } catch { return []; }
// };

// // ─── Hook ─────────────────────────────────────────────────────────────────────

// export function useProductDetail() {
//   const { id }   = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { toasts, show: showToast, dismiss } = useToast();

//   // ── Data
//   const [product,  setProduct]  = useState<Product | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [variants, setVariants] = useState<VariantOption[]>([]);

//   // ── Gallery / UI
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [showGallery,        setShowGallery]        = useState(false);
//   const [isFavorite,         setIsFavorite]         = useState(false);
//   const [copied,             setCopied]             = useState(false);

//   // ── Configuration
//   const [selectedSize,      setSelectedSize]      = useState("");
//   const [selectedPaperType, setSelectedPaperType] = useState("");
//   const [selectedPrintType, setSelectedPrintType] = useState("");
//   const [selectedCutType,   setSelectedCutType]   = useState("");
//   const [selectedSides,     setSelectedSides]     = useState("1");

//   // ── Quantity
//   const [selectedQuantity, setSelectedQuantity] = useState<string>("");
//   const [customQty,        setCustomQty]        = useState<string>("");
//   const [useCustomQty,     setUseCustomQty]     = useState(false);

//   // ── Pricing
//   const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
//   const [totalPrice,      setTotalPrice]      = useState(0);

//   // ── Upload
//   const [frontFile,    setFrontFile]    = useState<File | null>(null);
//   const [backFile,     setBackFile]     = useState<File | null>(null);
//   const [frontPreview, setFrontPreview] = useState<string | null>(null);
//   const [backPreview,  setBackPreview]  = useState<string | null>(null);

//   // ─── Step progress
//   const currentStep = useMemo(() => {
//     if (!selectedVariant || !selectedQuantity) return 0;
//     if (!frontFile) return 1;
//     return 2;
//   }, [selectedVariant, selectedQuantity, frontFile]);

//   // ─── Fetch product
//   useEffect(() => {
//     if (!id) return;
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get<ApiResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
//         const raw = res.data.product;
//         const parsed = {
//           ...raw,
//           images:         safeParse(raw.images),
//           related_images: safeParse(raw.related_images),
//         };
//         setProduct(enrichProductData(parsed));
//         if (Array.isArray(raw.variants) && raw.variants.length > 0) {
//           initVariants(raw.variants);
//         }
//       } catch {
//         showToast("error", "Failed to load product.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [id]);

//   // ─── Initialise variants from API data
//   const initVariants = (variantData: ProductVariant[]) => {
//     const processed: VariantOption[] = variantData.map((v) => {
//       const prices = v.prices || [];
//       const vals   = prices.map((p: VariantPrice) => p.price);
//       return {
//         id:            v.id,
//         variantId:     v.id,
//         originalPrice: undefined,
//         size:          { id: v.size_id,        name: v.size_name       || "Standard", label: undefined },
//         paperType:     { id: v.paper_type_id,   name: v.paper_type_name || "Standard", label: undefined },
//         printType:     { id: v.print_type_id,   name: v.print_type_name || "Digital",  label: undefined },
//         cutType:       { id: v.cut_type_id,     name: v.cut_type_name   || "Straight" },
//         sides:         v.sides       || 1,
//         orientation:   v.orientation || "Portrait",
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
//     if (first.prices.length) {
//       setSelectedQuantity(first.prices[0].id);
//       setTotalPrice(first.prices[0].price);
//     }
//   };

//   // ─── Derived option lists (cascaded)
//   const allSizes = useMemo(() => {
//     const map = new Map<string, Size>();
//     variants.forEach((v) => { if (!map.has(v.size.name)) map.set(v.size.name, v.size); });
//     return Array.from(map.values());
//   }, [variants]);

//   const availablePaperTypes = useMemo(() => {
//     const map = new Map<string, PaperType>();
//     variants
//       .filter((v) => v.size.name === selectedSize)
//       .forEach((v) => { if (!map.has(v.paperType.name)) map.set(v.paperType.name, v.paperType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize]);

//   const availablePrintTypes = useMemo(() => {
//     const map = new Map<string, PrintType>();
//     variants
//       .filter((v) => v.size.name === selectedSize && v.paperType.name === selectedPaperType)
//       .forEach((v) => { if (!map.has(v.printType.name)) map.set(v.printType.name, v.printType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize, selectedPaperType]);

//   const availableCutTypes = useMemo(() => {
//     const map = new Map<string, CutType>();
//     variants
//       .filter(
//         (v) =>
//           v.size.name === selectedSize &&
//           v.paperType.name === selectedPaperType &&
//           v.printType.name === selectedPrintType
//       )
//       .forEach((v) => { if (!map.has(v.cutType.name)) map.set(v.cutType.name, v.cutType); });
//     return Array.from(map.values());
//   }, [variants, selectedSize, selectedPaperType, selectedPrintType]);

//   // ─── Selection handlers (cascade reset downstream options)
//   const handleSizeChange = useCallback(
//     (name: string) => {
//       setSelectedSize(name);
//       const forSize = variants.filter((v) => v.size.name === name);
//       if (!forSize.length) return;
//       const firstPaper = forSize[0].paperType.name;
//       setSelectedPaperType(firstPaper);
//       const forPaper = forSize.filter((v) => v.paperType.name === firstPaper);
//       const firstPrint = forPaper[0]?.printType.name ?? forSize[0].printType.name;
//       setSelectedPrintType(firstPrint);
//       const forPrint = forPaper.filter((v) => v.printType.name === firstPrint);
//       const firstCut = forPrint[0]?.cutType.name ?? forPaper[0]?.cutType.name ?? forSize[0].cutType.name;
//       setSelectedCutType(firstCut);
//     },
//     [variants]
//   );

//   const handlePaperChange = useCallback(
//     (name: string) => {
//       setSelectedPaperType(name);
//       const forPaper = variants.filter((v) => v.size.name === selectedSize && v.paperType.name === name);
//       if (!forPaper.length) return;
//       const firstPrint = forPaper[0].printType.name;
//       setSelectedPrintType(firstPrint);
//       const forPrint = forPaper.filter((v) => v.printType.name === firstPrint);
//       const firstCut = forPrint[0]?.cutType.name ?? forPaper[0].cutType.name;
//       setSelectedCutType(firstCut);
//     },
//     [variants, selectedSize]
//   );

//   const handlePrintChange = useCallback(
//     (name: string) => {
//       setSelectedPrintType(name);
//       const forPrint = variants.filter(
//         (v) =>
//           v.size.name === selectedSize &&
//           v.paperType.name === selectedPaperType &&
//           v.printType.name === name
//       );
//       if (forPrint.length) setSelectedCutType(forPrint[0].cutType.name);
//     },
//     [variants, selectedSize, selectedPaperType]
//   );

//   // ─── Sync selected variant when options change
//   useEffect(() => {
//     if (!variants.length) return;
//     const match =
//       variants.find(
//         (v) =>
//           v.size.name === selectedSize &&
//           v.paperType.name === selectedPaperType &&
//           v.printType.name === selectedPrintType &&
//           v.cutType.name === selectedCutType
//       ) ?? null;
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

//   // ─── Update price when quantity tier changes
//   useEffect(() => {
//     if (!selectedVariant || !selectedQuantity || useCustomQty) return;
//     const row = selectedVariant.prices.find((p) => p.id === selectedQuantity);
//     if (row) setTotalPrice(row.price);
//   }, [selectedQuantity, selectedVariant, useCustomQty]);

//   // ─── All images (main + related)
//   const allImages = useMemo(
//     () => [
//       ...(Array.isArray(product?.images)         ? product!.images         : []),
//       ...(Array.isArray(product?.related_images) ? product!.related_images : []),
//     ],
//     [product]
//   );

//   // ─── Custom quantity price lookup
//   const customQtyPrice = useMemo(() => {
//     if (!selectedVariant || !customQty) return null;
//     const qty = parseInt(customQty, 10);
//     if (isNaN(qty) || qty < 1) return null;
//     return (
//       selectedVariant.prices
//         .slice()
//         .sort((a, b) => b.min_qty - a.min_qty)
//         .find((p) => qty >= p.min_qty)?.price ?? null
//     );
//   }, [customQty, selectedVariant]);

//   // ─── CTA state
//   const ctaDisabled =
//     !selectedVariant ||
//     (!useCustomQty && !selectedQuantity) ||
//     (useCustomQty && (!customQty || parseInt(customQty) < 1)) ||
//     !frontFile ||
//     (selectedSides === "2" && !backFile);

//   const ctaLabel = useMemo(() => {
//     if (!selectedVariant)                   return "Select options to continue";
//     if (!selectedQuantity && !useCustomQty) return "Select a quantity";
//     if (!frontFile)                         return "Upload front design to continue";
//     if (selectedSides === "2" && !backFile) return "Upload back design to continue";
//     return "Continue to Design Review";
//   }, [selectedVariant, selectedQuantity, useCustomQty, frontFile, selectedSides, backFile]);

//   // ─── Action handlers
//   const handleShare = () => {
//     navigator.clipboard.writeText(window.location.href);
//     setCopied(true);
//     showToast("success", "Link copied to clipboard!");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleFrontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setFrontFile(file);
//     setFrontPreview(URL.createObjectURL(file));
//     showToast("success", "Front design uploaded!");
//   };

//   const handleBackUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setBackFile(file);
//     setBackPreview(URL.createObjectURL(file));
//     showToast("success", "Back design uploaded!");
//   };

//   const handleContinue = () => {
//     if (!selectedVariant || !frontFile) return;
//     if (selectedSides === "2" && !backFile) {
//       showToast("error", "Please upload the back design too.");
//       return;
//     }
//     let quantityNumber: number;
//     let unitPrice: number;

//     if (useCustomQty) {
//       const parsed = parseInt(customQty, 10);
//       if (isNaN(parsed) || parsed < 1) { showToast("error", "Enter a valid quantity."); return; }
//       quantityNumber = parsed;
//       const tier = selectedVariant.prices
//         .slice()
//         .sort((a, b) => b.min_qty - a.min_qty)
//         .find((p) => parsed >= p.min_qty);
//       unitPrice = tier ? tier.price : selectedVariant.prices[0].price;
//     } else {
//       const row = selectedVariant.prices.find((p) => p.id === selectedQuantity);
//       if (!row) { showToast("error", "Select a quantity."); return; }
//       quantityNumber = row.min_qty;
//       unitPrice = row.price;
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
//         frontDesign: frontFile,
//         backDesign:  selectedSides === "2" ? backFile : null,
//         frontPreview,
//         backPreview,
//         basePrice:   unitPrice,
//         totalPrice:  unitPrice,
//         sides:       selectedSides,
//       },
//     });
//   };

//   return {
//     // data
//     id, product, loading, variants,
//     // gallery
//     allImages, selectedImageIndex, setSelectedImageIndex, showGallery, setShowGallery,
//     // ui flags
//     isFavorite, setIsFavorite, copied,
//     // configuration
//     selectedSize, selectedPaperType, selectedPrintType, selectedCutType, selectedSides, setSelectedSides, setSelectedCutType,
//     allSizes, availablePaperTypes, availablePrintTypes, availableCutTypes,
//     handleSizeChange, handlePaperChange, handlePrintChange,
//     // quantity
//     selectedQuantity, setSelectedQuantity, customQty, setCustomQty, useCustomQty, setUseCustomQty, customQtyPrice,
//     // pricing
//     selectedVariant, totalPrice,
//     // upload
//     frontFile, backFile, frontPreview, backPreview,
//     setFrontFile, setFrontPreview, setBackFile, setBackPreview,
//     // actions
//     handleShare, handleFrontUpload, handleBackUpload, handleContinue,
//     // cta
//     ctaDisabled, ctaLabel,
//     // step
//     currentStep,
//     // toast
//     toasts, dismiss,
//     // navigate
//     navigate,
//     showToast,
//   };
// }


import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { Product } from "../types/productlist";
import { enrichProductData } from "../utils/productutils";
import { API_BASE_URL } from "../constants/productconstants";
import { useToast } from "./Usetoast";

// ─── Types based on new API response ──────────────────────────────────────────

interface AttributeValue {
  attribute_value_id: string;
  attribute_value_name: string;
}

interface Attribute {
  attribute_id: string;
  attribute_name: string;
  values: AttributeValue[];
}

export interface PriceTier {
  min_qty: number;
  max_qty?: number;
  price: number;
}

interface Variant {
  variant_id: string;
  attributes: Attribute[];
  prices: PriceTier[];
}

interface FullDetailsResponse {
  status: string;
  data: {
    product_id: string;
    variants: Variant[];
  };
}

interface ProductDetailResponse {
  status: string;
  product: Product;
}

// ─── Dynamic Configuration Types ─────────────────────────────────────────────

export interface DynamicOption {
  id: string;
  name: string;
  attributeId?: string;
}

export interface SelectedConfiguration {
  [attributeName: string]: string;
}

export interface DynamicVariant {
  id: string;
  attributes: Record<string, string>;
  prices: PriceTier[];
  minPrice: number;
  maxPrice: number;
}

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, show: showToast, dismiss } = useToast();

  // ── Data
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [dynamicVariants, setDynamicVariants] = useState<DynamicVariant[]>([]);

  // ── Dynamic Configuration State
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedConfiguration>({});
  const [availableAttributes, setAvailableAttributes] = useState<Map<string, DynamicOption[]>>(new Map());
  const [allAttributeNames, setAllAttributeNames] = useState<string[]>([]);
  
  // ── Gallery / UI
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Quantity / Pricing
  const [selectedVariant, setSelectedVariant] = useState<DynamicVariant | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<number>(0);
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [customQty, setCustomQty] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  // ── Upload
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // ─── Derived values
  const currentTier = selectedVariant?.prices[selectedTierId] || selectedVariant?.prices[0];
  const unitPrice = currentTier?.price || 0;
  const currentQuantity = useCustomQty ? parseInt(customQty) || 0 : currentTier?.min_qty || 0;
  
  // Get selected sides based on print location attribute
  const selectedSides = useMemo(() => {
    const printLocation = selectedAttributes["print location"];
    if (printLocation) {
      if (printLocation === "front" || printLocation === "back") return "1";
      if (printLocation.includes("front") && printLocation.includes("back")) return "2";
    }
    return "1";
  }, [selectedAttributes]);

  // ─── Step progress
  const currentStep = useMemo(() => {
    if (!selectedVariant || !currentQuantity) return 0;
    if (!frontFile) return 1;
    if (selectedSides === "2" && !backFile) return 1;
    return 2;
  }, [selectedVariant, currentQuantity, frontFile, backFile, selectedSides]);

  // ─── Extract unique attribute names from variants
  const extractAttributeNames = useCallback((variantsData: Variant[]): string[] => {
    const attributeNames = new Set<string>();
    variantsData.forEach(variant => {
      variant.attributes.forEach(attr => {
        attributeNames.add(attr.attribute_name);
      });
    });
    return Array.from(attributeNames);
  }, []);

  // ─── Build available options for each attribute
  const buildAvailableOptions = useCallback((variantsData: Variant[]): Map<string, DynamicOption[]> => {
    const optionsMap = new Map<string, Map<string, DynamicOption>>();
    
    variantsData.forEach(variant => {
      variant.attributes.forEach(attr => {
        if (!optionsMap.has(attr.attribute_name)) {
          optionsMap.set(attr.attribute_name, new Map());
        }
        const attributeMap = optionsMap.get(attr.attribute_name)!;
        attr.values.forEach(value => {
          if (!attributeMap.has(value.attribute_value_name)) {
            attributeMap.set(value.attribute_value_name, {
              id: value.attribute_value_id,
              name: value.attribute_value_name,
              attributeId: attr.attribute_id
            });
          }
        });
      });
    });
    
    const result = new Map<string, DynamicOption[]>();
    optionsMap.forEach((valueMap, key) => {
      result.set(key, Array.from(valueMap.values()));
    });
    return result;
  }, []);

  // ─── Find variant matching selected attributes
  const findMatchingVariant = useCallback((attributes: SelectedConfiguration): DynamicVariant | null => {
    for (const variant of variants) {
      let matches = true;
      
      for (const [attrName, attrValue] of Object.entries(attributes)) {
        const attr = variant.attributes.find(a => a.attribute_name === attrName);
        if (!attr) {
          matches = false;
          break;
        }
        
        const hasValue = attr.values.some(v => v.attribute_value_name === attrValue);
        if (!hasValue) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        // Convert to DynamicVariant format
        const variantAttributes: Record<string, string> = {};
        variant.attributes.forEach(attr => {
          if (attr.values.length > 0) {
            variantAttributes[attr.attribute_name] = attr.values[0].attribute_value_name;
          }
        });
        
        const prices = variant.prices;
        const minPrice = Math.min(...prices.map(p => p.price));
        const maxPrice = Math.max(...prices.map(p => p.price));
        
        return {
          id: variant.variant_id,
          attributes: variantAttributes,
          prices,
          minPrice,
          maxPrice
        };
      }
    }
    return null;
  }, [variants]);

  // ─── Get available options for a specific attribute (cascading)
  const getAvailableOptionsForAttribute = useCallback((attributeName: string): DynamicOption[] => {
    const selectedAttrs = { ...selectedAttributes };
    delete selectedAttrs[attributeName];
    
    // Find all variants that match currently selected attributes (excluding current)
    const matchingVariants = variants.filter(variant => {
      let matches = true;
      
      for (const [attrName, attrValue] of Object.entries(selectedAttrs)) {
        const attr = variant.attributes.find(a => a.attribute_name === attrName);
        if (!attr) {
          matches = false;
          break;
        }
        
        const hasValue = attr.values.some(v => v.attribute_value_name === attrValue);
        if (!hasValue) {
          matches = false;
          break;
        }
      }
      
      return matches;
    });
    
    // Collect unique values for the requested attribute from matching variants
    const options = new Map<string, DynamicOption>();
    matchingVariants.forEach(variant => {
      const attr = variant.attributes.find(a => a.attribute_name === attributeName);
      if (attr) {
        attr.values.forEach(value => {
          if (!options.has(value.attribute_value_name)) {
            options.set(value.attribute_value_name, {
              id: value.attribute_value_id,
              name: value.attribute_value_name,
              attributeId: attr.attribute_id
            });
          }
        });
      }
    });
    
    return Array.from(options.values());
  }, [variants, selectedAttributes]);

  // ─── Handle attribute change with cascading updates
  const handleAttributeChange = useCallback((attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    
    // Clear dependent attributes that might become invalid
    const dependentAttrs = [...allAttributeNames];
    const currentIndex = dependentAttrs.indexOf(attributeName);
    const dependentToClear = dependentAttrs.slice(currentIndex + 1);
    
    dependentToClear.forEach(attr => {
      delete newAttributes[attr];
    });
    
    setSelectedAttributes(newAttributes);
    
    // Find matching variant
    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedTierId(0);
      setUseCustomQty(false);
      setCustomQty("");
      
      // Auto-select remaining single options if only one choice exists
      const remainingAttrs = dependentToClear;
      for (const attr of remainingAttrs) {
        const options = getAvailableOptionsForAttribute(attr);
        if (options.length === 1 && !newAttributes[attr]) {
          newAttributes[attr] = options[0].name;
          setSelectedAttributes(prev => ({ ...prev, [attr]: options[0].name }));
        }
      }
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAttributes, allAttributeNames, findMatchingVariant, getAvailableOptionsForAttribute]);

  // ─── Fetch product and variants
  useEffect(() => {
    if (!id) return;
    
    const fetchProductAndVariants = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productRes = await axios.get<ProductDetailResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
        const raw = productRes.data.product;
        const parsed = {
          ...raw,
          images: safeParse(raw.images),
          related_images: safeParse(raw.related_images),
        };
        setProduct(enrichProductData(parsed));
        
        // Fetch variant details with attributes
        const variantRes = await axios.get<FullDetailsResponse>(
          `${API_BASE_URL}/api/variant_attribute_value/product/${id}/full-details`
        );
        
        if (variantRes.data.status === "success" && variantRes.data.data.variants.length > 0) {
          const variantData = variantRes.data.data.variants;
          setVariants(variantData);
          
          // Extract attribute names
          const attrNames = extractAttributeNames(variantData);
          setAllAttributeNames(attrNames);
          
          // Build available options
          const options = buildAvailableOptions(variantData);
          setAvailableAttributes(options);
          
          // Set default selections (first variant's first attribute values)
          const firstVariant = variantData[0];
          const defaultAttributes: SelectedConfiguration = {};
          attrNames.forEach(attrName => {
            const attr = firstVariant.attributes.find(a => a.attribute_name === attrName);
            if (attr && attr.values.length > 0) {
              defaultAttributes[attrName] = attr.values[0].attribute_value_name;
            }
          });
          setSelectedAttributes(defaultAttributes);
          
          // Set matching variant
          const matchingVariant = findMatchingVariant(defaultAttributes);
          if (matchingVariant) {
            setSelectedVariant(matchingVariant);
          }
        }
      } catch (error) {
        console.error('Error fetching product:  Useproductdetail.ts:773 - useproductdetail.ts:773', error);
        showToast("error", "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductAndVariants();
  }, [id]);

  // ─── Update total price when quantity changes
  useEffect(() => {
    if (selectedVariant) {
      let qty = 0;
      let price = 0;
      
      if (useCustomQty) {
        qty = parseInt(customQty) || 0;
        const tier = selectedVariant.prices
          .slice()
          .sort((a, b) => b.min_qty - a.min_qty)
          .find(p => qty >= p.min_qty);
        price = tier ? tier.price : selectedVariant.prices[0]?.price || 0;
      } else {
        const tier = selectedVariant.prices[selectedTierId];
        if (tier) {
          qty = tier.min_qty;
          price = tier.price;
        }
      }
      
      setQuantity(qty);
      setTotalPrice(price * qty);
    }
  }, [selectedVariant, selectedTierId, useCustomQty, customQty]);

  // ─── All images (main + related)
  const allImages = useMemo(
    () => [
      ...(Array.isArray(product?.images) ? product!.images : []),
      ...(Array.isArray(product?.related_images) ? product!.related_images : []),
    ],
    [product]
  );

  // ─── Get tier label
  const getTierLabel = useCallback((tier: PriceTier, index: number) => {
    const range = tier.max_qty && tier.max_qty !== tier.min_qty
      ? `${tier.min_qty}–${tier.max_qty}`
      : `${tier.min_qty}+`;
    return `${range} pcs — ₹${tier.price}/pc`;
  }, []);

  // ─── Check if all required attributes are selected
  const allAttributesSelected = useMemo(() => {
    return allAttributeNames.every(attrName => selectedAttributes[attrName]);
  }, [allAttributeNames, selectedAttributes]);

  // ─── CTA state
  const ctaDisabled = useMemo(() => {
    return !allAttributesSelected || !selectedVariant || !currentQuantity || !frontFile || (selectedSides === "2" && !backFile);
  }, [allAttributesSelected, selectedVariant, currentQuantity, frontFile, backFile, selectedSides]);

  const ctaLabel = useMemo(() => {
    if (!allAttributesSelected) return "Select all options to continue";
    if (!selectedVariant) return "Select configuration to continue";
    if (!currentQuantity) return "Select a quantity";
    if (!frontFile) return "Upload front design to continue";
    if (selectedSides === "2" && !backFile) return "Upload back design to continue";
    return "Continue to Design Review";
  }, [allAttributesSelected, selectedVariant, currentQuantity, frontFile, selectedSides, backFile]);

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
    if (!allAttributesSelected || !selectedVariant || !frontFile) {
      showToast("error", "Please complete all selections and upload required designs.");
      return;
    }
    
    if (selectedSides === "2" && !backFile) {
      showToast("error", "Please upload the back design too.");
      return;
    }
    
    let quantityNumber: number;
    let unitPriceValue: number;
    let priceId: string | null = null;
    
    if (useCustomQty) {
      const parsed = parseInt(customQty, 10);
      if (isNaN(parsed) || parsed < 1) {
        showToast("error", "Enter a valid quantity.");
        return;
      }
      quantityNumber = parsed;
      const tier = selectedVariant.prices
        .slice()
        .sort((a, b) => b.min_qty - a.min_qty)
        .find(p => parsed >= p.min_qty);
      unitPriceValue = tier ? tier.price : selectedVariant.prices[0]?.price || 0;
    } else {
      const tier = selectedVariant.prices[selectedTierId];
      if (!tier) {
        showToast("error", "Select a quantity.");
        return;
      }
      quantityNumber = tier.min_qty;
      unitPriceValue = tier.price;
      priceId = `${tier.min_qty}-${tier.max_qty || 'plus'}`;
    }
    
    navigate("/design-review", {
      state: {
        product,
        variant: selectedVariant,
        quantity: quantityNumber,
        priceId,
        selectedAttributes,
        selectedOptions: selectedAttributes,
        frontDesign: frontFile,
        backDesign: selectedSides === "2" ? backFile : null,
        frontPreview,
        backPreview,
        basePrice: unitPriceValue,
        totalPrice: unitPriceValue * quantityNumber,
        sides: selectedSides,
      },
    });
  };

  // ─── Get available quantity tiers for current variant
  const quantityTiers = useMemo(() => {
    return selectedVariant?.prices || [];
  }, [selectedVariant]);

  // ─── Custom quantity price lookup
  const customQtyPrice = useMemo(() => {
    if (!selectedVariant || !customQty) return null;
    const qty = parseInt(customQty, 10);
    if (isNaN(qty) || qty < 1) return null;
    return selectedVariant.prices
      .slice()
      .sort((a, b) => b.min_qty - a.min_qty)
      .find(p => qty >= p.min_qty)?.price ?? null;
  }, [customQty, selectedVariant]);

  return {
    // Data
    id, product, loading,
    
    // Dynamic Configuration
    allAttributeNames,
    selectedAttributes,
    availableAttributes,
    getAvailableOptionsForAttribute,
    handleAttributeChange,
    allAttributesSelected,
    
    // Variants
    variants,
    selectedVariant,
    quantityTiers,
    selectedTierId,
    setSelectedTierId,
    getTierLabel,
    
    // Gallery
    allImages,
    selectedImageIndex,
    setSelectedImageIndex,
    showGallery,
    setShowGallery,
    
    // UI Flags
    isFavorite,
    setIsFavorite,
    copied,
    
    // Quantity
    useCustomQty,
    setUseCustomQty,
    customQty,
    setCustomQty,
    customQtyPrice,
    currentQuantity,
    
    // Pricing
    unitPrice,
    totalPrice,
    setTotalPrice,
    
    // Print Sides
    selectedSides,
    
    // Upload
    frontFile,
    backFile,
    frontPreview,
    backPreview,
    setFrontFile,
    setFrontPreview,
    setBackFile,
    setBackPreview,
    
    // Actions
    handleShare,
    handleFrontUpload,
    handleBackUpload,
    handleContinue,
    
    // CTA
    ctaDisabled,
    ctaLabel,
    
    // Step Progress
    currentStep,
    
    // Toast
    toasts,
    dismiss,
    navigate,
    showToast,
  };
}