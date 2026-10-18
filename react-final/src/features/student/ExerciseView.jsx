import useMessageNotice from "../../components/ui/useMessageNotice.js";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getExerciseById,
  submitExerciseAnswers,
  getLatestExerciseSubmission,
} from "../../services/exerciseService";
import AppFeedbackModal from "../../components/ui/AppFeedbackModal";
import ExerciseWorkspace from "./components/exercise/ExerciseWorkspace";
import ExerciseSidebar from "./components/exercise/ExerciseSidebar";
import { parseExercisePrompts } from "./components/exercise/parseExercisePrompts";

export default function ExerciseView() {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");

  const [exercise, setExercise] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);
  const [successOpen, setSuccessOpen] = useState(false);
  const [materialsOpen, setMaterialsOpen] = useState(false);

  const loadExercise = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getExerciseById(exerciseId);
      setExercise(data.exercise || data);
      setAnswers({});
      setResult(null);

      if (courseId) {
        try {
          const previous = await getLatestExerciseSubmission(
            exerciseId,
            courseId
          );

          if (previous) {
            setAnswers(
              Object.fromEntries(
                previous.answers.map((a, i) => [i, a.answer])
              )
            );
            setResult(previous);
          }
        } catch (error) {
          console.error("Could not restore answers:", error);
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercise();
  }, [exerciseId]);

  const { intro, prompts } = useMemo(() => {
    const fromDatabase = Array.isArray(exercise?.questions)
      ? exercise.questions
          .map((item) =>
            typeof item === "string"
              ? item
              : item?.prompt || item?.sentence || item?.question || ""
          )
          .map((q) => String(q).trim())
          .filter(Boolean)
      : [];

    if (fromDatabase.length) {
      return {
        intro: exercise.instructions || "",
        prompts: fromDatabase,
      };
    }

    // Support old exercises with numbered questions in instructions.
    const legacy = parseExercisePrompts(exercise?.instructions);
    const numbered =
      /(?:^|\n)\s*(?:\d{1,2}|[א-ת])[.)]\s+/.test(
        exercise?.instructions || ""
      );

    if (numbered || !exercise?.createdByAI) {
      return legacy;
    }

    // Never display introductory instructions as a fake question.
    return {
      intro: exercise?.instructions || "",
      prompts: [],
    };
  }, [exercise]);

  const handleAnswerChange = (index, value) => {
    if (result || saving) return;
    setAnswers((previous) => ({ ...previous, [index]: value }));
    setResult(null);
  };

  const handleCompleteExercise = async () => {
    // ENGLISHWISE_QUESTIONS_REQUIRED
    if (!prompts.length) {
      setMessage({
        type: "error",
        text: "לתרגיל הזה לא נשמרו שאלות. יש ליצור תרגיל חדש עם שאלות.",
      });
      return;
    }
    if (result || saving) return;
    if (!courseId) {
      setMessage({
        type: "error",
        text: "כדי לשמור התקדמות, פתחי את התרגיל מתוך הקורס שלך.",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      if (prompts.some((_, index) => !answers[index]?.trim())) {
        setMessage({
          type: "error",
          text: "מלאי תשובה לכל שאלה לפני השליחה.",
        });
        return;
      }

      const response = await submitExerciseAnswers(
        exerciseId,
        courseId,
        prompts.map((_, index) => answers[index])
      );

      setResult(response.attempt);
      setMessage({ type: "success", text: response.message });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <main
        className="flex min-h-[70vh] items-center justify-center text-white"
        dir="rtl"
      >
        <div className="rounded-[2rem] border border-white/28 bg-[#123c6b]/74 px-10 py-7 text-xl font-black shadow-[0_22px_60px_rgba(3,31,61,0.32)] backdrop-blur-xl">
          טוען את התרגיל...
        </div>
      </main>
    );
  }

  if (!exercise) {
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
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-red-300/35 bg-red-500/16 text-3xl">
              !
            </div>

            <h1 className="text-3xl font-black text-red-100">
              התרגיל לא נמצא
            </h1>

            <p className="mt-3 text-base font-bold leading-relaxed text-white/72">
              לא הצלחנו למצוא את התרגיל המבוקש.
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

        <button
          type="button"
          onClick={handleClose}
          className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white shadow-lg transition hover:bg-white/22"
          aria-label="סגירת תרגיל"
        >
          ×
        </button>

        <div className="relative z-10 p-4 md:p-5">
          <header className="mb-4 pl-14">
            <button
              type="button"
              onClick={handleClose}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-black text-white/82 transition hover:bg-white/16 hover:text-white"
            >
              <span>→</span>
              <span>חזרה לקורס</span>
            </button>

            <div className="mb-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-3 py-1 text-xs font-black text-[#ffe89a]">
                תרגיל
              </span>

              <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-black text-white/72">
                {exercise.type || "practice"}
              </span>
            </div>

            <h1
              className="text-2xl font-black leading-tight md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
              }}
            >
              {exercise.title || "תרגיל ללא כותרת"}
            </h1>

            <p className="mt-2 line-clamp-2 max-w-4xl text-sm font-bold leading-relaxed text-white/66">
              {exercise.description || "אין תיאור לתרגיל זה."}
            </p>
          </header>


          {!prompts.length && (
            <p
              className="mb-4 rounded-xl border border-red-300/40 bg-red-500/15 p-4 font-bold text-white"
              role="alert"
            >
              לתרגיל הזה לא נשמרו שאלות. המורה צריכה ליצור אותו מחדש.
            </p>
          )}

          {/* ENGLISHWISE_OLD_EXERCISE_WARNING */}
          <div className="grid gap-4 xl:grid-cols-[1.72fr_0.58fr]">
            <ExerciseWorkspace
              answers={answers}
              result={result}
              onAnswerChange={handleAnswerChange}
              saving={saving}
              intro={intro}
              prompts={prompts}
              onComplete={handleCompleteExercise}
              onClose={handleClose}
            />

            <ExerciseSidebar
              materials={exercise.materials || []}
              onOpenMaterials={() => setMaterialsOpen(true)}
            />
          </div>
        </div>
      </section>

      <AppFeedbackModal
        isOpen={successOpen}
        type="success"
        title="כל הכבוד!"
        message="התרגיל סומן כהושלם ונשמר בהתקדמות האישית שלך. עכשיו אפשר לחזור למסלול ולהמשיך לקרון הבא."
        primaryText="חזרה למסלול"
        secondaryText="להישאר כאן"
        onPrimary={() => navigate(-1)}
        onSecondary={() => setSuccessOpen(false)}
        onClose={() => setSuccessOpen(false)}
      />

      <AppFeedbackModal
        isOpen={materialsOpen}
        type="info"
        title="חומרי עזר"
        message={
          exercise.materials?.length
            ? exercise.materials
                .map((material, index) => `חומר עזר ${index + 1}: ${material}`)
                .join("\n")
            : "אין חומרי עזר מצורפים לתרגיל הזה."
        }
        primaryText="סגור"
        onPrimary={() => setMaterialsOpen(false)}
        onClose={() => setMaterialsOpen(false)}
      />
    </main>
  );
}