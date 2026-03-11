"use client";

import { useEffect, useState } from "react";
import { startCall, getCalls } from "../../../lib/api";

import {
  Phone,
  Activity,
  CheckCircle,
  PhoneIncoming,
  BarChart3,
  TrendingUp
} from "lucide-react";

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
  const [calls, setCalls] = useState([]); // هنا عرفنا calls
  const [lineData, setLineData] = useState([]); // هنا عرفنا lineData
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({
    totalCalls: 0,
    activeCalls: 0,
    completedCalls: 0,
    callbacks: 0,
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setResult(null);

      const data = await startCall(phone);
      setResult(data);

      // بعد المكالمة نعمل تحديث للـ stats
      fetchStats();

    } catch (err) {
      setResult({
        error: err.message || "Unknown error",
        code: err.code || null,
      });
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // Fetch stats dynamically
  // ===========================
  const fetchStats = async () => {
    try {
      const res = await getCalls();
      if (res.success && Array.isArray(res.data)) {
        const calls = res.data;

        const totalCalls = calls.length;
        const activeCalls = calls.filter(c => c.status === "active").length;
        const completedCalls = calls.filter(c => c.status === "completed").length;
        const callbacks = calls.filter(c => c.stage === "callback").length;

        setStats({ totalCalls, activeCalls, completedCalls, callbacks });
      } else {
        console.warn("No calls data returned from API", res);
      }
    } catch (err) {
      console.error("Error fetching calls:", err);
    }
  };

  

useEffect(() => {
  fetchStats();
}, []);

  
// fetch all calls for charts
const fetchCalls = async () => {
  try {
    const res = await getCalls();
    if (res.success && Array.isArray(res.data)) {
      setCalls(res.data); // نحط كل المكالمات في state
    } else {
      console.warn("No calls data returned from API", res);
    }
  } catch (err) {
    console.error("Error fetching calls:", err);
  }
};

// نشغلها مرة واحدة عند load
useEffect(() => {
  fetchCalls();
}, []);

  // ===========================
  // Chart Data
  // ===========================
const computeWeeklyData = (callsList) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const callsPerDay = Array(7).fill(0);

  callsList.forEach(call => {
    if (call.createdAt) {
      const dateStr = call.createdAt.$date || call.createdAt; // لو فيه $date استخدمه، لو مش موجود استخدم القيمة نفسها
      const date = new Date(dateStr);
      if (!isNaN(date)) {
        const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ...
        callsPerDay[dayIndex]++;
      }
    }
  });

  return days.map((day, index) => ({
    name: day,
    calls: callsPerDay[index]
  }));
};

  // ===========================
  // تحديث بيانات الرسم البياني عند تغيير المكالمات
  // ===========================


  useEffect(() => {
    if (calls.length > 0) {
      const data = computeWeeklyData(calls);
      setLineData(data);
    }
  }, [calls]);

 const totalCalls = stats.totalCalls || 1; // عشان مانقسمش على صفر
const pieData = [
  { name: "Completed", value: stats.completedCalls, label: `${Math.round((stats.completedCalls/totalCalls)*100)}%` },
  { name: "Active", value: stats.activeCalls, label: `${Math.round((stats.activeCalls/totalCalls)*100)}%` },
  { name: "Callbacks", value: stats.callbacks, label: `${Math.round((stats.callbacks/totalCalls)*100)}%` },
  { 
    name: "Other", 
    value: totalCalls - (stats.completedCalls + stats.activeCalls + stats.callbacks),
    label: `${Math.round(((totalCalls - (stats.completedCalls + stats.activeCalls + stats.callbacks))/totalCalls)*100)}%`
  },
].filter(d => d.value > 0); // نشيل أي slice قيمتها صفر

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
        <div className="d-flex align-items-center gap-2 mb-2">
          <BarChart3 size={28} />
          <h2 className="fw-bold mb-0">Voice AI Dashboard</h2>
        </div>

        <p className="mb-4 opacity-75">
          Real-time analytics and call performance overview
        </p>

        {/* Call Section */}
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Enter phone number"
            className="form-control"
            style={{ maxWidth: "300px" }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="btn btn-warning fw-bold d-flex align-items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Phone size={18} />
            {loading ? "Calling..." : "Start Call"}
          </button>
        </div>

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
          { label: "Total Calls", value: stats.totalCalls, icon: <Phone size={20} /> },
          { label: "Active Calls", value: stats.activeCalls, icon: <Activity size={20} /> },
          { label: "Completed", value: stats.completedCalls, icon: <CheckCircle size={20} /> },
          { label: "Callbacks", value: stats.callbacks, icon: <PhoneIncoming size={20} /> },
        ].map((item, index) => (
          <div className="col-md-3" key={index}>
            <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2 text-muted">
                {item.icon}
                <h6 className="mb-0">{item.label}</h6>
              </div>
              <h3 className="fw-bold">{item.value}</h3>
            </div>
          </div>
        ))}

      </div>

      {/* Charts */}
      <div className="row g-4">

        {/* Line Chart */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <TrendingUp size={20} />
              <h5 className="mb-0">Weekly Call Trends</h5>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="calls"
                stroke="#111827"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <BarChart3 size={20} />
              <h5 className="mb-0">Call Distribution</h5>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label={({ name, label }) => `${name}: ${label}`} // يظهر النسبة بدل الرقم
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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