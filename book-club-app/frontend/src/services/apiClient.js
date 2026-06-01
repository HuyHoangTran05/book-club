import axios from "axios";
import { getToken } from "../utils/auth.js";

const rawBaseUrl = import.meta.env?.VITE_API_URL || "http://localhost:5000";
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");
const apiBaseUrl = normalizedBaseUrl.endsWith("/api")
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
