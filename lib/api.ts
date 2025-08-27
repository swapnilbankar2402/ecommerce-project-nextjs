import axios, { AxiosError } from "axios";

const getCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh helper
async function refreshAccessToken() {
  await axios.post("/api/auth/refresh", {}, { withCredentials: true });
  return getCookie("accessToken");
}

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as any;

    // Handle expired token
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }

    // 🔑 Normalize error so frontend can always use error.message
    return Promise.reject(
      new Error(
        (error.response?.data?.error as string) ||
          error.message ||
          "Something went wrong"
      )
    );
  }
);

export default api;
