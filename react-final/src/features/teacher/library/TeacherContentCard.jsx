import { apiUrl } from "../../../services/axiosConfig";

export default function TeacherContentCard({
  item,
  type,
  actionLoadingId,
  onView,
  onEdit,
  onTogglePublish,
  onDelete,
}) {
  const isLoading = actionLoadingId === item._id;

  const title = item.title || item.topic || item.theme || "תוכן ללא כותרת";

  const description =
    item.description ||
    item.instructions ||
    item.theme ||
    "אין תיאור לתוכן הזה.";

  const canView = type === "lesson";
  const isSong = type === "song";

  const songUrl = isSong
    ? apiUrl(`/songs/song/${item._id}/stream`)
    : "";

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#ff6659]/38 bg-[#123c6b]/72 p-5 text-white shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusBadge isPublic={item.isPublic} />
            <SoftBadge>{getTypeLabel(type)}</SoftBadge>
            <SoftBadge>
              {getLevelLabel(item.level || item.englishLevel)}
            </SoftBadge>
            <SoftBadge>{getCategoryLabel(item.category)}</SoftBadge>
          </div>

          <h3 className="line-clamp-2 text-2xl font-extrabold leading-tight md:text-3xl">
            {title}
          </h3>

          <p className="mt-2 line-clamp-2 text-base font-semibold leading-7 text-white/72">
            {description}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <InfoLine
            label="רמה"
            value={getLevelLabel(item.level || item.englishLevel)}
          />

          <InfoLine
            label="קטגוריה"
            value={getCategoryLabel(item.category)}
          />

          <InfoLine label="גיל" value={getAgeText(item)} />

          <InfoLine
            label="מצב"
            value={item.isPublic ? "מפורסם" : "טיוטה"}
          />
        </div>

        {isSong && <SongPreview songUrl={songUrl} title={title} />}

        <div
          className={`mt-6 grid grid-cols-1 gap-2 ${
            canView ? "md:grid-cols-4" : "md:grid-cols-3"
          }`}
        >
          {canView && (
            <ActionButton
              label="צפייה"
              onClick={onView}
              disabled={isLoading}
              variant="blue"
            />
          )}

          <ActionButton
            label="עריכה"
            onClick={onEdit}
            disabled={isLoading}
            variant="blue"
          />

          <ActionButton
            label={item.isPublic ? "החזר לטיוטה" : "פרסם"}
            onClick={onTogglePublish}
            disabled={isLoading}
            variant="dark"
          />

          <ActionButton
            label="מחיקה"
            onClick={onDelete}
            disabled={isLoading}
            variant="red"
          />
        </div>
      </div>
    </article>
  );
}

function SongPreview({ songUrl, title }) {
  return (
    <div className="mt-5 rounded-[1.6rem] border-2 border-[#2c8fd6]/45 bg-[#082844]/82 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#ffd439] bg-[#123c6b] text-lg font-extrabold text-[#fff3b0]">
          ▶
        </span>

        <div className="min-w-0">
          <div className="text-base font-extrabold leading-7 text-white">
            השמעת השיר
          </div>

          <div className="truncate text-sm font-semibold leading-6 text-white/62">
            {title}
          </div>
        </div>
      </div>

      <audio
        controls
        preload="metadata"
        className="w-full rounded-xl"
        src={songUrl}
      >
        הדפדפן לא תומך בהשמעת אודיו.
      </audio>
    </div>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5">
      <span className="h-3 w-3 shrink-0 rounded-full bg-[#ffd439] shadow-[0_0_12px_rgba(255,212,57,0.55)]" />

      <span className="min-w-0">
        <span className="block text-sm font-bold leading-5 text-white/58">
          {label}
        </span>

        <span className="block truncate text-lg font-extrabold leading-7 text-white">
          {value || "לא צוין"}
        </span>
      </span>
    </div>
  );
}

function ActionButton({ label, onClick, disabled, variant }) {
  const classes = {
    blue:
      "border-[#7dd3fc] bg-[#0f4c75] text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#176aa8]",
    dark:
      "border-[#ffd439] bg-[#123c6b] text-[#fff3b0] shadow-[0_5px_0_rgba(3,31,61,0.45)] hover:bg-[#0f4c75]",
    red:
      "border-[#ffb4ad] bg-[#b8322a] text-white shadow-[0_5px_0_rgba(89,15,20,0.50)] hover:bg-[#9f2a24]",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border-2 px-4 py-3.5 text-base font-bold leading-7 transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60 ${classes[variant]}`}
    >
      {disabled ? "מעדכן..." : label}
    </button>
  );
}

function StatusBadge({ isPublic }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-sm font-bold ${
        isPublic
          ? "border-white/24 bg-white/12 text-white"
          : "border-[#ffd439]/32 bg-[#ffd439]/14 text-[#fff3b0]"
      }`}
    >
      {isPublic ? "מפורסם" : "טיוטה"}
    </span>
  );
}

function SoftBadge({ children }) {
  return (
    <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-sm font-bold text-white/72">
      {children}
    </span>
  );
}

function getTypeLabel(type) {
  const labels = {
    lesson: "שיעור",
    song: "שיר",
    exercise: "תרגיל",
    quiz: "בוחן",
  };

  return labels[type] || "תוכן";
}

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

function getCategoryLabel(category) {
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

function getAgeText(item) {
  const min = item.targetAges?.min;
  const max = item.targetAges?.max;

  if (!min && !max) return "כל גיל";

  return `${min || 4}-${max || 120}`;
}