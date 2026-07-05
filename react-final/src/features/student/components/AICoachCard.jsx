import React, { useEffect, useMemo, useState } from "react";
import {
  generateCoachPlan,
  getCoachHistory,
} from "../../../services/aiCoachService";
import { createManyTasks } from "../../../services/taskService";

export default function AICoachCard({ user }) {
  const [note, setNote] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);
  const [history, setHistory] = useState([]);
  const [studyMode, setStudyMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [savingTasks, setSavingTasks] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const username = user?.username || user?.name || "תלמידה";
  const level = user?.englishLevel || user?.level || "beginner";

  const fallbackPlan = useMemo(
    () => ({
      focus: "תרגול קצר וממוקד להיום",
      summary: `${username}, כדאי להתחיל ממשימה קטנה וברורה שמתאימה לרמה שלך.`,
      steps: [
        "בחרי 5 מילים חדשות וחזרי עליהן בקול.",
        "כתבי 3 משפטים קצרים עם המילים שבחרת.",
        "קראי את המשפטים וסמני דבר אחד לשיפור.",
      ],
      tip: "עדיף תרגול קצר וקבוע מאשר תוכנית ארוכה שקשה לבצע.",
      encouragement: "כל תרגול קטן מוסיף ביטחון באנגלית.",
      estimatedMinutes: 15,
    }),
    [username]
  );

  const planToShow = currentPlan || fallbackPlan;
  const steps = Array.isArray(planToShow?.steps) ? planToShow.steps : [];

  const progress =
    steps.length > 0
      ? Math.round((completedSteps.length / steps.length) * 100)
      : 0;

  const storageKey = useMemo(() => {
    const userId = user?._id || user?.id || "guest";
    const focus = planToShow?.focus || "coach-plan";
    return `ai-coach-progress-${userId}-${focus}`;
  }, [user, planToShow]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);

      const data = await getCoachHistory();
      const safeHistory = Array.isArray(data) ? data : [];

      setHistory(safeHistory);

      if (!currentPlan && safeHistory.length > 0) {
        setCurrentPlan(safeHistory[0].plan);
      }
    } catch (error) {
      console.error("Failed to load coach history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompletedSteps(saved ? JSON.parse(saved) : []);
    } catch {
      setCompletedSteps([]);
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedSteps));
  }, [completedSteps, storageKey]);

  const handleGeneratePlan = async () => {
    if (!note.trim()) {
      setMessage({
        type: "error",
        text: "כתבי במשפט קצר במה את רוצה עזרה היום.",
      });
      return;
    }

    try {
      setLoadingPlan(true);
      setMessage({ type: "", text: "" });
      setCompletedSteps([]);
      setStudyMode(false);

      const plan = await generateCoachPlan(note.trim());

      setCurrentPlan(plan);
      setNote("");

      setMessage({
        type: "success",
        text: "נבנתה לך תוכנית לימוד חדשה.",
      });

      await loadHistory();
    } catch (error) {
      setCurrentPlan(fallbackPlan);

      setMessage({
        type: "error",
        text:
          error?.toString() ||
          "לא הצלחנו לקבל תוכנית מה-AI, מוצגת תוכנית גיבוי.",
      });
    } finally {
      setLoadingPlan(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => {
      if (prev.includes(index)) {
        return prev.filter((item) => item !== index);
      }

      return [...prev, index];
    });
  };

  const handleSendToTasks = async () => {
    if (steps.length === 0) {
      setMessage({
        type: "error",
        text: "אין שלבים שאפשר להעביר למשימות.",
      });
      return;
    }

    try {
      setSavingTasks(true);
      setMessage({ type: "", text: "" });

      const tasks = steps.map((step, index) => ({
        title: `משימת מאמן ${index + 1}`,
        description: step,
        type: "coach_task",
        source: "ai_coach",
        difficulty: "Easy",
        estimatedTime: "10 דקות",
        rewardXP: 50,
        coachPlanFocus: planToShow.focus || "תוכנית אישית",
      }));

      await createManyTasks({
        tasks,
        coachPlanFocus: planToShow.focus || "תוכנית אישית",
      });

      setMessage({
        type: "success",
        text: "התוכנית נוספה למסך המשימות שלך.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setSavingTasks(false);
    }
  };

  const selectHistoryPlan = (item) => {
    setCurrentPlan(item.plan);
    setStudyMode(false);
    setCompletedSteps([]);

    setMessage({
      type: "success",
      text: "נטענה תוכנית קודמת.",
    });
  };

  return (
    <section className="space-y-5 text-white" dir="rtl">
      <div
        className="rounded-[2rem] border-2 border-white/18 bg-slate-950/60 p-5 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="space-y-4">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100">
                ai coach
              </div>

              <h2
                className="text-3xl font-black leading-tight text-white"
                style={{
                  textShadow:
                    "2px 2px 0 rgba(184,50,42,0.40), -1px -1px 0 rgba(15,76,117,0.90)",
                }}
              >
                מאמן אישי
              </h2>

              <p className="mt-2 text-sm font-semibold leading-7 text-white/62">
                כתבי במה את צריכה עזרה, והמאמן יבנה תוכנית קצרה וברורה להיום.
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
              <div className="text-[11px] font-black text-white/42">
                רמת לימוד
              </div>

              <div className="mt-1 text-lg font-black text-yellow-100">
                {getLevelLabel(level)}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/12 bg-slate-950/45 p-4">
              <label className="mb-2 block text-sm font-black text-white">
                במה תרצי להתמקד היום?
              </label>

              <textarea
                rows="5"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="לדוגמה: קשה לי לזכור מילים / אני רוצה לתרגל כתיבה / אני לא יודעת מה ללמוד היום..."
                className="w-full resize-none rounded-[1.1rem] border-2 border-white/14 bg-white/10 p-4 text-sm font-semibold leading-7 text-white outline-none transition placeholder:text-white/30 focus:border-yellow-300/70"
              />

              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={loadingPlan}
                className="mt-3 w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  boxShadow: loadingPlan
                    ? "none"
                    : "0 6px 0 rgba(89,15,20,0.42)",
                }}
              >
                {loadingPlan ? "בונה תוכנית..." : "בני לי תוכנית"}
              </button>
            </div>

            <HistoryPanel
              loading={loadingHistory}
              history={history}
              onSelect={selectHistoryPlan}
            />
          </aside>

          <main className="space-y-4">
            {message.text && <MessageBox message={message} />}

            <PlanCard
              plan={planToShow}
              steps={steps}
              studyMode={studyMode}
              completedSteps={completedSteps}
              progress={progress}
              onStart={() => {
                setStudyMode(true);
                setMessage({
                  type: "success",
                  text: "מצב לימוד הופעל. סמני שלבים שביצעת.",
                });
              }}
              onReset={() => {
                setCompletedSteps([]);
                setMessage({
                  type: "success",
                  text: "ההתקדמות אופסה.",
                });
              }}
              onToggleStep={toggleStep}
              onSendToTasks={handleSendToTasks}
              savingTasks={savingTasks}
            />
          </main>
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  steps,
  studyMode,
  completedSteps,
  progress,
  onStart,
  onReset,
  onToggleStep,
  onSendToTasks,
  savingTasks,
}) {
  return (
    <section className="rounded-[1.8rem] border-2 border-white/14 bg-slate-950/45 p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-xs font-black text-yellow-100">
            המיקוד להיום
          </div>

          <h3 className="mt-1 text-2xl font-black text-white">
            {plan?.focus || "תרגול קצר להיום"}
          </h3>

          {plan?.summary && (
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/60">
              {plan.summary}
            </p>
          )}
        </div>

        <div className="rounded-[1.2rem] border border-yellow-300/30 bg-yellow-300/12 px-5 py-3 text-center">
          <div className="text-[11px] font-black text-yellow-100">
            זמן משוער
          </div>

          <div className="text-xl font-black text-white">
            {plan?.estimatedMinutes || 15} דק׳
          </div>
        </div>
      </div>

      {studyMode && (
        <div className="mt-5 rounded-[1.2rem] border border-white/12 bg-white/8 p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-black">
            <span className="text-white/55">התקדמות</span>
            <span className="text-yellow-100">{progress}%</span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-yellow-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-5 space-y-3">
        {steps.map((step, index) => {
          const done = completedSteps.includes(index);

          return (
            <button
              key={`${step}-${index}`}
              type="button"
              onClick={() => studyMode && onToggleStep(index)}
              className={`flex w-full items-start gap-3 rounded-[1.25rem] border p-4 text-right transition ${
                done
                  ? "border-emerald-300/35 bg-emerald-300/12"
                  : "border-white/10 bg-white/8 hover:bg-white/12"
              } ${studyMode ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  done
                    ? "bg-emerald-300 text-slate-950"
                    : "bg-yellow-300 text-slate-950"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>

              <span className="text-sm font-semibold leading-7 text-white/72">
                {step}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {!studyMode ? (
          <button
            type="button"
            onClick={onStart}
            className="rounded-full border-2 border-yellow-300/50 bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:brightness-110"
          >
            התחילי מצב לימוד
          </button>
        ) : (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border-2 border-white/16 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16"
          >
            איפוס התקדמות
          </button>
        )}

        <button
          type="button"
          onClick={onSendToTasks}
          disabled={savingTasks}
          className="rounded-full border-2 border-white/16 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {savingTasks ? "שומר..." : "העברה למשימות"}
        </button>
      </div>

      {(plan?.tip || plan?.encouragement) && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {plan?.tip && (
            <SmallNote title="טיפ קצר" text={plan.tip} tone="yellow" />
          )}

          {plan?.encouragement && (
            <SmallNote title="עידוד" text={plan.encouragement} tone="red" />
          )}
        </div>
      )}
    </section>
  );
}

function HistoryPanel({ loading, history, onSelect }) {
  return (
    <div className="rounded-[1.4rem] border border-white/12 bg-white/8 p-4">
      <h3 className="text-lg font-black text-white">תוכניות קודמות</h3>

      <div className="mt-3 max-h-[260px] space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <div className="rounded-[1.1rem] border border-white/12 bg-slate-950/45 p-4 text-sm font-black text-white/55">
            טוען היסטוריה...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-[1.1rem] border border-white/12 bg-slate-950/45 p-4 text-sm font-semibold leading-6 text-white/55">
            עדיין אין תוכניות קודמות.
          </div>
        ) : (
          history.slice(0, 6).map((item, index) => (
            <button
              key={item._id || `${item.createdAt}-${index}`}
              type="button"
              onClick={() => onSelect(item)}
              className="w-full rounded-[1.1rem] border border-white/12 bg-slate-950/45 p-3 text-right transition hover:border-yellow-300/45 hover:bg-white/12"
            >
              <div className="line-clamp-1 text-sm font-black text-white">
                {item.plan?.focus || "תוכנית אישית"}
              </div>

              <div className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-white/45">
                {item.note || item.plan?.summary || "ללא הערה"}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function SmallNote({ title, text, tone }) {
  const className =
    tone === "yellow"
      ? "border-yellow-300/30 bg-yellow-300/12 text-yellow-100"
      : "border-red-300/30 bg-red-500/15 text-red-100";

  return (
    <div className={`rounded-[1.2rem] border p-4 ${className}`}>
      <div className="text-xs font-black">{title}</div>

      <p className="mt-1 text-sm font-semibold leading-7 text-white/70">
        {text}
      </p>
    </div>
  );
}

function MessageBox({ message }) {
  const className =
    message.type === "success"
      ? "border-emerald-300/35 bg-emerald-300/12 text-emerald-100"
      : "border-red-300/35 bg-red-500/15 text-red-100";

  return (
    <div
      className={`rounded-[1.2rem] border px-4 py-3 text-sm font-black ${className}`}
    >
      {message.text}
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