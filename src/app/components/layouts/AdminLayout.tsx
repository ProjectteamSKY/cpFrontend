// import { Outlet, Link, useLocation } from "react-router";
// import { LayoutDashboard, Package, ShoppingBag, FileCheck, Receipt, LogOut } from "lucide-react";
// import { Button } from "../ui/button";

// export function AdminLayout() {
//   const location = useLocation();

//   const navItems = [
//     { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
//     // { path: "/admin/products", icon: Package, label: "Products" },
//     // { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
//     // { path: "/admin/file-review", icon: FileCheck, label: "File Review" },
//     // { path: "/admin/invoices", icon: Receipt, label: "Invoices" },
//     { path: "/admin/Category", icon: Receipt, label: "Category" },
//     { path: "/admin/Papertype", icon: Receipt, label: "PaperType" },
//     { path: "/admin/Cuttype", icon: Receipt, label: "CutType" },
//     { path: "/admin/Printtype", icon: Receipt, label: "PrintType" },
//     { path: "/admin/SizeType", icon: Receipt, label: "SizeType" },
//     { path: "/admin/product", icon: Receipt, label: "products" },
//     { path: "/admin/productVarient", icon: Receipt, label: "productsVarient" },
//     { path: "/admin/productDiscount", icon: Receipt, label: "productDiscount" },
//     { path: "/admin/productVarientPrice", icon: Receipt, label: "productVarientPrice" },
//     { path: "/admin/productSetup", icon: Receipt, label: "productSetup" },
//     { path: "/admin/Order", icon: Receipt, label: "Order" },









//     // { path: "/admin/SubCategory", icon: Receipt, label: "SubCategory"},
//   ];

//   return (
//     <div className="min-h-screen flex bg-[#fffff]">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-lg h-screen sticky top-0">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <div className="w-10 h-10 rounded-lg bg-[#D73D32] flex items-center justify-center">
//               <span className="text-white font-bold text-xl">CP</span>
//             </div>
//             <div>
//               <div className="text-lg font-bold text-[#1A1A1A]">Citizen Prints</div>
//               <div className="text-xs text-gray-500">Admin Panel</div>
//             </div>
//           </div>
//         </div>

//         <nav className="p-4 space-y-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             const isActive = location.pathname === item.path;
//             return (
//               <Link
//                 key={item.path}
//                 to={item.path}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
//                   ? "bg-[#D73D32] text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//                   }`}
//               >
//                 <Icon className="w-5 h-5" />
//                 <span>{item.label}</span>
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
//           <Button variant="ghost" className="w-full justify-start text-gray-700">
//             <LogOut className="w-5 h-5 mr-3" />
//             Logout
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
// <main className="flex-1 overflow-auto">
//   <div className="max-w-[1440px] mx-auto p-8">
//     <Outlet />
//   </div>
// </main>
//     </div>
//   );
// }


import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileCheck,
  Receipt,
  LogOut,
  Users,
  Settings,
  BarChart3
} from "lucide-react";
import { Button } from "../ui/button";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/product", icon: Package, label: "Products" },
    { path: "/admin/productVarient", icon: ShoppingBag, label: "Variants" },
    { path: "/admin/productVarientPrice", icon: ShoppingBag, label: "productVarientPrice" },
    { path: "/admin/productSetup", icon: ShoppingBag, label: "productSetup" },


    { path: "/admin/productDiscount", icon: Receipt, label: "Discounts" },
    { path: "/admin/Category", icon: Users, label: "Categories" },
    { path: "/admin/Papertype", icon: FileCheck, label: "Paper Types" },
    { path: "/admin/Cuttype", icon: BarChart3, label: "Cut Types" },
    { path: "/admin/Printtype", icon: Settings, label: "Print Types" },
    { path: "/admin/SizeType", icon: Settings, label: "Sizes" },
    { path: "/admin/Order", icon: ShoppingBag, label: "Orders" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* User-Friendly Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0">
        {/* Improved Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">CP</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-gray-900 truncate">Citizen Prints</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* User-Friendly Navigation */}
        <nav className="p-4 mt-2 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-base tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Improved Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <Button
            variant="ghost"
            className="
              w-full h-14 justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 
              hover:shadow-md transition-all duration-200 rounded-xl px-4 text-base font-semibold
              border border-gray-200 hover:border-gray-300
            "
          >
            <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>Sign Out</span>
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
