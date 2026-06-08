import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function AppFeedbackModal({
  isOpen,
  type = "success",
  title = "",
  message = "",
  primaryText = "אישור",
  secondaryText = "",
  onPrimary,
  onSecondary,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isError = type === "error";
  const isWarning = type === "warning";

  const icon = isSuccess ? "✓" : isError ? "!" : isWarning ? "!" : "i";

  const iconClass = isSuccess
    ? "border-emerald-300/35 bg-emerald-400/16 text-emerald-100"
    : isError
    ? "border-red-300/35 bg-red-500/16 text-red-100"
    : isWarning
    ? "border-[#ffd439]/35 bg-[#ffd439]/16 text-[#ffe89a]"
    : "border-cyan-200/35 bg-cyan-300/16 text-cyan-100";

  const titleClass = isSuccess
    ? "text-emerald-100"
    : isError
    ? "text-red-100"
    : isWarning
    ? "text-[#ffe89a]"
    : "text-cyan-100";

  const primaryClass = isError
    ? "from-[#ff6659] to-[#b8322a]"
    : isWarning
    ? "from-[#ffd439] to-[#d98918] text-[#123c6b]"
    : "from-[#ff6659] to-[#b8322a]";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#031f3d]/58 px-4 py-6 backdrop-blur-md"
      dir="rtl"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.4rem] border border-white/28 bg-[#123c6b]/96 text-white shadow-[0_35px_100px_rgba(3,31,61,0.58),inset_0_1px_0_rgba(255,255,255,0.18)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_48%)]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white shadow-lg transition hover:bg-white/22"
          aria-label="סגירה"
        >
          ×
        </button>

        <div className="relative z-10 p-6 md:p-7">
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border text-4xl font-black shadow-[0_12px_28px_rgba(3,31,61,0.24)] ${iconClass}`}
          >
            {icon}
          </div>

          <h2 className={`text-3xl font-black leading-tight md:text-4xl ${titleClass}`}>
            {title}
          </h2>

          {message && (
            <p className="mt-3 text-base font-bold leading-relaxed text-white/70">
              {message}
            </p>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onPrimary || onClose}
              className={`flex-1 rounded-full border-2 border-white/55 bg-gradient-to-b ${primaryClass} px-6 py-3.5 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none`}
            >
              {primaryText}
            </button>

            {secondaryText && (
              <button
                type="button"
                onClick={onSecondary || onClose}
                className="flex-1 rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/16"
              >
                {secondaryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}