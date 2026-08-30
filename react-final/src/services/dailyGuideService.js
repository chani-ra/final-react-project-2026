import api from "./axiosConfig";

export async function getTodayDailyGuide() {
  const response = await api.get(
    "/ai/daily-guide/today"
  );

  return response.data;
}

export async function refreshTodayDailyGuide() {
  const response = await api.post(
    "/ai/daily-guide/refresh"
  );

  return response.data;
}