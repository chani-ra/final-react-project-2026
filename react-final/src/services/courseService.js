import axiosConfig from "./axiosConfig";

// קבלת הקורסים שהתלמיד רשום אליהם
export const getMyCourses = async () => {
  try {
    const response = await axiosConfig.get("/courses/enrolled");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת הקורסים שלי";
  }
};

// קבלת קורסים מומלצים לפי פרופיל התלמיד
export const getRecommendedCourses = async () => {
  try {
    const response = await axiosConfig.get("/courses/recommended");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת קורסים מומלצים";
  }
};

// הרשמה לקורס קיים
export const enrollInCourse = async (courseId) => {
  try {
    const response = await axiosConfig.post(`/courses/${courseId}/enroll`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בהרשמה לקורס";
  }
};

// קבלת קורס לפי מזהה
export const getCourseById = async (courseId) => {
  try {
    const response = await axiosConfig.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת הקורס";
  }
};

// רענון קורס אישי קיים וחיפוש תכנים חדשים שמתאימים לתלמיד
export const refreshPersonalizedCourse = async (courseId) => {
  try {
    const response = await axiosConfig.post(
      `/courses/${courseId}/refresh-personalized`
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ברענון המסלול האישי";
  }
};

// יצירת קורס אישי נוסף לתלמיד מחובר, בלי הרשמה מחדש
export const createPersonalizedCourse = async (coursePreferences) => {
  try {
    const response = await axiosConfig.post(
      "/courses/create-personalized",
      coursePreferences
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת קורס אישי נוסף";
  }
};