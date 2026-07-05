import axiosConfig from "./axiosConfig";


export const getAdminDashboardStats = async () => {
  try {
    const response = await axiosConfig.get("/admin/stats");
    return response.data.stats;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת נתוני הדשבורד";
  }
};


export const updateUserRole = async (userId, role) => {
  try {
    const response = await axiosConfig.put(`/users/${userId}/role`, { role });
    return response.data.user;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון הרשאת המשתמש";
  }


// קבלת כל השירים למנהל
export const getAllSongsForAdmin = async () => {
  try {
    const response = await axiosConfig.get("/songs/admin/all");
    return response.data.songs || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת רשימת השירים";
  }
};

// קביעת שיר שבועי
export const setWeeklySong = async (songId) => {
  try {
    const response = await axiosConfig.patch(`/songs/song/${songId}/weekly`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בקביעת שיר השבוע";
  }
};

// קבלת כל המשתמשים למנהל
export const getAllUsersForAdmin = async () => {
  try {
    const response = await axiosConfig.get("/users");
    return response.data.users || response.data.data || response.data || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת רשימת המשתמשים";
  }
};

// שליחת הודעת מנהל
export const sendAdminMessage = async (messageData) => {
  try {
    const response = await axiosConfig.post("/messages/admin/send", messageData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בשליחת ההודעה";
  }
};

// קבלת היסטוריית הודעות מנהל
export const getAdminSentMessages = async () => {
  try {
    const response = await axiosConfig.get("/messages/admin/sent");
    return response.data.messages || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת היסטוריית הודעות";
  }
};