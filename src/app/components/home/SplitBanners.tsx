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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-transform duration-700 group-hover:scale-110" />
        
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />
        
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
          
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white no-underline group-hover:gap-3 transition-all duration-300"
          >
            Get a Quote 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Banner B - Express Printing */}
      <div
        className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[200px] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-2xl"
        onClick={() => navigate("/products")}
      >
        {/* Background Gradient with Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-red-900 transition-transform duration-700 group-hover:scale-110" />
        
        {/* Animated Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all duration-500" />
        
        {/* Animated Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
        </div>
        
        {/* Icon with Animation */}
        <div className="absolute right-6 top-6 text-6xl opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
          
        </div>
        
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
            <span className="bg-gradient-to-r from-yellow-300 to-red-400 bg-clip-text text-transparent">
              Express Printing
            </span>
          </div>
          
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white no-underline group-hover:gap-3 transition-all duration-300"
          >
            Order Now 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// Optional: Add a third banner for more impact
export function EnhancedSplitBanners() {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      title: "Order 1000+ pcs",
      subtitle: "Save 40%",
      description: "Bulk Orders Welcome",
      icon: "📦",
      iconAlt: "🚚",
      gradient: "from-gray-900 via-gray-800 to-gray-900",
      accent: "from-yellow-400 to-orange-500",
      buttonText: "Get a Quote",
      path: "/products",
      tag: "Bulk Orders",
      badge: "Save Big",
    },
    {
      id: 2,
      title: "Same-Day",
      subtitle: "Express Printing",
      description: "Rush Printing Available",
      icon: "⚡",
      iconAlt: "⚡",
      gradient: "from-red-900 via-red-800 to-red-900",
      accent: "from-yellow-300 to-red-400",
      buttonText: "Order Now",
      path: "/products",
      tag: "Express Service",
      badge: "24h Rush",
    },
    {
      id: 3,
      title: "Custom Design",
      subtitle: "Free Consultation",
      description: "Expert Design Support",
      icon: "🎨",
      iconAlt: "✨",
      gradient: "from-purple-900 via-purple-800 to-purple-900",
      accent: "from-purple-400 to-pink-500",
      buttonText: "Learn More",
      path: "/services",
      tag: "Design Services",
      badge: "Free Quote",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[220px] flex flex-col justify-end p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
          onClick={() => navigate(banner.path)}
        >
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${banner.gradient} transition-transform duration-700 group-hover:scale-110`} />
          
          {/* Animated Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
          
          {/* Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-semibold text-white/80">
              {banner.badge}
            </div>
          </div>
          
          {/* Icon with Animation */}
          <div className="absolute right-6 top-6 text-7xl opacity-20 group-hover:opacity-30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            {banner.icon}
          </div>
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-white/40 rounded-full" />
              <div className="text-xs font-semibold tracking-wider uppercase text-white/60">
                {banner.tag}
              </div>
            </div>
            
            <div className="text-2xl font-bold text-white leading-tight mb-2">
              {banner.title}
              <br />
              <span className={`bg-gradient-to-r ${banner.accent} bg-clip-text text-transparent`}>
                {banner.subtitle}
              </span>
            </div>
            
            <div className="text-sm text-white/70 mb-4">
              {banner.description}
            </div>
            
            <Link
              to={banner.path}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white no-underline group-hover:gap-3 transition-all duration-300"
            >
              {banner.buttonText}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SplitBanners;