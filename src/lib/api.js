
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/calls`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch calls");
  }
  return res.json();
};

export const getProjects=async()=>{
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/projects`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch projects");
  }
  return res.json();
};

export const deleteProject = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete project");
  }

  return res.json();
};

export const getCallById = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/calls/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch call");
  }
  
  return res.json();
};


 export const createProject = async (projectData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/api/projects`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.log("CREATE ERROR:", data);
    throw new Error(data.message || "Failed to create project");
  }

  return data;
};
 
export const getChat = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/conversations`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch conversations:", res.status, res.statusText);
    return []; // بدل ما يرجع خطأ null، ارجع مصفوفة فاضية
  }

  const data = await res.json();
  return data || []; // لو null أو undefined ارجع array فاضية
};  

export const getChatById = async (id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/conversations/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Failed to fetch conversation ${id}:`, res.status, res.statusText);
    return null; // لو في مشكلة نرجع null
  }

  const data = await res.json();
  return data || null; // لو null أو undefined ارجع null
};