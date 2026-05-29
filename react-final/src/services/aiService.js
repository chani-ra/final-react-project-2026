import axiosConfig from "./axiosConfig";

// שיחת AI לצ׳אט
export const sendConversationMessage = async ({ message, level }) => {
  try {
    const response = await axiosConfig.post("/ai/conversation", {
      message,
      level,
    });

    return response.data.reply;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בקבלת תשובת AI";
  }
};

// תרגום טקסט בעזרת AI
export const translateText = async ({ text, targetLang = "Hebrew" }) => {
  try {
    const response = await axiosConfig.post("/ai/translate", {
      text,
      targetLang,
    });

    return response.data.translation;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בתרגום הטקסט";
  }
};

// תיקון דקדוק בעזרת AI
export const correctGrammar = async (text) => {
  try {
    const response = await axiosConfig.post("/ai/grammar-correct", {
      text,
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בתיקון הדקדוק";
  }
};

// יצירת תרגיל בעזרת AI
export const generateExerciseWithAI = async (exerciseData) => {
  try {
    const response = await axiosConfig.post(
      "/ai/generate-exercise",
      exerciseData
    );

    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת תרגיל בעזרת AI";
  }
};

// יצירת בוחן בעזרת AI
export const generateQuizWithAI = async (quizData) => {
  try {
    const response = await axiosConfig.post("/ai/generate-quiz", quizData);
    return response.data.questions || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל ביצירת בוחן בעזרת AI";
  }
};

// בדיקת חיבור באנגלית
export const checkEssayWithAI = async ({ text, studentLevel }) => {
  try {
    const response = await axiosConfig.post("/ai/check-essay", {
      text,
      studentLevel,
    });

    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בבדיקת החיבור";
  }
};

// קבלת טיפים ללמידה
export const getStudyTips = async ({ level, focusArea }) => {
  try {
    const response = await axiosConfig.get("/ai/study-tips", {
      params: {
        level,
        focusArea,
      },
    });

    return response.data.tips || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת טיפים";
  }
};