export function buildAIExerciseRequest(form, aiCount, aiFormat) {
  return {
    prompt: form.aiPrompt || form.title,
    questionCount: aiCount,
    questionFormat: aiFormat,
    topic: form.title,
    level: form.level,
    category: form.category,
    type: form.type,
    targetAges: {
      min: Number(form.targetAgeMin),
      max: Number(form.targetAgeMax),
    },
    hobbies: form.hobbies,
    expectations: form.expectations,
  };
}

export function normalizeAIExercise(payload, form) {
  const data =
    payload?.data ||
    payload?.generatedExercise ||
    payload?.exercise ||
    payload;

  const raw = Array.isArray(data)
    ? data
    : data?.questions;

  if (!Array.isArray(raw) || !raw.length) {
    throw Error("ה־AI לא החזיר שאלות");
  }

  const questions = raw.map((item) => ({
    prompt: String(
      item.sentence || item.question || ""
    ).trim(),
    answer: String(item.correctAnswer || "").trim(),
    explanation: String(item.hint || ""),
    mode: data.format === "open" ? "flexible" : "exact",
  }));

  if (questions.some((q) => !q.prompt || !q.answer)) {
    throw Error("חסרה שאלה או תשובת דוגמה");
  }

  return {
    title: data.title || form.title || "English exercise",
    description: data.description || "",
    instructions:
      data.instructions || "עני על השאלות באנגלית.",
    questions,
  };
}

export function validateExerciseForm(form, questionDrafts) {
  if (!form.title.trim()) return "כותרת תרגיל חובה.";
  if (!form.instructions.trim()) return "הוראות התרגיל חובה.";

  if (form.aiPrompt.trim() && !questionDrafts.length) {
    return "יש ליצור שאלות בעזרת AI לפני שמירה.";
  }

  if (
    questionDrafts.some(
      (q) => !q.prompt.trim() || !q.answer.trim()
    )
  ) {
    return "חובה למלא את השאלות ותשובות הדוגמה.";
  }

  if (Number(form.targetAgeMin) > Number(form.targetAgeMax)) {
    return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי.";
  }

  return "";
}

export function buildExercisePayload(form, questionDrafts) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    instructions: form.instructions.trim(),
    type: form.type,
    category: form.category,
    level: form.level,
    targetAgeMin: form.targetAgeMin,
    targetAgeMax: form.targetAgeMax,
    hobbies: JSON.stringify(form.hobbies),
    expectations: JSON.stringify(form.expectations),
    materials: JSON.stringify(
      form.materials
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
    ),
    isPublic: form.isPublic,
    createdByAI: Boolean(form.aiPrompt.trim()),
    aiPrompt: form.aiPrompt.trim(),
    ...(questionDrafts.length
      ? {
          questions: questionDrafts.map(
            (q) => q.prompt.trim()
          ),
          answerKey: questionDrafts.map((q) => ({
            answer: q.answer.trim(),
            explanation: q.explanation,
            mode: q.mode,
          })),
        }
      : {}),
  };
}
