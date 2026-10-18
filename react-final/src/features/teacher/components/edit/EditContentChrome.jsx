import { InfoRow } from "../ui/TeacherInfoBlocks";
import { getTypeLabel, getLevelLabel, getCategoryLabel, getQuizTypeLabel } from "./editContentModel.js";

export function ModalHeader({ title, editType, onClose }) {
  return (
    <header className="relative z-10 px-4 py-5 md:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
            {getTypeLabel(editType)}
          </div>

          <h2
            className="text-3xl font-extrabold leading-tight md:text-4xl"
            style={{
              textShadow:
                "3px 3px 0 rgba(184,50,42,0.48), -1px -1px 0 rgba(15,76,117,0.80), 0 14px 30px rgba(7,89,133,0.35)",
            }}
          >
            {title}
          </h2>

          <p className="mt-2 max-w-3xl text-base font-semibold leading-7 text-white/72">
            עדכני את הפרטים בלי לשנות את קובץ המדיה עצמו. שינוי קובץ יתבצע
            במסך ייעודי בהמשך.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#ffb4ad]/40 bg-[#b8322a]/46 text-xl font-extrabold text-white shadow-[0_5px_0_rgba(89,15,20,0.40)] transition hover:-translate-y-0.5 hover:bg-[#b8322a]/64 active:translate-y-0.5 active:shadow-none"
          aria-label="סגירה"
        >
          ×
        </button>
      </div>
    </header>
  );
}

export function ActionButtons({ isSaving, onSave, onClose }) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {isSaving ? "שומר..." : "שמירת שינויים"}
      </button>

      <button
        type="button"
        onClick={onClose}
        className="rounded-full border-2 border-[#7dd3fc] bg-[#0f4c75] px-5 py-4 text-lg font-bold text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#176aa8] active:translate-y-1 active:shadow-none"
      >
        ביטול
      </button>
    </div>
  );
}

export function EditSummary({ editType, editForm }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h3 className="text-xl font-extrabold">סיכום עריכה</h3>

        <div className="mt-3 space-y-2">
          <InfoRow label="סוג" value={getTypeLabel(editType)} />
          <InfoRow label="כותרת" value={editForm.title || "לא מולאה"} />

          {editType === "lesson" && (
            <InfoRow label="נושא" value={editForm.topic || "לא מולא"} />
          )}

          {editType === "song" && (
            <InfoRow label="נושא" value={editForm.theme || "לא מולא"} />
          )}

          {editType === "exercise" && (
            <InfoRow
              label="הוראות"
              value={editForm.instructions ? "קיימות" : "חסרות"}
            />
          )}

          {editType === "quiz" && (
            <>
              <InfoRow
                label="שאלות"
                value={(editForm.questions || []).length}
              />
              <InfoRow
                label="סוג בוחן"
                value={getQuizTypeLabel(editForm.quizType)}
              />
            </>
          )}

          <InfoRow
            label="רמה"
            value={
              editType === "quiz"
                ? getLevelLabel(editForm.englishLevel)
                : getLevelLabel(editForm.level)
            }
          />

          <InfoRow
            label="קטגוריה"
            value={getCategoryLabel(editForm.category)}
          />

          <InfoRow
            label="פרסום"
            value={editForm.isPublic ? "מפורסם" : "טיוטה"}
          />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h3 className="text-xl font-extrabold text-white">לפני שמירה</h3>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-base font-semibold leading-8 text-white/78">
          בדקי שהכותרת, הרמה והקטגוריה נכונות. שינוי קובץ מדיה אינו מתבצע
          בחלונית זו.
        </p>
      </div>
    </aside>
  );
}
