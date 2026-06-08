import axios from "axios";

// כתובת השרת במקום אחד בלבד
export const API_BASE_URL = "http://localhost:3000";

// יצירת מופע האקסיוס עם כתובת השרת
const instance = axios.create({
  baseURL: API_BASE_URL,
});

// שומר הסף שמוסיף את הטוקן אוטומטית לכל בקשה
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;