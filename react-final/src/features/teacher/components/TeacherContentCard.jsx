import React from "react";

export default function TeacherContentCard({
  item,
  type,
  actionLoadingId,
  onView,
  onEdit,
  onTogglePublish,
  onDelete,
}) {
  const isLesson = type === "lesson";
  const isLoading = actionLoadingId === item._id;

  const title = item.title || item.theme || "ללא כותרת";

  const subtitle = isLesson
    ? item.description || "אין תיאור לשיעור זה."
    : `מלחין: ${item.composer || "לא צוין"} · משך: ${
        item.duration || "לא צוין"
      }`;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-yellow-400/30 transition-all">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-4xl mb-3">
            {isLesson ? item.icon || "🎬" : "🎵"}
          </div>

          <h3 className="text-2xl font-bold text-white">{title}</h3>

          <p className="text-gray-400 text-sm mt-2 line-clamp-2">
            {subtitle}
          </p>
        </div>

        <PublishBadge isPublic={item.isPublic} />
      </div>

      <ContentMeta item={item} />

      {!isLesson && (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4 mt-5">
          <p className="text-gray-400 text-sm mb-3">
            האזנה לשיר לפני פרסום או עריכה:
          </p>

          <audio
            controls
            className="w-full"
            src={`http://localhost:3000/songs/song/${item._id}/stream`}
          >
            הדפדפן שלך לא תומך בנגן אודיו.
          </audio>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        {isLesson && (
          <button
            onClick={onView}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all"
          >
            צפייה
          </button>
        )}

        <button
          onClick={onEdit}
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl transition-all"
        >
          עריכה
        </button>

        <button
          onClick={onTogglePublish}
          disabled={isLoading}
          className={`flex-1 font-bold py-3 rounded-xl transition-all ${
            item.isPublic
              ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          }`}
        >
          {isLoading
            ? "מעדכן..."
            : item.isPublic
            ? "החזר לטיוטה"
            : "פרסם עכשיו"}
        </button>

        <button
          onClick={onDelete}
          disabled={isLoading}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-5 py-3 rounded-xl transition-all"
        >
          מחק
        </button>
      </div>
    </div>
  );
}

// תגית מצב פרסום
function PublishBadge({ isPublic }) {
  return isPublic ? (
    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
      מפורסם
    </span>
  ) : (
    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold">
      טיוטה
    </span>
  );
}

// פרטי רמה, קטגוריה וגיל
function ContentMeta({ item }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-lg text-xs">
        {getLevelLabel(item.level || item.englishLevel)}
      </span>

      <span className="bg-indigo-400/10 text-indigo-300 px-2 py-1 rounded-lg text-xs">
        {getCategoryLabel(item.category)}
      </span>

      {item.targetAges && (
        <span className="bg-white/10 text-gray-300 px-2 py-1 rounded-lg text-xs">
          גיל {item.targetAges.min}-{item.targetAges.max}
        </span>
      )}
    </div>
  );
}

// תרגום רמות לתצוגה
function getLevelLabel(level) {
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

// תרגום קטגוריות לתצוגה
function getCategoryLabel(category) {
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