export function getCourseContentStats(course) {
  return {
    lessons: course.lessons?.length || 0,
    exercises: course.exercises?.length || 0,
    quizzes: course.quizzes?.length || 0,
    songs: course.songs?.length || 0,
  };
}

export function getCourseTotalItems(course) {
  const stats = getCourseContentStats(course);
  return stats.lessons + stats.exercises + stats.quizzes + stats.songs;
}

export function getCourseLevel(course) {
  return course.englishLevel || course.level || course.difficulty || "";
}

export function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "ביניים",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "ביניים",
    מתקדמים: "מתקדמים",
    בסיס: "מתחילים",
  };

  return labels[level] || level || "אישי";
}

export function getCategoryLabel(category) {
  const labels = {
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    conversation: "שיחה",
    reading: "קריאה",
    listening: "האזנה",
    general: "כללי",
  };

  return labels[category] || category || "כללי";
}

// Display-only calculation: opening a course must not mutate progress records
// or mark the course as recently active.
export function getCourseCompletionStats(course, progress) {
  if (!course) return { completedItems: 0, totalItems: 0, percent: 0 };

  const fields = [
    ["lessons", "completedLessons"],
    ["songs", "completedSongs"],
    ["exercises", "completedExercises"],
    ["quizzes", "completedQuizzes"],
  ];
  let totalItems = 0;
  let completedItems = 0;

  for (const [courseField, completedField] of fields) {
    const available = new Set((course[courseField] || []).filter(Boolean).map((item) => String(item._id || item)));
    const completed = new Set((progress?.[completedField] || []).filter(Boolean).map((item) => String(item._id || item)));
    totalItems += available.size;
    for (const id of completed) {
      if (available.has(id)) completedItems++;
    }
  }

  return {
    completedItems,
    totalItems,
    percent: totalItems ? Math.round((completedItems / totalItems) * 100) : 0,
  };
}
