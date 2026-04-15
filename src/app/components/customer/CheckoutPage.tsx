import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle,
  MapPin,
  Home,
  Briefcase,
  ArrowLeft,
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
  const [orderId, setOrderId] = useState<string | null>(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [qrData, setQrData] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  // ── Read selected address from sessionStorage (set by AddressPage) ──────────
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

  // ================= FETCH CART =================
  const fetchCartItems = async () => {
    if (!userId) {
      toast.error("Please login to continue checkout");
      setLoadingCart(false);
      return;
    }

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
        rawItems.map(async (item: any) => {
          try {
            // Fetch product details
            const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
            const product = productRes.data.data || productRes.data;

            // Parse selected_attributes from JSON string
            let parsedAttributes = {};
            if (item.selected_attributes) {
              try {
                const attrArray = JSON.parse(item.selected_attributes);
                console.log("Parsed attributes array:", attrArray);

                // Convert array to object with attribute_name as key and attribute_value_name as value
                if (Array.isArray(attrArray)) {
                  attrArray.forEach((attr: any) => {
                    parsedAttributes[attr.attribute_name] = attr.attribute_value_name;
                  });
                }
                console.log("Formatted attributes:", parsedAttributes);
              } catch (e) {
                console.error("Failed to parse selected_attributes", e);
              }
            }

            // Get product image
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
                const defaultImg = images.find((img: any) => img.is_default);
                const imgToUse = defaultImg || images[0];
                if (imgToUse && imgToUse.url) {
                  productImage = MEDIA_BASE + imgToUse.url.replace(/^\/?/, "");
                }
              }
            }

            // Process files - ensure URLs are complete
            const files = (item.files || []).map((f: any) => ({
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

            // Get weight using the new API endpoint
            let weightGrams = 0;
            try {
              const weightRes = await axios.post(
                `${API_BASE}/variant_attribute_value/total`,
                { variant_id: item.variant_id }
              );
              const weightData = weightRes.data.data || weightRes.data;
              weightGrams = Number(weightData.total_weight_grams) || 0;
            } catch (weightErr) {
              console.warn("Could not fetch weight for item:", item.id, weightErr);
              weightGrams = 100; // Default 100g per item
            }

            return {
              ...item,
              product_name: product.name || "Unknown Product",
              product_image: productImage,
              selected_options: parsedAttributes,
              files: files,
              weight_grams: weightGrams,
            };
          } catch (err) {
            console.error("Failed to enrich item", item.id, err);
            // Return basic item info without enrichment
            const files = (item.files || []).map((f: any) => ({
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

            return {
              ...item,
              product_name: "Product",
              product_image: null,
              selected_options: {},
              files: files,
              weight_grams: 100,
            };
          }
        })
      );

      console.log("Enriched cart items:", enrichedItems);
      setCartItems(enrichedItems);
      await fetchDeliveryCharge(enrichedItems);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
      toast.error("Failed to load cart items");
      setCartItems([]);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // ================= DELIVERY CHARGE =================
  const fetchDeliveryCharge = async (items: any[]) => {
    console.log("api calling for delivery charges ");
    try {
      const totalWeight = items.reduce(
        (sum, item) => sum + (item.weight_grams || 0),
        0
      );
      const weightKg = totalWeight / 1000;
      const declaredValue = items.reduce(
        (sum, i) => sum + Number(i.total_price),
        0
      );

      const deliveryPostcode =
        selectedAddress?.postal_code || "624601";
      console.log("deliveryPostcode", deliveryPostcode);
      const res = await axios.get(`${API_BASE}/shipping/serviceavailability`, {
        params: {
          pickup_postcode: "600001",
          delivery_postcode: deliveryPostcode,
          weight: weightKg,
          cod: 0,
          declared_value: declaredValue,
        },
      });

      const courier = res.data.best_courier;
      if (courier) {
        setDeliveryCharge(Number(courier.total_cost || courier.rate || 0));
      } else {
        setDeliveryCharge(0);
      }
    } catch (err) {
      console.error("Delivery charge fetch failed", err);
      setDeliveryCharge(0);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  const roundedSubtotal = Math.round(subtotal);
  const roundedDelivery = Math.round(deliveryCharge);
  const gst = Math.round(roundedSubtotal * 0.18);
  const total = Math.round(roundedSubtotal + gst + roundedDelivery);

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

    setPlacingOrder(true);

    try {
      // ✅ Use the already-saved address_id from AddressPage — no need to create a new address
      const cartItemsPayload = cartItems.map((item) => ({
        cart_item_id: item.id,
        product_variant_price_id: item.product_variant_price_id,
        customize_qty: item.customize_qty || 0,
      }));

      const checkoutRes = await axios.post(
        `${API_BASE}/orders_routes/checkout`,
        {
          user_id: userId,
          cart_id: cartItems[0].cart_id,
          address_id: selectedAddressId,   // ✅ pass selected address id directly
          cart_items: cartItemsPayload,
          payment_method: paymentMethod,
        },
        { withCredentials: true }
      );

      const newOrderId = checkoutRes.data.order_id;
      setOrderId(newOrderId);

      // Clean up sessionStorage after successful order
      sessionStorage.removeItem("selected_address_id");
      sessionStorage.removeItem("selected_address");

      setShowSuccess(true);
      toast.success(`Order placed! Order ID: ${newOrderId}`);
    } catch (err: any) {
      console.error("Checkout failed", err.response?.data || err.message);
      toast.error(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Checkout failed. Please try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // ================= ADDRESS TYPE ICON =================
  const addressTypeIcon = (type: string) => {
    if (type === "work") return <Briefcase className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  const generateQR = async () => {
    try {
      setQrLoading(true);

      const res = await axios.post(
        `${API_BASE}/bank/qr-generate`,
        {}, // empty body
        {
          params: { amount: total.toFixed(2) }, // ✅ amount as query param
          responseType: "blob", // ✅ treat response as binary image
        }
      );

      const imageUrl = URL.createObjectURL(res.data);
      setQrData(imageUrl);
      setShowQR(true);

    } catch (err: any) {
      console.error("QR generation failed", err);
      toast.error("Failed to generate QR");
    } finally {
      setQrLoading(false);
    }
  };
  // ================= LOADING =================
  if (loadingCart)
    return (
      <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#D73D32] border-t-transparent animate-spin" />
          <p className="text-sm font-medium text-gray-400 tracking-widest uppercase">
            Loading cart
          </p>
        </div>
      </div>
    );
  if (showQR) {
    // You can import actual icon files or use CDN URLs
    const paymentApps = [
      {
        name: "Google Pay",
        icon: gpay,
        bgColor: "bg-white"
      },
      {
        name: "PhonePe",
        icon: paytm,
        bgColor: "bg-white"
      },
      {
        name: "Paytm",
        icon: phonepe,
        bgColor: "bg-white"
      }
    ];

    return (
      <div className="flex items-center justify-center p-4 mb-10">
        <Card className="p-0 overflow-hidden shadow-2xl max-w-md w-full border-0 bg-white/80 backdrop-blur-sm">
          {/* Premium Header with Gradient */}
          <div className="bg-[#D73D32] px-6 py-4 text-center">
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                Secure Payment
              </h2>
              <p className="text-gray-300 text-sm mt-1">Scan to pay with UPI</p>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {qrLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-900 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 font-medium">Generating QR Code</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait a moment...</p>
                </div>
              </div>
            ) : (
              <>
                {/* QR Code Section */}
                {qrData && (
                  <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" />
                      <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                        <img
                          src={qrData}
                          alt="UPI QR Code"
                          className="w-56 h-56 mx-auto"
                        />
                      </div>
                    </div>

                  </div>
                )}

                {/* Payment Apps Section with Image Icons */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider text-center mb-4">
                    Supported Apps
                  </p>
                  <div className="flex justify-center items-center gap-6">
                    {paymentApps.map((app) => (
                      <div key={app.name} className="text-center group cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl ${app.bgColor} shadow-md flex items-center justify-center mx-auto group-hover:shadow-lg transition-shadow duration-200`}>
                          <img
                            src={app.icon}
                            alt={app.name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => {
                              // Fallback if icon fails to load
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                              <div class="w-7 h-7 rounded-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
                            `;
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-medium">{app.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* <button
                    onClick={handlePlaceOrder}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirm Payment
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                  </button> */}

                  <button
                    onClick={() => setShowQR(false)}
                    className="w-full rounded-xl border-2 border-gray-200 bg-[#D73D32] px-6 py-3 text-white font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>

                {/* Help Text */}
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
  // ================= SUCCESS =================
  if (showSuccess)
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <Card className="bg-white p-12 text-center shadow-lg border-0 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">
            Order Placed Successfully!
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
              className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
              onClick={() => navigate(`/viewOrder/${orderId}`)}
            >
              Track Order
            </Button>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
          </div>
        </Card>
        <Toaster />
      </div>
    );

  // ================= CHECKOUT FORM =================
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/address")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-4xl font-bold text-[#1A1A1A]">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Left: Address + Payment ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── Delivery Address (read-only, from AddressPage) ─────────────── */}
          <Card className="bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1A1A1A]">
                Delivery Address
              </h2>
              <button
                onClick={() => navigate("/address")}
                className="text-xs text-[#D73D32] font-semibold hover:underline"
              >
                Change
              </button>
            </div>

            {selectedAddress ? (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D73D32] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedAddress.first_name} {selectedAddress.last_name}
                    </p>
                    {selectedAddress.address_type && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold capitalize bg-red-100 text-[#D73D32]">
                        {addressTypeIcon(selectedAddress.address_type)}
                        {selectedAddress.address_type}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedAddress.address}
                    {selectedAddress.landmark
                      ? `, ${selectedAddress.landmark}`
                      : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedAddress.city}, {selectedAddress.state} —{" "}
                    {selectedAddress.postal_code}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {selectedAddress.phone} · {selectedAddress.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No address selected.</p>
            )}
          </Card>

          {/* ── Payment Method ──────────────────────────────────────────────── */}
          <Card className="bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-[#1A1A1A] mb-4">
              Payment Method
            </h2>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              {[
                {
                  value: "upi",
                  label: "UPI",
                  icon: <Smartphone className="w-5 h-5 text-[#D73D32]" />,
                  desc: "Pay via any UPI app",
                },
                {
                  value: "card",
                  label: "Credit / Debit Card",
                  icon: <CreditCard className="w-5 h-5 text-[#D73D32]" />,
                  desc: "Visa, Mastercard, RuPay",
                },
                {
                  value: "netbanking",
                  label: "Net Banking",
                  icon: <Building2 className="w-5 h-5 text-[#D73D32]" />,
                  desc: "All major banks supported",
                },
              ].map((method) => (
                <label
                  key={method.value}
                  htmlFor={method.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.value
                    ? "border-[#D73D32] bg-red-50"
                    : "border-gray-100 hover:border-gray-200"
                    }`}
                >
                  <RadioGroupItem value={method.value} id={method.value} />
                  <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm">
                    {method.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {method.label}
                    </p>
                    <p className="text-xs text-gray-400">{method.desc}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </Card>
        </div>

        {/* ── Right: Order Summary ────────────────────────────────────────── */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6 shadow-md border-0 sticky top-24">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  {/* File images */}
                  <div className="flex gap-2 overflow-x-auto">
                    {item.files?.length ? (
                      item.files.map((file: any) => (
                        <div key={file.id} className="flex gap-2">
                          {file.front_side_url && (
                            <img
                              src={file.front_side_url}
                              alt={file.front_original_name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          {file.back_side_url && (
                            <img
                              src={file.back_side_url}
                              alt={file.back_original_name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                        </div>
                      ))
                    ) : (
                      item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-[#1A1A1A] text-sm">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      {item.selected_options &&
                        Object.keys(item.selected_options).length > 0 && (
                          <p className="text-xs text-gray-400">
                            {Object.entries(item.selected_options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                          </p>
                        )}
                    </div>
                    <p className="font-semibold text-[#1A1A1A] text-sm">
                      ₹{item.total_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (18%)</span>
                <span className="font-medium text-gray-900">
                  ₹{gst.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery Charge</span>
                <span className="font-medium text-gray-900">
                  ₹{deliveryCharge.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-[#1A1A1A]">
                    Total
                  </span>
                  <span className="text-2xl font-black text-[#D73D32]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-6 text-base font-bold rounded-xl"
                onClick={() => {
                  if (paymentMethod === "upi") {
                    generateQR(); // 👈 show QR first
                  } else {
                    handlePlaceOrder();
                  }
                }}
                disabled={placingOrder || !selectedAddressId}
              >
                {placingOrder ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  "Place Order"
                )}
              </Button>
              <Button
                variant="outline"
                className="w-full border-gray-200 text-gray-600"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </Button>
            </div>
          </Card>
        </div>
      </div>
      <Toaster />


    </div>
  );
}

