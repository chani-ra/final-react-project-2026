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
export const getTeacherDashboardData = async (instructorId) => {
  try {
    // 1. קריאה לסטטיסטיקות של המורה
    const statsResponse = await axiosConfig.get(`/lessons/stats/${instructorId}`);
    
    // 2. קריאה לרשימת השיעורים האחרונים שהמורה העלה
    const lessonsResponse = await axiosConfig.get(`/lessons/instructor/${instructorId}?limit=5`);

    return {
      stats: statsResponse.data.stats,
      lessons: lessonsResponse.data.lessons
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

/**
 * 5. יצירת בוחן חדש לשיעור (Quizzes)
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await axiosConfig.post('/quizzes', quizData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל ביצירת הבוחן במערכת';
  }
};

/**
 * 6. משיכת כל השיעורים שהמורה הנוכחי העלה (עבור "הספרייה שלי")
 */
export const getTeacherLessons = async (instructorId) => {
  try {
    const response = await axiosConfig.get(`/lessons/instructor/${instructorId}`);
    return response.data.lessons || response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בטעינת השיעורים שלך';
  }
};

/**
 * 7. משיכת כל השירים שהמורה הנוכחי העלה (עבור "הספרייה שלי")
 */
export const getTeacherSongs = async (instructorId) => {
  try {
    const response = await axiosConfig.get(`/songs/instructor/${instructorId}`);
    return response.data.songs || response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בטעינת השירים שלך';
  }
};

// 8. מחיקת שיר
export const deleteSong = async (songId) => {
  try {
    const response = await axiosConfig.delete(`/songs/song/${songId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל במחיקת השיר';
  }
};

// 9. עדכון שיר
export const updateSong = async (songId, formData) => {
  try {
    const response = await axiosConfig.put(`/songs/song/${songId}`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל בעדכון השיר';
  }
};

export const deleteLesson = async (lessonId) => {
  try {
    const response = await axiosConfig.delete(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'נכשל במחיקת השיעור';
  }
};