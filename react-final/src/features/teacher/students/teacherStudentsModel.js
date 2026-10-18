export const formatStudentActivity = (value) => {
  if (!value) return "טרם נרשמה פעילות";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "לא ידוע"
    : new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

export const normalizeTeacherStudents = (students) =>
  (Array.isArray(students) ? students : []).map((item) => ({
    ...item,
    progress: Math.min(100, Math.max(0, Number(item.progress) || 0)),
    lastActive: formatStudentActivity(item.lastActivityAt),
  }));
