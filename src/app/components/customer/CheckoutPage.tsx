import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Building2, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

const API_BASE = "http://54.206.3.97/api";
const MEDIA_BASE = "http://54.206.3.97/";

export function CheckoutPage() {
  const navigate = useNavigate();
  const userId =
    sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "India",
    postal_code: "",
    phone: "",
  });

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // ================= FETCH CART =================
  const fetchCartItems = async () => {
    if (!userId) {
      toast.success("Please login to continue checkout");
      setLoadingCart(false);
      return;
    }

    try {
      toast.success("Loading cart items...");
      const res = await axios.get(
        `${API_BASE}/cartitems/cart-items/user/${userId}`,
        { withCredentials: true }
      );

      const rawItems = res.data.data || [];

      if (!rawItems.length) {
        toast.success("Your cart is empty");
        setCartItems([]);
        setLoadingCart(false);
        return;
      }

      const enrichedItems = await Promise.all(
        rawItems.map(async (item: any) => {
          try {
            const [productRes, variantRes, weightRes] = await Promise.all([
              axios.get(`${API_BASE}/product/${item.product_id}`),
              axios.get(`${API_BASE}/product_variant/${item.variant_id}`),
              axios.get(
                `${API_BASE}/product_variant_price/variant/${item.variant_id}/price-weight/${item.product_variant_price_id}`
              ),
            ]);

            const product = productRes.data.data || productRes.data;
            const variant = variantRes.data.data || variantRes.data;
            const weightData = weightRes.data.data || weightRes.data;

            let productImage = null;

            if (product.images) {
              const images = Array.isArray(product.images)
                ? product.images
                : JSON.parse(product.images || "[]");

              const defaultImg = images.find((img: any) => img.is_default);

              if (defaultImg) {
                productImage =
                  MEDIA_BASE + defaultImg.url.replace(/^\/?/, "");
              }
            }

            const files = (item.files || []).map((f: any) => ({
              ...f,
              front_side_url: f.front_side_url
                ? MEDIA_BASE + f.front_side_url.replace(/^\/?/, "")
                : null,
              back_side_url: f.back_side_url
                ? MEDIA_BASE + f.back_side_url.replace(/^\/?/, "")
                : null,
            }));

            return {
              ...item,
              product_name: product.name || "Unknown Product",
              product_image: productImage,
              size_name: variant.size_name,
              paper_type_name: variant.paper_type_name,
              print_type_name: variant.print_type_name,
              cut_type_name: variant.cut_type_name,
              orientation: variant.orientation,
              selected_options: item.selected_options
                ? JSON.parse(item.selected_options)
                : {},
              files,
              weight_grams: Number(weightData.total_weight_grams),
            };
          } catch (err) {
            console.error("Failed to enrich item", err);
            return { ...item, weight_grams: 0 };
          }
        })
      );

      setCartItems(enrichedItems);

      // ✅ Call shipping API once
      fetchDeliveryCharge(enrichedItems);
      toast.success("Cart loaded successfully!");
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

  // ================= DELIVERY API =================
  const fetchDeliveryCharge = async (items: any[]) => {
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

      const res = await axios.get(`${API_BASE}/shipping/serviceavailability`, {
        params: {
          pickup_postcode: "600001",
          delivery_postcode: "624601",
          weight: weightKg,
          cod: 0,
          declared_value: declaredValue,
        },
      });

      console.log("Delivery API Response:", res.data);

      const courier = res.data.best_courier;

      if (courier) {
        const charge = Number(courier.total_cost || courier.rate || 0);
        setDeliveryCharge(charge);
      } else {
        setDeliveryCharge(0);
      }
    } catch (err) {
      console.error("Delivery charge fetch failed", err);
      toast.error("Using default delivery charge");
      setDeliveryCharge(0);
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst + deliveryCharge;

  // ================= PLACE ORDER =================
  const handlePlaceOrder = async () => {
    if (!userId) {
      toast.warning("User not logged in! Please login again.");
      return;
    }

    if (!cartItems.length) {
      toast("Cart is empty!");
      return;
    }

    setPlacingOrder(true);
    toast.success("Placing your order...");

    try {
      // 1️⃣ Save Address
      const addressRes = await axios.post(
        `${API_BASE}/user_addresses/create`,
        {
          user_id: userId,
          address: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          postal_code: address.postal_code,
          phone: address.phone,
        },
        { withCredentials: true }
      );

      const addressId = addressRes.data.id;

      // 2️⃣ Prepare cart_items payload
      const cartItemsPayload = cartItems.map((item) => ({
        cart_item_id: item.id,
        product_variant_price_id: item.product_variant_price_id,
        customize_qty: item.customize_qty || 0,
      }));

      // 3️⃣ Checkout API
      const checkoutRes = await axios.post(
        `${API_BASE}/orders_routes/checkout`,
        {
          user_id: userId,
          cart_id: cartItems[0].cart_id,
          address_id: addressId,
          cart_items: cartItemsPayload,
          payment_method: paymentMethod,
        },
        { withCredentials: true }
      );

      const newOrderId = checkoutRes.data.order_id;

      setOrderId(newOrderId);
      setShowSuccess(true);
      toast.success(`Order placed successfully! Order ID: ${newOrderId}`);
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

  if (loadingCart) return <div className="p-10">Loading cart...</div>;

  if (showSuccess)
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <Card className="bg-white p-12 text-center shadow-lg border-0 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order ID: <span className="font-semibold text-[#D73D32]">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">You will receive a confirmation email shortly. Redirecting to order tracking...</p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white" onClick={() => navigate(`/order-tracking/${orderId}`)}>
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

  // ====== RENDER CHECKOUT FORM ======
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing & Payment */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Billing Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="Enter street address"
                  className="bg-white border-gray-200 mt-1"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" placeholder="Enter city" className="bg-white border-gray-200 mt-1" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input id="state" placeholder="Enter state" className="bg-white border-gray-200 mt-1" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="postal_code">Pincode *</Label>
                <Input id="postal_code" placeholder="000000" className="bg-white border-gray-200 mt-1" value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="+91 1234567890" className="bg-white border-gray-200 mt-1" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                {[
                  { id: "upi", label: "UPI Payment", icon: <Smartphone className="w-5 h-5 text-[#D73D32]" /> },
                  { id: "netbanking", label: "Net Banking", icon: <Building2 className="w-5 h-5 text-[#D73D32]" /> },
                  { id: "card", label: "Card", icon: <CreditCard className="w-5 h-5 text-[#D73D32]" /> },
                ].map((method) => (
                  <div key={method.id} className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mt-1" />
                      <label htmlFor={`payment-${method.id}`} className="font-medium cursor-pointer flex items-center gap-2">
                        {method.icon} {method.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6 shadow-md border-0 sticky top-24">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col gap-2">
                  {/* FILE IMAGES */}
                  <div className="flex flex-col gap-2">
                    {item.files?.length ? (
                      <div className="flex gap-2 overflow-x-auto">
                        {item.files.map((file: any) => (
                          <div key={file.id} className="flex gap-2">
                            {file.front_side_url && (
                              <img
                                src={file.front_side_url}
                                alt={file.front_original_name}
                                className="w-32 h-32 object-cover rounded"
                              />
                            )}
                            {file.back_side_url && (
                              <img
                                src={file.back_side_url}
                                alt={file.back_original_name}
                                className="w-32 h-32 object-cover rounded"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      item.product_image && (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-32 h-32 object-cover rounded"
                        />
                      )
                    )}
                  </div>

                  {/* DETAILS */}
                  <div className="flex items-center justify-between mt-1">
                    <div>
                      <p className="font-medium text-[#1A1A1A] text-sm">{item.product_name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      {item.selected_options && (
                        <p className="text-xs text-gray-500">
                          {Object.entries(item.selected_options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold text-[#1A1A1A]">₹{item.total_price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>GST (18%)</span>
                <span className="font-medium">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Delivery Charge</span>
                <span className="font-medium">₹{deliveryCharge}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-[#1A1A1A]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#D73D32]">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white py-6 text-lg mb-3"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </Button>
              <Button variant="outline" className="w-full border-gray-200" onClick={() => navigate("/cart")}>
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
