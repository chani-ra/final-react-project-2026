import axios from "axios";

// כתובת השרת במקום אחד בלבד
export const API_BASE_URL = "http://localhost:3000";

// יצירת מופע האקסיוס עם כתובת השרת
const instance = axios.create({
  baseURL: API_BASE_URL,
});

// משתנים שעוזרים למנוע כמה רענוני token במקביל
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(token);
    }
  });

  failedQueue = [];
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("user");
};

// שומר הסף שמוסיף את הטוקן אוטומטית לכל בקשה
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// שומר הסף שמזהה token שפג תוקף ומנסה לרענן אותו
instance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/users/login") ||
      originalRequest?.url?.includes("/users/register") ||
      originalRequest?.url?.includes("/users/refresh-token") ||
      originalRequest?.url?.includes("/users/create-first-admin");

    if (status !== 401 || originalRequest?._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      clearAuthStorage();
      return Promise.reject(error);
    }

    // אם כבר יש רענון token פעיל, הבקשה הזאת תחכה לתוצאה שלו
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      
      const response = await axios.post(`${API_BASE_URL}/users/refresh-token`, {
        refreshToken,
      });

      const newToken = response.data.token || response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      if (!newToken) {
        throw new Error("השרת לא החזיר token חדש");
      }

      localStorage.setItem("token", newToken);

      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      processQueue(null, newToken);

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return instance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthStorage();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;