import axiosConfig from "./axiosConfig";

// קבלת תרגיל לפי מזהה עבור תלמיד
export const getExerciseById = async (exerciseId) => {
  try {
    const response = await axiosConfig.get(`/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת התרגיל";
  }
};

// סימון תרגיל כהושלם עבור תלמיד
export const markExerciseCompleted = async (exerciseId) => {
  try {
    const response = await axiosConfig.post(`/exercises/${exerciseId}/complete`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בסימון התרגיל כהושלם";
  }
};

// יצירת תרגיל חדש על ידי מורה
export const createExercise = async (exerciseData) => {
  try {
    const response = await axiosConfig.post("/exercises/create", exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת התרגיל";
  }
};

// קבלת תרגילים של מורה
export const getTeacherExercises = async (teacherId) => {
  try {
    const response = await axiosConfig.get(`/exercises/teacher/${teacherId}`);
    return response.data.exercises || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת התרגילים של המורה";
  }
};

// עדכון תרגיל על ידי מורה
export const updateExercise = async (exerciseId, exerciseData) => {
  try {
    const response = await axiosConfig.put(`/exercises/${exerciseId}`, exerciseData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון התרגיל";
  }
};

// מחיקת תרגיל על ידי מורה
export const deleteExercise = async (exerciseId) => {
  try {
    const response = await axiosConfig.delete(`/exercises/${exerciseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת התרגיל";
  }
};

// יצירת טיוטת תרגיל בעזרת AI
export const generateExerciseWithAI = async (aiData) => {
  try {
    const response = await axiosConfig.post("/ai/generate-exercise", aiData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת תרגיל בעזרת AI";
  }
};