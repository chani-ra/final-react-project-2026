import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWeeklySong } from "../../services/songService";
import CustomAudioPlayer from "../../components/CustomAudioPlayer";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const userData = authState.user;

  const [weeklySong, setWeeklySong] = useState(null);
  const [weeklySongLoading, setWeeklySongLoading] = useState(true);
  const [weeklySongError, setWeeklySongError] = useState("");

  // טעינת שיר השבוע שנבחר על ידי המנהל
  const loadWeeklySong = async () => {
    try {
      setWeeklySongLoading(true);
      setWeeklySongError("");

      const song = await getWeeklySong();
      setWeeklySong(song);
    } catch (error) {
      setWeeklySongError(error.toString());
    } finally {
      setWeeklySongLoading(false);
    }
  };

  useEffect(() => {
    loadWeeklySong();
  }, []);

  if (!userData) {
    return <div className="text-white p-10">טוען נתונים...</div>;
  }

  const name = userData.username || userData.name || "תלמידה";
  const level = userData.englishLevel || userData.level || "beginner";
  const interests = userData.favoriteHobbies || userData.interests || [];

  // משימות קצרות לפי תחביבים ורמה
  const getPersonalizedTasks = () => {
    const tasks = [];

    if (interests.includes("art_music")) {
      tasks.push({
        title: "🎶 מילים מתוך שיר",
        desc: "האזיני לשיר קצר וכתבי 3 מילים חדשות שלמדת.",
      });
    }

    if (interests.includes("sports")) {
      tasks.push({
        title: "⚽ English Sport Words",
        desc: "כתבי 5 מילים באנגלית שקשורות לספורט.",
      });
    }

    if (interests.includes("movies")) {
      tasks.push({
        title: "🎬 תיאור סצנה",
        desc: "כתבי 2 משפטים באנגלית שמתארים קטע קצר.",
      });
    }

    if (interests.includes("books")) {
      tasks.push({
        title: "📚 Reading Practice",
        desc: "קראי פסקה קצרה וכתבי משפט אחד על מה הבנת.",
      });
    }

    tasks.push({
      title: level === "advanced" ? "כתיבה יצירתית" : "אוצר מילים יומי",
      desc:
        level === "advanced"
          ? "כתבי פסקה קצרה באנגלית בנושא שמעניין אותך."
          : "תרגלי 5 מילים חדשות שמתאימות ליום־יום.",
    });

    return tasks;
  };

  const myTasks = getPersonalizedTasks();

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10 text-white" dir="rtl">
      <header className="mb-8 bg-white/5 p-7 rounded-3xl border border-white/10">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black">היי {name}! 👋</h1>

            <p className="text-gray-400 mt-2">
              איזה כיף לראות אותך. הנה הלמידה האישית שלך להיום.
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-lg h-fit">
            רמה: {getLevelLabel(level)}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <main className="xl:col-span-2 space-y-8">
          <section className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 p-7 rounded-3xl border border-indigo-400/20">
            <div className="flex flex-col md:flex-row justify-between gap-5">
              <div>
                <h2 className="text-2xl font-black text-yellow-400 mb-2">
                  ✨ המסלול האישי שלך
                </h2>

                <p className="text-gray-300 leading-relaxed">
                  המערכת בונה עבורך למידה לפי הרמה, התחביבים והמטרות שבחרת.
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {interests.length > 0 ? (
                    interests.map((interest) => (
                      <span
                        key={interest}
                        className="bg-white/10 border border-white/10 px-3 py-1 rounded-full text-sm text-gray-200"
                      >
                        {getHobbyLabel(interest)}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      לא נבחרו תחביבים עדיין
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate("/courses")}
                className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-4 rounded-2xl transition-all h-fit"
              >
                פתחי את הקורסים שלי
              </button>
            </div>
          </section>

          <section className="bg-white/5 p-7 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-black">המשימות שלי להיום 📝</h2>
                <p className="text-gray-400 text-sm mt-1">
                  משימות קצרות כדי להתקדם בלי עומס.
                </p>
              </div>

              <button
                onClick={() => navigate("/tasks")}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl"
              >
                כל המשימות
              </button>
            </div>

            <div className="grid gap-4">
              {myTasks.map((task, idx) => (
                <div
                  key={`${task.title}-${idx}`}
                  className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl flex items-start gap-4"
                >
                  <div className="text-2xl">📝</div>

                  <div>
                    <h4 className="font-black text-yellow-400">
                      {task.title}
                    </h4>

                    <p className="text-sm text-gray-300 mt-1">{task.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="space-y-8">
          <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex justify-between items-start gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-black">🌟 שיר השבוע</h2>

                <p className="text-gray-400 text-sm mt-1">
                  בחירה מיוחדת של מנהל האתר לתרגול האזנה.
                </p>
              </div>

              <div className="bg-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
                Weekly
              </div>
            </div>

            {weeklySongLoading ? (
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-6 text-center text-gray-400">
                טוען את שיר השבוע...
              </div>
            ) : weeklySongError ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-4 text-sm font-bold">
                {weeklySongError}
              </div>
            ) : !weeklySong ? (
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🎵</div>

                <p className="text-gray-400 text-sm">
                  עדיין לא נבחר שיר שבועי.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-5">
                  <div className="text-4xl mb-3">🎵</div>

                  <h3 className="text-xl font-black text-white">
                    {weeklySong.title || weeklySong.theme || "שיר לימודי"}
                  </h3>

                  <p className="text-gray-400 text-sm mt-2">
                    נושא: {weeklySong.theme || "לא צוין"} · רמה:{" "}
                    {getLevelLabel(weeklySong.level)}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    מורה: {weeklySong.uploadedBy?.username || "לא ידוע"}
                  </p>
                </div>

                <CustomAudioPlayer
                  src={`http://localhost:3000/songs/song/${weeklySong._id}/stream`}
                  title={weeklySong.title || weeklySong.theme || "שיר השבוע"}
                  subtitle={`תרגול האזנה · ${getLevelLabel(weeklySong.level)}`}
                  allowDownload={false}
                />
              </div>
            )}
          </section>

          <section className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-3xl text-slate-950 shadow-xl">
            <h2 className="text-2xl font-black mb-3">🤖 המאמן האישי</h2>

            <p className="text-sm font-semibold leading-relaxed mb-5">
              בקרוב: המאמן ינתח את ההתקדמות שלך וייתן לך משימה אישית בכל יום.
            </p>

            <button
              onClick={() => navigate("/chat")}
              className="bg-slate-950 text-white w-full py-3 rounded-xl font-black hover:bg-slate-800 transition-all"
            >
              צ׳אט עם AI
            </button>
          </section>

          <section className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
            <h3 className="font-black mb-2">צריכה עזרה?</h3>

            <p className="text-sm text-gray-400 mb-4">
              אפשר לפנות למורה או להיעזר בתרגול AI.
            </p>

            <button
              onClick={() => navigate("/chat")}
              className="bg-indigo-600 w-full py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all"
            >
              פתחי צ׳אט 🤖
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}

function getHobbyLabel(hobby) {
  const labels = {
    art_music: "אמנות ומוזיקה",
    sports: "ספורט",
    movies: "סרטים וסרטונים",
    books: "ספרים וקריאה",
  };

  return labels[hobby] || hobby;
}