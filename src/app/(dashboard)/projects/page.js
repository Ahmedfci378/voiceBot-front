"use client";

import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "residential",
    startingPrice: "",
    maxPrice: "",
    installmentYears: "",
    description: "",
    features: "",
  });

  /* ===============================
     Fetch Projects
  =================================*/
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     Handle Form Change
  =================================*/
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===============================
     Create Project
  =================================*/
  const handleCreate = async () => {
    try {
      setSubmitting(true);

      await createProject({
        ...form,
        startingPrice: Number(form.startingPrice),
        maxPrice: Number(form.maxPrice),
        installmentYears: Number(form.installmentYears),
        features: form.features
          ? form.features.split(",").map((f) => f.trim())
          : [],
      });

      // Reset form
      setForm({
        name: "",
        location: "",
        type: "residential",
        startingPrice: "",
        maxPrice: "",
        installmentYears: "",
        description: "",
        features: "",
      });

      fetchProjects();

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===============================
     Delete Project
  =================================*/
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  /* ===============================
     Loading State
  =================================*/
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" />
      </div>
    );
  }

  return (
    <div>

      <h2 className="fw-bold mb-4">🏗 Projects Management</h2>

      {/* ===============================
           Create Project Form
      =================================*/}
      <div className="card shadow-sm p-4 mb-5 rounded-4">
        <h5 className="mb-3">➕ Add New Project</h5>

        <div className="row g-3">

          <div className="col-md-4">
            <input
              name="name"
              placeholder="Project Name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              name="location"
              placeholder="Location"
              className="form-control"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <select
              name="type"
              className="form-control"
              value={form.type}
              onChange={handleChange}
            >
              <option value="residential">Residential</option>
              <option value="investment">Investment</option>
            </select>
          </div>

          <div className="col-md-4">
            <input
              name="startingPrice"
              type="number"
              placeholder="Starting Price"
              className="form-control"
              value={form.startingPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              name="maxPrice"
              type="number"
              placeholder="Max Price"
              className="form-control"
              value={form.maxPrice}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <input
              name="installmentYears"
              type="number"
              placeholder="Installment Years"
              className="form-control"
              value={form.installmentYears}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <input
              name="features"
              placeholder="Features (comma separated)"
              className="form-control"
              value={form.features}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <textarea
              name="description"
              placeholder="Description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
            />
          </div>

        </div>

        <button
          className="btn btn-dark mt-3"
          onClick={handleCreate}
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Project"}
        </button>

      </div>

      {/* ===============================
           Projects Grid
      =================================*/}
      <div className="row g-4">

        {projects.length === 0 && (
          <div className="text-center py-5">
            No projects found
          </div>
        )}

        {projects.map((project) => (
          <div className="col-md-6 col-lg-4" key={project._id}>
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100">

              <div className="d-flex justify-content-between">
                <h5 className="fw-bold">{project.name}</h5>

                <span className="badge bg-success">
                  {project.type}
                </span>
              </div>

              <p className="text-muted mb-1">
                📍 {project.location}
              </p>

              <p className="small">
                {project.description}
              </p>

              <div className="small">
                <strong>Price:</strong>{" "}
                {project.startingPrice?.toLocaleString()} -{" "}
                {project.maxPrice?.toLocaleString()}
              </div>

              <div className="small">
                <strong>Installment:</strong>{" "}
                {project.installmentYears} years
              </div>

              {/* Features Display */}
              {project.features?.length > 0 && (
                <div className="mt-2">
                  <strong>Features:</strong>
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {project.features.map((f, i) => (
                      <span
                        key={i}
                        className="badge bg-light text-dark border"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-3">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleDelete(project._id)}
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}