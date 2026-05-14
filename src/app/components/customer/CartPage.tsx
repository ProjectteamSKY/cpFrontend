import { useState, useEffect, Key } from "react";
import { useLocation, Link } from "react-router";
import axios from "axios";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
import { Toaster } from "../ui/toaster";
import { getUserId } from "../../utils/authStorage";

const API_BASE = "https://api.citizenprintz.in/api";
const MEDIA_BASE = "https://api.citizenprintz.in/";

interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  variant_price_id: string;
  design_request_id: string | null;
  customize_qty: number | null;
  quantity: number;
  unit_price: number;
  discount_id: string | null;
  total_price: number;
  design_price: number | null;
  selected_attributes: string;
  created_at: string;
  updated_at: string;
  status: string;
  custom_qty?: number;
  price?: number;
  weight?: number;
  length?: number;
  breadth?: number;
  height?: number;
  files: FileAttachment[];
}

interface FileAttachment {
  id: string;
  cart_item_id: string;
  front_side_url: string | null;
  back_side_url: string | null;
  front_original_name: string | null;
  back_original_name: string | null;
  created_at: string;
}

interface SelectedAttribute {
  attribute_id: string;
  attribute_name: string;
  attribute_value_id: string;
  attribute_value_name: string;
}

interface EnrichedCartItem extends CartItem {
  product_name: string;
  product_image: string | null;
  attributes: SelectedAttribute[];
}

export function CartPage() {
  const location = useLocation();
  const newItem = location.state as any;
  const userId = getUserId();

  const [cartItems, setCartItems] = useState<EnrichedCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Parse selected attributes from JSON string
  const parseSelectedAttributes = (selectedAttributesStr: string): SelectedAttribute[] => {
    try {
      return JSON.parse(selectedAttributesStr);
    } catch {
      return [];
    }
  };

  // Format attribute name for display (capitalize first letter of each word)
  const formatAttributeName = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Fetch cart items and enrich with product details
  const fetchCartItems = async () => {
    if (!userId) {
      setLoading(false);
      toast.error("Please login to view your cart");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/cartitems/user/${userId}`, {
        withCredentials: true,
      });

      const items: CartItem[] = res.data.data || [];

      const enrichedItems = await Promise.all(
        items.map(async (item: CartItem) => {
          try {
            // Fetch product details
            const productRes = await axios.get(`${API_BASE}/product/${item.product_id}`);
            const product = productRes.data;

            // Parse selected attributes
            const attributes = parseSelectedAttributes(item.selected_attributes);
            
            // Get product image
            const images = Array.isArray(product.images) ? product.images : [];
            const defaultImage = images.find((img: any) => img.is_default)?.url || images[0]?.url;

            return {
              ...item,
              product_name: product.name || "Unknown Product",
              product_image: defaultImage ? MEDIA_BASE + defaultImage : null,
              attributes: attributes,
            };
          } catch (itemErr) {
            console.error(`Failed to enrich item ${item.id}:`, itemErr);
            const attributes = parseSelectedAttributes(item.selected_attributes);
            
            return {
              ...item,
              product_name: "Product Unavailable",
              product_image: null,
              attributes: attributes,
            };
          }
        })
      );

      setCartItems(enrichedItems);
    } catch (err) {
      console.error("Failed to fetch cart items", err);
      setCartItems([]);
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  // Delete item from cart
  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${API_BASE}/cartitems/${id}`, {
        withCredentials: true,
      });
      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [userId]);

  // Add new item to cart if coming from product page
  useEffect(() => {
    if (newItem?.variant && userId) {
      addToCart();
    }
  }, [newItem, userId]);

  const addToCart = async () => {
    if (!userId) {
      toast.error("Login Required");
      return;
    }
    if (!newItem?.variant) return;

    try {
      await axios.post(
        `${API_BASE}/cartitems/`,
        {
          user_id: userId,
          product_id: newItem.product.id,
          variant_id: newItem.variant.id,
          price_id: newItem.price.id,
          quantity: newItem.quantity,
        },
        { withCredentials: true }
      );
      toast.success("Cart updated successfully!");
      fetchCartItems();
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error("Add to cart failed!");
    }
  };

  // Calculate product total (without design fees)
  const productTotal = cartItems.reduce((sum, item) => {
    const itemTotal = Number(item.total_price || 0);
    const designFee = item.design_price ? Number(item.design_price) : 0;
    return sum + (itemTotal - designFee);
  }, 0);
  
  const designFeesTotal = cartItems.reduce((sum, item) => sum + (item.design_price ? Number(item.design_price) : 0), 0);
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added any items yet</p>
          <Link to="/">
            <Button className="bg-red-600 hover:bg-red-700">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Images */}
                  <div className="flex-shrink-0">
                    {item.files && item.files.length > 0 ? (
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {item.files.map((file: FileAttachment) => (
                          <div key={file.id} className="flex gap-2">
                            {file.front_side_url && (
                              <img
                                src={MEDIA_BASE + file.front_side_url}
                                alt={file.front_original_name || "Front side"}
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border"
                              />
                            )}
                            {file.back_side_url && (
                              <img
                                src={MEDIA_BASE + file.back_side_url}
                                alt={file.back_original_name || "Back side"}
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Item Details - Dynamic Attributes */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3">
                      {item.product_name}
                    </h3>
                    
                    {/* Dynamically render all attributes */}
                    {item.attributes.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {item.attributes.map((attr) => (
                          <div key={attr.attribute_id} className="flex items-baseline gap-2 text-sm">
                            <span className="font-medium text-gray-700 min-w-[100px]">
                              {formatAttributeName(attr.attribute_name)}:
                            </span>
                            <span className="text-gray-600 capitalize">
                              {attr.attribute_value_name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Design Price - Show if present (for transparency, not added to total) */}
                    {item.design_price && item.design_price > 0 && (
                      <div className="mb-3 p-2 bg-blue-50 rounded-md">
                        <div className="flex items-baseline gap-2 text-sm">
                          <span className="font-medium text-blue-700 min-w-[100px]">
                            Design Fee:
                          </span>
                          <span className="text-blue-700 font-semibold">
                            ₹{Number(item.design_price).toLocaleString()}
                          </span>
                          <span className="text-xs text-blue-600 ml-2">
                            (Included in total)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quantity and Price */}
                    <div className="mt-4 pt-3 border-t">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div>
                          <p className="text-sm text-gray-600">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Unit Price: <span className="font-medium">₹{Number(item.unit_price || 0).toLocaleString()}</span>
                          </p>
                          {item.design_price && item.design_price > 0 && (
                            <p className="text-sm text-gray-600">
                              Design Fee: <span className="font-medium">₹{Number(item.design_price).toLocaleString()}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600 text-lg sm:text-xl">
                            ₹{Number(item.total_price || 0).toLocaleString()}
                          </p>
                          {item.design_price && item.design_price > 0 && (
                            <p className="text-xs text-gray-500">
                              (Incl. design fee)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 hover:bg-red-50"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                {/* Product Total (excluding design fees) */}
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-700">Product Total</span>
                  <span className="font-medium text-gray-900">₹{productTotal.toLocaleString()}</span>
                </div>

                {/* Design Fees (if any) */}
                {designFeesTotal > 0 && (
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-700">Design Fees</span>
                    <span className="font-medium text-gray-900">+ ₹{designFeesTotal.toLocaleString()}</span>
                  </div>
                )}

                {/* Subtotal (including design fees) */}
                <div className="flex justify-between items-center text-base pt-2 border-t border-gray-100">
                  <span className="text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
                </div>

                {/* GST */}
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-700">GST (18%)</span>
                  <span className="font-medium text-gray-900">₹{gst.toLocaleString()}</span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-red-600">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Link to="/address">
                <Button className="w-full mt-6 bg-red-600 hover:bg-red-700">
                  Continue to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              {/* <Link to="/products">
                <Button variant="outline" className="w-full mt-3">
                  Continue Shopping
                </Button>
              </Link> */}
            </Card>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
}