"use client";

import { getProjects } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProjectsPage() {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjects();
        setProjects(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div>

      <h2 className="mb-4 fw-bold">🏗 Active Projects</h2>

      <div className="row g-4">

        {projects.map((project) => (
          <div className="col-md-6" key={project._id}>
            <div className="card shadow-sm border-0 rounded-4 p-3 h-100">

              <h5 className="fw-bold">{project.name}</h5>
              <p className="text-muted">{project.location}</p>

              <p>{project.description}</p>

              <div className="mt-2">
                <strong>Price:</strong>{" "}
                {project.startingPrice.toLocaleString()} -{" "}
                {project.maxPrice.toLocaleString()}
              </div>

              <div className="mt-2">
                <strong>Installment:</strong>{" "}
                {project.installmentYears} years
              </div>

              <div className="mt-2">
                <strong>Features:</strong>
                <ul>
                  {project.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}