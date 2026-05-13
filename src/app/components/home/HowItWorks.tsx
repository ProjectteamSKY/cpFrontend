// components/HowItWorks.tsx

import {
  CheckCircle,
  Upload,
  Printer,
  Truck,
  ArrowRight,
  Star,
  Shield,
  Clock3,
  Sparkles,
} from "lucide-react";

const STEPS = [
  {
    n: "01",
    t: "Choose Product",
    d: "Explore premium print products tailored for businesses, events, and creators.",
    icon: CheckCircle,
    iconBg: "bg-[#D73D32]",
    badge: "100+ Products",
  },
  {
    n: "02",
    t: "Upload Artwork",
    d: "Upload your artwork or customize professional templates in minutes.",
    icon: Upload,
    iconBg: "bg-[#EC7063]",
    badge: "500+ Templates",
  },
  {
    n: "03",
    t: "We Print It",
    d: "Advanced printing technology ensures vibrant colors and premium finishing.",
    icon: Printer,
    iconBg: "bg-[#2d4863]",
    badge: "Premium Quality",
  },
  {
    n: "04",
    t: "Fast Delivery",
    d: "Quick dispatch with live tracking delivered safely to your doorstep.",
    icon: Truck,
    iconBg: "bg-[#F4A261]",
    badge: "24-48h Delivery",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Background */}
     
    
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D73D32]/10 text-[#D73D32] text-sm font-semibold mb-5">
            <Sparkles size={14} />
            Simple Process
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#2d4863] leading-tight">
            How It
            <span className="block text-[#D73D32] mt-2">
              Works
            </span>
          </h2>

          <p className="mt-6 text-gray-600 text-base md:text-lg leading-relaxed">
            From product selection to doorstep delivery — our streamlined workflow makes premium printing fast and effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {STEPS.map((step, index) => (
            <div key={step.n} className="relative group">
              {/* Connector */}
              {index !== STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full z-0">
                  <div className="w-[calc(100%-30px)] h-[2px] bg-gray-200 relative">
                    <div className="absolute inset-0 bg-[#D73D32]/30" />
                  </div>

                  <ArrowRight
                    size={18}
                    className="absolute -right-2 -top-[8px] text-[#D73D32]"
                  />
                </div>
              )}

              <div className="relative z-10 h-full rounded-3xl bg-white border border-gray-200 p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                {/* Hover Accent */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                  <div className="absolute inset-0 bg-[#D73D32]/[0.03]" />
                </div>

                {/* Number */}
                <div className="absolute top-5 right-5 text-5xl font-black text-gray-100 group-hover:text-[#D73D32]/10 transition-colors duration-500">
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className={`relative w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}
                >
                  <step.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={1.7}
                  />
                </div>

                {/* Content */}
                <div className="mt-7 relative z-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-[#2d4863] mb-4">
                    {step.badge}
                  </div>

                  <h3 className="text-2xl font-bold text-[#2d4863] group-hover:text-[#D73D32] transition-colors duration-300">
                    {step.t}
                  </h3>

                  <p className="mt-4 text-gray-600 leading-7 text-sm">
                    {step.d}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#D73D32] transition-all duration-500 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-gray-600">
              Trusted by 10,000+ Businesses
            </span>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={14}
                  className="fill-[#F4A261] text-[#F4A261]"
                />
              ))}
            </div>

            <span className="text-sm font-medium text-gray-600">
              4.9/5 Customer Rating
            </span>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm">
            <Clock3 size={15} className="text-[#EC7063]" />

            <span className="text-sm font-medium text-gray-600">
              24-48 Hour Delivery
            </span>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-gray-200 shadow-sm">
            <Shield size={15} className="text-[#2d4863]" />

            <span className="text-sm font-medium text-gray-600">
              Satisfaction Guaranteed
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="group inline-flex items-center gap-3 rounded-full bg-[#D73D32] px-8 py-4 text-white font-semibold shadow-xl transition-all duration-300 hover:bg-[#c53329] hover:-translate-y-1">
            Start Your Order

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-5 text-sm text-gray-500">
            Free professional design assistance included with every order.
          </p>
        </div>
      </div>
    </section>
  );
}