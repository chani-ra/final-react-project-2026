import axiosConfig from "./axiosConfig";
import { clearAuthStorage } from "./authSession";

let currentUserRequest = null;

export const getCurrentUser = () => {
  if (!currentUserRequest) {
    currentUserRequest = axiosConfig.get("/users/profile")
      .then((response) => response.data.user)
      .finally(() => {
        currentUserRequest = null;
      });
  }
  return currentUserRequest;
};

export const loginUser = async (email, password) => {
  try {
    const response = await axiosConfig.post("/users/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "שגיאה בהתחברות לשרת";
  }
};

export const registerNewUser = async (userData) => {
  try {
    const response = await axiosConfig.post("/users/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "שגיאה בהרשמה לשרת";
  }
};

export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("לא נמצא refresh token");
    }

    const response = await axiosConfig.post("/users/refresh-token", {
      refreshToken,
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    if (response.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ברענון ההתחברות";
  }
};

export { clearAuthStorage };
