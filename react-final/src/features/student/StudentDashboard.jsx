import React from "react";
import { useSelector } from "react-redux";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div className="text-white p-10">טוען נתוני משתמש...</div>;
  }

  const userName = user.username || user.name || "תלמיד";
  const englishLevel = user.englishLevel || user.level || "beginner";
  const hobbies = user.favoriteHobbies || user.interests || [];
  const expectations = user.expectations || [];

  const hobbyLabels = {
    art_music: "אמנות ומוזיקה",
    sports: "ספורט",
    movies: "סרטים וסרטונים",
    books: "ספרים וקריאה",
  };

  const expectationLabels = {
    grammar: "דקדוק",
    fluent_speaking: "דיבור שוטף",
    confidence: "ביטחון באנגלית",
    vocabulary: "אוצר מילים",
  };

  const levelLabels = {
    beginner: "מתחיל",
    intermediate: "בינוני",
    advanced: "מתקדם",
  };

  const getPersonalizedTasks = () => {
    const tasks = [];

    if (expectations.includes("vocabulary")) {
      tasks.push({
        title: "📚 חיזוק אוצר מילים",
        desc: "למד/י 5 מילים חדשות שמתאימות לתחומי העניין שלך.",
      });
    }

    if (expectations.includes("grammar")) {
      tasks.push({
        title: "🧠 תרגול דקדוק קצר",
        desc: "תרגול ממוקד של משפטים פשוטים לפי הרמה שלך.",
      });
    }

    if (expectations.includes("fluent_speaking")) {
      tasks.push({
        title: "🗣️ תרגול דיבור",
        desc: "ענה/י בקול על 3 שאלות יומיומיות באנגלית.",
      });
    }

    if (expectations.includes("confidence")) {
      tasks.push({
        title: "💪 ביטחון באנגלית",
        desc: "כתוב/כתבי משפט קצר באנגלית ושלח/י לתרגול.",
      });
    }

    if (tasks.length === 0) {
      tasks.push({
        title: "🎯 משימת פתיחה",
        desc: "התחל/י עם שיעור ראשון קצר ובדקי מה הכי מתאים לך.",
      });
    }

    return tasks;
  };

  const myTasks = getPersonalizedTasks();

  return (
    <div className="space-y-8" dir="rtl">
      <header className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold">היי {userName}! 👋</h1>
          <p className="text-gray-400 mt-2">
            איזה כיף לראות אותך. כאן מתחיל מסלול האנגלית האישי שלך.
          </p>
        </div>

        <div className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg">
          רמה: {levelLabels[englishLevel] || englishLevel}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">
              המסלול האישי שלך ✨
            </h2>

            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl border border-white/10 p-6 space-y-5">
              <div>
                <p className="text-sm text-gray-400 mb-2">תחומי עניין:</p>

                {hobbies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-sm font-bold"
                      >
                        {hobbyLabels[hobby] || hobby}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">עדיין לא נבחרו תחביבים.</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">מטרות למידה:</p>

                {expectations.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {expectations.map((item) => (
                      <span
                        key={item}
                        className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 px-3 py-1.5 rounded-xl text-sm font-bold"
                      >
                        {expectationLabels[item] || item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">עדיין לא נבחרו מטרות.</p>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-xl font-bold mb-4">המשימות הראשונות שלי</h2>

            <div className="grid gap-4">
              {myTasks.map((task, index) => (
                <div
                  key={index}
                  className="bg-white/10 p-4 rounded-xl flex items-start gap-4 border border-white/5"
                >
                  <div className="text-2xl">📝</div>
                  <div>
                    <h4 className="font-bold text-yellow-400">{task.title}</h4>
                    <p className="text-sm text-gray-300">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-900 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">✨ ההתחלה שלך</h2>
            <ul className="space-y-3 font-semibold">
              <li className="bg-black/10 p-2 rounded-lg">
                📚 פתח/י את הקורסים שלי
              </li>
              <li className="bg-black/10 p-2 rounded-lg">
                🤖 תרגל/י עם בולט AI
              </li>
              <li className="bg-black/10 p-2 rounded-lg">
                📝 בצע/י משימה ראשונה
              </li>
            </ul>
          </div>

          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
            <h3 className="font-bold mb-2">צריך עזרה?</h3>
            <p className="text-sm text-gray-400 mb-4">
              אפשר לתרגל בצ׳אט או לחזור לקורסים בכל רגע.
            </p>
            <button className="bg-indigo-600 w-full py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
              צ׳אט עם בולט 🤖
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}