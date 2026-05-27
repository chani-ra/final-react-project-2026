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