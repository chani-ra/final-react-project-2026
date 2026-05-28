import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyMessages } from "../../services/messageService";

export default function MessageBell() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // טעינת הודעות המשתמש המחובר עבור הפעמון
  const loadMessages = async () => {
    try {
      setLoading(true);

      const data = await getMyMessages();
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load messages for bell:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    // עדכון אוטומטי כל 30 שניות
    const interval = setInterval(() => {
      loadMessages();
    }, 30000);

    // עדכון מיידי כאשר עמוד ההודעות מסמן הודעה כנקראה
    const handleMessagesUpdated = () => {
      loadMessages();
    };

    window.addEventListener("messages-updated", handleMessagesUpdated);

    return () => {
      clearInterval(interval);
      window.removeEventListener("messages-updated", handleMessagesUpdated);
    };
  }, []);

  const unreadMessages = useMemo(() => {
    return messages.filter((message) => !message.isRead);
  }, [messages]);

  const unreadCount = unreadMessages.length;
  const latestUnread = unreadMessages[0];

  const goToMessages = () => {
    setIsOpen(false);
    navigate("/messages");
  };

  return (
    <div className="relative" dir="rtl">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative w-11 h-11 rounded-2xl border border-white/10 flex items-center justify-center transition-all ${
          unreadCount > 0
            ? "bg-yellow-400/20 text-yellow-300 animate-pulse"
            : "bg-white/5 text-gray-300 hover:bg-white/10"
        }`}
        title="הודעות"
      >
        <span className={unreadCount > 0 ? "animate-bounce" : ""}>🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-black min-w-6 h-6 px-1 rounded-full flex items-center justify-center border-2 border-slate-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-3 w-80 bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-white">הודעות</h3>

              <span className="text-xs text-gray-400">
                {loading ? "טוען..." : `${unreadCount} חדשות`}
              </span>
            </div>
          </div>

          {unreadCount > 0 ? (
            <div className="p-4 space-y-4">
              <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-2xl p-4">
                <div className="text-yellow-300 font-black mb-1">
                  קיימת עבורך הודעה חדשה ✨
                </div>

                <div className="text-white font-bold line-clamp-1">
                  {latestUnread?.title}
                </div>

                <div className="text-gray-400 text-sm mt-1 line-clamp-2">
                  {latestUnread?.body}
                </div>
              </div>

              <button
                onClick={goToMessages}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl transition-all"
              >
                פתחי הודעות
              </button>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">📭</div>

              <p className="text-gray-400 text-sm">
                אין הודעות חדשות כרגע.
              </p>

              <button
                onClick={goToMessages}
                className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
              >
                לכל ההודעות
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}