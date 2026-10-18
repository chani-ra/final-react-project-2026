import useMessageNotice from "../../components/ui/useMessageNotice.js";
import { useNotices } from "../../components/ui/NoticeProvider";
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
  const [progressMessage, setProgressMessage] = useState({ type: "", text: "" });
  const notices = useNotices();
  useMessageNotice(progressMessage);

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

  const handleRefreshCourse = async () => {
    try {
      setRefreshing(true);
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
        notices.success(
          `המסלול רוענן בהצלחה. נמצאו ${totalAdded} פריטי תוכן שיכולים להתאים לך.`
        );
      } else {
        notices.success(
          "המסלול רוענן, אבל עדיין לא נמצאו תכנים חדשים שמתאימים בדיוק למסלול שלך."
        );
      }

      await loadProgress();
    } catch (err) {
      console.error("שגיאה ברענון מסלול:", err);
      notices.error(err.toString(), "רענון המסלול נכשל");
    } finally {
      setRefreshing(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center text-white" dir="rtl">
        <div className="rounded-[2rem] border border-white/28 bg-[#061f36]/78 px-10 py-7 text-xl font-black shadow-[0_0_45px_rgba(255,255,255,0.22)] backdrop-blur-xl">
          טוען את הקורס שלך...
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div
        className="rounded-[2rem] border border-red-300/35 bg-red-500/18 p-6 text-center font-bold text-red-100 shadow-xl backdrop-blur-xl"
        dir="rtl"
      >
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="rounded-[2rem] border border-white/24 bg-[#061f36]/72 p-10 text-center text-white shadow-xl backdrop-blur-xl"
        dir="rtl"
      >
        <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-3xl border border-white/18 bg-white/10 text-3xl">
          —
        </div>

        <h2 className="text-3xl font-black">הקורס לא נמצא</h2>

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="mt-6 rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3 font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          חזרה לקורסים שלי
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <CourseCompactHeader
        course={course}
        totals={totals}
        progressPercent={progressPercent}
        completedItems={completedItems}
        totalItems={totalItems}
        progressLoading={progressLoading}
        refreshing={refreshing}
        onBack={() => navigate("/courses")}
        onRefreshCourse={handleRefreshCourse}
        onCreateCourse={() => navigate("/create-personal-course")}
        getLevelLabel={getLevelLabel}
        getCategoryLabel={getCategoryLabel}
      />

      <MessagesArea
        error={error}
      />

      {!hasAnyContent ? (
        <EmptyCourseState
          refreshing={refreshing}
          onRefreshCourse={handleRefreshCourse}
        />
      ) : (
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

      {course.aiReason && (
        <CourseReason reason={course.aiReason} />
      )}
    </div>
  );
}

function CourseCompactHeader({
  course,
  totals,
  progressPercent,
  completedItems,
  totalItems,
  progressLoading,
  refreshing,
  onBack,
  onRefreshCourse,
  onCreateCourse,
  getLevelLabel,
  getCategoryLabel,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2.2rem] border border-white/30 bg-[#061f36]/72 p-5 text-white shadow-[0_24px_70px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.12),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.05),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-black text-white/78 transition hover:bg-white/14 hover:text-white"
          >
            חזרה לקורסים
          </button>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onRefreshCourse}
              disabled={refreshing}
              className="rounded-full border border-white/18 bg-[#ffd439]/16 px-4 py-2 text-sm font-black text-[#fff0a8] transition hover:bg-[#ffd439]/22 disabled:opacity-60"
            >
              {refreshing ? "מרענן..." : "רענן מסלול"}
            </button>

            <button
              type="button"
              onClick={onCreateCourse}
              className="rounded-full border border-white/16 bg-white/9 px-4 py-2 text-sm font-black text-white/78 transition hover:bg-white/14 hover:text-white"
            >
              בנה קורס נוסף
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr] xl:items-center">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#ffd439]/25 bg-[#ffd439]/12 px-3 py-1 text-xs font-black text-[#ffe89a]">
                {getCategoryLabel(course.category)}
              </span>

              <span className="rounded-full border border-white/16 bg-white/9 px-3 py-1 text-xs font-black text-white/72">
                רמה: {getLevelLabel(course.level)}
              </span>

              {course.createdByAI && (
                <span className="rounded-full border border-cyan-200/28 bg-cyan-300/12 px-3 py-1 text-xs font-black text-cyan-100">
                  נבנה בהתאמה אישית
                </span>
              )}
            </div>

            <h1
              className="text-3xl font-black leading-tight md:text-5xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.55), -1px -1px 0 rgba(15,76,117,0.85), 0 12px 28px rgba(7,89,133,0.36)",
              }}
            >
              {course.title}
            </h1>

            <p className="mt-3 line-clamp-2 max-w-4xl text-sm font-bold leading-relaxed text-white/64 md:text-base">
              {course.description || "אין עדיין תיאור לקורס זה."}
            </p>
          </div>

          <div className="rounded-[1.7rem] border border-white/14 bg-[#082844]/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <div className="mb-3 flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-black text-white/58">
                  התקדמות בקורס
                </div>

                <div className="mt-1 text-3xl font-black">
                  {progressLoading ? "..." : `${progressPercent}%`}
                </div>
              </div>

              <div className="rounded-2xl border border-white/14 bg-white/9 px-4 py-2 text-sm font-black text-white/72">
                {completedItems}/{totalItems} פריטים
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/16">
              <div
                className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <SmallStat label="שיעורים" value={totals.lessons} />
              <SmallStat label="שירים" value={totals.songs} />
              <SmallStat label="תרגילים" value={totals.exercises} />
              <SmallStat label="בחנים" value={totals.quizzes} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/7 px-2 py-2 text-center">
      <div className="text-lg font-black text-[#ffd439]">{value}</div>
      <div className="text-[11px] font-bold text-white/56">{label}</div>
    </div>
  );
}

function MessagesArea({ error }) {
  const hasMessages = error;

  if (!hasMessages) return null;

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-[1.5rem] border border-red-300/30 bg-red-500/16 px-5 py-4 font-bold text-red-100 backdrop-blur-xl">
          {error}
        </div>
      )}
    </div>
  );
}

function EmptyCourseState({ refreshing, onRefreshCourse }) {
  return (
    <section className="rounded-[2.2rem] border border-[#ffd439]/25 bg-[#061f36]/72 p-10 text-center text-white shadow-[0_24px_70px_rgba(3,31,61,0.28)] backdrop-blur-xl">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-[#ffd439]/30 bg-[#ffd439]/14 text-3xl font-black text-[#ffe89a]">
        +
      </div>

      <h2 className="text-3xl font-black text-[#ffe89a]">
        המסלול שלך נוצר, אבל עדיין אין מספיק תכנים מותאמים
      </h2>

      <p className="mx-auto mt-3 max-w-2xl font-bold leading-relaxed text-white/64">
        כשהמורים יעלו תכנים מתאימים, אפשר לרענן את המסלול והוא יתעדכן.
      </p>

      <button
        type="button"
        onClick={onRefreshCourse}
        disabled={refreshing}
        className="mt-8 rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-9 py-4 font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {refreshing ? "בודק תכנים חדשים..." : "בדוק אם נוספו תכנים"}
      </button>
    </section>
  );
}

function CourseReason({ reason }) {
  return (
    <section className="rounded-[2rem] border border-cyan-200/24 bg-[#061f36]/60 p-5 text-white shadow-[0_18px_50px_rgba(3,31,61,0.22)] backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/24 bg-cyan-300/10 text-xl font-black text-cyan-100">
          AI
        </div>

        <div>
          <h2 className="text-xl font-black text-cyan-100">
            למה נבנה לך הקורס הזה?
          </h2>

          <p className="mt-1 leading-relaxed text-white/66">{reason}</p>
        </div>
      </div>
    </section>
  );
}