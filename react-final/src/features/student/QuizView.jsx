import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getQuizById, submitQuiz } from "../../services/quizService";

export default function QuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("courseId");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const questions = quiz?.questions || [];

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((answer) => answer !== "").length;
  }, [answers]);

  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getQuizById(quizId, courseId);
      setQuiz(data.quiz || data);
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error.toString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, [quizId, courseId]);

  const handleSelectAnswer = (questionIndex, answer) => {
    if (result) return;

    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });

      if (!questions.length) {
        setMessage({
          type: "error",
          text: "אין שאלות בבוחן הזה.",
        });
        return;
      }

      const formattedAnswers = questions.map((question, index) => ({
        questionIndex: index,
        answer: answers[index] || "",
      }));

      const data = await submitQuiz(quizId, {
        answers: formattedAnswers,
        timeTaken: null,
        courseId,
      });

      setResult(data);

      setMessage({
        type: "success",
        text: data.message || "הבוחן הוגש בהצלחה ✅",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.response?.data?.message || error.toString(),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getAnswerResult = (questionIndex) => {
    if (!result?.answers) return null;

    return result.answers.find(
      (answer) => answer.questionIndex === questionIndex
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white font-bold text-xl">
        <div className="animate-pulse">טוען את הבוחן... 🧠</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-3xl font-bold">
        הבוחן לא נמצא.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-yellow-400 font-bold mb-6"
        >
          ← חזרה לקורס
        </button>

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex gap-2 mb-4 flex-wrap">
              <span className="bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 px-3 py-1 rounded-full text-sm font-bold">
                בוחן
              </span>

              <span className="bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-sm font-bold">
                {quiz.quizType || "mixed"}
              </span>

              <span className="bg-yellow-400/10 text-yellow-300 border border-yellow-400/20 px-3 py-1 rounded-full text-sm font-bold">
                ציון מעבר: {quiz.passingScore || 70}%
              </span>
            </div>

            <h1 className="text-4xl font-black text-white mb-4">
              {quiz.title}
            </h1>

            <p className="text-gray-300 leading-relaxed max-w-3xl">
              {quiz.description ||
                "עני על השאלות. בסיום הבוחן תקבלי ציון, תשובות נכונות והסברים."}
            </p>
          </div>

          <div className="bg-indigo-500 text-white rounded-3xl p-6 min-w-[190px] text-center h-fit">
            <div className="text-4xl mb-2">🧠</div>
            <div className="font-black">בוחן ידע</div>
            <div className="text-sm mt-2 opacity-90">
              {questions.length} שאלות
            </div>
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {result && (
        <section
          className={`rounded-3xl p-6 border ${
            result.passed
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-yellow-400/10 border-yellow-400/30"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
              <h2 className="text-2xl font-black text-white">
                {result.passed
                  ? "כל הכבוד! עברת את הבוחן 🎉"
                  : "סיימת את הבוחן 💪"}
              </h2>

              <p className="text-gray-300 mt-2">
                קיבלת {result.percentage}% — {result.score} מתוך{" "}
                {result.totalPoints || quiz.totalPoints || questions.length} נקודות.
              </p>
            </div>

            <div className="text-center bg-slate-950/60 border border-white/10 rounded-2xl px-6 py-4">
              <div className="text-4xl font-black text-yellow-400">
                {result.percentage}%
              </div>
              <div className="text-gray-400 text-sm mt-1">הציון שלך</div>
            </div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-black text-yellow-400">
                שאלות הבוחן
              </h2>

              <p className="text-gray-400 text-sm mt-1">
                עני על כל השאלות ולחצי על סיום בוחן.
              </p>
            </div>

            <div className="bg-slate-950/70 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-gray-300 h-fit">
              נענו {answeredCount}/{questions.length}
            </div>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden mb-6">
            <div
              className="bg-yellow-400 h-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {!questions.length ? (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-5 font-bold">
              אין שאלות בבוחן הזה.
            </div>
          ) : (
            <div className="space-y-5">
              {questions.map((question, index) => {
                const selectedAnswer = answers[index] || "";
                const answerResult = getAnswerResult(index);

                return (
                  <div
                    key={question._id || index}
                    className="bg-slate-950/60 border border-white/10 rounded-3xl p-5"
                  >
                    <div className="flex justify-between gap-3 mb-4">
                      <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                        שאלה {index + 1}
                      </span>

                      {result && answerResult && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black border ${
                            answerResult.isCorrect
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-red-500/10 text-red-300 border-red-500/30"
                          }`}
                        >
                          {answerResult.isCorrect ? "נכון ✓" : "לא נכון"}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-white leading-relaxed">
                      {question.question}
                    </h3>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(question.options || []).map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectAfterSubmit =
                          result && answerResult?.correctAnswer === option;
                        const isWrongSelectedAfterSubmit =
                          result &&
                          isSelected &&
                          answerResult &&
                          !answerResult.isCorrect;

                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={Boolean(result)}
                            onClick={() => handleSelectAnswer(index, option)}
                            className={`text-right rounded-2xl border p-4 font-bold transition-all disabled:cursor-default ${
                              isCorrectAfterSubmit
                                ? "bg-emerald-500/15 border-emerald-400 text-emerald-200"
                                : isWrongSelectedAfterSubmit
                                ? "bg-red-500/15 border-red-400 text-red-200"
                                : isSelected
                                ? "bg-yellow-400 text-slate-950 border-yellow-300"
                                : "bg-white/5 hover:bg-white/10 text-gray-200 border-white/10"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {result && answerResult && (
                      <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-gray-300 text-sm">
                          <span className="font-black text-white">
                            התשובה שלך:
                          </span>{" "}
                          {answerResult.userAnswer || "לא נענתה"}
                        </p>

                        <p className="text-gray-300 text-sm mt-2">
                          <span className="font-black text-emerald-300">
                            התשובה הנכונה:
                          </span>{" "}
                          {answerResult.correctAnswer}
                        </p>

                        {answerResult.explanation && (
                          <p className="text-gray-300 text-sm mt-3 leading-relaxed">
                            <span className="font-black text-yellow-300">
                              הסבר:
                            </span>{" "}
                            {answerResult.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!result && (
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                type="button"
                onClick={handleSubmitQuiz}
                disabled={submitting || !questions.length}
                className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-4 rounded-2xl transition-all"
              >
                {submitting ? "בודק את הבוחן..." : "סיימתי את הבוחן ✅"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
              >
                חזרה בלי הגשה
              </button>
            </div>
          )}
        </div>

        <aside className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit">
          <h2 className="text-xl font-black mb-4">📌 מידע על הבוחן</h2>

          <div className="space-y-3 text-sm">
            <InfoRow label="רמה" value={quiz.englishLevel || "לא צוינה"} />
            <InfoRow label="סוג" value={quiz.quizType || "mixed"} />
            <InfoRow label="מספר שאלות" value={questions.length} />
            <InfoRow label="ציון מעבר" value={`${quiz.passingScore || 70}%`} />
            <InfoRow
              label="משך"
              value={quiz.duration ? `${quiz.duration} דקות` : "לא צוין"}
            />
          </div>

          <div className="mt-6 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl p-4">
            <h3 className="font-bold text-indigo-300 mb-2">טיפ לפני הגשה:</h3>

            <p className="text-gray-300 text-sm leading-relaxed">
              עברי שוב על השאלות לפני הסיום. אחרי ההגשה תקבלי ציון, תשובות
              נכונות והסברים.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/10 pb-2">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-bold text-left">{value}</span>
    </div>
  );
}