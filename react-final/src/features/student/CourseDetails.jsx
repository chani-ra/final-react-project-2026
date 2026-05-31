import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseById,
  refreshPersonalizedCourse,
} from "../../services/courseService";
import {
  getMyCourseProgress,
  toggleCourseItemProgress,
  recalculateCourseProgress,
} from "../../services/courseProgressService";
import CourseContentTabs from "./components/CourseContentTabs";

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);

  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingKey, setActionLoadingKey] = useState("");

  const [error, setError] = useState("");
  const [refreshMessage, setRefreshMessage] = useState("");
  const [progressMessage, setProgressMessage] = useState({ type: "", text: "" });

  const totals = useMemo(() => {
    return {
      lessons: course?.lessons?.length || 0,
      songs: course?.songs?.length || 0,
      exercises: course?.exercises?.length || 0,
      quizzes: course?.quizzes?.length || 0,
    };
  }, [course]);

  const totalItems = useMemo(() => {
    return totals.lessons + totals.songs + totals.exercises + totals.quizzes;
  }, [totals]);

  const completedItems = useMemo(() => {
    return (
      (progress?.completedLessons?.length || 0) +
      (progress?.completedSongs?.length || 0) +
      (progress?.completedExercises?.length || 0) +
      (progress?.completedQuizzes?.length || 0)
    );
  }, [progress]);

  const progressPercent = progress?.progressPercent || 0;

  const hasAnyContent =
    course?.lessons?.length > 0 ||
    course?.songs?.length > 0 ||
    course?.exercises?.length > 0 ||
    course?.quizzes?.length > 0;

  // טעינת הקורס מהשרת
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

  // טעינת התקדמות הקורס מהשרת
  const loadProgress = async () => {
    try {
      setProgressLoading(true);
      setProgressMessage({ type: "", text: "" });

      const data = await getMyCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      console.error("שגיאה בטעינת התקדמות קורס:", err);
      setProgressMessage({
        type: "error",
        text: err.toString(),
      });
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      loadProgress();
    }
  }, [courseId]);

  // ברגע שהקורס נטען ויש totals, נחשב מחדש התקדמות כדי לוודא אחוז נכון
  useEffect(() => {
    const syncProgressPercent = async () => {
      if (!course || totalItems === 0) return;

      try {
        const updatedProgress = await recalculateCourseProgress({
          courseId,
          totals,
        });

        setProgress(updatedProgress);
      } catch (err) {
        console.error("שגיאה בחישוב התקדמות:", err);
      }
    };

    syncProgressPercent();
  }, [courseId, course, totalItems]);

  // רענון מסלול אישי
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

      await loadProgress();
    } catch (err) {
      console.error("שגיאה ברענון מסלול:", err);
      setError(err.toString());
    } finally {
      setRefreshing(false);
    }
  };

  // סימון פריט בקורס כבוצע / ביטול ביצוע
  const handleToggleCourseItem = async ({ itemType, itemId, completed }) => {
    const loadingKey = `${itemType}-${itemId}`;

    try {
      setActionLoadingKey(loadingKey);
      setProgressMessage({ type: "", text: "" });

      const updatedProgress = await toggleCourseItemProgress({
        courseId,
        itemType,
        itemId,
        completed,
        totals,
      });

      setProgress(updatedProgress);

      setProgressMessage({
        type: "success",
        text: completed ? "הפריט סומן כבוצע." : "הסימון הוסר.",
      });
    } catch (err) {
      setProgressMessage({
        type: "error",
        text: err.toString(),
      });
    } finally {
      setActionLoadingKey("");
    }
  };

  // בדיקה אם פריט מסוים כבר בוצע
  const isItemCompleted = ({ itemType, itemId }) => {
    if (!progress || !itemId) return false;

    const fieldByType = {
      lesson: "completedLessons",
      song: "completedSongs",
      exercise: "completedExercises",
      quiz: "completedQuizzes",
    };

    const fieldName = fieldByType[itemType];
    const completedList = progress[fieldName] || [];

    return completedList.some((id) => id?.toString() === itemId?.toString());
  };

  // תרגום רמות לתצוגה
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

  // תרגום קטגוריות לתצוגה
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
          type="button"
          onClick={() => navigate("/courses")}
          className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black px-8 py-3 rounded-xl"
        >
          חזרה לקורסים שלי
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <section className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8">
        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="text-sm text-gray-400 hover:text-yellow-400 font-bold mb-6"
        >
          ← חזרה לכל הקורסים
        </button>

        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="max-w-4xl">
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

            <h1 className="text-4xl md:text-5xl font-black mb-4">
              {course.title}
            </h1>

            <p className="text-gray-300 leading-relaxed">
              {course.description || "אין עדיין תיאור לקורס זה."}
            </p>
          </div>

          <div className="w-full lg:w-72 space-y-3">
            <button
              type="button"
              onClick={handleRefreshCourse}
              disabled={refreshing}
              className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 px-6 py-4 rounded-2xl font-black shadow-lg transition-all"
            >
              {refreshing ? "מרענן מסלול..." : "רענן מסלול 🔄"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/create-personal-course")}
              className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-bold border border-white/10 transition-all"
            >
              בנה קורס נוסף ✨
            </button>
          </div>
        </div>
      </section>

      <CourseProgressCard
        progressPercent={progressPercent}
        completedItems={completedItems}
        totalItems={totalItems}
        progressLoading={progressLoading}
      />

      {refreshMessage && (
        <div className="bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 rounded-3xl p-5 font-bold">
          {refreshMessage}
        </div>
      )}

      {progressMessage.text && (
        <div
          className={`rounded-3xl p-5 font-bold ${
            progressMessage.type === "success"
              ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-300"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {progressMessage.text}
        </div>
      )}

      {error && course && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-3xl font-bold">
          {error}
        </div>
      )}

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="🎬"
          label="שיעורים"
          value={course.lessons?.length || 0}
          completed={progress?.completedLessons?.length || 0}
        />

        <StatCard
          icon="🎵"
          label="שירים"
          value={course.songs?.length || 0}
          completed={progress?.completedSongs?.length || 0}
        />

        <StatCard
          icon="📝"
          label="תרגילים"
          value={course.exercises?.length || 0}
          completed={progress?.completedExercises?.length || 0}
        />

        <StatCard
          icon="🧠"
          label="בחנים"
          value={course.quizzes?.length || 0}
          completed={progress?.completedQuizzes?.length || 0}
        />
      </section>

      {course.aiReason && (
        <section className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-5">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🤖</div>

            <div>
              <h2 className="text-xl font-black text-indigo-300 mb-1">
                למה נבנה לך הקורס הזה?
              </h2>

              <p className="text-gray-300 leading-relaxed">
                {course.aiReason}
              </p>
            </div>
          </div>
        </section>
      )}

      {!hasAnyContent && (
        <section className="bg-yellow-400/10 border border-yellow-400/20 rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">✨</div>

          <h2 className="text-3xl font-black text-yellow-300 mb-3">
            המסלול שלך נוצר, אבל עדיין אין מספיק תכנים מותאמים
          </h2>

          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            כשהמורים יעלו תכנים מתאימים, אפשר לרענן את המסלול והוא יתעדכן.
          </p>

          <button
            type="button"
            onClick={handleRefreshCourse}
            disabled={refreshing}
            className="mt-8 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black px-8 py-4 rounded-2xl transition-all"
          >
            {refreshing ? "בודק תכנים חדשים..." : "בדוק אם נוספו תכנים 🔄"}
          </button>
        </section>
      )}

      {hasAnyContent && (
        <CourseContentTabs
          course={course}
          progress={progress}
          actionLoadingKey={actionLoadingKey}
          getLevelLabel={getLevelLabel}
          getCategoryLabel={getCategoryLabel}
          isItemCompleted={isItemCompleted}
          onToggleCourseItem={handleToggleCourseItem}
        />
      )}
    </div>
  );
}

function CourseProgressCard({
  progressPercent,
  completedItems,
  totalItems,
  progressLoading,
}) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            התקדמות בקורס 🎯
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            סמני שיעורים, שירים ותרגילים שביצעת — וזה יעדכן את מפת הלמידה שלך.
          </p>
        </div>

        <div className="bg-yellow-400 text-slate-950 px-5 py-3 rounded-2xl font-black h-fit">
          {progressLoading ? "טוען..." : `${progressPercent}%`}
        </div>
      </div>

      <div className="flex justify-between text-xs mb-2 font-semibold text-gray-400">
        <span>
          הושלמו {completedItems} מתוך {totalItems} פריטים
        </span>

        <span>{progressPercent}%</span>
      </div>

      <div className="h-3 bg-slate-950/70 rounded-full overflow-hidden">
        <div
          className="h-full bg-yellow-400 rounded-full transition-all duration-700"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </section>
  );
}

// כרטיס סטטיסטיקה עליון
function StatCard({ icon, label, value, completed }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
      <div className="text-3xl mb-2">{icon}</div>

      <div className="text-2xl font-black">
        {completed}/{value}
      </div>

      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}