import React from "react";

export default function QuizQuestionCard({
  question,
  index,
  selectedAnswer,
  answerResult,
  result,
  onSelect,
}) {
  const options = question.options || [];

  return (
    <article className="relative overflow-hidden rounded-[1.8rem] border-2 border-[#ff6659]/55 bg-[#123c6b]/72 p-4 shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-lg font-black text-white shadow-[0_8px_0_rgba(89,15,20,0.38),0_10px_22px_rgba(3,31,61,0.24)]">
              {index + 1}
            </div>

            <div>
              <div className="text-xs font-black text-[#ffe89a]">
                שאלה בבוחן
              </div>

              <div className="text-sm font-bold text-white/72">
                בחרי תשובה אחת נכונה
              </div>
            </div>
          </div>

          {result && answerResult && (
            <span
              className={`rounded-full border-2 px-4 py-1.5 text-sm font-black ${
                answerResult.isCorrect
                  ? "border-emerald-200 bg-emerald-500/35 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.32)]"
                  : "border-red-200 bg-red-500/28 text-red-50 shadow-[0_0_20px_rgba(248,113,113,0.26)]"
              }`}
            >
              {answerResult.isCorrect ? "נכון" : "לא נכון"}
            </span>
          )}
        </div>

        <div className="rounded-[1.4rem] border border-[#075a98]/55 bg-[#061f36]/62 px-4 py-4">
          <h3 className="text-lg font-bold leading-8 text-white md:text-xl">
            {question.question}
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedAnswer === option;

            const correctAnswer = answerResult?.correctAnswer;
            const isCorrectOptionAfterSubmit = result && correctAnswer === option;
            const isWrongSelectedAfterSubmit =
              result && isSelected && answerResult && !answerResult.isCorrect;

            return (
              <button
                key={option}
                type="button"
                disabled={Boolean(result)}
                onClick={() => onSelect(index, option)}
                className={`rounded-2xl border-2 p-4 text-right text-base font-bold leading-7 transition-all disabled:cursor-default ${
                  isCorrectOptionAfterSubmit
                    ? "border-emerald-200 bg-emerald-500/40 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.44),inset_0_1px_0_rgba(255,255,255,0.18)]"
                    : isWrongSelectedAfterSubmit
                    ? "border-red-200 bg-red-500/34 text-red-50 shadow-[0_0_24px_rgba(248,113,113,0.32)]"
                    : isSelected
                    ? "border-[#ffd439] bg-[#ffd439]/36 text-[#fff7c9] shadow-[0_0_26px_rgba(255,212,57,0.40),inset_0_1px_0_rgba(255,255,255,0.14)]"
                    : "border-[#2c8fd6]/45 bg-[#061f36]/72 text-white/86 hover:border-[#ff6659]/65 hover:bg-[#123c6b]/78"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-black ${
                      isCorrectOptionAfterSubmit
                        ? "border-emerald-50 bg-emerald-400 text-[#052e1a] shadow-[0_0_18px_rgba(52,211,153,0.62)]"
                        : isWrongSelectedAfterSubmit
                        ? "border-red-50 bg-red-400 text-[#3f0505] shadow-[0_0_16px_rgba(248,113,113,0.5)]"
                        : isSelected
                        ? "border-[#fff2a3] bg-[#ffd439] text-[#123c6b] shadow-[0_0_18px_rgba(255,212,57,0.62)]"
                        : "border-[#2c8fd6]/60 bg-[#123c6b]/65 text-white/70"
                    }`}
                  >
                    {isCorrectOptionAfterSubmit
                      ? "✓"
                      : isWrongSelectedAfterSubmit
                      ? "×"
                      : isSelected
                      ? "✓"
                      : ""}
                  </span>

                  <span>{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {result && answerResult && (
          <QuestionFeedback answerResult={answerResult} />
        )}
      </div>
    </article>
  );
}

function QuestionFeedback({ answerResult }) {
  return (
    <div
      className={`mt-4 rounded-[1.4rem] border-2 p-4 ${
        answerResult.isCorrect
          ? "border-emerald-200/50 bg-emerald-500/20 shadow-[0_0_22px_rgba(52,211,153,0.18)]"
          : "border-red-200/42 bg-red-500/14"
      }`}
    >
      <h4
        className={`text-base font-black leading-7 ${
          answerResult.isCorrect ? "text-emerald-50" : "text-red-100"
        }`}
      >
        {answerResult.isCorrect
          ? "משוב: תשובה נכונה"
          : "משוב: התשובה אינה נכונה"}
      </h4>

      <div className="mt-3 space-y-2 text-sm font-bold leading-7 text-white/82">
        <p>
          <span className="font-black text-white">התשובה שלך:</span>{" "}
          {answerResult.userAnswer || "לא נענתה"}
        </p>

        <p>
          <span className="font-black text-emerald-100">התשובה הנכונה:</span>{" "}
          {answerResult.correctAnswer || "לא צוינה"}
        </p>

        {answerResult.explanation ? (
          <p>
            <span className="font-black text-[#ffe89a]">הסבר:</span>{" "}
            {answerResult.explanation}
          </p>
        ) : (
          <p>
            <span className="font-black text-[#ffe89a]">הסבר:</span>{" "}
            לא צורף הסבר לשאלה הזו.
          </p>
        )}
      </div>
    </div>
  );
}