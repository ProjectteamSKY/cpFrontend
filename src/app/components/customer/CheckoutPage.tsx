import { useState } from "react";
import { Link } from "react-router";
import { CreditCard, Building2, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showSuccess, setShowSuccess] = useState(false);

  const orderSummary = {
    subtotal: 44850,
    gst: 8073,
    delivery: 100,
    total: 53023,
  };

  const handlePlaceOrder = () => {
    setShowSuccess(true);
    setTimeout(() => {
      window.location.href = "/order-tracking/ORD-2024-001";
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <Card className="bg-white p-12 text-center shadow-lg border-0 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order ID: <span className="font-semibold text-[#D73D32]">ORD-2024-001</span>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly. Redirecting to order tracking...
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/order-tracking/ORD-2024-001">
              <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
                Track Order
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="border-gray-200">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Address */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Billing Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input 
                  id="fullName" 
                  placeholder="Enter your full name" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone" 
                  placeholder="+91 1234567890" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input 
                  id="address" 
                  placeholder="House no., Building name, Street" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input 
                  id="city" 
                  placeholder="Enter city" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input 
                  id="state" 
                  placeholder="Enter state" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input 
                  id="pincode" 
                  placeholder="000000" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gst">GST Number (Optional)</Label>
                <Input 
                  id="gst" 
                  placeholder="22AAAAA0000A1Z5" 
                  className="bg-white border-gray-200 mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Payment Method</h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-4">
                {/* UPI */}
                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="upi" id="payment-upi" className="mt-1" />
                    <div>
                      <label htmlFor="payment-upi" className="font-medium cursor-pointer flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-[#D73D32]" />
                        UPI Payment
                      </label>
                      <p className="text-sm text-gray-600 mt-1">Pay via Google Pay, PhonePe, Paytm, etc.</p>
                      {paymentMethod === "upi" && (
                        <div className="mt-3">
                          <Input 
                            placeholder="Enter UPI ID (e.g., yourname@paytm)" 
                            className="bg-white border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Net Banking */}
                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="netbanking" id="payment-netbanking" className="mt-1" />
                    <div>
                      <label htmlFor="payment-netbanking" className="font-medium cursor-pointer flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#D73D32]" />
                        Net Banking
                      </label>
                      <p className="text-sm text-gray-600 mt-1">All major banks supported</p>
                    </div>
                  </div>
                </div>

                {/* Card */}
                <div className="flex items-start justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#D73D32] cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="card" id="payment-card" className="mt-1" />
                    <div className="flex-1">
                      <label htmlFor="payment-card" className="font-medium cursor-pointer flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#D73D32]" />
                        Credit / Debit Card
                      </label>
                      <p className="text-sm text-gray-600 mt-1">Visa, Mastercard, RuPay, Amex</p>
                      {paymentMethod === "card" && (
                        <div className="mt-3 space-y-3">
                          <Input 
                            placeholder="Card Number" 
                            className="bg-white border-gray-200"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Input 
                              placeholder="MM/YY" 
                              className="bg-white border-gray-200"
                            />
                            <Input 
                              placeholder="CVV" 
                              type="password" 
                              className="bg-white border-gray-200"
                            />
                          </div>
                        </div>
                      )}
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

            {/* Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A] text-sm">Business Cards</p>
                  <p className="text-xs text-gray-600">Qty: 100</p>
                </div>
                <p className="font-semibold text-[#1A1A1A]">₹39,900</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A] text-sm">Brochures</p>
                  <p className="text-xs text-gray-600">Qty: 50</p>
                </div>
                <p className="font-semibold text-[#1A1A1A]">₹4,950</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderSummary.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>GST (18%)</span>
                <span className="font-medium">₹{orderSummary.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Delivery Charge</span>
                <span className="font-medium">₹{orderSummary.delivery}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-[#1A1A1A]">Total Amount</span>
                  <span className="text-2xl font-bold text-[#D73D32]">₹{orderSummary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Place Order */}
            <Button 
              className="w-full bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white py-6 text-lg mb-3"
              onClick={handlePlaceOrder}
            >
              Place Order
            </Button>
            <Link to="/cart">
              <Button variant="outline" className="w-full border-gray-200">
                Back to Cart
              </Button>
            </Link>

            {/* Security Badge */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg text-center">
              <p className="text-xs text-green-700">🔒 Your payment information is secure</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
