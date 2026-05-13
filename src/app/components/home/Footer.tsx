// components/Footer.tsx
import { Link } from "react-router";
import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Shield,
  Truck,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";

import googlepaylogog from "../../../media/icons8-google-pay-50.svg";
import paytm from "../../../media/icons8-paytm-50.svg";
import phonepe from "../../../media/icons8-phone-pe-50.svg";

interface ProductItem {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  subcategory: {
    id: string;
    name: string;
  };
}

const COMPANY = [
  { name: "About Us", path: "/about" },
  // { name: "Bulk Orders", path: "/bulk-orders" },
  { name: "Design Services", path: "/design-services" },
];

const SUPPORT = [
  { name: "Track Order", path: "/MyProfile" },
  { name: "Return Policy", path: "/return-policy" },
  { name: "Contact Us", path: "/contact" },
];

const PAYMENT_METHODS = [
  {
    name: "Google Pay",
    icon: googlepaylogog,
  },
  {
    name: "Paytm",
    icon: paytm,
  },
  {
    name: "PhonePe",
    icon: phonepe,
  },
];


export function Footer() {
  const currentYear = new Date().getFullYear();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/product/footer/minimal"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch footer products");
      }

      const data = await response.json();

      setProducts(data.products || []);
    } catch (error) {
      console.error("Footer product fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#2d4863] border-t border-white/10 mt-16 overflow-hidden">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
       

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-[#D73D32] flex items-center justify-center shadow-lg shadow-red-500/20">
                <span className="text-white font-bold text-xl">C</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Citizen Prints
                </h2>

                <p className="text-xs text-gray-400">
                  Premium Printing Solutions
                </p>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-7 mb-6 max-w-md">
              Your trusted print partner across India. Premium quality prints,
              fast delivery, and unbeatable prices since 2015.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-7">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#D73D32] transition-all duration-300">
                  <Phone
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>

                <span className="text-sm">+91 89393 93993</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#D73D32] transition-all duration-300">
                  <Mail
                    size={16}
                    className="group-hover:scale-110 transition-transform"
                  />
                </div>

                <span className="text-sm">citizenprints@gmail.com</span>
              </div>

              <div className="flex items-center gap-3 text-gray-300 group">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin size={16} />
                </div>

                <span className="text-sm">Chennai, Tamil Nadu, India</span>
              </div>
            </div>

            {/* Social Links */}
            
          </div>

          {/* Dynamic Products */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D73D32] rounded-full"></span>
              Products
            </h3>

            {loading ? (
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Loader2 className="animate-spin" size={16} />
                Loading products...
              </div>
            ) : (
              <ul className="space-y-3">
                {products.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.id}`}
                      className="text-gray-300 text-sm hover:text-white transition-colors flex items-start gap-2 group"
                    >
                      <ChevronRight
                        size={13}
                        className="text-[#EC7063] opacity-0 -translate-x-1 mt-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0"
                      />

                      <div className="group-hover:translate-x-1 transition-transform">
                        <p className="leading-5">{product.name}</p>

                        <p className="text-xs text-gray-500 mt-1">
                          {product.category?.name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D73D32] rounded-full"></span>
              Company
            </h3>

            <ul className="space-y-3">
              {COMPANY.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-gray-300 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={13}
                      className="text-[#EC7063] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />

                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#D73D32] rounded-full"></span>
              Support
            </h3>

            <ul className="space-y-3">
              {SUPPORT.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-gray-300 text-sm hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight
                      size={13}
                      className="text-[#EC7063] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />

                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#24384d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">
                © {currentYear} Citizen Prints. All rights reserved. Made with
                 in Tamil Nadu
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {PAYMENT_METHODS.map((method, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={method.icon}
                    alt={method.name}
                    className="h-6 w-auto object-contain"
                  />

                  <span className="text-[#2d4863] text-xs font-semibold whitespace-nowrap">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}