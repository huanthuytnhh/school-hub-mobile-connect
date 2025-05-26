import axios from "axios";

// Lấy biến môi trường từ Vite
// const serverUrl = import.meta.env.VITE_SERVER_URL;
const serverUrl = "http://127.0.0.1:8000";

// Tạo axios instance với cấu hình sẵn
const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Interceptor: thêm token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: xử lý response và refresh token nếu 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        interface RefreshTokenResponse {
          accessToken: string;
        }

        const { data } = await axios.post<RefreshTokenResponse>(
          `${serverUrl}/api/auth/refresh`,
          {
            refreshToken,
          }
        );

        localStorage.setItem("token", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // Có thể điều hướng về trang login ở đây nếu cần
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
