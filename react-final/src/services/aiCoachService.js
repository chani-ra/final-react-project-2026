import { toApiError } from "./apiError.js";
import axiosConfig from "./axiosConfig";

// יצירת תוכנית לימוד אישית לפי הודעת התלמידה
export const generateCoachPlan = async (note) => {
  try {
    const response = await axiosConfig.post("/ai/coach", { note });
    return response.data.plan;
  } catch (error) {
    throw toApiError(error, "נכשל ביצירת תוכנית לימוד אישית");
  }
};

// קבלת היסטוריית תוכניות המאמן של המשתמש המחובר
export const getCoachHistory = async () => {
  try {
    const response = await axiosConfig.get("/ai/coach/history");
    return response.data.history || [];
  } catch (error) {
    throw toApiError(error, "נכשל בטעינת היסטוריית המאמן");
  }
};