import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-full border-2 border-gray-200 hover:border-[#D73D32] hover:bg-[#D73D32] hover:text-white transition-all disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <Button
                key={i}
                variant={currentPage === pageNum ? "default" : "outline"}
                onClick={() => onPageChange(pageNum)}
                className={`rounded-full min-w-[44px] h-11 font-semibold transition-all ${
                  currentPage === pageNum 
                    ? "bg-gradient-to-r from-[#D73D32] to-[#B83227] hover:from-[#B83227] hover:to-[#9A2A1F] shadow-lg" 
                    : "border-2 border-gray-200 hover:border-[#D73D32]"
                }`}
              >
                {pageNum}
              </Button>
            );
          } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
            return <span key={i} className="px-2 text-gray-400">...</span>;
          }
          return null;
        })}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-full border-2 border-gray-200 hover:border-[#D73D32] hover:bg-[#D73D32] hover:text-white transition-all disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
};