import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileCheck,
  Receipt,
  LogOut,
  Users,
  Settings,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/product", icon: Package, label: "Products" },
    { path: "/admin/productVarient", icon: ShoppingBag, label: "Variants" },
    { path: "/admin/productVarientPrice", icon: ShoppingBag, label: "Variant Prices" },
    { path: "/admin/productSetup", icon: ShoppingBag, label: "Product Setup" },
    { path: "/admin/productDiscount", icon: Receipt, label: "Discounts" },
    { path: "/admin/Category", icon: Users, label: "Categories" },
    { path: "/admin/Papertype", icon: FileCheck, label: "Paper Types" },
    { path: "/admin/Cuttype", icon: BarChart3, label: "Cut Types" },
    { path: "/admin/Printtype", icon: Settings, label: "Print Types" },
    { path: "/admin/SizeType", icon: Settings, label: "Sizes" },
    { path: "/admin/Order", icon: ShoppingBag, label: "Orders" },
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
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


// import { Outlet, Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingBag,
//   FileCheck,
//   Receipt,
//   LogOut,
//   Users,
//   Settings,
//   BarChart3,
//   ChevronRight
// } from "lucide-react";
// import { Button } from "../ui/button";
// import { useState, useEffect } from "react";

// export function AdminLayout() {
//   const location = useLocation();
//   const [isHovered, setIsHovered] = useState(false);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   // Load saved sidebar preference
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const saved = localStorage.getItem("sidebar-collapsed");
//       if (saved === "true") setIsHovered(false);
//       else setIsHovered(true);
//     }
//   }, []);

//   const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

// const navItems = [
//   { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
//   { path: "/admin/product", icon: Package, label: "Products" },
//   { path: "/admin/productVarient", icon: ShoppingBag, label: "Variants" },
//   { path: "/admin/productVarientPrice", icon: ShoppingBag, label: "Variant Prices" },
//   { path: "/admin/productSetup", icon: ShoppingBag, label: "Product Setup" },
//   { path: "/admin/productDiscount", icon: Receipt, label: "Discounts" },
//   { path: "/admin/Category", icon: Users, label: "Categories" },
//   { path: "/admin/Papertype", icon: FileCheck, label: "Paper Types" },
//   { path: "/admin/Cuttype", icon: BarChart3, label: "Cut Types" },
//   { path: "/admin/Printtype", icon: Settings, label: "Print Types" },
//   { path: "/admin/SizeType", icon: Settings, label: "Sizes" },
//   { path: "/admin/Order", icon: ShoppingBag, label: "Orders" },
// ];

//   const isActive = (path: string) => location.pathname === path;
//   const sidebarWidth = isHovered ? "w-64" : "w-20";
//   const mainMargin = isHovered ? "lg:ml-64" : "lg:ml-20";

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* Mobile overlay */}
//       {isMobileSidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 lg:hidden"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed lg:sticky inset-y-0 left-0 z-50 bg-white shadow-lg border-r border-gray-200 h-screen
//           ${sidebarWidth} transition-all duration-500 ease-out
//           ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
//           overflow-y-auto
//           scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400
//         `}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-20 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-md flex-shrink-0">
//             <span className="text-white font-bold text-xl">CP</span>
//           </div>
//           <div className={`${isHovered ? "block ml-1" : "hidden lg:block"} min-w-0 flex-1`}>
//             <h1 className="text-xl font-bold text-gray-900 truncate">Citizen Prints</h1>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-4 mt-2 flex-1">
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.path}
//                   to={item.path}
//                   onClick={closeMobileSidebar}
//                   className={`
//                     flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
//                     ${isActive(item.path)
//                       ? "bg-primary text-white shadow-lg scale-[1.02]"
//                       : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-[1.01]"
//                     }
//                     ${!isHovered ? "justify-center gap-0" : ""}
//                   `}
//                 >
//                   <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
//                   <span className={`${isHovered ? "block" : "hidden"} font-semibold text-base tracking-tight whitespace-nowrap`}>
//                     {item.label}
//                   </span>
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-100 shrink-0 sticky bottom-0 bg-white">
//           <Button
//             variant="ghost"
//             className={`
//               w-full h-14 justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 
//               hover:shadow-lg transition-all duration-300 rounded-xl px-4 text-base font-semibold
//               border border-gray-200 hover:border-gray-300 scale-100 hover:scale-[1.02]
//               ${!isHovered ? "justify-center" : ""}
//             `}
//           >
//             <LogOut className="w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
//             <span className={`${isHovered ? "block" : "hidden"}`}>Sign Out</span>
//           </Button>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ease-out ${mainMargin}`}>
//         {/* Mobile toggle */}
//         <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center sticky top-0 z-10">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsMobileSidebarOpen(true)}
//             className="mr-2 p-2 hover:bg-gray-100 hover:shadow-md rounded-xl transition-all duration-200"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </Button>
//           <h1 className="text-xl font-bold text-gray-900">Citizen Prints Admin</h1>
//         </div>

//         <main className="flex-1 min-h-0 overflow-auto bg-gray-50 w-full h-full">
//           <div className="w-full px-8 py-8 mx-auto max-h-screen">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }