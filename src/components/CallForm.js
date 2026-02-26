"use client";
import { useState } from "react";
import { startCall } from "../lib/api";

export default function CallForm() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const data = await startCall(phone);
      setResult(data);
    } catch (err) {
      setResult({ error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-80">
      <h1 className="text-2xl font-bold text-center">VoiceBot Dashboard</h1>

      <input
        type="text"
        placeholder="Enter phone number"
        className="border p-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white py-2 rounded"
      >
        {loading ? "Calling..." : "Start Call"}
      </button>

      {result && (
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}