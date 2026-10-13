import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";
import { clearAuthStorage, getHomePathForRole } from "../../services/authSession";
import MessageBell from "./MessageBell";
import skyJourneyBackground from "../../assets/sky-journey-background.svg";

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (!user) return null;

  const handleLogout = () => {
    clearAuthStorage();
    dispatch(logoutUser());
    navigate("/");
  };

  const goToHomeByRole = () => navigate(getHomePathForRole(user.role));

  const getNavLinks = () => {
    const homeLink = { name: "דף הבית", path: "/" };

    const menus = {
      student: [
        homeLink,

        { name: "דשבורד", path: "/dashboard" },
        { name: "קורסים", path: "/courses" },
        { name: "קורס חדש", path: "/create-personal-course" },
        { name: "הודעות", path: "/messages" },
        { name: "משימות", path: "/tasks" },
        { name: "בולט", path: "/chat" },
        { name: "מילון", path: "/dictionary" },
        { name: "כתיבה", path: "/writing" },
      ],

      teacher: [
        homeLink,

        { name: "לוח בקרה", path: "/teacher/dashboard" },
        { name: "הכיתות שלי", path: "/teacher/students" },
        { name: "העלאת תוכן", path: "/teacher/create" },
        { name: "יצירת תרגיל", path: "/teacher/exercises/create" },
        { name: "הספרייה שלי", path: "/teacher/library" },
        { name: "הודעות", path: "/messages" },
        { name: "בדיקת משימות", path: "/teacher/grading" },
      ],

      admin: [
        homeLink,

        { name: "נתוני מערכת", path: "/admin/dashboard" },
        { name: "ניהול משתמשים", path: "/admin/users" },
        { name: "מאגר תוכן", path: "/admin/content" },
        { name: "שליחת הודעות", path: "/admin/messages" },
        { name: "ההודעות שלי", path: "/messages" },
        { name: "הגדרות", path: "/admin/settings" },
        { name: "המלצות", path: "/admin/reviews" },
      ],
    };

    return menus[user?.role] || menus.student;
  };

  const navLinks = getNavLinks();
  const userDisplayName = user.username || user.name || "לא מחובר";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#55b9ef] text-white"
      dir="rtl"
    >
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-white/0 via-white/0 to-[#0b4f88]/18" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full" dir="ltr">
          <div className="h-[94px] w-full border-b border-white/20 bg-gradient-to-b from-[#4c8ee4]/96 via-[#3d80d4]/96 to-[#2868ad]/96 shadow-[0_13px_36px_rgba(7,47,88,0.32)] backdrop-blur-xl">
            <div className="mx-auto grid h-full max-w-[1900px] grid-cols-[300px_1fr_255px] items-center gap-4 px-5">
              <div
                className="flex h-full min-w-0 items-center gap-4"
                dir="rtl"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={goToHomeByRole}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-white/32 bg-white/13 shadow-[inset_0_1px_0_rgba(255,255,255,0.20),0_8px_18px_rgba(7,35,64,0.20)] transition hover:bg-white/20"
                    title="חזרה לדשבורד"
                  >
                    <UserLineIcon />
                  </button>

                  <div className="leading-tight">
                    <div className="text-[19px] font-black text-white">
                      {userDisplayName}
                    </div>
                    <div className="text-[12px] font-bold text-white/76">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </div>

                <div className="h-10 w-px bg-white/25" />

                <button
                  type="button"
                  className="flex items-center gap-1"
                  title="בחירת שפה"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-[0_5px_12px_rgba(0,0,0,0.16)]">
                    🇬🇧
                  </span>
                  <span className="text-white/78">▾</span>
                </button>

                <MessageBell />
              </div>

              <nav
                className="flex h-full min-w-0 items-center justify-center"
                dir="rtl"
              >
                <div className="flex w-full max-w-[1060px] items-center justify-center rounded-full bg-[#072842]/92 px-4 py-3 shadow-[0_12px_32px_rgba(7,35,64,0.34),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-xl">
                  <div className="flex w-full items-center justify-center gap-1.5">
                    {navLinks.map((link) => {
                      const isActive =
                        location.pathname === link.path ||
                        (link.path !== "/" &&
                          link.path !== "/dashboard" &&
                          location.pathname.startsWith(link.path));
                      return (
                        <TopNavItem
                          key={link.path}
                          link={link}
                          isActive={isActive}
                          onClick={() => navigate(link.path)}
                        />
                      );
                    })}
                  </div>
                </div>
              </nav>

              <div
                className="flex h-full min-w-0 items-center justify-end gap-4"
                dir="rtl"
              >
                <button
                  type="button"
                  className="text-[18px] font-black text-white/92 transition hover:text-white"
                >
                  הגדרות
                </button>

                <div className="h-10 w-px bg-white/25" />

                <button
                  type="button"
                  className="flex items-center gap-2 text-[21px] font-black text-white"
                >
                  <CrownIcon />
                  <span>Premium</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-[#b8322a] px-5 py-2.5 text-[15px] font-black text-white shadow-[0_7px_16px_rgba(90,20,20,0.26)] transition hover:bg-[#9f2a24]"
                >
                  התנתק
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="relative flex-1 px-4 pb-8 pt-5 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function TopNavItem({ link, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-w-0 shrink rounded-full px-4 py-2.5 text-[clamp(15px,0.92vw,19px)] font-black leading-none transition-all ${isActive
        ? "bg-[#1c74b5] text-white shadow-[0_0_16px_rgba(255,255,255,0.16),inset_0_1px_0_rgba(255,255,255,0.16)]"
        : "bg-transparent text-white/90 hover:bg-[#1c74b5]/90 hover:text-white"
        }`}
      style={{
        textShadow: isActive
          ? "1.2px 1.2px 0 rgba(140,35,33,0.72), -1px -1px 0 rgba(5,44,80,0.85)"
          : "1px 1px 0 rgba(5,44,80,0.58)",
      }}
    >
      <span className="whitespace-nowrap">{link.name}</span>

      {isActive && (
        <span className="absolute -bottom-[7px] left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-white/85 shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
      )}
    </button>
  );
}

function UserLineIcon() {
  return (
    <svg className="h-6 w-6 text-white/90" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21c1-4.5 3.7-7 8-7s7 2.5 8 7"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg
      className="h-8 w-8 text-[#ffd439] drop-shadow"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 11H5L3 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getRoleLabel(role) {
  const labels = {
    student: "תלמידה",
    teacher: "מורה",
    admin: "מנהל",
  };

  return labels[role] || role;
}