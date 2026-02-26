"use client";

import { useEffect, useState } from "react";
import { getCalls } from "../../lib/api";

export default function CallsPage() {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCalls();
      setCalls(data);
    };

    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">📞 Call History</h2>

      <div className="row">
        {calls.map((call) => (
          <div className="col-md-6 mb-4" key={call._id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  From: {call.from}
                </h5>

                <p className="card-text">
                  <strong>To:</strong> {call.to}
                </p>

                <p className="card-text">
                  <strong>Status:</strong>{" "}
                  <span className="badge bg-primary">
                    {call.status}
                  </span>
                </p>

                <p className="card-text">
                  <strong>Messages:</strong>{" "}
                  {call.messages?.length || 0}
                </p>

                <p className="card-text text-muted">
                  {new Date(call.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}