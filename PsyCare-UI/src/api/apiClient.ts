import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5056/api",
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;