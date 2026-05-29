import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  // Attach JWT later when authentication is connected:
  // config.headers.Authorization = "Bearer <token>";
  return config;
});

export default axiosClient;
