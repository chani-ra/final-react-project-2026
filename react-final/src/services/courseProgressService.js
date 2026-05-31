import axiosConfig from "./axiosConfig";

// קבלת התקדמות של קורס אחד
export const getMyCourseProgress = async (courseId) => {
  try {
    const response = await axiosConfig.get(`/course-progress/${courseId}`);
    return response.data.progress;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת התקדמות הקורס";
  }
};

// קבלת סיכום התקדמות כל הקורסים שלי
export const getMyCoursesProgressSummary = async () => {
  try {
    const response = await axiosConfig.get("/course-progress/summary/my");
    return response.data.summary;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת סיכום התקדמות הקורסים";
  }
};

// סימון פריט בקורס כבוצע / ביטול
export const toggleCourseItemProgress = async ({
  courseId,
  itemType,
  itemId,
  completed = true,
  totals = {},
}) => {
  try {
    const response = await axiosConfig.patch(
      `/course-progress/${courseId}/item`,
      {
        itemType,
        itemId,
        completed,
        totals,
      }
    );

    return response.data.progress;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון התקדמות הקורס";
  }
};

// חישוב מחדש של התקדמות הקורס
export const recalculateCourseProgress = async ({ courseId, totals }) => {
  try {
    const response = await axiosConfig.patch(
      `/course-progress/${courseId}/recalculate`,
      {
        totals,
      }
    );

    return response.data.progress;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בחישוב התקדמות הקורס";
  }
};