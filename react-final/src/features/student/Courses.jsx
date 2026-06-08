import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyCourses,
  getRecommendedCourses,
  enrollInCourse,
} from "../../services/courseService";

export default function Courses() {
  const navigate = useNavigate();
  const scrollerRef = useRef(null);

  const [myCourses, setMyCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("myCourses");

  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyCourses();
      setMyCourses(data.courses || []);
    } catch (err) {
      console.error("שגיאה בטעינת הקורסים שלי:", err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      setActionMessage("");

      const data = await getRecommendedCourses();
      setRecommendedCourses(data.courses || []);
    } catch (err) {
      console.error("שגיאה בטעינת קורסים מומלצים:", err);
      setActionMessage(err.toString());
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
      setActionMessage("");

      await enrollInCourse(courseId);

      setActionMessage("נרשמת לקורס בהצלחה");

      await loadMyCourses();
      await loadRecommendedCourses();

      setActiveTab("myCourses");
    } catch (err) {
      setActionMessage(err.toString());
    }
  };

  const visibleCourses = useMemo(() => {
    return activeTab === "myCourses" ? myCourses : recommendedCourses;
  }, [activeTab, myCourses, recommendedCourses]);

  const scrollCourses = (direction) => {
    if (!scrollerRef.current) return;

    scrollerRef.current.scrollBy({
      left: direction === "left" ? -420 : 420,
      behavior: "smooth",
    });
  };

  const getLevelLabel = (level) => {
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
  };

  const getCourseLevel = (course) => {
    return course.englishLevel || course.level || course.difficulty || "";
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

  const getCourseContentStats = (course) => {
    return {
      lessons: course.lessons?.length || 0,
      exercises: course.exercises?.length || 0,
      quizzes: course.quizzes?.length || 0,
      songs: course.songs?.length || 0,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center" dir="rtl">
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black text-white shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את הקורסים...
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative min-h-[calc(100vh-170px)] overflow-hidden pb-8"
      dir="rtl"
    >
      <CoursesHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleRecommendedTab={handleRecommendedTab}
        myCoursesCount={myCourses.length}
        recommendedCoursesCount={recommendedCourses.length}
        onCreateCourse={() => navigate("/create-personal-course")}
      />

      <Messages error={error} actionMessage={actionMessage} />

      <div className="relative mt-5 flex min-h-[390px] items-center">
        {activeTab === "recommended" && recommendedLoading ? (
          <div className="mx-auto rounded-[2rem] border border-white/25 bg-[#123c6b]/74 px-10 py-8 text-center text-xl font-black text-white shadow-[0_22px_60px_rgba(3,31,61,0.30)] backdrop-blur-xl">
            טוען קורסים מומלצים...
          </div>
        ) : visibleCourses.length === 0 ? (
          <EmptyState
            activeTab={activeTab}
            onShowRecommended={handleRecommendedTab}
            onCreateCourse={() => navigate("/create-personal-course")}
          />
        ) : (
          <>
            {visibleCourses.length > 3 && (
              <>
                <button
                  type="button"
                  onClick={() => scrollCourses("right")}
                  className="absolute right-0 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#123c6b]/82 text-3xl font-black text-white shadow-[0_10px_28px_rgba(3,31,61,0.25)] backdrop-blur-xl transition hover:bg-[#176aa8] lg:flex"
                >
                  ›
                </button>

                <button
                  type="button"
                  onClick={() => scrollCourses("left")}
                  className="absolute left-0 z-20 hidden h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#123c6b]/82 text-3xl font-black text-white shadow-[0_10px_28px_rgba(3,31,61,0.25)] backdrop-blur-xl transition hover:bg-[#176aa8] lg:flex"
                >
                  ‹
                </button>
              </>
            )}

            <div
              ref={scrollerRef}
              className="courses-horizontal-scroll flex w-full snap-x snap-mandatory items-stretch gap-5 overflow-x-auto overflow-y-hidden px-3 py-7"
            >
              {visibleCourses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  isRecommended={activeTab === "recommended"}
                  getCourseContentStats={getCourseContentStats}
                  getLevelLabel={getLevelLabel}
                  getCourseLevel={getCourseLevel}
                  getCategoryLabel={getCategoryLabel}
                  onEnroll={handleEnroll}
                  onOpen={() => navigate(`/course/${course._id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>
        {`
          .courses-horizontal-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 212, 57, 0.7) rgba(3, 31, 61, 0.25);
          }

          .courses-horizontal-scroll::-webkit-scrollbar {
            height: 9px;
          }

          .courses-horizontal-scroll::-webkit-scrollbar-track {
            background: rgba(3, 31, 61, 0.25);
            border-radius: 999px;
          }

          .courses-horizontal-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, #b8322a, #ff6659, #ffd439);
            border-radius: 999px;
          }
        `}
      </style>
    </section>
  );
}

function CoursesHeader({
  activeTab,
  setActiveTab,
  handleRecommendedTab,
  myCoursesCount,
  recommendedCoursesCount,
  onCreateCourse,
}) {
  return (
    <header className="mx-auto max-w-6xl pt-2">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/24 bg-[#123c6b]/54 p-4 text-white shadow-[0_18px_55px_rgba(3,31,61,0.24),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div>
          <h1
            className="text-3xl font-black leading-tight md:text-4xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.50), -1px -1px 0 rgba(15,76,117,0.82), 0 12px 28px rgba(7,89,133,0.35)",
            }}
          >
            {activeTab === "myCourses" ? "הקורסים שלי" : "קורסים מומלצים"}
          </h1>

          <p className="mt-1 max-w-xl text-sm font-bold text-white/64">
            בחרי קורס והמשיכי למסלול הלמידה שלך.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-white/18 bg-[#061f36]/48 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("myCourses")}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${
                activeTab === "myCourses"
                  ? "bg-white text-[#123c6b]"
                  : "text-white/76 hover:bg-white/10 hover:text-white"
              }`}
            >
              שלי {myCoursesCount}
            </button>

            <button
              type="button"
              onClick={handleRecommendedTab}
              className={`rounded-full px-4 py-2 text-xs font-black transition ${
                activeTab === "recommended"
                  ? "bg-white text-[#123c6b]"
                  : "text-white/76 hover:bg-white/10 hover:text-white"
              }`}
            >
              מומלצים {recommendedCoursesCount}
            </button>
          </div>

          <button
            type="button"
            onClick={onCreateCourse}
            className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-2.5 text-xs font-black text-white shadow-[0_5px_0_rgba(89,15,20,0.40)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
          >
            קורס חדש
          </button>
        </div>
      </div>
    </header>
  );
}

function Messages({ error, actionMessage }) {
  if (!error && !actionMessage) return null;

  return (
    <div className="mx-auto mt-4 max-w-4xl space-y-3">
      {error && (
        <div className="rounded-[1.5rem] border border-red-300/30 bg-red-500/16 px-5 py-3 text-center text-sm font-black text-red-100 shadow-lg backdrop-blur-xl">
          {error}
        </div>
      )}

      {actionMessage && (
        <div className="rounded-[1.5rem] border border-[#ffd439]/35 bg-[#ffd439]/16 px-5 py-3 text-center text-sm font-black text-[#fff0a8] shadow-lg backdrop-blur-xl">
          {actionMessage}
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  index,
  isRecommended,
  getCourseContentStats,
  getLevelLabel,
  getCourseLevel,
  getCategoryLabel,
  onEnroll,
  onOpen,
}) {
  const stats = getCourseContentStats(course);
  const level = getCourseLevel(course);

  return (
    <article className="group relative h-[280px] w-[330px] shrink-0 snap-center rounded-[1.8rem] border border-cyan-100/24 bg-[#1b5f95]/50 p-4 text-white shadow-[0_16px_38px_rgba(3,31,61,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#1b5f95]/62">
      <div className="absolute -top-4 right-5 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-base font-black shadow-[0_7px_14px_rgba(3,31,61,0.22)]">
        {index + 1}
      </div>

      <div className="flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between gap-2 pr-10">
          <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-black text-white/74">
            {getCategoryLabel(course.category)}
          </span>

          <span className="rounded-full border border-[#ffd439]/22 bg-[#ffd439]/12 px-3 py-1 text-[11px] font-black text-[#ffe89a]">
            {getLevelLabel(level)}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[58px] text-2xl font-black leading-tight text-white">
          {course.title || `קורס ${index + 1}`}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[38px] text-sm font-bold leading-relaxed text-white/58">
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
          className="mt-auto rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          {isRecommended ? "הצטרפות לקורס" : "כניסה למסלול"}
        </button>
      </div>
    </article>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#061f36]/42 px-2 py-2 text-center">
      <div className="text-sm font-black text-white">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold text-white/50">{label}</div>
    </div>
  );
}

function EmptyState({ activeTab, onShowRecommended, onCreateCourse }) {
  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-white/28 bg-[#123c6b]/62 p-8 text-center text-white shadow-[0_22px_65px_rgba(3,31,61,0.30)] backdrop-blur-xl">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/16 bg-white/10 text-2xl font-black">
        —
      </div>

      <h2 className="text-2xl font-black">
        {activeTab === "myCourses"
          ? "עדיין אין לך קורסים"
          : "אין כרגע קורסים מומלצים"}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62">
        {activeTab === "myCourses"
          ? "אפשר להתחיל מקורס מומלץ או ליצור מסלול אישי חדש."
          : "כאשר יתווספו קורסים שמתאימים לך, הם יופיעו כאן."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {activeTab === "myCourses" && (
          <button
            type="button"
            onClick={onShowRecommended}
            className="rounded-full border border-white/18 bg-white/10 px-6 py-3 text-sm font-black text-white transition hover:bg-white/16"
          >
            הצג מומלצים
          </button>
        )}

        <button
          type="button"
          onClick={onCreateCourse}
          className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-6 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          יצירת קורס חדש
        </button>
      </div>
    </div>
  );
}