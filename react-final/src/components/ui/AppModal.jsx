import React, { useEffect } from "react";
import { createPortal } from "react-dom";

export default function AppModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  maxWidth = "max-w-5xl",
  children,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/78 p-3 backdrop-blur-sm md:p-5"
      dir="rtl"
      onMouseDown={onClose}
    >
      <div
        className={`relative max-h-[92vh] w-full ${maxWidth} overflow-hidden rounded-[2.2rem] border-2 border-white/24 bg-slate-950 text-white shadow-2xl`}
        style={{
          boxShadow:
            "0 34px 110px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-10 h-56 w-56 rounded-full bg-yellow-300/12 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-10 h-56 w-56 rounded-full bg-red-500/18 blur-3xl" />

        <header className="relative z-10 border-b border-white/12 px-5 py-4 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              {icon && (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] border border-yellow-300/35 bg-yellow-300/12 text-yellow-100">
                  {icon}
                </div>
              )}

              <div className="min-w-0">
                <h2 className="line-clamp-1 text-2xl font-black text-white md:text-3xl">
                  {title}
                </h2>

                {subtitle && (
                  <p className="mt-1 line-clamp-1 text-sm font-semibold text-white/52">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-white/16 bg-white/10 text-xl font-black text-white transition hover:border-red-300/45 hover:bg-red-500/20"
              aria-label="סגירת חלונית"
            >
              ×
            </button>
          </div>
        </header>

        <main className="relative z-10 max-h-[calc(92vh-86px)] overflow-y-auto p-4 md:p-5">
          {children}
        </main>
      </div>
    </div>,
    document.body
  );
}