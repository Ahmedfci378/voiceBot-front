"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// API
export const getProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/projects`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export default function AnalysisPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Dynamic Data
  const conversionTrend = projects.map((p, i) => ({
    name: p.name,
    rate: Math.floor(Math.random() * 100), // مثال عشوائي للتحويل
  }));

  const projectPerformance = projects.map((p) => ({
  name: p.name,
  value: (p.maxPrice - p.startingPrice) / 1000000, // تحويل للقيم بالمليون
}));

  const statusCount = { completed: 0, active: 0, callbacks: 0 };
  projects.forEach((p) => {
    switch (p.status) {
      case "available":
        statusCount.active += 1;
        break;
      case "completed":
        statusCount.completed += 1;
        break;
      default:
        statusCount.callbacks += 1;
    }
  });

  const statusData = [
    { name: "Completed", value: statusCount.completed },
    { name: "Active", value: statusCount.active },
    { name: "Callbacks", value: statusCount.callbacks },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">{error}</div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Advanced Analytics</h2>
        <p className="text-muted">Deep performance insights & trends.</p>
      </div>

      {/* Charts Row */}
      <div className="row g-4">

        {/* Conversion Trend */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4 h-100">
            <h5 className="mb-3">Conversion Trend</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={conversionTrend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#111827"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Performance */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4 h-100">
            <h5 className="mb-3">Project Performance</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPerformance}>
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(val) => `${val}M`} // عرض قيم مختصرة على YAxis
                />
                <Tooltip
                  formatter={(value) =>
                    `${(value * 1000000).toLocaleString()} EGP`
                  } // إعادة القيمة الحقيقية عند المرور
                />
                <Bar dataKey="value" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4 h-100">
            <h5 className="mb-3">Status Distribution</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projects List */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4 h-100 overflow-auto">
            <h5 className="mb-3">Projects Overview</h5>
            {projects.length === 0 ? (
              <p>No projects available</p>
            ) : (
              <ul className="list-group list-group-flush">
                {projects.map((p) => (
                  <li
                    key={p._id.$oid}
                    className="list-group-item d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{p.name}</div>
                      <small>{p.location} | {p.type}</small>
                    </div>
                    <span className={`badge ${p.status === "available" ? "bg-success" : "bg-secondary"}`}>
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}