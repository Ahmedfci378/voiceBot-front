"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, Mic, RefreshCw } from "lucide-react";

export default function ChatbotPage() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionIdRef = useRef("dashboard_voice_1");

  /* =========================
     Socket Connection
  ==========================*/
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      query: { sessionId: sessionIdRef.current },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to server"));

    socket.on("bot_response", (data) => addMessage("bot", data.message));

    socket.on("bot_audio", (audioBuffer) => {
      const blob = new Blob([audioBuffer], { type: "audio/mp3" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    });

    socket.on("chat_reset", (data) => {
      setMessages([]);
      sessionIdRef.current = data.sessionId;
      addMessage("bot", data.message);
    });

    return () => socket.disconnect();
  }, []);

  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    addMessage("user", input);
    socketRef.current.emit("user_message", {
      sessionId: sessionIdRef.current,
      message: input,
    });
    setInput("");
  };

  const startNewChat = () => {
    socketRef.current.emit("new_chat", { sessionId: sessionIdRef.current });
  };

  /* =========================
     Voice Recognition
  ==========================*/
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-EG";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      addMessage("user", text);
      socketRef.current.emit("user_message", {
        sessionId: sessionIdRef.current,
        message: text,
      });
    };

    recognition.onerror = (event) =>
      console.error("SpeechRecognition Error:", event.error);

    recognition.start();
  };

  /* =========================
     Scroll to latest message
  ==========================*/
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     UI
  ==========================*/
  return (
    <div style={styles.container}>
      <div style={styles.chatBox}>
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>AI Assistant</h2>
          <button style={styles.newChatButton} onClick={startNewChat}>
            <RefreshCw size={18} /> New Chat
          </button>
        </div>

        <div style={styles.messages}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user" ? "#4f46e5" : "#f3f4f6",
                color: msg.role === "user" ? "#fff" : "#111827",
              }}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.sendButton} onClick={sendMessage}>
            <Send size={20} />
          </button>
          <button style={styles.voiceButton} onClick={startListening}>
            <Mic size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Styles
==========================*/
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "'Inter', sans-serif",
    padding: "20px",
  },
  chatBox: {
    width: "440px",
    maxWidth: "95%",
    height: "650px",
    background: "#fff",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    border: "2px solid #e5e7eb",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  headerTitle: { fontSize: "1.5rem", fontWeight: "700", color: "#111827" },
  newChatButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #f59e0b, #d97706)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingRight: "5px",
    marginBottom: "12px",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "20px",
    maxWidth: "75%",
    lineHeight: 1.4,
    wordBreak: "break-word",
    fontSize: "0.95rem",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "0.95rem",
    transition: "border 0.2s",
  },
  sendButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  voiceButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #10b981, #14b8a6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};