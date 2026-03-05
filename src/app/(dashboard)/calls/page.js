"use client";

import { useEffect, useState } from "react";
import { getCalls } from "../../../lib/api";
import Link from "next/link";

export default function CallsPage() {

  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCalls();
        setCalls(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "failed":
        return "bg-danger";
      case "in-progress":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  const totalCalls = calls.length;
  const completed = calls.filter(c => c.status === "completed").length;
  const active = calls.filter(c => c.status === "in-progress").length;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border"></div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">📞 Calls</h2>
          <p className="text-muted mb-0">
            Monitor all Voice AI interactions
          </p>
        </div>

        <input
          type="text"
          className="form-control"
          placeholder="Search phone..."
          style={{ maxWidth: "250px" }}
        />
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="text-muted">Total Calls</h6>
            <h3 className="fw-bold">{totalCalls}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="text-muted">Active Calls</h6>
            <h3 className="fw-bold text-warning">{active}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="text-muted">Completed</h6>
            <h3 className="fw-bold text-success">{completed}</h3>
          </div>
        </div>

      </div>

      {/* Calls Grid */}

      {calls.length === 0 ? (

        <div className="alert alert-info text-center">
          No calls recorded yet.
        </div>

      ) : (

        <div className="row g-4">

          {calls.map((call) => (

            <div className="col-md-6 col-lg-4" key={call._id}>

              <div
                className="card border-0 shadow-sm h-100 rounded-4"
                style={{
                  transition: "0.2s",
                  cursor: "pointer"
                }}
              >

                <div className="card-body d-flex flex-column">

                  {/* Phone */}
                  <h5 className="fw-bold mb-3">
                    📲 {call.from}
                  </h5>

                  {/* Details */}
                  <div className="mb-3 small">

                    <div className="mb-1">
                      <strong>To:</strong> {call.to}
                    </div>

                    <div className="mb-1">
                      <strong>Status:</strong>{" "}
                      <span className={`badge ${getStatusBadge(call.status)}`}>
                        {call.status}
                      </span>
                    </div>

                    <div>
                      <strong>Messages:</strong>{" "}
                      {call.messages?.length || 0}
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