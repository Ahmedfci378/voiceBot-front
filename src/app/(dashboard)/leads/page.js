"use client";

import { useEffect, useState } from "react";
import { getCalls } from "@/lib/api";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCalls();

        // اعتبر أي call فيها goal = Lead
        const filtered = res.data.filter((call) => call.goal);

        setLeads(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalize = (value) =>
  value?.replace("+", "").toLowerCase();
  
  const filteredLeads = leads.filter((lead) => {
  const query = search.toLowerCase();

  return (
    normalize(lead.from)?.includes(query) ||
    lead.goal?.toLowerCase().includes(query) ||
    lead.stage?.toLowerCase().includes(query) ||
    lead.locationPreference?.toLowerCase().includes(query)
  );
});

  const getBadge = (status) => {
    switch (status) {
      case "completed":
        return "bg-success";
      case "in-progress":
        return "bg-warning text-dark";
      case "failed":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold">👥 Leads</h2>
          <p className="text-muted mb-0">
            Manage and track potential customers.
          </p>
        </div>

        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "250px" }}
          placeholder="Search by phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 p-3">
            <h6 className="text-muted">Total Leads</h6>
            <h3 className="fw-bold">{leads.length}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 p-3">
            <h6 className="text-muted">New Leads</h6>
            <h3 className="fw-bold text-primary">
              {leads.filter((l) => l.stage === "launch").length}
            </h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm rounded-4 p-3">
            <h6 className="text-muted">In Progress</h6>
            <h3 className="fw-bold text-warning">
              {leads.filter((l) => l.status === "in-progress").length}
            </h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm rounded-4 p-3">

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Phone</th>
                <th>Goal</th>
                <th>Budget</th>
                <th>Stage</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>{lead.from}</td>
                    <td>
                      <span className="badge bg-dark">
                        {lead.goal}
                      </span>
                    </td>
                    <td>
                      {lead.budget
                        ? `${Number(lead.budget).toLocaleString()}`
                        : "-"}
                    </td>
                    <td>{lead.stage}</td>
                    <td>
                      <span className={`badge ${getBadge(lead.status)}`}>
                        {lead.status}
                      </span>
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