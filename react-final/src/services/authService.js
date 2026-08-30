import axiosConfig from "./axiosConfig";

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

export const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("user");
};