"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatbotPage() {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionId = "dashboard_voice_1";

  /* =========================
     اتصال Socket
  ==========================*/
  useEffect(() => {
        const socket = io(process.env.NEXT_PUBLIC_API_BASE, {
        query: { sessionId: "dashboard_voice_1" },
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
      sessionId,
      message: input,
    });

    setInput("");
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
        sessionId,
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
   Styles
==========================*/
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f3f4f6",
  },
  chatBox: {
    width: "400px",
    height: "600px",
    background: "white",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  message: {
    padding: "10px 14px",
    borderRadius: "18px",
    maxWidth: "75%",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    border: "none",
  },
  voiceButton: {
    padding: "8px 12px",
    borderRadius: "8px",
    background: "#10b981",
    color: "white",
    border: "none",
  },
};