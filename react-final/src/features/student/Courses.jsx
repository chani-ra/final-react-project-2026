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

    const amount = 430;
    scrollerRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const getLevelLabel = (level) => {
    const labels = {
      beginner: "רמת בסיס",
      intermediate: "רמת ביניים",
      advanced: "רמה מתקדמת",
    };

    return labels[level] || level || "רמה אישית";
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
    const lessons = course.lessons?.length || 0;
    const exercises = course.exercises?.length || 0;
    const quizzes = course.quizzes?.length || 0;
    const songs = course.songs?.length || 0;

    return { lessons, exercises, quizzes, songs };
  };

  if (loading) {
    return (
      <div className="flex min-h-[58vh] items-center justify-center" dir="rtl">
        <div className="rounded-[2rem] border border-white/35 bg-[#031f3d]/78 px-10 py-8 text-xl font-black text-white shadow-[0_0_45px_rgba(255,255,255,0.35)] backdrop-blur-xl">
          טוען את מפת הלמידה שלך...
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-190px)] overflow-hidden pb-10" dir="rtl">
      <CoursesHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleRecommendedTab={handleRecommendedTab}
        myCoursesCount={myCourses.length}
        recommendedCoursesCount={recommendedCourses.length}
      />

      {error && (
        <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-red-200/50 bg-red-500/18 px-5 py-3 text-center font-bold text-white shadow-lg backdrop-blur-md">
          {error}
        </div>
      )}

      {actionMessage && (
        <div className="mx-auto mt-5 max-w-3xl rounded-2xl border border-yellow-300/60 bg-yellow-300/16 px-5 py-3 text-center font-bold text-yellow-50 shadow-lg backdrop-blur-md">
          {actionMessage}
        </div>
      )}

      <div className="relative mt-8 flex min-h-[430px] items-center">
        {activeTab === "recommended" && recommendedLoading ? (
          <div className="mx-auto rounded-[2rem] border border-white/25 bg-[#031f3d]/75 px-10 py-8 text-center text-xl font-black text-white shadow-[0_0_45px_rgba(255,255,255,0.35)] backdrop-blur-xl">
            טוען קורסים מומלצים...
          </div>
        ) : visibleCourses.length === 0 ? (
          <EmptyState
            activeTab={activeTab}
            onShowRecommended={handleRecommendedTab}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => scrollCourses("right")}
              className="absolute right-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-[#062f52]/80 text-3xl font-black text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-[#062f52] lg:flex"
            >
              ›
            </button>

            <button
              type="button"
              onClick={() => scrollCourses("left")}
              className="absolute left-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-[#062f52]/80 text-3xl font-black text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] backdrop-blur-md transition hover:bg-[#062f52] lg:flex"
            >
              ‹
            </button>

            <div
              ref={scrollerRef}
              className="courses-horizontal-scroll flex w-full snap-x snap-mandatory items-center gap-7 overflow-x-auto overflow-y-hidden px-4 py-10"
            >
              {visibleCourses.map((course, index) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  index={index}
                  isRecommended={activeTab === "recommended"}
                  getCourseContentStats={getCourseContentStats}
                  getLevelLabel={getLevelLabel}
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
            scrollbar-color: rgba(255, 212, 57, 0.8) rgba(3, 31, 61, 0.35);
          }

          .courses-horizontal-scroll::-webkit-scrollbar {
            height: 10px;
          }

          .courses-horizontal-scroll::-webkit-scrollbar-track {
            background: rgba(3, 31, 61, 0.28);
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
}) {
  return (
    <header className="pt-3 text-center">
      <div className="inline-flex items-center gap-3 rounded-full border border-white/35 bg-[#06365f]/34 px-4 py-2 shadow-[0_0_35px_rgba(255,255,255,0.2)] backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab("myCourses")}
          className={`rounded-full px-5 py-2 text-sm font-black transition-all ${
            activeTab === "myCourses"
              ? "bg-white text-[#0b5e96] shadow-lg"
              : "text-white/90 hover:bg-white/10"
          }`}
        >
          הקורסים שלי {myCoursesCount}
        </button>

        <button
          type="button"
          onClick={handleRecommendedTab}
          className={`rounded-full px-5 py-2 text-sm font-black transition-all ${
            activeTab === "recommended"
              ? "bg-[#ffd439] text-[#08324e] shadow-lg"
              : "text-white/90 hover:bg-white/10"
          }`}
        >
          מומלצים {recommendedCoursesCount}
        </button>
      </div>

      <h1
        className="mt-7 text-4xl font-black tracking-tight text-white md:text-6xl"
        style={{
          textShadow:
            "3px 3px 0 rgba(184,50,42,0.62), -1px -1px 0 rgba(15,76,117,0.75), 0 10px 25px rgba(7,89,133,0.35)",
        }}
      >
        {activeTab === "myCourses" ? "השיעורים שלך" : "קורסים מומלצים"}
      </h1>

      <p className="mx-auto mt-3 max-w-2xl text-base font-extrabold text-[#08324e]/82 md:text-xl">
        בחרי שיעור, התחילי להתקדם, והפכי את האנגלית למסע ברור, קליל וכיפי
      </p>
    </header>
  );
}

function CourseCard({
  course,
  index,
  isRecommended,
  getCourseContentStats,
  getLevelLabel,
  getCategoryLabel,
  onEnroll,
  onOpen,
}) {
  const stats = getCourseContentStats(course);

  return (
    <article className="group relative h-[315px] w-[380px] shrink-0 snap-center rounded-[1.8rem] border border-cyan-200/55 bg-[#031f3d]/78 p-5 shadow-[0_0_28px_rgba(103,232,249,0.30),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:bg-[#02182f]/86 hover:shadow-[0_0_46px_rgba(255,255,255,0.42)]">
      <div className="absolute -top-9 right-8">
        <div className="relative">
          <div className="h-20 w-16 rounded-[50%_50%_46%_46%] border-[5px] border-[#075a98] bg-gradient-to-b from-[#ff6257] to-[#b8322a] shadow-[0_9px_18px_rgba(4,47,77,0.38),inset_0_4px_0_rgba(255,255,255,0.25)]">
            <div className="flex h-full items-center justify-center text-3xl font-black text-white">
              {index + 1}
            </div>
          </div>

          <div className="mx-auto -mt-1 h-5 w-8 rounded-b-lg border-[3px] border-[#075a98] bg-[#b8322a]" />

          <div className="absolute -left-3 top-2 h-3.5 w-3.5 rounded-full bg-[#ffd439] shadow-[0_0_18px_rgba(255,212,57,0.95)]" />
        </div>
      </div>

      <div className="flex h-full flex-col">
        <div className="flex items-start gap-4 pr-20">
          <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <MiniCourseDrawing index={index} />
          </div>

          <div className="min-w-0 text-right">
            <h3 className="line-clamp-2 text-2xl font-black leading-tight text-white drop-shadow">
              {course.title || `שיעור ${index + 1}`}
            </h3>

            <div className="mt-2 text-sm font-bold text-white/74">
              {getCategoryLabel(course.category)}
            </div>

            <div className="mt-2 inline-flex rounded-full border border-white/14 bg-white/8 px-3 py-1 text-xs font-black text-white">
              {getLevelLabel(course.level)}
            </div>
          </div>
        </div>

        <ProgressDots index={index} />

        <div className="mt-5 grid grid-cols-4 gap-2 text-[11px] font-bold text-white/84">
          <SmallStat label="שיעורים" value={stats.lessons} />
          <SmallStat label="תרגילים" value={stats.exercises} />
          <SmallStat label="בחנים" value={stats.quizzes} />
          <SmallStat label="שירים" value={stats.songs} />
        </div>

        <button
          type="button"
          onClick={isRecommended ? () => onEnroll(course._id) : onOpen}
          className="mt-auto w-full rounded-full border-2 border-white/65 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-3 text-lg font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.48),0_0_18px_rgba(255,255,255,0.18)] transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          {isRecommended ? "הצטרפי" : "התחל"}
        </button>
      </div>
    </article>
  );
}

function SmallStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#010f1f]/42 px-2 py-2 text-center">
      <div className="text-sm font-black text-[#ffd439]">{value}</div>
      <div>{label}</div>
    </div>
  );
}

function ProgressDots({ index }) {
  const full = Math.min(4, Math.max(1, index + 1));

  return (
    <div className="mt-5 flex items-center justify-center gap-1.5">
      {[0, 1, 2, 3].map((dot) => (
        <span
          key={dot}
          className={`h-2.5 w-12 rounded-full ${
            dot < full ? "bg-[#ffd439]" : "bg-white/18"
          }`}
        />
      ))}
    </div>
  );
}

function EmptyState({ activeTab, onShowRecommended }) {
  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/35 bg-[#031f3d]/74 p-9 text-center text-white shadow-[0_0_45px_rgba(255,255,255,0.32)] backdrop-blur-xl">
      <h2 className="text-3xl font-black">
        {activeTab === "myCourses"
          ? "עדיין אין לך קורסים"
          : "אין כרגע קורסים מומלצים"}
      </h2>

      <p className="mt-4 text-lg font-bold text-white/80">
        {activeTab === "myCourses"
          ? "אפשר להתחיל מקורס מומלץ ולהפוך את הלמידה למסע יפה וברור."
          : "כאשר יתווספו קורסים שמתאימים לך, הם יופיעו כאן."}
      </p>

      {activeTab === "myCourses" && (
        <button
          type="button"
          onClick={onShowRecommended}
          className="mt-7 rounded-full bg-[#ffd439] px-8 py-3 text-lg font-black text-[#08324e] shadow-[0_8px_0_rgba(7,89,133,0.3)] transition hover:brightness-105"
        >
          הצג קורסים מומלצים
        </button>
      )}
    </div>
  );
}

function MiniCourseDrawing({ index }) {
  const drawings = [
    <path
      key="1"
      d="M25 70 H130 M42 70 V35 L78 18 L114 35 V70 M58 70 V48 H94 V70"
    />,
    <path key="2" d="M35 72 L80 20 L125 72 M52 58 H108 M62 44 H98" />,
    <path key="3" d="M30 60 H110 L130 45 M55 60 L70 35 H118" />,
    <path
      key="4"
      d="M35 72 H125 M48 72 V38 H112 V72 M48 38 C62 20 98 20 112 38"
    />,
    <path key="5" d="M30 72 H130 M55 72 V35 H105 V72 M45 45 H115" />,
  ];

  return (
    <svg
      viewBox="0 0 160 90"
      className="h-full w-full opacity-45"
      fill="none"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="4"
    >
      {drawings[index % drawings.length]}
      <path d="M20 20 C35 8 55 8 70 20" opacity="0.55" />
      <path d="M105 24 C118 14 135 14 148 24" opacity="0.55" />
    </svg>
  );
}