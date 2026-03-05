"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const menuItems = [
    { name: "Dashboard", icon: "📊", path: "/dashboard" },
    { name: "Calls", icon: "📞", path: "/calls" },
    { name: "Projects", icon: "🏗", path: "/projects" },
  ];

  const features = [
    { name: "AI Calls", icon: "🤖", path: "/ai-calls" },
    { name: "Analytics", icon: "📈", path: "/analytics" },
    { name: "Leads", icon: "👥", path: "/leads" },
    { name: "Settings", icon: "⚙", path: "/settings" },
  ];

  return (
    <div className="d-flex min-vh-100">

      {/* Sidebar */}
      <div className="sidebar">

        {/* Logo */}
        <div className="sidebar-logo">
          <h3>🏢 Palm Hills</h3>
          <span>AI Sales Assistant</span>
        </div>

        {/* MAIN */}
        <div className="sidebar-section">
          <p className="sidebar-title">MAIN</p>

          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-link ${
                isActive(item.path) ? "active-link" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* FEATURES */}
        <div className="sidebar-section">
          <p className="sidebar-title">FEATURES</p>

          {features.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-link ${
                isActive(item.path) ? "active-link" : ""
              }`}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* User */}
        <div className="sidebar-user">
          <div className="user-avatar">A</div>
          <div>
            <div className="user-name">Ahmed</div>
            <div className="user-role">Admin</div>
          </div>
        </div>

      </div>

      {/* Content */}
      <div className="content-area">
        {children}
      </div>

    </div>
  );
}