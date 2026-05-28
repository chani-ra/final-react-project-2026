import React, { useEffect, useMemo, useState } from "react";
import { getMyMessages, markMessageAsRead } from "../../../services/messageService";

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [messageState, setMessageState] = useState({ type: "", text: "" });

  // טעינת הודעות המשתמש המחובר
  const loadMessages = async () => {
    try {
      setLoading(true);
      setMessageState({ type: "", text: "" });

      const data = await getMyMessages();
      setMessages(data);

      if (data.length > 0) {
        setActiveMessage(data[0]);
      }
    } catch (error) {
      setMessageState({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const unreadCount = useMemo(() => {
    return messages.filter((message) => !message.isRead).length;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (filter === "unread") {
      return messages.filter((message) => !message.isRead);
    }

    if (filter === "read") {
      return messages.filter((message) => message.isRead);
    }

    return messages;
  }, [messages, filter]);

  // פתיחת הודעה וסימון אוטומטי כנקראה
  const handleOpenMessage = async (message) => {
    setActiveMessage(message);

    if (message.isRead) return;

    try {
      setActionLoadingId(message._id);

      await markMessageAsRead(message._id);

      setMessages((prev) =>
        prev.map((item) =>
          item._id === message._id
            ? { ...item, isRead: true, readAt: new Date().toISOString() }
            : item
        )
      );

      setActiveMessage((prev) =>
        prev && prev._id === message._id
          ? { ...prev, isRead: true, readAt: new Date().toISOString() }
          : prev
      );
    } catch (error) {
      setMessageState({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div>
            <h1 className="text-3xl font-black text-white">💬 ההודעות שלי</h1>

            <p className="text-gray-400 mt-2">
              כאן מופיעות הודעות מערכת שנשלחו אלייך על ידי מנהל האתר.
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 rounded-2xl px-6 py-4 h-fit font-black">
            {unreadCount} הודעות שלא נקראו
          </div>
        </div>
      </section>

      {messageState.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            messageState.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {messageState.text}
        </div>
      )}

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center text-white font-bold text-xl">
          <div className="animate-pulse">טוען הודעות... 💬</div>
        </div>
      ) : messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <aside className="xl:col-span-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex gap-2 overflow-x-auto">
              <FilterButton
                label="הכל"
                isActive={filter === "all"}
                onClick={() => setFilter("all")}
              />

              <FilterButton
                label="לא נקראו"
                isActive={filter === "unread"}
                onClick={() => setFilter("unread")}
              />

              <FilterButton
                label="נקראו"
                isActive={filter === "read"}
                onClick={() => setFilter("read")}
              />
            </div>

            <div className="max-h-[650px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  אין הודעות מתאימות לסינון הזה.
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <button
                    key={message._id}
                    type="button"
                    onClick={() => handleOpenMessage(message)}
                    className={`w-full text-right p-5 border-b border-white/5 hover:bg-white/5 transition-all ${
                      activeMessage?._id === message._id
                        ? "bg-yellow-400/10"
                        : "bg-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <h3
                          className={`font-black truncate ${
                            message.isRead ? "text-gray-300" : "text-white"
                          }`}
                        >
                          {message.title}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                          {message.body}
                        </p>
                      </div>

                      {!message.isRead && (
                        <span className="w-3 h-3 bg-yellow-400 rounded-full mt-1 shrink-0" />
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{getPriorityLabel(message.priority)}</span>
                      <span>{formatDate(message.createdAt)}</span>
                    </div>

                    {actionLoadingId === message._id && (
                      <div className="text-xs text-yellow-400 mt-2">
                        מסמן כנקרא...
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </aside>

          <main className="xl:col-span-2">
            {!activeMessage ? (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                <div className="text-6xl mb-4">📨</div>

                <h2 className="text-2xl font-black mb-2">
                  בחרי הודעה מהרשימה
                </h2>

                <p className="text-gray-400">
                  תוכן ההודעה יוצג כאן בצורה מלאה.
                </p>
              </div>
            ) : (
              <MessageDetails message={activeMessage} />
            )}
          </main>
        </section>
      )}
    </div>
  );
}

function MessageDetails({ message }) {
  return (
    <article className="bg-white/5 border border-white/10 rounded-3xl p-8">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black border ${getPriorityClass(
                message.priority
              )}`}
            >
              {getPriorityLabel(message.priority)}
            </span>

            <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold">
              {getMessageTypeLabel(message.messageType)}
            </span>

            {message.isRead ? (
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                נקראה
              </span>
            ) : (
              <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold">
                חדשה
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black text-white">{message.title}</h2>

          <p className="text-gray-500 text-sm mt-2">
            מאת: {message.sender?.username || "מנהל האתר"} ·{" "}
            {formatDate(message.createdAt)}
          </p>
        </div>
      </div>

      <div className="bg-slate-950/70 border border-white/10 rounded-3xl p-6 text-gray-200 leading-relaxed whitespace-pre-line">
        {message.body}
      </div>

      {message.readAt && (
        <p className="text-gray-500 text-sm mt-4">
          נקראה בתאריך: {formatDate(message.readAt)}
        </p>
      )}
    </article>
  );
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        isActive
          ? "bg-yellow-400 text-slate-950"
          : "bg-slate-950/60 text-gray-300 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyMessages() {
  return (
    <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-14 text-center">
      <div className="text-6xl mb-4">📭</div>

      <h2 className="text-2xl font-black mb-2">אין הודעות עדיין</h2>

      <p className="text-gray-400">
        כשהמנהל ישלח הודעה, היא תופיע כאן.
      </p>
    </div>
  );
}

function getPriorityLabel(priority) {
  const labels = {
    low: "עדיפות נמוכה",
    normal: "עדיפות רגילה",
    high: "עדיפות גבוהה",
  };

  return labels[priority] || "עדיפות רגילה";
}

function getPriorityClass(priority) {
  const classes = {
    low: "bg-white/10 text-gray-300 border-white/10",
    normal: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    high: "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return classes[priority] || classes.normal;
}

function getMessageTypeLabel(type) {
  const labels = {
    announcement: "הודעת מערכת",
    feedback: "פידבק",
    system: "מערכת",
  };

  return labels[type] || "הודעה";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}