import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { sendConversationMessage } from "../../services/aiService";

export default function Chat() {
  const { user } = useSelector((state) => state.auth);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `היי ${user?.username || user?.name || "תלמידה"}! אני בולט, המאמן האישי שלך לאנגלית. 🤖
אפשר לכתוב לי באנגלית או בעברית, ואני אעזור לך לתרגל שיחה, להבין מילים, לשפר משפטים ולדבר יותר בביטחון.`,
      sender: "ai",
      time: getCurrentTime(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const messagesEndRef = useRef(null);

  // גלילה אוטומטית להודעה האחרונה
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const userLevel = user?.englishLevel || user?.level || "beginner";

  // שליחת הודעה אמיתית ל-AI
  const handleSend = async (e) => {
    e.preventDefault();

    const cleanInput = input.trim();

    if (!cleanInput || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: cleanInput,
      sender: "user",
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setErrorMessage("");

    try {
      const aiReply = await sendConversationMessage({
        message: cleanInput,
        level: userLevel,
      });

      const aiMessage = {
        id: Date.now() + 1,
        text:
          aiReply ||
          "אני כאן כדי לעזור לך לתרגל אנגלית. נסי לכתוב לי משפט נוסף.",
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const fallbackMessage = {
        id: Date.now() + 1,
        text:
          "אופס, לא הצלחתי לקבל תשובה מה-AI כרגע. אפשר לנסות שוב בעוד רגע.",
        sender: "ai",
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
      setErrorMessage(error?.toString() || "שגיאה בקבלת תשובה מה-AI");
    } finally {
      setIsTyping(false);
    }
  };

  // שליחת הודעה מוכנה מראש
  const handleQuickAction = (text) => {
    setInput(text);
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-12rem)] bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl"
      dir="rtl"
    >
      <div className="bg-slate-900/80 p-4 border-b border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg border border-indigo-400">
            🤖
          </div>

          <div>
            <h2 className="text-xl font-bold">בולט AI</h2>

            <p className="text-sm text-emerald-400 flex items-center gap-2 font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              מחובר ל־AI אמיתי ומוכן לתרגול
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
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] md:max-w-[65%] p-4 rounded-2xl relative shadow-md ${
                msg.sender === "user"
                  ? "bg-yellow-400 text-slate-900 rounded-tr-none"
                  : "bg-slate-800 text-white rounded-tl-none border border-white/10"
              }`}
            >
              <p
                className="font-medium text-sm md:text-base whitespace-pre-wrap leading-relaxed"
                dir="auto"
              >
                {msg.text}
              </p>

              <span
                className={`text-[11px] mt-2 block font-bold ${
                  msg.sender === "user" ? "text-slate-700" : "text-gray-400"
                }`}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
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
        )}

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

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
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