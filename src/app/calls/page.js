"use client";

import { useEffect, useState } from "react";
import { getCalls } from "../../lib/api";
import Link from "next/link";

export default function CallsPage() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCalls();
        setCalls(data);
      } catch (error) {
        console.error("Error fetching calls:", error);
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

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center fw-bold">📞 Call History</h2>

      {calls.length === 0 && (
        <div className="alert alert-info text-center">
          No calls available yet.
        </div>
      )}

      <div className="row">
        {calls.map((call) => (
          <div className="col-md-6 col-lg-4 mb-4" key={call._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-3">
                  📲 {call.from}
                </h5>

                <p className="card-text mb-1">
                  <strong>To:</strong> {call.to}
                </p>

                <p className="card-text mb-1">
                  <strong>Status:</strong>{" "}
                  <span className={`badge ${getStatusBadge(call.status)}`}>
                    {call.status}
                  </span>
                </p>

                <p className="card-text mb-1">
                  <strong>Messages:</strong>{" "}
                  {call.messages?.length || 0}
                </p>

                <p className="card-text text-muted small mt-auto">
                  {new Date(call.createdAt).toLocaleString()}
                </p>

                <Link
                  href={`/calls/${call._id}`}
                  className="btn btn-outline-dark btn-sm mt-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}