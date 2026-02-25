import React from "react";
import { Printer } from "lucide-react";
import { Button } from "../ui/button";

interface ProductEmptyStateProps {
  onClearFilters: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32]/20 to-[#B83227]/20 rounded-full blur-2xl"></div>
        <Printer className="w-20 h-20 text-gray-300 relative z-10" />
      </div>
      <h3 className="text-2xl font-bold text-gray-700 mb-3">No products found</h3>
      <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
      <Button 
        onClick={onClearFilters}
        className="bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] text-white rounded-full px-8 shadow-lg"
      >
        Clear All Filters
      </Button>
    </div>
  );
};