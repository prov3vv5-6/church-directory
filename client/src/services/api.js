import axios from "axios";

// Pre-configured axios instance pointing at our backend.
// The interceptor runs before every request and attaches the JWT if one exists,
// so individual service functions don't have to think about auth headers.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
