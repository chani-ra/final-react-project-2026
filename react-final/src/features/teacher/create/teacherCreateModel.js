// Pure form contract, shared by the view hook and tests. Backend remains authoritative.
export function validateTeacherCreate({ title, topic, file, minAge, maxAge, contentType, duration, composer, lyricist }) {
  if (!title.trim()) return "נא למלא כותרת.";
  if (!topic.trim()) return "נא למלא נושא לימוד.";
  if (!file) return "נא לבחור קובץ.";
  if (Number(minAge) > Number(maxAge)) return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי.";
  if (contentType === "audio") {
    if (!duration) return "נא למלא משך שיר.";
    if (!composer.trim()) return "נא למלא מלחין.";
    if (!lyricist.trim()) return "נא למלא כותב מילים.";
  }
  return "";
}

export function buildTeacherCreatePayload({ title, topic, description, contentType, category, level, minAge, maxAge, hobbies, expectations, publishMode, file, duration, composer, lyricist }) {
  const formData = new FormData();
  formData.append("title", title.trim());
  formData.append("topic", topic.trim());
  formData.append("description", description.trim());
  formData.append("icon", contentType === "video" ? "lesson" : "song");
  formData.append("category", category);
  formData.append("level", level);
  formData.append("targetAgeMin", String(minAge));
  formData.append("targetAgeMax", String(maxAge));
  formData.append("hobbies", JSON.stringify(hobbies));
  formData.append("expectations", JSON.stringify(expectations));
  formData.append("lessonLanguage", "he");
  formData.append("isPublic", publishMode === "published" ? "true" : "false");
  if (contentType === "video") {
    formData.append("video", file);
  } else {
    formData.append("audioFile", file);
    formData.append("theme", topic.trim());
    formData.append("duration", String(duration));
    formData.append("targetAge", `${minAge}-${maxAge}`);
    formData.append("composer", composer.trim());
    formData.append("lyricist", lyricist.trim());
  }
  return formData;
}
