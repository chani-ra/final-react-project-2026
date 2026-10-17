import { useEffect, useMemo, useState } from "react";
import { completeTask, deleteTask, getMyTasks, submitTaskForReview } from "../../../services/taskService";
import { getTaskProgress, getTaskStats, getVisibleTasks, groupTasks } from "./taskSelectors";

/** Owns server state and actions; the view remains presentational. */
export function useTasks() {
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

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const filteredTasks = useMemo(() => getVisibleTasks(tasks, activeTab), [tasks, activeTab]);
  const displayItems = useMemo(() => groupTasks(filteredTasks), [filteredTasks]);
  const progressPercent = useMemo(() => getTaskProgress(tasks, stats), [tasks, stats]);

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

  return {
    activeTab,
    setActiveTab,
    stats,
    displayItems,
    progressPercent,
    loading,
    actionLoadingId,
    message,
    handleCompleteTask,
    handleSubmitForReview,
    handleDeleteTask,
  };
}
