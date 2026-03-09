"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatbotPage() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionIdRef = useRef("dashboard_voice_1"); // نستخدم ref علشان نقدر نغيره

  /* =========================
     اتصال Socket
  ==========================*/
  useEffect(() => {
    const socket = io("http://localhost:3000", {
      query: { sessionId: sessionIdRef.current },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected");
    });

    socket.on("bot_response", (data) => {
      addMessage("bot", data.message);
      speak(data.message);
    });

    // ==== استقبال إعادة الشات ====
    socket.on("chat_reset", (data) => {
      setMessages([]); // نمسح الرسائل القديمة
      sessionIdRef.current = data.sessionId; // نحدث sessionId
      addMessage("bot", data.message); // رسالة تأكيد
    });

    return () => socket.disconnect();
  }, []);

  /* =========================
     إضافة رسالة
  ==========================*/
  const addMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  /* =========================
     إرسال رسالة Text
  ==========================*/
  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage("user", input);

    socketRef.current.emit("user_message", {
      sessionId: sessionIdRef.current,
      message: input,
    });

    setInput("");
  };

  /* =========================
     بدء شات جديد
  ==========================*/
  const startNewChat = () => {
    socketRef.current.emit("new_chat", { sessionId: sessionIdRef.current });
  };

  /* =========================
     Voice
  ==========================*/
  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ar-EG";

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      addMessage("user", text);

      socketRef.current.emit("user_message", {
        sessionId: sessionIdRef.current,
        message: text,
      });
    };

    recognition.start();
  }

  /* =========================
     Speech
  ==========================*/
  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ar-EG";
    speechSynthesis.speak(utterance);
  }

  /* =========================
     Scroll تلقائي
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
        <h2>🤖 AI Assistant</h2>

        <div style={{ marginBottom: "10px" }}>
          {/* زر شات جديد */}
          <button onClick={startNewChat} style={styles.newChatButton}>
            🆕 New Chat
          </button>
        </div>

        <div style={styles.messages}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.message,
                alignSelf:
                  msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user" ? "#2563eb" : "#e5e7eb",
                color:
                  msg.role === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك..."
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage} style={styles.button}>
            Send
          </button>

          <button onClick={startListening} style={styles.voiceButton}>
            🎤
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Styles كاملة
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
    width: "420px",
    maxWidth: "95%",
    height: "650px",
    background: "#ffffff",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    border: "2px solid #e5e7eb",
    overflow: "hidden",
  },
  header: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#4b5563",
    textAlign: "center",
    marginBottom: "15px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    paddingRight: "5px",
    marginBottom: "10px",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "20px",
    maxWidth: "75%",
    lineHeight: "1.4",
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
  button: {
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  voiceButton: {
    padding: "12px 16px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #10b981, #14b8a6)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
  },
  newChatButton: {
    padding: "8px 12px",
    borderRadius: "12px",
    background: "linear-gradient(90deg, #f59e0b, #d97706)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
  },
};