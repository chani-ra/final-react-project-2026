import { toApiError } from "./apiError.js";
import axiosConfig from "./axiosConfig";

// קבלת כל השיחות של המשתמש המחובר
export const getMyChatConversations = async () => {
  try {
    const response = await axiosConfig.get("/chat-conversations");
    return response.data.conversations || [];
  } catch (error) {
    throw toApiError(error, "נכשל בטעינת היסטוריית השיחות");
  }
};

// קבלת שיחה אחת מלאה
export const getChatConversationById = async (conversationId) => {
  try {
    const response = await axiosConfig.get(
      `/chat-conversations/${conversationId}`
    );

    return response.data.conversation;
  } catch (error) {
    throw toApiError(error, "נכשל בטעינת השיחה");
  }
};

// יצירת שיחה חדשה
export const createChatConversation = async (title) => {
  try {
    const response = await axiosConfig.post("/chat-conversations", {
      title,
    });

    return response.data.conversation;
  } catch (error) {
    throw toApiError(error, "נכשל ביצירת שיחה חדשה");
  }
};

// הוספת הודעה לשיחה
export const addMessageToChatConversation = async ({
  conversationId,
  sender,
  text,
}) => {
  try {
    const response = await axiosConfig.post(
      `/chat-conversations/${conversationId}/messages`,
      {
        sender,
        text,
      }
    );

    return response.data.conversation;
  } catch (error) {
    throw toApiError(error, "נכשל בשמירת ההודעה");
  }
};

// שינוי שם שיחה
export const renameChatConversation = async ({ conversationId, title }) => {
  try {
    const response = await axiosConfig.patch(
      `/chat-conversations/${conversationId}`,
      {
        title,
      }
    );

    return response.data.conversation;
  } catch (error) {
    throw toApiError(error, "נכשל בשינוי שם השיחה");
  }
};

// מחיקת שיחה
export const deleteChatConversation = async (conversationId) => {
  try {
    const response = await axiosConfig.delete(
      `/chat-conversations/${conversationId}`
    );

    return response.data;
  } catch (error) {
    throw toApiError(error, "נכשל במחיקת השיחה");
  }
};
// Creates a trusted assistant reply and stores both sides on the server.
export const sendChatConversationMessage = async ({ conversationId, message, level }) => {
  try {
    const response = await axiosConfig.post(`/chat-conversations/${conversationId}/reply`, { message, level });
    return { reply: response.data.reply, conversation: response.data.conversation };
  } catch (error) {
    throw toApiError(error, "נכשל בקבלת תשובה מהעוזר");
  }
};
