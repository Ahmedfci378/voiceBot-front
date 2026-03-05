"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <div className="d-flex min-vh-100">

      {/* Sidebar */}
      <div
        style={{ width: "260px", background: "#111827" }}
        className="text-white p-4"
      >
        <h4 className="fw-bold mb-4">🚀 VoiceBot SaaS</h4>

        <div className="d-flex flex-column gap-3">

          <Link
            href="/dashboard"
            className={`text-decoration-none ${
              isActive("/dashboard") ? "text-warning fw-bold" : "text-white"
            }`}
          >
            📊 Dashboard
          </Link>

          <Link
            href="/calls"
            className={`text-decoration-none ${
              isActive("/calls") ? "text-warning fw-bold" : "text-white"
            }`}
          >
            📞 Calls
          </Link>

          <Link
            href="/projects"
            className={`text-decoration-none ${
              isActive("/projects") ? "text-warning fw-bold" : "text-white"
            }`}
          >
            🏗 Projects
          </Link>

        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1 p-5 bg-light">
        {children}
      </div>

    </div>
  );
}