// components/SplitBanners.tsx
import { Link, useNavigate } from "react-router";
import { ArrowRight, TrendingUp, Zap, Shield, Truck } from "lucide-react";

export function SplitBanners() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-5 mb-8 max-sm:grid-cols-1">
      {/* Banner A - Bulk Orders */}
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[200px] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-2xl"
        onClick={() => navigate("/products")}
      >
        {/* Background Gradient with Animation */}
        <div className="absolute inset-0 bg-[#2d4863]" />
        
        {/* Animated Overlay */}
        
        {/* Decorative Elements */}
    
        {/* Icon with Animation */}
        <div className="absolute right-6 top-6 text-6xl opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
          
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-white/60" />
            <div className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Bulk Orders Welcome
            </div>
          </div>
          
          <div className="text-2xl font-bold text-white leading-tight mb-3">
            Order 1000+ pcs
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Save 40%
            </span>
          </div>
          
         
        </div>
      </div>

      {/* Banner B - Express Printing */}
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[200px] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-2xl"
        onClick={() => navigate("/products")}
      >
        {/* Background Gradient with Animation */}
        <div className="absolute inset-0 bg-[#D73D32]" />
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-white/60" />
            <div className="text-xs font-semibold tracking-wider uppercase text-white/60">
              Rush Printing Available
            </div>
          </div>
          
          <div className="text-2xl font-bold text-white leading-tight mb-3">
            Same-Day
            <br />
            <span className="bg-yellow-300 bg-clip-text text-transparent">
              Express Printing
            </span>
          </div>
          
         
        </div>
      </div>
    </div>
  );
}

