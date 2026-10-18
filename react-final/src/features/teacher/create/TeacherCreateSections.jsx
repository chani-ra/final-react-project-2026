import React from "react";
import { SectionTitle, TextInput } from "../components/ui/TeacherFormFields";
import { InfoRow } from "../components/ui/TeacherInfoBlocks";

export function ContentTypeTabs({ contentType, onChange }) {
  return (
    <div className="mb-6 rounded-[1.8rem] border-2 border-white/20 bg-[#061f36]/76 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <TypeButton
          active={contentType === "video"}
          title="שיעור וידאו"
          subtitle="העלאת קובץ וידאו ללמידה"
          label="V"
          onClick={() => onChange("video")}
        />

        <TypeButton
          active={contentType === "audio"}
          title="שיר אודיו"
          subtitle="העלאת קובץ שמע לתרגול"
          label="A"
          onClick={() => onChange("audio")}
        />
      </div>
    </div>
  );
}

function TypeButton({ active, title, subtitle, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.5rem] border-2 p-4 text-right transition-all ${
        active
          ? "border-[#ffd439] bg-[#123c6b] text-white shadow-[0_0_24px_rgba(255,212,57,0.20)]"
          : "border-[#2c8fd6]/42 bg-[#082844]/72 text-white/72 hover:border-[#ff6659]/62 hover:bg-[#123c6b]/82"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border-2 text-base font-extrabold ${
            active
              ? "border-[#fff2a3] bg-[#ffd439] text-[#123c6b]"
              : "border-[#2c8fd6]/60 bg-[#061f36] text-white/72"
          }`}
        >
          {active ? "✓" : label}
        </span>

        <span>
          <span className="block text-xl font-extrabold leading-8">
            {title}
          </span>

          <span
            className={`mt-1 block text-base font-semibold leading-7 ${
              active ? "text-[#fff3b0]" : "text-white/62"
            }`}
          >
            {subtitle}
          </span>
        </span>
      </div>
    </button>
  );
}

export function PublishModeSection({ publishMode, setPublishMode }) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <SectionTitle
        title="מצב פרסום"
        subtitle="טיוטה נשמרת רק בספריית המורה. פרסום מאפשר שילוב במסלולים אישיים."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <PublishButton
          active={publishMode === "draft"}
          title="שמירה כטיוטה"
          text="התוכן יישמר בספרייה, אך לא יוצג לתלמידות ולא ייכנס למסלולים."
          onClick={() => setPublishMode("draft")}
        />

        <PublishButton
          active={publishMode === "published"}
          title="פרסום לתלמידות"
          text="התוכן יהיה זמין ויוכל להשתלב במסלולים אישיים."
          onClick={() => setPublishMode("published")}
        />
      </div>
    </section>
  );
}

function PublishButton({ active, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.5rem] border-2 p-4 text-right transition-all ${
        active
          ? "border-[#ffd439] bg-[#ffd439]/24 text-[#fff4b8] shadow-[0_0_22px_rgba(255,212,57,0.22)]"
          : "border-[#2c8fd6]/40 bg-[#082844]/72 text-white hover:border-[#ff6659]/58 hover:bg-[#123c6b]/68"
      }`}
    >
      <div className="text-xl font-extrabold leading-8">{title}</div>
      <div className="mt-1 text-base font-semibold leading-7 text-white/70">
        {text}
      </div>
    </button>
  );
}

export function SongDetails({
  duration,
  setDuration,
  composer,
  setComposer,
  lyricist,
  setLyricist,
}) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <SectionTitle
        title="פרטי שיר"
        subtitle="השדות האלו נשמרים עם קובץ האודיו."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <TextInput
          label="משך בשניות"
          value={duration}
          onChange={setDuration}
          placeholder="180"
        />

        <TextInput
          label="מלחין"
          value={composer}
          onChange={setComposer}
          placeholder="לא ידוע"
        />

        <TextInput
          label="כותב מילים"
          value={lyricist}
          onChange={setLyricist}
          placeholder="לא ידוע"
        />
      </div>
    </section>
  );
}

export function MediaUploadBox({
  contentType,
  fileName,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
}) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <SectionTitle
        title="קובץ מדיה"
        subtitle={
          contentType === "video"
            ? "בחרי קובץ וידאו לשיעור."
            : "בחרי קובץ אודיו לשיר."
        }
      />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative rounded-[1.8rem] border-2 border-dashed p-10 text-center transition-all ${
          isDragging
            ? "border-[#ffd439] bg-[#ffd439]/12"
            : "border-[#2c8fd6]/55 bg-[#082844]/74 hover:border-[#ffd439]/60"
        }`}
      >
        <input
          type="file"
          accept={contentType === "video" ? "video/*" : "audio/*"}
          onChange={onFileChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        <div className="relative z-0 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-xl font-extrabold text-white shadow-[0_7px_0_rgba(89,15,20,0.42),0_12px_24px_rgba(3,31,61,0.28)]">
          {contentType === "video" ? "V" : "A"}
        </div>

        <p className="relative z-0 text-lg font-extrabold leading-8 text-white">
          {fileName ? `קובץ נבחר: ${fileName}` : "גררי לכאן או לחצי לבחירה"}
        </p>

        <p className="relative z-0 mt-1 text-base font-semibold text-white/62">
          {contentType === "video" ? "קובץ וידאו" : "קובץ אודיו"}
        </p>
      </div>
    </section>
  );
}

export function CreateSummary({
  contentType,
  publishMode,
  title,
  topic,
  category,
  level,
  minAge,
  maxAge,
  hobbies,
  expectations,
  fileName,
}) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-xl font-extrabold">סיכום העלאה</h2>

        <div className="mt-3 space-y-2">
          <InfoRow
            label="סוג"
            value={contentType === "video" ? "שיעור" : "שיר"}
          />
          <InfoRow label="כותרת" value={title || "לא מולאה"} />
          <InfoRow label="נושא" value={topic || "לא מולא"} />
          <InfoRow label="רמה" value={getLevelLabel(level)} />
          <InfoRow label="קטגוריה" value={getCategoryLabel(category)} />
          <InfoRow label="גיל" value={`${minAge || 4}-${maxAge || 120}`} />
          <InfoRow label="תחביבים" value={hobbies.length} />
          <InfoRow label="מטרות" value={expectations.length} />
          <InfoRow
            label="פרסום"
            value={publishMode === "published" ? "מפורסם" : "טיוטה"}
          />
          <InfoRow label="קובץ" value={fileName || "לא נבחר"} />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h2 className="text-xl font-extrabold text-white">בדיקה לפני שמירה</h2>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-base font-semibold leading-8 text-white/78">
          ודאי שיש כותרת, נושא, קובץ, רמה מדויקת ותגיות מתאימות. תוכן מפורסם
          יוכל להיכנס למסלולים אישיים.
        </p>
      </div>
    </aside>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
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
