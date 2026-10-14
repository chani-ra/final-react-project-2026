import React from "react";
import { InfoRow } from "../ui/TeacherInfoBlocks";
import { getLevelLabel, getCategoryLabel, getQuizTypeLabel } from "./quizBuilder.utils";

export function ActionButtons({
  generating,
  saving,
  questionsCount,
  onGenerate,
  onSave,
  onAddQuestion,
  publishMode,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="rounded-full border-2 border-[#7dd3fc] bg-[#0f4c75] px-5 py-4 text-base font-bold text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#176aa8] active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {generating ? "יוצר שאלות..." : "יצירת שאלות עם AI"}
      </button>

      <button
        type="button"
        onClick={onAddQuestion}
        className="rounded-full border-2 border-[#ffd439] bg-[#123c6b] px-5 py-4 text-base font-bold text-[#fff3b0] shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#0f4c75] active:translate-y-1 active:shadow-none"
      >
        הוספת שאלה ידנית
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={saving || questionsCount === 0}
        className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-base font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {saving
          ? "שומר בוחן..."
          : publishMode === "published"
          ? "שמירה ופרסום"
          : "שמירה כטיוטה"}
      </button>
    </div>
  );
}

export function QuizSideSummary({ form, questions, hobbies, expectations, publishMode }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-xl font-extrabold">סיכום הבוחן</h2>

        <div className="mt-3 space-y-2">
          <InfoRow label="רמה" value={getLevelLabel(form.englishLevel)} />
          <InfoRow label="קטגוריה" value={getCategoryLabel(form.category)} />
          <InfoRow label="סוג" value={getQuizTypeLabel(form.quizType)} />
          <InfoRow label="שאלות" value={questions.length} />
          <InfoRow label="תחביבים" value={hobbies.length} />
          <InfoRow label="מטרות" value={expectations.length} />
          <InfoRow
            label="פרסום"
            value={publishMode === "published" ? "מפורסם" : "טיוטה"}
          />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h2 className="text-xl font-extrabold text-white">בדיקה לפני שמירה</h2>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-base font-semibold leading-8 text-white/78">
          ודאי שלכל שאלה יש לפחות שתי אפשרויות, תשובה נכונה והסבר. כך התלמידה
          תקבל משוב ברור אחרי ההגשה.
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
        <div className="text-sm font-bold text-white/62">מצב עריכה</div>

        <div className="mt-1 text-2xl font-extrabold text-white">
          {questions.length ? "יש שאלות" : "אין שאלות"}
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/16">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] transition-all"
            style={{
              width: `${Math.min(100, questions.length * 20)}%`,
            }}
          />
        </div>
      </div>
    </aside>
  );
}
