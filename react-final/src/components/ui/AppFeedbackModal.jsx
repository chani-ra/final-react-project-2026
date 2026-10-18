import React from "react";
import NoticeDialog from "./NoticeDialog";

/** Backwards-compatible adapter: existing feedback flows now share one design. */
export default function AppFeedbackModal({ isOpen, type = "success", title = "", message = "",
  primaryText = "אישור", secondaryText = "", onPrimary, onSecondary, onClose }) {
  return <NoticeDialog isOpen={isOpen} type={type} title={title} message={message}
    primaryText={primaryText} secondaryText={secondaryText}
    onPrimary={onPrimary || onClose} onSecondary={onSecondary || onClose} onClose={onClose} />;
}
