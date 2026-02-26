"use client";

import { useEffect, useState } from "react";
import CallForm from "../components/CallForm";
import { getCalls } from "../lib/api";

export default function Home() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCalls();
        setCalls(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const totalCalls = calls.length;

  const activeCalls = calls.filter(
    (call) => call.status === "in-progress"
  ).length;

  const successRate =
    totalCalls > 0
      ? Math.round((calls.filter(c => c.status === "completed").length / totalCalls) * 100)
      : 0;

  return (
    <div className="container py-5">

      <div className="text-center mb-5">
        <h1 className="fw-bold">📊 Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Total Calls</h5>
            <h2>{totalCalls}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Active Calls</h5>
            <h2>{activeCalls}</h2>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-sm text-center p-3">
            <h5>Success Rate</h5>
            <h2>{successRate}%</h2>
          </div>
        </div>
      </div>

      {/* Call Form */}
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <CallForm />
      </div>

    </div>
  );
}