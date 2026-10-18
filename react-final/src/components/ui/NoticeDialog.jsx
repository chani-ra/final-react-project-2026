import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const TONES = {
  success: { icon: "✓", title: "text-emerald-100", chip: "bg-emerald-400/15 border-emerald-300/35 text-emerald-100", button: "bg-emerald-400 text-slate-950 hover:bg-emerald-300" },
  error: { icon: "!", title: "text-red-100", chip: "bg-red-400/15 border-red-300/35 text-red-100", button: "bg-red-500 text-white hover:bg-red-400" },
  warning: { icon: "!", title: "text-amber-100", chip: "bg-amber-400/15 border-amber-300/35 text-amber-100", button: "bg-amber-300 text-slate-950 hover:bg-amber-200" },
  danger: { icon: "!", title: "text-red-100", chip: "bg-red-400/15 border-red-300/35 text-red-100", button: "bg-red-500 text-white hover:bg-red-400" },
  info: { icon: "i", title: "text-sky-100", chip: "bg-sky-400/15 border-sky-300/35 text-sky-100", button: "bg-sky-300 text-slate-950 hover:bg-sky-200" },
};

/** Shared design for confirmation, error, and success dialogs throughout EnglishWise. */
export default function NoticeDialog({
  isOpen, type = "info", title, message = "", primaryText = "הבנתי", secondaryText,
  onPrimary, onSecondary, onClose, isLoading = false, error = "",
}) {
  const labelId = useId();
  const dialogRef = useRef(null);
  const primaryRef = useRef(null);
  const tone = TONES[type] || TONES.info;
  const dismiss = onSecondary || onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    primaryRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isLoading) {
        event.preventDefault();
        (onClose || onSecondary)?.();
      }
      if (event.key === "Tab") {
        const controls = [...(dialogRef.current?.querySelectorAll('button:not(:disabled)') || [])];
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [isOpen, isLoading, onClose, onSecondary]);

  if (!isOpen) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center overflow-y-auto bg-[#06172a]/75 p-4 backdrop-blur-sm" dir="rtl">
      <section ref={dialogRef} role={type === "danger" || type === "warning" || type === "error" ? "alertdialog" : "dialog"}
        aria-modal="true" aria-labelledby={labelId}
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-white/25 bg-[#102e50] p-6 text-center text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] sm:p-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/10 to-transparent" />
        <div className={`relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border text-3xl font-black ${tone.chip}`} aria-hidden="true">{tone.icon}</div>
        <h2 id={labelId} className={`relative text-xl font-black leading-snug sm:text-2xl ${tone.title}`}>{title || "הודעה"}</h2>
        {message && <p className="relative mt-3 whitespace-pre-line text-sm font-medium leading-7 text-white/80">{message}</p>}
        {error && <p role="alert" className="mt-3 rounded-xl border border-red-300/30 bg-red-500/15 p-3 text-sm text-red-100">{error}</p>}
        <div className="relative mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          {secondaryText && <button type="button" onClick={dismiss} disabled={isLoading} className="min-w-28 flex-1 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-50">{secondaryText}</button>}
          <button ref={primaryRef} type="button" onClick={onPrimary || onClose} disabled={isLoading}
            className={`min-w-28 flex-1 rounded-xl px-5 py-3 text-sm font-extrabold transition disabled:cursor-wait disabled:opacity-50 ${tone.button}`}>
            {isLoading ? "שומרים את השינוי..." : primaryText}
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
}
