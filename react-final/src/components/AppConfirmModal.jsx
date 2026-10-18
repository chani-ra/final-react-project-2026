import React from "react";
import NoticeDialog from "./ui/NoticeDialog";

/** Backwards-compatible confirmation adapter for admin flows. */
export default function AppConfirmModal({ isOpen, title, text, confirmText = "אישור", cancelText = "ביטול",
  type = "info", isLoading = false, onConfirm, onCancel, error = "" }) {
  return <NoticeDialog isOpen={isOpen} type={type} title={title} message={text}
    primaryText={confirmText} secondaryText={cancelText} isLoading={isLoading} error={error}
    onPrimary={onConfirm} onSecondary={onCancel} onClose={onCancel} />;
}
