import axios from "axios";

export const AUTH_TOKEN_KEY = "auth_token";

const rawBaseUrl = import.meta.env?.VITE_API_URL || "http://localhost:3000";
export const apiBaseUrl = rawBaseUrl.replace(/\/$/, "");

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function apiPath(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (apiBaseUrl.endsWith("/api")) {
    return normalizedPath.startsWith("/api/")
      ? normalizedPath.replace(/^\/api/, "")
      : normalizedPath;
  }

  return normalizedPath.startsWith("/api/") ? normalizedPath : `/api${normalizedPath}`;
}

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      window.dispatchEvent(new Event("auth:unauthorized"));

      const publicPaths = ["/", "/login", "/register"];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath)) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
