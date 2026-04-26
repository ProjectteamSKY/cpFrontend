import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  MapPin,
  Home,
  Briefcase,
  ArrowLeft,
  Truck,
  Zap,
  Clock,
  IndianRupee,
  ChevronRight,
  Shield,
  Package,
  Building2,
  Navigation,
  Timer,
  Sparkles,
  Wallet,
  Landmark,
  CircleCheckBig,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import gpay from "../../../media/icons8-google-pay-50.svg";
import paytm from "../../../media/icons8-paytm-50.svg";
import phonepe from "../../../media/icons8-phone-pe-50.svg";
import { getUserId } from "../../utils/authStorage";

const API_BASE = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

export function CheckoutPage() {
  const navigate = useNavigate();
  const userId = getUserId();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [isFetchingDeliveryCharge, setIsFetchingDeliveryCharge] = useState(false);
  const [isHyperlocal, setIsHyperlocal] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(null);
  const [hyperlocalCheck, setHyperlocalCheck] = useState(null);
  const [standardDeliveryOptions, setStandardDeliveryOptions] = useState([]);
  const [hyperlocalDeliveryOptions, setHyperlocalDeliveryOptions] = useState([]);
  
  // Refs to prevent duplicate API calls
  const hasFetchedCart = useRef(false);
  const hasFetchedDelivery = useRef(false);
  const isFetchingRef = useRef(false);
  
  // Read selected address from sessionStorage
  const selectedAddressId = sessionStorage.getItem("selected_address_id");
  const selectedAddress = (() => {
    try {
      const raw = sessionStorage.getItem("selected_address");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  // Guard: if no address selected, redirect back to address page
  useEffect(() => {
    if (!selectedAddressId || !selectedAddress) {
      toast.error("Please select a delivery address first");
      navigate("/address");
    }
  }, []);

  // Fetch Cart Items
  const fetchCartItems = async () => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      setLoadingCart(false);
      return;
    }

    if (hasFetchedCart.current) return;
    hasFetchedCart.current = true;

    try {
      const res = await axios.get(
        `${API_BASE}/cartitems/user/${userId}`,
        { withCredentials: true }
      );
      console.log("Cart items response:", res.data);
      const rawItems = res.data.data || [];

      if (!rawItems.length) {
        toast.warning("Your cart is empty");
        setCartItems([]);
        setLoadingCart(false);
        return;
      }

      const enrichedItems = await Promise.all(
        rawItems.map(async (item) => {
          try {
            const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
            const product = productRes.data.data || productRes.data;

            let parsedAttributes = {};
            if (item.selected_attributes) {
              try {
                const attrArray = JSON.parse(item.selected_attributes);
                if (Array.isArray(attrArray)) {
                  attrArray.forEach((attr) => {
                    parsedAttributes[attr.attribute_name] = attr.attribute_value_name;
                  });
                }
              } catch (e) {
                console.error("Failed to parse selected_attributes", e);
              }
            }

            let productImage = null;
            if (product.images) {
              let images = product.images;
              if (typeof images === 'string') {
                try {
                  images = JSON.parse(images);
                } catch (e) {
                  images = [];
                }
              }
              if (Array.isArray(images) && images.length > 0) {
                const defaultImg = images.find((img) => img.is_default);
                const imgToUse = defaultImg || images[0];
                if (imgToUse && imgToUse.url) {
                  productImage = MEDIA_BASE + imgToUse.url.replace(/^\/?/, "");
                }
              }
            }

            const files = (item.files || []).map((f) => ({
              ...f,
              front_side_url: f.front_side_url
                ? (f.front_side_url.startsWith('http')
                  ? f.front_side_url
                  : MEDIA_BASE + f.front_side_url.replace(/^\/?/, ""))
                : null,
              back_side_url: f.back_side_url
                ? (f.back_side_url.startsWith('http')
                  ? f.back_side_url
                  : MEDIA_BASE + f.back_side_url.replace(/^\/?/, ""))
                : null,
            }));

            const weight = Number(item.weight) || 0;
            const length = Number(item.length) || 0;
            const breadth = Number(item.breadth) || 0;
            const height = Number(item.height) || 0;

            return {
              ...item,
              product_name: product.name || "Unknown Product",
              product_image: productImage,
              selected_options: parsedAttributes,
              files: files,
              weight: weight,
              length: length,
              breadth: breadth,
              height: height,
            };
          } catch (err) {
            console.error("Failed to enrich item", item.id, err);
            const files = (item.files || []).map((f) => ({
              ...f,
              front_side_url: f.front_side_url
                ? (f.front_side_url.startsWith('http')
                  ? f.front_side_url
                  : MEDIA_BASE + f.front_side_url.replace(/^\/?/, ""))
                : null,
              back_side_url: f.back_side_url
                ? (f.back_side_url.startsWith('http')
                  ? f.back_side_url
                  : MEDIA_BASE + f.back_side_url.replace(/^\/?/, ""))
                : null,
            }));

            const weight = Number(item.weight) || 0;
            const length = Number(item.length) || 0;
            const breadth = Number(item.breadth) || 0;
            const height = Number(item.height) || 0;

            return {
              ...item,
              product_name: "Product",
              product_image: null,
              selected_options: {},
              files: files,
              weight: weight,
              length: length,
              breadth: breadth,
              height: height,
            };
          }
        })
      );

      console.log("Enriched cart items:", enrichedItems);
      setCartItems(enrichedItems);
      await checkHyperlocalAvailability();
    } catch (err) {
      console.error("Failed to fetch cart items", err);
      toast.error("Failed to load cart items");
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  // Check Hyperlocal Availability
  const checkHyperlocalAvailability = async () => {
    if (!selectedAddress?.postal_code) {
      console.log("No postal code available");
      return;
    }

    try {
      const deliveryPostcode = selectedAddress.postal_code;
      console.log("Checking hyperlocal for pincode:", deliveryPostcode);
      const res = await axios.get(`${API_BASE}/shipping/hyperlocal/check`, {
        params: { pincode: deliveryPostcode }
      });
      
      console.log("Hyperlocal check response:", res.data);
      setHyperlocalCheck(res.data);
      
      if (res.data.is_chennai_surrounding) {
        setIsHyperlocal(true);
        console.log("Hyperlocal delivery available for this pincode");
        await fetchBothDeliveryOptions();
      } else {
        setIsHyperlocal(false);
        console.log("Standard delivery only for this pincode");
        await fetchStandardDeliveryCharges();
      }
    } catch (err) {
      console.error("Hyperlocal check failed", err);
      setIsHyperlocal(false);
      await fetchStandardDeliveryCharges();
    }
  };

  // Fetch Both Delivery Options
  const fetchBothDeliveryOptions = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetchingDeliveryCharge(true);
    console.log("Fetching both standard and hyperlocal delivery options...");
    
    try {
      if (cartItems.length === 0) {
        console.log("Waiting for cart items...");
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const [standardResult, hyperlocalResult] = await Promise.allSettled([
        fetchStandardDeliveryChargesInternal(),
        fetchHyperlocalDeliveryChargesInternal()
      ]);
      
      let allOptions = [];
      
      if (standardResult.status === 'fulfilled' && standardResult.value.length > 0) {
        setStandardDeliveryOptions(standardResult.value);
        allOptions = [...allOptions, ...standardResult.value];
      }
      
      if (hyperlocalResult.status === 'fulfilled' && hyperlocalResult.value.length > 0) {
        setHyperlocalDeliveryOptions(hyperlocalResult.value);
        allOptions = [...allOptions, ...hyperlocalResult.value];
      }
      
      allOptions.sort((a, b) => a.cost - b.cost);
      setDeliveryOptions(allOptions);
      
      if (allOptions.length > 0) {
        setSelectedDeliveryOption(allOptions[0]);
        setDeliveryCharge(allOptions[0].cost);
      }
      
    } catch (err) {
      console.error("Failed to fetch delivery options", err);
      toast.error("Failed to fetch delivery options");
    } finally {
      setIsFetchingDeliveryCharge(false);
      isFetchingRef.current = false;
    }
  };

  // Fetch Standard Delivery Charges (Internal)
  const fetchStandardDeliveryChargesInternal = async () => {
    if (!selectedAddress?.postal_code) {
      return [];
    }

    console.log("Fetching standard delivery charges...");
    
    try {
      const totalWeight = cartItems.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
      const totalLength = cartItems.reduce((sum, item) => sum + (Number(item.length) || 0), 0);
      const totalBreadth = cartItems.reduce((sum, item) => sum + (Number(item.breadth) || 0), 0);
      const totalHeight = cartItems.reduce((sum, item) => sum + (Number(item.height) || 0), 0);
      
      const declaredValue = cartItems.reduce(
        (sum, i) => sum + Number(i.total_price),
        0
      );

      const deliveryPostcode = selectedAddress.postal_code;
      const pickupPostcode = "600001";
      // Map payment method to COD flag (1 for COD, 0 for PREPAID)
      const codValue = paymentMethod === "cod" ? 1 : 0;
      
      console.log("Standard Delivery Parameters:", {
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
        weight: totalWeight,
        length: totalLength,
        breadth: totalBreadth,
        height: totalHeight,
        cod: codValue,
        declared_value: declaredValue,
      });
      
      const res = await axios.get(`${API_BASE}/shipping/serviceavailability`, {
        params: {
          pickup_postcode: pickupPostcode,
          delivery_postcode: deliveryPostcode,
          weight: totalWeight,
          length: totalLength,
          breadth: totalBreadth,
          height: totalHeight,
          cod: codValue,
          declared_value: declaredValue,
        },
      });

      console.log("Standard delivery response:", res.data);

      let options = [];
      
      if (res.data.couriers && res.data.couriers.length > 0) {
        options = res.data.couriers.map((courier, index) => ({
          id: `standard_${index}`,
          name: courier.courier_name || `Standard Courier ${index + 1}`,
          type: "normal", // API expects 'normal' for standard delivery
          delivery_type: "normal",
          cost: Number(courier.total_cost || courier.rate || 0),
          estimated_days: courier.estimated_delivery_days || 5,
          estimated_hours: (courier.estimated_delivery_days || 5) * 24,
          is_hyperlocal: false,
          description: `Standard delivery in ${courier.estimated_delivery_days || 5} days`,
          courier_id: courier.courier_company_id || null, // Fixed: Use courier_company_id
        }));
      } else if (res.data.best_courier) {
        options = [{
          id: "standard_0",
          name: res.data.best_courier.courier_name || "Standard Delivery",
          type: "normal", // API expects 'normal' for standard delivery
          delivery_type: "normal",
          cost: Number(res.data.best_courier.total_cost || res.data.best_courier.rate || 0),
          estimated_days: res.data.best_courier.estimated_delivery_days || 5,
          estimated_hours: (res.data.best_courier.estimated_delivery_days || 5) * 24,
          is_hyperlocal: false,
          description: `Standard delivery in ${res.data.best_courier.estimated_delivery_days || 5} days`,
          courier_id: res.data.best_courier.courier_company_id || null, // Fixed: Use courier_company_id
        }];
      }
      
      return options;
    } catch (err) {
      console.error("Standard delivery charge fetch failed", err);
      return [];
    }
  };

  // Fetch Hyperlocal Delivery Charges (Internal)
  const fetchHyperlocalDeliveryChargesInternal = async () => {
    if (!selectedAddress?.postal_code) {
      return [];
    }

    console.log("Fetching hyperlocal delivery charges...");
    
    try {
      const pickupPostcode = "600100";
      const deliveryPostcode = selectedAddress.postal_code;
      // Map payment method to COD flag (1 for COD, 0 for PREPAID)
      const codValue = paymentMethod === "cod" ? 1 : 0;
      
      console.log("Hyperlocal Delivery Parameters:", {
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
        cod: codValue,
      });
      
      const res = await axios.get(`${API_BASE}/shipping/hyperlocal/serviceability`, {
        params: {
          pickup_postcode: pickupPostcode,
          delivery_postcode: deliveryPostcode,
          cod: codValue,
        },
      });

      console.log("Hyperlocal delivery response:", res.data);

      let options = [];
      
      if (res.data.all_couriers && res.data.all_couriers.length > 0) {
        options = res.data.all_couriers.map((courier, index) => {
          const isExpress = courier.courier_name.includes("Quick") || 
                           courier.estimated_delivery_time_hours <= 24;
          
          return {
            id: `hyperlocal_${index}`,
            name: courier.courier_name,
            type: "hyperlocal", // API expects 'hyperlocal'
            delivery_type: "hyperlocal",
            cost: Number(courier.total_cost || 0),
            estimated_hours: courier.estimated_delivery_time_hours,
            estimated_days: Math.ceil(courier.estimated_delivery_time_hours / 24),
            distance_km: courier.distance_km,
            etd: courier.etd,
            is_hyperlocal: true,
            description: isExpress ? 
              `Express delivery in ${courier.estimated_delivery_time_hours} hours` : 
              `Hyperlocal delivery • ${courier.distance_km} km away`,
            courier_id: courier.courier_id || courier.courier_company_id || null, // Handle both field names
          };
        });
      } else if (res.data.best_courier) {
        const bestCourier = res.data.best_courier;
        const isExpress = bestCourier.courier_name.includes("Quick") || 
                         bestCourier.estimated_delivery_time_hours <= 24;
        
        options = [{
          id: "hyperlocal_0",
          name: bestCourier.courier_name,
          type: "hyperlocal", // API expects 'hyperlocal'
          delivery_type: "hyperlocal",
          cost: Number(bestCourier.total_cost || 0),
          estimated_hours: bestCourier.estimated_delivery_time_hours,
          estimated_days: Math.ceil(bestCourier.estimated_delivery_time_hours / 24),
          distance_km: bestCourier.distance_km,
          etd: bestCourier.etd,
          is_hyperlocal: true,
          description: isExpress ? 
            `Express delivery in ${bestCourier.estimated_delivery_time_hours} hours` : 
            `Hyperlocal delivery • ${bestCourier.distance_km} km away`,
          courier_id: bestCourier.courier_id || bestCourier.courier_company_id || null, // Handle both field names
        }];
      }
      
      return options;
    } catch (err) {
      console.error("Hyperlocal delivery charge fetch failed", err);
      return [];
    }
  };

  // Fetch Standard Delivery Charges (Public)
  const fetchStandardDeliveryCharges = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsFetchingDeliveryCharge(true);
    
    try {
      if (cartItems.length === 0) {
        console.log("Waiting for cart items...");
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const options = await fetchStandardDeliveryChargesInternal();
      setStandardDeliveryOptions(options);
      setDeliveryOptions(options);
      setHyperlocalDeliveryOptions([]);
      
      if (options.length > 0) {
        setSelectedDeliveryOption(options[0]);
        setDeliveryCharge(options[0].cost);
      } else {
        setDeliveryCharge(0);
      }
    } catch (err) {
      console.error("Failed to fetch standard delivery", err);
      setDeliveryCharge(0);
    } finally {
      setIsFetchingDeliveryCharge(false);
      isFetchingRef.current = false;
    }
  };

  // Initialize cart and delivery fetch on mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Re-fetch delivery options when payment method changes
  useEffect(() => {
    if (cartItems.length > 0 && selectedAddress?.postal_code && !loadingCart) {
      console.log("Payment method changed to:", paymentMethod);
      hasFetchedDelivery.current = false;
      if (isHyperlocal) {
        fetchBothDeliveryOptions();
      } else {
        fetchStandardDeliveryCharges();
      }
    }
  }, [paymentMethod, cartItems.length, loadingCart]);

  // Handle delivery option selection
  const handleDeliveryOptionChange = (option) => {
    setSelectedDeliveryOption(option);
    setDeliveryCharge(option.cost);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  const roundedSubtotal = Math.round(subtotal);
  const roundedDelivery = Math.round(deliveryCharge);
  const gst = Math.round(roundedSubtotal * 0.18);
  const total = Math.round(roundedSubtotal + gst + roundedDelivery);

  // ================= PLACE ORDER (CORRECTED) =================
  const handlePlaceOrder = async () => {
    if (!userId) {
      toast.warning("User not logged in! Please login again.");
      return;
    }
    if (!cartItems.length) {
      toast.warning("Cart is empty!");
      return;
    }
    if (!selectedAddressId) {
      toast.error("No delivery address selected. Please go back and select one.");
      navigate("/address");
      return;
    }
    if (!selectedDeliveryOption) {
      toast.error("Please select a delivery option");
      return;
    }

    setPlacingOrder(true);

    try {
      // Format cart items according to backend CheckoutRequest model
      const cartItemsPayload = cartItems.map((item) => ({
        cart_item_id: item.id,
        quantity: item.quantity,
        total_price: parseFloat(item.total_price),
        product_id: item.product_id,
        product_variant_price_id: item.product_variant_price_id || null,
        customize_qty: item.customize_qty || 0,
        selected_attributes: item.selected_options || {},
        files: item.files || [],
        weight: item.weight || 0,
        length: item.length || 0,
        breadth: item.breadth || 0,
        height: item.height || 0
      }));

      // Map payment method: 'cod' -> 'COD', 'upi' -> 'PREPAID'
      const apiPaymentMethod = paymentMethod === "cod" ? "COD" : "PREPAID";
      
      // Map delivery type: 'hyperlocal' or 'normal'
      const apiDeliveryType = selectedDeliveryOption.delivery_type === "hyperlocal" ? "hyperlocal" : "normal";

      console.log("Selected delivery option details:", {
        courier_id: selectedDeliveryOption.courier_id,
        courier_name: selectedDeliveryOption.name,
        delivery_type: apiDeliveryType,
        original_type: selectedDeliveryOption.delivery_type,
        cost: selectedDeliveryOption.cost
      });

      // Prepare payload matching backend schema
      const checkoutPayload = {
        user_id: userId,
        cart_id: cartItems[0].cart_id,
        cart_items: cartItemsPayload,
        address_id: selectedAddressId,
        payment_method: apiPaymentMethod, // 'COD' or 'PREPAID'
        delivery_type: apiDeliveryType,   // 'hyperlocal' or 'normal'
        courier_id: selectedDeliveryOption.courier_id ? String(selectedDeliveryOption.courier_id) : null,
        courier_name: selectedDeliveryOption.name || null,
        delivery_charge: roundedDelivery
      };

      console.log("📦 Checkout payload being sent:", JSON.stringify(checkoutPayload, null, 2));

      const checkoutRes = await axios.post(
        `${API_BASE}/orders_routes/checkout`,
        checkoutPayload,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Checkout response:", checkoutRes.data);

      const newOrderId = checkoutRes.data.order_id || checkoutRes.data.data?.order_id;
      setOrderId(newOrderId);

      // Clear session storage
      sessionStorage.removeItem("selected_address_id");
      sessionStorage.removeItem("selected_address");

      setShowSuccess(true);
      toast.success(`Order placed successfully! Order ID: ${newOrderId}`);
      
      // Clear cart from localStorage/sessionStorage if needed
      localStorage.removeItem("cart");
      
    } catch (err) {
      console.error("❌ Checkout failed:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err?.response?.data?.detail || 
                          err?.response?.data?.message ||
                          err?.message ||
                          "Checkout failed. Please try again.";
      
      toast.error(errorMessage);
    } finally {
      setPlacingOrder(false);
    }
  };

  // Generate QR for UPI payment
  const generateQR = async () => {
    try {
      setQrLoading(true);
      const res = await axios.post(
        `${API_BASE}/bank/qr-generate`,
        {},
        {
          params: { amount: total.toFixed(2) },
          responseType: "blob",
        }
      );
      const imageUrl = URL.createObjectURL(res.data);
      setQrData(imageUrl);
      setShowQR(true);
    } catch (err) {
      console.error("QR generation failed", err);
      toast.error("Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };

  const addressTypeIcon = (type) => {
    if (type === "work") return <Briefcase className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  // Loading State
  if (loadingCart) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full border-2 border-[#D73D32] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-400 tracking-wider uppercase">
            Loading cart
          </p>
        </div>
      </div>
    );
  }

  // QR Payment State
  if (showQR) {
    const paymentApps = [
      { name: "Google Pay", icon: gpay, bgColor: "bg-white" },
      { name: "PhonePe", icon: paytm, bgColor: "bg-white" },
      { name: "Paytm", icon: phonepe, bgColor: "bg-white" }
    ];

    return (
      <div className="flex items-center justify-center p-4 mb-10 min-h-screen bg-white">
        <Card className="p-0 overflow-hidden shadow-xl max-w-md w-full border border-gray-100 bg-white">
          <div className="bg-[#D73D32] px-6 py-5 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Secure Payment
              </h2>
              <p className="text-white/80 text-sm mt-1">Scan to pay with UPI</p>
            </div>
          </div>
          <div className="p-6">
            {qrLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-gray-200 border-t-[#D73D32] rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">Generating QR Code</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
                </div>
              </div>
            ) : (
              <>
                {qrData && (
                  <div className="flex flex-col items-center mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                      <img
                        src={qrData}
                        alt="UPI QR Code"
                        className="w-56 h-56 mx-auto"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mt-3">
                      Amount: ₹{total.toLocaleString()}
                    </p>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center mb-4">
                    Supported Apps
                  </p>
                  <div className="flex justify-center items-center gap-6">
                    {paymentApps.map((app) => (
                      <div key={app.name} className="text-center group cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl ${app.bgColor} shadow-sm border border-gray-100 flex items-center justify-center mx-auto group-hover:shadow-md transition-shadow duration-200`}>
                          <img
                            src={app.icon}
                            alt={app.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-medium">{app.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowQR(false)}
                    className="w-full rounded-xl bg-[#D73D32] px-6 py-3 text-white font-medium transition-all duration-200 hover:bg-[#D73D32]/90"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-6">
                  After scanning, please confirm payment to complete your order
                </p>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Success State
  if (showSuccess) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16 bg-white min-h-screen">
        <Card className="bg-white p-12 text-center shadow-lg border border-gray-100 max-w-2xl mx-auto rounded-2xl">
          <div className="w-20 h-20 bg-[#D73D32]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CircleCheckBig className="w-12 h-12 text-[#D73D32]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed Successfully
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order ID:{" "}
            <span className="font-semibold text-[#D73D32]">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white px-6 py-2.5 rounded-lg"
              onClick={() => navigate(`/viewOrder/${orderId}`)}
            >
              Track Order
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </Card>
        <Toaster />
      </div>
    );
  }

  // Main Checkout Form
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <button
            onClick={() => navigate("/address")}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <h1 className="text-2xl font-medium text-gray-900 tracking-wide">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-medium text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/address")}
                  className="text-xs text-[#D73D32] font-medium hover:text-[#D73D32]/80 transition-colors flex items-center gap-1"
                >
                  Change <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              {selectedAddress ? (
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#D73D32] flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-medium text-gray-900 text-sm">
                        {selectedAddress.first_name} {selectedAddress.last_name}
                      </p>
                      {selectedAddress.address_type && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium capitalize bg-white border border-gray-200 text-gray-600">
                          {addressTypeIcon(selectedAddress.address_type)}
                          {selectedAddress.address_type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {selectedAddress.address}
                      {selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postal_code}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {selectedAddress.phone} · {selectedAddress.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No address selected.</p>
              )}
            </Card>

            {/* Delivery Options */}
            {deliveryOptions.length > 0 && (
              <Card className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-5">
                  <Truck className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-medium text-gray-900">
                    Delivery Options
                  </h2>
                  {isHyperlocal && hyperlocalCheck && (
                    <span className="ml-2 text-xs bg-[#D73D32]/10 text-[#D73D32] px-2 py-0.5 rounded-full font-medium">
                      {hyperlocalCheck.distance_km} km away
                    </span>
                  )}
                </div>

                {hyperlocalDeliveryOptions.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Express & Hyperlocal
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {hyperlocalDeliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedDeliveryOption?.id === option.id
                              ? "border-[#D73D32] bg-[#D73D32]/5"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryOption"
                            checked={selectedDeliveryOption?.id === option.id}
                            onChange={() => handleDeliveryOptionChange(option)}
                            className="mt-1 w-4 h-4 text-[#D73D32] focus:ring-[#D73D32]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {option.type === "express" ? (
                                  <Zap className="w-5 h-5 text-amber-600" />
                                ) : (
                                  <Clock className="w-5 h-5 text-gray-500" />
                                )}
                                <p className="font-medium text-gray-900 text-sm">
                                  {option.name}
                                </p>
                                {option.type === "express" && (
                                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                    Express
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-gray-900">
                                ₹{option.cost.toLocaleString()}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">
                                {option.description}
                              </p>
                              {option.distance_km && (
                                <p className="text-xs text-gray-400">
                                  Distance: {option.distance_km} km
                                </p>
                              )}
                              {option.etd && (
                                <p className="text-xs text-gray-400">
                                  Expected delivery: {option.etd}
                                </p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {standardDeliveryOptions.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Standard Delivery
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {standardDeliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedDeliveryOption?.id === option.id
                              ? "border-[#D73D32] bg-[#D73D32]/5"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryOption"
                            checked={selectedDeliveryOption?.id === option.id}
                            onChange={() => handleDeliveryOptionChange(option)}
                            className="mt-1 w-4 h-4 text-[#D73D32] focus:ring-[#D73D32]"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {option.name}
                              </p>
                              <p className="font-semibold text-gray-900">
                                ₹{option.cost.toLocaleString()}
                              </p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {option.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {isFetchingDeliveryCharge && (
                  <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-4 h-4 border border-gray-300 border-t-[#D73D32] rounded-full animate-spin" />
                    Updating delivery options...
                  </div>
                )}
              </Card>
            )}

            {/* Payment Method */}
            <Card className="bg-white p-6 shadow-sm border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-5">
                <Wallet className="w-5 h-5 text-[#D73D32]" />
                <h2 className="text-base font-medium text-gray-900">
                  Payment Method
                </h2>
              </div>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-3"
              >
                {[
                  {
                    value: "upi",
                    label: "UPI (PREPAID)",
                    icon: <Smartphone className="w-5 h-5 text-[#D73D32]" />,
                    desc: "Pay instantly via UPI apps like Google Pay, PhonePe, Paytm",
                  },
                  {
                    value: "cod",
                    label: "Cash on Delivery (COD)",
                    icon: <IndianRupee className="w-5 h-5 text-[#D73D32]" />,
                    desc: "Pay with cash when your order is delivered",
                  },
                ].map((method) => (
                  <label
                    key={method.value}
                    htmlFor={method.value}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? "border-[#D73D32] bg-[#D73D32]/5"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-400">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white p-6 shadow-lg border border-gray-100 rounded-xl sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-100">
                <Package className="w-5 h-5 text-[#D73D32]" />
                <h2 className="text-base font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {item.files?.length ? (
                        item.files.map((file) => (
                          <div key={file.id} className="flex gap-2">
                            {file.front_side_url && (
                              <img
                                src={file.front_side_url}
                                alt={file.front_original_name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                              />
                            )}
                            {file.back_side_url && (
                              <img
                                src={file.back_side_url}
                                alt={file.back_original_name}
                                className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                          />
                        )
                      )}
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                        {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {Object.entries(item.selected_options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="font-medium text-gray-900 text-sm">
                        ₹{item.total_price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="font-medium text-gray-900">
                    ₹{gst.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Charge</span>
                  <span className="font-medium text-gray-900">
                    {isFetchingDeliveryCharge ? (
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 border border-gray-300 border-t-[#D73D32] rounded-full animate-spin" />
                      </span>
                    ) : (
                      `₹${deliveryCharge.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-medium text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-semibold text-[#D73D32]">
                      {isFetchingDeliveryCharge ? (
                        <span className="flex items-center gap-1">
                          <span className="w-4 h-4 border border-gray-300 border-t-[#D73D32] rounded-full animate-spin" />
                        </span>
                      ) : (
                        `₹${total.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-[#D73D32] hover:bg-[#D73D32]/90 text-white py-3 text-base font-medium rounded-lg transition-colors"
                  onClick={() => {
                    if (paymentMethod === "upi") {
                      generateQR();
                    } else {
                      handlePlaceOrder();
                    }
                  }}
                  disabled={placingOrder || !selectedAddressId || isFetchingDeliveryCharge || !selectedDeliveryOption}
                >
                  {placingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </Button>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400">Secure checkout</p>
              </div>
            </Card>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
}