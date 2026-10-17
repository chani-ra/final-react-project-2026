/** Pure selectors for the student's tasks page. No React or API dependencies. */
export function getTaskStats(tasks) {
  const pending = tasks.filter((task) => task.status === "pending").length;
  const review = tasks.filter((task) => task.status === "review").length;
  const completed = tasks.filter((task) => task.status === "completed").length;

  const availableXP = tasks
    .filter((task) => task.status === "pending")
    .reduce((acc, task) => acc + (task.rewardXP || 0), 0);

  return { pending, review, completed, total: tasks.length, availableXP };
}

export function getVisibleTasks(tasks, activeTab) {
  return tasks.filter((task) => task.status === activeTab);
}

/** Keep both new planGroupId and the historical five-second grouping behavior. */
export function groupTasks(filteredTasks) {
  const groups = new Map();
  const items = [];

  filteredTasks.forEach((task) => {
    const isAiPlanTask = task.source === "ai_coach" || task.type === "coach_task";
    const groupKey = isAiPlanTask
      ? task.planGroupId || getLegacyPlanGroupKey(task)
      : "";

    if (!groupKey) {
      items.push({ kind: "task", key: task._id, task });
      return;
    }

    let group = groups.get(groupKey);
    if (!group) {
      group = {
        kind: "plan",
        key: groupKey,
        title: task.planTitle || task.coachPlanFocus || "תוכנית לימוד אישית",
        tasks: [],
      };
      groups.set(groupKey, group);
      items.push(group);
    }

    group.tasks.push(task);
  });
  return items;
}

export function getTaskProgress(tasks, stats) {
  if (tasks.length === 0) return 0;
  return Math.round((stats.completed / tasks.length) * 100);
}

export function getLegacyPlanGroupKey(task) {
  if (!task?.coachPlanFocus) return "";
  const createdAt = new Date(task.createdAt);
  if (Number.isNaN(createdAt.getTime())) return `legacy-${task.coachPlanFocus}`;
  const fiveSecondBucket = Math.floor(createdAt.getTime() / (5 * 1000));
  return `legacy-${task.coachPlanFocus}-${fiveSecondBucket}`;
}
