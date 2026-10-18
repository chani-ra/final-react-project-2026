import SmartGuideBackButton from "../../../components/ui/SmartGuideBackButton";
import useCourses from "./useCourses.js";
import { CourseCard, StatBox, TabButton, Messages, EmptyState, LoadingRecommended, LoadingCircle } from "./CoursesComponents.jsx";

export default function Courses() {
  const { navigate, scrollerRef, myCourses, recommendedCourses, activeTab, setActiveTab, loading, recommendedLoading, enrollingId, error, handleRecommendedTab, handleEnroll, visibleCourses, stats, scrollCourses } = useCourses();

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
