import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:5001/api",
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;