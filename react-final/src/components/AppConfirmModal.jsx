import React from "react";

export default function AppConfirmModal({
  isOpen,
  title,
  text,
  confirmText = "אישור",
  cancelText = "ביטול",
  type = "info",
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const config = {
    info: {
      icon: "ℹ️",
      color: "border-indigo-400/30",
      button: "bg-indigo-600 hover:bg-indigo-500 text-white",
    },
    warning: {
      icon: "⚠️",
      color: "border-yellow-400/30",
      button: "bg-yellow-400 hover:bg-yellow-300 text-slate-950",
    },
    danger: {
      icon: "🗑️",
      color: "border-red-400/30",
      button: "bg-red-600 hover:bg-red-500 text-white",
    },
    success: {
      icon: "✅",
      color: "border-emerald-400/30",
      button: "bg-emerald-600 hover:bg-emerald-500 text-white",
    },
  };

  const style = config[type] || config.info;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md bg-slate-900 border ${style.color} rounded-3xl p-6 shadow-2xl`}
        dir="rtl"
      >
        <div className="text-5xl mb-4 text-center">{style.icon}</div>

        <h2 className="text-2xl font-black text-white text-center mb-3">
          {title}
        </h2>

        <p className="text-gray-300 text-center leading-relaxed mb-7">
          {text}
        </p>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-3 rounded-xl font-black transition-all disabled:opacity-60 ${style.button}`}
          >
            {isLoading ? "מבצע..." : confirmText}
          </button>

          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}