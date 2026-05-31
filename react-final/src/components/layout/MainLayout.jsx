import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";
import MessageBell from "./MessageBell";

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const goToHomeByRole = () => {
    if (user.role === "teacher") {
      navigate("/teacher/dashboard");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    navigate("/dashboard");
  };

  const getNavLinks = () => {
    const menus = {
      student: [
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
        { name: "לוח בקרה", path: "/teacher/dashboard" },
        { name: "הכיתות שלי", path: "/teacher/students" },
        { name: "העלאת תוכן", path: "/teacher/create" },
        { name: "יצירת תרגיל", path: "/teacher/exercises/create" },
        { name: "יצירת בוחן", path: "/teacher/quizzes/create" },
        { name: "הספרייה שלי", path: "/teacher/library" },
        { name: "הודעות", path: "/messages" },
        { name: "בדיקת משימות", path: "/teacher/grading" },
      ],

      admin: [
        { name: "נתוני מערכת", path: "/admin/dashboard" },
        { name: "ניהול משתמשים", path: "/admin/users" },
        { name: "מאגר תוכן", path: "/admin/content" },
        { name: "שליחת הודעות", path: "/admin/messages" },
        { name: "ההודעות שלי", path: "/messages" },
        { name: "הגדרות", path: "/admin/settings" },
      ],
    };

    return menus[user?.role] || menus.student;
  };

  const userDisplayName = user.username || user.name || "משתמש";

  return (
    <div
      className="min-h-screen text-slate-900 relative overflow-x-hidden bg-[#55B7EC]"
      dir="rtl"
    >
      <SkyIllustrationBackground />

      <div className="relative z-10">
        <nav className="sticky top-0 z-50 px-4 md:px-6 py-3">
          <div className="max-w-7xl mx-auto min-h-[78px] bg-[#5BBFED]/55 backdrop-blur-2xl border border-white/45 shadow-[0_18px_50px_rgba(7,89,133,0.20)] rounded-[1.8rem] px-5 py-3 flex items-center justify-between gap-5">
            <button
              type="button"
              className="text-3xl font-black tracking-tight text-white shrink-0 leading-none"
              onClick={goToHomeByRole}
              style={{
                textShadow:
                  "2px 2px 0 rgba(184,50,42,0.7), -1px -1px 0 rgba(15,76,117,0.55)",
              }}
            >
              English<span className="text-white/90">Wise</span>
            </button>

            <div className="hidden xl:flex items-center justify-center gap-6 flex-1 min-w-0">
              {getNavLinks().map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== "/dashboard" &&
                    location.pathname.startsWith(link.path));

                return (
                  <NavTextButton
                    key={link.path}
                    link={link}
                    isActive={isActive}
                    onClick={() => navigate(link.path)}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <MessageBell />

              <div className="hidden sm:flex items-center gap-3 bg-white/16 border border-white/25 rounded-2xl px-3 py-2">
                <div className="w-9 h-9 rounded-2xl bg-white text-[#0F4C75] flex items-center justify-center font-black shadow-sm">
                  {userDisplayName?.[0] || "U"}
                </div>

                <div>
                  <div className="text-sm font-black text-white leading-tight">
                    {userDisplayName}
                  </div>

                  <div className="text-[11px] text-white/72">
                    {getRoleLabel(user.role)}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-[#B8322A] text-white hover:bg-[#9F2A24] px-4 py-2.5 rounded-2xl text-sm font-black transition-all shadow-sm"
              >
                התנתק
              </button>
            </div>
          </div>

          <div className="xl:hidden max-w-7xl mx-auto mt-3 bg-[#5BBFED]/55 backdrop-blur-2xl border border-white/40 shadow-sm rounded-[1.4rem] p-3">
            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-center">
              {getNavLinks().map((link) => {
                const isActive =
                  location.pathname === link.path ||
                  (link.path !== "/dashboard" &&
                    location.pathname.startsWith(link.path));

                return (
                  <NavTextButton
                    key={link.path}
                    link={link}
                    isActive={isActive}
                    compact
                    onClick={() => navigate(link.path)}
                  />
                );
              })}
            </div>
          </div>
        </nav>

        {user.role === "student" && (
          <div className="px-4 md:px-8 pt-2 max-w-7xl mx-auto">
            <div className="bg-[#5BBFED]/42 backdrop-blur-2xl border border-white/35 rounded-2xl p-3 shadow-sm">
              <div className="flex justify-between text-xs mb-1 font-bold text-white/90">
                <span>התקדמות כללית בקורסים</span>
                <span>{user.progress || 0}%</span>
              </div>

              <div className="h-2 bg-white/25 rounded-full w-full overflow-hidden">
                <div
                  className="h-full bg-[#B8322A] rounded-full transition-all duration-1000"
                  style={{ width: `${user.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavTextButton({ link, isActive, compact = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-10 px-1.5 font-black transition-colors whitespace-nowrap ${
        compact ? "text-base" : "text-[17px]"
      } ${isActive ? "text-white" : "text-white/86 hover:text-white"}`}
      style={{
        textShadow: isActive
          ? "1.5px 1.5px 0 #B8322A, -1px -1px 0 rgba(15,76,117,0.9), 0 0 10px rgba(255,255,255,0.35)"
          : "1px 1px 0 rgba(15,76,117,0.68)",
      }}
    >
      <span className="relative z-10">{link.name}</span>

      <span
        className={`absolute left-0 right-0 -bottom-0.5 mx-auto h-[3px] rounded-full transition-all duration-200 ${
          isActive ? "w-full bg-[#B8322A]" : "w-0 bg-[#B8322A]"
        }`}
      />

      {isActive && (
        <span className="absolute -inset-x-3 inset-y-1 rounded-full bg-white/10 -z-0" />
      )}
    </button>
  );
}

function SkyIllustrationBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#61C4F3] via-[#4EADE4] to-[#2B83C6]" />

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.28]"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M40 245 H105 L145 205 L190 245 H280" />
          <path d="M1220 180 H1280 L1325 130 L1370 180 H1510" />
          <path d="M980 210 H1040 L1080 170 L1120 210 H1180" />

          <path d="M80 650 C170 590 230 620 315 560 C410 492 510 540 602 480 C695 420 790 450 875 390 C970 322 1060 370 1160 300 C1275 220 1390 260 1520 175" />
          <path d="M105 690 C190 635 250 660 345 600 C440 545 535 570 635 520 C740 468 835 500 935 435 C1048 360 1140 400 1255 330 C1360 268 1440 288 1530 235" />

          <path d="M120 790 H1480" opacity="0.45" />
          <path d="M210 760 C270 710 330 710 390 760" opacity="0.5" />
          <path d="M760 745 C840 685 920 685 1000 745" opacity="0.5" />
          <path d="M1180 760 C1240 710 1300 710 1360 760" opacity="0.5" />

          <rect
            x="210"
            y="510"
            width="100"
            height="180"
            rx="8"
            opacity="0.35"
          />
          <rect
            x="335"
            y="450"
            width="150"
            height="240"
            rx="8"
            opacity="0.35"
          />
          <rect
            x="1130"
            y="480"
            width="115"
            height="200"
            rx="8"
            opacity="0.35"
          />
          <rect
            x="1270"
            y="420"
            width="170"
            height="260"
            rx="8"
            opacity="0.35"
          />

          <circle cx="185" cy="390" r="28" opacity="0.42" />
          <path d="M185 418 V520" opacity="0.42" />

          <circle cx="1430" cy="355" r="33" opacity="0.42" />
          <path d="M1430 388 V520" opacity="0.42" />

          <path
            d="M680 190 C705 165 745 165 770 190 C800 165 850 177 862 220 C875 266 835 300 790 286 C760 320 705 305 700 260 C660 252 650 212 680 190Z"
            opacity="0.45"
          />
        </g>
      </svg>

      <div className="absolute top-24 right-[8%] w-80 h-28 rounded-full bg-white/16 blur-2xl" />
      <div className="absolute top-36 left-[12%] w-[30rem] h-32 rounded-full bg-white/14 blur-2xl" />
      <div className="absolute bottom-[-120px] right-[-8%] w-[55%] h-80 rounded-t-full bg-white/10 blur-2xl" />
      <div className="absolute bottom-[-150px] left-[-8%] w-[55%] h-96 rounded-t-full bg-white/8 blur-2xl" />
    </div>
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