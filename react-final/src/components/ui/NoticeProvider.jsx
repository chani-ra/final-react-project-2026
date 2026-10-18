import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import NoticeDialog from "./NoticeDialog";

const Context = createContext(null);

function readableError(value) {
  const raw = String(value?.message || value || "").replace(/^Error:\s*/i, "").trim();
  if (!raw || /^(Network Error|Failed to fetch|Load failed)$/i.test(raw)) {
    return "לא הצלחנו להתחבר כרגע. בדקי את החיבור ונסי שוב.";
  }
  if (/^Request failed with status code \d{3}$/i.test(raw)) {
    return "לא הצלחנו להשלים את הפעולה. נסי שוב בעוד רגע.";
  }
  return raw;
}

/** Global dialog API: useNotices().success(), .error(), .confirm(). */
export function NoticeProvider({ children }) {
  const [current, setCurrent] = useState(null);
  const pending = useRef([]);
  const active = useRef(null);

  // Queue simultaneous notices instead of losing confirmations or success messages.
  const show = useCallback((details) => new Promise((resolve) => {
    const item = { details: { type: "info", ...details }, resolve };
    if (active.current) {
      pending.current.push(item);
      return;
    }
    active.current = item;
    setCurrent(item.details);
  }), []);

  const finish = useCallback((confirmed) => {
    const previous = active.current;
    if (!previous) return;
    const next = pending.current.shift() || null;
    active.current = next;
    setCurrent(next?.details || null);
    previous.resolve(confirmed);
  }, []);

  const api = useMemo(() => ({
    show,
    success: (message, title = "הפעולה הושלמה") => show({ type: "success", title, message }),
    error: (message, title = "משהו לא הסתדר") => show({ type: "error", title, message: readableError(message) }),
    confirm: ({ title = "לאשר את הפעולה?", message = "", confirmText = "אישור", cancelText = "ביטול", danger = false }) =>
      show({ type: danger ? "danger" : "warning", title, message, primaryText: confirmText, secondaryText: cancelText }),
  }), [show]);

  return (
    <Context.Provider value={api}>
      {children}
      <NoticeDialog
        isOpen={Boolean(current)} type={current?.type} title={current?.title} message={current?.message}
        primaryText={current?.primaryText || "הבנתי"} secondaryText={current?.secondaryText}
        onPrimary={() => finish(true)} onSecondary={() => finish(false)} onClose={() => finish(false)}
      />
    </Context.Provider>
  );
}

export function useNotices() {
  const value = useContext(Context);
  if (!value) throw new Error("useNotices requires NoticeProvider");
  return value;
}
