"use client";

import { useEffect, useState, useRef } from "react";
import { getChat } from "@/lib/api";
import { FiMessageSquare, FiUser, FiCpu } from "react-icons/fi";

export default function ChatsPage() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const data = await getChat();
        console.log("Fetched conversations:", data);

        setConversations(data);

        if (data && data.length > 0) {
          setSelected(data[data.length - 1]);
        } else {
          setSelected(null);
        }
      } catch (err) {
        console.error(err);
        setConversations([]);
        setSelected(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selected]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Loading conversations...</h5>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">

      {/* LEFT PANEL - SESSIONS */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
          background: "#fff",
          flexShrink: 0, // مهم عشان Right Panel يظهر
        }}
      >
        <div className="p-3 border-bottom bg-primary text-white">
          <h5 className="mb-0 d-flex align-items-center">
            <FiMessageSquare className="me-2" />
            Conversations
          </h5>
        </div>

        {conversations.map((conv) => (
          <div
            key={conv._id}
            onClick={() => setSelected(conv)}
            className={`p-3 border-bottom`}
            style={{
              cursor: "pointer",
              background:
                selected?._id === conv._id ? "#eef2ff" : "transparent",
              transition: "background 0.2s",
            }}
          >
            <div className="fw-semibold text-truncate">
              Session: {conv.sessionId}
            </div>
            <small className="text-muted">{conv.messages.length} messages</small>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL - CHAT */}
      <div
        className="d-flex flex-column flex-grow-1"
        style={{
          minWidth: 0, // مهم عشان flex-grow يشتغل كويس
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <div
          className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white shadow-sm"
        >
          <div>
            <h6 className="mb-0 fw-bold">
              {selected ? `Session: ${selected.sessionId}` : "No session selected"}
            </h6>
          </div>
          <div className="text-muted small">
            {selected?.messages?.length || 0} Messages
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          className="flex-grow-1 p-4 overflow-auto"
          style={{ background: "#f5f7fb" }}
        >
          {selected?.messages?.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-3 ${
                msg.role === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                style={{
                  maxWidth: "65%",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  background: msg.role === "user" ? "#4f46e5" : "#ffffff",
                  color: msg.role === "user" ? "#fff" : "#333",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  wordBreak: "break-word",
                }}
              >
                <div className="d-flex align-items-center mb-1">
                  {msg.role === "user" ? (
                    <FiUser className="me-2 text-white" />
                  ) : (
                    <FiCpu className="me-2 text-secondary" />
                  )}
                  <small className="fw-semibold">
                    {msg.role === "user" ? "User" : "AI"}
                  </small>
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          ))}

          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}