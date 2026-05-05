import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Order, OrderItem } from "../../types/order";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Package,
  Truck,
  CreditCard,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Download,
  Printer,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

// Status configuration with new color palette (#D73D32, #C0392B, #EC7063, #2d4863, #F4A261)
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: JSX.Element; step: number }> = {
  pending: {
    label: "Pending",
    color: "bg-[#F4A261]/10 text-[#F4A261] border-[#F4A261]/20",
    icon: <Clock className="w-5 h-5" />,
    step: 1
  },
  process: {
    label: "Processing",
    color: "bg-[#2d4863]/10 text-[#2d4863] border-[#2d4863]/20",
    icon: <RefreshCw className="w-5 h-5" />,
    step: 2
  },
  printing: {
    label: "Printing",
    color: "bg-[#EC7063]/10 text-[#EC7063] border-[#EC7063]/20",
    icon: <Printer className="w-5 h-5" />,
    step: 3
  },
  packed: {
    label: "Packed",
    color: "bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/20",
    icon: <Package className="w-5 h-5" />,
    step: 4
  },
  shipment: {
    label: "Shipped",
    color: "bg-[#2d4863]/10 text-[#2d4863] border-[#2d4863]/20",
    icon: <Truck className="w-5 h-5" />,
    step: 5
  },
  delivery: {
    label: "Delivered",
    color: "bg-[#C0392B]/10 text-[#C0392B] border-[#C0392B]/20",
    icon: <CheckCircle className="w-5 h-5" />,
    step: 6
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-[#D73D32]/10 text-[#D73D32] border-[#D73D32]/20",
    icon: <XCircle className="w-5 h-5" />,
    step: 0
  },
  refunded: {
    label: "Refunded",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <DollarSign className="w-5 h-5" />,
    step: 0
  },
};

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("items");
  const itemsSectionRef = useRef<HTMLDivElement>(null);
  const shippingSectionRef = useRef<HTMLDivElement>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  // Get order from navigation state
  const order = location.state?.order as Order;

  // If no order data in state, redirect back to orders list
  if (!order) {
    toast.error("Order data not found");
    navigate('/admin/Order');
    return null;
  }

  // Verify the order ID matches the URL param
  if (order.id !== orderId) {
    toast.error("Order data mismatch");
    navigate('/admin/Order');
    return null;
  }

  // Calculate total amount correctly: delivery_charge + total_amount from items
  const calculateGrandTotal = () => {
    const itemsTotal = order.items?.reduce((sum, item) => sum + item.total_price, 0) || 0;
    const deliveryCharge = order.delivery_charge || 0;
    return itemsTotal + deliveryCharge;
  };

  const grandTotal = calculateGrandTotal();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Function to handle image download with proper filename and force download
  const handleDownloadImage = async (imageUrl: string, index: number = 0) => {
    try {
      // Construct full URL
      const fullUrl = imageUrl.startsWith('http') ? imageUrl : `http://127.0.0.1:8000/${imageUrl}`;
      
      // Fetch the image as a blob
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `design_${Date.now()}_${index}.jpg`; // Force download with filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image. Please try again.");
    }
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = 
      sectionId === "items" ? itemsSectionRef.current :
      sectionId === "shipping" ? shippingSectionRef.current :
      paymentSectionRef.current;
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="h-full bg-white" style={{ scrollBehavior: "smooth" }}>
      {/* Header */}
      <div className="bg-white border-b top-0 z-10 shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/Order')}
                className="gap-2 border-[#2d4863]/20 text-[#2d4863] hover:bg-[#2d4863]/5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#2d4863]">Order Details</h1>
                <p className="text-sm text-gray-500 font-mono">Order ID: {order.id.slice(0, 12)}...</p>
              </div>
            </div>
           
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2d4863]">Order Status</h2>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${STATUS_CONFIG[order.status]?.color}`}>
              {STATUS_CONFIG[order.status]?.icon}
              {STATUS_CONFIG[order.status]?.label}
            </span>
          </div>

          {/* Progress Bar */}
          {order.status !== "cancelled" && order.status !== "refunded" && (
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${((STATUS_CONFIG[order.status]?.step || 0) / 6) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#D73D32] transition-all duration-500"
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Pending</span>
                <span>Processing</span>
                <span>Printing</span>
                <span>Packed</span>
                <span>Shipped</span>
                <span>Delivered</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-20 z-10">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: "items", label: "Order Items", icon: <Package className="w-4 h-4" /> },
                  { id: "shipping", label: "Shipping Info", icon: <Truck className="w-4 h-4" /> },
                  { id: "payment", label: "Payment Details", icon: <CreditCard className="w-4 h-4" /> }
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
                      activeSection === section.id
                        ? "bg-[#D73D32] text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Items Section */}
            <div ref={itemsSectionRef} id="items-section">
              {activeSection === "items" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D73D32]" />
                    Order Items ({order.items?.length || 0})
                  </h2>
                  <div className="space-y-4">
                    {order.items?.map((item: OrderItem, index: number) => (
                      <div key={item.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Product Image */}
                          {item.files?.[0]?.front_side_url && (
                            <div className="md:w-32">
                              <img
                                src={`http://127.0.0.1:8000/${item.files[0].front_side_url}`}
                                alt={item.product_name}
                                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImage(`http://127.0.0.1:8000/${item.files[0].front_side_url}`)}
                              />
                            </div>
                          )}

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg text-[#2d4863]">{item.product_name}</h3>
                              <span className="text-sm font-medium text-gray-500">Qty: {item.quantity}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                              <div>
                                <span className="text-gray-500">Unit Price:</span>
                                <span className="ml-2 font-medium">{formatCurrency(item.unit_price)}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Total:</span>
                                <span className="ml-2 font-medium text-[#D73D32]">{formatCurrency(item.total_price)}</span>
                              </div>
                            </div>

                            {/* Attributes */}
                            {item.selected_attributes && item.selected_attributes.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Specifications:</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                  {item.selected_attributes.map((attr, idx) => (
                                    <div key={idx} className="text-sm bg-gray-50 px-2 py-1 rounded">
                                      <span className="text-gray-600">{attr.attribute_name}:</span>
                                      <span className="ml-1 font-medium">{attr.attribute_value_name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Design Files */}
                            {item.files && item.files.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Design Files:</p>
                                <div className="flex gap-3 flex-wrap">
                                  {item.files.map((file, idx) => (
                                    <div key={idx} className="space-y-1 flex gap-2">
                                      {file.front_side_url && (
                                        <button
                                          onClick={() => setSelectedImage(`http://127.0.0.1:8000/${file.front_side_url}`)}
                                          className="text-sm text-[#2d4863] hover:text-[#D73D32] flex items-center gap-1"
                                        >
                                          <Eye className="w-4 h-4" />
                                          View Front
                                        </button>
                                      )}
                                      {file.back_side_url && (
                                        <button
                                          onClick={() => setSelectedImage(`http://127.0.0.1:8000/${file.back_side_url}`)}
                                          className="text-sm text-[#2d4863] hover:text-[#D73D32] flex items-center gap-1"
                                        >
                                          <Eye className="w-4 h-4" />
                                          View Back
                                        </button>
                                      )}
                                      {file.front_side_url && (
                                        <button
                                          onClick={() => handleDownloadImage(file.front_side_url!, idx)}
                                          className="text-sm text-[#2d4863] hover:text-[#D73D32] flex items-center gap-1"
                                        >
                                          <Download className="w-4 h-4" />
                                          Download
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info Section */}
            <div ref={shippingSectionRef} id="shipping-section">
              {activeSection === "shipping" && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-[#D73D32]" />
                      Customer Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{order.user?.username || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{order.user?.email || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{order.address?.phone || order.user?.phone || "N/A"}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Order Date</p>
                        <p className="font-medium text-gray-900">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#F4A261]" />
                      Shipping Address
                    </h2>
                    <div className="p-4 bg-[#F4A261]/5 rounded-lg border border-[#F4A261]/20">
                      {order.address?.name && (
                        <p className="font-medium text-gray-900">{order.address.name}</p>
                      )}
                      <p className="text-gray-700 mt-1">{order.address?.address}</p>
                      <p className="text-gray-700">
                        {order.address?.city && `${order.address.city}, `}
                        {order.address?.state && `${order.address.state} - `}
                        {order.address?.postal_code}
                      </p>
                      <p className="text-gray-700">Country: {order.address?.country || "India"}</p>
                      {order.address?.landmark && (
                        <p className="text-gray-600 text-sm mt-2">Landmark: {order.address.landmark}</p>
                      )}
                      <p className="text-gray-600 text-sm mt-2">Phone: {order.address?.phone}</p>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  {order.shipment && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-[#C0392B]" />
                        Shipment Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-[#C0392B]/5 rounded-lg border border-[#C0392B]/20">
                          <p className="text-sm text-gray-500">AWB / Tracking Number</p>
                          <p className="font-mono font-medium text-gray-900">{order.shipment.awb_code || "Not generated"}</p>
                        </div>
                        <div className="p-3 bg-[#C0392B]/5 rounded-lg border border-[#C0392B]/20">
                          <p className="text-sm text-gray-500">Courier Partner</p>
                          <p className="font-medium text-gray-900">{order.shipment.courier_name || "N/A"}</p>
                        </div>
                        <div className="p-3 bg-[#C0392B]/5 rounded-lg border border-[#C0392B]/20">
                          <p className="text-sm text-gray-500">Freight Charges</p>
                          <p className="font-medium text-gray-900">{formatCurrency(order.shipment.freight_charges || 0)}</p>
                        </div>
                        <div className="p-3 bg-[#C0392B]/5 rounded-lg border border-[#C0392B]/20">
                          <p className="text-sm text-gray-500">Shipment Status</p>
                          <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-[#EC7063]/10 text-[#C0392B]">
                            {order.shipment.current_status || "Processing"}
                          </span>
                        </div>
                      </div>
                      {order.shipment.tracking_url && (
                        <div className="mt-4 pt-3 border-t">
                          <a
                            href={order.shipment.tracking_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D73D32] hover:text-[#C0392B] hover:underline inline-flex items-center gap-1"
                          >
                            Track Package →
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Payment Details Section */}
            <div ref={paymentSectionRef} id="payment-section">
              {activeSection === "payment" && (
                <div className="space-y-6">
                  {/* Payment Summary */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-[#F4A261]" />
                      Payment Summary
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{formatCurrency(order.items?.reduce((sum, item) => sum + item.total_price, 0) || 0)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Delivery Charge</span>
                        <span className="font-medium">{formatCurrency(order.delivery_charge || 0)}</span>
                      </div>
                      <div className="flex justify-between py-3 border-t-2">
                        <span className="font-bold text-gray-900">Grand Total</span>
                        <span className="font-bold text-xl text-[#D73D32]">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#EC7063]" />
                      Transaction Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium capitalize text-gray-900">{order.payment_method}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className={`font-medium ${order.payment_status === "paid" ? "text-[#C0392B]" : "text-[#F4A261]"}`}>
                          {order.payment_status === "paid" ? "✓ Payment Received" : "Awaiting Payment"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Order Date & Time</p>
                        <p className="text-gray-900">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-gray-900">{formatDate(order.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#2d4863] mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      Order Timeline
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-3 h-3 mt-1 rounded-full bg-[#C0392B]"></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Order Placed</p>
                          <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                        </div>
                      </div>
                      {order.status !== "pending" && order.status !== "cancelled" && (
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 mt-1 rounded-full bg-[#EC7063]"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Order Processed</p>
                            <p className="text-sm text-gray-500">Status updated to {STATUS_CONFIG[order.status]?.label}</p>
                          </div>
                        </div>
                      )}
                      {order.status === "delivery" && (
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 mt-1 rounded-full bg-[#C0392B]"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Order Delivered</p>
                            <p className="text-sm text-gray-500">Completed Successfully</p>
                          </div>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-start gap-3">
                          <div className="w-3 h-3 mt-1 rounded-full bg-[#D73D32]"></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Order Cancelled</p>
                            <p className="text-sm text-gray-500">{formatDate(order.updated_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-gradient-to-br from-[#2d4863] to-[#2d4863]/90 rounded-lg shadow-sm p-6 sticky top-24 text-white">
              <h3 className="font-semibold text-white/90 mb-4">Quick Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Total Items</span>
                  <span className="font-medium text-white">{order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Unique Products</span>
                  <span className="font-medium text-white">{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Payment Method</span>
                  <span className="font-medium capitalize text-white">{order.payment_method}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Delivery Type</span>
                  <span className="font-medium capitalize text-white">{order.delivery_type}</span>
                </div>
                {order.shipment?.awb_code && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">AWB Code</span>
                    <span className="font-mono text-xs text-white/80">{order.shipment.awb_code}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold">Grand Total</span>
                  <span className="text-2xl font-bold text-[#F4A261]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const fileName = `design_${Date.now()}.jpg`;
                  const link = document.createElement('a');
                  link.href = selectedImage;
                  link.download = fileName;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  toast.success("Image downloaded successfully!");
                }}
                className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                Download Image
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}