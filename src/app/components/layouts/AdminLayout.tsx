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