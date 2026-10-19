import { useEffect, useMemo, useRef, useState } from "react";
import { useNotices } from "../../../components/ui/noticeContext";
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
  // The visible conversation has its own generation. Delayed replies for an
  // earlier view must never overwrite the conversation the student sees now.
  const viewVersionRef = useRef(0);
  const sendingForVersionRef = useRef(null);

  const userLevel = user?.englishLevel || user?.level || "beginner";

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) => conversation._id === activeConversationId
    );
  }, [conversations, activeConversationId]);

  // Retained for future manual conversation-list refresh actions.
  // eslint-disable-next-line no-unused-vars
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
    let active = true;
    getMyChatConversations()
      .then((data) => { if (active) setConversations(Array.isArray(data) ? data : []); })
      .catch((error) => { if (active) setErrorMessage(error.toString()); })
      .finally(() => { if (active) setLoadingConversations(false); });
    return () => { active = false; };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleOpenConversation = async (conversationId) => {
    const version = ++viewVersionRef.current;
    setActiveConversationId(conversationId);
    setMessages([]);
    setLoadingConversationId(conversationId);
    setIsTyping(false);
    setErrorMessage("");

    try {
      const conversation = await getChatConversationById(conversationId);
      if (viewVersionRef.current !== version) return;

      setActiveConversationId(conversation._id);
      setMessages(conversation.messages?.length > 0
        ? conversation.messages.map((message) => ({
            id: message._id || `${message.sender}-${message.createdAt}`,
            text: message.text,
            sender: message.sender,
            time: formatTime(message.createdAt),
          }))
        : [buildWelcomeMessage(user)]);
    } catch (error) {
      if (viewVersionRef.current === version) setErrorMessage(error.toString());
    } finally {
      if (viewVersionRef.current === version) setLoadingConversationId("");
    }
  };

  const handleNewConversation = () => {
    ++viewVersionRef.current;
    setActiveConversationId("");
    setMessages([buildWelcomeMessage(user)]);
    setLoadingConversationId("");
    setIsTyping(false);
    setInput("");
    setErrorMessage("");
  };

  const ensureConversationExists = async (firstMessageText, version) => {
    if (activeConversationId) return activeConversationId;

    const title = buildConversationTitle(firstMessageText);
    const newConversation = await createChatConversation(title);

    // Keep the newly persisted chat in history even if the student switched
    // views while the network request was pending.
    setConversations((prev) => [newConversation, ...prev.filter((item) => item._id !== newConversation._id)]);
    if (viewVersionRef.current === version) setActiveConversationId(newConversation._id);

    return newConversation._id;
  };

  const updateConversation = (updatedConversation) => {
    setConversations((prev) => [updatedConversation, ...prev.filter((item) => item._id !== updatedConversation._id)]);
  };

  const handleSend = async (event) => {
    event.preventDefault();

    const cleanInput = input.trim();

    const version = viewVersionRef.current;
    if (!cleanInput || isTyping || loadingConversationId || sendingForVersionRef.current === version) return;
    sendingForVersionRef.current = version;

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

    try {
      const conversationId = await ensureConversationExists(cleanInput, version);

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

      if (viewVersionRef.current === version) {
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      // The server did not confirm persistence: do not display an invented AI reply.
      if (viewVersionRef.current === version) {
        setMessages((prev) => prev.filter((message) => message.id !== userMessage.id));
        setInput(cleanInput);
        setErrorMessage(error.toString());
      }
    } finally {
      if (sendingForVersionRef.current === version) sendingForVersionRef.current = null;
      if (viewVersionRef.current === version) setIsTyping(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    const version = viewVersionRef.current;
    try {
      await deleteChatConversation(conversationId);

      setConversations((prev) =>
        prev.filter((conversation) => conversation._id !== conversationId)
      );

      if (activeConversationId === conversationId && viewVersionRef.current === version) {
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
