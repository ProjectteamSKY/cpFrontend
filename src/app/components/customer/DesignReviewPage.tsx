import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router";
import { Trash2, FileCheck, AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function DesignReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;

  if (!state || !state.designFile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No design data found</p>
      </div>
    );
  }

  const { product, variant, quantityId, totalPrice, designFile } = state;

  const [cartItems] = useState([
    {
      id: 1,
      name: product.name,
      size: variant.size?.name,
      material: variant.paperType?.name,
      lamination: "Standard", // you can adjust if needed
      quantity: quantityId,
      price: variant.prices.find((p: any) => String(p.id) === String(quantityId))?.price || 0,
      file: designFile.name || "design-file",
      fileStatus: "approved", // or dynamic status if available
      previewUrl: designFile?.type?.startsWith("image/") ? URL.createObjectURL(designFile) : null,
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const deliveryCharge = 100;
  const total = subtotal + gst + deliveryCharge;

  const accessToken = sessionStorage.getItem("access_token");
  const refreshToken = sessionStorage.getItem("refresh_token");
  
  const handleAddToCart = () => {
    if (accessToken) {
      alert("Added to cart!");
    } else {
      navigate("/LoginPage");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Design Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Design Preview */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-white p-6 shadow-sm border-0">
              <div className="flex gap-6">
                {/* Preview */}
                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {item.previewUrl ? (
                    <img src={item.previewUrl} alt="Design Preview" className="w-full h-full object-contain rounded-lg" />
                  ) : (
                    <div className="text-xs text-gray-400">Preview</div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity} pieces</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-[#D73D32] hover:bg-red-50">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{item.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Material</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{item.material}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Lamination</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{item.lamination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Price per unit</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">₹{item.price}</p>
                    </div>
                  </div>

                  {/* File Status */}
                  <div className="flex items-center justify-between p-3 bg-[#EFEFEF] rounded-lg">
                    <div className="flex items-center gap-2">
                      {item.fileStatus === "approved" ? (
                        <>
                          <FileCheck className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">File Approved</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-700 font-medium">Under Review</span>
                        </>
                      )}
                      <span className="text-sm text-gray-600">• {item.file}</span>
                    </div>
                    <span className="text-lg font-bold text-[#D73D32]">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6 shadow-md border-0 sticky top-24 space-y-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
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
              <div className="border-t pt-4">
                <div className="flex justify-between text-[#1A1A1A]">
                  <span className="text-lg font-semibold">Grand Total</span>
                  <span className="text-2xl font-bold text-[#D73D32]">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white py-6 text-lg flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </Button>

            <Link to="/products">
              <Button variant="outline" className="w-full border-gray-200">
                Continue Shopping
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}