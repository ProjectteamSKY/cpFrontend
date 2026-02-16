import { Download, Eye, FileText, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function InvoiceSection() {
  const invoices = [
    {
      id: "INV-2024-156",
      orderId: "ORD-2024-156",
      customer: "Rahul Sharma",
      gstNumber: "27AABCU9603R1ZM",
      amount: 4500,
      gst: 810,
      total: 5310,
      date: "Feb 13, 2026",
      status: "Paid",
    },
    {
      id: "INV-2024-155",
      orderId: "ORD-2024-155",
      customer: "Priya Patel",
      gstNumber: "29AAGCP8070K1ZY",
      amount: 7800,
      gst: 1404,
      total: 9204,
      date: "Feb 12, 2026",
      status: "Paid",
    },
    {
      id: "INV-2024-154",
      orderId: "ORD-2024-154",
      customer: "Amit Kumar",
      gstNumber: null,
      amount: 2340,
      gst: 421,
      total: 2761,
      date: "Feb 11, 2026",
      status: "Paid",
    },
    {
      id: "INV-2024-153",
      orderId: "ORD-2024-153",
      customer: "Sneha Gupta",
      gstNumber: "24AAACR5055K1Z4",
      amount: 5600,
      gst: 1008,
      total: 6608,
      date: "Feb 10, 2026",
      status: "Pending",
    },
  ];

  const gstSummary = {
    totalSales: 845320,
    cgst: 76079,
    sgst: 76079,
    igst: 0,
    totalGst: 152158,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Invoice & GST Management</h1>
        <p className="text-gray-600">Manage invoices and GST reports</p>
      </div>

      {/* GST Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-white p-6 shadow-sm border-0">
          <p className="text-sm text-gray-600 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-[#1A1A1A]">₹{gstSummary.totalSales.toLocaleString()}</p>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <p className="text-sm text-gray-600 mb-1">CGST (9%)</p>
          <p className="text-2xl font-bold text-[#D73D32]">₹{gstSummary.cgst.toLocaleString()}</p>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <p className="text-sm text-gray-600 mb-1">SGST (9%)</p>
          <p className="text-2xl font-bold text-[#D73D32]">₹{gstSummary.sgst.toLocaleString()}</p>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <p className="text-sm text-gray-600 mb-1">IGST (18%)</p>
          <p className="text-2xl font-bold text-[#D73D32]">₹{gstSummary.igst.toLocaleString()}</p>
        </Card>
        <Card className="bg-white p-6 shadow-sm border-0">
          <p className="text-sm text-gray-600 mb-1">Total GST</p>
          <p className="text-2xl font-bold text-[#1A1A1A]">₹{gstSummary.totalGst.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="bg-white p-6 shadow-sm border-0">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input 
              placeholder="Search by invoice ID or customer..." 
              className="bg-white border-gray-200"
            />
          </div>
          <Select defaultValue="february">
            <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="january">January 2026</SelectItem>
              <SelectItem value="february">February 2026</SelectItem>
              <SelectItem value="march">March 2026</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download GST Report
          </Button>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">All Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFEFEF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Invoice ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">GST Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">GST (18%)</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#D73D32]">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{invoice.orderId}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">{invoice.customer}</td>
                  <td className="px-6 py-4">
                    {invoice.gstNumber ? (
                      <span className="text-sm text-gray-600 font-mono">{invoice.gstNumber}</span>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[#1A1A1A]">₹{invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-[#1A1A1A]">₹{invoice.gst.toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold text-[#1A1A1A]">₹{invoice.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      invoice.status === "Paid" 
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Eye className="w-4 h-4 text-[#D73D32]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-green-50">
                        <Download className="w-4 h-4 text-green-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Template Preview */}
      <Card className="bg-white p-8 shadow-sm border-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">Sample GST Invoice</h2>
          <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
          {/* Invoice Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D73D32] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">CP</span>
                </div>
                <div className="text-2xl font-bold text-[#1A1A1A]">Citizen Prints</div>
              </div>
              <p className="text-sm text-gray-600">123 Business Street</p>
              <p className="text-sm text-gray-600">Mumbai, Maharashtra - 400001</p>
              <p className="text-sm text-gray-600">GSTIN: 27XXXXX1234X1Z5</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#D73D32] mb-2">INVOICE</div>
              <p className="text-sm text-gray-600">Invoice No: INV-2024-156</p>
              <p className="text-sm text-gray-600">Date: Feb 13, 2026</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8 p-4 bg-[#EFEFEF] rounded-lg">
            <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Bill To:</p>
            <p className="font-semibold text-[#1A1A1A]">Rahul Sharma</p>
            <p className="text-sm text-gray-600">456 Customer Avenue</p>
            <p className="text-sm text-gray-600">Pune, Maharashtra - 411001</p>
            <p className="text-sm text-gray-600">GSTIN: 27AABCU9603R1ZM</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-3 text-left text-sm font-semibold text-[#1A1A1A]">Description</th>
                <th className="py-3 text-center text-sm font-semibold text-[#1A1A1A]">Quantity</th>
                <th className="py-3 text-right text-sm font-semibold text-[#1A1A1A]">Rate</th>
                <th className="py-3 text-right text-sm font-semibold text-[#1A1A1A]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-sm">Business Cards - Matte Paper, Standard Size</td>
                <td className="py-3 text-center text-sm">100 pcs</td>
                <td className="py-3 text-right text-sm">₹45.00</td>
                <td className="py-3 text-right text-sm font-medium">₹4,500.00</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="font-medium text-[#1A1A1A]">₹4,500.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">CGST (9%):</span>
                <span className="font-medium text-[#1A1A1A]">₹405.00</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">SGST (9%):</span>
                <span className="font-medium text-[#1A1A1A]">₹405.00</span>
              </div>
              <div className="flex justify-between py-3 bg-[#D73D32]/10 px-4 rounded-lg mt-2">
                <span className="font-semibold text-[#1A1A1A]">Total Amount:</span>
                <span className="text-xl font-bold text-[#D73D32]">₹5,310.00</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">Thank you for your business!</p>
            <p className="text-xs text-gray-500 mt-2">This is a computer-generated invoice</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
