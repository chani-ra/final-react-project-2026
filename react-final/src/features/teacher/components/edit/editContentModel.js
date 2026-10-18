export const categoryOptions = [
  { value: "general", label: "כללי" },
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "האזנה" },
];

export const levelOptions = [
  { value: "beginner", label: "מתחילים" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדמים" },
];

export const quizTypeOptions = [
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "שמיעה" },
  { value: "writing", label: "כתיבה" },
  { value: "mixed", label: "מעורב" },
];

export function getModalTitle(editType) {
  const titles = {
    lesson: "עריכת שיעור",
    song: "עריכת שיר",
    exercise: "עריכת תרגיל",
    quiz: "עריכת בוחן",
  };

  return titles[editType] || "עריכת תוכן";
}

export function getTypeLabel(type) {
  const labels = {
    lesson: "שיעור",
    song: "שיר",
    exercise: "תרגיל",
    quiz: "בוחן",
  };

  return labels[type] || "תוכן";
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

export function getCategoryLabel(category) {
  const labels = {
    general: "כללי",
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    conversation: "שיחה",
    reading: "קריאה",
    listening: "האזנה",
  };

  return labels[category] || category || "כללי";
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

export function updateEditField(form, field, value) {
  return { ...form, [field]: value };
}

export function updateEditQuestion(form, questionIndex, field, value) {
  return {
    ...form,
    questions: (form.questions || []).map((question, index) =>
      index === questionIndex ? { ...question, [field]: value } : question
    ),
  };
}

export function updateEditOption(form, questionIndex, optionIndex, value) {
  return {
    ...form,
    questions: (form.questions || []).map((question, index) => {
      if (index !== questionIndex) return question;
      const options = [...(question.options || [])];
      const oldOption = options[optionIndex];
      options[optionIndex] = value;
      return {
        ...question,
        options,
        correctAnswer: question.correctAnswer === oldOption ? value : question.correctAnswer,
      };
    }),
  };
}

export function removeEditQuestion(form, questionIndex) {
  return {
    ...form,
    questions: (form.questions || []).filter((_, index) => index !== questionIndex),
  };
}
