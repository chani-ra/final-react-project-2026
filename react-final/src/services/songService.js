import axiosConfig from "./axiosConfig";

// קבלת שיר השבוע לתלמידים
export const getWeeklySong = async () => {
  try {
    const response = await axiosConfig.get("/songs/weekly");
    return response.data.song;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת שיר השבוע";
  }
};