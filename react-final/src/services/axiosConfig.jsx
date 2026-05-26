import axios from "axios";

// יצירת מופע האקסיוס עם כתובת השרת שלנו
const instance = axios.create({
    baseURL: 'http://localhost:3000/', // שימי לב לוודא שזה הפורט הנכון של השרת שלך
});

// "שומר הסף" שמוסיף את הטוקן אוטומטית לכל בקשה
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

export default instance;