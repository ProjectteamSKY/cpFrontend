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
  Truck,
  HelpCircle,
  Percent,
  ListTree,
  Layers,
  Shield,
  FileText,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  Sparkles,
  Activity,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../../media/logo.jpg";

const navGroups = [
  {
    items: [
      {
        path: "/admin",
        icon: LayoutDashboard,
        color: "#D73D32",
        label: "Dashboard",
        roles: ["admin", "designer", "warehouser"],
      },
      {
        path: "/admin/Order",
        icon: ShoppingBag,
        color: "#D73D32",
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
        color: "#D73D32",
        label: "Products",
        roles: ["admin", "designer", "warehouser"],
      },
      {
        path: "/admin/productDiscount",
        icon: Percent,
        color: "#D73D32",
        label: "Discounts",
        roles: ["admin"],
      },
      {
        path: "/admin/FAQ",
        icon: HelpCircle,
        color: "#D73D32",
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
        icon: ListTree,
        color: "#D73D32",
        label: "Categories",
        roles: ["admin"],
      },
      {
        path: "/admin/attribute",
        icon: Layers,
        color: "#D73D32",
        label: "Attribute",
        roles: ["admin"],
      },
      {
        path: "/admin/product-attribute",
        icon: Tag,
        color: "#D73D32",
        label: "Product Attribute",
        roles: ["admin"],
      },
      {
        path: "/admin/ProductSetupWrapper",
        icon: Settings,
        color: "#D73D32",
        label: "Product Setup",
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
        color: "#D73D32",
        label: "Design Studio",
        roles: ["admin", "designer"],
      },
    ],
  },
  {
    label: "Role Management",
    items: [
      {
        path: "/admin/Role",
        icon: Shield,
        color: "#D73D32",
        label: "Role Manager",
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Shipping Management",
    items: [
      {
        path: "/admin/Shiprocket",
        icon: Truck,
        color: "#D73D32",
        label: "Shipping Hub",
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Sales Management",
    items: [
      {
        path: "/admin/Sales-report",
        icon: FileText,
        color: "#D73D32",
        label: "Sales Report",
        roles: ["admin"],
      },
    ],
  },

  {
    label: "Contact Management",
    items: [
      {
        path: "/admin/ContactManagement",
        icon: FileText,
        color: "#D73D32",
        label: "Support Management",
        roles: ["admin"],
      },
    ],
  },

  
];

// Notification Dropdown Component
const NotificationDropdown = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="notif-dropdown" ref={dropdownRef}>
      <div className="notif-header">
        <span>Notifications</span>
        <button className="mark-read">Mark all read</button>
      </div>
      <div className="notif-list">
        <div className="notif-item unread">
          <div className="notif-icon">
            <ShoppingBag size={14} />
          </div>
          <div className="notif-content">
            <p>New order #ORD-1234 received</p>
            <span>2 minutes ago</span>
          </div>
        </div>
        <div className="notif-item">
          <div className="notif-icon">
            <Package size={14} />
          </div>
          <div className="notif-content">
            <p>Low stock alert: Running Shoes</p>
            <span>1 hour ago</span>
          </div>
        </div>
        <div className="notif-item">
          <div className="notif-icon">
            <TrendingUp size={14} />
          </div>
          <div className="notif-content">
            <p>Sales target achieved! 🎉</p>
            <span>3 hours ago</span>
          </div>
        </div>
      </div>
      <div className="notif-footer">
        <button>View all notifications</button>
      </div>
    </div>
  );
};

// User Profile Dropdown
const UserDropdown = ({ isOpen, onClose, user, onLogout }: { isOpen: boolean; onClose: () => void; user: any; onLogout: () => void }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-header">
        <div className="user-avatar-large">
          {user?.avatar ? <img src={user.avatar} alt="" /> : userInitials}
        </div>
        <div className="user-info">
          <strong>{user?.name || "Admin User"}</strong>
          <span>{user?.roles?.join(", ") || "Administrator"}</span>
        </div>
      </div>
      <div className="user-menu">
        <button>
          <User size={16} />
          Profile Settings
        </button>
        <button>
          <Settings size={16} />
          Account Preferences
        </button>
        <hr />
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const hasAccess = (itemRoles?: string[]) => {
    if (!itemRoles) return true;
    return itemRoles.some(role => user?.roles?.includes(role));
  };

  const currentItem = navGroups
    .flatMap((g) => g.items)
    .find((i) => i.path === location.pathname);

  const currentLabel = currentItem?.label ?? "Dashboard";
  const currentIcon = currentItem?.icon;

  const userInitials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  // Logo error handling
  const [logoError, setLogoError] = useState(false);

  return (
    <>
      <style>{`

        html, body, #root { height: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; }

        .al-root {
          display: flex;
          height: 100vh;
          overflow: hidden;
          color: #1C1C1C;
          background: #F5F6FA;
        }

        /* ══════════════ SIDEBAR ══════════════ */
        .al-sidebar {
          height: 100vh;
          background: #275280;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.26s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
          position: relative;
          z-index: 20;
        }
        .al-sidebar.expanded  { width: 260px; }
        .al-sidebar.collapsed { width: 72px;  }

        /* subtle dot-grid texture */
        .al-sidebar::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          pointer-events: none;
        }

        /* Mobile overlay */
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 25;
          display: none;
        }
        .sidebar-overlay.active {
          display: block;
        }
        @media (max-width: 768px) {
          .al-sidebar {
            position: fixed;
            left: -260px;
            top: 0;
            z-index: 30;
            transition: left 0.26s cubic-bezier(.4,0,.2,1);
          }
          .al-sidebar.mobile-open {
            left: 0;
          }
          .mobile-menu-btn {
            display: flex;
          }
        }

        /* Logo Section - Enhanced */
        .al-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          height: 70px;
          min-height: 70px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          white-space: nowrap;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          cursor: pointer;
          transition: all 0.2s;
        }
        .al-logo:hover {
          background: rgba(255,255,255,0.05);
        }

        .al-logo-mark {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #D73D32, #EC7063);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(215,61,50,0.3);
          transition: transform 0.2s;
          overflow: hidden;
        }
        .al-logo:hover .al-logo-mark {
          transform: scale(1.02);
        }
        .al-logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .al-logo-text {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .al-logo-name {
          font-weight: 700;
          font-size: 15px;
          color: #fff;
          line-height: 1.2;
          white-space: nowrap;
          letter-spacing: -0.3px;
        }
        .al-logo-sub {
          font-size: 10px;
          color: rgba(244,162,97,0.7);
          font-weight: 500;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        /* Navigation */
        .al-nav {
          flex: 1;
          padding: 16px 8px;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .al-nav::-webkit-scrollbar { width: 3px; }
        .al-nav::-webkit-scrollbar-track { background: transparent; }
        .al-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

        .al-group { margin-bottom: 4px; }
        .al-group-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: rgba(244,162,97,0.6);
          padding: 8px 12px 4px;
          white-space: nowrap;
          overflow: hidden;
          transition: opacity 0.2s, max-height 0.22s;
          line-height: 1;
        }
        .al-sidebar.collapsed .al-group-label {
          opacity: 0;
          max-height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }
        .al-sidebar.expanded .al-group-label {
          opacity: 1;
          max-height: 24px;
        }

        .al-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 10px;
          text-decoration: none;
          color: rgba(255,255,255,0.65);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          transition: all 0.15s ease;
          position: relative;
          min-height: 38px;
          margin-bottom: 2px;
        }
        
        /* FIX: Default icon color */
        .al-link svg {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          min-width: 18px;
          color: rgba(255,255,255,0.65);
          transition: color 0.15s ease;
        }
        
        .al-link:hover {
          background: rgba(255,255,255,0.1);
          color: #F4A261;
        }
        
        /* FIX: Hover icon color */
        .al-link:hover svg {
          color: #F4A261;
        }
        
        .al-link.active {
          background: linear-gradient(135deg, #D73D32, #EC7063);
          color: #ffffff;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(215,61,50,0.3);
        }
        
        /* FIX: Active icon color - set to white */
        .al-link.active svg {
          color: #ffffff;
        }
        
        .al-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 18px;
          background: #F4A261;
          border-radius: 0 2px 2px 0;
        }
        
        .al-link-label {
          overflow: hidden;
          transition: opacity 0.15s;
        }
        .al-sidebar.collapsed .al-link-label { opacity: 0; width: 0; }
        .al-sidebar.expanded  .al-link-label { opacity: 1; }

        .al-divider {
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 8px 12px;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .al-sidebar.collapsed .al-divider { opacity: 0; }

        /* Bottom Section */
        .al-bottom {
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding: 12px;
        }
        .al-collapse-wrap {
          margin-bottom: 8px;
        }
        .al-collapse-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.5);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          overflow: hidden;
          transition: all 0.15s;
        }
        .al-sidebar.collapsed .al-collapse-btn {
          justify-content: center;
        }
        .al-sidebar.expanded .al-collapse-btn {
          justify-content: flex-start;
        }
        .al-collapse-btn:hover {
          background: rgba(255,255,255,0.12);
          color: #F4A261;
        }
        .al-collapse-btn svg {
          flex-shrink: 0;
          transition: transform 0.26s;
        }
        .al-sidebar.collapsed .al-collapse-btn svg { transform: rotate(180deg); }

        .al-logout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 8px 12px;
          border-radius: 10px;
          background: rgba(215,61,50,0.15);
          border: none;
          color: #EC7063;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .al-logout:hover {
          background: rgba(215,61,50,0.25);
          color: #F4A261;
        }
        .al-logout svg { 
          flex-shrink: 0; 
          width: 18px; 
          height: 18px; 
        }

        /* ══════════════ MAIN ══════════════ */
        .al-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: #F5F6FA;
        }

        /* Topbar - Enhanced */
        .al-topbar {
          height: 70px;
          min-height: 70px;
          background: #ffffff;
          border-bottom: 1px solid #E8E8EC;
          display: flex;
          align-items: center;
          padding: 0 28px;
          gap: 20px;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #2d4863;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .mobile-menu-btn:hover {
          background: #f0f0f0;
        }

        .al-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #999;
        }
        .al-breadcrumb-sep { width: 13px; height: 13px; color: #C4C4C4; }
        .al-breadcrumb-current {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #2d4863;
        }
        .al-breadcrumb-current svg {
          color: #D73D32;
        }

        /* Search Bar */
        .search-container {
          position: relative;
          margin-left: auto;
        }
        .search-input {
          background: #F5F6FA;
          border: 1px solid #E8E8EC;
          border-radius: 40px;
          padding: 8px 16px 8px 38px;
          font-size: 13px;
          width: 240px;
          transition: all 0.2s;
        }
        .search-input:focus {
          outline: none;
          border-color: #D73D32;
          width: 300px;
          box-shadow: 0 0 0 3px rgba(215,61,50,0.1);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          width: 16px;
          height: 16px;
        }

        /* Quick Stats Badge */
        .quick-stats {
          display: flex;
          gap: 8px;
        }
        .stat-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #F5F6FA;
          padding: 6px 12px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 500;
          color: #2d4863;
          border: 1px solid #E8E8EC;
        }
        .stat-badge svg {
          color: #10b981;
        }

        .al-topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .al-notif-btn {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          border: 1px solid #E8E8EC;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #999;
          transition: all 0.15s;
          position: relative;
        }
        .al-notif-btn:hover { 
          border-color: #D73D32; 
          color: #D73D32;
          background: #fff5f4;
        }
        .al-notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #EC7063;
          border: 2px solid #fff;
        }
        .al-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #D73D32, #EC7063);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(215,61,50,0.3);
          transition: transform 0.2s;
        }
        .al-avatar:hover {
          transform: scale(1.02);
        }

        /* Dropdown Styles */
        .notif-dropdown, .user-dropdown {
          position: absolute;
          top: 55px;
          right: 0;
          width: 320px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.02);
          border: 1px solid #E8E8EC;
          overflow: hidden;
          z-index: 100;
          animation: dropdownFade 0.2s ease;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notif-header, .user-header {
          padding: 16px;
          border-bottom: 1px solid #E8E8EC;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          font-size: 14px;
          color: #1C1C1C;
        }
        .mark-read {
          font-size: 11px;
          background: none;
          border: none;
          color: #D73D32;
          cursor: pointer;
          font-weight: 500;
        }
        .notif-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .notif-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid #F0F0F0;
          transition: background 0.2s;
          cursor: pointer;
        }
        .notif-item:hover {
          background: #F5F6FA;
        }
        .notif-item.unread {
          background: rgba(215,61,50,0.05);
        }
        .notif-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #F5F6FA;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #D73D32;
        }
        .notif-content p {
          margin: 0;
          font-size: 13px;
          color: #1C1C1C;
        }
        .notif-content span {
          font-size: 11px;
          color: #999;
        }
        .notif-footer, .user-menu {
          padding: 12px;
          border-top: 1px solid #E8E8EC;
        }
        .notif-footer button, .user-menu button {
          width: 100%;
          padding: 8px;
          background: none;
          border: none;
          font-size: 13px;
          color: #D73D32;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
          font-weight: 500;
        }
        .user-menu button {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #1C1C1C;
          font-weight: 400;
        }
        .user-menu button:hover {
          background: #F5F6FA;
        }
        .user-menu hr {
          margin: 8px 0;
          border: none;
          border-top: 1px solid #E8E8EC;
        }
        .logout-btn {
          color: #EC7063 !important;
        }
        .user-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #D73D32, #EC7063);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
        }
        .user-info {
          flex: 1;
        }
        .user-info strong {
          display: block;
          font-size: 14px;
          color: #1C1C1C;
        }
        .user-info span {
          font-size: 12px;
          color: #999;
        }

        /* Content */
        .al-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px 32px;
          background: #F5F6FA;
        }
        .al-content::-webkit-scrollbar { width: 5px; }
        .al-content::-webkit-scrollbar-track { background: transparent; }
        .al-content::-webkit-scrollbar-thumb { background: #D4D4DC; border-radius: 4px; }
        .al-content::-webkit-scrollbar-thumb:hover { background: #BDBDC5; }

        /* Responsive */
        @media (max-width: 768px) {
          .al-topbar {
            padding: 0 16px;
          }
          .search-container {
            display: none;
          }
          .quick-stats {
            display: none;
          }
          .al-breadcrumb-current {
            font-size: 14px;
          }
          .al-content {
            padding: 20px;
          }
        }
        @media (max-width: 480px) {
          .al-breadcrumb span:first-child {
            display: none;
          }
          .al-topbar-right {
            gap: 4px;
          }
        }
      `}</style>

      <div className="al-root">
        {/* Mobile Overlay */}
        <div className={`sidebar-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(false)} />

        {/* Sidebar */}
        <aside className={`al-sidebar ${collapsed ? "collapsed" : "expanded"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="al-logo" onClick={() => setMobileMenuOpen(false)}>
            <div className="al-logo-mark">
              {!logoError && logo ? (
                <img 
                  src={logo} 
                  alt="Logo" 
                  onError={() => setLogoError(true)}
                />
              ) : (
                "CP"
              )}
            </div>
            <div className="al-logo-text">
              <span className="al-logo-name">Citizen Prints</span>
            </div>
          </div>

          <nav className="al-nav">
            {navGroups.map((group, gi) => {
              const filteredItems = group.items.filter(item => hasAccess(item.roles));
              if (filteredItems.length === 0) return null;

              return (
                <div key={group.label || gi} className="al-group">
                  {gi > 0 && <div className="al-divider" />}
                  {group.label && <div className="al-group-label">{group.label}</div>}
                  {filteredItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;
                    return (
                      <Link
                        key={path}
                        to={path}
                        className={`al-link${isActive ? " active" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
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

          <div className="al-bottom">
            <div className="al-collapse-wrap">
              <button
                className="al-collapse-btn"
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronRight size={14} />
                <span className="al-link-label">Collapse</span>
              </button>
            </div>
            <button className="al-logout" onClick={handleLogout}>
              <LogOut size={16} />
              <span className="al-link-label">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="al-main">
          <header className="al-topbar">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>

            <div className="al-breadcrumb">
              <span>Admin</span>
              <ChevronRight className="al-breadcrumb-sep" />
              <div className="al-breadcrumb-current">
                {currentIcon && <currentIcon size={16} />}
                <span>{currentLabel}</span>
              </div>
            </div>

            <div className="search-container">
             
            </div>

            

            {/* <div className="al-topbar-right">
              <div style={{ position: "relative" }}>
                <button className="al-notif-btn" onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell size={15} />
                  <span className="al-notif-dot" />
                </button>
                <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
              </div>

              <div style={{ position: "relative" }}>
                <div className="al-avatar" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  {userInitials}
                </div>
                <UserDropdown isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)} user={user} onLogout={handleLogout} />
              </div>
            </div> */}
          </header>

          <div className="al-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}