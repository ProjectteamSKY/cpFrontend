import React from "react";
import { Filter, Grid3x3, List, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { SORT_OPTIONS } from "../../constants/productconstants";

interface ProductToolbarProps {
  totalProducts: number;
  searchQuery: string;
  viewMode: 'grid' | 'list';
  sortBy: string;
  showFilters: boolean;
  onToggleFilters: () => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortChange: (value: string) => void;
  onClearSearch: () => void;
}

export const ProductToolbar: React.FC<ProductToolbarProps> = ({
  totalProducts,
  searchQuery,
  viewMode,
  sortBy,
  showFilters,
  onToggleFilters,
  onViewModeChange,
  onSortChange,
  onClearSearch
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 bg-white p-5 rounded-2xl shadow-lg">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFilters}
          className="lg:hidden"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
          <span className="text-sm text-gray-600">
            <span className="font-bold text-[#D73D32]">{totalProducts}</span> Products
          </span>
        </div>
        
        {searchQuery && (
          <Badge variant="outline" className="border-[#D73D32] text-[#D73D32] bg-[#D73D32]/5">
            <Search className="w-3 h-3 mr-1" />
            "{searchQuery}"
            <X className="w-3 h-3 ml-2 cursor-pointer" onClick={onClearSearch} />
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
        
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-56 bg-white border-gray-200 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};