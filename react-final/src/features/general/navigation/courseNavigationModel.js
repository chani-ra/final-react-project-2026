// Shared course navigation rules. Never accept an arbitrary return URL from route state.
export const COURSE_TAB_LABELS = Object.freeze({
  lessons: "שיעורים",
  songs: "שירים",
  exercises: "תרגילים",
  quizzes: "בחנים",
});

export function normalizeCourseTab(tab) {
  return Object.hasOwn(COURSE_TAB_LABELS, tab) ? tab : "lessons";
}

export function courseTabFromSearch(search = "") {
  return normalizeCourseTab(new URLSearchParams(search).get("tab"));
}

export function courseTabPath(courseId, tab = "lessons") {
  if (typeof courseId !== "string" || !courseId.trim()) return null;
  return `/course/${encodeURIComponent(courseId)}?tab=${normalizeCourseTab(tab)}`;
}

export function resolveCourseReturn(location, fallbackTab) {
  const state = location?.state?.courseReturn;
  const id = state?.courseId || new URLSearchParams(location?.search || "").get("courseId");
  const tab = normalizeCourseTab(state?.tab || fallbackTab);
  return {
    path: courseTabPath(id, tab),
    label: `חזרה ל${COURSE_TAB_LABELS[tab]}`,
  };
}
