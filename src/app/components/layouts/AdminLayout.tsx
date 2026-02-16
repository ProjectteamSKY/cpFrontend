import { Outlet, Link, useLocation } from "react-router";
import { LayoutDashboard, Package, ShoppingBag, FileCheck, Receipt, LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/file-review", icon: FileCheck, label: "File Review" },
    { path: "/admin/invoices", icon: Receipt, label: "Invoices" },
  ];

  return (  
    <div className="min-h-screen flex bg-[#fffff]">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#D73D32] flex items-center justify-center">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <div>
              <div className="text-lg font-bold text-[#1A1A1A]">Citizen Prints</div>
              <div className="text-xs text-gray-500">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#D73D32] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-700">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1440px] mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
