import axiosConfig from "./axiosConfig";

// קבלת המילון האישי
export const getMyDictionaryWords = async () => {
  try {
    const response = await axiosConfig.get("/dictionary/my");
    return response.data.words || [];
  } catch (error) {
    throw error.response?.data?.message || "נכשל בטעינת המילון האישי";
  }
};

// שמירת מילה במילון
export const addDictionaryWord = async (wordData) => {
  try {
    const response = await axiosConfig.post("/dictionary", wordData);
    return response.data.word;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בשמירת המילה";
  }
};

// שינוי סטטוס יודעת / בתרגול
export const toggleDictionaryWordMastered = async (wordId) => {
  try {
    const response = await axiosConfig.patch(
      `/dictionary/${wordId}/toggle-mastered`
    );

    return response.data.word;
  } catch (error) {
    throw error.response?.data?.message || "נכשל בעדכון סטטוס המילה";
  }
};

// מחיקת מילה מהמילון
export const deleteDictionaryWord = async (wordId) => {
  try {
    const response = await axiosConfig.delete(`/dictionary/${wordId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "נכשל במחיקת המילה";
  }
};