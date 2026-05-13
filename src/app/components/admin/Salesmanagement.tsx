'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  DollarSign,
  BarChart3,
  Truck,
  Package,
  TrendingUp,
  Calendar,
  ChevronDown,
  Loader2,
  AlertCircle,
  Download,
  Filter,
  X,
  CheckCircle2,
  Clock,
  Ban,
  Zap,
  TrendingDown,
  Layers,
  ShoppingCart,
  FileText,
  FileSpreadsheet,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';

// Types based on actual API response
interface SalesSummary {
  total_orders: number;
  total_sales: number;
  average_order_value: number;
  total_delivery_charge: number;
  total_units_sold: number;
  total_unique_products: number;
}

interface StatusReport {
  status: string;
  total_orders: number;
  total_sales: number;
  total_units_sold: number;
  total_unique_products: number;
  product_names: string | null;
}

interface DailySales {
  sale_date: string;
  total_orders: number;
  total_sales: number;
  total_units_sold: number;
  total_unique_products: number;
  product_names: string | null;
}

interface MonthlySales {
  month: string;
  total_orders: number;
  total_sales: number;
  total_units_sold: number;
  total_unique_products: number;
  product_names: string | null;
}

interface TopProduct {
  product_id: string;
  product_name: string;
  total_orders: number;
  total_units_sold: number;
  total_sales: number;
  average_price: number;
}

interface ReportParams {
  start_date: string;
  end_date: string;
  status: string;
}

interface ReportData {
  total_orders: number;
  total_sales: number;
  total_qty: number;
  orders: OrderItem[];
}

interface OrderItem {
  order_id: string;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  delivery_type: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  shipment: {
    awb_code: string;
    courier_name: string;
    shipment_status: string;
    tracking_url: string | null;
  } | null;
  products: {
    product_id: string;
    product_name: string;
    qty: number;
    unit_price: number;
    total_price: number;
  }[];
  product_total: number;
  delivery_charge: number;
  final_amount: number;
  total_qty: number;
}

const API_BASE = 'http://127.0.0.1:8000/api/orders_routes/sales';

export default function SalesManagement() {
  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [statusReports, setStatusReports] = useState<StatusReport[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [monthlySales, setMonthlySales] = useState<MonthlySales[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'reports'>('overview');
  const [trendView, setTrendView] = useState<'daily' | 'monthly'>('daily');
  const [reportParams, setReportParams] = useState<ReportParams>({
    start_date: '',
    end_date: '',
    status: '',
  });
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [exportDropdown, setExportDropdown] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, statusRes, dailyRes, monthlyRes, topProductsRes] = await Promise.all([
        fetch(`${API_BASE}/summary`),
        fetch(`${API_BASE}/status`),
        fetch(`${API_BASE}/daily`),
        fetch(`${API_BASE}/monthly`),
        fetch(`${API_BASE}/top-products`),
      ]);

      if (!summaryRes.ok) throw new Error('Failed to fetch summary');
      if (!statusRes.ok) throw new Error('Failed to fetch status reports');
      if (!dailyRes.ok) throw new Error('Failed to fetch daily sales');
      if (!monthlyRes.ok) throw new Error('Failed to fetch monthly sales');
      if (!topProductsRes.ok) throw new Error('Failed to fetch top products');

      const summaryData = await summaryRes.json();
      const statusData = await statusRes.json();
      const dailyData = await dailyRes.json();
      const monthlyData = await monthlyRes.json();
      const topProductsData = await topProductsRes.json();

      setSummary(summaryData);
      setStatusReports(statusData);
      setDailySales(dailyData);
      setMonthlySales(monthlyData);
      setTopProducts(topProductsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGeneratingReport(true);
    try {
      const params = new URLSearchParams();
      if (reportParams.start_date) params.append('start_date', reportParams.start_date);
      if (reportParams.end_date) params.append('end_date', reportParams.end_date);
      if (reportParams.status) params.append('status', reportParams.status);
      
      const response = await fetch(`${API_BASE}/report?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to generate report');
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error('Failed to fetch report:', err);
      alert('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportToCSV = (data?: ReportData) => {
    const reportToExport = data || reportData;
    if (!reportToExport || !reportToExport.orders || reportToExport.orders.length === 0) return;
    
    const headers = ['Product Name', 'Qty', 'Customer Name', 'Phone Number', 'Amount', 'Date'];
    const csvData = reportToExport.orders.flatMap((order: OrderItem) => 
      order.products.map(product => [
        product.product_name,
        product.qty,
        order.customer?.name || 'N/A',
        order.customer?.phone || 'N/A',
        product.total_price,
        order.date?.split(' ')[0] || 'N/A'
      ])
    );
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = (data?: ReportData) => {
    const reportToExport = data || reportData;
    if (!reportToExport || !reportToExport.orders || reportToExport.orders.length === 0) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to export PDF');
      return;
    }
    
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #D73D32; margin-bottom: 10px; }
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
        .summary-card { padding: 15px; border: 1px solid #ddd; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; }
        .summary-card p { margin: 0; font-size: 18px; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #f5f5f5; padding: 10px; text-align: left; font-size: 12px; color: #666; }
        td { padding: 10px; border-bottom: 1px solid #eee; font-size: 12px; }
      </style>
    `;
    
    const content = `
      <h1>Sales Report</h1>
      <div class="summary">
        <div class="summary-card">
          <h3>Total Orders</h3>
          <p>${formatNumber(reportToExport.total_orders)}</p>
        </div>
        <div class="summary-card">
          <h3>Total Sales</h3>
          <p>${formatCurrency(reportToExport.total_sales)}</p>
        </div>
        <div class="summary-card">
          <h3>Total Qty</h3>
          <p>${formatNumber(reportToExport.total_qty)}</p>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Qty</th>
            <th>Customer Name</th>
            <th>Phone Number</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${reportToExport.orders.flatMap((order: OrderItem) => 
            order.products.map(product => `
              <tr>
                <td>${product.product_name}</td>
                <td>${product.qty}</td>
                <td>${order.customer?.name || '—'}</td>
                <td>${order.customer?.phone || '—'}</td>
                <td>${formatCurrency(product.total_price)}</td>
                <td>${order.date?.split(' ')[0] || '—'}</td>
              </tr>
            `)
          ).join('')}
        </tbody>
      </table>
    `;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sales Report - ${new Date().toISOString().split('T')[0]}</title>
          ${styles}
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatMonth = (monthString: string) => {
    if (!monthString) return '—';
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    if (isNaN(date.getTime())) return monthString;
    return date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
      packed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
      shipment: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
      process: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
      processing: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-600/20',
      cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
      delivery: 'bg-green-50 text-green-700 ring-1 ring-green-600/20',
      printing: 'bg-orange-50 text-orange-700 ring-1 ring-orange-600/20',
    };
    return colors[status.toLowerCase()] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return <Clock className="w-3.5 h-3.5" />;
      case 'delivery': return <Truck className="w-3.5 h-3.5" />;
      case 'cancelled': return <Ban className="w-3.5 h-3.5" />;
      default: return <CheckCircle2 className="w-3.5 h-3.5" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Order Status Distribution', icon: ShoppingCart },
    { id: 'trends', label: 'Sales Performance Trends', icon: TrendingUp },
    { id: 'reports', label: 'Custom Report', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#D73D32] animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading sales data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Data</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchAllData}
            className="px-6 py-2.5 rounded-xl text-white font-medium transition-all hover:shadow-lg transform hover:scale-[1.02]"
            style={{ backgroundColor: '#D73D32' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl shadow-md" style={{ backgroundColor: '#D73D32' }}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#2d4863' }}>
                  Sales Analytics
                </h1>
                <p className="text-gray-500 mt-1">Track performance and uncover insights</p>
              </div>
            </div>
            <button
              onClick={fetchAllData}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <SummaryCard
              title="Total Orders"
              value={formatNumber(summary.total_orders)}
              icon={ShoppingBag}
              color="#D73D32"
              trend="+12%"
            />
            <SummaryCard
              title="Total Sales"
              value={formatCurrency(summary.total_sales)}
              icon={DollarSign}
              color="#10B981"
              trend="+8%"
            />
            <SummaryCard
              title="Avg Order Value"
              value={formatCurrency(summary.average_order_value)}
              icon={TrendingUp}
              color="#3B82F6"
              trend="+5%"
            />
            <SummaryCard
              title="Delivery Charges"
              value={formatCurrency(summary.total_delivery_charge)}
              icon={Truck}
              color="#F59E0B"
              trend="-2%"
            />
            <SummaryCard
              title="Units Sold"
              value={formatNumber(summary.total_units_sold)}
              icon={Package}
              color="#8B5CF6"
              trend="+15%"
            />
            <SummaryCard
              title="Unique Products"
              value={formatNumber(summary.total_unique_products)}
              icon={Layers}
              color="#EC4899"
              trend="+3"
            />
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-1 p-1 bg-gray-300 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white shadow-sm text-gray-800'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Overview Tab - Status Distribution & Top Products */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Distribution */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h2 className="text-lg font-semibold" style={{ color: '#2d4863' }}>
                    Order Status Pipeline
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/30">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {statusReports.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                              {getStatusIcon(item.status)}
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-right font-semibold" style={{ color: '#2d4863' }}>
                            {formatNumber(item.total_orders)}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-right text-gray-700">
                            {formatCurrency(item.total_sales)}
                          </td>
                          <td className="px-6 py-3.5 whitespace-nowrap text-right text-gray-500">
                            {formatNumber(item.total_units_sold)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold" style={{ color: '#2d4863' }}>
                      Top Products
                    </h2>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                  {topProducts.map((product, idx) => (
                    <div key={product.product_id} className="p-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-gray-800 truncate max-w-[120px]">
                            {product.product_name}
                          </span>
                        </div>
                        <span className="text-base font-bold" style={{ color: '#D73D32' }}>
                          {formatCurrency(product.total_sales)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 ml-9">
                        <span>{formatNumber(product.total_orders)} orders</span>
                        <span>{formatCurrency(product.average_price)} avg</span>
                      </div>
                    </div>
                  ))}
                  {topProducts.length === 0 && (
                    <div className="p-8 text-center text-gray-400">No product data available</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                <h2 className="text-lg font-semibold" style={{ color: '#2d4863' }}>
                  Sales Performance Trends
                </h2>
                <div className="flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setTrendView('daily')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      trendView === 'daily'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                    Daily
                  </button>
                  <button
                    onClick={() => setTrendView('monthly')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      trendView === 'monthly'
                        ? 'bg-white shadow-sm text-gray-800'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 inline mr-1.5" />
                    Monthly
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {trendView === 'daily' ? 'Date' : 'Month'}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(trendView === 'daily' ? dailySales : monthlySales).map((item, idx) => {
                      const avgOrder = item.total_orders > 0 ? item.total_sales / item.total_orders : 0;
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3 font-medium text-gray-700 whitespace-nowrap">
                            {trendView === 'daily' 
                              ? formatDate((item as DailySales).sale_date)
                              : formatMonth((item as MonthlySales).month)
                            }
                          </td>
                          <td className="px-6 py-3 text-right text-gray-600">{formatNumber(item.total_orders)}</td>
                          <td className="px-6 py-3 text-right font-semibold" style={{ color: '#D73D32' }}>
                            {formatCurrency(item.total_sales)}
                          </td>
                          <td className="px-6 py-3 text-right text-gray-500">{formatNumber(item.total_units_sold)}</td>
                          <td className="px-6 py-3 text-right text-gray-500">{formatCurrency(avgOrder)}</td>
                          <td className="px-6 py-3 text-left text-xs text-gray-400 truncate max-w-[200px]">
                            {item.product_names || '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 p-6 bg-gray-50/50">
                <h2 className="text-lg font-semibold mb-4" style={{ color: '#2d4863' }}>
                  Generate Custom Report
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={reportParams.start_date}
                      onChange={(e) => setReportParams({ ...reportParams, start_date: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={reportParams.end_date}
                      onChange={(e) => setReportParams({ ...reportParams, end_date: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Order Status</label>
                    <select
                      value={reportParams.status}
                      onChange={(e) => setReportParams({ ...reportParams, status: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D73D32]/20 focus:border-[#D73D32] transition-all"
                    >
                      <option value="">All Statuses</option>
                      {statusReports.map((s) => (
                        <option key={s.status} value={s.status}>{s.status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={generateReport}
                      disabled={generatingReport}
                      className="w-full px-4 py-2 rounded-xl text-white font-medium transition-all hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                      style={{ backgroundColor: '#D73D32' }}
                    >
                      {generatingReport ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Filter className="w-4 h-4" />
                      )}
                      {generatingReport ? 'Generating...' : 'Generate Report'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Results */}
              {reportData && (
                <div className="p-6">
                  {/* Summary & Export */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Orders</p>
                        <p className="text-xl font-bold text-gray-800">{formatNumber(reportData.total_orders)}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Sales</p>
                        <p className="text-xl font-bold" style={{ color: '#D73D32' }}>{formatCurrency(reportData.total_sales)}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Total Qty</p>
                        <p className="text-xl font-bold text-gray-800">{formatNumber(reportData.total_qty)}</p>
                      </div>
                    </div>
                    
                    {/* Export Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportToPDF()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        Export PDF
                      </button>
                      <button
                        onClick={() => exportToCSV()}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <FileSpreadsheet className="w-4 h-4" />
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-100">
                      <ShoppingBag className="w-4 h-4 text-gray-500" />
                      <h3 className="font-medium text-gray-700">Order Details</h3>
                      <span className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                        {reportData.orders?.length || 0} orders found
                      </span>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Delivery</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Products</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {reportData.orders && reportData.orders.length > 0 ? (
                            reportData.orders.map((order: OrderItem) => (
                              <tr key={order.order_id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-4 py-3">
                                  <span className="text-sm font-mono text-gray-600">
                                    {order.order_number || order.order_id.slice(0, 8)}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold" style={{ color: '#D73D32' }}>
                                  {formatCurrency(order.final_amount)}
                                </td>
                                <td className="px-4 py-3 text-right text-sm text-gray-500">
                                  {formatCurrency(order.delivery_charge)}
                                </td>
                                <td className="px-4 py-3">
                                  <div>
                                    <span className="text-sm text-gray-700">{order.customer?.name || '—'}</span>
                                    {order.customer?.phone && (
                                      <span className="text-xs text-gray-400 block">{order.customer.phone}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex flex-wrap gap-1">
                                    {order.products && order.products.length > 0 ? (
                                      order.products.map((product, pIdx) => (
                                        <span key={pIdx} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                          {product.product_name} ({product.qty})
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-xs text-gray-400">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {order.date?.split(' ')[0]}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                                No orders found for the selected criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  trend?: string;
}

function SummaryCard({ title, value, icon: Icon, color, trend }: SummaryCardProps) {
  const isPositiveTrend = trend?.startsWith('+');
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md hover:border-gray-200 cursor-default">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
            {isPositiveTrend ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-xl font-bold mb-0.5" style={{ color: '#2d4863' }}>{value}</p>
      <p className="text-xs text-gray-400">{title}</p>  
    </div>
  );
}