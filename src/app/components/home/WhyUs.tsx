// components/WhyUs.tsx
import {
  ArrowRight,
  Package,
  Zap,
  Brush,
} from "lucide-react";

import bulkimage from "../../../media/bulk_order.png";
import expressimage from "../../../media/express_printing.png";
import designimage from "../../../media/design_support.png";

const OFFERS = [
  {
    icon: Package,
    title: "Bulk Order Savings",
    desc: "Save up to 40% on bulk orders with exclusive volume pricing for brands, events, and growing businesses.",
    pill: "Up to 40% OFF",
    statValue: "50K+",
    statLabel: "Businesses Served",
    iconBg: "bg-[#D73D32]",
  },
  {
    icon: Zap,
    title: "Express 24hr Printing",
    desc: "Need it urgently? Get premium quality prints delivered with ultra-fast turnaround support.",
    pill: "Same Day Available",
    statValue: "98%",
    statLabel: "On-Time Delivery",
    iconBg: "bg-[#2d4863]",
  },
  {
    icon: Brush,
    title: "Free Design Support",
    desc: "Our expert designers help create professional print-ready artwork at no additional cost.",
    pill: "Worth ₹499 FREE",
    statValue: "10K+",
    statLabel: "Designs Created",
    iconBg: "bg-[#F4A261]",
  },
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20 bg-white">
      {/* Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#D73D32]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#F4A261]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 md:mb-16">
          <span className="inline-flex items-center rounded-full bg-[#D73D32]/10 px-4 py-2 text-sm font-semibold text-[#D73D32] mb-5">
            Trusted Printing Solutions
          </span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#2d4863]">
            India’s Most Trusted
            <span className="block mt-2 text-[#D73D32]">
              Printing Partner
            </span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Premium quality printing, lightning-fast delivery, and unmatched customer support trusted by thousands of businesses across India.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Top Border */}
              <div className="absolute top-0 left-0 h-1 w-full bg-[#D73D32]" />

              <div className="relative z-10 p-7 lg:p-8">
                {/* Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center rounded-full bg-[#D73D32]/10 px-4 py-2 text-xs font-bold tracking-wide text-[#D73D32]">
                    {offer.pill}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${offer.iconBg} flex items-center justify-center shadow-md transition-transform duration-500 group-hover:scale-110`}
                >
                  <offer.icon
                    className="w-8 h-8 text-white"
                    strokeWidth={1.8}
                  />
                </div>

                {/* Content */}
                <div className="mt-7">
                  <h3 className="text-2xl font-bold text-[#2d4863] group-hover:text-[#D73D32] transition-colors">
                    {offer.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {offer.desc}
                  </p>
                </div>

                {/* Stats */}
                <div className="mt-7 border-t border-gray-100 pt-5 flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-[#2d4863]">
                      {offer.statValue}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {offer.statLabel}
                    </div>
                  </div>

                  <button className="flex items-center gap-2 text-sm font-semibold text-[#D73D32] transition-all group-hover:gap-3">
                    Learn More
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}   