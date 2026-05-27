import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950 text-white overflow-hidden"
      dir="rtl"
    >
      {/* Navbar עליון פשוט */}
      <header className="w-full px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-3xl font-black tracking-tight text-yellow-400">
          English<span className="text-white">Wise</span>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
        >
          כבר רשום? התחברות
        </button>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* צד טקסט */}
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 px-4 py-2 rounded-full text-sm font-bold">
            ✨ לימוד אנגלית בהתאמה אישית
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              ללמוד אנגלית
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                בדרך שמתאימה לך
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-xl">
              אתר חכם ללימוד אנגלית לפי גיל, רמה, תחביבים ומטרות אישיות.
              בונים לך מסלול לימוד עם שיעורים, תרגילים, בחנים וכלים להתקדמות.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/register")}
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-4 rounded-2xl shadow-xl shadow-yellow-400/20 transition-all hover:scale-105"
            >
              התחלת הרשמה 🚀
            </button>

            <button
              onClick={() => navigate("/login")}
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl transition-all"
            >
              יש לי כבר חשבון
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-bold">מסלול אישי</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-sm font-bold">שיעורים ותרגול</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">🤖</div>
              <div className="text-sm font-bold">עזרה חכמה</div>
            </div>
          </div>
        </section>

        {/* צד כרטיס ויזואלי */}
        <section className="relative">
          <div className="absolute -top-10 -left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl"></div>

          <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
            <div className="bg-slate-950/70 rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl">
                  🧠
                </div>
                <div>
                  <h3 className="text-xl font-black">המסלול שלך</h3>
                  <p className="text-gray-400 text-sm">
                    נבנה לפי הבחירות שלך
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">תחביבים</div>
                  <div className="font-bold">🎬 סרטים · 📚 קריאה · 🎵 מוזיקה</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-1">מטרה</div>
                  <div className="font-bold">דיבור שוטף וביטחון באנגלית</div>
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">התקדמות</div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[68%] bg-yellow-400 rounded-full"></div>
                  </div>
                  <div className="text-xs text-yellow-300 mt-2 font-bold">
                    68% במסלול הראשון
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/register")}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black transition-all"
              >
                בואו נבנה לי מסלול ✨
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}