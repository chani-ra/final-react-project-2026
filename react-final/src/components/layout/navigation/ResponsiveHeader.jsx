import React, { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MessageBell from "../MessageBell";
import MobileNavDrawer from "./MobileNavDrawer";
import {
  getNavLinks,
  getRoleLabel,
  isNavActive,
} from "./navigationConfig";

export default function ResponsiveHeader({ user, onHome, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const toggleRef = useRef(null);

  const [openedAtLocation, setOpenedAtLocation] = useState(null);

  const isOpen = openedAtLocation === location.key;
  const links = getNavLinks(user.role);
  const displayName = user.username || user.name || "משתמשת";

  const close = () => {
    setOpenedAtLocation(null);
    toggleRef.current?.focus();
  };

  const navigateFromDrawer = to => {
    setOpenedAtLocation(null);
    toggleRef.current?.focus();
    navigate(to);
  };

  const logoutFromDrawer = () => {
    setOpenedAtLocation(null);
    onLogout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-b from-[#4c8ee4]/96 via-[#3d80d4]/96 to-[#2868ad]/96 shadow-[0_13px_36px_rgba(7,47,88,0.32)] backdrop-blur-xl">

        {/* Compact header */}
        <div
          className="mx-auto flex h-[72px] max-w-[1900px] items-center justify-between gap-2 px-3 sm:h-[80px] sm:px-5 sm:hidden"
          dir="rtl"
        >
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              ref={toggleRef}
              type="button"
              aria-label="פתיחת תפריט הניווט"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              aria-controls="englishwise-mobile-navigation"
              onClick={() => setOpenedAtLocation(location.key)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-[#072842]/80 shadow-lg transition hover:bg-[#072842] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd439]"
            >
              <MenuIcon />
            </button>

            <button
              type="button"
              onClick={onHome}
              className="min-w-0 text-right focus-visible:rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]"
            >
              <span className="block truncate text-base font-black tracking-wide text-white sm:text-lg">
                EnglishWise
              </span>
              <span className="block max-w-[45vw] truncate text-xs font-bold text-white/80 sm:max-w-none">
                {displayName} · {getRoleLabel(user.role)}
              </span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <MessageBell />
          </div>
        </div>

        {/* Regular laptops: horizontal navigation, wrapping naturally. */}
        <div className="mx-auto hidden max-w-[1700px] px-4 py-3 sm:block min-[1700px]:hidden" dir="rtl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={onHome} className="min-w-0 text-right text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]">
              <span className="block text-lg font-black sm:text-xl">EnglishWise</span>
              <span className="block max-w-[45vw] truncate text-xs font-bold text-white/80">{displayName} · {getRoleLabel(user.role)}</span>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              
              <MessageBell />
              <button type="button" onClick={onLogout} className="rounded-full bg-[#b8322a] px-4 py-2 text-sm font-black text-white hover:bg-[#9f2a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]">התנתק</button>
            </div>
          </div>
          <nav aria-label="ניווט ראשי" className="mt-3 flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-[#072842]/90 p-2">
            {links.map(link => {
              const active = isNavActive(location.pathname, link.path);
              return <Link key={link.path} to={link.path} aria-current={active ? 'page' : undefined}
                className={'whitespace-nowrap rounded-full px-3 py-2 text-sm font-extrabold transition hover:bg-[#1c74b5]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] ' + (active ? 'bg-[#1c74b5] text-white ring-1 ring-[#ffd439]/50' : 'text-white/90')}
              >{link.name}</Link>;
            })}
          </nav>
        </div>

        {/* Original wide desktop layout */}
        <div
          className="mx-auto hidden h-[94px] max-w-[1900px] grid-cols-[285px_minmax(0,1fr)_215px] items-center gap-3 px-5 min-[1700px]:grid"
          dir="ltr"
        >
          <div className="flex min-w-0 items-center gap-3" dir="rtl">
            <button
              type="button"
              onClick={onHome}
              title="חזרה לדשבורד"
              aria-label="חזרה לדשבורד"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:bg-white/20"
            >
              <UserIcon />
            </button>

            <div className="min-w-0 leading-tight">
              <div className="truncate text-[18px] font-black">
                {displayName}
              </div>
              <div className="text-xs font-bold text-white/75">
                {getRoleLabel(user.role)}
              </div>
            </div>

            <div className="mx-1 h-10 w-px shrink-0 bg-white/25" />

            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl"
              title="English"
              aria-label="English"
            >
              🇬🇧
            </span>

            <MessageBell />
          </div>

          <nav aria-label="ניווט ראשי" className="min-w-0" dir="rtl">
            <div className="mx-auto flex max-w-[1080px] items-center justify-center gap-0.5 rounded-full bg-[#072842]/92 px-2 py-3 shadow-[0_12px_32px_rgba(7,35,64,0.34)]">
              {links.map(link => {
                const active = isNavActive(
                  location.pathname,
                  link.path
                );

                return (
                  <Link
                    to={link.path}
                    key={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-3 py-2.5 text-[15px] font-black leading-none transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] ${active
                      ? "bg-[#1c74b5] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]"
                      : "text-white/90 hover:bg-[#1c74b5]/90"}`}
                  >
                    {link.name}

                    {active && (
                      <span className="absolute -bottom-1 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-[#ffd439]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="flex items-center justify-end gap-3" dir="rtl">
            <span
              className="whitespace-nowrap text-lg font-black text-white"
              title="Premium"
            >
              ♛ Premium
            </span>

            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-[#b8322a] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#9f2a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439]"
            >
              התנתק
            </button>
          </div>
        </div>
      </header>

      {isOpen && (
        <MobileNavDrawer
          user={user}
          links={links}
          activePath={location.pathname}
          onNavigate={navigateFromDrawer}
          onLogout={logoutFromDrawer}
          onClose={close}
        />
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4.5 3.7-7 8-7s7 2.5 8 7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
