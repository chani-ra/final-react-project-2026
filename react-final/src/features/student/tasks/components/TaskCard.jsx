import { DarkSpinner, SmallSpinner, SourceBadge } from "./taskUi";
import { formatDate, getDifficultyColor, getDifficultyLabel } from "../taskFormatting";

export default function TaskCard({
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
