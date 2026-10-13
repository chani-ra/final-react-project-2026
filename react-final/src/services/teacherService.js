import axiosConfig from "./axiosConfig";

/**
 * 1. משיכת נתונים ללוח הבקרה של מורה
 */
export const getTeacherDashboardData = async (instructorId) => {
  try {
    if (!instructorId) {
      throw new Error("חסר מזהה מורה לטעינת לוח הבקרה");
    }

    const statsResponse = await axiosConfig.get(`/lessons/stats/${instructorId}`);

    const lessonsResponse = await axiosConfig.get(
      `/lessons/instructor/${instructorId}?limit=5`
    );

    return {
      stats: statsResponse.data.stats,
      lessons: lessonsResponse.data.lessons || [],
    };
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "נכשל בטעינת נתוני לוח הבקרה"
    );
  }
};

/**
 * 2. העלאת שיעור חדש
 */
export const createLesson = async (formData) => {
  try {
    const response = await axiosConfig.post("/lessons/upload", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בהוספת השיעור במערכת";
  }
};

/**
 * 3. העלאת שיר חדש
 */
export const uploadSong = async (formData) => {
  try {
    const response = await axiosConfig.post("/songs/song", formData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בהעלאת השיר לשרת";
  }
};

/**
 * 4. משיכת כל השיעורים שהמורה העלה
 */
export const getTeacherLessons = async (instructorId) => {
  try {
    const response = await axiosConfig.get(`/lessons/instructor/${instructorId}`);
    return response.data.lessons || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת השיעורים שלך";
  }
};

/**
 * 5. משיכת כל השירים שהמורה העלה
 */
export const getTeacherSongs = async (instructorId) => {
  try {
    const response = await axiosConfig.get(`/songs/instructor/${instructorId}`);
    return response.data.songs || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת השירים שלך";
  }
};

/**
 * 6. מחיקת שיעור
 */
export const deleteLesson = async (lessonId) => {
  try {
    const response = await axiosConfig.delete(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת השיעור";
  }
};

/**
 * 7. מחיקת שיר
 */
export const deleteSong = async (songId) => {
  try {
    const response = await axiosConfig.delete(`/songs/song/${songId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת השיר";
  }
};

/**
 * 8. עדכון שיעור
 */
export const updateLesson = async (lessonId, data) => {
  try {
    const response = await axiosConfig.put(`/lessons/${lessonId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון השיעור";
  }
};

/**
 * 9. עדכון שיר
 */
export const updateSong = async (songId, data) => {
  try {
    const response = await axiosConfig.put(`/songs/song/${songId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון השיר";
  }
};

/**
 * 10. שינוי מצב פרסום של שיעור
 */
export const updateLessonPublishStatus = async (lessonId, isPublic) => {
  try {
    const response = await axiosConfig.put(`/lessons/${lessonId}`, {
      isPublic,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון מצב פרסום השיעור";
  }
};

/**
 * 11. שינוי מצב פרסום של שיר
 */
export const updateSongPublishStatus = async (songId, isPublic) => {
  try {
    const response = await axiosConfig.put(`/songs/song/${songId}`, {
      isPublic,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון מצב פרסום השיר";
  }
};

/**
 * 12. פנייה לרכיב AI — בהמשך נרחיב
 */
export const askAIHelper = async (message) => {
  try {
    const response = await axiosConfig.post("/ai/conversation", {
      message,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "שגיאה בתקשורת מול רכיב ה-AI";
  }
};

/**
 * 13. יצירת בוחן
 */
export const createQuiz = async (quizData) => {
  try {
    const response = await axiosConfig.post("/quizzes", quizData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת הבוחן במערכת";
  }
};

export default axiosConfig;