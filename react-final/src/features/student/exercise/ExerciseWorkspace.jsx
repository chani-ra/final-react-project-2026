
export default function ExerciseWorkspace({
  intro,
  prompts,
  answers,
  result,
  onAnswerChange,
  saving,
  onComplete,
  onClose,
}) {
  const answeredCount = prompts.filter((_, index) => answers[index]?.trim()).length;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="mb-4">
        <h2 className="text-lg font-black text-white">שאלות ותשובות</h2>
        <p className="mt-1 text-xs font-bold text-white/60">
          כתבי את התשובה מתחת לכל שאלה, לפי הסדר.
        </p>
      </div>

      {intro && (
        <div className="mb-4 whitespace-pre-line rounded-[1.4rem] border border-[#ffd439]/22 bg-[#123c6b]/72 p-4 text-sm font-bold leading-relaxed text-white/85">
          {intro}
        </div>
      )}

      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <div
            key={index}
            className="rounded-[1.6rem] border border-white/18 bg-[#123c6b]/62 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]"
          >
            <div className="mb-3 flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ffd439]/28 bg-[#ffd439]/14 text-sm font-black text-[#ffe89a]">
                {index + 1}
              </span>
              <p dir="auto" className="min-w-0 flex-1 whitespace-pre-line text-sm font-bold leading-relaxed text-white/90">
                {prompt}
              </p>
            </div>

            <label htmlFor={"exercise-answer-" + index} className="mb-2 block text-xs font-black text-[#ffe89a]">
              התשובה שלי לשאלה {index + 1}
            </label>
            <textarea
              id={"exercise-answer-" + index}
              dir="auto"
              rows={3}
              value={answers[index] || ""}
              disabled={Boolean(result) || saving}
              onChange={(event) => onAnswerChange(index, event.target.value)}
              placeholder="כתבי כאן את התשובה שלך..."
              className="w-full resize-y rounded-[1.2rem] border border-white/20 p-4 text-sm font-bold leading-relaxed caret-[#ffd439] text-white outline-none transition placeholder:text-white/40 focus:border-[#ffd439]/65 focus:ring-4 focus:ring-[#ffd439]/12"
              style={{ backgroundColor: "rgba(6, 31, 54, 0.92)" }}
            />

            {result?.answers?.[index] && (
              <div
                className="mt-3 rounded-xl border border-white/20 bg-[#061f36]/60 p-3 text-sm font-bold text-white"
                aria-live="polite"
              >
                {result.answers[index].correct === true
                  ? "נכון"
                  : result.answers[index].correct === false
                    ? "לא נכון"
                    : result.status === "pending"
                      ? "ממתין לבדיקה"
                      : "אין הכרעה אוטומטית"}

                {result.answers[index].feedback && (
                  <p className="mt-1 text-xs font-medium text-white/75">
                    {result.answers[index].feedback}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {result && (
        <div
          className="mt-4 rounded-xl border border-[#ffd439]/30 bg-[#123c6b]/75 p-4 text-sm font-black text-white"
          aria-live="polite"
        >
          {result.status === "graded"
            ? "הציון שלך: " + result.score + "% (הערכת AI)"
            : "התשובות נשמרו. הבדיקה עדיין ממתינה או דורשת בדיקה נוספת."}
        </div>
      )}

      <div className="mt-4 text-xs font-bold text-white/60" aria-live="polite">
        ענית על {answeredCount} מתוך {prompts.length} שאלות.
      </div>
      <p className="mt-2 text-xs leading-relaxed text-white/50">
        התשובות נשלחות ונשמרות. כשהבדיקה מצליחה, ההתקדמות מתעדכנת. הערכת AI אינה תחליף לבדיקת מורה.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={onComplete}
          disabled={saving || Boolean(result)}
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
    </section>
  );
}
