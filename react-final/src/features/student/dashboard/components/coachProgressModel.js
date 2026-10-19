// Pure helpers for per-student, per-plan progress stored in the browser.
export function readSavedCoachSteps(storage, key) {
  if (!storage) return [];
  try {
    const value = JSON.parse(storage.getItem(key) || "[]");
    return Array.isArray(value) ? value.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export function getCoachStepsForKey(progressState, key, storage) {
  return progressState.key === key
    ? progressState.steps
    : readSavedCoachSteps(storage, key);
}

/** Percentage must reflect distinct, in-range checked steps only. */
export function calculateCoachProgress(checkedSteps, stepCount) {
  if (!Number.isInteger(stepCount) || stepCount <= 0) return 0;
  if (!Array.isArray(checkedSteps)) return 0;
  const valid = new Set(checkedSteps.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < stepCount
  ));
  return Math.round((valid.size / stepCount) * 100);
}
