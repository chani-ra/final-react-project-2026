import axiosConfig from "./axiosConfig";

// יצירת בוחן חדש על ידי מורה
export const createQuiz = async (quizData) => {
  try {
    const response = await axiosConfig.post("/quizzes", quizData);
    return response.data.quiz;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת הבוחן";
  }
};

// עריכת בוחן
export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await axiosConfig.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון הבוחן";
  }
};

// פרסום / החזרה לטיוטה של בוחן
export const updateQuizPublishStatus = async (quizId, isPublic) => {
  try {
    const response = await axiosConfig.patch(`/quizzes/${quizId}/publish`, {
      isPublic,
    });

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון מצב פרסום הבוחן";
  }
};

// מחיקת בוחן
export const deleteQuiz = async (quizId) => {
  try {
    const response = await axiosConfig.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת הבוחן";
  }
};

// קבלת בוחן יחיד לפי מזהה
// courseId חשוב בקורס אישי, כי הבוחן נמצא בתוך course.quizzes
export const getQuizById = async (quizId, courseId = null) => {
  try {
    const query = courseId ? `?courseId=${courseId}` : "";
    const response = await axiosConfig.get(`/quizzes/${quizId}${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת הבוחן";
  }
};

// קבלת בחנים של קורס מסוים
export const getQuizzesByCourse = async (courseId) => {
  try {
    const response = await axiosConfig.get(`/quizzes/course/${courseId}`);
    return response.data.quizzes || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת בחני הקורס";
  }
};

// הגשת בוחן לתלמידה
// תומך בקריאה:
// submitQuiz(quizId, { answers, timeTaken, courseId })
// וגם בקריאה:
// submitQuiz({ quizId, answers, timeTaken, courseId })
export const submitQuiz = async (quizIdOrPayload, payload = null) => {
  try {
    const quizId =
      typeof quizIdOrPayload === "object"
        ? quizIdOrPayload.quizId
        : quizIdOrPayload;

    if (!quizId) {
      throw "חסר מזהה בוחן";
    }

    const body =
      typeof quizIdOrPayload === "object"
        ? {
            answers: quizIdOrPayload.answers || [],
            timeTaken: quizIdOrPayload.timeTaken || null,
            courseId: quizIdOrPayload.courseId || null,
          }
        : {
            answers: payload?.answers || [],
            timeTaken: payload?.timeTaken || null,
            courseId: payload?.courseId || null,
          };

    const response = await axiosConfig.post(`/quizzes/${quizId}/submit`, body);

    return response.data;
  } catch (error) {
    if (typeof error === "string") {
      throw error;
    }

    throw error.response?.data?.message || "נכשל בהגשת הבוחן";
  }
};

// קבלת תוצאות הבחנים של התלמידה המחוברת
export const getUserQuizResults = async () => {
  try {
    const response = await axiosConfig.get("/quizzes/my-results");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת תוצאות הבחנים";
  }
};

// קבלת בחנים שהמורה יצרה
export const getTeacherQuizzes = async () => {
  try {
    const response = await axiosConfig.get("/quizzes/teacher/my");
    return response.data.quizzes || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת בחני המורה";
  }
};