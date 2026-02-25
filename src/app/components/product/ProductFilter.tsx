import React from "react";
import { SlidersHorizontal, Search, X, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { FilterState } from "../../types/productlist";
import { CATEGORIES, SIZES, PAPER_TYPES, FINISHES } from "../../constants/productconstants";

interface ProductFiltersProps {
  filters: FilterState;
  searchQuery: string;
  showFilters: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  onPriceRangeChange: (min: number, max: number) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  searchQuery,
  showFilters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onPriceRangeChange
}) => {
  return (
    <aside className={`lg:w-80 flex-shrink-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <Card className="bg-white p-6 sticky top-24 shadow-xl border-0 rounded-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D73D32]/10 to-transparent rounded-bl-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#D73D32] to-[#B83227] rounded-lg">
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Filters</h2>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-[#D73D32] hover:text-[#D73D32]/80 hover:bg-[#D73D32]/10 rounded-full font-semibold"
            >
              Clear
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Label className="mb-3 block text-sm font-semibold text-gray-700">Search Products</Label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#D73D32] transition-colors" />
              <Input
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-10 bg-gray-50 border-gray-200 focus:border-[#D73D32] focus:ring-[#D73D32] rounded-xl h-12 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <Label className="mb-3 block text-sm font-semibold text-gray-700">Category</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {CATEGORIES.map((category) => (
                <div key={category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    id={`cat-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => onFilterChange('categories', category)}
                    className="border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#D73D32] data-[state=checked]:to-[#B83227] data-[state=checked]:border-0"
                  />
                  <label htmlFor={`cat-${category}`} className="text-sm text-gray-700 cursor-pointer hover:text-[#D73D32] font-medium flex-1">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
            <Label className="mb-3 block text-sm font-semibold text-gray-700">Price Range</Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0]}
                  onChange={(e) => onPriceRangeChange(parseInt(e.target.value) || 0, filters.priceRange[1])}
                  className="bg-white border-gray-200 text-center rounded-lg"
                />
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#D73D32] to-[#B83227] rounded-full"></div>
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1]}
                  onChange={(e) => onPriceRangeChange(filters.priceRange[0], parseInt(e.target.value) || 10000)}
                  className="bg-white border-gray-200 text-center rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="space-y-4">
            {[
              { title: "Size", items: SIZES, key: 'sizes' },
              { title: "Paper Type", items: PAPER_TYPES, key: 'paperTypes' },
              { title: "Finish", items: FINISHES, key: 'finishes' }
            ].map((section) => (
              <details key={section.key} className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Label className="text-sm font-semibold text-gray-700 cursor-pointer">{section.title}</Label>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-2 space-y-2 pl-2">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      {/* <Checkbox 
                        id={`${section.key}-${item}`}
                        checked={filters[section.key as keyof FilterState].includes(item)}
                        onCheckedChange={() => onFilterChange(section.key as keyof FilterState, item)}
                        className="border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#D73D32] data-[state=checked]:to-[#B83227] data-[state=checked]:border-0"
                      /> */}
                      <label htmlFor={`${section.key}-${item}`} className="text-sm text-gray-700 cursor-pointer hover:text-[#D73D32] font-medium">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <Button 
            className="w-full mt-6 bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Apply Filters
          </Button>
        </div>
      </Card>
    </aside>
  );
};