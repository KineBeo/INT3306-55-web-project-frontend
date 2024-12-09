import axios from "axios";

const api = axios.create({
  baseURL: "https://int3306-55-web-project-backend-vumt.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest.url !== "/auth/refresh") {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const response = await api.post("/auth/refresh", { refreshToken });

            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;

            localStorage.setItem("access_token", newAccessToken);
            localStorage.setItem("refresh_token", newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            if (window.location.pathname.startsWith("/dashboard")) {
              window.location.href = "/dashboard/signin";
            } else {
              window.location.href = "/auth/signin";
            }
            return Promise.reject(refreshError);
          }
        }
      }
    }

    return Promise.reject(error); // Nếu không phải lỗi 401 hoặc không thể refresh token
  }
);

export default api;
