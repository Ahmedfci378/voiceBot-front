"use client";

import { useState } from "react";
import { startCall } from "../../../lib/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function DashboardPage() {

  const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
  
    const handleSubmit = async () => {
    try {
      setLoading(true);
      setResult(null);
  
      const data = await startCall(phone);
      setResult(data);
  
    } catch (err) {
      // هنا هنجيب الرسالة الحقيقية من Twilio
      setResult({
        error: err.message || "Unknown error",
        code: err.code || null,
      });
      
    } finally {
      setLoading(false);
    }
  };
  const stats = {
    totalCalls: 248,
    activeCalls: 32,
    completedCalls: 180,
    callbacks: 36,
  };

  // بيانات الشارت
  const lineData = [
    { name: "Mon", calls: 40 },
    { name: "Tue", calls: 55 },
    { name: "Wed", calls: 30 },
    { name: "Thu", calls: 70 },
    { name: "Fri", calls: 60 },
  ];

  const pieData = [
    { name: "Completed", value: stats.completedCalls },
    { name: "Active", value: stats.activeCalls },
    { name: "Callbacks", value: stats.callbacks },
  ];

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6"];

  return (
    <div>

      {/* Header */}
      <div
        className="p-4 mb-4 text-white rounded-4"
        style={{
          background: "linear-gradient(135deg, #111827, #1f2937)",
        }}
      >
        <h2 className="fw-bold mb-1">🚀 Voice AI Dashboard</h2>
        <p className="mb-3 opacity-75">
          Real-time analytics & performance overview.
        </p>

        {/* Call Button */}
        <input
        type="text"
        placeholder="Enter phone number"
        className="border p-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
        <button className="btn btn-warning fw-bold"
        onClick={handleSubmit}
        disabled={loading}
        >
          📞 Start New Call
          {loading ? "Calling..." : "Start Call"}

        </button>
         {result?.error && (
       <div className="alert alert-danger mt-3">
        Error: {result.error}
        {result.code && <div>Code: {result.code}</div>}
     </div>
    )}
      </div>

      {/* Stats */}
      <div className="row g-4 mb-5">

        {[
          { label: "Total Calls", value: stats.totalCalls },
          { label: "Active Calls", value: stats.activeCalls },
          { label: "Completed", value: stats.completedCalls },
          { label: "Callbacks", value: stats.callbacks },
        ].map((item, index) => (
          <div className="col-md-3" key={index}>
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <h6 className="text-muted">{item.label}</h6>
              <h3 className="fw-bold">{item.value}</h3>
            </div>
          </div>
        ))}

      </div>

      {/* Charts Section */}
      <div className="row g-4">

        {/* Line Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="mb-4">📈 Weekly Call Trends</h5>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#111827"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="mb-4">📊 Call Distribution</h5>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
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