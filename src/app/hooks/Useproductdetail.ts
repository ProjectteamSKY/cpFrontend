import { useState, useEffect, useCallback, useMemo } from "react";
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

export interface UploadedFilesData {
  frontFile: File | null;
  backFile: File | null;
  frontPreview: string | null;
  backPreview: string | null;
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

export interface AttributeMetadata {
  attribute_id: string;
  attribute_value_id: string;
  attribute_value_name: string;
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

  // Selected attributes as simple strings
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedConfiguration>({});
  // Store metadata separately
  const [attributeMetadata, setAttributeMetadata] = useState<Record<string, AttributeMetadata>>({});

  const [availableAttributes, setAvailableAttributes] = useState<Map<string, DynamicOption[]>>(new Map());
  const [allAttributeNames, setAllAttributeNames] = useState<string[]>([]);

  // ── Gallery / UI
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Quantity / Pricing
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<number>(0);
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [customQty, setCustomQty] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  // Upload state
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // ─── Derived values
  const currentTier = selectedVariant?.prices[selectedTierId] || selectedVariant?.prices[0];
  const unitPrice = currentTier?.price || 0;
  const currentQuantity = useCustomQty ? parseInt(customQty) || 0 : currentTier?.min_qty || 0;

  // Get selected sides based on multiple possible attribute names
  const selectedSides = useMemo(() => {
    const possibleSideAttributes = [
      "print location",
      "Print Location",
      "sides",
      "Sides",
      "printing sides",
      "Printing Sides",
      "orientation",
      "Orientation"
    ];
    
    for (const attrName of possibleSideAttributes) {
      const value = selectedAttributes[attrName];
      if (value && typeof value === "string") {
        const lowerValue = value.toLowerCase();
        
        if (lowerValue === "both" || 
            lowerValue === "double" ||
            lowerValue === "double sided" ||
            lowerValue === "2" ||
            lowerValue === "two sided" ||
            (lowerValue.includes("front") && lowerValue.includes("back")) ||
            lowerValue.includes("both sides")) {
          return "2";
        }
        
        if (lowerValue === "front" || 
            lowerValue === "back" ||
            lowerValue === "1" ||
            lowerValue === "single" ||
            lowerValue === "single sided") {
          return "1";
        }
      }
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
  const findMatchingVariant = useCallback((attributes: SelectedConfiguration): Variant | null => {
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
        return variant;
      }
    }
    return null;
  }, [variants]);

  // ─── Handle attribute changes from dropdowns
  const handleAttributeChange = useCallback((attributeName: string, value: string) => {
    console.log("🟡 useProductDetail  Attribute changed: - useproductdetail.ts:244", { attributeName, value });
    
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Update metadata
    const newMetadata = { ...attributeMetadata };
    for (const variant of variants) {
      const attr = variant.attributes.find(a => a.attribute_name === attributeName);
      if (attr) {
        const val = attr.values.find(v => v.attribute_value_name === value);
        if (val) {
          newMetadata[attributeName] = {
            attribute_id: attr.attribute_id,
            attribute_value_id: val.attribute_value_id,
            attribute_value_name: val.attribute_value_name
          };
          break;
        }
      }
    }
    setAttributeMetadata(newMetadata);

    // Clear dependent attributes
    const allAttrs = extractAttributeNames(variants);
    const currentIndex = allAttrs.indexOf(attributeName);
    const dependentToClear = allAttrs.slice(currentIndex + 1);
    
    dependentToClear.forEach(attr => {
      delete newAttributes[attr];
      delete newMetadata[attr];
    });

    setSelectedAttributes(newAttributes);
    setAttributeMetadata(newMetadata);

    // Find matching variant
    const matchingVariant = findMatchingVariant(newAttributes);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedTierId(0);
      setUseCustomQty(false);
      setCustomQty("");
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAttributes, attributeMetadata, variants, findMatchingVariant, extractAttributeNames]);

  // ─── Handle configuration changes from ConfigurePanel
  const handleConfigurationChange = useCallback((config: SelectedConfiguration) => {
    console.log("🟡 useProductDetail  Configuration changed from panel: - useproductdetail.ts:294", config);
    
    // Update local selected attributes
    setSelectedAttributes(config);
    
    // Update metadata
    const newMetadata: Record<string, AttributeMetadata> = {};
    
    for (const [attrName, attrValue] of Object.entries(config)) {
      for (const variant of variants) {
        const attr = variant.attributes.find(a => a.attribute_name === attrName);
        if (attr) {
          const val = attr.values.find(v => v.attribute_value_name === attrValue);
          if (val) {
            newMetadata[attrName] = {
              attribute_id: attr.attribute_id,
              attribute_value_id: val.attribute_value_id,
              attribute_value_name: val.attribute_value_name
            };
            break;
          }
        }
      }
    }
    
    setAttributeMetadata(newMetadata);
    
    // Find matching variant
    const matchingVariant = findMatchingVariant(config);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      setSelectedTierId(0);
      setUseCustomQty(false);
      setCustomQty("");
    }
  }, [variants, findMatchingVariant]);

  // ─── Get available options for a specific attribute (cascading)
  const getAvailableOptionsForAttribute = useCallback((attributeName: string): DynamicOption[] => {
    const selectedAttrs = { ...selectedAttributes };
    delete selectedAttrs[attributeName];

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

  // ─── Fetch product and variants
  useEffect(() => {
    if (!id) return;

    const fetchProductAndVariants = async () => {
      try {
        setLoading(true);

        const productRes = await axios.get<ProductDetailResponse>(`${API_BASE_URL}/api/productsetup/products/${id}`);
        const raw = productRes.data.product;
        const parsed = {
          ...raw,
          images: safeParse(raw.images),
          related_images: safeParse(raw.related_images),
        };
        setProduct(enrichProductData(parsed));

        const variantRes = await axios.get<FullDetailsResponse>(
          `${API_BASE_URL}/api/variant_attribute_value/product/${id}/full-details`
        );

        if (variantRes.data.status === "success" && variantRes.data.data.variants.length > 0) {
          const variantData = variantRes.data.data.variants;
          setVariants(variantData);

          const attrNames = extractAttributeNames(variantData);
          setAllAttributeNames(attrNames);

          const options = buildAvailableOptions(variantData);
          setAvailableAttributes(options);

          const firstVariant = variantData[0];
          const defaultAttributes: SelectedConfiguration = {};
          const defaultMetadata: Record<string, AttributeMetadata> = {};

          attrNames.forEach(attrName => {
            const attr = firstVariant.attributes.find(a => a.attribute_name === attrName);
            if (attr && attr.values.length > 0) {
              const value = attr.values[0];
              defaultAttributes[attrName] = value.attribute_value_name;
              defaultMetadata[attrName] = {
                attribute_id: attr.attribute_id,
                attribute_value_id: value.attribute_value_id,
                attribute_value_name: value.attribute_value_name
              };
            }
          });

          setSelectedAttributes(defaultAttributes);
          setAttributeMetadata(defaultMetadata);
          setSelectedVariant(firstVariant);
        }
      } catch (error) {
        console.error('Error fetching product: - useproductdetail.ts:428', error);
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

  // Handle continue with files from ConfigurePanel
  const handleContinue = (uploadedFiles?: UploadedFilesData) => {
    // Get the latest selected attributes directly from state
    const currentSelectedAttributes = selectedAttributes;
    const currentAttributeMetadata = attributeMetadata;
    
    console.log("🟡 useProductDetail.handleContinue  START: - useproductdetail.ts:530", {
      hasUploadedFiles: !!uploadedFiles,
      uploadedFrontFile: uploadedFiles?.frontFile?.name,
      uploadedBackFile: uploadedFiles?.backFile?.name,
      stateFrontFile: frontFile?.name,
      stateBackFile: backFile?.name,
      selectedSides,
      allAttributesSelected,
      hasSelectedVariant: !!selectedVariant,
      currentSelectedAttributes,
    });

    // Use files from parameter FIRST (they come from UploadScreen)
    const finalFrontFile = uploadedFiles?.frontFile || frontFile;
    const finalBackFile = uploadedFiles?.backFile || backFile;
    const finalFrontPreview = uploadedFiles?.frontPreview || frontPreview;
    const finalBackPreview = uploadedFiles?.backPreview || backPreview;

    // Determine effective sides based on ACTUAL files and attributes
    let effectiveSides = selectedSides;
    
    if (finalBackFile) {
      effectiveSides = "2";
    }
    
    if (selectedSides === "2" && !finalBackFile && !uploadedFiles?.backFile) {
      console.error("❌ Doublesided selected but no back file provided - useproductdetail.ts:556");
      showToast("error", "Please upload back design for double-sided printing.");
      return;
    }

    console.log("🟡 Step 1  Files determined: - useproductdetail.ts:561", {
      finalFrontFile: finalFrontFile?.name,
      finalBackFile: finalBackFile?.name,
      effectiveSides,
    });

    // Validate all required data
    if (!allAttributesSelected) {
      showToast("error", "Please select all product options.");
      return;
    }

    if (!selectedVariant) {
      showToast("error", "Please select a variant configuration.");
      return;
    }

    if (!finalFrontFile) {
      showToast("error", "Please upload front design.");
      return;
    }

    if (effectiveSides === "2" && !finalBackFile) {
      showToast("error", "Please upload back design for double-sided printing.");
      return;
    }

    // Update local state with the files
    if (uploadedFiles?.frontFile) {
      setFrontFile(uploadedFiles.frontFile);
      setFrontPreview(uploadedFiles.frontPreview);
    }
    if (uploadedFiles?.backFile) {
      setBackFile(uploadedFiles.backFile);
      setBackPreview(uploadedFiles.backPreview);
    }

    // Calculate quantity and pricing
    let quantityNumber: number;
    let unitPriceValue: number;
    let selectedPriceTier: PriceTier | null = null;

    if (useCustomQty) {
      const parsed = parseInt(customQty, 10);
      if (isNaN(parsed) || parsed < 1) {
        showToast("error", "Enter a valid quantity.");
        return;
      }
      quantityNumber = parsed;
      selectedPriceTier = selectedVariant.prices
        .slice()
        .sort((a, b) => b.min_qty - a.min_qty)
        .find(p => parsed >= p.min_qty) || null;
      unitPriceValue = selectedPriceTier?.price || 0;
    } else {
      const tier = selectedVariant.prices[selectedTierId];
      if (!tier) {
        showToast("error", "Select a quantity.");
        return;
      }
      quantityNumber = tier.min_qty;
      unitPriceValue = tier.price;
      selectedPriceTier = tier;
    }

    // Build attribute payload with IDs from metadata
    const attributePayload = Object.entries(currentAttributeMetadata).map(([attrName, meta]) => ({
      attribute_id: meta.attribute_id,
      attribute_value_id: meta.attribute_value_id,
      attribute_name: attrName,
      attribute_value_name: meta.attribute_value_name
    }));

    // Create navigation state with CORRECT file data
    const navigationState = {
      product_id: product?.id,
      product_name: product?.name,
      variant_id: selectedVariant.variant_id,
      attributes: attributePayload,
      quantity: quantityNumber,
      price: {
        min_qty: selectedPriceTier?.min_qty,
        max_qty: selectedPriceTier?.max_qty,
        unit_price: unitPriceValue,
        price_id: `${selectedPriceTier?.min_qty}-${selectedPriceTier?.max_qty || 'plus'}`
      },
      uploadedFiles: {
        frontFile: finalFrontFile,
        backFile: effectiveSides === "2" ? finalBackFile : null,
        frontPreview: finalFrontPreview,
        backPreview: effectiveSides === "2" ? finalBackPreview : null
      },
      previews: {
        front: finalFrontPreview,
        back: effectiveSides === "2" ? finalBackPreview : null
      },
      totalPrice: unitPriceValue * quantityNumber,
      sides: effectiveSides,
      selectedAttributes: currentSelectedAttributes,
      attributeMetadata: currentAttributeMetadata,
      timestamp: Date.now(),
    };

    console.log("🟡 FINAL NAVIGATION STATE: - useproductdetail.ts:664", {
      hasFrontFile: !!navigationState.uploadedFiles.frontFile,
      hasBackFile: !!navigationState.uploadedFiles.backFile,
      frontFileName: navigationState.uploadedFiles.frontFile?.name,
      backFileName: navigationState.uploadedFiles.backFile?.name,
      sides: navigationState.sides,
      selectedAttributes: navigationState.selectedAttributes,
    });

    navigate("/design-review", { state: navigationState });
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
    attributeMetadata,
    availableAttributes,
    getAvailableOptionsForAttribute,
    handleAttributeChange, // ✅ Now defined
    handleConfigurationChange,
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
    handleFrontUpload,
    handleBackUpload,

    // Actions
    handleShare,
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