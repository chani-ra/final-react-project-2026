import { toApiError } from "./apiError.js";
import axiosConfig from "./axiosConfig";

// קבלת המשימות של המשתמש המחובר
export const getMyTasks = async () => {
  try {
    const response = await axiosConfig.get("/tasks/my");
    return response.data.tasks || [];
  } catch (error) {
    throw toApiError(error, "נכשל בטעינת המשימות");
  }
};

// יצירת משימה אחת
export const createTask = async (taskData) => {
  try {
    const response = await axiosConfig.post("/tasks", taskData);
    return response.data.task;
  } catch (error) {
    throw toApiError(error, "נכשל ביצירת המשימה");
  }
};

// יצירת כמה משימות יחד
export const createManyTasks = async ({ tasks, coachPlanFocus }) => {
  try {
    const response = await axiosConfig.post("/tasks/many", {
      tasks,
      coachPlanFocus,
    });

    return response.data.tasks || [];
  } catch (error) {
    throw toApiError(error, "נכשל בהוספת המשימות");
  }
};

// סימון משימה כבוצעה
export const completeTask = async (taskId) => {
  try {
    const response = await axiosConfig.patch(`/tasks/${taskId}/complete`);
    return response.data.task;
  } catch (error) {
    throw toApiError(error, "נכשל בסימון המשימה כבוצעה");
  }
};

// שליחת משימה לבדיקה
export const submitTaskForReview = async (taskId) => {
  try {
    const response = await axiosConfig.patch(`/tasks/${taskId}/review`);
    return response.data.task;
  } catch (error) {
    throw toApiError(error, "נכשל בשליחת המשימה לבדיקה");
  }
};

// מחיקת משימה
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosConfig.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw toApiError(error, "נכשל במחיקת המשימה");
  }
};