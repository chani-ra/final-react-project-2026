import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../../services/courseService";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [firstCourse, setFirstCourse] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    const loadFirstCourse = async () => {
      try {
        setCoursesLoading(true);

        const data = await getMyCourses();
        const courses = data.courses || [];

        if (courses.length > 0) {
          setFirstCourse(courses[0]);
        }
      } catch (error) {
        console.error("שגיאה בטעינת הקורס הראשון:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadFirstCourse();
  }, []);

  if (!user) {
    return <div className="text-white p-10">טוען נתוני משתמש...</div>;
  }

  const userName = user.username || user.name || "תלמיד";
  const englishLevel = user.englishLevel || user.level || "beginner";

  const levelLabels = {
    beginner: "מתחיל",
    intermediate: "בינוני",
    advanced: "מתקדם",
  };

  const getOpeningTask = () => {
    if (englishLevel === "advanced") {
      return {
        title: "כתיבה קצרה באנגלית",
        desc: "כתוב/כתבי פסקה קצרה באנגלית כדי לבדוק את רמת הביטוי שלך.",
      };
    }

    if (englishLevel === "intermediate") {
      return {
        title: "תרגול שיחה בסיסית",
        desc: "ענה/עני על כמה שאלות פשוטות באנגלית כדי להתחיל לתרגל.",
      };
    }

    return {
      title: "אוצר מילים ראשון",
      desc: "התחל/י עם מילים בסיסיות ומשפטים קצרים באנגלית.",
    };
  };

  const openingTask = getOpeningTask();

  const handleStartPersonalCourse = () => {
    if (firstCourse?._id) {
      navigate(`/course/${firstCourse._id}`);
    } else {
      navigate("/courses");
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <header className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">היי {userName}! 👋</h1>
          <p className="text-gray-400 mt-2">
            איזה כיף לראות אותך. המסלול האישי שלך באנגלית מוכן להתחלה.
          </p>
        </div>

        <div className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg">
          רמה: {levelLabels[englishLevel] || englishLevel}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-3xl font-bold mb-4 text-yellow-400">
              המסלול האישי שלך ✨
            </h2>

            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10 p-8 space-y-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧠</div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {firstCourse
                      ? "הקורס האישי שלך מוכן"
                      : "בנינו לך התחלה מותאמת אישית"}
                  </h3>

                  <p className="text-gray-300 leading-relaxed">
                    {firstCourse
                      ? `הקורס "${firstCourse.title}" מוכן עבורך. אפשר להתחיל ללמוד עכשיו.`
                      : "המערכת משתמשת בפרטים שבחרת בהרשמה כדי להתאים לך קורסים, משימות ותרגול לפי הרמה והמטרות שלך."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-black/20 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="font-bold">קורס אישי</div>
                  <div className="text-xs text-gray-400 mt-1">
                    מותאם לרמה שלך
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="font-bold">משימות</div>
                  <div className="text-xs text-gray-400 mt-1">
                    לתרגול הדרגתי
                  </div>
                </div>

                <div className="bg-black/20 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <div className="font-bold">AI לתרגול</div>
                  <div className="text-xs text-gray-400 mt-1">
                    עוזר אישי באנגלית
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <button
                  onClick={handleStartPersonalCourse}
                  disabled={coursesLoading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg"
                >
                  {coursesLoading
                    ? "טוען את הקורס שלך..."
                    : firstCourse
                    ? "התחל/י את הקורס האישי שלך 🚀"
                    : "מצאי קורס להתחלה 🚀"}
                </button>

                <button
                  onClick={() => navigate("/courses")}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl transition-all border border-white/10"
                >
                  לכל הקורסים שלי 📚
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">המשימה הראשונה שלי</h2>

            <div className="bg-white/10 p-5 rounded-2xl flex items-start gap-4 border border-white/5">
              <div className="text-3xl">📝</div>

              <div className="flex-1">
                <h4 className="font-bold text-yellow-400 text-lg">
                  {openingTask.title}
                </h4>
                <p className="text-sm text-gray-300 mt-1">
                  {openingTask.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/tasks")}
              className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              מעבר למשימות שלי
            </button>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-900 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">✨ ההתחלה שלך</h2>

            <ul className="space-y-3 font-semibold">
              <li className="bg-black/10 p-3 rounded-lg">
                📚 התחלת הקורס האישי
              </li>
              <li className="bg-black/10 p-3 rounded-lg">
                🤖 תרגול עם בולט AI
              </li>
              <li className="bg-black/10 p-3 rounded-lg">
                📝 ביצוע משימה ראשונה
              </li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
            <h3 className="font-bold mb-2">רוצה לתרגל עכשיו?</h3>

            <p className="text-sm text-gray-400 mb-4">
              אפשר להתחיל שיחה קצרה באנגלית עם בולט.
            </p>

            <button
              onClick={() => navigate("/chat")}
              className="bg-indigo-600 w-full py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all"
            >
              צ׳אט עם בולט 🤖
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}