import useMessageNotice from "../../../components/ui/useMessageNotice.js";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useCourseReturn from "../../general/navigation/useCourseReturn.js";
import DetailHeaderActions from "../../../components/ui/DetailHeaderActions.jsx";
import { getQuizById, submitQuiz } from "../../../services/quizService";
import AppFeedbackModal from "../../../components/ui/AppFeedbackModal";
import QuizQuestionCard from "./QuizQuestionCard";

export default function QuizView() {
  const { quizId } = useParams();
  const location = useLocation();
  const courseId = new URLSearchParams(location.search).get("courseId");
  return <QuizDetails key={`${quizId}:${courseId || ""}`} quizId={quizId} courseId={courseId} />;
}

function QuizDetails({ quizId, courseId }) {
  const { goBack, returnLabel } = useCourseReturn("quizzes");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message.type === "error" ? message : null);
  const [resultOpen, setResultOpen] = useState(false);

  const questions = quiz?.questions || [];

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((answer) => answer !== "").length;
  }, [answers]);

  const progressPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  useEffect(() => {
    let active = true;
    getQuizById(quizId, courseId)
      .then((data) => {
        if (!active) return;
        setQuiz(data.quiz || data);
        setAnswers({});
        setResult(null);
      })
      .catch((error) => {
        if (active) setMessage({
          type: "error",
          text: error?.response?.data?.message || error.toString(),
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
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
      setResultOpen(true);

      setMessage({
        type: "success",
        text: data.message || "הבוחן הוגש בהצלחה. המשוב מופיע ליד כל שאלה.",
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

  const handleClose = goBack;

  if (loading) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את הבוחן...
        </div>
      </main>
    );
  }

  if (!quiz) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-6" dir="rtl">
        <div className="relative overflow-hidden rounded-[2.4rem] border border-red-300/35 bg-[#123c6b]/78 p-7 text-white shadow-[0_28px_80px_rgba(3,31,61,0.38)] backdrop-blur-xl">
          <button
            type="button"
            onClick={handleClose}
            className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white transition hover:bg-white/22"
            aria-label="סגירה"
          >
            ×
          </button>

          <div className="max-w-2xl">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-red-300/35 bg-red-500/16 text-3xl font-black">
              !
            </div>

            <h1 className="text-3xl font-black text-red-100">
              הבוחן לא נמצא
            </h1>

            <p className="mt-3 text-base font-bold leading-relaxed text-white/72">
              לא הצלחנו למצוא את הבוחן המבוקש.
            </p>

            <button
              type="button"
              onClick={handleClose}
              className="mt-7 rounded-full bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-7 py-3 font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
            >
              חזרה לקורס
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <div className="relative z-10 p-4 md:p-5">
          <header className="mb-4">
            <DetailHeaderActions onBack={handleClose} onClose={handleClose} backLabel={returnLabel} />

            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-3 py-1 text-xs font-black text-[#ffe89a]">
                בוחן אמריקאי
              </span>

              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-black text-white/72">
                {quiz.quizType || "multiple choice"}
              </span>

              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-black text-white/72">
                {questions.length} שאלות
              </span>
            </div>

            <h1
              className="text-2xl font-black leading-tight md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
              }}
            >
              {quiz.title || "בוחן ללא כותרת"}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-4xl text-sm font-bold leading-relaxed text-white/66">
              {quiz.description ||
                "זהו בוחן אמריקאי. קראי כל שאלה ולחצי על התשובה הנכונה ביותר."}
            </p>
          </header>


          <div className="grid gap-4 xl:grid-cols-[1.72fr_0.58fr]">
            <section className="overflow-hidden rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <QuizProgress
                answeredCount={answeredCount}
                totalQuestions={questions.length}
                progressPercent={progressPercent}
                result={result}
              />

              <div className="mb-5 rounded-[1.6rem] border-2 border-[#ffd439]/38 bg-[#ffd439]/18 px-5 py-4 text-lg font-bold leading-9 text-[#fff3b0] shadow-[0_0_24px_rgba(255,212,57,0.16)]">
                זהו בוחן אמריקאי. בכל שאלה לחצי על התשובה הנכונה ביותר.
                לאחר ההגשה יוצג משוב מלא: התשובה שלך, התשובה הנכונה והסבר.
              </div>
              {!questions.length ? (
                <div className="rounded-[1.5rem] border border-red-300/30 bg-red-500/16 p-5 text-sm font-black text-red-100">
                  אין שאלות בבוחן הזה.
                </div>
              ) : (
                <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {questions.map((question, index) => (
                    <QuizQuestionCard
                      key={question._id || index}
                      question={question}
                      index={index}
                      selectedAnswer={answers[index] || ""}
                      answerResult={getAnswerResult(index)}
                      result={result}
                      onSelect={handleSelectAnswer}
                    />
                  ))}
                </div>
              )}

              {!result && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={submitting || !questions.length}
                    className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-3 text-sm font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                  >
                    {submitting ? "בודק את הבוחן..." : "סיימתי את הבוחן"}
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16"
                  >
                    חזרה בלי הגשה
                  </button>
                </div>
              )}
            </section>

            <QuizSidebar
              quiz={quiz}
              questions={questions}
              answeredCount={answeredCount}
              progressPercent={progressPercent}
              result={result}
            />
          </div>
        </div>
      </section>

      <AppFeedbackModal
        isOpen={resultOpen}
        type={result?.passed ? "success" : "warning"}
        title={getResultTitle(result)}
        message={getResultMessage(result, quiz, questions)}
        primaryText="חזרה למסלול"
        secondaryText="לצפות במשוב"
        onPrimary={handleClose}
        onSecondary={() => setResultOpen(false)}
        onClose={() => setResultOpen(false)}
      />
    </main>
  );
}

function QuizProgress({ answeredCount, totalQuestions, progressPercent, result }) {
  return (
    <div className="mb-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black">שאלות הבוחן</h2>
          <p className="text-[11px] font-bold text-white/55">
            {result
              ? "הבוחן נבדק. המשוב מופיע מתחת לכל שאלה."
              : "זהו בוחן אמריקאי. לחצי על התשובה הנכונה."}
          </p>
        </div>

        <div className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-[11px] font-black text-white/70">
          {answeredCount}/{totalQuestions} נענו
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/16">
        <div
          className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function QuizSidebar({ quiz, questions, answeredCount, progressPercent, result }) {
  return (
    <aside className="space-y-3">
      {result && (
        <div
          className={`rounded-[1.7rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl ${result.passed
              ? "border-emerald-300/40 bg-emerald-500/24 shadow-[0_0_24px_rgba(52,211,153,0.22)]"
              : "border-[#ffd439]/38 bg-[#ffd439]/18"
            }`}
        >
          <div className="text-xs font-bold text-white/70">הציון שלך</div>

          <div className="mt-1 text-4xl font-black text-white">
            {result.percentage}%
          </div>

          <div className="mt-2 text-xs font-bold text-white/75">
            {result.score} מתוך{" "}
            {result.totalPoints || quiz.totalPoints || questions.length} נקודות
          </div>
        </div>
      )}

      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-lg font-black">מידע על הבוחן</h2>

        <div className="mt-3 space-y-2">
          <InfoRow label="סוג" value="בוחן אמריקאי" />
          <InfoRow label="רמה" value={quiz.englishLevel || "לא צוינה"} />
          <InfoRow label="שאלות" value={questions.length} />
          <InfoRow label="מעבר" value={`${quiz.passingScore || 70}%`} />
          <InfoRow
            label="משך"
            value={quiz.duration ? `${quiz.duration} דקות` : "לא צוין"}
          />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h2 className="text-lg font-black text-white">הנחיה</h2>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/74">
          זהו בוחן אמריקאי. בכל שאלה לחצי על התשובה הנכונה ביותר. אחרי ההגשה
          תקבלי משוב מלא לכל שאלה.
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white/56">התקדמות</div>
          <div className="text-xs font-black text-white/72">
            {answeredCount}/{questions.length}
          </div>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/16">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-3 py-2">
      <span className="text-xs font-bold text-white/54">{label}</span>
      <span className="text-xs font-black text-white">{value}</span>
    </div>
  );
}

function getResultTitle(result) {
  if (!result) return "הבוחן נשלח";

  if (result.passed) return "כל הכבוד!";

  return "הבוחן נשלח";
}

function getResultMessage(result, quiz, questions) {
  if (!result) {
    return "הבוחן נשלח ונשמר בהתקדמות האישית שלך.";
  }

  const total = result.totalPoints || quiz?.totalPoints || questions.length;

  return `הבוחן נשלח ונשמר בהתקדמות האישית שלך. הציון שלך: ${result.percentage}%, ${result.score} מתוך ${total} נקודות. המשוב המלא מופיע מתחת לכל שאלה.`;
}