import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer";

export default function CourseContentTabs({
  course,
  getLevelLabel,
  getCategoryLabel,
}) {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("lessons");
  const [activeSongId, setActiveSongId] = useState(
    course.songs?.[0]?._id || null
  );

  const lessons = course.lessons || [];
  const songs = course.songs || [];
  const exercises = course.exercises || [];
  const quizzes = course.quizzes || [];

  const activeSong =
    songs.find((song) => song._id === activeSongId) || songs[0];

  const tabs = [
    { id: "lessons", label: "שיעורים", icon: "🎬", count: lessons.length },
    { id: "songs", label: "שירים", icon: "🎵", count: songs.length },
    { id: "exercises", label: "תרגילים", icon: "📝", count: exercises.length },
    { id: "quizzes", label: "בחנים", icon: "🧠", count: quizzes.length },
  ];

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <div className="border-b border-white/10 p-4 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-5 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-yellow-400 text-slate-950 shadow-lg"
                : "bg-slate-950/60 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-slate-950/20 text-slate-950"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "lessons" && (
          <LessonsTab
            lessons={lessons}
            getLevelLabel={getLevelLabel}
            getCategoryLabel={getCategoryLabel}
            navigate={navigate}
          />
        )}

        {activeTab === "songs" && (
          <SongsTab
            songs={songs}
            activeSong={activeSong}
            activeSongId={activeSongId}
            setActiveSongId={setActiveSongId}
            getLevelLabel={getLevelLabel}
          />
        )}

        {activeTab === "exercises" && (
          <ExercisesTab exercises={exercises} navigate={navigate} />
        )}

        {activeTab === "quizzes" && <QuizzesTab quizzes={quizzes} />}
      </div>
    </section>
  );
}

// תצוגת שיעורים בתוך הקורס
function LessonsTab({ lessons, getLevelLabel, getCategoryLabel, navigate }) {
  if (!lessons.length) {
    return (
      <EmptyContent icon="🎬" text="עדיין אין שיעורים מוקלטים בקורס הזה." />
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-black">🎬 שיעורי הקורס</h2>
        <p className="text-gray-400 text-sm mt-1">
          צפייה מסודרת בשיעורים שהותאמו למסלול שלך.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lessons.map((lesson, index) => (
          <div
            key={lesson._id}
            className="bg-slate-950/60 border border-white/10 rounded-3xl p-5 hover:border-indigo-400/40 transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl">
                {lesson.icon || "🎬"}
              </div>

              <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                שיעור {index + 1}
              </span>
            </div>

            <h3 className="text-xl font-black text-white line-clamp-2">
              {lesson.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2 line-clamp-3">
              {lesson.description || "אין תיאור לשיעור זה."}
            </p>

            <div className="flex gap-2 mt-4 flex-wrap">
              {lesson.level && (
                <span className="bg-white/10 text-xs px-2 py-1 rounded-lg text-gray-300">
                  {getLevelLabel(lesson.level)}
                </span>
              )}

              {lesson.category && (
                <span className="bg-yellow-400/10 text-yellow-300 text-xs px-2 py-1 rounded-lg">
                  {getCategoryLabel(lesson.category)}
                </span>
              )}
            </div>

            <button
              onClick={() => navigate(`/teacher/lesson/${lesson._id}`)}
              className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
            >
              צפייה בשיעור
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// תצוגת שירים בתוך הקורס
function SongsTab({
  songs,
  activeSong,
  activeSongId,
  setActiveSongId,
  getLevelLabel,
}) {
  if (!songs.length) {
    return (
      <EmptyContent icon="🎵" text="עדיין אין שירים מותאמים בקורס הזה." />
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-black">🎵 שירי תרגול</h2>
        <p className="text-gray-400 text-sm mt-1">
          האזנה קצרה, נעימה וממוקדת לחיזוק השמיעה והביטחון.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 bg-slate-950/50 border border-white/10 rounded-3xl p-4">
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {songs.map((song, index) => {
              const isActive = activeSongId === song._id;

              return (
                <button
                  key={song._id}
                  type="button"
                  onClick={() => setActiveSongId(song._id)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-emerald-500/20 border-emerald-400"
                      : "bg-black/20 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                        isActive
                          ? "bg-emerald-400 text-slate-950"
                          : "bg-white/10"
                      }`}
                    >
                      🎧
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-black text-white truncate">
                        {index + 1}.{" "}
                        {song.title || song.theme || "שיר לימודי"}
                      </h3>

                      <p className="text-gray-400 text-sm mt-1 truncate">
                        {getLevelLabel(song.level)} ·{" "}
                        {song.theme || "ללא נושא"}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-3">
          <CustomAudioPlayer
            src={`http://localhost:3000/songs/song/${activeSong._id}/stream`}
            title={activeSong.title || activeSong.theme || "שיר לימודי"}
            subtitle={`רמה: ${getLevelLabel(activeSong.level)} · נושא: ${
              activeSong.theme || "לא צוין"
            }`}
            allowDownload={true}
          />

          <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
            <h4 className="font-bold text-emerald-300 mb-2">הצעת תרגול:</h4>

            <p className="text-gray-300 text-sm leading-relaxed">
              האזיני פעם אחת להבנה כללית, ואז פעם נוספת כדי לזהות מילים או
              ביטויים שחוזרים על עצמם.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// תצוגת תרגילים בתוך הקורס
function ExercisesTab({ exercises, navigate }) {
  if (!exercises.length) {
    return (
      <EmptyContent icon="📝" text="עדיין אין תרגילים מותאמים בקורס הזה." />
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-black">📝 תרגילים</h2>
        <p className="text-gray-400 text-sm mt-1">
          תרגול קצר כדי לחזק את החומר של הקורס.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exercises.map((exercise, index) => (
          <div
            key={exercise._id}
            className="bg-slate-950/60 border border-white/10 rounded-3xl p-5"
          >
            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
              תרגיל {index + 1}
            </span>

            <h3 className="text-xl font-black text-white mt-4">
              {exercise.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              {exercise.description ||
                exercise.instructions ||
                "תרגיל לתרגול אישי"}
            </p>

            <button
              onClick={() => navigate(`/exercise/${exercise._id}`)}
              className="w-full mt-5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl transition-all"
            >
              התחל תרגיל
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// תצוגת בחנים בתוך הקורס
function QuizzesTab({ quizzes }) {
  if (!quizzes.length) {
    return (
      <EmptyContent icon="🧠" text="עדיין אין בחנים מותאמים בקורס הזה." />
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-black">🧠 בחנים</h2>
        <p className="text-gray-400 text-sm mt-1">
          בדקי הבנה והתקדמות לפי החומר במסלול.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quizzes.map((quiz, index) => (
          <div
            key={quiz._id}
            className="bg-slate-950/60 border border-white/10 rounded-3xl p-5"
          >
            <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
              בוחן {index + 1}
            </span>

            <h3 className="text-xl font-black text-white mt-4">
              {quiz.title}
            </h3>

            <p className="text-gray-400 text-sm mt-2">
              ציון מעבר: {quiz.passingScore || 70}%
            </p>

            <button className="w-full mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">
              התחל בוחן
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// מצב ריק לטאב ללא תוכן
function EmptyContent({ icon, text }) {
  return (
    <div className="text-center py-16 bg-slate-950/50 border border-dashed border-white/10 rounded-3xl">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-gray-400 font-bold">{text}</p>
    </div>
  );
}