import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  refreshPersonalizedCourse,
} from "../../services/courseService";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [refreshMessage, setRefreshMessage] = useState("");

  const loadCourse = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCourseById(courseId);
      setCourse(data.course);
    } catch (err) {
      console.error("שגיאה בטעינת קורס:", err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const handleRefreshCourse = async () => {
    try {
      setRefreshing(true);
      setRefreshMessage("");
      setError("");

      const data = await refreshPersonalizedCourse(courseId);

      setCourse(data.course);

      const selected = data.selected || {};
      const totalAdded =
        (selected.lessons || 0) +
        (selected.songs || 0) +
        (selected.exercises || 0) +
        (selected.quizzes || 0);

      if (totalAdded > 0) {
        setRefreshMessage(
          `המסלול רוענן בהצלחה! נמצאו ${totalAdded} פריטי תוכן שיכולים להתאים לך.`
        );
      } else {
        setRefreshMessage(
          "המסלול רוענן, אבל עדיין לא נמצאו תכנים חדשים שמתאימים בדיוק למסלול שלך."
        );
      }
    } catch (err) {
      console.error("שגיאה ברענון מסלול:", err);
      setError(err.toString());
    } finally {
      setRefreshing(false);
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      beginner: "מתחילים",
      intermediate: "בינוני",
      advanced: "מתקדמים",
      מתחילים: "מתחילים",
      בינוני: "בינוני",
      מתקדמים: "מתקדמים",
    };

    return labels[level] || level || "לא צוין";
  };

  const getCategoryLabel = (category) => {
    const labels = {
      grammar: "דקדוק",
      vocabulary: "אוצר מילים",
      conversation: "שיחה",
      reading: "קריאה",
      listening: "האזנה",
      general: "כללי",
    };

    return labels[category] || category || "כללי";
  };

  const hasLessons = course?.lessons?.length > 0;
  const hasExercises = course?.exercises?.length > 0;
  const hasQuizzes = course?.quizzes?.length > 0;
  const hasSongs = course?.songs?.length > 0;

  const hasAnyContent = hasLessons || hasExercises || hasQuizzes || hasSongs;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הקורס שלך... 📚</div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-3xl font-bold">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-bold">הקורס לא נמצא</h2>

        <button
          onClick={() => navigate("/courses")}
          className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 rounded-xl"
        >
          חזרה לקורסים שלי
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <button
          onClick={() => navigate("/courses")}
          className="text-sm text-gray-400 hover:text-yellow-400 font-bold mb-6"
        >
          ← חזרה לכל הקורסים
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 px-3 py-1 rounded-full text-sm font-bold">
                {getCategoryLabel(course.category)}
              </span>

              <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded-full text-sm font-bold">
                רמה: {getLevelLabel(course.level)}
              </span>

              {course.createdByAI && (
                <span className="bg-indigo-400/10 text-indigo-300 border border-indigo-400/20 px-3 py-1 rounded-full text-sm font-bold">
                  נבנה בהתאמה אישית ✨
                </span>
              )}
            </div>

            <h1 className="text-4xl font-black mb-4">{course.title}</h1>

            <p className="text-gray-300 max-w-3xl leading-relaxed">
              {course.description || "אין עדיין תיאור לקורס זה."}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="bg-yellow-400 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-lg text-center">
              הקורס האישי שלך ✨
            </div>

            {course.createdByAI && (
              <button
                onClick={handleRefreshCourse}
                disabled={refreshing}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-all"
              >
                {refreshing ? "מרענן מסלול..." : "רענן את המסלול שלי 🔄"}
              </button>
            )}
          </div>
        </div>
      </div>

      {refreshMessage && (
        <div className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 rounded-3xl p-5 font-bold">
          {refreshMessage}
        </div>
      )}

      {error && course && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-3xl font-bold">
          {error}
        </div>
      )}

      {course.aiReason && (
        <section className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>
            <div>
              <h2 className="text-2xl font-bold text-indigo-300 mb-2">
                למה נבנה לך הקורס הזה?
              </h2>
              <p className="text-gray-300 leading-relaxed">{course.aiReason}</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-2xl font-black">{course.lessons?.length || 0}</div>
          <div className="text-sm text-gray-400">שיעורים</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-black">
            {course.exercises?.length || 0}
          </div>
          <div className="text-sm text-gray-400">תרגילים</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🧠</div>
          <div className="text-2xl font-black">{course.quizzes?.length || 0}</div>
          <div className="text-sm text-gray-400">בחנים</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🎵</div>
          <div className="text-2xl font-black">{course.songs?.length || 0}</div>
          <div className="text-sm text-gray-400">שירים</div>
        </div>
      </div>

      {!hasAnyContent && (
        <section className="bg-yellow-400/10 border border-yellow-400/20 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">✨</div>

          <h2 className="text-3xl font-black text-yellow-300 mb-3">
            המסלול שלך נוצר, אבל עדיין אין מספיק תכנים מותאמים
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            כרגע לא נמצאו שיעורים מוקלטים, תרגילים או בחנים שמתאימים בדיוק
            לרמה ולמטרות שנבחרו. כשהמורים יעלו תכנים מתאימים, אפשר לרענן את
            המסלול והוא יתעדכן.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button
              onClick={handleRefreshCourse}
              disabled={refreshing}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all"
            >
              {refreshing ? "בודק תכנים חדשים..." : "בדוק אם נוספו תכנים 🔄"}
            </button>

            <button
              onClick={() => navigate("/chat")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-2xl transition-all"
            >
              התחלת תרגול עם בולט AI 🤖
            </button>
          </div>
        </section>
      )}

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-5">🎬 שיעורי הקורס</h2>

        {!hasLessons ? (
          <div className="text-gray-400 bg-black/20 border border-white/5 rounded-2xl p-6 text-center">
            עדיין אין שיעורים מוקלטים מותאמים בקורס הזה.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-black/20 border border-white/10 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{lesson.icon || "🎬"}</div>
                  <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
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
                </div>

                <button
                  onClick={() => navigate(`/teacher/lesson/${lesson._id}`)}
                  className="mt-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
                >
                  צפייה בשיעור
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">📝 תרגילים</h2>

          {!hasExercises ? (
            <p className="text-gray-400 text-sm">
              עדיין אין תרגילים מותאמים בקורס.
            </p>
          ) : (
            <div className="space-y-3">
              {course.exercises.map((exercise) => (
                <div key={exercise._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">{exercise.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {exercise.description ||
                      exercise.instructions ||
                      "תרגיל לתרגול אישי"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">🧠 בחנים</h2>

          {!hasQuizzes ? (
            <p className="text-gray-400 text-sm">
              עדיין אין בחנים מותאמים בקורס.
            </p>
          ) : (
            <div className="space-y-3">
              {course.quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">{quiz.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    ציון מעבר: {quiz.passingScore || 70}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">🎵 שירים</h2>

          {!hasSongs ? (
            <p className="text-gray-400 text-sm">
              עדיין אין שירים מותאמים בקורס.
            </p>
          ) : (
            <div className="space-y-3">
              {course.songs.map((song) => (
                <div key={song._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">
                    {song.title || song.theme || "שיר לימודי"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    רמה: {getLevelLabel(song.level)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}