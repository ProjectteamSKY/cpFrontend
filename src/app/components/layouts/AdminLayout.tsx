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
//   Scissors,
//   Printer,
//   Maximize2,
//   Tag,
//   ChevronRight,
//   Bell,
// } from "lucide-react";
// import { useState } from "react";

// const navGroups = [
//   {
//     label: "Overview",
//     items: [
//       { path: "/admin",       icon: LayoutDashboard, label: "Dashboard" },
//       { path: "/admin/Order", icon: ShoppingBag,     label: "Orders"    },
//     ],
//   },
//   {
//     label: "Catalogue",
//     items: [
//       { path: "/admin/product",             icon: Package,   label: "Products"       },
//       { path: "/admin/productVarient",      icon: Tag,       label: "Variants"       },
//       { path: "/admin/productVarientPrice", icon: Receipt,   label: "Variant Prices" },
//       { path: "/admin/productSetup",        icon: Settings,  label: "Product Setup"  },
//       { path: "/admin/productDiscount",     icon: BarChart3, label: "Discounts"      },
//     ],
//   },
//   {
//     label: "Configuration",
//     items: [
//       { path: "/admin/Category",  icon: Users,     label: "Categories"  },
//       { path: "/admin/Papertype", icon: FileCheck, label: "Paper Types" },
//       { path: "/admin/Cuttype",   icon: Scissors,  label: "Cut Types"   },
//       { path: "/admin/Printtype", icon: Printer,   label: "Print Types" },
//       { path: "/admin/SizeType",  icon: Maximize2, label: "Sizes"       },
//     ],
//   },
// ];

// export function AdminLayout() {
//   const location = useLocation();
//   const [collapsed, setCollapsed] = useState(false);

//   const currentLabel =
//     navGroups
//       .flatMap((g) => g.items)
//       .find((i) => i.path === location.pathname)?.label ?? "Dashboard";

//   const w = collapsed ? "72px" : "248px";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

//         html, body, #root { height: 100%; margin: 0; padding: 0; }
//         *, *::before, *::after { box-sizing: border-box; }

//         .al-root {
//           display: flex;
//           height: 100vh;
//           overflow: hidden;
//           font-family: 'DM Sans', sans-serif;
//           color: #1C1C1C;
//           background: #ffffff;
//         }

//         /* ══════════════ SIDEBAR ══════════════ */
//         .al-sidebar {
//           width: ${w};
//           height: 100vh;
//           background: #D73D32;
//           display: flex;
//           flex-direction: column;
//           flex-shrink: 0;
//           transition: width 0.26s cubic-bezier(.4,0,.2,1);
//           overflow: hidden;
//           position: relative;
//           z-index: 20;
//         }

//         /* subtle dot-grid texture */
//         .al-sidebar::after {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
//           background-size: 20px 20px;
//           pointer-events: none;
//         }

//         /* ── Logo ── */
//         .al-logo {
//           display: flex;
//           align-items: center;
//           gap: 11px;
//           padding: 0 18px;
//           height: 64px;
//           border-bottom: 1px solid rgba(255,255,255,0.07);
//           overflow: hidden;
//           white-space: nowrap;
//           flex-shrink: 0;
//           position: relative;
//           z-index: 1;
//         }
//         .al-logo-mark {
//           width: 36px;
//           height: 36px;
//           border-radius: 10px;
//           background: #D73D32;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Space Grotesk', sans-serif;
//           font-weight: 700;
//           font-size: 13px;
//           color: #fff;
//           flex-shrink: 0;
//           letter-spacing: 0.5px;
//           box-shadow: 0 2px 10px rgba(215,61,50,0.4);
//         }
//         .al-logo-text { overflow: hidden; }
//         .al-logo-name {
//           font-family: 'Space Grotesk', sans-serif;
//           font-weight: 700;
//           font-size: 14.5px;
//           color: #fff;
//           line-height: 1.2;
//           white-space: nowrap;
//         }
//         .al-logo-sub {
//           font-size: 10.5px;
//           color: rgba(255,255,255,0.35);
//           font-weight: 400;
//           letter-spacing: 0.5px;
//           white-space: nowrap;
//         }

//         /* ── Nav ── */
//         .al-nav {
//           flex: 1;
//           padding: 14px 10px;
//           overflow-y: auto;
//           overflow-x: hidden;
//           position: relative;
//           z-index: 1;
//         }
//         .al-nav::-webkit-scrollbar { width: 0; }

//         .al-group { margin-bottom: 4px; }
//         .al-group-label {
//           font-size: 9.5px;
//           font-weight: 600;
//           letter-spacing: 1.1px;
//           text-transform: uppercase;
//           color: rgba(255,255,255,0.28);
//           padding: 10px 12px 5px;
//           white-space: nowrap;
//           overflow: hidden;
//           opacity: ${collapsed ? "0" : "1"};
//           max-height: ${collapsed ? "0px" : "32px"};
//           transition: opacity 0.2s, max-height 0.22s;
//         }

//         .al-link {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 9px 12px;
//           border-radius: 9px;
//           text-decoration: none;
//           color: rgba(255,255,255,0.52);
//           font-size: 13.5px;
//           font-weight: 400;
//           white-space: nowrap;
//           transition: background 0.15s, color 0.15s;
//           position: relative;
//           margin-bottom: 1px;
//         }
//         .al-link:hover {
//           background: rgba(255,255,255,0.07);
//           color: rgba(255,255,255,0.9);
//         }
//         .al-link.active {
//           background: #fff;
//           color: #D73D32;
//           font-weight: 600;
//           box-shadow: 0 2px 10px rgba(0,0,0,0.18);
//         }
//         .al-link.active svg { color: #D73D32; }
//         .al-link svg { flex-shrink: 0; width: 16px; height: 16px; }
//         .al-link-label {
//           overflow: hidden;
//           opacity: ${collapsed ? "0" : "1"};
//           transition: opacity 0.15s;
//         }

//         .al-divider {
//           height: 1px;
//           background: rgba(255,255,255,0.07);
//           margin: 8px 12px;
//           opacity: ${collapsed ? "0" : "1"};
//           transition: opacity 0.2s;
//         }

//         /* ── Collapse ── */
//         .al-collapse-wrap {
//           padding: 0 10px 10px;
//           flex-shrink: 0;
//           position: relative;
//           z-index: 1;
//         }
//         .al-collapse-btn {
//           display: flex;
//           align-items: center;
//           justify-content: ${collapsed ? "center" : "flex-start"};
//           gap: 8px;
//           width: 100%;
//           padding: 8px 12px;
//           border-radius: 9px;
//           background: rgba(255,255,255,0.06);
//           border: 1px solid rgba(255,255,255,0.1);
//           color: rgba(255,255,255,0.4);
//           font-size: 12px;
//           font-family: 'DM Sans', sans-serif;
//           cursor: pointer;
//           white-space: nowrap;
//           overflow: hidden;
//           transition: background 0.15s, color 0.15s;
//         }
//         .al-collapse-btn:hover {
//           background: rgba(255,255,255,0.1);
//           color: rgba(255,255,255,0.75);
//         }
//         .al-collapse-btn svg {
//           flex-shrink: 0;
//           transition: transform 0.26s;
//           transform: rotate(${collapsed ? "180deg" : "0deg"});
//         }
//         .al-collapse-label {
//           overflow: hidden;
//           opacity: ${collapsed ? "0" : "1"};
//           transition: opacity 0.15s;
//         }

//         /* ── Footer ── */
//         .al-footer {
//           padding: 10px;
//           border-top: 1px solid rgba(255,255,255,0.07);
//           flex-shrink: 0;
//           position: relative;
//           z-index: 1;
//         }
//         .al-logout {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 9px 12px;
//           border-radius: 9px;
//           background: none;
//           border: none;
//           color: rgba(255,255,255,0.4);
//           font-size: 13.5px;
//           font-family: 'DM Sans', sans-serif;
//           cursor: pointer;
//           white-space: nowrap;
//           width: 100%;
//           transition: background 0.15s, color 0.15s;
//         }
//         .al-logout:hover {
//           background: rgba(215,61,50,0.15);
//           color: #ff6b62;
//         }
//         .al-logout svg { flex-shrink: 0; width: 16px; height: 16px; }
//         .al-logout-label {
//           overflow: hidden;
//           opacity: ${collapsed ? "0" : "1"};
//           transition: opacity 0.15s;
//         }

//         /* ══════════════ MAIN ══════════════ */
//         .al-main {
//           flex: 1;
//           min-width: 0;
//           display: flex;
//           flex-direction: column;
//           height: 100vh;
//           overflow: hidden;
//           background: #ffffff;
//         }

//         /* ── Topbar ── */
//         .al-topbar {
//           height: 64px;
//           background: #ffffff;
//           border-bottom: 1px solid #EBEBEB;
//           display: flex;
//           align-items: center;
//           padding: 0 28px;
//           gap: 14px;
//           flex-shrink: 0;
//         }
//         .al-breadcrumb {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 13px;
//           color: #ABABAB;
//         }
//         .al-breadcrumb-sep { width: 13px; height: 13px; color: #D4D4D4; }
//         .al-breadcrumb-current {
//           font-family: 'Space Grotesk', sans-serif;
//           font-size: 15px;
//           font-weight: 600;
//           color: #1C1C1C;
//         }
//         .al-topbar-right {
//           margin-left: auto;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }
//         .al-notif-btn {
//           width: 36px;
//           height: 36px;
//           border-radius: 9px;
//           border: 1px solid #EBEBEB;
//           background: #fff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           color: #999;
//           transition: border-color 0.15s, color 0.15s;
//           position: relative;
//         }
//         .al-notif-btn:hover { border-color: #D73D32; color: #D73D32; }
//         .al-notif-dot {
//           position: absolute;
//           top: 7px; right: 7px;
//           width: 7px; height: 7px;
//           border-radius: 50%;
//           background: #D73D32;
//           border: 1.5px solid #fff;
//         }
//         .al-avatar {
//           width: 36px;
//           height: 36px;
//           border-radius: 9px;
//           background: #D73D32;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-family: 'Space Grotesk', sans-serif;
//           font-weight: 700;
//           font-size: 12px;
//           color: #fff;
//           cursor: pointer;
//           flex-shrink: 0;
//           letter-spacing: 0.3px;
//           box-shadow: 0 2px 8px rgba(215,61,50,0.3);
//         }

//         /* ── Content / Outlet ── */
//         .al-content {
//           flex: 1;
//           overflow-y: auto;
//           overflow-x: hidden;
//           padding: 28px 32px;
//           background: #ffffff;
//         }
//         .al-content::-webkit-scrollbar { width: 5px; }
//         .al-content::-webkit-scrollbar-track { background: transparent; }
//         .al-content::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 4px; }
//         .al-content::-webkit-scrollbar-thumb:hover { background: #CACACA; }
//       `}</style>

//       <div className="al-root">

//         {/* ══ SIDEBAR ══ */}
//         <aside className="al-sidebar">

//           <div className="al-logo">
//             <div className="al-logo-mark">CP</div>
//             <div className="al-logo-text">
//               <div className="al-logo-name">Citizen Prints</div>
//               <div className="al-logo-sub">Admin Panel</div>
//             </div>
//           </div>

//           <nav className="al-nav">
//             {navGroups.map((group, gi) => (
//               <div key={group.label} className="al-group">
//                 {gi > 0 && <div className="al-divider" />}
//                 <div className="al-group-label">{group.label}</div>
//                 {group.items.map(({ path, icon: Icon, label }) => {
//                   const isActive = location.pathname === path;
//                   return (
//                     <Link
//                       key={path}
//                       to={path}
//                       className={`al-link${isActive ? " active" : ""}`}
//                     >
//                       <Icon />
//                       <span className="al-link-label">{label}</span>
//                     </Link>
//                   );
//                 })}
//               </div>
//             ))}
//           </nav>

//           <div className="al-collapse-wrap">
//             <button
//               className="al-collapse-btn"
//               onClick={() => setCollapsed((c) => !c)}
//               title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             >
//               <ChevronRight size={14} />
//               <span className="al-collapse-label">Collapse</span>
//             </button>
//           </div>

//           <div className="al-footer">
//             <button className="al-logout">
//               <LogOut />
//               <span className="al-logout-label">Logout</span>
//             </button>
//           </div>

//         </aside>

//         {/* ══ MAIN ══ */}
//         <main className="al-main">

//           <header className="al-topbar">
//             <div className="al-breadcrumb">
//               <span>Admin</span>
//               <ChevronRight className="al-breadcrumb-sep" />
//               <span className="al-breadcrumb-current">{currentLabel}</span>
//             </div>
//             <div className="al-topbar-right">
//               <button className="al-notif-btn" title="Notifications">
//                 <Bell size={15} />
//                 <span className="al-notif-dot" />
//               </button>
//               <div className="al-avatar" title="Admin">AD</div>
//             </div>
//           </header>

//           <div className="al-content">
//             <Outlet />
//           </div>

//         </main>
//       </div>
//     </>
//   );
// }

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
  Scissors,
  Printer,
  Maximize2,
  Tag,
  ChevronRight,
  Bell,
  Palette,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";


const navGroups = [
  {
    label: "Overview",
    items: [
      {
        path: "/admin",
        icon: LayoutDashboard,
        label: "Dashboard",
        roles: ["admin", "designer", "warehouser"],
      },
      {
        path: "/admin/Order",
        icon: ShoppingBag,
        label: "Orders",
        roles: ["admin", "warehouser"],
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      {
        path: "/admin/Products",
        icon: Package,
        label: "Products",
        roles: ["admin", "designer", "warehouser"],
      },
      // {
      //   path: "/admin/productVarient",
      //   icon: Tag,
      //   label: "Variants",
      //   roles: ["admin", "designer"],
      // },
      // {
      //   path: "/admin/productVarientPrice",
      //   icon: Receipt,
      //   label: "Variant Prices",
      //   roles: ["admin", "designer"],
      // },
      // {
      //   path: "/admin/productSetup",
      //   icon: Settings,
      //   label: "Product Setup",
      //   roles: ["admin"],
      // },
      {
        path: "/admin/productDiscount",
        icon: BarChart3,
        label: "Discounts",
        roles: ["admin"],
      },
      {
        path: "/admin/FAQ",
        icon: BarChart3,
        label: "FAQ",
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Configuration",
    items: [
      {
        path: "/admin/Category",
        icon: Users,
        label: "Categories",
        roles: ["admin"],
      },
      // {
      //   path: "/admin/Papertype",
      //   icon: FileCheck,
      //   label: "Paper Types",
      //   roles: ["admin"],
      // },
      // {
      //   path: "/admin/Cuttype",
      //   icon: Scissors,
      //   label: "Cut Types",
      //   roles: ["admin"],
      // },
      // {
      //   path: "/admin/Printtype",
      //   icon: Printer,
      //   label: "Print Types",
      //   roles: ["admin"],
      // },
      // {
      //   path: "/admin/SizeType",
      //   icon: Maximize2,
      //   label: "Sizes",
      //   roles: ["admin"],
      // },
      {
        path: "/admin/attribute",
        icon: Maximize2,
        label: "attribute",
        roles: ["admin"],
      },
      {
        path: "/admin/product-attribute",
        icon: Maximize2,
        label: "Product Attribute",
        roles: ["admin"],
      },
       {
        path: "/admin/ProductSetupWrapper",
        icon: Maximize2,
        label: "ProductSetupWrapper",
        roles: ["admin"],
      },


      
    ],
  },


  {
    label: "Design",
    items: [
      {
        path: "/admin/Design",
        icon: Palette,
        label: "Design",
        roles: ["admin", "designer"],
      },
    ],
  },
  {
    label: "Role Management",
    items: [
      {
        path: "/admin/Role",
        icon: Users,
        label: "Role",
        roles: ["admin"],
      },
    ],
  },


];

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth(); // get roles

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return true;
    return itemRoles.some(role => user?.roles?.includes(role));
  };
  const currentLabel =
    navGroups
      .flatMap((g) => g.items)
      .find((i) => i.path === location.pathname)?.label ?? "Dashboard";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');

        html, body, #root { height: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; }

        .al-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          color: #1C1C1C;
          background: #ffffff;
        }

        /* ══════════════ SIDEBAR ══════════════ */
        .al-sidebar {
          height: 100vh;
          background: #D73D32;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.26s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          position: relative;
          z-index: 20;
        }
        .al-sidebar.expanded  { width: 248px; }
        .al-sidebar.collapsed { width: 72px;  }

        /* subtle dot-grid texture */
        .al-sidebar::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        /* ── Logo ── */
        .al-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 0 18px;
          height: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .al-logo-mark {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          flex-shrink: 0;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
        }
        .al-logo-text { overflow: hidden; }
        .al-logo-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 14.5px;
          color: #fff;
          line-height: 1.2;
          white-space: nowrap;
        }
        .al-logo-sub {
          font-size: 10.5px;
          color: rgba(255,255,255,0.55);
          font-weight: 400;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* ── Nav ── */
        .al-nav {
          flex: 1;
          padding: 14px 10px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
        }
        .al-nav::-webkit-scrollbar { width: 0; }

        .al-group { margin-bottom: 4px; }
        .al-group-label {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          padding: 10px 12px 5px;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s, max-height 0.22s;
        }
        .al-sidebar.collapsed .al-group-label {
          opacity: 0;
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }
        .al-sidebar.expanded .al-group-label {
          opacity: 1;
          max-height: 32px;
        }

        .al-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          font-size: 13.5px;
          font-weight: 400;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
          position: relative;
          margin-bottom: 1px;
        }
        .al-link:hover {
          background: rgba(255,255,255,0.1);
          color: #ffffff;
        }
        .al-link.active {
          background: #fff;
          color: #D73D32;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0,0,0,0.18);
        }
        .al-link.active svg { color: #D73D32; }
        .al-link svg { flex-shrink: 0; width: 16px; height: 16px; }
        .al-link-label {
          overflow: hidden;
          transition: opacity 0.15s;
        }
        .al-sidebar.collapsed .al-link-label { opacity: 0; }
        .al-sidebar.expanded  .al-link-label { opacity: 1; }

        .al-divider {
          height: 1px;
          background: rgba(255,255,255,0.1);
          margin: 8px 12px;
          transition: opacity 0.2s;
        }
        .al-sidebar.collapsed .al-divider { opacity: 0; }
        .al-sidebar.expanded  .al-divider { opacity: 1; }

        /* ── Collapse ── */
        .al-collapse-wrap {
          padding: 0 10px 10px;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .al-collapse-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 9px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          font-size: 12px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          transition: background 0.15s, color 0.15s;
        }
        .al-sidebar.collapsed .al-collapse-btn {
          justify-content: center;
        }
        .al-sidebar.expanded .al-collapse-btn {
          justify-content: flex-start;
        }
        .al-collapse-btn:hover {
          background: rgba(255,255,255,0.14);
          color: #ffffff;
        }
        .al-collapse-btn svg {
          flex-shrink: 0;
          transition: transform 0.26s;
        }
        .al-sidebar.collapsed .al-collapse-btn svg { transform: rotate(180deg); }
        .al-sidebar.expanded  .al-collapse-btn svg { transform: rotate(0deg);   }

        .al-collapse-label {
          overflow: hidden;
          transition: opacity 0.15s;
        }
        .al-sidebar.collapsed .al-collapse-label { opacity: 0; }
        .al-sidebar.expanded  .al-collapse-label { opacity: 1; }

        /* ── Footer ── */
        .al-footer {
          padding: 10px;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        .al-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 9px;
          background: none;
          border: none;
          color: rgba(255,255,255,0.6);
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          white-space: nowrap;
          width: 100%;
          transition: background 0.15s, color 0.15s;
        }
        .al-logout:hover {
          background: rgba(0,0,0,0.12);
          color: #ffffff;
        }
        .al-logout svg { flex-shrink: 0; width: 16px; height: 16px; }
        .al-logout-label {
          overflow: hidden;
          transition: opacity 0.15s;
        }
        .al-sidebar.collapsed .al-logout-label { opacity: 0; }
        .al-sidebar.expanded  .al-logout-label { opacity: 1; }

        /* ══════════════ MAIN ══════════════ */
        .al-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #ffffff;
        }

        /* ── Topbar ── */
        .al-topbar {
          height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #EBEBEB;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 14px;
          flex-shrink: 0;
        }
        .al-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #ABABAB;
        }
        .al-breadcrumb-sep { width: 13px; height: 13px; color: #D4D4D4; }
        .al-breadcrumb-current {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #1C1C1C;
        }
        .al-topbar-right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .al-notif-btn {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid #EBEBEB;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #999;
          transition: border-color 0.15s, color 0.15s;
          position: relative;
        }
        .al-notif-btn:hover { border-color: #D73D32; color: #D73D32; }
        .al-notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #D73D32;
          border: 1.5px solid #fff;
        }
        .al-avatar {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #D73D32;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 12px;
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
          letter-spacing: 0.3px;
          box-shadow: 0 2px 8px rgba(215,61,50,0.3);
        }

        /* ── Content / Outlet ── */
        .al-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 28px 32px;
          background: #ffffff;
        }
        .al-content::-webkit-scrollbar { width: 5px; }
        .al-content::-webkit-scrollbar-track { background: transparent; }
        .al-content::-webkit-scrollbar-thumb { background: #E0E0E0; border-radius: 4px; }
        .al-content::-webkit-scrollbar-thumb:hover { background: #CACACA; }
      `}</style>

      <div className="al-root">

        {/* ══ SIDEBAR ══ */}
        <aside className={`al-sidebar ${collapsed ? "collapsed" : "expanded"}`}>

          <div className="al-logo">
            <div className="al-logo-mark">CP</div>
            <div className="al-logo-text">
              <div className="al-logo-name">Citizen Prints</div>
              <div className="al-logo-sub">Admin Panel</div>
            </div>
          </div>

          <nav className="al-nav">
            {navGroups.map((group, gi) => {
              const filteredItems = group.items.filter(item =>
                hasAccess(item.roles)
              );

              // ❌ hide group if no items
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.label} className="al-group">
                  {gi > 0 && <div className="al-divider" />}
                  <div className="al-group-label">{group.label}</div>

                  {filteredItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;

                    return (
                      <Link
                        key={path}
                        to={path}
                        className={`al-link${isActive ? " active" : ""}`}
                      >
                        <Icon />
                        <span className="al-link-label">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>

          <div className="al-collapse-wrap">
            <button
              className="al-collapse-btn"
              onClick={() => setCollapsed((c) => !c)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronRight size={14} />
              <span className="al-collapse-label">Collapse</span>
            </button>
          </div>

          <div className="al-footer">
            <button className="al-logout">
              <LogOut />
              <span className="al-logout-label">Logout</span>
            </button>
          </div>

        </aside>

        {/* ══ MAIN ══ */}
        <main className="al-main">

          <header className="al-topbar">
            <div className="al-breadcrumb">
              <span>Admin</span>
              <ChevronRight className="al-breadcrumb-sep" />
              <span className="al-breadcrumb-current">{currentLabel}</span>
            </div>
            <div className="al-topbar-right">
              <button className="al-notif-btn" title="Notifications">
                <Bell size={15} />
                <span className="al-notif-dot" />
              </button>
              <div className="al-avatar" title="Admin">AD</div>
            </div>
          </header>

          <div className="al-content">
            <Outlet />
          </div>

        </main>
      </div>
    </>
  );
}