import { useState, useMemo, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  FileCheck, ShoppingBag, ArrowLeft, CheckCircle, Package,
  Layers, Scissors, Printer, ChevronRight, Shield, Truck,
  RotateCcw, Info, AlertCircle, BadgeCheck, Sparkles, ArrowRight,
  FileImage, Clock,
} from "lucide-react";
import api from "../../service/api";
import { getUserId } from "../../utils/authStorage";

// Helper function to create stable blob URLs from File objects
const createStableBlobUrl = (file: File | null): string | null => {
  if (!file) return null;
  // Revoke any existing URL for this file to avoid memory leaks
  // Note: This is a simplified approach - in production, you'd want to track URLs
  return URL.createObjectURL(file);
};

export function DesignReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMsg, setToastMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Store actual File objects
  const [frontFileObj, setFrontFileObj] = useState<File | null>(null);
  const [backFileObj, setBackFileObj] = useState<File | null>(null);

  // Store stable preview URLs created from File objects
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Extract and preserve File objects from state
  useEffect(() => {
    if (!state) return;

    const { uploadedFiles = {} } = state;
    const { frontFile, backFile } = uploadedFiles;

    // Clean up old URLs
    if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);

    // Store File objects
    if (frontFile && frontFile instanceof File) {
      console.log("✅ Front file found in state:", frontFile.name);
      setFrontFileObj(frontFile);
      // Create a new stable blob URL
      const newFrontUrl = URL.createObjectURL(frontFile);
      setFrontPreviewUrl(newFrontUrl);
    } else if (state.previews?.front) {
      // Fallback: if only preview URL exists, fetch and convert to File
      console.log(" Only preview URL found, converting to File...");
      fetch(state.previews.front)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "front-design.png", { type: blob.type });
          setFrontFileObj(file);
          const newUrl = URL.createObjectURL(file);
          setFrontPreviewUrl(newUrl);
        })
        .catch(err => console.error("Failed to convert front preview:", err));
    }

    if (backFile && backFile instanceof File) {
      console.log("✅ Back file found in state:", backFile.name);
      setBackFileObj(backFile);
      const newBackUrl = URL.createObjectURL(backFile);
      setBackPreviewUrl(newBackUrl);
    } else if (sides === "2" && state.previews?.back) {
      console.log("⚠️ Only back preview URL found, converting to File...");
      fetch(state.previews.back)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "back-design.png", { type: blob.type });
          setBackFileObj(file);
          const newUrl = URL.createObjectURL(file);
          setBackPreviewUrl(newUrl);
        })
        .catch(err => console.error("Failed to convert back preview:", err));
    }
  }, [state]);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    };
  }, [frontPreviewUrl, backPreviewUrl]);

  // Comprehensive state validation
  const isStateValid = useMemo(() => {
    if (!state) {
      console.error("No state found in location");
      return false;
    }

    const hasFront = !!frontFileObj || !!state.uploadedFiles?.frontFile || !!state.previews?.front;
    if (!hasFront) {
      console.error("Front design is missing");
      return false;
    }

    if (!state.product_id) {
      console.error("Product ID is missing");
      return false;
    }

    if (!state.variant_id) {
      console.error("Variant ID is missing");
      return false;
    }

    if (!state.attributes || state.attributes.length === 0) {
      console.error("Attributes are missing or empty");
      return false;
    }

    if (!state.quantity || state.quantity < 1) {
      console.error("Quantity is invalid", state.quantity);
      return false;
    }

    if (!state.price) {
      console.error("Price information is missing");
      return false;
    }

    return true;
  }, [state, frontFileObj]);

  // Extract validated state data
  const {
    product_id,
    variant_id,
    attributes = [],
    quantity: selectedQuantity,
    price,
    uploadedFiles = {},
    sides = "1",
    previews = {},
  } = state || {};

  // Use our stable preview URLs instead of the ones from state
  const frontPreview = frontPreviewUrl || previews.front || uploadedFiles.frontPreview;
  const backPreview = backPreviewUrl || previews.back || uploadedFiles.backPreview;

  const accessToken = sessionStorage.getItem("access_token");

  // Debug logging
  useEffect(() => {
    console.log("DesignReviewPage - State:", {
      sides,
      hasBackFileObj: !!backFileObj,
      hasBackPreview: !!backPreview,
      hasFrontFileObj: !!frontFileObj,
      hasFrontPreview: !!frontPreview,
      frontPreviewUrl,
      backPreviewUrl,
    });
  }, [sides, backFileObj, backPreview, frontFileObj, frontPreview, frontPreviewUrl, backPreviewUrl]);

  // Safety check
  if (!isStateValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-10 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} color="#C8352A" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid Order Data</h2>
          <p className="text-gray-500 mb-6 text-sm">
            {!state ? "No order data found. Please configure your product first." :
              !frontFileObj && !state.uploadedFiles?.frontFile && !state.previews?.front ? "Front design is missing. " :
                !state.product_id ? "Product not selected. " :
                  !state.variant_id ? "Variant not selected. " :
                    !state.quantity ? "Quantity not set. " :
                      "Some required information is missing. "}
            Please go back and complete all required steps.
          </p>
          <button
            className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3 px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={15} /> Go Back to Configure
          </button>
        </div>
      </div>
    );
  }

  // Helper functions
  const getCartId = async (userId: string): Promise<string> => {
    try {
      const response = await api.get(`/cart/user/${userId}`);
      const carts = response.data;
      if (Array.isArray(carts) && carts.length > 0) return String(carts[0].id);
      const createResponse = await api.post("/cart", {
        user_id: userId,
        status: "active",
        total_amount: 0,
        total_discount: 0,
      });
      return String(createResponse.data.id);
    } catch (err: any) {
      if (err.response?.status === 404) {
        const createResponse = await api.post("/cart", {
          user_id: userId,
          status: "active",
          total_amount: 0,
          total_discount: 0,
        });
        return String(createResponse.data.id);
      }
      throw err;
    }
  };

  // Add to cart handler
  // Add to cart handler
  const handleAddToCart = async () => {
    const userId = getUserId();
    if (!userId) {
      showToast("info", "Please log in to continue");
      setTimeout(() => navigate("/login"), 500);
      return;
    }

    try {
      setLoading(true);
      setError("");
      showToast("info", "Processing your order…");

      const cartId = await getCartId(userId);
      const quantityNumber = Number(selectedQuantity || 1);

      // Build selected_attributes as a standard JSON array
      const selectedAttributesArray = attributes.map((attr: any) => ({
        attribute_id: attr.attribute_id,
        attribute_value_id: attr.attribute_value_id,
        attribute_name: attr.attribute_name,
        attribute_value_name: attr.attribute_value_name
      }));

      const formData = new FormData();
      formData.append("cart_id", String(cartId));
      formData.append("product_id", String(product_id));
      formData.append("variant_id", String(variant_id));
      formData.append("quantity", String(quantityNumber));
      formData.append("selected_attributes", JSON.stringify(selectedAttributesArray));

      // Use the stored File objects directly
      let frontFileToUpload: File | null = frontFileObj;

      if (!frontFileToUpload && uploadedFiles.frontFile instanceof File) {
        frontFileToUpload = uploadedFiles.frontFile;
      }

      if (!frontFileToUpload) {
        throw new Error("Front design file is invalid or missing. Please upload again.");
      }

      formData.append("front_file", frontFileToUpload);

      // Handle back file for double-sided
      if (sides === "2") {
        let backFileToUpload: File | null = backFileObj;

        if (!backFileToUpload && uploadedFiles.backFile instanceof File) {
          backFileToUpload = uploadedFiles.backFile;
        }

        if (!backFileToUpload) {
          throw new Error("Back design file is invalid or missing for double-sided printing. Please upload again.");
        }

        formData.append("back_file", backFileToUpload);
      }

      const response = await api.post("/cartitems/with-files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`
        },
      });

      console.log("✅ Item added to cart successfully:", response.data);
      showToast("success", "Item added to cart successfully!");

      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (err: any) {
      console.error("❌ Error adding to cart:", err);

      let msg = "Failed to add item to cart";
      if (err?.response?.data?.detail) {
        msg = typeof err.response.data.detail === "string"
          ? err.response.data.detail
          : JSON.stringify(err.response.data.detail, null, 2);
      } else if (err?.message) {
        msg = err.message;
      }

      showToast("error", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Price calculations
  const quantityNumber = Number(selectedQuantity || 1);
  const unitPrice = price?.unit_price || price?.price || 0;
  const subtotal = unitPrice * quantityNumber;
  const gst = +(subtotal * 0.18).toFixed(2);
  const total = +(subtotal + gst).toFixed(2);

  // Build attribute display items
  const attributeItems = useMemo(() => {
    const items: Array<{ label: string; value: string; icon: any; color: string }> = [];

    items.push({
      label: "Printing Sides",
      value: sides === "2" ? "Double Sided" : "Single Sided",
      icon: FileCheck,
      color: "#2563EB"
    });

    attributes.forEach((attr: any, index: number) => {
      const displayName = attr.attribute_name || attr.label || `Attribute ${index + 1}`;
      const displayValue = attr.attribute_value_name || attr.value || attr.attribute_value_id || "N/A";

      items.push({
        label: displayName,
        value: displayValue,
        icon: Package,
        color: "#EF4444",
      });
    });

    items.push({
      label: "Quantity",
      value: `${quantityNumber.toLocaleString()} pcs`,
      icon: Package,
      color: "#EF4444",
    });

    return items;
  }, [sides, attributes, quantityNumber]);

  // Render component
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-11 flex items-center gap-1.5 text-xs text-gray-400">
          <button
            onClick={() => navigate("/")}
            className="bg-none border-none cursor-pointer text-gray-600 font-medium text-xs p-0 hover:text-gray-900"
          >
            Home
          </button>
          <ChevronRight size={12} color="#D4D4D8" />
          <button
            onClick={() => navigate("/products")}
            className="bg-none border-none cursor-pointer text-gray-600 font-medium text-xs p-0 hover:text-gray-900"
          >
            Products
          </button>
          <ChevronRight size={12} color="#D4D4D8" />
          <span className="text-gray-900 font-semibold">Design Review</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 pb-16 bg-white">
        {/* Header */}
        <div className="animate-[fade-up_0.5s_ease_both] mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg py-1.5 px-3 cursor-pointer text-xs font-semibold text-gray-600 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              </div>
              <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 m-0 leading-tight">
                Review Your Order
              </h1>
              <p className="text-sm text-gray-400 mt-1.5">
                Confirm your design and specifications before adding to cart.
              </p>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Design Preview */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 animate-[fade-up_0.5s_ease_both]">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles size={16} color="#C8352A" />
                <h2 className="text-base font-bold text-gray-900 m-0">Design Preview</h2>
              </div>

              <div className="flex gap-5 flex-wrap">
                {/* Front Side */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Front Side</p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 transition-shadow duration-200 hover:shadow-md w-36 h-36 md:w-44 md:h-44 bg-gray-50">
                    {frontPreview ? (
                      <img
                        src={frontPreview}
                        alt="Front Design"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error("Front preview image failed to load:", frontPreview);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <FileImage size={28} color="#D4D4D8" />
                        <span className="text-[11px] text-gray-400">No preview</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                    <span className="text-[11px] text-green-600 font-semibold">File Ready</span>
                  </div>
                </div>

                {/* Back Side */}
                {sides === "2" && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-2">Back Side</p>
                    <div className="rounded-xl overflow-hidden border border-gray-200 transition-shadow duration-200 hover:shadow-md w-36 h-36 md:w-44 md:h-44 bg-gray-50">
                      {backPreview ? (
                        <img
                          src={backPreview}
                          alt="Back Design"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error("Back preview image failed to load:", backPreview);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                          <FileImage size={28} color="#D4D4D8" />
                          <span className="text-[11px] text-gray-400">No preview</span>
                        </div>
                      )}
                    </div>
                    {backPreview && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                        <span className="text-[11px] text-green-600 font-semibold">File Ready</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
                  <p>Debug: sides={sides}, hasBackPreview={!!backPreview}, hasBackFile={!!backFileObj}</p>
                  <p>Front: hasFile={!!frontFileObj}, hasPreview={!!frontPreview}</p>
                </div>
              )}
            </div>

            {/* Product Specifications */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-7 animate-[fade-up_0.5s_ease_both]">
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package size={16} color="#C8352A" />
                Product Specifications
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden border border-gray-200">
                {attributeItems.map(({ label, value, icon: Icon, color }, i) => (
                  <div
                    key={`${label}-${i}`}
                    className={`
                      flex items-center gap-3 p-3.5 px-4
                      ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      ${i < attributeItems.length - 1 ? 'border-b border-gray-200' : ''}
                      ${i % 2 === 0 && i !== attributeItems.length - 1 ? 'border-r border-gray-200' : ''}
                      transition-all duration-200
                    `}
                  >
                    <div
                      className="p-2 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon size={14} color={color} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">
                        {label}
                      </p>
                      <p className="text-[13px] font-semibold text-gray-900">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-[fade-up_0.5s_ease_both]">
              {[
                { icon: Truck, title: "Delivery", desc: "3–5 business days", color: "#2563EB", bg: "#EFF6FF" },
                { icon: Clock, title: "Processing", desc: "Same-day dispatch", color: "#D97706", bg: "#FFFBEB" },
                { icon: Shield, title: "Quality", desc: "100% guaranteed", color: "#16A34A", bg: "#F0FDF4" },
              ].map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-3.5 px-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                    <Icon size={16} color={color} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800 mb-0.5">{title}</p>
                    <p className="text-[11px] text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 pl-5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5">
                <AlertCircle size={15} color="#DC2626" className="shrink-0 mt-0.5" />
                <p className="text-[13px] text-red-600 leading-relaxed">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-16">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 animate-[fade-up_0.5s_ease_both]">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag size={16} color="#C8352A" />
                <h2 className="text-base font-bold text-gray-900 m-0">Order Summary</h2>
              </div>

              {/* Price Breakdown */}
              <div>
                <div className="flex justify-between items-center text-[13px] py-2">
                  <span className="text-gray-500 font-medium">
                    {quantityNumber.toLocaleString()} pcs × ₹{unitPrice.toFixed(2)}
                  </span>
                  <span className="text-gray-800 font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] py-2">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    GST (18%)
                    <span title="Goods and Services Tax" className="cursor-help">
                      <Info size={11} color="#A1A1AA" />
                    </span>
                  </span>
                  <span className="text-gray-800 font-semibold">₹{gst.toLocaleString()}</span>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              {/* Total */}
              <div className="flex justify-between items-baseline">
                <span className="text-[15px] font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <p className="text-[28px] font-extrabold text-red-600 leading-none m-0">
                    ₹{total.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Inclusive of all taxes</p>
                </div>
              </div>

              <div className="h-px bg-gray-100 my-5" />

              {/* GST Invoice Note */}
              <div className="p-2.5 pl-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 mb-4 text-xs text-green-600 font-medium">
                <BadgeCheck size={14} color="#16A34A" className="shrink-0" />
                GST invoice will be provided with your order
              </div>

              {/* Add to Cart Button */}
              <button
                className="w-full py-3.5 px-6 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-400"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              {/* Continue Shopping Button */}
              <div className="mt-3">
                <Link to="/products" className="no-underline">
                  <button className="w-full py-3 px-6 bg-white text-gray-700 font-semibold text-sm rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2">
                    <RotateCcw size={14} />
                    Continue Shopping
                  </button>
                </Link>
              </div>

              <div className="h-px bg-gray-100 my-4" />

              {/* Trust Indicators */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: Shield, text: "256-bit SSL encrypted checkout" },
                  { icon: FileCheck, text: "Proofing available on request" },
                  { icon: RotateCcw, text: "Hassle-free reorder with saved design" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[11px] text-gray-500">
                    <Icon size={12} color="#A1A1AA" className="shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[999] animate-[fade-up_0.3s_ease_both]">
          <div className="bg-white rounded-xl shadow-lg p-3 px-4 flex items-center gap-2.5 text-[13px] font-medium text-gray-800 max-w-xs">
            <div className={`
              w-2 h-2 rounded-full shrink-0
              ${toastMsg.type === "success" ? "bg-green-600" : toastMsg.type === "error" ? "bg-red-600" : "bg-blue-600"}
            `} />
            {toastMsg.text}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        .animate-\\[fade-up_0\\.5s_ease_both\\] {
          animation: fade-up 0.5s ease both;
        }
        .animate-\\[fade-up_0\\.3s_ease_both\\] {
          animation: fade-up 0.3s ease both;
        }
      `}</style>
    </div>
  );
}