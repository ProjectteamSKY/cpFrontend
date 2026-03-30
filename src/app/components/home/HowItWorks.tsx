// components/HowItWorks.tsx
import { SectionHeader } from "./SectionHeader";
import { CheckCircle, Upload, Printer, Truck, ArrowRight, Sparkles, Star, Shield, Zap, Clock } from "lucide-react";

const STEPS = [
  { 
    n: "01", 
    t: "Choose Product", 
    d: "Browse 100+ premium print products and select what fits your needs.",
    icon: CheckCircle,
    color: "from-[#D73D32] to-[#D73D32]/80",
    gradient: "from-[#D73D32]/10 to-transparent",
    bgColor: "bg-[#D73D32]/5",
    iconBg: "bg-[#D73D32]/10",
    borderColor: "border-[#D73D32]/20",
    delay: "0s",
    feature: "100+ Products"
  },
  { 
    n: "02", 
    t: "Upload Artwork",  
    d: "Upload your design or customize one of our 500+ free professional templates.",
    icon: Upload,
    color: "from-[#D73D32] to-[#D73D32]/80",
    gradient: "from-[#D73D32]/10 to-transparent",
    bgColor: "bg-[#D73D32]/5",
    iconBg: "bg-[#D73D32]/10",
    borderColor: "border-[#D73D32]/20",
    delay: "0.1s",
    feature: "Free Templates"
  },
  { 
    n: "03", 
    t: "We Print It",     
    d: "State-of-the-art printing with precision on premium eco-friendly materials.",
    icon: Printer,
    color: "from-[#D73D32] to-[#D73D32]/80",
    gradient: "from-[#D73D32]/10 to-transparent",
    bgColor: "bg-[#D73D32]/5",
    iconBg: "bg-[#D73D32]/10",
    borderColor: "border-[#D73D32]/20",
    delay: "0.2s",
    feature: "Eco-Friendly"
  },
  { 
    n: "04", 
    t: "Fast Delivery",   
    d: "Express shipping with real-time tracking, delivered to your door in 24–48 hours.",
    icon: Truck,
    color: "from-[#D73D32] to-[#D73D32]/80",
    gradient: "from-[#D73D32]/10 to-transparent",
    bgColor: "bg-[#D73D32]/5",
    iconBg: "bg-[#D73D32]/10",
    borderColor: "border-[#D73D32]/20",
    delay: "0.3s",
    feature: "24-48h Delivery"
  },
];

export function HowItWorks() {
  return (
    <div className="relative mb-8">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-[#D73D32]/5 rounded-3xl" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D73D32]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#D73D32]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#D73D32]/30 rounded-full blur-[1px] animate-ping" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#D73D32]/20 rounded-full blur-[1px] animate-ping" style={{ animationDelay: "1s" }} />
      
      <div className="relative bg-white rounded-3xl border border-gray-100 shadow-xl px-8 py-12 overflow-hidden backdrop-blur-sm">
        {/* Top decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D73D32] via-[#D73D32]/70 to-[#D73D32]" />
        
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#D73D32]/5 to-transparent rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#D73D32]/5 to-transparent rounded-tl-3xl" />
        
        {/* Star decorations with new color */}
        {/* <div className="absolute top-6 right-6 flex gap-0.5 opacity-20">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={20} className="fill-[#D73D32] text-[#D73D32]" />
          ))}
        </div>
        <div className="absolute bottom-6 left-6 flex gap-0.5 opacity-20 rotate-12">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={16} className="fill-[#D73D32] text-[#D73D32]" />
          ))}
        </div> */}
        
        <SectionHeader 
          title="How It Works" 
          subtitle="Simple steps to get your prints ready"
          showLink={false}
          className="relative z-10"
          titleClassName="bg-gradient-to-r from-[#D73D32] to-[#D73D32]/80 bg-clip-text text-transparent"
        />
        
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 relative z-10">
          {STEPS.map((step, index) => (
            <div
              key={step.n}
              className="group relative animate-fadeInUp"
              style={{ animationDelay: step.delay }}
            >
              {/* Enhanced connector line with animation */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 -translate-y-1/2 z-0">
                  <div className="relative w-[calc(100%-2rem)] mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32]/30 to-[#D73D32]/10 rounded-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32] to-transparent rounded-full animate-pulse" style={{ width: "0%", animation: "progress 2s ease-out forwards" }} />
                    <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D73D32] animate-bounce" style={{ animationDuration: "2s" }} />
                  </div>
                </div>
              )}
              
              <div className={`
                relative ${step.bgColor}
                rounded-2xl p-6 text-center 
                transition-all duration-500 
                hover:shadow-2xl hover:-translate-y-2
                border ${step.borderColor}
                group-hover:border-[#D73D32]/40
                overflow-hidden
                backdrop-blur-sm
              `}>
                {/* Hover gradient effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D73D32]/5 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#D73D32]/5 to-transparent" />
                </div>
                
                {/* Icon container with enhanced effects */}
                <div className="relative mb-6">
                  <div className={`
                    w-20 h-20 mx-auto rounded-2xl 
                    bg-gradient-to-br ${step.color} 
                    shadow-xl flex items-center justify-center 
                    transform transition-all duration-500 
                    group-hover:scale-110 group-hover:rotate-6
                    relative z-10
                    group-hover:shadow-[#D73D32]/30
                  `}>
                    <step.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                    
                    {/* Ripple effect on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  </div>
                  
                  {/* Enhanced step number badge */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20 border-2 border-[#D73D32]/20 group-hover:border-[#D73D32]/40 transition-all">
                    <span className="text-sm font-bold bg-gradient-to-r from-[#D73D32] to-[#D73D32]/80 bg-clip-text text-transparent">
                      {step.n}
                    </span>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-2 -left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
                    <Sparkles size={14} className="text-[#D73D32]" />
                  </div>
                </div>
                
                {/* Content with improved typography */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D73D32] transition-colors duration-300">
                    {step.t}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {step.d}
                  </p>
                  
                  {/* Feature badge */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm border border-gray-100 text-xs font-medium text-[#D73D32]">
                    <Zap size={12} className="text-[#D73D32]" />
                    {step.feature}
                  </div>
                </div>
                
                {/* Bottom indicator with gradient */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#D73D32] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-24" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced trust indicators */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 hover:bg-[#D73D32]/5 transition-all group">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 group-hover:text-[#D73D32] transition-colors">
                Trusted by 10,000+ businesses
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 hover:bg-[#D73D32]/5 transition-all group">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="fill-[#D73D32] text-[#D73D32]" />
                ))}
              </div>
              <span className="text-sm text-gray-600 group-hover:text-[#D73D32] transition-colors">
                4.9/5 Customer Rating
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 hover:bg-[#D73D32]/5 transition-all group">
              <Clock size={14} className="text-[#D73D32]" />
              <span className="text-sm text-gray-600 group-hover:text-[#D73D32] transition-colors">
                24-48 hour delivery
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-50 hover:bg-[#D73D32]/5 transition-all group">
              <Shield size={14} className="text-[#D73D32]" />
              <span className="text-sm text-gray-600 group-hover:text-[#D73D32] transition-colors">
                Satisfaction Guaranteed
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced call to action */}
        <div className="mt-10 text-center relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-96 h-20 bg-[#D73D32]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <button className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#D73D32] to-[#D73D32]/90 text-white rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 overflow-hidden">
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span>Start Your Order Now</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-[#D73D32] animate-pulse" />
            <span className="bg-gradient-to-r from-gray-600 to-[#D73D32] bg-clip-text text-transparent">
              No design? We offer free professional design assistance
            </span>
            <Sparkles size={12} className="text-[#D73D32] animate-pulse" />
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .group:hover .group-hover\\:animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}