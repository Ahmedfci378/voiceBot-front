"use client";

import { useEffect, useState } from "react";
import { getCalls } from "../../../lib/api";
import Link from "next/link";
import { Phone, CheckCircle, AlertTriangle, Play } from "lucide-react";

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredCalls, setFilteredCalls] = useState([]);

  // Fetch calls on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCalls();
        const callData = Array.isArray(data?.data) ? data.data : [];
        setCalls(callData);
        setFilteredCalls(callData); // initial filtered = all calls
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter calls when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredCalls(calls);
    } else {
      const filtered = calls.filter(
        (c) =>
          c.from.toLowerCase().includes(search.toLowerCase()) ||
          c.to.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCalls(filtered);
    }
  }, [search, calls]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-success text-white";
      case "failed":
        return "bg-danger text-white";
      case "in-progress":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  const totalCalls = calls.length;
  const completed = calls.filter((c) => c.status === "completed").length;
  const active = calls.filter((c) => c.status === "in-progress").length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <Phone size={24} /> Calls
          </h2>
          <p className="text-muted mb-0">Monitor all Voice AI interactions</p>
        </div>

        <input
          type="text"
          className="form-control"
          placeholder="Search by phone..."
          style={{ maxWidth: "250px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4 d-flex flex-column align-items-start">
            <h6 className="text-muted">Total Calls</h6>
            <h3 className="fw-bold d-flex align-items-center gap-2">
              <Phone size={20} /> {totalCalls}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4 d-flex flex-column align-items-start">
            <h6 className="text-muted">Active Calls</h6>
            <h3 className="fw-bold text-warning d-flex align-items-center gap-2">
              <Play size={20} /> {active}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4 d-flex flex-column align-items-start">
            <h6 className="text-muted">Completed</h6>
            <h3 className="fw-bold text-success d-flex align-items-center gap-2">
              <CheckCircle size={20} /> {completed}
            </h3>
          </div>
        </div>
      </div>

      {/* Calls Grid */}
      {filteredCalls.length === 0 ? (
        <div className="alert alert-info text-center">
          No calls found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredCalls.map((call) => (
            <div className="col-md-6 col-lg-4" key={call._id}>
              <div
                className="card border-0 shadow-sm h-100 rounded-4 hover-shadow"
                style={{ transition: "0.3s", cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column">
                  {/* Phone */}
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <Phone size={20} /> {call.from}
                  </h5>

                  {/* Details */}
                  <div className="mb-3 small">
                    <div className="mb-1">
                      <strong>To:</strong> {call.to}
                    </div>

                    <div className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${getStatusBadge(call.status)}`}>
                        {call.status.replace("-", " ").toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <strong>Messages:</strong> {call.messages?.length || 0}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto">
                    <div className="text-muted small mb-2">
                      {new Date(call.createdAt).toLocaleString()}
                    </div>

                    <Link
                      href={`/calls/${call._id}`}
                      className="btn btn-dark btn-sm w-100"
                    >
                      View Conversation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}