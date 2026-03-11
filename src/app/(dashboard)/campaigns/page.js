"use client";

import { useState } from "react";
import { startCall } from "../../../lib/api";
import { Play, CheckCircle, AlertCircle } from "lucide-react";

export default function CampaignsPage() {
  const [phone, setPhone] = useState("");
  const [project, setProject] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleStartCampaign = async () => {
    if (!phone || !project) {
      setError("Please enter phone and select project");
      setSuccess("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await startCall(phone);

      const newCampaign = {
        id: Date.now(),
        phone,
        project,
        status: "Running",
      };

      setCampaigns([newCampaign, ...campaigns]);
      setSuccess("Call started successfully!");
      setPhone("");
      setProject("");
    } catch (err) {
      setError(err.message || "Unknown error");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 fw-bold">AI Campaigns</h2>

      {/* Start Campaign Card */}
      <div className="card shadow-sm p-4 mb-4 rounded-4">
        <h5 className="mb-3">Start New Campaign</h5>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        {success && (
          <div className="alert alert-success">{success}</div>
        )}

        <div className="row g-3 align-items-end">

          <div className="col-md-4">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="010xxxxxxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Project</label>
            <select
              className="form-control"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">Select Project</option>
              <option value="Palm Hills New Cairo">Palm Hills New Cairo</option>
              <option value="Badya">Badya</option>
              <option value="Palm Hills October">Palm Hills October</option>
            </select>
          </div>

          <div className="col-md-4 d-flex">
            <button
              className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={handleStartCampaign}
              disabled={loading}
            >
              {loading ? "Starting..." : <><Play size={18} /> Start AI Campaign</>}
            </button>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="card shadow-sm p-4 rounded-4">
        <h5 className="mb-3">Recent Campaigns</h5>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Phone</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    No campaigns yet
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>{c.phone}</td>
                    <td>{c.project}</td>
                    <td>
                      {c.status === "Running" ? (
                        <span className="badge bg-warning text-dark d-flex align-items-center gap-1">
                          <Play size={14} /> {c.status}
                        </span>
                      ) : (
                        <span className="badge bg-success d-flex align-items-center gap-1">
                          <CheckCircle size={14} /> {c.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}