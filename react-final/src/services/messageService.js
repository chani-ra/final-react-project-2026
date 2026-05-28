import axiosConfig from "./axiosConfig";

// קבלת ההודעות של המשתמש המחובר
export const getMyMessages = async () => {
  try {
    const response = await axiosConfig.get("/messages/my");
    return response.data.messages || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת ההודעות";
  }
};

// סימון הודעה כנקראה
export const markMessageAsRead = async (messageId) => {
  try {
    const response = await axiosConfig.patch(`/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בסימון ההודעה כנקראה";
  }
};