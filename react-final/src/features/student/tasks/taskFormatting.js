export function getSourceConfig(source, type) {
  if (source === "ai_coach" || type === "coach_task") {
    return {
      label: "מאמן אישי",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    };
  }

  if (source === "teacher" || type === "teacher_task" || type === "exercise") {
    return {
      label: "מורה",
      className: "border-red-300/35 bg-red-500/15 text-red-100",
    };
  }

  if (type === "lesson") {
    return {
      label: "שיעור",
      className: "border-sky-300/35 bg-sky-300/12 text-sky-100",
    };
  }

  if (type === "song") {
    return {
      label: "שיר",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    };
  }

  return {
    label: "אישי",
    className: "border-white/18 bg-white/10 text-white/70",
  };
}

export function getDifficultyColor(diff) {
  const colors = {
    Easy: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    Medium: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    Hard: "border-red-300/35 bg-red-500/15 text-red-100",
  };

  return colors[diff] || "border-white/18 bg-white/10 text-white/70";
}

export function getDifficultyLabel(diff) {
  const labels = {
    Easy: "קל",
    Medium: "בינוני",
    Hard: "קשה",
  };

  return labels[diff] || "רגיל";
}
export function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
