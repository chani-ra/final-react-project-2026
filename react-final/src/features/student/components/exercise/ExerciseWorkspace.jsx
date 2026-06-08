import React, { useState } from "react";

export default function ExerciseWorkspace({
  answer,
  setAnswer,
  saving,
  instructionLines,
  onComplete,
  onClose,
}) {
  const [instructionsVisible, setInstructionsVisible] = useState(true);

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">כתיבת התשובה</h2>
          <p className="text-[11px] font-bold text-white/55">
            ההוראות נשארות לידך בזמן הכתיבה כדי שתוכלי לענות בלי לפתוח חלון.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setInstructionsVisible((prev) => !prev)}
          className="rounded-full border border-[#ffd439]/26 bg-[#ffd439]/14 px-4 py-2 text-xs font-black text-[#ffe89a] transition hover:bg-[#ffd439]/22"
        >
          {instructionsVisible ? "הסתר הוראות" : "הצג הוראות"}
        </button>
      </div>

      <div
        className={`grid gap-4 ${
          instructionsVisible ? "lg:grid-cols-[0.92fr_1.08fr]" : "grid-cols-1"
        }`}
      >
        {instructionsVisible && (
          <ExerciseInstructionsPanel instructionLines={instructionLines} />
        )}

        <div className="flex min-h-[420px] flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label className="block text-sm font-black text-white">
              התשובה שלי
            </label>

            <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-black text-white/58">
              {answer.length} תווים
            </span>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="כתבי כאן את התשובה שלך..."
            className="min-h-[330px] flex-1 resize-none rounded-[1.6rem] border border-white/20 p-4 text-sm font-bold leading-relaxed caret-[#ffd439] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_10px_26px_rgba(3,31,61,0.16)] transition placeholder:text-white/40 focus:border-[#ffd439]/65 focus:ring-4 focus:ring-[#ffd439]/12"
            style={{
              backgroundColor: "rgba(6, 31, 54, 0.92)",
              color: "#ffffff",
            }}
          />

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={onComplete}
              disabled={saving}
              className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
            >
              {saving ? "שומר..." : "סיימתי את התרגיל"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16"
            >
              חזרה בלי שמירה
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExerciseInstructionsPanel({ instructionLines }) {
  return (
    <aside className="flex min-h-[420px] flex-col rounded-[1.7rem] border border-white/18 bg-[#123c6b]/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ffd439]/24 bg-[#ffd439]/14 text-xl text-[#ffd439]">
          ✎
        </div>

        <div>
          <h3 className="text-base font-black text-white">הוראות התרגיל</h3>
          <p className="text-[11px] font-bold text-white/55">
            קראי תוך כדי כתיבה.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto rounded-[1.4rem] border border-white/16 bg-[#061f36]/88 p-3">
        <div className="space-y-2">
          {instructionLines?.length > 0 ? (
            instructionLines.map((line, index) => (
              <div
                key={`${line}-${index}`}
                className="rounded-xl border border-white/12 bg-[#123c6b]/70 px-3 py-2.5 text-xs font-bold leading-relaxed text-white/84"
              >
                {line}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/12 bg-[#123c6b]/70 px-3 py-2.5 text-xs font-bold leading-relaxed text-white/84">
              אין הוראות לתרגיל הזה.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}