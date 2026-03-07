"use client";

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

export default function AnalysisPage() {

  // 🔹 بيانات مؤقتة (لحد ما نربط API)
  const conversionTrend = [
    { name: "Mon", rate: 40 },
    { name: "Tue", rate: 55 },
    { name: "Wed", rate: 48 },
    { name: "Thu", rate: 70 },
  ];

  const projectPerformance = [
    { name: "New Cairo", value: 120 },
    { name: "October", value: 90 },
  ];

  const statusData = [
    { name: "Completed", value: 180 },
    { name: "Active", value: 32 },
    { name: "Callbacks", value: 36 },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

  return (
    <div>

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">📊 Advanced Analysis</h2>
        <p className="text-muted">
          Deep performance insights & trends.
        </p>
      </div>

      {/* Charts Row */}
      <div className="row g-4">

        {/* Conversion Trend */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="mb-3">📈 Conversion Trend</h5>

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
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="mb-3">🏗 Project Performance</h5>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectPerformance}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="col-lg-6">
          <div className="card shadow-sm p-4 rounded-4">
            <h5 className="mb-3">🥧 Status Distribution</h5>

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

      </div>

    </div>
  );
}