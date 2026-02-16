import { useState } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export function ProductListingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, name: "Business Cards", category: "Cards", price: 299, image: "business cards", popular: true },
    { id: 2, name: "Brochures - A4", category: "Marketing", price: 499, image: "brochure" },
    { id: 3, name: "Vinyl Banner", category: "Banners", price: 799, image: "banner" },
    { id: 4, name: "Promotional Flyers", category: "Marketing", price: 199, image: "flyer" },
    { id: 5, name: "Poster - A3", category: "Posters", price: 349, image: "poster" },
    { id: 6, name: "Custom Stickers", category: "Stickers", price: 149, image: "stickers" },
    { id: 7, name: "Letterheads", category: "Stationery", price: 399, image: "letterhead" },
    { id: 8, name: "Certificates", category: "Documents", price: 249, image: "certificate" },
    { id: 9, name: "Wedding Cards", category: "Cards", price: 899, image: "wedding card", popular: true },
  ];

  const categories = ["All", "Cards", "Marketing", "Banners", "Posters", "Stickers", "Stationery", "Documents"];
  const sizes = ["A4", "A3", "A5", "Custom"];
  const paperTypes = ["Matte", "Glossy", "Premium"];
  const finishes = ["Standard", "Laminated", "UV Coated"];

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Our Products</h1>
        <p className="text-gray-600">Browse our complete range of printing services</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-72 flex-shrink-0">
          <Card className="bg-white p-6 sticky top-24 shadow-md border-0">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="w-5 h-5 text-[#D73D32]" />
              <h2 className="text-lg font-semibold text-[#1A1A1A]">Filters</h2>
            </div>

            {/* Search */}
            <div className="mb-6">
              <Label className="mb-2 block">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <Label className="mb-3 block">Category</Label>
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox id={category} />
                    <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <Label className="mb-3 block">Size</Label>
              <div className="space-y-3">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <Checkbox id={size} />
                    <label htmlFor={size} className="text-sm text-gray-700 cursor-pointer">
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Paper Type Filter */}
            <div className="mb-6">
              <Label className="mb-3 block">Paper Type</Label>
              <div className="space-y-3">
                {paperTypes.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <Checkbox id={type} />
                    <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Finish Filter */}
            <div className="mb-6">
              <Label className="mb-3 block">Finish</Label>
              <div className="space-y-3">
                {finishes.map((finish) => (
                  <div key={finish} className="flex items-center gap-2">
                    <Checkbox id={finish} />
                    <label htmlFor={finish} className="text-sm text-gray-700 cursor-pointer">
                      {finish}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Range */}
            <div>
              <Label className="mb-3 block">Quantity</Label>
              <Select defaultValue="100">
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50 - 100</SelectItem>
                  <SelectItem value="100">100 - 500</SelectItem>
                  <SelectItem value="500">500 - 1000</SelectItem>
                  <SelectItem value="1000">1000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-6 bg-[#D73D32] hover:bg-[#D73D32]/90 text-white">
              Clear Filters
            </Button>
          </Card>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Sorting & Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#1A1A1A]">{products.length}</span> products
            </p>
            <Select defaultValue="popular">
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card 
                key={product.id} 
                className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 relative"
              >
                {product.popular && (
                  <div className="absolute top-4 right-4 bg-[#1A1A1A] text-white text-xs px-3 py-1 rounded-full z-10">
                    Popular
                  </div>
                )}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <Printer className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-[#D73D32] font-medium mb-1">{product.category}</div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">Starting from</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#D73D32]">₹{product.price}</span>
                    <Link to={`/product/${product.id}`}>
                      <Button 
                        className="bg-[#D73D32] hover:bg-[#D73D32]/90 text-white"
                        size="sm"
                      >
                        Customize
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
