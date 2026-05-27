import axios from 'axios';

const API_URL = 'http://localhost:3000';

const axiosConfig = axios.create({
    baseURL: API_URL,
});

axiosConfig.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * 1. משיכת נתונים ללוח הבקרה (תצוגה ראשונית)
 */
export const getTeacherDashboardData = async () => {
  try {
    // ⚠️ זמני: השרת שלך כרגע חוסם את נתיבי ה- GET /courses ו- GET /exercises
    // לכן ביטלנו את הקריאות אליהם כדי למנוע את שגיאת ה-404.
    // כשתסיימי לבנות את הקונטרולרים בשרת, תוכלי להחזיר את הקריאות מול השרת.
    
    return {
      stats: {
        totalStudents: 28,
        activeCourses: 5, // נתון דמי במקום קריסה
        pendingExercises: 12 // נתון דמי במקום קריסה
      },
      students: [
        { id: 1, name: 'ישראל ישראלי', email: 'israel@gmail.com', progress: '85%', lastActive: 'היום' },
        { id: 2, name: 'נועה כהן', email: 'noah@gmail.com', progress: '92%', lastActive: 'אתמול' }
      ]
    };
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בטעינת נתוני לוח הבקרה';
  }
};

/**
 * 2. העלאת שיעור חדש 
 */
export const createLesson = async (formData) => {  
  try {
    const response = await axiosConfig.post('/lessons/upload', formData); 
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בהוספת השיעור במערכת';
  }
};

/**
 * 3. העלאת שיר חדש 
 */
export const uploadSong = async (formData) => {
  try {
    // ✅ התיקון: הנתיב שונה ל- /songs/song לפי ההגדרה בשרת
    // ✅ Axios מזהה לבד שזה FormData ומגדיר Multipart אוטומטית!
    const response = await axiosConfig.post('/songs/song', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בהעלאת השיר לשרת';
  }
};

/**
 * 4. פנייה לרכיב ה-AI 
 */
export const askAIHelper = async (prompt) => {
  try {
    const response = await axiosConfig.post('/ai', { prompt });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'שגיאה בתקשורת מול רכיב ה-AI';
  }
};