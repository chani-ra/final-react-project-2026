import React, { useEffect, useMemo, useState } from "react";
import {
  getMyMessages,
  markMessageAsRead,
} from "../../../services/messageService";
import SmartGuideBackButton from "../../../components/ui/SmartGuideBackButton";

export default function MyMessages() {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [messageState, setMessageState] = useState({ type: "", text: "" });

  const loadMessages = async () => {
    try {
      setLoading(true);
      setMessageState({ type: "", text: "" });

      const data = await getMyMessages();
      const safeMessages = Array.isArray(data) ? data : [];

      setMessages(safeMessages);

      if (safeMessages.length > 0) {
        setActiveMessage((prev) => prev || safeMessages[0]);
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

  const readCount = useMemo(() => {
    return messages.filter((message) => message.isRead).length;
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

  const handleOpenMessage = async (message) => {
    setActiveMessage(message);

    if (message.isRead) return;

    try {
      setActionLoadingId(message._id);

      await markMessageAsRead(message._id);

      const readAt = new Date().toISOString();

      setMessages((prev) =>
        prev.map((item) =>
          item._id === message._id ? { ...item, isRead: true, readAt } : item
        )
      );

      setActiveMessage((prev) =>
        prev && prev._id === message._id
          ? { ...prev, isRead: true, readAt }
          : prev
      );

      window.dispatchEvent(new Event("messages-updated"));
    } catch (error) {
      setMessageState({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-5" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              מרכז הודעות
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              ההודעות שלי
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              כאן מופיעות הודעות מערכת, עדכונים ופידבקים שנשלחו אלייך.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[330px]">
            <StatBox label="סה״כ" value={messages.length} tone="yellow" />
            <StatBox label="חדשות" value={unreadCount} tone="red" />
            <StatBox label="נקראו" value={readCount} tone="green" />
          </div>
        </div>
      </section>

      {messageState.text && (
        <div
          className={`rounded-[1.5rem] border-2 px-5 py-3 text-sm font-black ${
            messageState.type === "success"
              ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
              : "border-red-300/35 bg-red-500/15 text-red-100"
          }`}
        >
          {messageState.text}
        </div>
      )}

      {loading ? (
        <LoadingState />
      ) : messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[360px_1fr]">
          <aside
            className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
            style={{
              boxShadow:
                "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

            <div className="relative z-10">
              <div className="flex gap-2 border-b border-white/10 p-4">
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

              <div className="max-h-[560px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-8 text-center text-sm font-semibold leading-7 text-white/55">
                    אין הודעות מתאימות לסינון הזה.
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <MessageListItem
                      key={message._id}
                      message={message}
                      isActive={activeMessage?._id === message._id}
                      isLoading={actionLoadingId === message._id}
                      onClick={() => handleOpenMessage(message)}
                    />
                  ))
                )}
              </div>
            </div>
          </aside>

          <main>
            {!activeMessage ? (
              <div className="rounded-[2rem] border-2 border-dashed border-white/20 bg-slate-950/55 p-10 text-center text-white">
                <h2 className="text-2xl font-black">בחרי הודעה מהרשימה</h2>

                <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
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

function MessageListItem({ message, isActive, isLoading, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-white/8 p-4 text-right transition ${
        isActive
          ? "bg-yellow-300/15"
          : message.isRead
          ? "bg-transparent hover:bg-white/10"
          : "bg-red-500/10 hover:bg-red-500/15"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3
            className={`truncate text-base font-black ${
              message.isRead ? "text-white/78" : "text-white"
            }`}
          >
            {message.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-white/50">
            {message.body}
          </p>
        </div>

        {!message.isRead && (
          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-yellow-300 shadow-[0_0_14px_rgba(253,224,71,0.55)]" />
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-black text-white/38">
        <span className={getPriorityTextColor(message.priority)}>
          {getPriorityLabel(message.priority)}
        </span>

        <span>{formatDate(message.createdAt)}</span>
      </div>

      {isLoading && (
        <div className="mt-2 inline-flex items-center gap-2 text-xs font-black text-yellow-100">
          <SmallSpinner />
          מסמן כנקרא...
        </div>
      )}
    </button>
  );
}

function MessageDetails({ message }) {
  return (
    <article
      className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl md:p-6"
      style={{
        boxShadow:
          "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="relative z-10">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${getPriorityClass(
                  message.priority
                )}`}
              >
                {getPriorityLabel(message.priority)}
              </span>

              <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-xs font-black text-white/65">
                {getMessageTypeLabel(message.messageType)}
              </span>

              {message.isRead ? (
                <span className="rounded-full border border-emerald-300/35 bg-emerald-300/12 px-3 py-1 text-xs font-black text-emerald-100">
                  נקראה
                </span>
              ) : (
                <span className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-100">
                  חדשה
                </span>
              )}
            </div>

            <h2 className="text-3xl font-black leading-tight text-white">
              {message.title}
            </h2>

            <p className="mt-2 text-sm font-bold text-white/45">
              מאת: {message.sender?.username || "מנהל האתר"} ·{" "}
              {formatDate(message.createdAt)}
            </p>
          </div>
        </div>

        <div className="rounded-[1.6rem] border border-white/12 bg-slate-950/70 p-5 text-base font-semibold leading-8 text-white/75 whitespace-pre-line">
          {message.body}
        </div>

        {message.readAt && (
          <p className="mt-4 text-sm font-bold text-white/40">
            נקראה בתאריך: {formatDate(message.readAt)}
          </p>
        )}
      </div>
    </article>
  );
}

function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1.35rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

function FilterButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border-2 px-4 py-2 text-xs font-black transition ${
        isActive
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyMessages() {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-white/20 bg-slate-950/55 p-10 text-center text-white">
      <h2 className="text-2xl font-black">אין הודעות עדיין</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
        כשהמנהל ישלח הודעה, היא תופיע כאן.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black text-white">טוען הודעות...</p>
      </div>
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
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
    low: "border-white/16 bg-white/10 text-white/65",
    normal: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    high: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return classes[priority] || classes.normal;
}

function getPriorityTextColor(priority) {
  const classes = {
    low: "text-white/42",
    normal: "text-yellow-100",
    high: "text-red-100",
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