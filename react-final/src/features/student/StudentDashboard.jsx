import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getWeeklySong } from "../../services/songService";
import CustomAudioPlayer from "../../components/CustomAudioPlayer";
import AICoachCard from "./components/AICoachCard";
import SmartLearningPath from "./components/SmartLearningPath";
import StudentBrainMap from "./components/StudentBrainMap";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const userData = user;

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

  const profile = useMemo(() => {
    const name = userData?.username || userData?.name || "תלמידה";
    const level = userData?.englishLevel || userData?.level || "beginner";
    const interests = userData?.favoriteHobbies || userData?.interests || [];
    const expectations = userData?.expectations || [];

    return {
      name,
      level,
      interests,
      expectations,
    };
  }, [userData]);

  const dailyTasks = useMemo(() => {
    return buildPersonalizedTasks({
      level: profile.level,
      interests: profile.interests,
      expectations: profile.expectations,
    });
  }, [profile.level, profile.interests, profile.expectations]);

  if (!userData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white">
        <div className="animate-pulse font-bold">טוען נתוני תלמידה...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <DashboardHeader
        name={profile.name}
        level={profile.level}
        expectations={profile.expectations}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <main className="xl:col-span-2 space-y-8">
          <PersonalCourseCard
            interests={profile.interests}
            onGoToCourses={() => navigate("/courses")}
            onCreateCourse={() => navigate("/create-personal-course")}
          />

          <SmartLearningPath user={userData} />

          <StudentBrainMap user={userData} />

          <DailyTasksCard
            tasks={dailyTasks}
            onGoToTasks={() => navigate("/tasks")}
          />
        </main>

        <aside className="space-y-8">
          <WeeklySongCard
            weeklySong={weeklySong}
            loading={weeklySongLoading}
            error={weeklySongError}
          />

          <AICoachCard user={userData} />

          <HelpCard onOpenChat={() => navigate("/chat")} />
        </aside>
      </div>
    </div>
  );
}

function DashboardHeader({ name, level, expectations }) {
  return (
    <header className="bg-white/5 p-7 rounded-3xl border border-white/10">
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white">היי {name}! 👋</h1>

          <p className="text-gray-400 mt-2">
            איזה כיף לראות אותך. הנה הלמידה האישית שלך להיום.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {expectations.length > 0 ? (
              expectations.map((expectation) => (
                <span
                  key={expectation}
                  className="bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 px-3 py-1 rounded-full text-sm font-bold"
                >
                  {getExpectationLabel(expectation)}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">
                עדיין לא נבחרו מטרות למידה
              </span>
            )}
          </div>
        </div>

        <div className="bg-yellow-400 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-lg h-fit">
          רמה: {getLevelLabel(level)}
        </div>
      </div>
    </header>
  );
}

function PersonalCourseCard({ interests, onGoToCourses, onCreateCourse }) {
  return (
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

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoToCourses}
            className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-6 py-4 rounded-2xl transition-all h-fit"
          >
            פתחי את הקורסים שלי
          </button>

          <button
            type="button"
            onClick={onCreateCourse}
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-2xl border border-white/10 transition-all"
          >
            צרי קורס אישי נוסף
          </button>
        </div>
      </div>
    </section>
  );
}

function DailyTasksCard({ tasks, onGoToTasks }) {
  return (
    <section className="bg-white/5 p-7 rounded-3xl border border-white/10">
      <div className="flex justify-between items-center gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black text-white">
            משימות קצרות להיום 📝
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            הצעות קצרות כדי להתקדם בלי עומס.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToTasks}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl"
        >
          כל המשימות
        </button>
      </div>

      <div className="grid gap-4">
        {tasks.map((task, index) => (
          <div
            key={`${task.title}-${index}`}
            className="bg-slate-950/60 border border-white/10 p-4 rounded-2xl flex items-start gap-4"
          >
            <div className="text-2xl">{task.icon}</div>

            <div>
              <h4 className="font-black text-yellow-400">{task.title}</h4>

              <p className="text-sm text-gray-300 mt-1">{task.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklySongCard({ weeklySong, loading, error }) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex justify-between items-start gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black text-white">🌟 שיר השבוע</h2>

          <p className="text-gray-400 text-sm mt-1">
            בחירה מיוחדת של מנהל האתר לתרגול האזנה.
          </p>
        </div>

        <div className="bg-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
          Weekly
        </div>
      </div>

      {loading ? (
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-6 text-center text-gray-400">
          טוען את שיר השבוע...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-4 text-sm font-bold">
          {error}
        </div>
      ) : !weeklySong ? (
        <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎵</div>

          <p className="text-gray-400 text-sm">עדיין לא נבחר שיר שבועי.</p>
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
  );
}

function HelpCard({ onOpenChat }) {
  return (
    <section className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center">
      <h3 className="font-black mb-2 text-white">צריכה עזרה?</h3>

      <p className="text-sm text-gray-400 mb-4">
        אפשר לפנות לבולט ולתרגל איתו שיחה, מילים או דקדוק.
      </p>

      <button
        type="button"
        onClick={onOpenChat}
        className="bg-indigo-600 w-full py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all"
      >
        פתחי צ׳אט 🤖
      </button>
    </section>
  );
}

function buildPersonalizedTasks({ level, interests, expectations }) {
  const tasks = [];

  if (expectations.includes("vocabulary")) {
    tasks.push({
      icon: "📚",
      title: "חיזוק אוצר מילים",
      description:
        "בחרי 5 מילים חדשות מתוך שיעור, שיר או מילון אישי וכתבי משפט אחד.",
    });
  }

  if (expectations.includes("grammar")) {
    tasks.push({
      icon: "🧠",
      title: "דקדוק קטן ליום",
      description: "בחרי משפט אחד באנגלית וסמני בו את הפועל המרכזי.",
    });
  }

  if (expectations.includes("confidence")) {
    tasks.push({
      icon: "💪",
      title: "ביטחון באנגלית",
      description:
        "אמרי בקול משפט אחד באנגלית שלוש פעמים, בכל פעם קצת יותר טבעי.",
    });
  }

  if (expectations.includes("fluent_speaking")) {
    tasks.push({
      icon: "🗣️",
      title: "תרגול דיבור",
      description: "אמרי 3 משפטים קצרים באנגלית על נושא שמעניין אותך.",
    });
  }

  if (interests.includes("art_music")) {
    tasks.push({
      icon: "🎶",
      title: "למידה דרך שיר",
      description: "האזיני לשיר קצר וכתבי 3 מילים חדשות שלמדת.",
    });
  }

  if (interests.includes("sports")) {
    tasks.push({
      icon: "⚽",
      title: "English Sport Words",
      description: "כתבי 5 מילים באנגלית שקשורות לספורט.",
    });
  }

  if (interests.includes("movies")) {
    tasks.push({
      icon: "🎬",
      title: "תיאור קטע קצר",
      description: "כתבי 2 משפטים באנגלית שמתארים קטע מסרטון או שיעור.",
    });
  }

  if (interests.includes("books")) {
    tasks.push({
      icon: "📖",
      title: "Reading Practice",
      description: "קראי פסקה קצרה וכתבי משפט אחד על מה שהבנת.",
    });
  }

  tasks.push({
    icon: level === "advanced" ? "✍️" : "✨",
    title: level === "advanced" ? "כתיבה יצירתית" : "אוצר מילים יומי",
    description:
      level === "advanced"
        ? "כתבי פסקה קצרה באנגלית בנושא שמעניין אותך."
        : "תרגלי 5 מילים חדשות שמתאימות ליום־יום.",
  });

  return tasks.slice(0, 4);
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

function getExpectationLabel(expectation) {
  const labels = {
    grammar: "דקדוק",
    fluent_speaking: "דיבור שוטף",
    confidence: "ביטחון באנגלית",
    vocabulary: "אוצר מילים",
  };

  return labels[expectation] || expectation;
}