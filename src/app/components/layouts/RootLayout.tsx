import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "../ui/button";
import { PromoBar } from "../home/PromoBar";
import { Navbar } from "../home/Navbar";
import { Footer } from "../home/Footer";

export function RootLayout() {
  const location = useLocation();
  const cartItemCount = 2; // Mock cart count
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/MyProfile");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <PromoBar />
        
        {/* Add container to Navbar wrapper */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}