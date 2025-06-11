import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Lấy biến môi trường từ Vite
// const serverUrl = import.meta.env.VITE_SERVER_URL;
const serverUrl = "http://192.168.1.4:8000";

// Tạo axios instance với cấu hình sẵn
const axiosInstance = axios.create({
  baseURL: `${serverUrl}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Tăng timeout lên 15 giây
  withCredentials: true,
  // Thêm cấu hình cho cookie trong môi trường development
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  // Thêm cấu hình để xử lý lỗi kết nối
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Chấp nhận tất cả status code từ 200-499
  },
  // Thêm cấu hình retry
  retry: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Thời gian chờ giữa các lần retry
  },
});

// Hàm retry request
const retryRequest = async (error: AxiosError) => {
  const config = error.config as AxiosRequestConfig & { __retryCount?: number };
  if (!config) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= 3) {
    // Số lần retry cố định là 3
    return Promise.reject(error);
  }

  config.__retryCount += 1;
  const backoff = new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, config.__retryCount! * 1000); // Thời gian chờ giữa các lần retry
  });

  await backoff;
  return axiosInstance(config);
};

// Interceptor: thêm token vào request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Thêm CSRF token nếu có
    const csrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: xử lý response và retry nếu cần
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return retryRequest(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !error.config._retry
    ) {
      error.config._retry = true;

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
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;

        return axiosInstance(error.config);
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
