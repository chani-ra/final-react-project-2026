import axiosConfig from "./axiosConfig";

// דף הבית - קבלת המלצות מאושרות
export const getApprovedReviews = async () => {
  try {
    const response = await axiosConfig.get("/reviews");
    return response.data.reviews || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת ההמלצות";
  }
};

// משתמשת מחוברת מוסיפה המלצה
export const createReview = async (reviewData) => {
  try {
    const response = await axiosConfig.post("/reviews", reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בשליחת ההמלצה";
  }
};

// המשתמשת רואה את ההמלצות שלה
export const getMyReviews = async () => {
  try {
    const response = await axiosConfig.get("/reviews/my");
    return response.data.reviews || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת ההמלצות שלי";
  }
};

// מנהל - קבלת כל ההמלצות
export const getAllReviewsForAdmin = async (status = "all") => {
  try {
    const response = await axiosConfig.get(`/reviews/admin/all?status=${status}`);
    return response.data.reviews || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת ההמלצות למנהל";
  }
};

// מנהל - אישור המלצה
export const approveReview = async (reviewId) => {
  try {
    const response = await axiosConfig.patch(
      `/reviews/admin/${reviewId}/approve`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל באישור ההמלצה";
  }
};

// מנהל - דחיית המלצה
export const rejectReview = async (reviewId, adminNote = "") => {
  try {
    const response = await axiosConfig.patch(
      `/reviews/admin/${reviewId}/reject`,
      { adminNote }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בדחיית ההמלצה";
  }
};

// מנהל - מחיקת המלצה
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosConfig.delete(`/reviews/admin/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת ההמלצה";
  }
};