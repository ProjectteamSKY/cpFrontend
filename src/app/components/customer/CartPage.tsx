import { useState, useEffect, Key } from "react";
import { useLocation, Link } from "react-router";
import axios from "axios";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

export function CartPage() {
  const location = useLocation();
  const newItem = location.state as any;
  const userId = localStorage.getItem("user_id");

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH CART ITEMS + PRODUCT DETAILS
  // ===============================
  // ===============================
  // FETCH CART ITEMS + PRODUCT DETAILS
  // ===============================
  const fetchCartItems = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${API_BASE}/cartitems/cart-items/user/${userId}`,
        { withCredentials: true }
      );

      // Use res.data directly because your API returns an array
      const items = res.data;

      // Enrich each item with product + variant details
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
      setCartItems([]); // clear cart if fetch fails
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ADD ITEM
  // ===============================
  const addToCart = async () => {
    if (!newItem?.variant || !userId) return;

    try {
      await axios.post(
        `${API_BASE}/cartitems/cart-items/`,
        {
          user_id: userId,
          product_id: newItem.product.id,
          variant_id: newItem.variant.id,
          quantity: newItem.quantityId,
        },
        { withCredentials: true }
      );

      fetchCartItems();
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  // ===============================
  // DELETE ITEM
  // ===============================
  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/cartitems/cart-items/${id}`, {
        withCredentials: true,
      });
      fetchCartItems();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (newItem?.variant) {
      addToCart();
    }
  }, [newItem]);

  // ===============================
  // CALCULATIONS
  // ===============================
  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );
  const gst = subtotal * 0.18;
  const deliveryCharge = subtotal > 5000 ? 0 : 100;
  const total = subtotal + gst + deliveryCharge;

  if (loading) return <div className="p-10">Loading cart...</div>;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold mb-2">
            Your cart is empty
          </h2>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex gap-6">
                  {/* FILE IMAGES */}
                  <div className="flex flex-col gap-2">
                    {item.files?.length ? (
                      <div className="flex gap-2 overflow-x-auto">
                        {item.files.map((file: { id: Key | null | undefined; front_side_url: string; front_original_name: string | undefined; back_side_url: string; back_original_name: string | undefined; }) => (
                          <div key={file.id} className="flex gap-2">
                            {file.front_side_url && (
                              <img
                                src={MEDIA_BASE + file.front_side_url}
                                alt={file.front_original_name}
                                className="w-32 h-32 object-cover rounded"
                              />
                            )}
                            {file.back_side_url && (
                              <img
                                src={MEDIA_BASE + file.back_side_url}
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
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{item.product_name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size_name}</p>
                    <p className="text-sm text-gray-600">Paper: {item.paper_type_name}</p>
                    <p className="text-sm text-gray-600">Print: {item.print_type_name}</p>
                    <p className="text-sm text-gray-600">Cut: {item.cut_type_name}</p>
                    <p className="text-sm text-gray-600">Orientation: {item.orientation}</p>

                    <p className="mt-2">Quantity: {item.quantity}</p>
                    <p>Unit Price: ₹{item.unit_price}</p>

                    <div className="mt-3 font-bold text-red-600 text-lg">
                      ₹{Number(item.total_price).toLocaleString()}
                    </div>
                  </div>

                  <Button variant="ghost" onClick={() => deleteItem(item.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{deliveryCharge}</span>
                </div>

                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <Link to="/checkout">
                <Button className="w-full mt-6">
                  Proceed to Payment
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}