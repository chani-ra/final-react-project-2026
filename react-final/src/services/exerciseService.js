import axiosConfig from "./axiosConfig";

// קבלת תרגיל לפי מזהה
export const getExerciseById = async (exerciseId) => {
  try {
    const response = await axiosConfig.get(`/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת התרגיל";
  }
};

// סימון תרגיל כהושלם
export const markExerciseCompleted = async (exerciseId) => {
  try {
    const response = await axiosConfig.post(`/exercises/${exerciseId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בסימון התרגיל כהושלם";
  }
};