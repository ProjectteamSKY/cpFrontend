// components/WhyUs.tsx
import { SectionHeader } from "./SectionHeader";
import {
  ArrowRight,
  Package,
  Zap,
  Brush,
  TrendingUp,
  Shield,
  Clock,
  Truck,
  BadgePercent,
  HeartHandshake,
  Star,
  Award,
  CheckCircle,
  Sparkles,
  Crown,
  Gem,
  BarChart3,
  Users,
  ThumbsUp,
  Layers,
  LayoutTemplate,
  Mail,
  PhoneCall,
  Calendar,
  ChevronRight,
  CircleCheck,
  Gift,
  Flame,
  BadgeCheck,
  Microscope,
  Globe,
  Coffee,
  Smile,
} from "lucide-react";

const OFFERS = [
  {
    icon: Package,
    title: "Bulk Order Savings",
    desc: "Save up to 40% on bulk orders with our volume pricing. Perfect for businesses and large events.",
    pill: "Up to 40% OFF",
    statValue: "50,000+",
    statLabel: "Businesses Served",
    gradient: "from-amber-50 to-white",
    iconBg: "bg-[#D73D32] text-[#D73D32] group-hover:bg-amber-500",
  },
  {
    icon: Zap,
    title: "Express 24hr Printing",
    desc: "Get professional prints ready within 24 hours with our priority rush processing service.",
    pill: "Same Day Available",
    statValue: "98%",
    statLabel: "On-Time Delivery",
    gradient: "from-amber-50 to-white",
    iconBg: "bg-[#D73D32] text-[#D73D32] group-hover:bg-amber-500",
  },
  {
    icon: Brush,
    title: "Free Design Support",
    desc: "Professional design assistance included free. Get print-ready files crafted by experts.",
    pill: "Worth ₹499 FREE",
    statValue: "10,000+",
    statLabel: "Designs Created",
    gradient: "from-amber-50 to-white",
    iconBg: "bg-[#D73D32] text-[#D73D32] group-hover:bg-amber-500",
  },
];

const ADDITIONAL_FEATURES = [
  { icon: Shield, title: "Quality Guaranteed", desc: "Premium materials & precision printing", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Clock, title: "24-48hr Turnaround", desc: "Fast production & pan-India shipping", color: "text-sky-600", bg: "bg-sky-50" },
  { icon: Truck, title: "Free Shipping", desc: "On orders above ₹999", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: BadgePercent, title: "Best Price Promise", desc: "Price match guarantee", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: HeartHandshake, title: "Satisfaction Guarantee", desc: "100% money back guarantee", color: "text-rose-600", bg: "bg-rose-50" },
  { icon: TrendingUp, title: "Business Solutions", desc: "Dedicated account manager", color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Layers, title: "Premium Materials", desc: "Eco-friendly & luxury options", color: "text-gray-600", bg: "bg-gray-100" },
  { icon: LayoutTemplate, title: "Custom Templates", desc: "Professional designs ready", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Globe, title: "Pan India Network", desc: "6 strategic locations", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Coffee, title: "Dedicated Support", desc: "24/7 expert assistance", color: "text-orange-600", bg: "bg-orange-50" },
];

const STATS = [
  { value: "50,000+", label: "Happy Customers", icon: Users, color: "from-indigo-500 to-indigo-600" },
  { value: "98%", label: "Customer Satisfaction", icon: ThumbsUp, color: "from-emerald-500 to-emerald-600" },
  { value: "10+", label: "Years of Excellence", icon: Award, color: "from-amber-500 to-amber-600" },
  { value: "24hr", label: "Express Delivery", icon: Zap, color: "from-rose-500 to-rose-600" },
];

const TRUST_BADGES = [
  { icon: BadgeCheck, text: "Top Rated Seller", color: "text-amber-600" },
  { icon: Microscope, text: "Quality Tested", color: "text-emerald-600" },
];

export function WhyUs() {
  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50/30 to-white">
      {/* Premium background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D73D32]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#D73D32]/[0.02] via-transparent to-transparent rounded-full blur-2xl" />
      </div>

      {/* Hero Section with Stats */}
      <div className="relative mb-24">
        <div className="text-center max-w-4xl mx-auto px-4 mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D73D32]/10 to-amber-500/10 px-5 py-2 rounded-full mb-6 backdrop-blur-sm border border-white/50 shadow-sm">
            <Crown size={14} className="text-[#D73D32]" />
            <span className="text-xs font-bold text-[#D73D32] uppercase tracking-wider">The Premium Choice</span>
          </div> */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] mb-8 tracking-tight">
            India's Most Trusted
            <span className="block p-3 text-transparent bg-clip-text bg-gradient-to-r from-[#D73D32] to-[#D73D32]">
              Printing Partner
            </span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ discerning businesses that trust us for uncompromising quality, 
            lightning-fast delivery, and white-glove service.
          </p>
        </div>

        {/* Stats Grid - Enhanced */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {STATS.map((stat, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-100 hover:border-[#D73D32]/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div className="text-3xl font-bold text-[#1A1A1A] mb-1 tracking-tight">{stat.value}</div>
                <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      {/* Main Offers Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 mb-28">
        {OFFERS.map((offer, idx) => (
          <div
            key={offer.title}
            className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
            style={{
              boxShadow: '0 20px 35px -12px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.02)',
            }}
          >
            {/* Premium gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${offer.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl border border-gray-100 group-hover:border-[#D73D32]/40 transition-colors duration-500" />
            
            {/* Top accent bar with animation */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D73D32] via-amber-400 to-[#D73D32] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
            
            <div className="relative p-8 z-10">
              {/* Pill Badge with shine */}
              <div className="mb-6">
                <span className="inline-block text-xs font-bold text-[#D73D32] bg-[#D73D32]/10 px-4 py-2 rounded-full backdrop-blur-sm group-hover:bg-[#D73D32]/20 transition-colors">
                  {offer.pill}
                </span>
              </div>

              {/* Icon with premium styling */}
              <div className="mb-7">
                <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${offer.iconBg} transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl`}>
                  <offer.icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#D73D32] transition-colors">
                {offer.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {offer.desc}
              </p>

              {/* Stat with divider */}
              <div className="pt-5 border-t border-gray-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-[#1A1A1A]">{offer.statValue}</span>
                    <span className="text-xs text-gray-400 ml-1">+</span>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{offer.statLabel}</span>
                </div>
              </div>

              {/* CTA with icon */}
              <button className="mt-6 text-sm font-semibold text-gray-500 group-hover:text-[#D73D32] flex items-center gap-1 transition-all">
                Discover more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Features Showcase - Expanded Grid */}
      <div className="relative mb-28">
        <div className="text-center max-w-3xl mx-auto px-4 mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-50 to-[#D73D32]/10 px-5 py-2 rounded-full mb-5">
            <Gem size={14} className="text-[#D73D32]" />
            <span className="text-xs font-bold text-[#D73D32] uppercase tracking-wider">Exclusive Features</span>
          </div> */}
          <h3 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">
            Everything You Need to <span className="text-[#D73D32]">Succeed</span>
          </h3>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Comprehensive printing solutions with premium features designed for your business growth
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
          {ADDITIONAL_FEATURES.map((feature, idx) => (
            <div
              key={feature.title}
              className="group text-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#D73D32]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative mb-5">
                <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-xl ${feature.bg} group-hover:bg-[#D73D32] transition-all duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color} group-hover:text-white transition-colors duration-300`} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#D73D32] to-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-base font-bold text-[#1A1A1A] mb-2">{feature.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Trust Section - Enhanced */}
     

      {/* Premium CTA - Elevated */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 p-12 md:p-16 mx-4 shadow-xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#D73D32]/5 via-transparent to-amber-500/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D73D32]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D73D32]/10 to-amber-500/10 px-4 py-2 rounded-full mb-5">
              <Flame size={14} className="text-[#D73D32]" />
              <span className="text-xs font-bold text-[#D73D32]">Limited Time Offer</span>
            </div>
            <h4 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4 tracking-tight">Ready to Get Started?</h4>
            <p className="text-gray-500 text-lg max-w-md mx-auto md:mx-0">Get 20% off your first order + free design support worth ₹499</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
              <div className="flex items-center gap-1 text-sm text-gray-500"><CircleCheck size={14} className="text-[#D73D32]" /> No setup fees</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><CircleCheck size={14} className="text-[#D73D32]" /> Free design consultation</div>
              <div className="flex items-center gap-1 text-sm text-gray-500"><CircleCheck size={14} className="text-[#D73D32]" /> Priority support</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-bold hover:bg-[#D73D32] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              <span>Start Your Order Now</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-[#1A1A1A] rounded-full font-bold hover:bg-gray-200 transition-all duration-300">
              <PhoneCall size={18} />
              <span>Call Expert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating trust badge */}
      
    </div>
  );
}