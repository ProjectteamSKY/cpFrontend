import { useParams, Link } from "react-router";
import { CheckCircle, Circle, Download, Package, Printer, Shield, Truck } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function OrderTrackingPage() {
  const { orderId } = useParams();

  const orderStatus = [
    { 
      step: "Order Placed", 
      icon: Package, 
      completed: true, 
      date: "Feb 10, 2026 10:30 AM",
      description: "Your order has been confirmed" 
    },
    { 
      step: "Printing", 
      icon: Printer, 
      completed: true, 
      date: "Feb 11, 2026 2:15 PM",
      description: "Your files are being printed" 
    },
    { 
      step: "Quality Check", 
      icon: Shield, 
      completed: true, 
      date: "Feb 12, 2026 11:00 AM",
      description: "Quality inspection completed" 
    },
    { 
      step: "Shipped", 
      icon: Truck, 
      completed: false, 
      date: "",
      description: "Package out for delivery" 
    },
    { 
      step: "Delivered", 
      icon: CheckCircle, 
      completed: false, 
      date: "",
      description: "Order delivered successfully" 
    },
  ];

  const orderDetails = {
    orderId: orderId || "ORD-2024-001",
    orderDate: "Feb 10, 2026",
    expectedDelivery: "Feb 15, 2026",
    trackingId: "TRK9876543210",
    items: [
      { name: "Business Cards", quantity: 100, price: 39900 },
      { name: "Brochures", quantity: 50, price: 4950 },
    ],
    subtotal: 44850,
    gst: 8073,
    delivery: 100,
    total: 53023,
  };

  const currentStep = orderStatus.findIndex(s => !s.completed);

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Track Your Order</h1>
        <p className="text-gray-600">Order ID: <span className="font-semibold text-[#D73D32]">{orderDetails.orderId}</span></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Timeline */}
        <div className="lg:col-span-2">
          <Card className="bg-white p-8 shadow-md border-0 mb-6">
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-8">Order Status</h2>
            
            <div className="space-y-8">
              {orderStatus.map((status, index) => {
                const Icon = status.icon;
                const isActive = index === currentStep;
                const isCompleted = status.completed;
                
                return (
                  <div key={index} className="relative">
                    {/* Connecting Line */}
                    {index < orderStatus.length - 1 && (
                      <div 
                        className={`absolute left-6 top-14 w-0.5 h-16 ${
                          isCompleted ? "bg-[#D73D32]" : "bg-gray-200"
                        }`}
                      />
                    )}
                    
                    <div className="flex gap-6 relative">
                      {/* Icon */}
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted 
                            ? "bg-[#D73D32] text-white" 
                            : isActive
                            ? "bg-[#1A1A1A] text-white animate-pulse"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`text-lg font-semibold ${
                            isCompleted || isActive ? "text-[#1A1A1A]" : "text-gray-400"
                          }`}>
                            {status.step}
                          </h3>
                          {status.date && (
                            <span className="text-sm text-gray-600">{status.date}</span>
                          )}
                        </div>
                        <p className={`text-sm ${
                          isCompleted || isActive ? "text-gray-600" : "text-gray-400"
                        }`}>
                          {status.description}
                        </p>
                        {isActive && (
                          <div className="mt-2 inline-block px-3 py-1 bg-[#1A1A1A]/10 text-[#1A1A1A] text-xs font-medium rounded-full">
                            In Progress
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Tracking Information */}
          <Card className="bg-white p-6 shadow-sm border-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Tracking Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#EFEFEF] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tracking ID</p>
                <p className="font-semibold text-[#1A1A1A]">{orderDetails.trackingId}</p>
              </div>
              <div className="p-4 bg-[#EFEFEF] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Order Date</p>
                <p className="font-semibold text-[#1A1A1A]">{orderDetails.orderDate}</p>
              </div>
              <div className="p-4 bg-[#EFEFEF] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Expected Delivery</p>
                <p className="font-semibold text-[#1A1A1A]">{orderDetails.expectedDelivery}</p>
              </div>
              <div className="p-4 bg-[#EFEFEF] rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <p className="font-semibold text-[#1A1A1A]">{orderStatus[currentStep]?.step || "Delivered"}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="bg-white p-6 shadow-md border-0 sticky top-24">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#1A1A1A]">₹{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Subtotal</span>
                <span className="font-medium">₹{orderDetails.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>GST (18%)</span>
                <span className="font-medium">₹{orderDetails.gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#1A1A1A]">
                <span>Delivery</span>
                <span className="font-medium">₹{orderDetails.delivery}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-[#1A1A1A]">Total Paid</span>
                  <span className="text-xl font-bold text-[#D73D32]">₹{orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <Button className="w-full bg-[#D73D32] hover:bg-[#D73D32]/90 text-white mb-3">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <Link to="/products">
              <Button variant="outline" className="w-full border-gray-200">
                Order Again
              </Button>
            </Link>

            {/* Support */}
            <div className="mt-6 p-4 bg-[#EFEFEF] rounded-lg text-center">
              <p className="text-sm text-gray-700 mb-2">Need Help?</p>
              <p className="text-sm text-[#D73D32] font-medium cursor-pointer">Contact Support</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
