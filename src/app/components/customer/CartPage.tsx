import { useState, useEffect, Key } from "react";
import { useLocation, Link } from "react-router";
import axios from "axios";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";

const API_BASE = "http://127.0.0.1:8000/api";
const MEDIA_BASE = "http://127.0.0.1:8000/";

export function CartPage() {
  const location = useLocation();
  const newItem = location.state as any;
  const userId = localStorage.getItem("user_id");

  // const { toast } = useToast();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH CART ITEMS + PRODUCT DETAILS
  // ===============================
  const fetchCartItems = async () => {
    if (!userId) {
      setLoading(false);
      toast(
        "Please login to view your cart",
      );
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/cartitems/cart-items/user/${userId}`,
        { withCredentials: true }
      );

      const items = res.data.data || [];

      const enrichedItems = await Promise.all(
        items.map(async (item: any) => {
          try {
            const productRes = await axios.get(
              `${API_BASE}/product/${item.product_id}`
            );
            const product = productRes.data.data || productRes.data;

            const variantRes = await axios.get(
              `${API_BASE}/product_variant/${item.variant_id}`
            );
            const variant = variantRes.data.data || variantRes.data;

            const images = Array.isArray(product.images)
              ? product.images
              : JSON.parse(product.images || "[]");
            const defaultImage =
              images.find((img: any) => img.is_default)?.url ||
              images[0]?.url;

            const selectedOptions = JSON.parse(
              item.selected_options || "{}"
            );

            return {
              ...item,
              product_name: product.name || "Unknown Product",
              product_image: defaultImage ? MEDIA_BASE + defaultImage : null,
              size_name: variant.size_name || selectedOptions.size || "N/A",
              paper_type_name:
                variant.paper_type_name || selectedOptions.material || "N/A",
              print_type_name:
                variant.print_type_name ||
                selectedOptions.lamination ||
                "N/A",
              cut_type_name: variant.cut_type_name || "N/A",
              orientation: variant.orientation || "N/A",
            };
          } catch (itemErr) {
            console.error(`Failed to enrich item ${item.id}:`, itemErr);
            const selectedOptions = JSON.parse(
              item.selected_options || "{}"
            );
            return {
              ...item,
              product_name: "Product Unavailable",
              product_image: null,
              size_name: selectedOptions.size || "N/A",
              paper_type_name: selectedOptions.material || "N/A",
              print_type_name: selectedOptions.lamination || "N/A",
              cut_type_name: "N/A",
              orientation: "N/A",
            };
          }
        })
      );

      const activeItems = enrichedItems.filter((item) => {
        if (!item.variant_id) return false;
        return true;
      });

      setCartItems(activeItems);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
      setCartItems([]);
      toast.error(
        " Failed to fetch cart items"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ADD ITEM
  // ===============================
  const addToCart = async () => {
    if (!userId) {
      toast.success(
        "Login Required",
      );
      return;
    }
    if (!newItem?.variant) return;

    try {
      await axios.post(
        `${API_BASE}/cartitems/cart-items/`,
        {
          user_id: userId,
          product_id: newItem.product.id,
          variant_id: newItem.variant.id,
          price_id: newItem.price.id,
          quantity: newItem.quantityId,
        },
        { withCredentials: true }
      );
      toast.success(
        "Cart updated successfully!",
      );
      fetchCartItems();
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error(
        "Add to cart failed!"

      );
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
      toast.success(
        "Item removed from cart"
      );
      fetchCartItems();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error(
        "Failed to remove item"
      );
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
    (sum, item) => sum + Number(item.total_price || 0),
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
                <div className="flex gap-6 items-start">
                  {/* FILE IMAGES */}
                  <div className="flex flex-col gap-2">
                    {item.files?.length ? (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {item.files.map(
                          (file: {
                            id: Key | null | undefined;
                            front_side_url: string;
                            front_original_name: string | undefined;
                            back_side_url: string;
                            back_original_name: string | undefined;
                          }) => (
                            <div key={file.id} className="flex gap-2">
                              {file.front_side_url && (
                                <img
                                  src={MEDIA_BASE + file.front_side_url}
                                  alt={file.front_original_name}
                                  className="w-32 h-32 object-cover rounded flex-shrink-0"
                                />
                              )}
                              {file.back_side_url && (
                                <img
                                  src={MEDIA_BASE + file.back_side_url}
                                  alt={file.back_original_name}
                                  className="w-32 h-32 object-cover rounded flex-shrink-0"
                                />
                              )}
                            </div>
                          )
                        )}
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
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold truncate">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Paper: {item.paper_type_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Print: {item.print_type_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Cut: {item.cut_type_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Orientation: {item.orientation}
                    </p>

                    <div className="mt-3 space-y-1">
                      <p className="text-sm">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Unit Price: ₹{Number(item.unit_price || 0).toLocaleString()}
                      </p>
                      <div className="font-bold text-red-600 text-lg">
                        ₹{Number(item.total_price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 -mt-2"
                    onClick={() => deleteItem(item.id as string)}
                  >
                    <Trash2 className="h-4 w-4" />
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
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}
