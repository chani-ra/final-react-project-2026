import { useEffect, useMemo, useRef, useState } from "react";
import { useNotices } from "../../../components/ui/NoticeProvider";
import { sendConversationMessage } from "../../../services/aiService";
import { addMessageToChatConversation, createChatConversation, deleteChatConversation, getChatConversationById, getMyChatConversations } from "../../../services/chatService";
import { buildWelcomeMessage, buildConversationTitle, getCurrentTime, formatTime } from "./chatModel.js";

export default function useChat(user) {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState([buildWelcomeMessage(user)]);
  const [input, setInput] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const notices = useNotices();
  useEffect(() => {
    if (errorMessage) notices.error(errorMessage, "בעיה בשיחה");
  }, [errorMessage, notices]);

  const messagesEndRef = useRef(null);

  const userLevel = user?.englishLevel || user?.level || "beginner";

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) => conversation._id === activeConversationId
    );
  }, [conversations, activeConversationId]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setErrorMessage("");

      const data = await getMyChatConversations();
      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error.toString());
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOpenConversation = async (conversationId) => {
    try {
      setLoadingConversationId(conversationId);
      setErrorMessage("");

      const conversation = await getChatConversationById(conversationId);

      setActiveConversationId(conversation._id);

      if (conversation.messages?.length > 0) {
        setMessages(
          conversation.messages.map((message) => ({
            id: message._id || `${message.sender}-${message.createdAt}`,
            text: message.text,
            sender: message.sender,
            time: formatTime(message.createdAt),
          }))
        );
      } else {
        setMessages([buildWelcomeMessage(user)]);
      }
    } catch (error) {
      setErrorMessage(error.toString());
    } finally {
      setLoadingConversationId("");
    }
  };

  const handleNewConversation = () => {
    setActiveConversationId("");
    setMessages([buildWelcomeMessage(user)]);
    setInput("");
    setErrorMessage("");
  };

  const ensureConversationExists = async (firstMessageText) => {
    if (activeConversationId) return activeConversationId;

    const title = buildConversationTitle(firstMessageText);
    const newConversation = await createChatConversation(title);

    setActiveConversationId(newConversation._id);
    setConversations((prev) => [newConversation, ...prev]);

    return newConversation._id;
  };

  const saveMessageToConversation = async ({ conversationId, sender, text }) => {
    const updatedConversation = await addMessageToChatConversation({
      conversationId,
      sender,
      text,
    });

    setConversations((prev) => {
      const withoutCurrent = prev.filter(
        (conversation) => conversation._id !== updatedConversation._id
      );

      return [updatedConversation, ...withoutCurrent];
    });

    return updatedConversation;
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const cleanInput = input.trim();

    if (!cleanInput || isTyping) return;

    const userMessage = {
      id: `local-user-${Date.now()}`,
      text: cleanInput,
      sender: "user",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setErrorMessage("");

    let conversationId = activeConversationId;

    try {
      conversationId = await ensureConversationExists(cleanInput);

      await saveMessageToConversation({
        conversationId,
        sender: "user",
        text: cleanInput,
      });

      const aiReply = await sendConversationMessage({
        message: cleanInput,
        level: userLevel,
      });

      const finalAiReply =
        aiReply ||
        "אני כאן כדי לעזור לך לתרגל אנגלית. נסי לכתוב לי משפט נוסף.";

      const aiMessage = {
        id: `local-ai-${Date.now()}`,
        text: finalAiReply,
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      await saveMessageToConversation({
        conversationId,
        sender: "ai",
        text: finalAiReply,
      });
    } catch (error) {
      const fallbackText =
        "אופס, לא הצלחתי לקבל תשובה מה־AI כרגע. אפשר לנסות שוב בעוד רגע.";

      setMessages((prev) => [
        ...prev,
        {
          id: `local-ai-error-${Date.now()}`,
          text: fallbackText,
          sender: "ai",
          time: getCurrentTime(),
        },
      ]);

      if (conversationId) {
        try {
          await saveMessageToConversation({
            conversationId,
            sender: "ai",
            text: fallbackText,
          });
        } catch {
          // לא שוברים את הצ׳אט אם שמירת ההודעה נכשלה
        }
      }

      setErrorMessage(error.toString());
    } finally {
      setIsTyping(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await deleteChatConversation(conversationId);

      setConversations((prev) =>
        prev.filter((conversation) => conversation._id !== conversationId)
      );

      if (activeConversationId === conversationId) {
        handleNewConversation();
      }
    } catch (error) {
      setErrorMessage(error.toString());
    }
  };

  const handleQuickAction = (text) => {
    setInput(text);
  };

  return { conversations, activeConversationId, messages, input, setInput, isSidebarOpen, setIsSidebarOpen, loadingConversations, loadingConversationId, isTyping, messagesEndRef, userLevel, activeConversation, handleOpenConversation, handleNewConversation, handleSend, handleDeleteConversation, handleQuickAction };
}
