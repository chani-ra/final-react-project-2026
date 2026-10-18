import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  enrollInCourse,
  getMyCourses,
  getRecommendedCourses,
} from "../../services/courseService";
import { useNotices } from "../../components/ui/NoticeProvider";
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";

export default function Courses() {
  const navigate = useNavigate();
  const notices = useNotices();
  const scrollerRef = useRef(null);

  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("myCourses");

  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [enrollingId, setEnrollingId] = useState("");

  const [error, setError] = useState("");

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCourses();
      setMyCourses(data.courses || []);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);

      const data = await getRecommendedCourses();
      setRecommendedCourses(data.courses || []);
    } catch (err) {
      notices.error(err.toString());
    } finally {
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    loadMyCourses();
  }, []);

  const handleRecommendedTab = async () => {
    setActiveTab("recommended");

    if (recommendedCourses.length === 0) {
      await loadRecommendedCourses();
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingId(courseId);

      await enrollInCourse(courseId);

      notices.success("נרשמת לקורס בהצלחה.", "הרשמה לקורס");

      await loadMyCourses();
      await loadRecommendedCourses();

      setActiveTab("myCourses");
    } catch (err) {
      notices.error(err.toString());
    } finally {
      setEnrollingId("");
    }
  };

  const visibleCourses = useMemo(() => {
    return activeTab === "myCourses" ? myCourses : recommendedCourses;
  }, [activeTab, myCourses, recommendedCourses]);

  const stats = useMemo(() => {
    const allItems = myCourses.reduce((acc, course) => {
      return acc + getCourseTotalItems(course);
    }, 0);

    return {
      totalMyCourses: myCourses.length,
      totalRecommended: recommendedCourses.length,
      allItems,
    };
  }, [myCourses, recommendedCourses]);

  const scrollCourses = (direction) => {
    if (!scrollerRef.current) return;

    scrollerRef.current.scrollBy({
      left: direction === "left" ? -360 : 360,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center" dir="rtl">
        <div
          className="rounded-[2rem] border-2 border-white/25 bg-slate-950/65 px-10 py-8 text-center text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <LoadingCircle />

          <p className="mt-5 text-xl font-black">טוען את הקורסים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              מרכז הקורסים
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              {activeTab === "myCourses" ? "הקורסים שלי" : "קורסים מומלצים"}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              בחרי קורס והמשיכי למסלול הלמידה. אפשר להיכנס לקורס קיים,
              להצטרף לקורס מומלץ או ליצור קורס אישי חדש.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
            <StatBox label="שלי" value={stats.totalMyCourses} tone="yellow" />

            <StatBox
              label="מומלצים"
              value={stats.totalRecommended}
              tone="red"
            />

            <StatBox label="פריטים" value={stats.allItems} tone="blue" />
          </div>
        </div>
      </section>

      <Messages error={error} />

      <section
        className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <TabButton
                active={activeTab === "myCourses"}
                onClick={() => setActiveTab("myCourses")}
              >
                הקורסים שלי ({myCourses.length})
              </TabButton>

              <TabButton
                active={activeTab === "recommended"}
                onClick={handleRecommendedTab}
              >
                מומלצים ({recommendedCourses.length})
              </TabButton>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => navigate("/courses/ai-lesson")}
                className="rounded-full border border-yellow-200/60 bg-yellow-300/15 px-5 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25">
                ✨ שיעור AI לפי בקשה
              </button>
            <button
              type="button"
              onClick={() => navigate("/create-personal-course")}
              className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-60"
              style={{
                boxShadow: "0 6px 0 rgba(89,15,20,0.42)",
              }}
            >
              יצירת קורס חדש
            </button>
            </div>
          </div>

          {activeTab === "recommended" && recommendedLoading ? (
            <LoadingRecommended />
          ) : visibleCourses.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              onShowRecommended={handleRecommendedTab}
              onCreateCourse={() => navigate("/create-personal-course")}
            />
          ) : (
            <div className="relative">
              {visibleCourses.length > 3 && (
                <>
                  <button
                    type="button"
                    onClick={() => scrollCourses("right")}
                    className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-yellow-300/35 bg-slate-950/75 text-3xl font-black text-yellow-100 backdrop-blur-xl transition hover:bg-yellow-300 hover:text-slate-950 lg:flex"
                  >
                    ›
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollCourses("left")}
                    className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-yellow-300/35 bg-slate-950/75 text-3xl font-black text-yellow-100 backdrop-blur-xl transition hover:bg-yellow-300 hover:text-slate-950 lg:flex"
                  >
                    ‹
                  </button>
                </>
              )}

              <div
                ref={scrollerRef}
                className="courses-scroll flex w-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overflow-y-hidden px-2 py-6"
              >
                {visibleCourses.map((course, index) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    index={index}
                    isRecommended={activeTab === "recommended"}
                    enrolling={enrollingId === course._id}
                    onEnroll={handleEnroll}
                    onOpen={() => navigate(`/course/${course._id}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <style>
        {`
          .courses-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(253, 224, 71, 0.75) rgba(255, 255, 255, 0.12);
          }

          .courses-scroll::-webkit-scrollbar {
            height: 9px;
          }

          .courses-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.12);
            border-radius: 999px;
          }

          .courses-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #b8322a, #ff6659, #fde047);
            border-radius: 999px;
          }
        `}
      </style>
    </div>
  );
}

function CourseCard({
  course,
  index,
  isRecommended,
  enrolling,
  onEnroll,
  onOpen,
}) {
  const stats = getCourseContentStats(course);
  const level = getCourseLevel(course);

  return (
    <article
      className="group relative h-[320px] w-[315px] shrink-0 snap-center overflow-hidden rounded-[1.8rem] border-2 border-white/18 bg-white/10 p-4 pt-7 text-white transition hover:border-yellow-300/45 hover:bg-white/13"
      style={{
        boxShadow:
          "0 18px 55px rgba(3,31,61,0.24), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="absolute right-5 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-b from-red-400 to-red-700 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)]">
        {index + 1}
      </div>

      <div className="relative z-10 flex h-full flex-col pt-3">
        <div className="mb-3 flex items-center justify-between gap-2 pr-10">
          <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[11px] font-black text-white/72">
            {getCategoryLabel(course.category)}
          </span>

          <span className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-3 py-1 text-[11px] font-black text-yellow-100">
            {getLevelLabel(level)}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[54px] text-2xl font-black leading-tight text-white">
          {course.title || `קורס ${index + 1}`}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm font-semibold leading-6 text-white/58">
          {course.description || "מסלול לימוד מותאם להתקדמות באנגלית."}
        </p>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <SmallStat label="שיעורים" value={stats.lessons} />
          <SmallStat label="תרגילים" value={stats.exercises} />
          <SmallStat label="בחנים" value={stats.quizzes} />
          <SmallStat label="שירים" value={stats.songs} />
        </div>

        <button
          type="button"
          onClick={isRecommended ? () => onEnroll(course._id) : onOpen}
          disabled={enrolling}
          className="mt-auto rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            boxShadow: enrolling ? "none" : "0 6px 0 rgba(89,15,20,0.42)",
          }}
        >
          {enrolling ? (
            <span className="inline-flex items-center justify-center gap-2">
              <SmallSpinner />
              מצטרף...
            </span>
          ) : isRecommended ? (
            "הצטרפות לקורס"
          ) : (
            "כניסה למסלול"
          )}
        </button>
      </div>
    </article>
  );
}

function StatBox({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
  };

  return (
    <div
      className={`rounded-[1.35rem] border-2 p-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-2xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {children}
    </button>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/55 px-2 py-2 text-center">
      <div className="text-sm font-black text-white">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold text-white/50">{label}</div>
    </div>
  );
}

function Messages({ error }) {
  if (!error) return null;

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-[1.5rem] border-2 border-red-300/35 bg-red-500/15 px-5 py-3 text-center text-sm font-black text-red-100">
          {error}
        </div>
      )}

    </div>
  );
}

function EmptyState({ activeTab, onShowRecommended, onCreateCourse }) {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border-2 border-dashed border-white/20 bg-white/10 p-8 text-center text-white">
      <h2 className="text-2xl font-black">
        {activeTab === "myCourses"
          ? "עדיין אין לך קורסים"
          : "אין כרגע קורסים מומלצים"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-semibold leading-7 text-white/62">
        {activeTab === "myCourses"
          ? "אפשר להתחיל מקורס מומלץ או ליצור מסלול אישי חדש."
          : "כאשר יתווספו קורסים שמתאימים לך, הם יופיעו כאן."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {activeTab === "myCourses" && (
          <button
            type="button"
            onClick={onShowRecommended}
            className="rounded-full border-2 border-yellow-300/45 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            הצג מומלצים
          </button>
        )}

        <button
          type="button"
          onClick={onCreateCourse}
          className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:brightness-110"
          style={{
            boxShadow: "0 6px 0 rgba(89,15,20,0.42)",
          }}
        >
          יצירת קורס חדש
        </button>
      </div>
    </div>
  );
}

function LoadingRecommended() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <LoadingCircle />

        <p className="mt-4 text-base font-black text-white">
          טוען קורסים מומלצים...
        </p>
      </div>
    </div>
  );
}

function LoadingCircle() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

function getCourseContentStats(course) {
  return {
    lessons: course.lessons?.length || 0,
    exercises: course.exercises?.length || 0,
    quizzes: course.quizzes?.length || 0,
    songs: course.songs?.length || 0,
  };
}

function getCourseTotalItems(course) {
  const stats = getCourseContentStats(course);
  return stats.lessons + stats.exercises + stats.quizzes + stats.songs;
}

function getCourseLevel(course) {
  return course.englishLevel || course.level || course.difficulty || "";
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "ביניים",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "ביניים",
    מתקדמים: "מתקדמים",
    בסיס: "מתחילים",
  };

  return labels[level] || level || "אישי";
}

function getCategoryLabel(category) {
  const labels = {
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    conversation: "שיחה",
    reading: "קריאה",
    listening: "האזנה",
    general: "כללי",
  };

  return labels[category] || category || "כללי";
}