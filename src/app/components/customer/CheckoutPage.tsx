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
  ShoppingBag,
  Percent,
  Ticket,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
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

const API_BASE = "https://api.citizenprintz.in/api";
const MEDIA_BASE = "https://api.citizenprintz.in/";

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
  const [txnId, setTxnId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    address: true,
    delivery: true,
    payment: true,
    orderSummary: true,
  });
  const [showHelpTip, setShowHelpTip] = useState(false);

  // Refs to prevent duplicate API calls
  const hasFetchedCart = useRef(false);
  const hasFetchedDelivery = useRef(false);
  const isFetchingRef = useRef(false);
  const eventSourceRef = useRef(null);
  const isOrderPlacedRef = useRef(false);

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

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
      return;
    }

    try {
      const deliveryPostcode = selectedAddress.postal_code;
      const res = await axios.get(`${API_BASE}/shipping/hyperlocal/check`, {
        params: { pincode: deliveryPostcode }
      });

      setHyperlocalCheck(res.data);

      if (res.data.is_chennai_surrounding) {
        setIsHyperlocal(true);
        await fetchBothDeliveryOptions();
      } else {
        setIsHyperlocal(false);
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

    try {
      if (cartItems.length === 0) {
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
      const codValue = paymentMethod === "cod" ? 1 : 0;

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

      let options = [];

      if (res.data.couriers && res.data.couriers.length > 0) {
        options = res.data.couriers.map((courier, index) => ({
          id: `standard_${index}`,
          name: courier.courier_name || `Standard Courier ${index + 1}`,
          type: "normal",
          delivery_type: "normal",
          cost: Number(courier.total_cost || courier.rate || 0),
          estimated_days: courier.estimated_delivery_days || 5,
          estimated_hours: (courier.estimated_delivery_days || 5) * 24,
          is_hyperlocal: false,
          description: `Standard delivery in ${courier.estimated_delivery_days || 5} days`,
          courier_id: courier.courier_company_id || null,
        }));
      } else if (res.data.best_courier) {
        options = [{
          id: "standard_0",
          name: res.data.best_courier.courier_name || "Standard Delivery",
          type: "normal",
          delivery_type: "normal",
          cost: Number(res.data.best_courier.total_cost || res.data.best_courier.rate || 0),
          estimated_days: res.data.best_courier.estimated_delivery_days || 5,
          estimated_hours: (res.data.best_courier.estimated_delivery_days || 5) * 24,
          is_hyperlocal: false,
          description: `Standard delivery in ${res.data.best_courier.estimated_delivery_days || 5} days`,
          courier_id: res.data.best_courier.courier_company_id || null,
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

    try {
      const pickupPostcode = "600100";
      const deliveryPostcode = selectedAddress.postal_code;
      const codValue = paymentMethod === "cod" ? 1 : 0;

      const res = await axios.get(`${API_BASE}/shipping/hyperlocal/serviceability`, {
        params: {
          pickup_postcode: pickupPostcode,
          delivery_postcode: deliveryPostcode,
          cod: codValue,
        },
      });

      let options = [];

      if (res.data.all_couriers && res.data.all_couriers.length > 0) {
        options = res.data.all_couriers.map((courier, index) => {
          const isExpress = courier.courier_name.includes("Quick") ||
            courier.estimated_delivery_time_hours <= 24;

          return {
            id: `hyperlocal_${index}`,
            name: courier.courier_name,
            type: "hyperlocal",
            delivery_type: "hyperlocal",
            cost: Number(courier.total_cost || 0),
            estimated_hours: courier.estimated_delivery_time_hours,
            estimated_days: Math.ceil(courier.estimated_delivery_time_hours / 24),
            distance_km: courier.distance_km,
            etd: courier.etd,
            is_hyperlocal: true,
            description: isExpress ?
              `🚀 Express delivery in ${courier.estimated_delivery_time_hours} hours` :
              `🏠 Hyperlocal delivery • ${courier.distance_km} km away`,
            courier_id: courier.courier_id || courier.courier_company_id || null,
          };
        });
      } else if (res.data.best_courier) {
        const bestCourier = res.data.best_courier;
        const isExpress = bestCourier.courier_name.includes("Quick") ||
          bestCourier.estimated_delivery_time_hours <= 24;

        options = [{
          id: "hyperlocal_0",
          name: bestCourier.courier_name,
          type: "hyperlocal",
          delivery_type: "hyperlocal",
          cost: Number(bestCourier.total_cost || 0),
          estimated_hours: bestCourier.estimated_delivery_time_hours,
          estimated_days: Math.ceil(bestCourier.estimated_delivery_time_hours / 24),
          distance_km: bestCourier.distance_km,
          etd: bestCourier.etd,
          is_hyperlocal: true,
          description: isExpress ?
            `🚀 Express delivery in ${bestCourier.estimated_delivery_time_hours} hours` :
            `🏠 Hyperlocal delivery • ${bestCourier.distance_km} km away`,
          courier_id: bestCourier.courier_id || bestCourier.courier_company_id || null,
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
  // const total = Math.round(roundedSubtotal + gst + roundedDelivery);
  const total = Math.round(roundedSubtotal + gst);


  // ================= PLACE ORDER =================
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

    if (placingOrder) return;

    setPlacingOrder(true);

    try {
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
        height: item.height || 0,
      }));

      const apiPaymentMethod = paymentMethod === "cod" ? "COD" : "PREPAID";

      const apiDeliveryType =
        selectedDeliveryOption.delivery_type === "hyperlocal"
          ? "hyperlocal"
          : "normal";

      const checkoutPayload = {
        user_id: userId,
        cart_id: cartItems[0].cart_id,
        cart_items: cartItemsPayload,
        address_id: selectedAddressId,
        payment_method: apiPaymentMethod,
        delivery_type: apiDeliveryType,
        courier_id: selectedDeliveryOption.courier_id
          ? String(selectedDeliveryOption.courier_id)
          : null,
        courier_name: selectedDeliveryOption.name || null,
        delivery_charge: roundedDelivery,
      };

      const checkoutRes = await axios.post(
        `${API_BASE}/orders_routes/checkout`,
        checkoutPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newOrderId =
        checkoutRes.data.order_id || checkoutRes.data.data?.order_id;

      if (!newOrderId) {
        throw new Error("Order ID not received from server");
      }

      setOrderId(newOrderId);

      sessionStorage.removeItem("selected_address_id");
      sessionStorage.removeItem("selected_address");
      localStorage.removeItem("cart");

      setShowSuccess(false);

      setTimeout(() => {
        setShowSuccess(true);
      }, 100);

      toast.success(`Order placed successfully! Order ID: ${newOrderId}`);

      // setTimeout(() => {
      //   navigate(`/viewOrder/${newOrderId}`);
      // }, 1500);

    } catch (err) {
      console.error("Checkout failed:", err);
      const errorMessage =
        err?.response?.data?.detail ||
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
      isOrderPlacedRef.current = false;

      const res = await axios.post(
        `${API_BASE}/bank/qr-generate`,
        {},
        {
          params: { amount: total.toFixed(2) },
        }
      );

      const { transaction_id, qr_image } = res.data;
      const imageUrl = `data:image/png;base64,${qr_image}`;

      setQrData(imageUrl);
      setTxnId(transaction_id);
      setShowQR(true);

      setTimeout(() => {
        startPaymentStream(transaction_id);
      }, 200);

    } catch (err) {
      console.error("QR generation failed", err);
      toast.error("Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };

  const startPaymentStream = (transactionId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `${API_BASE}/transactions/${transactionId}/stream`
    );

    eventSourceRef.current = eventSource;

    const timeout = setTimeout(() => {
      if (eventSourceRef.current) {
        eventSource.close();
        eventSourceRef.current = null;
        toast.error("Payment timeout ⏳");
      }
    }, 120000);

    eventSource.addEventListener("status", (event) => {
      console.log("Live status:", event.data);
    });

    eventSource.addEventListener("completed", async (event) => {
      clearTimeout(timeout);

      const status = event.data;

      if (status === "SUCCESS" && !isOrderPlacedRef.current) {
        isOrderPlacedRef.current = true;
        toast.success("Payment Successful ");
        eventSource.close();
        eventSourceRef.current = null;
        setShowQR(false);

        setTimeout(async () => {
          await handlePlaceOrder();
        }, 1000);

      } else if (status !== "SUCCESS") {
        toast.error("Payment Failed ❌");
        eventSource.close();
        eventSourceRef.current = null;
      }
    });

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      clearTimeout(timeout);
      eventSource.close();
      eventSourceRef.current = null;
    };
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (showSuccess && eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, [showSuccess]);

  const addressTypeIcon = (type) => {
    if (type === "work") return <Briefcase className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  // Loading State
  if (loadingCart) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-100" />
            <div className="absolute inset-0 rounded-full border-4 border-[#D73D32] border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // QR Payment State
  if (showQR) {
    const paymentApps = [
      { name: "Google Pay", icon: gpay, bgColor: "bg-white" },
      { name: "PhonePe", icon: phonepe, bgColor: "bg-white" },
      { name: "Paytm", icon: paytm, bgColor: "bg-white" }
    ];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <Card className="p-0 overflow-hidden shadow-2xl max-w-md w-full border-0 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-gradient-to-r from-[#D73D32] to-[#e8554a] px-6 py-5 text-center relative">
            <button
              onClick={() => {
                setShowQR(false);
                if (eventSourceRef.current) {
                  eventSourceRef.current.close();
                  eventSourceRef.current = null;
                }
              }}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Secure Payment
              </h2>
              <p className="text-white/80 text-sm mt-1">Scan QR code to pay</p>
            </div>
          </div>
          <div className="p-6 bg-white">
            {qrLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-[#D73D32] rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">Generating QR Code</p>
                  <p className="text-sm text-gray-400 mt-1">Please wait...</p>
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
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-500">Amount to pay</p>
                      <p className="text-2xl font-bold text-[#D73D32]">₹{total.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center mb-4">
                    Scan with any UPI app
                  </p>
                  <div className="flex justify-center items-center gap-8">
                    {paymentApps.map((app) => (
                      <div key={app.name} className="text-center group cursor-pointer">
                        <div className={`w-14 h-14 rounded-xl ${app.bgColor} shadow-md border border-gray-100 flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                          <img
                            src={app.icon}
                            alt={app.name}
                            className="w-8 h-8 object-contain"
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
                <button
                  onClick={() => {
                    setShowQR(false);
                    if (eventSourceRef.current) {
                      eventSourceRef.current.close();
                      eventSourceRef.current = null;
                    }
                  }}
                  className="w-full rounded-xl border-2 border-gray-200 px-6 py-3 text-gray-600 font-medium transition-all duration-200 hover:bg-gray-50"
                >
                  Cancel Payment
                </button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  After scanning, confirm payment to complete your order
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
      <div className="h-full w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D73D32]/5 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
        </div>

        <Card className="relative bg-white/80 backdrop-blur-sm p-10 text-center shadow-2xl border border-white/50 max-w-md w-full rounded-3xl animate-in zoom-in-95 duration-500 overflow-hidden">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-[#D73D32] to-green-400" />

          {/* Confetti/Sparkle effect (optional - you can add react-confetti or similar) */}
          <div className="absolute top-20 right-6 opacity-30 animate-pulse">
            <div className="text-yellow-400 text-xl">✦</div>
          </div>
          <div className="absolute bottom-20 left-6 opacity-30 animate-pulse delay-700">
            <div className="text-yellow-400 text-xl">✦</div>
          </div>

          {/* Animated success icon */}
          <div className="relative mb-8">
            <div className="absolute inset-0 w-24 h-24 mx-auto">
              <div className="w-full h-full bg-green-100 rounded-full animate-ping opacity-75" />
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CircleCheckBig className="w-12 h-12 text-green-600 animate-bounce" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 mb-2 font-medium tracking-wide">
            Your order has been confirmed
          </p>

          {/* Premium order ID card */}
          <div className="my-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200/60 shadow-inner">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
              Order ID
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-[#D73D32] to-[#e85d53] bg-clip-text text-transparent">
              #{orderId}
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            A confirmation email has been sent to your registered email address
          </p>

          {/* Premium buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-gradient-to-r from-[#D73D32] to-[#e85d53] hover:from-[#c0342a] hover:to-[#d73d32] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={() => navigate(`/viewOrder/${orderId}`)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Track Order
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-gray-200 text-gray-700 hover:border-[#D73D32]/30 hover:bg-gradient-to-r hover:from-[#D73D32]/5 hover:to-transparent rounded-xl font-semibold py-3 transition-all duration-200 hover:shadow-md"
              onClick={() => navigate("/products")}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </Button>
          </div>

        </Card>
      </div>
    );
  }

  // Main Checkout Form
  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/address")}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <div className="h-5 w-px bg-gray-300" />
            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900">
              Checkout
            </h1>
          </div>
          <button
            onClick={() => setShowHelpTip(!showHelpTip)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Need help?</span>
          </button>
        </div>

        {showHelpTip && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Need assistance?</p>
                <p className="text-xs text-blue-600 mt-1">
                  Contact our support team at <strong>support@citizenprintz.in</strong> or call +91-XXXXXXXXXX
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address Section */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('address')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Delivery Address
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/address");
                    }}
                    className="text-xs text-[#D73D32] font-medium hover:text-[#D73D32]/80 transition-colors flex items-center gap-1"
                  >
                    Change <ChevronRight className="w-3 h-3" />
                  </button>
                  {expandedSections.address ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </button>
              {expandedSections.address && selectedAddress && (
                <div className="px-5 pb-5">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#D73D32] flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">
                          {selectedAddress.first_name} {selectedAddress.last_name}
                        </p>
                        {selectedAddress.address_type && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium capitalize bg-white border border-gray-200 text-gray-600">
                            {addressTypeIcon(selectedAddress.address_type)}
                            {selectedAddress.address_type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedAddress.address}
                        {selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.postal_code}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        📞 {selectedAddress.phone} · ✉️ {selectedAddress.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Delivery Options Section */}
            {deliveryOptions.length > 0 && (
              <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden transition-all hover:shadow-md">
                <button
                  onClick={() => toggleSection('delivery')}
                  className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#D73D32]" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Delivery Options
                    </h2>
                    {isHyperlocal && hyperlocalCheck && (
                      <span className="ml-2 text-xs bg-[#D73D32]/10 text-[#D73D32] px-2 py-0.5 rounded-full font-medium">
                        {hyperlocalCheck.distance_km} km away
                      </span>
                    )}
                  </div>
                  {expandedSections.delivery ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.delivery && (
                  <div className="px-5 pb-5 space-y-4">
                    {hyperlocalDeliveryOptions.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Express & Hyperlocal
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {hyperlocalDeliveryOptions.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedDeliveryOption?.id === option.id
                                ? "border-[#D73D32] bg-gradient-to-r from-[#D73D32]/5 to-transparent shadow-sm"
                                : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                              <input
                                type="radio"
                                name="deliveryOption"
                                checked={selectedDeliveryOption?.id === option.id}
                                onChange={() => handleDeliveryOptionChange(option)}
                                className="mt-1 w-4 h-4 text-[#D73D32] focus:ring-[#D73D32] focus:ring-offset-0"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                                  <div className="flex items-center gap-2">
                                    {option.type === "express" ? (
                                      <Zap className="w-5 h-5 text-amber-600" />
                                    ) : (
                                      <Clock className="w-5 h-5 text-gray-500" />
                                    )}
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {option.name}
                                    </p>
                                    {option.type === "express" && (
                                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                        Express
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-bold text-gray-900">
                                    ₹{option.cost.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                  {option.description}
                                </p>
                                {option.distance_km && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    📍 Distance: {option.distance_km} km
                                  </p>
                                )}
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
                          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Standard Delivery
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {standardDeliveryOptions.map((option) => (
                            <label
                              key={option.id}
                              className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedDeliveryOption?.id === option.id
                                ? "border-[#D73D32] bg-gradient-to-r from-[#D73D32]/5 to-transparent shadow-sm"
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
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {option.name}
                                  </p>
                                  <p className="font-bold text-gray-900">
                                    ₹{option.cost.toLocaleString()}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-500">
                                  {option.description}
                                </p>
                                {option.estimated_days && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    ⏱️ Estimated {option.estimated_days} business days
                                  </p>
                                )}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {isFetchingDeliveryCharge && (
                      <div className="text-sm text-gray-400 flex items-center gap-2 py-2">
                        <div className="w-4 h-4 border-2 border-gray-200 border-t-[#D73D32] rounded-full animate-spin" />
                        Updating delivery options...
                      </div>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Payment Method Section */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden transition-all hover:shadow-md">
              <button
                onClick={() => toggleSection('payment')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Payment Method
                  </h2>
                </div>
                {expandedSections.payment ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.payment && (
                <div className="px-5 pb-5">
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-3"
                  >
                    {[
                      {
                        value: "upi",
                        label: "UPI (Prepaid)",
                        icon: <Smartphone className="w-5 h-5 text-[#D73D32]" />,
                        desc: "Pay instantly via UPI apps like Google Pay, PhonePe, Paytm",
                        badge: "Instant",
                      },
                      {
                        value: "cod",
                        label: "Cash on Delivery",
                        icon: <IndianRupee className="w-5 h-5 text-[#D73D32]" />,
                        desc: "Pay with cash when your order is delivered",
                        badge: "COD",
                      },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${paymentMethod === method.value
                          ? "border-[#D73D32] bg-gradient-to-r from-[#D73D32]/5 to-transparent shadow-sm"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        <RadioGroupItem value={method.value} id={method.value} />
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-200">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {method.label}
                            </p>
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </Card>

            {/* Order Summary - Mobile View */}
            <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden lg:hidden">
              <button
                onClick={() => toggleSection('orderSummary')}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Order Summary
                  </h2>
                  <span className="text-sm font-bold text-[#D73D32]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                {expandedSections.orderSummary ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {expandedSections.orderSummary && (
                <div className="px-5 pb-5">
                  <MobileOrderSummary
                    cartItems={cartItems}
                    subtotal={roundedSubtotal}
                    gst={gst}
                    deliveryCharge={roundedDelivery}
                    total={total}
                  />
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Order Summary Desktop */}
          <div className="hidden lg:block">
            <Card className="bg-white shadow-lg border border-gray-100 rounded-xl sticky top-24">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#D73D32]" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Order Summary
                  </h2>
                </div>
              </div>
              <DesktopOrderSummary
                cartItems={cartItems}
                subtotal={roundedSubtotal}
                gst={gst}
                deliveryCharge={roundedDelivery}
                total={total}
                isFetchingDeliveryCharge={isFetchingDeliveryCharge}
              />
              <div className="p-5 border-t border-gray-100">
                <Button
                  className="w-full bg-gradient-to-r from-[#D73D32] to-[#e8554a] hover:from-[#D73D32]/90 hover:to-[#e8554a]/90 text-white py-3 text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
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
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${total.toLocaleString()}`
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 text-gray-500 hover:bg-gray-50 rounded-lg mt-3"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </Button>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-gray-500">Secure checkout • 100% protected</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Bar for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="text-xl font-bold text-[#D73D32]">
              ₹{total.toLocaleString()}
            </span>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-[#D73D32] to-[#e8554a] hover:from-[#D73D32]/90 hover:to-[#e8554a]/90 text-white py-3 text-base font-semibold rounded-lg"
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
                Processing...
              </span>
            ) : (
              `Place Order • ₹${total.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

// Mobile Order Summary Component
function MobileOrderSummary({ cartItems, subtotal, gst, deliveryCharge, total }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100">
            <div className="flex-shrink-0">
              {item.files?.length ? (
                <div className="flex gap-1">
                  {item.files.slice(0, 2).map((file) => (
                    <div key={file.id} className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={file.front_side_url || file.back_side_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                item.product_image && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm line-clamp-1">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium text-gray-900 text-sm">₹{item.total_price}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">GST (18%)</span>
          <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery</span>
          <span className="font-medium text-gray-900">₹{deliveryCharge.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-[#D73D32]">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Desktop Order Summary Component
function DesktopOrderSummary({ cartItems, subtotal, gst, deliveryCharge, total, isFetchingDeliveryCharge }) {
  return (
    <>
      <div className="p-5 space-y-3 max-h-[400px] overflow-y-auto border-b border-gray-100">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-0">
            <div className="flex-shrink-0">
              {item.files?.length ? (
                <div className="flex gap-1">
                  {item.files.slice(0, 2).map((file) => (
                    <div key={file.id} className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
                      <img
                        src={file.front_side_url || file.back_side_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                item.product_image && (
                  <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden">
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm line-clamp-2">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
              {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {Object.entries(item.selected_options)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </p>
              )}
            </div>
            <p className="font-semibold text-gray-900 text-sm">₹{item.total_price}</p>
          </div>
        ))}
      </div>
      <div className="p-5 space-y-2 border-b border-gray-100">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">GST (18%)</span>
          <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
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
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-[#D73D32]">
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
    </>
  );
}