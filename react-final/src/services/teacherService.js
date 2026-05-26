import axios from 'axios';

const API_URL = 'http://localhost:3000';

// יצירת קונפיגורציה בסיסית לאקסיוס
const axiosConfig = axios.create({
    baseURL: API_URL,
});

// הזרקת הטוקן המאובטח באופן אוטומטי לכל הבקשות
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
    // פונים במקביל לנתיבי השרת שלך: /courses ו- /exercises
    const [coursesRes, exercisesRes] = await Promise.all([
      axiosConfig.get('/courses'),
      axiosConfig.get('/exercises')
    ]);

    return {
      stats: {
        totalStudents: 28, // זמני, עד שנגדיר נתיב משתמשים בשרת
        activeCourses: coursesRes.data?.length || 0,
        pendingExercises: exercisesRes.data?.length || 0
      },
      students: [
        { id: 1, name: 'ישראל ישראלי', email: 'israel@gmail.com', progress: '85%', lastActive: 'היום' },
        { id: 2, name: 'נועה כהן', email: 'noah@gmail.com', progress: '92%', lastActive: 'אתמול' }
      ] // נתוני תצוגה לטבלה
    };
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בטעינת נתוני לוח הבקרה';
  }
};

/**
 * 2. העלאת שיעור חדש (פונה לנתיב app.use('/lessons', lessonRoutes) בשרת שלך)
 */
export const createLesson = async (formData) => {  try {
    // שליחת בקשת POST לנתיב השיעורים עם האובייקט של השיעור החדש
const response = await axiosConfig.post('/lessons/upload', formData); // שימי לב ל- /upload בסוף!    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בהוספת השיעור במערכת';
  }
};

/**
 * 3. העלאת שיר חדש (פונה לנתיב app.use('/songs', songsRoutes) בשרת שלך)
 * שימי לב: העלאת שיר כוללת קובץ אודיו, לכן נשתמש ב-FormData ובכותרת multipart/form-data
 */
export const uploadSong = async (formData) => {
  try {
    const response = await axiosConfig.post('/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בהעלאת השיר לשרת';
  }
};

/**
 * 4. פנייה לרכיב ה-AI (פונה לנתיב app.use('/ai', aiRoutes) בשרת שלך)
 */
export const askAIHelper = async (prompt) => {
  try {
    // שולחים לשרת את השאלה או הבקשה של המורה (למשל: "צור לי תרגיל לבדיקה")
    const response = await axiosConfig.post('/ai', { prompt });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'שגיאה בתקשורת מול רכיב ה-AI';
  }
};