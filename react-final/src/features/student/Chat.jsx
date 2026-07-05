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
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";
import ChatSidebar from "./components/chat/chatSidebar";

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

  return (
    <div dir="rtl" className="space-y-5">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm font-black text-red-100">
                בולט AI
              </div>

              <h1
                className="text-3xl font-black leading-tight text-white md:text-4xl"
                style={{
                  textShadow:
                    "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
                }}
              >
                מאמן אישי לתרגול אנגלית
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
                אפשר לשאול, לתרגל משפטים, לבקש תיקון, ללמוד מילים ולקבל עזרה
                שמתאימה לרמה שלך.
              </p>
            </div>

            <div className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              רמה: {getLevelLabel(userLevel)}
            </div>
          </div>

          <div
            className={`grid gap-4 xl:h-[560px] ${
              isSidebarOpen
                ? "grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]"
                : "grid-cols-1"
            }`}
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

            <section
              className="flex h-[560px] min-h-0 flex-col overflow-hidden rounded-[1.9rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 22px 70px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/12 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  {!isSidebarOpen && (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className="rounded-full border-2 border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/16"
                    >
                      תפריט
                    </button>
                  )}

                  <div>
                    <h2 className="text-xl font-black text-white md:text-2xl">
                      {activeConversation?.title || "שיחה חדשה עם בולט"}
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-emerald-200/85">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.55)]" />
                      מחובר ושומר היסטוריית שיחות
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/12 bg-slate-950/35 p-3">
                <p className="mb-2 text-xs font-bold text-white/55">
                  התחלה מהירה:
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
                <div className="border-b border-red-300/25 bg-red-500/15 px-5 py-3 text-sm font-black text-red-100">
                  {errorMessage}
                </div>
              )}

              <div className="flex-1 space-y-4 overflow-y-auto p-4 scroll-smooth">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {isTyping && <TypingBubble />}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/12 bg-white/10 p-4">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="כתבי כאן..."
                    className="flex-1 rounded-full border-2 border-white/18 bg-white/10 px-5 py-3.5 text-base font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
                    dir="auto"
                    autoComplete="off"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-7 py-3.5 text-base font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      boxShadow:
                        !input.trim() || isTyping
                          ? "none"
                          : "0 6px 0 rgba(89,15,20,0.42)",
                    }}
                  >
                    {isTyping ? (
                      <span className="inline-flex items-center gap-2">
                        <SmallSpinner />
                        שולח
                      </span>
                    ) : (
                      "שלח"
                    )}
                  </button>
                </form>
              </div>
            </section>
          </div>
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
        className={`relative max-w-[88%] rounded-[1.45rem] border-2 p-4 md:max-w-[68%] ${
          isUser
            ? "rounded-tr-sm border-red-300/45 bg-gradient-to-b from-red-400 to-red-700 text-white"
            : "rounded-tl-sm border-white/18 bg-white/10 text-white"
        }`}
      >
        <p
          className="whitespace-pre-wrap text-sm font-semibold leading-7 md:text-base"
          dir="auto"
        >
          {message.text}
        </p>

        <span
          className={`mt-2 block text-[11px] font-black ${
            isUser ? "text-white/62" : "text-white/42"
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
      <div className="flex items-center gap-2 rounded-[1.45rem] rounded-tl-sm border-2 border-white/18 bg-white/10 p-5 text-white">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
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
      className="rounded-full border-2 border-red-300/28 bg-red-500/12 px-4 py-2 text-sm font-black text-red-100 transition hover:border-yellow-300/45 hover:bg-yellow-300/15 hover:text-yellow-100"
    >
      {label}
    </button>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

function buildWelcomeMessage(user) {
  return {
    id: "welcome-message",
    text: `היי ${user?.username || user?.name || "תלמידה"}! אני בולט, המאמן האישי שלך לאנגלית.
אפשר לכתוב לי באנגלית או בעברית, ואני אעזור לך לתרגל שיחה, להבין מילים, לשפר משפטים ולהתקדם בביטחון.`,
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