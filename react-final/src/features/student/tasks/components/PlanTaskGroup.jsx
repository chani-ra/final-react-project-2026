import { useState } from "react";
import { formatDate, getDifficultyColor, getDifficultyLabel } from "../taskFormatting";

export default function PlanTaskGroup({
  title,
  tasks,
  actionLoadingId,
  onComplete,
  onDelete,
}) {
  const firstTask = tasks[0];

  const [isOpen, setIsOpen] = useState(false);

  const completedCount = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const isSmartGuide =
    firstTask?.planSource === "smart_guide" ||
    tasks.some((task) =>
      task.title?.startsWith("מסלול חכם")
    );

  const sourceLabel = isSmartGuide
    ? "המדריך החכם"
    : "המאמן האישי";

  const totalXP = tasks.reduce(
    (sum, task) => sum + (task.rewardXP || 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-white/15 bg-white/5">
      <div className="border-b border-white/10 bg-slate-950/25 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-black text-yellow-300">
                {sourceLabel}
              </span>

              <span className="text-xs text-gray-400">
                {formatDate(firstTask?.createdAt)}
              </span>
            </div>

            <h2 className="mt-3 text-2xl font-black text-white">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-left">
              <div className="text-xs font-bold text-gray-400">
                {completedCount}/{tasks.length} הושלמו
              </div>

              <div className="mt-1 text-sm font-black text-yellow-400">
                +{totalXP} XP
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/20"
            >
              {isOpen ? "סגרי ▲" : "פתחי ▼"}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="divide-y divide-white/10">        {tasks.map((task, index) => {
          const isLoading =
            actionLoadingId === task._id;

          const smartGuideTitle =
            task.title?.match(
              /^מסלול חכם \d+:\s*(.+)$/u
            )?.[1];

          const isGenericTitle =
            /^שלב \d+$/u.test(task.title || "") ||
            /^משימת מאמן \d+$/u.test(
              task.title || ""
            ) ||
            /^משימת Coach \d+$/u.test(
              task.title || ""
            );

          const stepTitle =
            smartGuideTitle ||
            (isGenericTitle
              ? `שלב ${index + 1}`
              : task.title || `שלב ${index + 1}`);

          return (
            <div
              key={task._id}
              className="p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-slate-950">
                    {index + 1}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white">
                      {stepTitle}
                    </h3>

                    {task.description && (
                      <p className="mt-2 max-w-4xl text-sm leading-relaxed text-gray-300">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                      <span
                        className={`rounded-full border px-2.5 py-1 font-black ${getDifficultyColor(
                          task.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(
                          task.difficulty
                        )}
                      </span>

                      <span className="text-gray-400">
                        זמן:{" "}
                        {task.estimatedTime ||
                          "10 דקות"}
                      </span>

                      <span className="font-black text-yellow-400">
                        +{task.rewardXP || 0} XP
                      </span>

                      {task.dueDate && (
                        <span className="font-bold text-red-300">
                          עד:{" "}
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>

                    {task.status === "completed" &&
                      task.feedback && (
                        <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                          <strong>פידבק:</strong>{" "}
                          {task.feedback}
                        </div>
                      )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 md:flex-col">
                  {task.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          onComplete(task._id)
                        }
                        disabled={isLoading}
                        className="rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-black text-slate-900 transition hover:bg-yellow-400 disabled:opacity-60"
                      >
                        {isLoading
                          ? "מסמן..."
                          : "סמני כבוצע ✓"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onDelete(task._id)
                        }
                        disabled={isLoading}
                        className="text-xs font-bold text-red-300 hover:text-red-200"
                      >
                        מחיקה
                      </button>
                    </>
                  )}

                  {task.status === "completed" && (
                    <span className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-black text-emerald-300">
                      הושלם ✓
                    </span>
                  )}

                  {task.status === "review" && (
                    <span className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-xs font-black text-indigo-300">
                      נשלח לבדיקה
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </section>
  );
}
