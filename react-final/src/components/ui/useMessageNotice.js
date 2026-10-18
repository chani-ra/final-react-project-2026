import { useEffect, useRef } from "react";
import { useNotices } from "./NoticeProvider";

/** Present legacy {type,text} page messages without requiring users to scroll. */
export default function useMessageNotice(message, successTitle = "הפעולה הושלמה") {
  const notices = useNotices();
  const lastShown = useRef(null);
  useEffect(() => {
    if (!message?.text) { lastShown.current = null; return; }
    if (lastShown.current === message) return;
    lastShown.current = message;
    if (message.type === "success") notices.success(message.text, successTitle);
    else if (message.type === "error") notices.error(message.text);
  }, [message, notices, successTitle]);
}
