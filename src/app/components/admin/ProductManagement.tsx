import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function ProductManagement() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const products = [
    { 
      id: 1, 
      name: "Business Cards", 
      category: "Cards", 
      basePrice: 299, 
      stock: "In Stock",
      active: true,
      orders: 456
    },
    { 
      id: 2, 
      name: "Brochures - A4", 
      category: "Marketing", 
      basePrice: 499, 
      stock: "In Stock",
      active: true,
      orders: 234
    },
    { 
      id: 3, 
      name: "Vinyl Banner", 
      category: "Banners", 
      basePrice: 799, 
      stock: "Low Stock",
      active: true,
      orders: 189
    },
    { 
      id: 4, 
      name: "Promotional Flyers", 
      category: "Marketing", 
      basePrice: 199, 
      stock: "In Stock",
      active: false,
      orders: 167
    },
  ];

  const pricingMatrix = [
    { size: "Standard (90x50mm)", matte: 0, glossy: 50, premium: 150 },
    { size: "Large (100x60mm)", matte: 200, glossy: 250, premium: 350 },
    { size: "Custom", matte: 300, glossy: 350, premium: 450 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your printing products and pricing</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#1A1A1A]">Add New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="product-name">Product Name *</Label>
                <Input id="product-name" placeholder="Enter product name" className="mt-1 bg-white border-gray-200" />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select>
                  <SelectTrigger id="category" className="mt-1 bg-white border-gray-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cards">Cards</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                    <SelectItem value="stickers">Stickers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="base-price">Base Price (₹) *</Label>
                <Input id="base-price" type="number" placeholder="299" className="mt-1 bg-white border-gray-200" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter product description" className="mt-1 bg-white border-gray-200" rows={4} />
              </div>
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
                  Save Product
                </Button>
                <Button variant="outline" className="flex-1 border-gray-200" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products Table */}
      <Card className="bg-white shadow-sm border-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#1A1A1A]">All Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#EFEFEF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Base Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Total Orders</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#1A1A1A]">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-semibold text-[#1A1A1A]">₹{product.basePrice}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock === "In Stock" 
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{product.orders}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2">
                      {product.active ? (
                        <>
                          <Eye className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500 font-medium">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-blue-50">
                        <Edit className="w-4 h-4 text-[#D73D32]" />
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-red-50">
                        <Trash2 className="w-4 h-4 text-[#D73D32]" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pricing Matrix */}
      <Card className="bg-white p-6 shadow-sm border-0">
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Dynamic Pricing Configuration</h2>
        <p className="text-sm text-gray-600 mb-6">Configure pricing based on attributes for Business Cards</p>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200">
            <thead>
              <tr className="bg-[#EFEFEF]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A] border-r border-gray-200">
                  Size
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#1A1A1A] border-r border-gray-200">
                  Matte Paper
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#1A1A1A] border-r border-gray-200">
                  Glossy Paper
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-[#1A1A1A]">
                  Premium Cardstock
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingMatrix.map((row, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-3 font-medium text-[#1A1A1A] border-r border-gray-200">
                    {row.size}
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    <Input 
                      type="number" 
                      value={row.matte} 
                      className="w-24 mx-auto text-center bg-white border-gray-200"
                    />
                  </td>
                  <td className="px-4 py-3 text-center border-r border-gray-200">
                    <Input 
                      type="number" 
                      value={row.glossy} 
                      className="w-24 mx-auto text-center bg-white border-gray-200"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Input 
                      type="number" 
                      value={row.premium} 
                      className="w-24 mx-auto text-center bg-white border-gray-200"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-3 mt-6">
          <Button className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
            Save Pricing
          </Button>
          <Button variant="outline" className="border-gray-200">
            Reset to Default
          </Button>
        </div>
      </Card>
    </div>
  );
}
