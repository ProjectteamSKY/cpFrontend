// components/Footer.tsx
import { Link } from "react-router";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  CreditCard,
  Shield,
  Truck,
  Award,
  ChevronRight
} from "lucide-react";

const PRODUCTS = [
  { name: "Business Cards", path: "/products/business-cards" },
  { name: "Brochures", path: "/products/brochures" },
  { name: "Banners", path: "/products/banners" },
  { name: "Flyers", path: "/products/flyers" },
  { name: "Posters", path: "/products/posters" },
  { name: "ID Cards", path: "/products/id-cards" },
  { name: "Stickers", path: "/products/stickers" }
];

const COMPANY = [
  { name: "About Us", path: "/about" },
  { name: "Bulk Orders", path: "/bulk-orders" },
  { name: "Design Services", path: "/design-services" },
  { name: "Blog", path: "/blog" },
  { name: "Careers", path: "/careers" },
  { name: "Affiliates", path: "/affiliates" }
];

const SUPPORT = [
  { name: "Track Order", path: "/track-order" },
  { name: "FAQ", path: "/faq" },
  { name: "Shipping Info", path: "/shipping" },
  { name: "Return Policy", path: "/returns" },
  { name: "Contact Us", path: "/contact" },
  { name: "WhatsApp Chat", path: "/whatsapp", external: true }
];


const UpiIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-6 h-6"
    fill="none"
  >
    <path
      d="M3 17L8 7H11L6 17H3Z"
      fill="#0056B3"
    />
    <path
      d="M10 17L15 7H18L13 17H10Z"
      fill="#0056B3"
    />
    <circle cx="20" cy="15" r="2" fill="#FF6F00" />
  </svg>
);

const GPayIcon = () => (
  <svg viewBox="0 0 48 48" className="w-6 h-6">
    <path fill="#4285F4" d="M24 9.5c3.1 0 5.9 1.2 8 3.1l6-6C34.5 2.3 29.6 0 24 0 14.6 0 6.6 5.4 2.6 13.3l7 5.4C11.5 13 17.3 9.5 24 9.5z"/>
    <path fill="#34A853" d="M46.5 24.5c0-1.7-.2-3.3-.5-4.8H24v9.1h12.7c-.5 2.9-2.2 5.4-4.7 7l7.3 5.6c4.2-3.9 6.7-9.7 6.7-16.9z"/>
  </svg>
);

const PaytmIcon = () => (
  <svg viewBox="0 0 100 40" className="w-10 h-5">
    <text x="0" y="25" fill="#00BAF2" fontSize="20" fontWeight="bold">
      Paytm
    </text>
  </svg>
);

const PAYMENT_METHODS = [
  { name: "UPI", icon:  <UpiIcon /> },
  { name: "Google Pay", icon: <GPayIcon /> },
  { name: "Paytm", icon: <PaytmIcon /> },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" }
];

const FEATURES = [
  { icon: Truck, text: "Free Shipping on orders above ₹999" },
  { icon: Award, text: "Premium Quality Guaranteed" },
  { icon: Clock, text: "24-48 Hours Express Delivery" },
  { icon: Shield, text: "100% Secure Payments" }
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800 mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Citizen Prints
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Your trusted print partner across India. Premium quality prints, 
              fast delivery, and unbeatable prices since 2015.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <Phone size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
                <Mail size={16} className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-sm">hello@citizenprints.in</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={16} className="text-red-500" />
                <span className="text-sm">Chennai, Tamil Nadu, India</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-500 rounded-full"></span>
              Products
            </h3>
            <ul className="space-y-2.5">
              {PRODUCTS.map((product, idx) => (
                <li key={idx}>
                  <Link
                    to={product.path}
                    className="text-gray-400 text-sm hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {product.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-500 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-2.5">
              {COMPANY.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-gray-400 text-sm hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-500 rounded-full"></span>
              Support
            </h3>
            <ul className="space-y-2.5">
              {SUPPORT.map((item, idx) => (
                <li key={idx}>
                  {item.external ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 text-sm hover:text-red-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        {item.name}
                      </span>
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      className="text-gray-400 text-sm hover:text-red-500 transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        {item.name}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                  <feature.icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </div>
                <span className="text-gray-400 text-sm group-hover:text-white transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright - Dynamic Year */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-xs">
                © {currentYear} Citizen Prints. All rights reserved. Made with 
                <span className="text-red-500 mx-1">❤️</span> 
                in Tamil Nadu
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PAYMENT_METHODS.map((method, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 bg-gray-800 rounded-lg flex items-center gap-2 border border-gray-700 hover:border-red-500 transition-colors group"
                >
                  <span className="text-sm">{method.icon}</span>
                  <span className="text-gray-400 text-xs font-medium group-hover:text-white transition-colors">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Trust Badge */}
         
          </div>
        </div>
      </div>
    </footer>
  );
}