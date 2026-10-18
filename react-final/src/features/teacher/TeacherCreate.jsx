import useMessageNotice from "../../components/ui/useMessageNotice.js";
import React, { useState } from "react";
import { createLesson, uploadSong } from "../../services/teacherService";
import SmartContentFields from "./components/SmartContentFields";

import {
  SectionTitle,
  TextInput,
  TextArea,
} from "./components/ui/TeacherFormFields";

import {
  MiniInfoCard,
  InfoRow,
  HeaderLines,
} from "./components/ui/TeacherInfoBlocks";

export default function TeacherCreate() {
  const [contentType, setContentType] = useState("video");
  const [isDragging, setIsDragging] = useState(false);
  const [publishMode, setPublishMode] = useState("draft");

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("general");
  const [level, setLevel] = useState("beginner");
  const [minAge, setMinAge] = useState(6);
  const [maxAge, setMaxAge] = useState(18);
  const [hobbies, setHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);

  const [duration, setDuration] = useState("180");
  const [composer, setComposer] = useState("לא ידוע");
  const [lyricist, setLyricist] = useState("לא ידוע");

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  const updateSmartField = (field, value) => {
    if (field === "category") setCategory(value);
    if (field === "level") setLevel(value);
    if (field === "targetAgeMin") setMinAge(value);
    if (field === "targetAgeMax") setMaxAge(value);
  };

  const toggleArrayValue = (field, value) => {
    if (field === "hobbies") {
      setHobbies((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }

    if (field === "expectations") {
      setExpectations((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleContentTypeChange = (nextType) => {
    setContentType(nextType);
    setFile(null);
    setFileName("");
    setMessage({ type: "", text: "" });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setFile(event.dataTransfer.files[0]);
      setFileName(event.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setFileName(event.target.files[0].name);
    }
  };

  const resetForm = () => {
    setTitle("");
    setTopic("");
    setDescription("");
    setFile(null);
    setFileName("");
    setCategory("general");
    setLevel("beginner");
    setMinAge(6);
    setMaxAge(18);
    setHobbies([]);
    setExpectations([]);
    setDuration("180");
    setComposer("לא ידוע");
    setLyricist("לא ידוע");
    setPublishMode("draft");
    setIsDragging(false);
  };

  const validateForm = () => {
    if (!title.trim()) return "נא למלא כותרת.";
    if (!topic.trim()) return "נא למלא נושא לימוד.";
    if (!file) return "נא לבחור קובץ.";

    if (Number(minAge) > Number(maxAge)) {
      return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי.";
    }

    if (contentType === "audio") {
      if (!duration) return "נא למלא משך שיר.";
      if (!composer.trim()) return "נא למלא מלחין.";
      if (!lyricist.trim()) return "נא למלא כותב מילים.";
    }

    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

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

    try {
      if (contentType === "video") {
        await createLesson(formData);
      } else {
        await uploadSong(formData);
      }

      setMessage({
        type: "success",
        text:
          publishMode === "published"
            ? contentType === "video"
              ? "השיעור פורסם בהצלחה."
              : "השיר פורסם בהצלחה."
            : contentType === "video"
            ? "השיעור נשמר כטיוטה."
            : "השיר נשמר כטיוטה.",
      });

      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <header className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
              העלאת תוכן
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1
                  className="text-3xl font-extrabold leading-tight md:text-5xl"
                  style={{
                    textShadow:
                      "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
                  }}
                >
                  יצירת שיעור או שיר
                </h1>

                <p className="mt-3 max-w-4xl text-base font-semibold leading-8 text-white/76">
                  העלי קובץ, הגדירי רמה ותגיות, ובחרי אם לשמור כטיוטה או לפרסם
                  למסלולים אישיים.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <MiniInfoCard
                  label="סוג תוכן"
                  value={contentType === "video" ? "שיעור" : "שיר"}
                />
                <MiniInfoCard
                  label="פרסום"
                  value={publishMode === "published" ? "מפורסם" : "טיוטה"}
                />
              </div>
            </div>
          </header>


          <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <ContentTypeTabs
                contentType={contentType}
                onChange={handleContentTypeChange}
              />

              <div className="space-y-6">
                <section>
                  <SectionTitle
                    title="פרטי התוכן"
                    subtitle="כותרת, נושא ותיאור שיופיעו בספריית התוכן."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TextInput
                      label={`כותרת ה${
                        contentType === "video" ? "שיעור" : "שיר"
                      }`}
                      value={title}
                      onChange={setTitle}
                      placeholder={
                        contentType === "video"
                          ? "לדוגמה: Present Simple Rules"
                          : "לדוגמה: Vocabulary Song"
                      }
                    />

                    <TextInput
                      label="נושא לימוד"
                      value={topic}
                      onChange={setTopic}
                      placeholder="לדוגמה: Grammar Basics"
                    />
                  </div>

                  <TextArea
                    label="תיאור קצר"
                    value={description}
                    onChange={setDescription}
                    rows={3}
                    placeholder="מה התלמידה תלמד בתוכן הזה?"
                  />
                </section>

                <SmartContentFields
                  category={category}
                  level={level}
                  minAge={minAge}
                  maxAge={maxAge}
                  hobbies={hobbies}
                  expectations={expectations}
                  onChange={updateSmartField}
                  onToggleArrayValue={toggleArrayValue}
                />

                <PublishModeSection
                  publishMode={publishMode}
                  setPublishMode={setPublishMode}
                />

                {contentType === "audio" && (
                  <SongDetails
                    duration={duration}
                    setDuration={setDuration}
                    composer={composer}
                    setComposer={setComposer}
                    lyricist={lyricist}
                    setLyricist={setLyricist}
                  />
                )}

                <MediaUploadBox
                  contentType={contentType}
                  fileName={fileName}
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileChange={handleFileChange}
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                >
                  {isLoading
                    ? "מעלה לשרת..."
                    : publishMode === "published"
                    ? "שמירה ופרסום"
                    : "שמירה כטיוטה"}
                </button>
              </div>
            </section>

            <CreateSummary
              contentType={contentType}
              publishMode={publishMode}
              title={title}
              topic={topic}
              category={category}
              level={level}
              minAge={minAge}
              maxAge={maxAge}
              hobbies={hobbies}
              expectations={expectations}
              fileName={fileName}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function ContentTypeTabs({ contentType, onChange }) {
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

function PublishModeSection({ publishMode, setPublishMode }) {
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

function SongDetails({
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

function MediaUploadBox({
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

function CreateSummary({
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