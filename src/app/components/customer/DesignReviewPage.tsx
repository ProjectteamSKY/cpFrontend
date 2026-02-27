import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Trash2, FileCheck, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import api from "../../service/api";

export function DesignReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!state || !state.designFile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No design data found</p>
      </div>
    );
  }

  // ===========================
  // Destructure state properly
  // ===========================
  const {
    product,
    variant,
    quantity: selectedQuantity, // ✅ match the property sent from previous page
    priceId,
    designFile,
    selected_options
  } = state;

  const accessToken = sessionStorage.getItem("access_token");

  // =========================================================
  // 🔥 SAFE IMAGE PREVIEW (NO MEMORY LEAK)
  // =========================================================
  useEffect(() => {
    if (designFile && designFile.type?.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(designFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [designFile]);

  // =========================================================
  // 🚀 GET OR CREATE CART
  // =========================================================
  const getCartId = async (userId: string): Promise<string> => {
    try {
      const response = await api.get(`/cart/carts/user/${userId}`);
      const carts = response.data;

      if (Array.isArray(carts) && carts.length > 0) {
        return String(carts[0].id); // return existing cart
      }

      // create new cart if none
      const createResponse = await api.post("/cart/carts", {
        user_id: userId,
        status: "active",
        total_amount: 0,
        total_discount: 0,
      });
      return String(createResponse.data.id);
    } catch (error: any) {
      if (error.response?.status === 404) {
        const createResponse = await api.post("/cart/carts", {
          user_id: userId,
          status: "active",
          total_amount: 0,
          total_discount: 0,
        });
        return String(createResponse.data.id);
      }
      console.error("Failed to get/create cart", error);
      throw error;
    }
  };

  // =========================================================
  // 🛒 ADD TO CART
  // =========================================================
  const handleAddToCart = async () => {
    if (!accessToken) {
      navigate("/Login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userId =
        sessionStorage.getItem("user_id") || localStorage.getItem("user_id");
      if (!userId) throw new Error("User ID not found. Please login again.");

      const cartId = await getCartId(userId);

      // ✅ convert quantity to number
      const quantityNumber = Number(selectedQuantity || variant.prices[0].min_qty);

      const formData = new FormData();
      formData.append("cart_id", cartId);
      formData.append("product_id", String(product.id));
      formData.append("variant_id", String(variant.id));
      formData.append("quantity", String(quantityNumber));
      formData.append("price_id", String(priceId));
      formData.append("selected_options", JSON.stringify(selected_options));

      if (designFile) formData.append("front_file", designFile);

      await api.post("/cartitems/cart-items/with-files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/cart");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail, null, 2)
          : err?.message || "Failed to add item to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 💰 PRICE CALCULATION
  // =========================================================
  const quantityNumber = Number(selectedQuantity || variant.prices[0].min_qty);
  const price =
    variant.prices.find((p: any) => String(p.id) === String(priceId))?.price ||
    0;
  const subtotal = price * quantityNumber;
  const gst = subtotal * 0.18;
  const deliveryCharge = 100;
  const total = subtotal + gst + deliveryCharge;

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Design Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex gap-6">
              {/* Preview */}
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Preview</span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Quantity: {quantityNumber} pieces
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500">Size</p>
                    <p>{variant.size?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Material</p>
                    <p>{variant.paperType?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lamination</p>
                    <p>{selected_options?.lamination || "Standard"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price per unit</p>
                    <p>₹{price}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 text-sm">File Ready</span>
                  </div>
                  <span className="font-bold text-lg">₹{subtotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>

        {/* RIGHT SECTION */}
        <div>
          <Card className="p-6 space-y-4 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

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

            <Button
              onClick={handleAddToCart}
              disabled={loading}
              className="w-full bg-black text-white py-5"
            >
              {loading ? "Adding..." : "Add to Cart"}
              <ShoppingBag className="ml-2" size={18} />
            </Button>

            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}