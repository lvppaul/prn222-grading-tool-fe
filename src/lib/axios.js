import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ví dụ: http://localhost:5000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
