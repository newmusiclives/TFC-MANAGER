// Shared API client for frontend pages
// Handles auth token, error handling, and response parsing

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Send cookies
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(data.error || "Request failed", res.status);
  }

  return res.json();
}

export const apiGet = <T = unknown>(endpoint: string) => api<T>(endpoint);

export const apiPost = <T = unknown>(endpoint: string, body: unknown) =>
  api<T>(endpoint, { method: "POST", body: JSON.stringify(body) });

export const apiPatch = <T = unknown>(endpoint: string, body: unknown) =>
  api<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) });

export const apiDelete = <T = unknown>(endpoint: string) =>
  api<T>(endpoint, { method: "DELETE" });

// Upload helper (no JSON content-type)
export async function apiUpload(
  endpoint: string,
  formData: FormData
): Promise<{ url: string }> {
  const res = await fetch(endpoint, {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new ApiError(data.error || "Upload failed", res.status);
  }
  return res.json();
}
