"use client";

import { useState } from "react";
import { startCall } from "../../../lib/api";
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

    setSuccess("Call started successfully 🚀");

    setPhone("");
    setProject("");

  } catch (err) {
    setError({
        error: err.message || "Unknown error",
        code: err.code || null,
      });
    console.log(error);
          
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container-fluid p-4">

      <h2 className="mb-4">📞 AI Campaigns</h2>

      {/* Start Campaign Card */}
      <div className="card p-4 mb-4">
        <h5 className="mb-3">Start New Campaign</h5>

        <div className="row g-3">

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

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-primary w-100"
              onClick={handleStartCampaign}
            >
              🚀 Start AI Campaign
            </button>
          </div>

        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="card p-4">
        <h5 className="mb-3">Recent Campaigns</h5>

        <table className="table">
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
                  <td>{c.status}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
}