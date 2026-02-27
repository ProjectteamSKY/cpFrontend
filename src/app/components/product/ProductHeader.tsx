import React from "react";
import { Package, Printer } from "lucide-react";
import { Badge } from "../ui/badge";

export const ProductHeader: React.FC = () => {
  return (
    <div className="mb-8 relative rounded-3xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32] via-[#B83227] to-[#9A2A1F]"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <Package className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">Premium Printing Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-lg">
              Discover Excellence
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-2xl leading-relaxed">
              Transform your ideas into stunning prints with our premium collection
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Badge className="bg-white/90 text-[#D73D32] hover:bg-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                🚚 Free Shipping
              </Badge>
              <Badge className="bg-white/90 text-[#D73D32] hover:bg-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                ⚡ 24h Dispatch
              </Badge>
              <Badge className="bg-white/90 text-[#D73D32] hover:bg-white border-0 px-4 py-2 text-sm font-semibold shadow-lg">
                ✓ Quality Guaranteed
              </Badge>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
              <Printer className="w-32 h-32 text-white/30 relative z-10" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </div>
  );
};