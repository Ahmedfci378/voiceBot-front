export const startCall = async (phoneNumber) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/outbound/call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber }),
  });

  const data = await res.json();

  if (!res.ok) {
    // نرمي الخطأ الحقيقي
    throw data;
  }

  return data;
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

export const getCallById = async (id) => {
  const res = await fetch(`${API_BASE}/api/calls/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch call");
  }

  return res.json();
};