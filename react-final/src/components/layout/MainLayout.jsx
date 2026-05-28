import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../../redux/slices/authSlice";
import MessageBell from "./MessageBell";

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [theme, setTheme] = useState("dark");

  // אם אין משתמש מחובר — החזרה לדף הבית
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  // התנתקות וניקוי המשתמש מה־Redux ומה־localStorage
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // ניווט ללוח הבקרה לפי תפקיד
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

  // בניית תפריט לפי סוג המשתמש
  const getNavLinks = () => {
    const menus = {
      student: [
        { name: "דשבורד", path: "/dashboard", icon: "🏠" },
        { name: "הקורסים שלי", path: "/courses", icon: "📚" },
        { name: "קורס חדש", path: "/create-personal-course", icon: "✨" },
        { name: "הודעות", path: "/messages", icon: "💬" },
        { name: "המשימות שלי", path: "/tasks", icon: "📝" },
        { name: "צ'אט בולט", path: "/chat", icon: "🤖" },
        { name: "מילון אישי", path: "/dictionary", icon: "📖" },
      ],

      teacher: [
        { name: "לוח בקרה", path: "/teacher/dashboard", icon: "📊" },
        { name: "הכיתות שלי", path: "/teacher/students", icon: "👥" },
        { name: "העלאת תוכן", path: "/teacher/create", icon: "✨" },
        { name: "יצירת תרגיל", path: "/teacher/exercises/create", icon: "📝" },
        { name: "הספרייה שלי", path: "/teacher/library", icon: "📂" },
        { name: "הודעות", path: "/messages", icon: "💬" },
        { name: "בדיקת משימות", path: "/teacher/grading", icon: "✅" },
      ],

      admin: [
        { name: "נתוני מערכת", path: "/admin/dashboard", icon: "📈" },
        { name: "ניהול משתמשים", path: "/admin/users", icon: "👥" },
        { name: "מאגר תוכן", path: "/admin/content", icon: "🗂️" },
        { name: "שליחת הודעות", path: "/admin/messages", icon: "📣" },
        { name: "ההודעות שלי", path: "/messages", icon: "📥" },
        { name: "הגדרות", path: "/admin/settings", icon: "🛠️" },
      ],
    };

    return menus[user?.role] || menus.student;
  };

  const bgColor =
    theme === "dark"
      ? "bg-slate-950 text-white"
      : "bg-stone-50 text-slate-900";

  const navColor =
    theme === "dark"
      ? "bg-slate-900 border-white/10"
      : "bg-white border-stone-200";

  const brandTextColor = theme === "dark" ? "text-white" : "text-slate-900";

  const dividerColor =
    theme === "dark" ? "bg-white/10" : "bg-stone-200";

  const userDisplayName = user.username || user.name || "משתמש";

  return (
    <div
      className={`min-h-screen ${bgColor} transition-colors duration-500`}
      dir="rtl"
    >
      <nav
        className={`${navColor} border-b px-6 py-3 flex justify-between items-center shadow-sm sticky top-0 z-40`}
      >
        <div className="flex items-center gap-8">
          <button
            type="button"
            className="text-2xl font-black tracking-tight text-yellow-500 cursor-pointer"
            onClick={goToHomeByRole}
          >
            English
            <span className={brandTextColor}>Wise</span>
          </button>

          <div className="hidden md:flex gap-2">
            {getNavLinks().map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  theme === "dark"
                    ? "hover:bg-white/10 hover:text-yellow-400"
                    : "hover:bg-stone-100 hover:text-yellow-600"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                {link.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <MessageBell />

          <button
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-full transition-all text-xl ${
              theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
            }`}
            title="החלף מצב תאורה"
          >
            {theme === "dark" ? "💡" : "🌙"}
          </button>

          <div className={`h-8 w-px ${dividerColor} mx-2`} />

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold hidden sm:block">
              {userDisplayName}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              התנתק
            </button>
          </div>
        </div>
      </nav>

      {user.role === "student" && (
        <div className="px-8 pt-4 max-w-7xl mx-auto">
          <div className="flex justify-between text-xs mb-1 font-semibold opacity-70">
            <span>התקדמות כללית בקורסים</span>
            <span>{user.progress || 0}%</span>
          </div>

          <div className="h-1.5 bg-gray-200 rounded-full w-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
              style={{ width: `${user.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      <main className="p-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}