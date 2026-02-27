"use client";

import { useEffect, useState } from "react";
import { getCallById } from "../../../lib/api";
import { useParams } from "next/navigation";

export default function CallDetails() {
  const { id } = useParams();
  const [call, setCall] = useState(null);

  useEffect(() => {
    const fetchCall = async () => {
      try {
        const data = await getCallById(id);
        setCall(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchCall();
  }, [id]);

  if (!call) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h2 className="mb-4">📞 Call Details</h2>

      <div className="card shadow p-4 mb-4">
        <p><strong>From:</strong> {call.from}</p>
        <p><strong>To:</strong> {call.to}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="badge bg-primary">
            {call.status}
          </span>
        </p>
      </div>

      <div className="card shadow p-4">
        <h5 className="mb-3">Conversation</h5>

        {call.messages?.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${
              msg.role === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-3 rounded ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-light"
              }`}
              style={{ maxWidth: "70%" }}
            >
              <div>{msg.content}</div>
              <small className="d-block mt-2 text-muted">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}