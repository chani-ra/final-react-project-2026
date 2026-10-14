import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MessageBell from '../MessageBell';
import MobileNavDrawer from './MobileNavDrawer';
import NavGlyph from './NavGlyph';
import { prioritizeNavLinks } from './navOrder';
import { getNavLinks, getRoleLabel, isNavActive } from './navigationConfig';


export default function ResponsiveHeader({ user, onHome, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);
  const language = 'he';
  const links = prioritizeNavLinks(getNavLinks(user.role, language), user.role);
  const name = user.username || user.name || 'משתמשת';
  const close = useCallback(() => {
    setOpen(false);
    trigger.current?.focus();
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  return (
    <>
      <header dir="rtl" className="sticky top-0 z-50 w-full border-b border-white/25 bg-[#84c5ee]/20 px-2 py-2 shadow-[0_4px_15px_rgba(17,65,110,0.10)] backdrop-blur-lg sm:px-3">
        <div className="mx-auto flex w-full max-w-[1580px] flex-wrap items-center justify-between gap-x-3 gap-y-2 lg:flex-nowrap">
          <button type="button" onClick={onHome} title={name + ' · ' + getRoleLabel(user.role, language)}
            className="order-1 flex shrink-0 items-center gap-2 rounded-xl px-1 py-1 text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd439]">
            <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#123b61]/90 text-[#ffe092] shadow-md"><NavGlyph path="/courses" size={21} /></span>
            <span className="hidden min-[360px]:block">
              <span className="block text-[17px] font-black leading-tight tracking-tight text-white drop-shadow-[0_1px_2px_rgba(9,55,90,0.65)] sm:text-lg">EnglishWise</span>
              <span className="block text-[10px] font-bold leading-tight text-[#173f61]">לומדים ומתקדמים</span>
            </span>
          </button>
          <nav aria-label="ניווט ראשי" className="order-3 hidden min-w-0 w-full justify-center sm:flex lg:order-2 lg:w-auto lg:flex-1" dir="rtl">
            <div className="mx-auto flex max-w-full items-stretch gap-[1px] overflow-x-auto rounded-[19px] border border-white/15 bg-[#173859]/95 px-1.5 py-1 shadow-[0_7px_18px_rgba(8,36,70,0.22)] [scrollbar-width:thin]">
              {links.map(link => {
                const active = isNavActive(location.pathname, link.path);
                return (
                  <Link to={link.path} key={link.path} title={link.name} aria-current={active ? 'page' : undefined}
                    className={'relative flex min-h-[54px] min-w-[58px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[13px] px-1.5 py-1 text-center transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] sm:min-w-[62px] xl:min-w-[70px] ' + (active ? 'bg-[#265a87] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]' : 'text-[#c1d5e9] hover:bg-white/10 hover:text-white')}>
                    {active && <span aria-hidden="true" className="absolute left-1/2 top-0 h-1 w-5 -translate-x-1/2 rounded-b-md bg-[#ffda64]" />}
                    <NavGlyph path={link.path} size={20} />
                    <span className="whitespace-nowrap text-[10.5px] font-extrabold leading-tight sm:text-[11px]">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="order-2 flex shrink-0 items-center gap-1.5 lg:order-3" dir="rtl">
            
            <MessageBell />
            <button type="button" onClick={onLogout} title="התנתקות" aria-label="התנתקות"
              className="hidden h-10 items-center gap-1 rounded-xl border border-[#ffcec8]/35 bg-[#9d3935]/85 px-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#a92e2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] sm:flex">
              <NavGlyph path="logout" size={17} /> יציאה
            </button>
            <button ref={trigger} type="button" onClick={() => setOpen(true)} aria-label="פתיחת תפריט" aria-haspopup="dialog" aria-expanded={open} aria-controls="englishwise-mobile-navigation"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-[#143a5e]/90 text-white shadow-md transition hover:bg-[#225d8e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffd439] sm:hidden">
              <NavGlyph path="menu" size={22} />
            </button>
          </div>
        </div>
      </header>
      {open && <MobileNavDrawer user={user} links={links} activePath={location.pathname}
        onNavigate={url => { setOpen(false); navigate(url); }}
        onLogout={() => { setOpen(false); onLogout(); }} onClose={close}
         />}
    </>
  );
}
