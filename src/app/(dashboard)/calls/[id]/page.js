"use client";

import { useEffect, useState } from "react";
import { getCallById } from "../../../../lib/api";
import { useParams } from "next/navigation";
import { CheckCircle, AlertTriangle, Play } from "lucide-react";

export default function CallDetails() {
  const { id } = useParams();
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const data = await getCallById(id);
        setCall(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCall();
  }, [id]);

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

  if (loading || !call) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">

      {/* Header */}
      <h2 className="mb-4 fw-bold">Call Details</h2>

      {/* Call Info */}
      <div className="card shadow-sm p-4 mb-4 rounded-4">
        <div className="row g-3">
          <div className="col-md-4">
            <p><strong>From:</strong> {call.from}</p>
          </div>
          <div className="col-md-4">
            <p><strong>To:</strong> {call.to}</p>
          </div>
          <div className="col-md-4">
            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge ${getStatusBadge(call.status)}`}>
                {call.status.replace("-", " ").toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="card shadow-sm p-4 rounded-4">
        <h5 className="mb-3 fw-bold">Conversation</h5>
        <div className="d-flex flex-column gap-3">
          {call.messages?.map((msg, index) => (
            <div
              key={index}
              className={`d-flex ${
                msg.role === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded-3 ${
                  msg.role === "user" ? "bg-primary text-white" : "bg-light text-dark"
                } shadow-sm`}
                style={{ maxWidth: "70%" }}
              >
                <div>{msg.content}</div>
                <small className="d-block mt-2 text-muted text-end">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}