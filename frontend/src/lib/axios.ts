import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { AUTH_CONFIG } from "../const/auth";

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
      localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ROLE);

      // Redirect to login or dispatch logout action
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
