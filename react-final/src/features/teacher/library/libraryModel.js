import { getEmptyEditForm } from "./libraryUtils.js";

export const EMPTY_LIBRARY = {
  lessons: [],
  songs: [],
  exercises: [],
  quizzes: [],
};

const TAB_OPTIONS = [
  { id: "lessons", label: "שיעורים", type: "lesson" },
  { id: "songs", label: "שירים", type: "song" },
  { id: "exercises", label: "תרגילים", type: "exercise" },
  { id: "quizzes", label: "בחנים", type: "quiz" },
];

export const TYPE_LABELS = {
  lesson: "השיעור",
  song: "השיר",
  exercise: "התרגיל",
  quiz: "הבוחן",
};

export const UPDATE_MESSAGES = {
  lesson: "השיעור עודכן בהצלחה.",
  song: "השיר עודכן בהצלחה.",
  exercise: "התרגיל עודכן בהצלחה.",
  quiz: "הבוחן עודכן בהצלחה.",
};

export function getLibraryView(collections, activeTab) {
  const tabs = TAB_OPTIONS.map((tab) => ({
    ...tab,
    count: (collections[tab.id] || []).length,
  }));
  const all = tabs.flatMap((tab) => collections[tab.id] || []);
  const publishedCount = all.filter((item) => item.isPublic).length;
  const totalCount = all.length;

  return {
    tabs,
    itemsToShow: collections[activeTab] || [],
    activeType: TAB_OPTIONS.find((tab) => tab.id === activeTab)?.type,
    publishedCount,
    draftCount: totalCount - publishedCount,
    totalCount,
  };
}

export function getEditForm(item, type) {
  const defaults = getEmptyEditForm();
  if (type === "quiz") {
    return {
      ...defaults,
      title: item.title || "",
      description: item.description || "",
      englishLevel: item.englishLevel || "beginner",
      quizType: item.quizType || "mixed",
      category: item.category || "general",
      duration: item.duration || 30,
      passingScore: item.passingScore || 70,
      isPublic: Boolean(item.isPublic),
      questions: Array.isArray(item.questions)
        ? item.questions.map((question) => ({
            question: question.question || "",
            questionType: question.questionType || "multiple-choice",
            options: Array.isArray(question.options) ? [...question.options] : [],
            correctAnswer: question.correctAnswer || "",
            explanation: question.explanation || "",
            points: question.points || 1,
            difficulty: question.difficulty || "medium",
          }))
        : [],
    };
  }

  return {
    ...defaults,
    title: item.title || "",
    topic: item.topic || "",
    theme: item.theme || "",
    description: item.description || "",
    instructions: item.instructions || "",
    category: item.category || "general",
    level: item.level || "beginner",
    isPublic: Boolean(item.isPublic),
  };
}

export function buildUpdatePayload(type, form) {
  switch (type) {
    case "quiz":
      return {
        title: form.title,
        description: form.description,
        englishLevel: form.englishLevel,
        quizType: form.quizType,
        category: form.category,
        duration: Number(form.duration) || 30,
        passingScore: Number(form.passingScore) || 70,
        isPublic: Boolean(form.isPublic),
        questions: form.questions,
      };
    case "lesson":
      return {
        title: form.title,
        topic: form.topic,
        description: form.description,
        category: form.category,
        level: form.level,
      };
    case "song":
      return {
        title: form.title,
        theme: form.theme,
        category: form.category,
        level: form.level,
      };
    case "exercise":
      return {
        title: form.title,
        description: form.description,
        instructions: form.instructions,
        category: form.category,
        level: form.level,
        isPublic: form.isPublic,
      };
    default:
      throw new Error(`סוג תוכן לא נתמך: ${type}`);
  }
}
