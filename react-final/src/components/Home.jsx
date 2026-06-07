import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #A8D8FF 0%, #E0F4FF 50%, #B5DCFF 100%)",
      }}
      dir="rtl"
    >
      {/* White line sketch overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <line x1="0" y1="200" x2="1000" y2="200" stroke="white" strokeWidth="2"/>
          <line x1="0" y1="400" x2="1000" y2="400" stroke="white" strokeWidth="2"/>
          <line x1="200" y1="0" x2="200" y2="1000" stroke="white" strokeWidth="2"/>
          <line x1="400" y1="0" x2="400" y2="1000" stroke="white" strokeWidth="2"/>
        </svg>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-black tracking-tighter">
            <span className="text-red-600">English</span>
            <span className="text-blue-600 ml-1">Wise</span>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all"
          >
            התחברות
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-red-500 rounded-full text-sm font-semibold text-red-600">
              ✨ לימוד אנגלית בהתאמה אישית
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black leading-tight text-blue-700">
                ללמוד
                <br />
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-yellow-500 bg-clip-text text-transparent">
                  אנגלית
                </span>
                <br />
                <span className="text-blue-600">בדרך שמתאימה לך</span>
              </h1>

              <p className="text-lg text-gray-700 leading-relaxed max-w-xl">
                אתר חכם ללימוד אנגלית לפי גיל, רמה, תחביבים ומטרות אישיות. בונים לך מסלול לימוד עם שיעורים אינטראקטיביים, תרגילים מתקדמים וכלים חכמים.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-red-500/50"
              >
                התחלת הרשמה 🚀
              </button>

              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-xl transition-all"
              >
                יש לי חשבון
              </button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-3 gap-3 pt-8">
              <div className="bg-white border-2 border-blue-500 rounded-lg p-4 text-center space-y-2">
                <div className="text-2xl">🎯</div>
                <div className="text-xs font-bold text-blue-700">מסלול אישי</div>
              </div>
              <div className="bg-white border-2 border-red-500 rounded-lg p-4 text-center space-y-2">
                <div className="text-2xl">📚</div>
                <div className="text-xs font-bold text-red-700">שיעורים ותרגול</div>
              </div>
              <div className="bg-white border-2 border-yellow-500 rounded-lg p-4 text-center space-y-2">
                <div className="text-2xl">🤖</div>
                <div className="text-xs font-bold text-yellow-700">AI עוזר</div>
              </div>
            </div>
          </section>

          {/* Right Side - Card */}
          <section className="relative">
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl border-4 border-blue-600 p-8 space-y-6 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-blue-700">המסלול שלך</h3>
                  <p className="text-gray-600 text-sm">נבנה עבורך בדיוק</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🧠
                </div>
              </div>

              {/* Stats Boxes */}
              <div className="space-y-3">
                {/* Box 1 */}
                <div className="bg-blue-50 border-2 border-blue-500 rounded-2xl p-4 space-y-2 hover:border-blue-700 transition">
                  <div className="text-xs text-blue-700 font-semibold">תחביבים</div>
                  <div className="text-gray-800 font-bold">🎬 סרטים · 📚 קריאה · 🎵 מוזיקה</div>
                </div>

                {/* Box 2 */}
                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 space-y-2 hover:border-red-700 transition">
                  <div className="text-xs text-red-700 font-semibold">מטרה</div>
                  <div className="text-gray-800 font-bold">דיבור שוטף וביטחון</div>
                </div>

                {/* Box 3 - Progress */}
                <div className="bg-yellow-50 border-2 border-yellow-500 rounded-2xl p-4 space-y-3 hover:border-yellow-700 transition">
                  <div className="text-xs text-yellow-700 font-semibold">התקדמות</div>
                  <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full transition-all"
                      style={{ width: "68%" }}
                    ></div>
                  </div>
                  <div className="text-xs text-yellow-700 font-bold">68% במסלול</div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/register")}
                className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black rounded-2xl transition-all shadow-lg"
              >
                בואו נתחילו ✨
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t-2 border-blue-600 mt-20 py-8 text-center text-gray-700 text-sm">
        © 2026 EnglishWise - לימוד אנגלית בדרך חכמה
      </footer>
    </div>
  );
}