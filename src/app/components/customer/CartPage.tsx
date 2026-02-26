import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router";
import { Trash2, FileCheck, AlertCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function CartPage() {
  const location = useLocation();
  const newItem = location.state as any;

  const [cartItems, setCartItems] = useState<any[]>([]);

  // Add item from navigation state
  useEffect(() => {
    if (newItem?.product && newItem?.variant) {
      setCartItems((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newItem.product.name,
          size: newItem.variant.size?.name,
          material: newItem.variant.paperType?.name,
          lamination: newItem.variant.lamination || "Standard",
          quantity: newItem.quantityId,
          price: newItem.basePrice,
          file: newItem.designFile.name,
          fileStatus: "pending",
          previewUrl: newItem.preview,
        },
      ]);
    }
  }, [newItem]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const deliveryCharge = 100;
  const total = subtotal + gst + deliveryCharge;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <Card className="bg-white p-12 text-center shadow-sm border-0">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Link to="/products">
            <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">Browse Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-white p-6 shadow-sm border-0">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt="Preview" className="max-h-full max-w-full rounded-lg" />
                    ) : (
                      <div className="text-xs text-gray-400">Preview</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity} pieces</p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-[#D73D32] hover:bg-red-50" onClick={() => setCartItems(cartItems.filter(ci => ci.id !== item.id))}>
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
                      <span className="text-lg font-bold text-[#D73D32]">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white p-6 shadow-md border-0 sticky top-24">
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

              <div className="mb-6">
                <Label className="mb-2 block">Have a coupon code?</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter code" className="bg-white border-gray-200" />
                  <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">Apply</Button>
                </div>
              </div>

              <div className="bg-[#EFEFEF] p-4 rounded-lg mb-6">
                <h3 className="font-medium text-[#1A1A1A] mb-2">Delivery Information</h3>
                <p className="text-sm text-gray-600 mb-1">Expected delivery: 3-5 business days</p>
                <p className="text-sm text-gray-600">Free delivery on orders above ₹5,000</p>
              </div>

              <Link to="/checkout">
                <Button className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white py-6 text-lg mb-3">
                  Proceed to Payment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full border-gray-200">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}