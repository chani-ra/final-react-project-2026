import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  getRoleLabel,
  isNavActive,
} from "./navigationConfig";
import "./mobileNavigation.css";

export default function MobileNavDrawer({
  user,
  links,
  activePath,
  onNavigate,
  onLogout,
  onClose,
}) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const onKeyDown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab") return;

      const elements = Array.from(
        panelRef.current?.querySelectorAll(
          "button:not([disabled]), a[href]"
        ) || []
      );

      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    const onResize = event => {
      if (event.matches) onClose();
    };

    const wideScreen = window.matchMedia(
      "(min-width: 640px)"
    );

    wideScreen.addEventListener("change", onResize);
    window.addEventListener("popstate", onClose);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      wideScreen.removeEventListener("change", onResize);
      window.removeEventListener("popstate", onClose);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      id="englishwise-mobile-navigation"
      className="fixed inset-0 z-[100] sm:hidden"
      dir="rtl"
    >
      <div
        className="ew-mobile-nav-scrim absolute inset-0 bg-[#061c33]/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="englishwise-navigation-title"
        className="ew-mobile-nav-panel absolute inset-y-0 right-0 flex w-[min(90vw,390px)] max-w-full flex-col overflow-hidden border-l border-white/20 bg-gradient-to-b from-[#124477] via-[#0c315a] to-[#061f36] text-white shadow-[-20px_0_65px_rgba(0,0,0,0.40)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/15 p-4">
          <div>
            <h2
              id="englishwise-navigation-title"
              className="text-xl font-black"
            >
              התפריט שלי
            </h2>
            <p className="text-xs font-bold text-white/60">
              EnglishWise
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="סגירת התפריט"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-2xl hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="mx-4 mt-4 flex shrink-0 items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffd439] font-black text-[#123c6b]"
            aria-hidden="true"
          >
            {(user.username || user.name || "מ").trim().slice(0, 1)}
          </span>

          <div className="min-w-0">
            <p className="truncate text-base font-black">
              {user.username || user.name || "משתמשת"}
            </p>
            <p className="text-xs font-bold text-white/70">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>

        <nav
          aria-label="ניווט מותאם לתפקיד"
          className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 pb-5"
        >
          {links.map(link => {
            const active = isNavActive(
              activePath,
              link.path
            );

            return (
              <button
                type="button"
                key={link.path}
                onClick={() => onNavigate(link.path)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 w-full items-center justify-between rounded-xl border px-4 py-3 text-right text-[15px] font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] ${active
                  ? "border-[#ffd439]/40 bg-[#247ab8]/90 text-white"
                  : "border-transparent text-white/85 hover:border-white/15 hover:bg-white/10"}`}
              >
                <span>{link.name}</span>

                {active && (
                  <span
                    className="h-2 w-2 rounded-full bg-[#ffd439]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-white/15 bg-[#061f36]/90 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-2xl border border-white/20 bg-[#b8322a] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#9f2a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]"
          >
            התנתקות מהחשבון
          </button>
        </div>
      </aside>
    </div>,
    document.body
  );
}
