import api from "./axiosConfig";

const errorMessage = (error) => error?.response?.data?.message || "לא הצלחנו להתחבר לשירות הלמידה. נסי שוב.";

export async function getLearningCatalog() {
  try { const { data } = await api.get("/learning/categories"); return data.categories || []; }
  catch (error) { throw new Error(errorMessage(error)); }
}

export async function getLearningProviders() {
  try { const { data } = await api.get("/learning/providers"); return data.providers || []; }
  catch (error) { throw new Error(errorMessage(error)); }
}

export async function createAILesson(payload) {
  try { const { data } = await api.post("/learning/generate", payload); return data.lesson; }
  catch (error) { throw new Error(errorMessage(error)); }
}

export async function getMyLearningHistory(page = 1) {
  try { const { data } = await api.get("/learning/history", { params: { page, limit: 8 } }); return data; }
  catch (error) { throw new Error(errorMessage(error)); }
}

export async function getAdminLearningHistory({ page = 1, userId = "", categoryId = "" } = {}) {
  try {
    const { data } = await api.get("/learning/admin/history", {
      params: { page, limit: 10, ...(userId ? { userId } : {}), ...(categoryId ? { categoryId } : {}) },
    });
    return data;
  } catch (error) { throw new Error(errorMessage(error)); }
}
