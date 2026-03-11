"use client";

import { useState } from "react";
import { FiSettings, FiBriefcase, FiCpu, FiPhone, FiLink, FiSave } from "react-icons/fi";

export default function SettingsPage() {

  const [companyName, setCompanyName] = useState("Palm Hills");
  const [temperature, setTemperature] = useState(0.6);
  const [autoCallback, setAutoCallback] = useState(true);

  const handleSave = () => {
    alert("Settings saved (Demo Mode)");
  };

  return (
    <div className="container py-4">

      <div className="d-flex align-items-center gap-2 mb-4">
        <FiSettings size={24}/>
        <h2 className="fw-bold m-0">Settings</h2>
      </div>

      <div className="row g-4">

        {/* Company Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4 border-0 bg-light">

            <div className="d-flex align-items-center gap-2 mb-3">
              <FiBriefcase/>
              <h5 className="text-primary fw-bold m-0">Company</h5>
            </div>

            <label className="form-label fw-semibold">Company Name</label>

            <input
              type="text"
              className="form-control mb-3"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <small className="text-muted">
              This name will appear in calls & reports.
            </small>

          </div>
        </div>


        {/* AI Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4 border-0 bg-light">

            <div className="d-flex align-items-center gap-2 mb-3">
              <FiCpu/>
              <h5 className="text-primary fw-bold m-0">AI Settings</h5>
            </div>

            <label className="form-label fw-semibold">
              Temperature: <span className="text-dark">{temperature}</span>
            </label>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="form-range mb-2"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />

            <small className="text-muted">
              Higher values = more creative responses.
            </small>

          </div>
        </div>


        {/* Call Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4 border-0 bg-light">

            <div className="d-flex align-items-center gap-2 mb-3">
              <FiPhone/>
              <h5 className="text-primary fw-bold m-0">Call Settings</h5>
            </div>

            <div className="form-check form-switch">

              <input
                className="form-check-input"
                type="checkbox"
                checked={autoCallback}
                onChange={() => setAutoCallback(!autoCallback)}
              />

              <label className="form-check-label fw-semibold">
                Enable Auto Callback
              </label>

            </div>

            <small className="text-muted">
              Automatically follow up missed calls.
            </small>

          </div>
        </div>


        {/* Integrations */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4 border-0 bg-light">

            <div className="d-flex align-items-center gap-2 mb-3">
              <FiLink/>
              <h5 className="text-primary fw-bold m-0">Integrations</h5>
            </div>

            <div className="mb-2">
              <span className="badge bg-success px-3 py-2">
                Twilio Connected
              </span>
            </div>

            <div>
              <span className="badge bg-success px-3 py-2">
                OpenAI Connected
              </span>
            </div>

          </div>
        </div>

      </div>


      <div className="mt-4 text-end">

        <button
          className="btn btn-primary btn-lg px-4 d-inline-flex align-items-center gap-2"
          onClick={handleSave}
        >
          <FiSave/>
          Save Changes
        </button>

      </div>

    </div>
  );
}