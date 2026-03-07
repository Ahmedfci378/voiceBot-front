"use client";

import { useState } from "react";

export default function SettingsPage() {

  const [companyName, setCompanyName] = useState("Palm Hills");
  const [temperature, setTemperature] = useState(0.6);
  const [autoCallback, setAutoCallback] = useState(true);

  const handleSave = () => {
    alert("Settings saved (Demo Mode)");
  };

  return (
    <div>

      <h2 className="fw-bold mb-4">⚙ Settings</h2>

      <div className="row g-4">

        {/* Company Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4">
            <h5 className="mb-3">🏢 Company</h5>

            <label className="form-label">Company Name</label>
            <input
              type="text"
              className="form-control mb-3"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

          </div>
        </div>

        {/* AI Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4">
            <h5 className="mb-3">🤖 AI Settings</h5>

            <label className="form-label">
              Temperature: {temperature}
            </label>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="form-range mb-3"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />

          </div>
        </div>

        {/* Call Settings */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4">
            <h5 className="mb-3">📞 Call Settings</h5>

            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={autoCallback}
                onChange={() => setAutoCallback(!autoCallback)}
              />
              <label className="form-check-label">
                Enable Auto Callback
              </label>
            </div>

          </div>
        </div>

        {/* Integrations */}
        <div className="col-lg-6">
          <div className="card shadow-sm rounded-4 p-4">
            <h5 className="mb-3">🔗 Integrations</h5>

            <div className="mb-2">
              <span className="badge bg-success">
                Twilio Connected
              </span>
            </div>

            <div>
              <span className="badge bg-success">
                OpenAI Connected
              </span>
            </div>

          </div>
        </div>

      </div>

      <button
        className="btn btn-dark mt-4 px-4"
        onClick={handleSave}
      >
        💾 Save Changes
      </button>

    </div>
  );
}