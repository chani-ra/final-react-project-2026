export function getItemType(activeTab) {
  const map = {
    lessons: "lesson",
    songs: "song",
    exercises: "exercise",
    quizzes: "quiz",
  };

  return map[activeTab] || "lesson";
}

export function getOpenButtonText(activeTab) {
  const map = {
    lessons: "צפייה",
    songs: "השמעה",
    exercises: "התחל",
    quizzes: "התחל",
  };

  return map[activeTab] || "פתח";
}

export function getShortDescription(activeTab, item) {
  if (activeTab === "lessons") {
    return item.description || "שיעור מתוך המסלול.";
  }

  if (activeTab === "songs") {
    return item.theme || "תרגול האזנה.";
  }

  if (activeTab === "exercises") {
    return "תרגול אישי.";
  }

  if (activeTab === "quizzes") {
    return item.description || "בדיקת הבנה.";
  }

  return item.description || item.theme || "פריט מתוך הקורס.";
}
