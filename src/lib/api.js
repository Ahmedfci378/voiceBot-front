export const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const startCall = async (phoneNumber) => {
  const res = await fetch(`${API_BASE}/api/outbound/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber }),
  });

  return res.json();
};

export const getCalls = async () => {
  const res = await fetch(`${API_BASE}/api/calls`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calls");
  }

  return res.json();
};