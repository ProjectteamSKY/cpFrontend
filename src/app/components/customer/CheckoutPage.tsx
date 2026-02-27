import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { CreditCard, Building2, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

export function CheckoutPage() {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("user_id") || localStorage.getItem("user_id");

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

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

  // ====== FETCH USER ACTIVE CART AND ITEMS ======
  const fetchCartItems = async () => {
    if (!userId) return;

    try {
      // 1️⃣ Fetch user's active cart
      const res = await axios.get(`${API_BASE}/cart/carts/user/${userId}`, { withCredentials: true });
      console.log("res@@@@@@@@@@@@@@@@@fetchCartItems", res);

      let cartId: string;
      if (Array.isArray(res.data)) {
        // old behavior if backend returns array
        if (res.data.length === 0) {
          setCartItems([]);
          return;
        }
        cartId = res.data[0].id;
      } else if (res.data && res.data.id) {
        // new behavior: single object
        cartId = res.data.id;
      } else {
        setCartItems([]);
        return;
      }

      // 2️⃣ Fetch items in the active cart
      const itemsRes = await axios.get(`${API_BASE}/cartitems/cart-items/${cartId}`, { withCredentials: true });
      const items = itemsRes.data.items;

      // 3️⃣ Enrich items with product and variant info
      const enrichedItems = await Promise.all(
        items.map(async (item: any) => {
          const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
          const variantRes = await axios.get(`${API_BASE}/product_variant/${item.variant_id}`);

          const product = productRes.data;
          const variant = variantRes.data;
          const images = JSON.parse(product.images || "[]");
          const defaultImage = images.find((img: any) => img.is_default);

          return {
            ...item,
            cart_id: cartId,
            product_name: product.name,
            product_image: defaultImage ? MEDIA_BASE + defaultImage.url : null,
            size_name: variant.size_name,
            paper_type_name: variant.paper_type_name,
            print_type_name: variant.print_type_name,
            cut_type_name: variant.cut_type_name,
            orientation: variant.orientation,
          };
        })
      );

      setCartItems(enrichedItems);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // ====== CALCULATIONS ======
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
  const gst = subtotal * 0.18;
  const deliveryCharge = subtotal > 5000 ? 0 : 100;
  const total = subtotal + gst + deliveryCharge;

  // ====== PLACE ORDER ======
  const handlePlaceOrder = async () => {
    console.log("api triggered @@@@@@@@@@@@@@@@@@@@@@@@@");
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    setPlacingOrder(true);

    try {
      // ✅ Dynamically fetch active cart if cartItems empty
      let activeCartId = cartItems[0]?.cart_id;
      let items = cartItems;

      if (!activeCartId || items.length === 0) {
        console.log("Fetching active cart dynamically...");
        const res = await axios.get(`${API_BASE}/cart/carts/user/${userId}`, { withCredentials: true });
        const carts = res.data;
        if (!Array.isArray(carts) || carts.length === 0) throw new Error("No active cart found");
        activeCartId = carts[0].id;

        const itemsRes = await axios.get(`${API_BASE}/cartitems/cart-items/${activeCartId}`, { withCredentials: true });
        items = itemsRes.data.items;

        // You might want to enrich items with product/variant info if needed
        // For minimal dynamic functionality, we can use as-is
      }

      if (items.length === 0) throw new Error("Cart is empty");

      // 1️⃣ Save user address
      const addressRes = await axios.post(`${API_BASE}/user_addresses/create`, {
        user_id: userId,
        address: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postal_code,
        phone: address.phone,
      }, { withCredentials: true });

      const addressId = addressRes.data.id;

      // 2️⃣ Create order
      const orderRes = await axios.post(`${API_BASE}/orders_routes/create`, {
        user_id: userId,
        cart_id: activeCartId,
        address_id: addressId,
        total_amount: total,
        status: "pending",
      }, { withCredentials: true });

      const newOrderId = orderRes.data.id;
      setOrderId(newOrderId);

      // 3️⃣ Create order items
      await Promise.all(
        items.map((item) =>
          axios.post(`${API_BASE}/order_items_routes/create`, {
            order_id: newOrderId,
            cart_item_id: item.id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.unit_price,
            total: item.total_price,
          }, { withCredentials: true })
        )
      );

      setShowSuccess(true);

      setTimeout(() => {
        navigate(`/order-tracking/${newOrderId}`);
      }, 2000);

    } catch (err: any) {
      console.error("Checkout failed", err.response?.data || err.message);
      alert("Failed to place order. Try again.");
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
      </div>
    );

  // ====== RENDER CHECKOUT FORM ======
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing */}
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

          {/* Payment */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="upi" id="payment-upi" className="mt-1" />
                    <div>
                      <label htmlFor="payment-upi" className="font-medium cursor-pointer flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-[#D73D32]" /> UPI Payment
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="netbanking" id="payment-netbanking" className="mt-1" />
                    <div>
                      <label htmlFor="payment-netbanking" className="font-medium cursor-pointer flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#D73D32]" /> Net Banking
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="card" id="payment-card" className="mt-1" />
                    <div>
                      <label htmlFor="payment-card" className="font-medium cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#D73D32]" /> Card
                      </label>
                    </div>
                  </div>
                </div>
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
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.product_image || ""} className="w-16 h-16 object-cover rounded flex-shrink-0" alt={item.product_name} />
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A] text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">₹{item.total_price}</p>
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
    </div>
  );
}