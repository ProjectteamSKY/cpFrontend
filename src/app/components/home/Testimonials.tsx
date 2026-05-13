// components/Testimonials.tsx
import { BadgeCheck, Star, ExternalLink, Quote, ArrowRight, ChevronRight, Award, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { motion } from "framer-motion";

const REVIEWS = [
  {
    stars: 5,
    text: "Ordered 500 business cards for our team. Print quality is outstanding, delivered in 2 days. Will definitely reorder!",
    name: "Sriram P.",
    role: "Operations Manager",
    company: "Dindigul Industries",
    location: "Dindigul",
    verified: true,
    avatar: "SP",
    featured: true,
  },
  {
    stars: 5,
    text: "Used them for our event banners. Colors were vibrant and sharp. The free design help saved us so much time!",
    name: "Priya S.",
    role: "Event Coordinator",
    company: "Elite Events",
    location: "Madurai",
    verified: true,
    avatar: "PS",
  },
  {
    stars: 4,
    text: "Great quality flyers at very competitive rates. Express delivery worked perfectly for our last-minute campaign.",
    name: "Arjun M.",
    role: "Marketing Head",
    company: "BrandLabs",
    location: "Coimbatore",
    verified: true,
    avatar: "AM",
  },
  {
    stars: 5,
    text: "Exceptional service! They went above and beyond to ensure our bulk order was perfect. Will be our go-to printer.",
    name: "Lakshmi N.",
    role: "Founder",
    company: "Paper Trails",
    location: "Chennai",
    verified: true,
    avatar: "LN",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function Testimonials() {
  const featuredReview = REVIEWS.find(r => r.featured) || REVIEWS[0];
  const otherReviews = REVIEWS.filter(r => !r.featured);

  return (
    <motion.div 
      className="py-16"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="What Our Customers Say" showLink={false} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Featured Review - Premium Large Card */}
          <motion.div 
            className="lg:col-span-2 group relative"
            variants={fadeInUp}
          >
            <div className="relative bg-[#2d4863] rounded-3xl p-8 text-white overflow-hidden shadow-2xl">
              {/* Animated Background Elements */}
              {/* <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" /> */}
              
              <div className="relative z-10">
                {/* Featured Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                  <Award size={14} className="text-amber-400" />
                  <span className="text-xs font-medium tracking-wide">Featured Review</span>
                </div>
                
                {/* Rating */}
                <div className="flex gap-1.5 mb-6">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={20}
                      className={`${s <= featuredReview.stars ? "fill-amber-400 text-amber-400" : "text-gray-600"} transition-transform hover:scale-110 cursor-pointer`}
                    />
                  ))}
                </div>
                
                {/* Quote Icon */}
                <Quote size={40} className="text-white/20 mb-4" />
                
                {/* Testimonial Text */}
                <h3 className="text-2xl md:text-3xl font-semibold leading-relaxed mb-8 tracking-tight">
                  "{featuredReview.text}"
                </h3>
                
                {/* Author Info */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFFFFF] to-[#FFFFFF] flex items-center justify-center text-black font-bold text-lg shadow-lg">
                        {featuredReview.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-gray-900">
                        <BadgeCheck size={12} className="text-black" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xl">{featuredReview.name}</span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {featuredReview.role}, {featuredReview.company}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                        <span>📍</span> {featuredReview.location}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Premium Stats Card */}
          <motion.div 
            className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300"
            variants={fadeInUp}
          >
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  4.9
                </div>
                <Sparkles size={20} className="absolute -top-2 -right-6 text-amber-400 animate-pulse" />
              </div>
              <div className="flex justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on 1,200+ verified reviews</p>
            </div>
            
            <div className="space-y-4 mb-8">
              {[
                { stars: 5, percentage: 98, color: "bg-green-500" },
                { stars: 4, percentage: 85, color: "bg-green-400" },
                { stars: 3, percentage: 12, color: "bg-yellow-500" },
              ].map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3 group">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium text-gray-700">{rating.stars}★</span>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`${rating.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${rating.percentage}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{rating.percentage}%</span>
                </div>
              ))}
            </div>
            
            {/* <button className="group w-full py-3 px-4 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2">
              <span>Read all {Math.floor(1200).toLocaleString()} reviews</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button> */}
            
            {/* Trust Badge */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <BadgeCheck size={14} className="text-green-500" />
                <span>All reviews are from verified customers</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Other Reviews Grid - Premium Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
          variants={staggerContainer}
        >
          {otherReviews.map((review, idx) => (
            <motion.div 
              key={idx} 
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={`${s <= review.stars ? "fill-amber-400 text-amber-400" : "text-gray-200"} transition-colors`}
                  />
                ))}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3 italic">
                "{review.text}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600 group-hover:from-amber-100 group-hover:to-purple-100 transition-all duration-300">
                    {review.avatar}
                  </div>
                  {review.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-white">
                      <BadgeCheck size={8} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{review.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{review.company}</p>
                </div>
                <ExternalLink size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap justify-center gap-8"
          variants={fadeInUp}
        >
          {[
            { label: "Verified Reviews", count: "1,200+" },
            { label: "Happy Customers", count: "5,000+" },
            { label: "5-Star Rating", count: "98%" },
          ].map((stat, idx) => (
            <div key={idx} className="text-center group">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:to-amber-600 transition-all">
                {stat.count}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}