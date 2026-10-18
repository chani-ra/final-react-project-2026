import { useEffect, useMemo, useRef, useState } from "react";
import { useNotices } from "../../../components/ui/NoticeProvider";
import { sendChatConversationMessage, createChatConversation, deleteChatConversation, getChatConversationById, getMyChatConversations } from "../../../services/chatService";
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

  const updateConversation = (updatedConversation) => {
    setConversations((prev) => [updatedConversation, ...prev.filter((item) => item._id !== updatedConversation._id)]);
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

      const { reply: finalAiReply, conversation: updatedConversation } = await sendChatConversationMessage({
        conversationId,
        message: cleanInput,
        level: userLevel,
      });
      updateConversation(updatedConversation);

      const aiMessage = {
        id: `local-ai-${Date.now()}`,
        text: finalAiReply,
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // The server did not confirm persistence: do not display an invented AI reply.
      setMessages((prev) => prev.filter((message) => message.id !== userMessage.id));
      setInput(cleanInput);
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
