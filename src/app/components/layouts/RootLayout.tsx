import { Outlet, Link, useLocation } from "react-router";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "../ui/button";

export function RootLayout() {
  const location = useLocation();
  const cartItemCount = 2; // Mock cart count

  return (
    <div className="min-h-screen flex flex-col bg-[#EFEFEF]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#D73D32] flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <span className="text-2xl font-bold text-[#1A1A1A]">Citizen Prints</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/"
                className={`text-[#1A1A1A] hover:text-[#D73D32] transition-colors ${location.pathname === '/' ? 'text-[#D73D32]' : ''}`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`text-[#1A1A1A] hover:text-[#D73D32] transition-colors ${location.pathname === '/products' ? 'text-[#D73D32]' : ''}`}
              >
                Products
              </Link>
              
              <Link
                to="/orderhistory"
                className={`text-[#1A1A1A] hover:text-[#D73D32] transition-colors ${location.pathname.includes('/order-tracking') ? 'text-[#D73D32]' : ''}`}
              >
                orderhistory
              </Link>
             
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1A1A1A] text-white text-xs rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-[1440px] mx-auto px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#D73D32] flex items-center justify-center">
                  <span className="text-white font-bold">CP</span>
                </div>
                <span className="text-xl font-bold text-[#1A1A1A]">Citizen Prints</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional printing solutions for businesses and individuals.
              </p>
              <p className="text-sm text-gray-600">
                GST: 27XXXXX1234X1Z5
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/products" className="text-sm text-gray-600 hover:text-[#D73D32]">Products</Link></li>
                <li><Link to="/order-tracking/ORD-2024-001" className="text-sm text-gray-600 hover:text-[#D73D32]">Track Order</Link></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">Pricing</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">FAQs</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">Business Cards</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">Brochures</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">Banners</a></li>
                <li><a href="#" className="text-sm text-gray-600 hover:text-[#D73D32]">Custom Printing</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-[#1A1A1A] mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-600">Email: info@citizenprints.com</li>
                <li className="text-sm text-gray-600">Phone: +91 1234567890</li>
                <li className="text-sm text-gray-600">Mon-Sat: 9:00 AM - 6:00 PM</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2026 Citizen Prints. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
