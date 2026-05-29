import React, { useEffect, useMemo, useState } from "react";
import {
  completeTask,
  deleteTask,
  getMyTasks,
  submitTaskForReview,
} from "../../services/taskService";

export default function Tasks() {
  const [activeTab, setActiveTab] = useState("pending");
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // טעינת המשימות מהשרת
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

  // סימון משימת Coach או משימה אישית כבוצעה
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

  // שליחת משימת מורה לבדיקה
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

  // מחיקת משימה אישית
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
      <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <div className="flex flex-col xl:flex-row justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              📝 המשימות שלי
            </h1>

            <p className="text-gray-400 text-sm mt-2 max-w-3xl">
              כאן מרוכזות משימות מהמורה, משימות מהמאמן האישי ומשימות לימוד
              כלליות. משימות Coach הן אישיות שלך, ומשימות מורה יכולות להישלח
              לבדיקה.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[360px]">
            <StatBox label="לביצוע" value={stats.pending} color="text-yellow-400" />
            <StatBox label="בבדיקה" value={stats.review} color="text-indigo-400" />
            <StatBox label="הושלמו" value={stats.completed} color="text-emerald-400" />
            <StatBox label="XP זמין" value={stats.availableXP} color="text-orange-400" />
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-xs mb-2 font-semibold text-gray-400">
            <span>התקדמות כללית במשימות</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="h-2 bg-slate-950/70 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
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

      <div className="flex border-b border-white/10 gap-2 overflow-x-auto">
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
        <div className="min-h-[40vh] flex items-center justify-center text-white font-bold text-xl">
          <div className="animate-pulse">טוען משימות... 📝</div>
        </div>
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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/20 transition-all">
      <div className="space-y-3 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={task.source} type={task.type} />

          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${getDifficultyColor(
              task.difficulty
            )}`}
          >
            {getDifficultyLabel(task.difficulty)}
          </span>

          <span className="text-xs text-gray-400">
            ⏱️ {task.estimatedTime || "10 דקות"}
          </span>

          <span className="text-xs text-yellow-500 font-black">
            ✨ +{task.rewardXP || 0} XP
          </span>
        </div>

        <h3 className="text-xl font-black">{task.title}</h3>

        {task.description && (
          <p className="text-gray-400 text-sm leading-relaxed">
            {task.description}
          </p>
        )}

        {task.coachPlanFocus && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 p-3 rounded-xl text-xs font-bold">
            🤖 מתוך תוכנית המאמן: {task.coachPlanFocus}
          </div>
        )}

        {task.status === "completed" && task.feedback && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-xs">
            <strong>💡 פידבק:</strong> {task.feedback}
          </div>
        )}
      </div>

      <div className="w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t border-white/5 md:border-none pt-4 md:pt-0">
        {task.status === "pending" && (
          <>
            {task.dueDate && (
              <span className="text-xs text-red-400 font-bold">
                ⏰ עד: {formatDate(task.dueDate)}
              </span>
            )}

            {isTeacherTask ? (
              <button
                type="button"
                onClick={onSubmitForReview}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-black px-6 py-2.5 rounded-xl transition-all text-sm shadow-md w-full md:w-auto"
              >
                {isLoading ? "שולח..." : "שלחי לבדיקה"}
              </button>
            ) : (
              <button
                type="button"
                onClick={onComplete}
                disabled={isLoading}
                className="bg-yellow-500 text-slate-900 font-black px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition-all text-sm shadow-md w-full md:w-auto disabled:opacity-60"
              >
                {isLoading ? "מסמן..." : "סמני כבוצע ✓"}
              </button>
            )}

            {task.source !== "teacher" && (
              <button
                type="button"
                onClick={onDelete}
                disabled={isLoading}
                className="text-xs text-red-300 hover:text-red-200 font-bold"
              >
                מחיקה
              </button>
            )}
          </>
        )}

        {task.status === "review" && (
          <>
            <span className="text-xs text-gray-400">
              הוגש ב: {formatDate(task.submittedAt)}
            </span>

            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-xl text-xs font-black">
              ⏳ נשלח לבדיקה
            </span>
          </>
        )}

        {task.status === "completed" && (
          <div className="text-center md:text-left">
            <span className="text-xs text-gray-400 block mb-1">
              {task.grade !== null && task.grade !== undefined ? "ציון סופי" : "סטטוס"}
            </span>

            <span className="text-3xl font-black text-emerald-400">
              {task.grade !== null && task.grade !== undefined ? task.grade : "✓"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, color = "text-white" }) {
  return (
    <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 text-center">
      <div className={`text-2xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function TabButton({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pb-3 px-4 font-bold text-sm transition-all relative shrink-0 ${
        active ? "text-yellow-400" : "text-gray-400 hover:text-white"
      }`}
    >
      {label} ({count})
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
      )}
    </button>
  );
}

function SourceBadge({ source, type }) {
  const config = getSourceConfig(source, type);

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function getSourceConfig(source, type) {
  if (source === "ai_coach" || type === "coach_task") {
    return {
      label: "🤖 Coach",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };
  }

  if (source === "teacher" || type === "teacher_task" || type === "exercise") {
    return {
      label: "👩‍🏫 מורה",
      className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };
  }

  if (type === "lesson") {
    return {
      label: "🎬 שיעור",
      className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    };
  }

  if (type === "song") {
    return {
      label: "🎵 שיר",
      className: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    };
  }

  return {
    label: "📝 אישי",
    className: "bg-white/10 text-gray-300 border-white/10",
  };
}

function getDifficultyColor(diff) {
  const colors = {
    Easy: "bg-green-500/10 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    Hard: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return colors[diff] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
    <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
      <span className="text-5xl block mb-3">🎉</span>

      <p className="text-gray-400 font-bold">
        {textByTab[activeTab] || "אין משימות בקטגוריה זו כרגע."}
      </p>
    </div>
  );
}