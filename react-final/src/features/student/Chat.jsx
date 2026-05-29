import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { sendConversationMessage } from "../../services/aiService";
import {
  addMessageToChatConversation,
  createChatConversation,
  deleteChatConversation,
  getChatConversationById,
  getMyChatConversations,
} from "../../services/chatService";
import ChatSidebar from "./components/chat/ChatSidebar";

export default function Chat() {
  const { user } = useSelector((state) => state.auth);

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState([buildWelcomeMessage(user)]);
  const [input, setInput] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingConversationId, setLoadingConversationId] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const messagesEndRef = useRef(null);

  const userLevel = user?.englishLevel || user?.level || "beginner";

  const activeConversation = useMemo(() => {
    return conversations.find(
      (conversation) => conversation._id === activeConversationId
    );
  }, [conversations, activeConversationId]);

  // טעינת רשימת שיחות מהשרת
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

  // גלילה אוטומטית לתחתית הצ׳אט
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // פתיחת שיחה קיימת
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

  // התחלת שיחה חדשה
  const handleNewConversation = () => {
    setActiveConversationId("");
    setMessages([buildWelcomeMessage(user)]);
    setInput("");
    setErrorMessage("");
  };

  // יצירת שיחה בשרת אם זו הודעה ראשונה
  const ensureConversationExists = async (firstMessageText) => {
    if (activeConversationId) return activeConversationId;

    const title = buildConversationTitle(firstMessageText);
    const newConversation = await createChatConversation(title);

    setActiveConversationId(newConversation._id);
    setConversations((prev) => [newConversation, ...prev]);

    return newConversation._id;
  };

  // שמירת הודעה ורענון רשימת השיחות
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

  // שליחת הודעה ל־AI ושמירת ההיסטוריה
  const handleSend = async (e) => {
    e.preventDefault();

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

  // מחיקת שיחה
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

  // הכנסת פעולה מוכנה לשדה הטקסט
  const handleQuickAction = (text) => {
    setInput(text);
  };

  return (
    <div
      className={`grid gap-6 h-[calc(100vh-12rem)] ${
        isSidebarOpen
          ? "grid-cols-1 xl:grid-cols-[320px_1fr]"
          : "grid-cols-1"
      }`}
      dir="rtl"
    >
      <ChatSidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        loadingConversations={loadingConversations}
        loadingConversationId={loadingConversationId}
        onNewConversation={handleNewConversation}
        onOpenConversation={handleOpenConversation}
        onDeleteConversation={handleDeleteConversation}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <section className="flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl font-black transition-all"
                title="פתח היסטוריית שיחות"
              >
                ☰
              </button>
            )}

            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg border border-indigo-400">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-black">
                {activeConversation?.title || "בולט AI"}
              </h2>

              <p className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                מחובר ל־AI אמיתי ושומר היסטוריית שיחות
              </p>
            </div>
          </div>

          <div className="hidden md:block bg-yellow-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-black">
            רמה: {getLevelLabel(userLevel)}
          </div>
        </div>

        <div className="bg-slate-950/60 border-b border-white/10 p-4">
          <p className="text-gray-400 text-sm mb-3">
            התחילי מהר עם אחת האפשרויות:
          </p>

          <div className="flex flex-wrap gap-2">
            <QuickActionButton
              label="תרגול שיחה"
              text="I want to practice a simple English conversation. Please ask me one question at a time."
              onClick={handleQuickAction}
            />

            <QuickActionButton
              label="תקן לי משפט"
              text="Please correct this sentence and explain the mistake in Hebrew: "
              onClick={handleQuickAction}
            />

            <QuickActionButton
              label="לימוד מילים"
              text="Teach me 5 useful English words for my level and ask me to use one in a sentence."
              onClick={handleQuickAction}
            />

            <QuickActionButton
              label="שאל אותי שאלה"
              text="Ask me one easy English question and wait for my answer."
              onClick={handleQuickAction}
            />
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-500/10 border-b border-red-500/20 text-red-300 px-5 py-3 text-sm font-bold">
            {errorMessage}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}

          {isTyping && <TypingBubble />}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-slate-900/80 border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="כתבי כאן באנגלית או בעברית..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:bg-white/15 transition-all text-sm md:text-base"
              dir="auto"
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-gray-400 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
            >
              <span className="hidden sm:inline">
                {isTyping ? "שולח..." : "שלח"}
              </span>
              <span className="text-xl">✈️</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ChatBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl relative shadow-md ${
          isUser
            ? "bg-yellow-400 text-slate-900 rounded-tr-none"
            : "bg-slate-800 text-white rounded-tl-none border border-white/10"
        }`}
      >
        <p
          className="font-medium text-sm md:text-base whitespace-pre-wrap leading-relaxed"
          dir="auto"
        >
          {message.text}
        </p>

        <span
          className={`text-[11px] mt-2 block font-bold ${
            isUser ? "text-slate-700" : "text-gray-400"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-end">
      <div className="bg-slate-800 text-white p-5 rounded-2xl rounded-tl-none border border-white/10 flex gap-2 items-center shadow-md">
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

function QuickActionButton({ label, text, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
    >
      {label}
    </button>
  );
}

function buildWelcomeMessage(user) {
  return {
    id: "welcome-message",
    text: `היי ${user?.username || user?.name || "תלמידה"}! אני בולט, המאמן האישי שלך לאנגלית. 🤖
אפשר לכתוב לי באנגלית או בעברית, ואני אעזור לך לתרגל שיחה, להבין מילים, לשפר משפטים ולדבר יותר בביטחון.`,
    sender: "ai",
    time: getCurrentTime(),
  };
}

function buildConversationTitle(text) {
  const cleanText = text.trim().replace(/\s+/g, " ");

  if (cleanText.length <= 38) return cleanText;

  return `${cleanText.slice(0, 38)}...`;
}

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(date) {
  if (!date) return getCurrentTime();

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "מתחילים";
}