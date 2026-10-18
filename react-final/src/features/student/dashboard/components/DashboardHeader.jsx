import React from "react";
import { UserIcon } from "../../../general/dashboard/dashboardIcons";

export default function DashboardHeader({
  name,
  level,
  expectations,
  onGoToCourses,
}) {
  const goals =
    expectations?.length > 0
      ? expectations.slice(0, 3).map((item) => getExpectationLabel(item))
      : ["ביטחון באנגלית", "אוצר מילים", "תרגול יומי"];

  return (
    <div className="relative z-20 px-5 pt-5 md:px-8 md:pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 rounded-[1.7rem] border border-white/36 bg-[#073a5d]/36 p-4 shadow-[0_16px_44px_rgba(7,54,89,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl">
          <div className="flex h-15 w-15 items-center justify-center rounded-2xl border border-white/30 bg-white/15 p-3 shadow-[0_0_20px_rgba(255,255,255,0.16)]">
            <UserIcon />
          </div>

          <div>
            <div className="text-xl font-black text-white">היי {name}</div>
            <div className="mt-1 text-sm font-bold text-white/74">
              רמה: {getLevelLabel(level)}
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1
            className="text-3xl font-black text-white md:text-5xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
            }}
          >
            מפת המסע שלך לאנגלית
          </h1>

          <p className="mt-2 text-sm font-black text-[#08324e]/78 md:text-base">
            לומדים • מתקדמים • כובשים יעדים
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {goals.map((goal) => (
              <span
                key={goal}
                className="rounded-full border border-white/26 bg-white/16 px-3 py-1 text-xs font-black text-white shadow-sm backdrop-blur-xl"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToCourses}
          className="group relative overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-8 py-3.5 text-base font-black text-white shadow-[0_7px_0_rgba(89,15,20,0.48),0_0_24px_rgba(255,255,255,0.22)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent opacity-0 transition group-hover:opacity-100" />
          <span className="relative">מעבר לקורסים שלי</span>
        </button>
      </div>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}

function getExpectationLabel(expectation) {
  const labels = {
    grammar: "דקדוק",
    fluent_speaking: "דיבור שוטף",
    speaking: "דיבור",
    confidence: "ביטחון באנגלית",
    vocabulary: "אוצר מילים",
    reading: "קריאה",
    listening: "האזנה",
    writing: "כתיבה",
  };

  return labels[expectation] || expectation;
}