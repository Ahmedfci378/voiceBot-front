"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiPhone,
  FiBox,
  FiCpu,
  FiBarChart2,
  FiUsers,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: <FiHome />, path: "/dashboard" },
    { name: "Calls", icon: <FiPhone />, path: "/calls" },
    { name: "Projects", icon: <FiBox />, path: "/projects" },
    { name: "ChatBot", icon: <FiCpu />, path: "/chatbot" },
    { name: "Chats", icon: <FiMessageSquare />, path: "/chats" }

  ];

  const features = [
    { name: "Analytics", icon: <FiBarChart2 />, path: "/analysis" },
    { name: "Leads", icon: <FiUsers />, path: "/leads" },
    { name: "Settings", icon: <FiSettings />, path: "/settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          background: "#0f172a",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ marginBottom: 30 }}>Palm Hills</h3>

          <p style={{ fontSize: 12, color: "#64748b" }}>MAIN</p>

          {menu.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "6px",
                textDecoration: "none",
                color: pathname === item.path ? "white" : "#cbd5f5",
                background:
                  pathname === item.path ? "#2563eb" : "transparent",
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <p style={{ fontSize: 12, color: "#64748b", marginTop: 20 }}>
            FEATURES
          </p>

          {features.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "6px",
                textDecoration: "none",
                color: pathname === item.path ? "white" : "#cbd5f5",
                background:
                  pathname === item.path ? "#2563eb" : "transparent",
              }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "#334155",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            A
          </div>

          <div>
            <div style={{ fontWeight: 600 }}>Ahmed</div>
            <small>Admin</small>
          </div>
        </div>
      </aside>

      {/* Page Content */}
      <main
        style={{
          flex: 1,
          background: "#f1f5f9",
          padding: "30px",
        }}
      >
        {children}
      </main>
    </div>
  );
}