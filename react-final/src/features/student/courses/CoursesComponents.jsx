import { getCourseContentStats, getCourseLevel, getLevelLabel, getCategoryLabel } from "./coursesModel.js";

export function CourseCard({
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

export function StatBox({ label, value, tone }) {
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

export function TabButton({ active, onClick, children }) {
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

export function SmallStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/55 px-2 py-2 text-center">
      <div className="text-sm font-black text-white">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold text-white/50">{label}</div>
    </div>
  );
}

export function Messages({ error }) {
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

export function EmptyState({ activeTab, onShowRecommended, onCreateCourse }) {
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

export function LoadingRecommended() {
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

export function LoadingCircle() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
    </div>
  );
}

export function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}
