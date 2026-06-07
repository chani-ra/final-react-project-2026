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

  const navLinks = getNavLinks();
  const userDisplayName = user.username || user.name || "לא מחובר";

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#4fb4ec] text-white"
      dir="rtl"
    >
      <MondlySkyBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50" dir="ltr">
          <div className="h-[78px] w-full border-b border-white/18 bg-gradient-to-b from-[#2f7bd6]/96 to-[#286fbd]/92 shadow-[0_9px_30px_rgba(7,47,88,0.24)] backdrop-blur-xl">
            <div className="mx-auto flex h-full max-w-[1900px] items-center gap-4 px-4 md:px-6">
              <div className="flex min-w-[260px] shrink-0 items-center gap-4" dir="rtl">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/10 shadow-inner">
                    <UserLineIcon />
                  </div>

                  <div className="leading-tight">
                    <div className="text-[18px] font-black text-white">
                      {userDisplayName}
                    </div>
                    <div className="text-[12px] font-bold text-white/72">
                      {getRoleLabel(user.role)}
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/24" />

                <button
                  type="button"
                  className="flex items-center gap-1"
                  title="בחירת שפה"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-[0_5px_12px_rgba(0,0,0,0.16)]">
                    🇬🇧
                  </span>
                  <span className="text-white/72">▾</span>
                </button>

                <MessageBell />
              </div>

              <nav className="min-w-0 flex-1" dir="rtl">
                <div className="mx-auto flex max-w-5xl items-center justify-center overflow-x-auto px-2 py-2">
                  <div className="flex min-w-max items-center justify-center gap-2 rounded-full bg-[#0b2f50]/78 px-4 py-2 shadow-[0_10px_26px_rgba(7,35,64,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                    {navLinks.map((link) => {
                      const isActive =
                        location.pathname === link.path ||
                        (link.path !== "/dashboard" &&
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

              <div className="flex min-w-[245px] shrink-0 items-center justify-end gap-4" dir="rtl">
                <button
                  type="button"
                  className="hidden text-[17px] font-black text-white/92 transition hover:text-white md:block"
                >
                  הגדרות
                </button>

                <div className="hidden h-8 w-px bg-white/24 md:block" />

                <button
                  type="button"
                  className="flex items-center gap-2 text-[20px] font-black text-white"
                >
                  <CrownIcon />
                  <span>Premium</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-[#b8322a] px-4 py-2 text-sm font-black text-white shadow-[0_6px_14px_rgba(90,20,20,0.22)] transition hover:bg-[#9f2a24]"
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
      className={`relative shrink-0 rounded-full px-5 py-2.5 text-[17px] font-black transition-all ${
        isActive
          ? "bg-[#176aa8] text-white shadow-[0_0_18px_rgba(255,255,255,0.18),inset_0_1px_0_rgba(255,255,255,0.16)]"
          : "bg-transparent text-white/86 hover:bg-[#176aa8]/80 hover:text-white"
      }`}
      style={{
        textShadow: isActive
          ? "1.2px 1.2px 0 rgba(184,50,42,0.82), -1px -1px 0 rgba(5,44,80,0.85)"
          : "1px 1px 0 rgba(5,44,80,0.58)",
      }}
    >
      {link.name}

      {isActive && (
        <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#ffd439] shadow-[0_0_14px_rgba(255,212,57,0.95)]" />
      )}
    </button>
  );
}

function MondlySkyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#5a95df] via-[#89d2e7] to-[#2c77b8]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.40),transparent_25%),radial-gradient(circle_at_78%_14%,rgba(255,255,255,0.27),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.08)_0%,transparent_36%,rgba(9,68,121,0.38)_100%)]" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.43]"
        viewBox="0 0 1800 950"
        preserveAspectRatio="xMidYMid slice"
      >
        <g
          fill="none"
          stroke="#d9f5ff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        >
          <path d="M0 270 H70 L110 235 H175 L225 180 L300 260 H420" />
          <path d="M1170 250 H1260 L1315 205 H1395 L1445 160 L1530 250 H1800" />
          <path d="M590 260 H670 L715 210 H780 L830 155 H910 L970 260 H1085" />

          <rect x="55" y="525" width="110" height="230" opacity="0.37" />
          <rect x="145" y="455" width="150" height="300" opacity="0.32" />
          <rect x="250" y="380" width="110" height="375" opacity="0.26" />

          <rect x="615" y="350" width="105" height="390" opacity="0.36" />
          <rect x="740" y="225" width="155" height="515" opacity="0.32" />
          <path d="M895 225 L970 300 V740 H895 Z" opacity="0.32" />

          <rect x="1410" y="400" width="100" height="335" opacity="0.37" />
          <rect x="1515" y="280" width="130" height="455" opacity="0.32" />
          <rect x="1605" y="345" width="120" height="390" opacity="0.27" />

          <path d="M0 505 H1800" opacity="0.56" />
          <path d="M0 585 H1800" opacity="0.37" />

          <path d="M260 520 C330 470 410 470 480 520" opacity="0.49" />
          <path d="M1010 535 C1080 485 1160 485 1230 535" opacity="0.49" />
          <path d="M1410 545 C1480 495 1560 495 1630 545" opacity="0.49" />

          <path d="M820 460 C900 410 990 415 1060 460" opacity="0.37" />
          <path d="M820 460 V520 H1060 V460" opacity="0.32" />

          <path d="M730 170 C760 145 805 145 835 170 C875 140 940 165 950 220 C965 295 855 315 835 260 C790 305 700 285 720 215 C690 205 700 185 730 170Z" opacity="0.41" />

          <circle cx="1060" cy="110" r="36" opacity="0.45" />
          <path d="M1060 146 V205" opacity="0.45" />

          <path d="M160 735 C230 690 315 690 385 735" opacity="0.49" />
          <path d="M1005 735 C1085 680 1185 680 1265 735" opacity="0.49" />
          <path d="M1485 735 C1555 690 1640 690 1710 735" opacity="0.49" />

          <path d="M135 455 C170 420 230 420 265 455" opacity="0.45" />
          <path d="M560 445 C590 420 640 420 670 445" opacity="0.45" />
          <path d="M1255 455 C1295 420 1360 420 1400 455" opacity="0.45" />

          <path d="M80 770 H365" opacity="0.31" />
          <path d="M1450 735 H1780" opacity="0.31" />
          <path d="M560 770 H970" opacity="0.23" />
        </g>
      </svg>

      <div className="absolute bottom-0 left-0 right-0 h-[36%] bg-[#1e67a7]/26" />
      <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-[#14548f]/26" />
      <div className="absolute right-[8%] top-24 h-28 w-80 rounded-full bg-white/16 blur-2xl" />
      <div className="absolute left-[12%] top-36 h-32 w-[30rem] rounded-full bg-white/14 blur-2xl" />
    </div>
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
    <svg className="h-8 w-8 text-[#ffd439] drop-shadow" viewBox="0 0 24 24" fill="none">
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