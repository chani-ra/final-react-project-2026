import React, { useEffect } from "react";

export default function AppModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-5xl",
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      dir="rtl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-[#0F4C75]/55 backdrop-blur-sm"
        aria-label="סגור חלון"
      />

      <section
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-white`}
      >
        <div className="relative overflow-hidden bg-[#5BBFED] px-6 py-5 text-white">
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 900 120"
            preserveAspectRatio="none"
          >
            <g fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M0 88 C90 40 160 70 250 35 C335 0 420 50 510 25 C610 -4 680 45 770 20 C835 5 870 22 900 8" />
              <path d="M0 110 C95 65 155 82 250 55 C350 25 410 75 520 48 C620 25 700 75 795 45 C850 28 875 38 900 26" />
            </g>
          </svg>

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {icon && (
                <div className="w-14 h-14 rounded-3xl bg-white/22 border border-white/35 flex items-center justify-center shadow-lg">
                  {icon}
                </div>
              )}

              <div>
                <h2 className="text-2xl md:text-3xl font-black">{title}</h2>

                {subtitle && (
                  <p className="text-white/85 text-sm mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-white/18 hover:bg-white/28 border border-white/30 flex items-center justify-center text-2xl font-black transition-all"
              aria-label="סגירה"
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-96px)] overflow-y-auto bg-[#F3FBFF] p-5 md:p-7">
          {children}
        </div>
      </section>
    </div>
  );
}