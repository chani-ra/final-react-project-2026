export function buildWelcomeMessage(user) {
  return {
    id: "welcome-message",
    text: `היי ${user?.username || user?.name || "תלמידה"}! אני בולט, המאמן האישי שלך לאנגלית.
אפשר לכתוב לי באנגלית או בעברית, ואני אעזור לך לתרגל שיחה, להבין מילים, לשפר משפטים ולהתקדם בביטחון.`,
    sender: "ai",
    time: getCurrentTime(),
  };
}

export function buildConversationTitle(text) {
  const cleanText = text.trim().replace(/\s+/g, " ");

  if (cleanText.length <= 38) return cleanText;

  return `${cleanText.slice(0, 38)}...`;
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(date) {
  if (!date) return getCurrentTime();

  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
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

  return labels[level] || level || "מתחילים";
}
