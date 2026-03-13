// components/product/ProductFilter.tsx
import React, { useEffect, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { FilterState, ProductFiltersProps } from "../../types/productlist";
import { getAllCategories } from "../../service/categoryApiService";
import { getAllSizesActive } from "../../service/sizeApiService";
import { getAllPaperTypesActive } from "../../service/paperTypeApiService";
import { getAllCutTypesActive } from "../../service/cutTypeApiService";

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  searchQuery,
  showFilters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onPriceRangeChange,
  onApplyFilters,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [paperTypes, setPaperTypes] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      const cats = await getAllCategories();
      setCategories(cats.map((c: any) => c.name));

      const sz = await getAllSizesActive();
      setSizes(sz.map((s: any) => s.name));

      const papers = await getAllPaperTypesActive();
      setPaperTypes(papers.map((p: any) => p.name));

      const cuts = await getAllCutTypesActive();
      setFinishes(cuts.map((f: any) => f.name));
    };

    fetchFilters();
  }, []);

  const handleCheckboxChange = (filterType: keyof FilterState, value: string) => {
    const arrayFilters: (keyof FilterState)[] = [
      "categories",
      "sizes",
      "paperTypes",
      "finishes",
    ];
    if (!arrayFilters.includes(filterType)) return;
    onFilterChange(filterType, value);
  };

  return (
    <aside
      className={`lg:w-80 flex-shrink-0 transition-all duration-300 ${
        showFilters ? "block" : "hidden lg:block"
      }`}
    >
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
            <Label className="mb-3 block text-sm font-semibold text-gray-700">
              Search Products
            </Label>
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
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Filter Sections */}
          {[
            { title: "Category", key: "categories", items: categories },
            { title: "Size", key: "sizes", items: sizes },
            { title: "Paper Type", key: "paperTypes", items: paperTypes },
            { title: "Finish", key: "finishes", items: finishes },
          ].map((section) => {
            type ArrayFilterKeys = "categories" | "sizes" | "paperTypes" | "finishes";
            const key = section.key as ArrayFilterKeys;
            const selectedItems = filters[key];

            return (
              <div className="mb-6" key={section.key}>
                <Label className="mb-3 block text-sm font-semibold text-gray-700">
                  {section.title}
                </Label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {section.items.map((item: string) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`${key}-${item}`}
                        checked={selectedItems.includes(item)}
                        onCheckedChange={() => handleCheckboxChange(key, item)}
                        className="border-gray-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#D73D32] data-[state=checked]:to-[#B83227] data-[state=checked]:border-0"
                      />
                      <label
                        htmlFor={`${key}-${item}`}
                        className="text-sm text-gray-700 cursor-pointer hover:text-[#D73D32] font-medium"
                      >
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Price Range */}
          <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl">
            <Label className="mb-3 block text-sm font-semibold text-gray-700">
              Price Range
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) =>
                  onPriceRangeChange(
                    parseInt(e.target.value || "0", 10),
                    filters.priceRange[1]
                  )
                }
                className="flex-1 bg-white border-gray-200 text-center rounded-lg"
              />
              <div className="w-8 h-0.5 bg-gradient-to-r from-[#D73D32] to-[#B83227] rounded-full"></div>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onPriceRangeChange(
                    filters.priceRange[0],
                    parseInt(e.target.value || "0", 10) || 10000
                  )
                }
                className="flex-1 bg-white border-gray-200 text-center rounded-lg"
              />
            </div>
          </div>

          {/* Apply button (optional) */}
          {onApplyFilters && (
            <Button
              type="button"
              onClick={onApplyFilters}
              className="w-full mt-6 bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Apply Filters
            </Button>
          )}
        </div>
      </Card>
    </aside>
  );
};
