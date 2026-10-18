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
