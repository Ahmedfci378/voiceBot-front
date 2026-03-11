"use client";

import { useEffect, useState } from "react";
import { getCalls } from "@/lib/api";
import { FiUsers, FiPlusCircle, FiLoader } from "react-icons/fi";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCalls();
        if (res?.data && Array.isArray(res.data)) {
          // فقط المكالمات اللي فيها goal
          const filtered = res.data.filter((call) => call.goal || true);
          setLeads(filtered);
        } else {
          setLeads([]);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load leads");
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalize = (value) => value?.toString().replace(/\+|-/g, "").toLowerCase();

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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <FiLoader className="spinner-border text-primary fs-1" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-5">{error}</div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header + Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4 gap-3">
        <div>
          <h2 className="fw-bold">👥 Leads Dashboard</h2>
          <p className="text-muted mb-0">Manage and track potential customers.</p>
        </div>

        <div className="d-flex gap-2 w-100 w-md-auto">
          <input
            type="text"
            className="form-control"
            style={{ minWidth: "250px" }}
            placeholder="Search by phone, goal, stage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-outline-secondary"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-lg rounded-4 p-4 text-center bg-gradient bg-opacity-10 border-0">
            <FiUsers className="fs-1 text-primary mb-2" />
            <div className="text-muted mb-1">Total Leads</div>
            <div className="fw-bold fs-2">{leads?.length || 0}</div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg rounded-4 p-4 text-center bg-gradient bg-opacity-10 border-0">
            <FiPlusCircle className="fs-1 text-success mb-2" />
            <div className="text-muted mb-1">New Leads</div>
            <div className="fw-bold fs-2 text-success">
              {leads?.filter((l) => l.stage === "launch")?.length || 0}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-lg rounded-4 p-4 text-center bg-gradient bg-opacity-10 border-0">
            <FiLoader className="fs-1 text-warning mb-2" />
            <div className="text-muted mb-1">In Progress</div>
            <div className="fw-bold fs-2 text-warning">
              {leads?.filter((l) => l.status === "in-progress")?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card shadow-lg rounded-4 p-3 overflow-auto">
        <div className="table-responsive">
          <table className="table table-hover table-striped align-middle">
            <thead className="table-dark text-white sticky-top">
              <tr>
                <th>Phone</th>
                <th>Goal</th>
                <th>Budget</th>
                <th>Stage</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const id = lead?._id?.$oid || lead?._id || Math.random();
                  return (
                    <tr key={id}>
                      <td>{lead.from || "-"}</td>
                      <td>
                        <span className="badge bg-dark">{lead.goal || "-"}</span>
                      </td>
                      <td>
                        {lead.budget
                          ? `${Number(lead.budget).toLocaleString()} EGP`
                          : "-"}
                      </td>
                      <td>{lead.stage || "-"}</td>
                      <td>
                        <span className={`badge ${getBadge(lead.status)}`}>
                          {lead.status || "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}