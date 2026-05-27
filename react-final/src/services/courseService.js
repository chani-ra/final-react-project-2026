import axiosConfig from "./axiosConfig";

export const getMyCourses = async () => {
  try {
    const response = await axiosConfig.get("/courses/enrolled");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת הקורסים שלי";
  }
};

export const getRecommendedCourses = async () => {
  try {
    const response = await axiosConfig.get("/courses/recommended");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת קורסים מומלצים";
  }
};

export const enrollInCourse = async (courseId) => {
  try {
    const response = await axiosConfig.post(`/courses/${courseId}/enroll`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בהרשמה לקורס";
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await axiosConfig.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת הקורס";
  }
};

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