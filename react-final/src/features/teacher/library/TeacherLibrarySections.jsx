import React from "react";
import { getLevelLabel, getQuizTypeLabel } from "./libraryUtils";

export function LibraryHeader({
  totalCount,
  publishedCount,
  draftCount,
  onCreateQuiz,
  onCreateExercise,
  onCreateContent,
}) {
  return (
    <header className="mb-6">
      <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-sm font-black text-[#ffe89a]">
        ספריית המורה
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1
            className="text-3xl font-black leading-tight md:text-5xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
            }}
          >
            ניהול תוכן מורה
          </h1>

          <p className="mt-3 max-w-4xl text-sm font-bold leading-relaxed text-white/72 md:text-base">
            כאן מנהלים שיעורים, שירים, תרגילים ובחנים. תוכן מפורסם יכול להיכנס
            למסלולים אישיים של תלמידות.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
          <MiniInfoCard label="סה״כ" value={totalCount} />
          <MiniInfoCard label="מפורסמים" value={publishedCount} />
          <MiniInfoCard label="טיוטות" value={draftCount} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <HeaderActionButton
          title="יצירת בוחן"
          subtitle="בוחן אמריקאי עם שאלות ומשוב"
          icon="Q"
          onClick={onCreateQuiz}
        />

        <HeaderActionButton
          title="יצירת תרגיל"
          subtitle="תרגול מותאם למסלולי תלמידות"
          icon="E"
          onClick={onCreateExercise}
        />

        <HeaderActionButton
          title="העלאת שיעור או שיר"
          subtitle="וידאו או אודיו לספריית התוכן"
          icon="U"
          onClick={onCreateContent}
        />
      </div>
    </header>
  );
}

function HeaderActionButton({ title, subtitle, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative overflow-hidden rounded-[1.8rem] border-2 border-white/38 bg-[#061f36]/54 p-5 text-right text-white shadow-[0_18px_42px_rgba(3,31,61,0.24),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:-translate-y-1 hover:border-[#ffd439]/55 hover:bg-[#123c6b]/74"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

      <div className="relative z-10 flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-xl font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.42),0_12px_24px_rgba(3,31,61,0.28)]">
          {icon}
        </span>

        <span className="min-w-0">
          <span className="block text-xl font-black leading-7 text-white md:text-2xl">
            {title}
          </span>

          <span className="mt-1 block text-sm font-bold leading-6 text-white/66">
            {subtitle}
          </span>
        </span>

        <span className="mr-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/18 bg-white/10 text-2xl font-black text-[#ffe89a] transition group-hover:bg-[#ffd439]/20">
          +
        </span>
      </div>
    </button>
  );
}

export function StatsGrid({ lessons, songs, exercises, quizzes, published, drafts }) {
  return (
    <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-6">
      <StatCard title="שיעורים" value={lessons} />
      <StatCard title="שירים" value={songs} />
      <StatCard title="תרגילים" value={exercises} />
      <StatCard title="בחנים" value={quizzes} />
      <StatCard title="מפורסמים" value={published} />
      <StatCard title="טיוטות" value={drafts} />
    </section>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
      <div className="text-xs font-bold text-white/58">{title}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

export function TabsBar({ tabs, activeTab, setActiveTab }) {
  return (
    <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/62 p-3 shadow-[0_24px_65px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2.5 text-sm font-black transition-all ${active
                  ? "border border-[#ffd439]/35 bg-[#ffd439]/22 text-[#fff3b0] shadow-[0_0_18px_rgba(255,212,57,0.14)]"
                  : "border border-white/12 bg-white/8 text-white/72 hover:bg-white/12 hover:text-white"
                }`}
            >
              {tab.label}
              <span
                className={`mr-2 rounded-full px-2 py-0.5 text-[11px] ${active
                    ? "bg-[#123c6b]/50 text-[#fff3b0]"
                    : "bg-white/10 text-white/58"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function QuizLibraryCard({
  quiz,
  actionLoadingId,
  onEdit,
  onTogglePublish,
  onDelete,
}) {
  const questionCount = quiz.questions?.length || 0;
  const courseTitle = quiz.courseId?.title || "בוחן חכם כללי";
  const isLoading = actionLoadingId === quiz._id;

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#ff6659]/38 bg-[#123c6b]/72 p-4 text-white shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-2">
              <StatusBadge isPublic={quiz.isPublic} />
              <SoftBadge>{getLevelLabel(quiz.englishLevel)}</SoftBadge>
              <SoftBadge>{getQuizTypeLabel(quiz.quizType)}</SoftBadge>
            </div>

            <h3 className="line-clamp-2 text-2xl font-black leading-tight">
              {quiz.title || "בוחן ללא כותרת"}
            </h3>

            <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-white/62">
              {quiz.description || "אין תיאור לבוחן זה."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <SmallInfo label="שאלות" value={questionCount} />
          <SmallInfo label="רמה" value={getLevelLabel(quiz.englishLevel)} />
          <SmallInfo label="סוג" value={getQuizTypeLabel(quiz.quizType)} />
          <SmallInfo label="קורס" value={courseTitle} />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3">
          <CardActionButton
            label="עריכה"
            onClick={onEdit}
            disabled={isLoading}
            variant="blue"
          />

          <CardActionButton
            label={quiz.isPublic ? "החזר לטיוטה" : "פרסם"}
            onClick={onTogglePublish}
            disabled={isLoading}
            variant="dark"
          />

          <CardActionButton
            label="מחיקה"
            onClick={onDelete}
            disabled={isLoading}
            variant="red"
          />
        </div>
      </div>
    </article>
  );
}

function SmallInfo({ label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="h-3 w-3 shrink-0 rounded-full bg-[#ffd439] shadow-[0_0_12px_rgba(255,212,57,0.55)]" />

      <span className="min-w-0">
        <span className="block text-sm font-bold leading-5 text-white/58">
          {label}
        </span>

        <span className="block truncate text-lg font-extrabold leading-7 text-white">
          {value || "לא צוין"}
        </span>
      </span>
    </div>
  );
}

function StatusBadge({ isPublic }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-[11px] font-black ${isPublic
          ? "border-white/24 bg-white/12 text-white"
          : "border-[#ffd439]/32 bg-[#ffd439]/14 text-[#fff3b0]"
        }`}
    >
      {isPublic ? "מפורסם" : "טיוטה"}
    </span>
  );
}

function SoftBadge({ children }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-black text-white/68">
      {children}
    </span>
  );
}
function CardActionButton({ label, onClick, disabled, variant }) {
  const classes = {
    blue:
      "border-[#7dd3fc] bg-[#0f4c75] text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#176aa8]",
    dark:
      "border-[#ffd439] bg-[#123c6b] text-[#fff3b0] shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#0f4c75]",
    red:
      "border-[#ffb4ad] bg-[#b8322a] text-white shadow-[0_5px_0_rgba(89,15,20,0.50)] hover:bg-[#9f2a24]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-2 px-4 py-3 text-sm font-black transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 ${classes[variant]}`}
    >
      {label}
    </button>
  );
}
export function EmptyState({ type, onClick }) {
  const config = {
    lesson: {
      title: "אין שיעורים בספרייה",
      text: "העלי שיעור ראשון כדי להתחיל לבנות מאגר תוכן חכם.",
      button: "העלאת שיעור",
    },
    song: {
      title: "אין שירים בספרייה",
      text: "העלי שיר ראשון כדי להעשיר את מסלולי הלמידה.",
      button: "העלאת שיר",
    },
    exercise: {
      title: "אין תרגילים בספרייה",
      text: "צרי תרגיל ראשון ידנית או בעזרת AI.",
      button: "יצירת תרגיל",
    },
    quiz: {
      title: "אין בחנים בספרייה",
      text: "צרי בוחן ראשון בעזרת AI כדי להוסיף מדידה למסלולי הלמידה.",
      button: "יצירת בוחן",
    },
  };

  const item = config[type];

  return (
    <section className="mt-5 rounded-[2rem] border border-white/22 bg-[#061f36]/62 px-6 py-14 text-center text-white shadow-[0_24px_65px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/16 bg-white/10 text-2xl font-black">
        +
      </div>

      <h2 className="text-2xl font-black">{item.title}</h2>

      <p className="mx-auto mt-2 max-w-md text-sm font-bold leading-relaxed text-white/62">
        {item.text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
      >
        {item.button}
      </button>
    </section>
  );
}

function MiniInfoCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="text-xs font-bold text-white/58">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}

export function HeaderLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4"
          strokeWidth="3"
        />
        <path
          d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
