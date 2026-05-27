import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseById } from "../../services/courseService";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    loadCourse();
  }, [courseId]);

  const getLevelLabel = (level) => {
    const labels = {
      beginner: "מתחילים",
      intermediate: "בינוני",
      advanced: "מתקדמים",
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הקורס שלך... 📚</div>
      </div>
    );
  }

  if (error) {
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
            </div>

            <h1 className="text-4xl font-black mb-4">{course.title}</h1>

            <p className="text-gray-300 max-w-3xl leading-relaxed">
              {course.description || "אין עדיין תיאור לקורס זה."}
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-lg">
            הקורס האישי שלך ✨
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🎬</div>
          <div className="text-2xl font-black">{course.lessons?.length || 0}</div>
          <div className="text-sm text-gray-400">שיעורים</div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-black">{course.exercises?.length || 0}</div>
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

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold mb-5">🎬 שיעורי הקורס</h2>

        {!course.lessons || course.lessons.length === 0 ? (
          <div className="text-gray-400 bg-black/20 border border-white/5 rounded-2xl p-6 text-center">
            עדיין לא נוספו שיעורים לקורס הזה.
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

          {!course.exercises || course.exercises.length === 0 ? (
            <p className="text-gray-400 text-sm">עדיין אין תרגילים בקורס.</p>
          ) : (
            <div className="space-y-3">
              {course.exercises.map((exercise) => (
                <div key={exercise._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">{exercise.title}</h3>
                  <p className="text-gray-400 text-sm">{exercise.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">🧠 בחנים</h2>

          {!course.quizzes || course.quizzes.length === 0 ? (
            <p className="text-gray-400 text-sm">עדיין אין בחנים בקורס.</p>
          ) : (
            <div className="space-y-3">
              {course.quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">{quiz.title}</h3>
                  <p className="text-gray-400 text-sm">
                    ציון מעבר: {quiz.passingScore}%
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4">🎵 שירים</h2>

          {!course.songs || course.songs.length === 0 ? (
            <p className="text-gray-400 text-sm">עדיין אין שירים בקורס.</p>
          ) : (
            <div className="space-y-3">
              {course.songs.map((song) => (
                <div key={song._id} className="bg-black/20 rounded-xl p-4">
                  <h3 className="font-bold">{song.theme || "שיר לימודי"}</h3>
                  <p className="text-gray-400 text-sm">
                    רמה: {song.level || "לא צוינה"}
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