/** Build the coach plan's tasks without modifying the plan or the UI state. */
export function buildCoachTasks(plan) {
  const title = plan?.focus || "תוכנית אישית מהמאמן";
  const steps = Array.isArray(plan?.steps) ? plan.steps : [];
  return {
    tasks: steps.map((step, index) => ({
      title: `שלב ${index + 1}`,
      description: step,
      type: "coach_task",
      source: "ai_coach",
      difficulty: "Easy",
      estimatedTime: "10 דקות",
      rewardXP: 50,
      coachPlanFocus: title,
    })),
    coachPlanFocus: title,
    planTitle: title,
  };
}

/** One save attempt per action; failures are propagated to the calling UI. */
export async function saveCoachPlanTasks(createTasks, plan) {
  return createTasks(buildCoachTasks(plan));
}
