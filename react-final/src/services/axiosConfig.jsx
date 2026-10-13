import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import { clearAuthStorage, getSessionVersion } from "./authSession";

// כתובת השרת במקום אחד בלבד
const rawApiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const apiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

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

const invalidateSession = () => {
  clearAuthStorage();
  store.dispatch(logoutUser());
};

// שומר הסף שמוסיף את הטוקן אוטומטית לכל בקשה
instance.interceptors.request.use(
  (config) => {
    config._authSessionVersion = getSessionVersion();
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

    // Responses from a previous login must not affect a newer session.
    if (originalRequest?._authSessionVersion !== undefined &&
      originalRequest._authSessionVersion !== getSessionVersion()) {
      return Promise.reject(error);
    }

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
      invalidateSession();
      return Promise.reject(error);
    }

    // אם כבר יש רענון token פעיל, הבקשה הזאת תחכה לתוצאה שלו
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          if (originalRequest._authSessionVersion !== getSessionVersion()) {
            throw new Error("Session changed while waiting for token refresh");
          }
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {

      const response = await axios.post(apiUrl("/users/refresh-token"), {
        refreshToken,
      });

      const newToken = response.data.token || response.data.accessToken;
      const newRefreshToken = response.data.refreshToken;

      if (!newToken) {
        throw new Error("השרת לא החזיר token חדש");
      }

      // Do not resurrect an old session after a manual logout or new login.
      if (localStorage.getItem("refreshToken") !== refreshToken) {
        throw new Error("Session changed during token refresh");
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
      // Keep the session on network/server errors so the user can retry.
      const invalidRefresh = [400, 401, 403].includes(refreshError.response?.status) ||
        refreshError.message === "השרת לא החזיר token חדש";

      if (invalidRefresh && localStorage.getItem("refreshToken") === refreshToken) {
        invalidateSession();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default instance;
