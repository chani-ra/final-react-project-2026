import React, { useEffect, useMemo, useState } from "react";
import {
  completeTask,
  deleteTask,
  getMyTasks,
  submitTaskForReview,
} from "../../services/taskService";
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("pending");
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const pending = tasks.filter((task) => task.status === "pending").length;
    const review = tasks.filter((task) => task.status === "review").length;
    const completed = tasks.filter((task) => task.status === "completed").length;

    const availableXP = tasks
      .filter((task) => task.status === "pending")
      .reduce((acc, task) => acc + (task.rewardXP || 0), 0);

    return {
      pending,
      review,
      completed,
      total: tasks.length,
      availableXP,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => task.status === activeTab);
  }, [tasks, activeTab]);

  const progressPercent = useMemo(() => {
    if (tasks.length === 0) return 0;
    return Math.round((stats.completed / tasks.length) * 100);
  }, [tasks.length, stats.completed]);

  const handleCompleteTask = async (taskId) => {
    try {
      setActionLoadingId(taskId);

      const updatedTask = await completeTask(taskId);

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );

      setMessage({
        type: "success",
        text: "המשימה סומנה כבוצעה. כל הכבוד!",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const handleSubmitForReview = async (taskId) => {
    try {
      setActionLoadingId(taskId);

      const updatedTask = await submitTaskForReview(taskId);

      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? updatedTask : task))
      );

      setMessage({
        type: "success",
        text: "המשימה נשלחה לבדיקה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setActionLoadingId(taskId);

      await deleteTask(taskId);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));

      setMessage({
        type: "success",
        text: "המשימה נמחקה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.5rem] border-2 border-white/25 bg-slate-950/65 p-6 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
                מרכז המשימות
              </div>

              <h1
                className="text-4xl font-black leading-tight text-white md:text-5xl"
                style={{
                  textShadow:
                    "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
                }}
              >
                המשימות שלי
              </h1>

              <p className="mt-3 max-w-3xl text-base font-semibold leading-8 text-white/68">
                כאן מרוכזות המשימות שלך: משימות מהמורה, משימות אישיות
                ומשימות מהמאמן החכם. כל משימה מקבלת סטטוס ברור כדי שתדעי
                בדיוק מה מחכה לביצוע ומה כבר התקדם.
              </p>
            </div>

            <div className="grid min-w-full grid-cols-2 gap-3 md:grid-cols-4 xl:min-w-[420px]">
              <StatBox label="לביצוע" value={stats.pending} tone="yellow" />
              <StatBox label="בבדיקה" value={stats.review} tone="blue" />
              <StatBox label="הושלמו" value={stats.completed} tone="green" />
              <StatBox label="XP זמין" value={stats.availableXP} tone="red" />
            </div>
          </div>

          <div className="mt-7">
            <div className="mb-2 flex justify-between text-sm font-black text-white/66">
              <span>התקדמות כללית במשימות</span>
              <span className="text-yellow-100">{progressPercent}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.45)] transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-[1.7rem] border-2 px-5 py-4 text-sm font-black shadow-xl ${
            message.type === "success"
              ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
              : "border-red-300/35 bg-red-500/15 text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

        <div className="relative z-10">
          <div className="mb-5 flex flex-wrap gap-3">
            <TabButton
              label="לביצוע"
              count={stats.pending}
              active={activeTab === "pending"}
              onClick={() => setActiveTab("pending")}
            />

            <TabButton
              label="בבדיקה"
              count={stats.review}
              active={activeTab === "review"}
              onClick={() => setActiveTab("review")}
            />

            <TabButton
              label="הושלמו"
              count={stats.completed}
              active={activeTab === "completed"}
              onClick={() => setActiveTab("completed")}
            />
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredTasks.length === 0 ? (
            <EmptyTasks activeTab={activeTab} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  isLoading={actionLoadingId === task._id}
                  onComplete={() => handleCompleteTask(task._id)}
                  onSubmitForReview={() => handleSubmitForReview(task._id)}
                  onDelete={() => handleDeleteTask(task._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function TaskCard({
  task,
  isLoading,
  onComplete,
  onSubmitForReview,
  onDelete,
}) {
  const isTeacherTask =
    task.source === "teacher" ||
    task.type === "teacher_task" ||
    task.type === "exercise";

  return (
    <article
      className="relative overflow-hidden rounded-[2rem] border-2 border-white/18 bg-white/10 p-5 text-white transition hover:border-yellow-300/38 hover:bg-white/13 md:p-6"
      style={{
        boxShadow:
          "0 18px 55px rgba(3,31,61,0.24), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/7 to-transparent" />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <SourceBadge source={task.source} type={task.type} />

            <span
              className={`rounded-full border px-3 py-1 text-xs font-black ${getDifficultyColor(
                task.difficulty
              )}`}
            >
              {getDifficultyLabel(task.difficulty)}
            </span>

            <span className="rounded-full border border-white/14 bg-white/8 px-3 py-1 text-xs font-black text-white/62">
              זמן: {task.estimatedTime || "10 דקות"}
            </span>

            <span className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-100">
              +{task.rewardXP || 0} XP
            </span>
          </div>

          <h3 className="text-2xl font-black leading-tight text-white">
            {task.title}
          </h3>

          {task.description && (
            <p className="text-base font-semibold leading-8 text-white/68">
              {task.description}
            </p>
          )}

          {task.coachPlanFocus && (
            <div className="rounded-[1.4rem] border border-yellow-300/30 bg-yellow-300/12 p-4 text-sm font-bold leading-7 text-yellow-100">
              מתוך תוכנית המאמן: {task.coachPlanFocus}
            </div>
          )}

          {task.status === "completed" && task.feedback && (
            <div className="rounded-[1.4rem] border border-emerald-300/30 bg-emerald-400/12 p-4 text-sm font-bold leading-7 text-emerald-100">
              פידבק: {task.feedback}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 border-t border-white/10 pt-4 md:w-auto md:min-w-[190px] md:border-none md:pt-0">
          {task.status === "pending" && (
            <>
              {task.dueDate && (
                <span className="text-center text-xs font-black text-red-100 md:text-right">
                  עד: {formatDate(task.dueDate)}
                </span>
              )}

              {isTeacherTask ? (
                <button
                  type="button"
                  onClick={onSubmitForReview}
                  disabled={isLoading}
                  className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    boxShadow: isLoading
                      ? "none"
                      : "0 6px 0 rgba(89,15,20,0.42)",
                  }}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <SmallSpinner />
                      שולח...
                    </span>
                  ) : (
                    "שלחי לבדיקה"
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onComplete}
                  disabled={isLoading}
                  className="rounded-full border-2 border-yellow-300/70 bg-yellow-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:brightness-105 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <DarkSpinner />
                      מסמן...
                    </span>
                  ) : (
                    "סמני כבוצע"
                  )}
                </button>
              )}

              {task.source !== "teacher" && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isLoading}
                  className="rounded-full border border-red-300/30 bg-red-500/12 px-5 py-2 text-xs font-black text-red-100 transition hover:bg-red-500/22 disabled:opacity-60"
                >
                  מחיקה
                </button>
              )}
            </>
          )}

          {task.status === "review" && (
            <div className="space-y-3 text-center md:text-right">
              <span className="block text-xs font-bold text-white/50">
                הוגש ב: {formatDate(task.submittedAt)}
              </span>

              <span className="inline-flex rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100">
                נשלח לבדיקה
              </span>
            </div>
          )}

          {task.status === "completed" && (
            <div className="rounded-[1.6rem] border border-emerald-300/28 bg-emerald-400/12 p-4 text-center">
              <span className="block text-xs font-bold text-white/50">
                {task.grade !== null && task.grade !== undefined
                  ? "ציון סופי"
                  : "סטטוס"}
              </span>

              <span className="mt-1 block text-4xl font-black text-emerald-100">
                {task.grade !== null && task.grade !== undefined
                  ? task.grade
                  : "✓"}
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function StatBox({ label, value, tone }) {
  const toneClasses = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return (
    <div
      className={`rounded-[1.55rem] border-2 p-4 text-center ${
        toneClasses[tone] || toneClasses.yellow
      }`}
    >
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-black opacity-75">{label}</div>
    </div>
  );
}

function TabButton({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-5 py-3 text-sm font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_24px_rgba(253,224,71,0.25)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function SourceBadge({ source, type }) {
  const config = getSourceConfig(source, type);

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function getSourceConfig(source, type) {
  if (source === "ai_coach" || type === "coach_task") {
    return {
      label: "coach",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    };
  }

  if (source === "teacher" || type === "teacher_task" || type === "exercise") {
    return {
      label: "מורה",
      className: "border-red-300/35 bg-red-500/15 text-red-100",
    };
  }

  if (type === "lesson") {
    return {
      label: "שיעור",
      className: "border-sky-300/35 bg-sky-300/12 text-sky-100",
    };
  }

  if (type === "song") {
    return {
      label: "שיר",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    };
  }

  return {
    label: "אישי",
    className: "border-white/18 bg-white/10 text-white/70",
  };
}

function getDifficultyColor(diff) {
  const colors = {
    Easy: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    Medium: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    Hard: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return colors[diff] || "border-white/18 bg-white/10 text-white/70";
}

function getDifficultyLabel(diff) {
  const labels = {
    Easy: "קל",
    Medium: "בינוני",
    Hard: "קשה",
  };

  return labels[diff] || "רגיל";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function EmptyTasks({ activeTab }) {
  const textByTab = {
    pending: "אין כרגע משימות לביצוע. אפשר לבקש מהמאמן האישי לבנות סדר לימוד.",
    review: "אין משימות שממתינות לבדיקה.",
    completed: "עדיין אין משימות שהושלמו.",
  };

  return (
    <div className="rounded-[2rem] border-2 border-dashed border-white/20 bg-white/8 p-10 text-center">
      <h3 className="text-2xl font-black text-white">אין משימות כאן כרגע</h3>

      <p className="mt-3 text-base font-semibold leading-8 text-white/60">
        {textByTab[activeTab] || "אין משימות בקטגוריה זו כרגע."}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-5 text-lg font-black text-white">
          טוען את המשימות שלך...
        </p>
      </div>
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}

function DarkSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/25 border-t-slate-950" />
  );
}