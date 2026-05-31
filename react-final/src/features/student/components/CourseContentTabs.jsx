import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer";

export default function CourseContentTabs({
  course,
  progress,
  actionLoadingKey,
  getLevelLabel,
  getCategoryLabel,
  isItemCompleted,
  onToggleCourseItem,
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
    {
      id: "lessons",
      label: "שיעורים",
      icon: "🎬",
      count: lessons.length,
      completed: progress?.completedLessons?.length || 0,
    },
    {
      id: "songs",
      label: "שירים",
      icon: "🎵",
      count: songs.length,
      completed: progress?.completedSongs?.length || 0,
    },
    {
      id: "exercises",
      label: "תרגילים",
      icon: "📝",
      count: exercises.length,
      completed: progress?.completedExercises?.length || 0,
    },
    {
      id: "quizzes",
      label: "בחנים",
      icon: "🧠",
      count: quizzes.length,
      completed: progress?.completedQuizzes?.length || 0,
    },
  ];

  const safeIsItemCompleted =
    isItemCompleted ||
    (() => {
      return false;
    });

  const safeToggle =
    onToggleCourseItem ||
    (() => {
      return null;
    });

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
              {tab.completed}/{tab.count}
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
            actionLoadingKey={actionLoadingKey}
            isItemCompleted={safeIsItemCompleted}
            onToggleCourseItem={safeToggle}
          />
        )}

        {activeTab === "songs" && (
          <SongsTab
            songs={songs}
            activeSong={activeSong}
            activeSongId={activeSongId}
            setActiveSongId={setActiveSongId}
            getLevelLabel={getLevelLabel}
            actionLoadingKey={actionLoadingKey}
            isItemCompleted={safeIsItemCompleted}
            onToggleCourseItem={safeToggle}
          />
        )}

        {activeTab === "exercises" && (
          <ExercisesTab
            exercises={exercises}
            navigate={navigate}
            actionLoadingKey={actionLoadingKey}
            isItemCompleted={safeIsItemCompleted}
            onToggleCourseItem={safeToggle}
          />
        )}

        {activeTab === "quizzes" && (
          <QuizzesTab
            course={course}
            quizzes={quizzes}
            navigate={navigate}
            actionLoadingKey={actionLoadingKey}
            isItemCompleted={safeIsItemCompleted}
            onToggleCourseItem={safeToggle}
          />
        )}
      </div>
    </section>
  );
}

function LessonsTab({
  lessons,
  getLevelLabel,
  getCategoryLabel,
  navigate,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
}) {
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
          צפייה מסודרת בשיעורים שהותאמו למסלול שלך. אחרי צפייה סמני שהשיעור
          בוצע כדי לעדכן את התקדמות הקורס.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {lessons.map((lesson, index) => {
          const completed = isItemCompleted({
            itemType: "lesson",
            itemId: lesson._id,
          });

          const loadingKey = `lesson-${lesson._id}`;
          const isLoading = actionLoadingKey === loadingKey;

          return (
            <div
              key={lesson._id}
              className={`border rounded-3xl p-5 transition-all ${
                completed
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-slate-950/60 border-white/10 hover:border-indigo-400/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-2xl">
                  {lesson.icon || "🎬"}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                    שיעור {index + 1}
                  </span>

                  {completed && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                      בוצע ✓
                    </span>
                  )}
                </div>
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

              <div className="mt-5 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/teacher/lesson/${lesson._id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
                >
                  צפייה בשיעור
                </button>

                <ProgressToggleButton
                  completed={completed}
                  isLoading={isLoading}
                  completedLabel="השיעור בוצע ✓"
                  pendingLabel="סמני שיעור כבוצע"
                  onClick={() =>
                    onToggleCourseItem({
                      itemType: "lesson",
                      itemId: lesson._id,
                      completed: !completed,
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SongsTab({
  songs,
  activeSong,
  activeSongId,
  setActiveSongId,
  getLevelLabel,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
}) {
  if (!songs.length) {
    return (
      <EmptyContent icon="🎵" text="עדיין אין שירים מותאמים בקורס הזה." />
    );
  }

  const activeSongCompleted = activeSong
    ? isItemCompleted({
        itemType: "song",
        itemId: activeSong._id,
      })
    : false;

  const activeSongLoading = activeSong
    ? actionLoadingKey === `song-${activeSong._id}`
    : false;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-black">🎵 שירי תרגול</h2>

        <p className="text-gray-400 text-sm mt-1">
          האזנה קצרה, נעימה וממוקדת לחיזוק השמיעה והביטחון. אחרי שהאזנת סמני
          את השיר כבוצע.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 bg-slate-950/50 border border-white/10 rounded-3xl p-4">
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {songs.map((song, index) => {
              const isActive = activeSongId === song._id;

              const completed = isItemCompleted({
                itemType: "song",
                itemId: song._id,
              });

              return (
                <button
                  key={song._id}
                  type="button"
                  onClick={() => setActiveSongId(song._id)}
                  className={`w-full text-right p-4 rounded-2xl border transition-all ${
                    isActive
                      ? "bg-emerald-500/20 border-emerald-400"
                      : completed
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-black/20 border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl ${
                        isActive
                          ? "bg-emerald-400 text-slate-950"
                          : completed
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-white/10"
                      }`}
                    >
                      {completed ? "✓" : "🎧"}
                    </div>

                    <div className="min-w-0 flex-1">
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
          {activeSong && (
            <>
              <CustomAudioPlayer
                src={`http://localhost:3000/songs/song/${activeSong._id}/stream`}
                title={activeSong.title || activeSong.theme || "שיר לימודי"}
                subtitle={`רמה: ${getLevelLabel(activeSong.level)} · נושא: ${
                  activeSong.theme || "לא צוין"
                }`}
                allowDownload={true}
              />

              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <h4 className="font-bold text-emerald-300 mb-2">
                  הצעת תרגול:
                </h4>

                <p className="text-gray-300 text-sm leading-relaxed">
                  האזיני פעם אחת להבנה כללית, ואז פעם נוספת כדי לזהות מילים או
                  ביטויים שחוזרים על עצמם.
                </p>
              </div>

              <div className="mt-4">
                <ProgressToggleButton
                  completed={activeSongCompleted}
                  isLoading={activeSongLoading}
                  completedLabel="השיר סומן כהושלם ✓"
                  pendingLabel="סמני שהאזנת לשיר"
                  onClick={() =>
                    onToggleCourseItem({
                      itemType: "song",
                      itemId: activeSong._id,
                      completed: !activeSongCompleted,
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ExercisesTab({
  exercises,
  navigate,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
}) {
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
          תרגול קצר כדי לחזק את החומר של הקורס. אחרי שסיימת תרגיל סמני אותו
          כבוצע.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exercises.map((exercise, index) => {
          const completed = isItemCompleted({
            itemType: "exercise",
            itemId: exercise._id,
          });

          const loadingKey = `exercise-${exercise._id}`;
          const isLoading = actionLoadingKey === loadingKey;

          return (
            <div
              key={exercise._id}
              className={`border rounded-3xl p-5 transition-all ${
                completed
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-slate-950/60 border-white/10"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                  תרגיל {index + 1}
                </span>

                {completed && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                    בוצע ✓
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-white mt-4">
                {exercise.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {exercise.description ||
                  exercise.instructions ||
                  "תרגיל לתרגול אישי"}
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/exercise/${exercise._id}`)}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl transition-all"
                >
                  התחל תרגיל
                </button>

                <ProgressToggleButton
                  completed={completed}
                  isLoading={isLoading}
                  completedLabel="התרגיל בוצע ✓"
                  pendingLabel="סמני תרגיל כבוצע"
                  onClick={() =>
                    onToggleCourseItem({
                      itemType: "exercise",
                      itemId: exercise._id,
                      completed: !completed,
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuizzesTab({
  course,
  quizzes,
  navigate,
  actionLoadingKey,
  isItemCompleted,
  onToggleCourseItem,
}) {
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
          בדקי הבנה והתקדמות לפי החומר במסלול. בסיום הבוחן תקבלי ציון, תשובות
          נכונות והסברים.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {quizzes.map((quiz, index) => {
          const completed = isItemCompleted({
            itemType: "quiz",
            itemId: quiz._id,
          });

          const loadingKey = `quiz-${quiz._id}`;
          const isLoading = actionLoadingKey === loadingKey;

          return (
            <div
              key={quiz._id}
              className={`border rounded-3xl p-5 transition-all ${
                completed
                  ? "bg-emerald-500/10 border-emerald-400/30"
                  : "bg-slate-950/60 border-white/10"
              }`}
            >
              <div className="flex justify-between items-start gap-3">
                <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                  בוחן {index + 1}
                </span>

                {completed && (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-black">
                    בוצע ✓
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-white mt-4">
                {quiz.title}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                ציון מעבר: {quiz.passingScore || 70}%
              </p>

              {quiz.duration && (
                <p className="text-gray-500 text-xs mt-1">
                  משך משוער: {quiz.duration} דקות
                </p>
              )}

              <div className="mt-5 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/quiz/${quiz._id}?courseId=${course._id}`)
                  }
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
                >
                  התחל בוחן
                </button>

                {completed ? (
                  <div className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-xl py-3 text-center font-black">
                    הבוחן הושלם ✓
                  </div>
                ) : (
                  <ProgressToggleButton
                    completed={completed}
                    isLoading={isLoading}
                    completedLabel="הבוחן בוצע ✓"
                    pendingLabel="סמני בוחן כבוצע"
                    onClick={() =>
                      onToggleCourseItem({
                        itemType: "quiz",
                        itemId: quiz._id,
                        completed: !completed,
                      })
                    }
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressToggleButton({
  completed,
  isLoading,
  pendingLabel,
  completedLabel,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full font-black py-3 rounded-xl transition-all disabled:opacity-60 ${
        completed
          ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30"
          : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
      }`}
    >
      {isLoading
        ? "מעדכן..."
        : completed
        ? completedLabel
        : pendingLabel}
    </button>
  );
}

function EmptyContent({ icon, text }) {
  return (
    <div className="text-center py-16 bg-slate-950/50 border border-dashed border-white/10 rounded-3xl">
      <div className="text-5xl mb-4">{icon}</div>
      <p className="text-gray-400 font-bold">{text}</p>
    </div>
  );
}