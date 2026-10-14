export function getEmptyEditForm() {
  return {
    title: "",
    topic: "",
    theme: "",
    description: "",
    instructions: "",
    category: "general",
    level: "beginner",
    englishLevel: "beginner",
    quizType: "mixed",
    duration: 30,
    passingScore: 70,
    questions: [],
    isPublic: false,
  };
}

export function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}

export function getQuizTypeLabel(type) {
  const labels = {
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    reading: "קריאה",
    listening: "שמיעה",
    writing: "כתיבה",
    mixed: "מעורב",
  };

  return labels[type] || type || "לא צוין";
}
