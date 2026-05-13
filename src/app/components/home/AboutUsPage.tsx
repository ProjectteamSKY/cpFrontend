import {
  ArrowRight,
  Award,
  Brush,
  CheckCircle,
  Clock3,
  Headphones,
  Medal,
  MoveRight,
  Package,
  Palette,
  Printer,
  Shield,
  Sparkles,
  Star,
  Truck,
  Users,
} from "lucide-react";

// Fixed import path - make sure the image exists at this path or update accordingly
// Using a reliable placeholder image from Unsplash that represents a print shop
// const aboutUsImage = "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80";
import aboutUsImage from "../../../media/about_1.png";
export default function AboutUsPage() {
  const stats = [
    { number: '10+', label: 'Years Experience', icon: Clock3 },
    { number: '50K+', label: 'Orders Delivered', icon: Package },
    { number: '15K+', label: 'Happy Customers', icon: Users },
    { number: '24/7', label: 'Customer Support', icon: Headphones },
  ];

  const values = [
    {
      title: 'Premium Quality',
      description: 'We use high-end printing technology and premium materials to ensure exceptional print quality for every order.',
      icon: Award,
    },
    {
      title: 'Fast Delivery',
      description: 'Quick turnaround times with secure packaging and reliable delivery across India.',
      icon: Truck,
    },
    {
      title: 'Creative Design',
      description: 'Professional design support for business cards, banners, brochures, and custom branding materials.',
      icon: Palette,
    },
    {
      title: 'Trusted Service',
      description: 'Thousands of businesses trust Citizen Prints for consistent quality and customer satisfaction.',
      icon: Shield,
    },
  ];

  const services = [
    { title: 'Business Cards', icon: Printer },
    { title: 'Visiting Cards', icon: Sparkles },
    { title: 'Brochures', icon: Brush },
    { title: 'Flyers & Posters', icon: Palette },
    { title: 'Banners & Flex Printing', icon: Package },
    { title: 'ID Cards', icon: Shield },
    { title: 'Custom Packaging', icon: Truck },
    { title: 'Corporate Printing Solutions', icon: Users },
  ];

  const reasons = [
    'Premium quality printing materials',
    'Fast and reliable delivery service',
    'Affordable pricing for every business',
    'Creative customization options',
    'Trusted customer support',
  ];

  return (
    <div className="h-full bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gray-50 border-b border-gray-100 h-full md:h-[500px]">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={aboutUsImage} 
            alt="About Citizen Prints - Professional printing services" 
            className="w-full object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.style.backgroundColor = '#1a2a3a';
                parent.style.backgroundImage = 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)';
              }
            }}
          />

        </div>
       
      </section>

      {/* Stats Section */}
      <section className="-mt-6 relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 p-6 text-center hover:border-red-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-red-600 mb-1">
                {stat.number}
              </h3>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 font-medium text-xs uppercase tracking-wide mb-5">
              Our Story
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
              Building Brands Through
              <span className="text-red-600"> Creative Printing</span>
            </h2>
            <p className="text-sm text-gray-600 leading-7 mb-4">
              Founded with a vision to provide affordable and premium printing
              services, Citizen Prints has grown into one of the trusted printing
              brands serving businesses, startups, and individuals across India.
            </p>
            <p className="text-sm text-gray-600 leading-7 mb-6">
              From elegant visiting cards to large-scale branding materials, we
              combine modern printing technology with expert craftsmanship to
              deliver products that leave a lasting impression.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-red-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                  <Star className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  Modern Equipment
                </h4>
                <p className="text-xs text-gray-500 leading-5">
                  Advanced digital and offset printing technology for vibrant results.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-red-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mb-3">
                  <Medal className="w-4 h-4 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  Expert Team
                </h4>
                <p className="text-xs text-gray-500 leading-5">
                  Dedicated professionals focused on creativity and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 lg:p-10">
              <h3 className="text-xl font-bold mb-6">
                Why Customers Choose Us
              </h3>
              <div className="space-y-3">
                {reasons.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white border border-gray-100 rounded-lg p-3 hover:border-red-200 transition-all duration-300"
                  >
                    <div className="w-5 h-5 rounded bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600 leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 font-medium text-xs uppercase tracking-wide mb-4">
              Our Core Values
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              What Makes Us Different
            </h2>
            <p className="text-sm text-gray-500 leading-7">
              We focus on innovation, quality, and customer satisfaction to
              deliver printing solutions that elevate your brand identity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 border border-gray-100 hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-all duration-300">
                  <value.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-white transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-500 group-hover:text-white/80 leading-6 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 font-medium text-xs uppercase tracking-wide mb-5">
                Our Services
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">
                Complete Printing
                <span className="block text-red-600">Solutions</span>
              </h2>
              <p className="text-sm text-gray-600 leading-7 mb-6">
                We offer a wide range of printing services for businesses,
                educational institutions, events, and personal branding.
              </p>
              <button className="group px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium text-white text-sm flex items-center gap-2">
                View All Products
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-lg p-4 hover:border-red-200 hover:bg-white transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-red-600 shrink-0 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300">
                      <service.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {service.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#2d4863] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-[#2d4863] rounded-2xl p-10 lg:p-14 text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              Ready to Print Your Ideas?
            </h2>
            <p className="text-sm text-red-100 leading-7 max-w-xl mx-auto mb-8">
              Get premium quality printing with fast delivery and affordable
              pricing. Let Citizen Prints bring your brand to life.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="px-5 py-2.5 rounded-lg bg-white text-red-600 font-semibold text-sm hover:scale-105 transition-all duration-200 flex items-center gap-2 group">
                Start Your Order
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-5 py-2.5 rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm font-semibold text-sm hover:bg-white/20 transition-all duration-200">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}