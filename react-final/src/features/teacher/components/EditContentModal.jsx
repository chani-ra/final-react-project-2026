import React from "react";

import {
  SectionTitle,
  TextInput,
  TextArea,
  SelectInput,
} from "./ui/TeacherFormFields";

import { InfoRow } from "./ui/TeacherInfoBlocks";

const categoryOptions = [
  { value: "general", label: "כללי" },
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "האזנה" },
];

const levelOptions = [
  { value: "beginner", label: "מתחילים" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדמים" },
];

const quizTypeOptions = [
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "שמיעה" },
  { value: "writing", label: "כתיבה" },
  { value: "mixed", label: "מעורב" },
];

export default function EditContentModal({
  editType,
  editForm,
  setEditForm,
  actionLoadingId,
  editingItemId,
  onClose,
  onSave,
}) {
  const isSaving = actionLoadingId === editingItemId;

  const title = getModalTitle(editType);

  const updateField = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuestion = (questionIndex, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      questions: (prev.questions || []).map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              [field]: value,
            }
          : question
      ),
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setEditForm((prev) => ({
      ...prev,
      questions: (prev.questions || []).map((question, index) => {
        if (index !== questionIndex) return question;

        const nextOptions = [...(question.options || [])];
        const oldOption = nextOptions[optionIndex];

        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === oldOption ? value : question.correctAnswer,
        };
      }),
    }));
  };

  const removeQuestion = (questionIndex) => {
    setEditForm((prev) => ({
      ...prev,
      questions: (prev.questions || []).filter(
        (_, index) => index !== questionIndex
      ),
    }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/78 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <section className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2.3rem] border border-white/26 bg-[#123c6b]/92 text-white shadow-[0_32px_95px_rgba(3,31,61,0.48),inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_52%)]" />

        <div className="relative z-10 flex max-h-[92vh] flex-col">
          <ModalHeader title={title} editType={editType} onClose={onClose} />

          <div className="overflow-y-auto px-4 pb-4 md:px-6 md:pb-6">
            <div className="grid gap-4 xl:grid-cols-[1.45fr_0.65fr]">
              <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="space-y-6">
                  <BasicFields
                    editType={editType}
                    editForm={editForm}
                    updateField={updateField}
                  />

                  {editType === "lesson" && (
                    <LessonFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "song" && (
                    <SongFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "exercise" && (
                    <ExerciseFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "quiz" && (
                    <QuizFields
                      editForm={editForm}
                      updateField={updateField}
                      updateQuestion={updateQuestion}
                      updateOption={updateOption}
                      removeQuestion={removeQuestion}
                    />
                  )}

                  <ClassificationFields
                    editType={editType}
                    editForm={editForm}
                    updateField={updateField}
                  />

                  {(editType === "exercise" || editType === "quiz") && (
                    <PublishBox
                      isPublic={Boolean(editForm.isPublic)}
                      onChange={(value) => updateField("isPublic", value)}
                    />
                  )}
                </div>

                <ActionButtons
                  isSaving={isSaving}
                  onSave={onSave}
                  onClose={onClose}
                />
              </section>

              <EditSummary editType={editType} editForm={editForm} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ModalHeader({ title, editType, onClose }) {
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

function BasicFields({ editType, editForm, updateField }) {
  return (
    <section>
      <SectionTitle
        title="פרטים בסיסיים"
        subtitle="שם ותיאור קצר שיעזרו לזהות את התוכן בספריית המורה."
      />

      <TextInput
        label="כותרת"
        value={editForm.title}
        onChange={(value) => updateField("title", value)}
        placeholder={`כותרת ה${getTypeLabel(editType)}`}
      />
    </section>
  );
}

function LessonFields({ editForm, updateField }) {
  return (
    <section>
      <SectionTitle
        title="פרטי שיעור"
        subtitle="נושא ותיאור השיעור כפי שיופיעו בספרייה."
      />

      <TextInput
        label="נושא שיעור"
        value={editForm.topic}
        onChange={(value) => updateField("topic", value)}
        placeholder="לדוגמה: Present Simple"
      />

      <TextArea
        label="תיאור"
        value={editForm.description}
        rows={3}
        onChange={(value) => updateField("description", value)}
        placeholder="תיאור קצר של השיעור..."
      />
    </section>
  );
}

function SongFields({ editForm, updateField }) {
  return (
    <section>
      <SectionTitle
        title="פרטי שיר"
        subtitle="נושא השיר משמש לזיהוי ולחיפוש בספרייה."
      />

      <TextInput
        label="נושא השיר"
        value={editForm.theme}
        onChange={(value) => updateField("theme", value)}
        placeholder="לדוגמה: Vocabulary Practice"
      />
    </section>
  );
}

function ExerciseFields({ editForm, updateField }) {
  return (
    <section>
      <SectionTitle
        title="פרטי תרגיל"
        subtitle="תיאור והוראות שיופיעו לתלמידה בעת ביצוע התרגיל."
      />

      <TextArea
        label="תיאור"
        value={editForm.description}
        rows={3}
        onChange={(value) => updateField("description", value)}
        placeholder="תיאור קצר של התרגיל..."
      />

      <TextArea
        label="הוראות התרגיל"
        value={editForm.instructions}
        rows={7}
        onChange={(value) => updateField("instructions", value)}
        placeholder="הוראות ברורות לתלמידה..."
      />
    </section>
  );
}

function QuizFields({
  editForm,
  updateField,
  updateQuestion,
  updateOption,
  removeQuestion,
}) {
  return (
    <section>
      <SectionTitle
        title="פרטי בוחן"
        subtitle="הגדרות כלליות ושאלות הבוחן."
      />

      <TextArea
        label="תיאור הבוחן"
        value={editForm.description}
        rows={3}
        onChange={(value) => updateField("description", value)}
        placeholder="מה הבוחן בודק?"
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <SelectInput
          label="סוג בוחן"
          value={editForm.quizType}
          onChange={(value) => updateField("quizType", value)}
          options={quizTypeOptions}
        />

        <TextInput
          label="משך בדקות"
          type="number"
          value={editForm.duration}
          onChange={(value) => updateField("duration", value)}
        />

        <TextInput
          label="ציון מעבר"
          type="number"
          value={editForm.passingScore}
          onChange={(value) => updateField("passingScore", value)}
        />
      </div>

      <section className="mt-6 space-y-4">
        <SectionTitle
          title="שאלות הבוחן"
          subtitle="עריכת שאלות, אפשרויות, תשובה נכונה והסבר."
        />

        {(editForm.questions || []).length === 0 ? (
          <div className="rounded-[1.5rem] border border-[#ffd439]/24 bg-[#082844]/68 p-5 text-base font-semibold leading-8 text-white/76">
            אין שאלות בבוחן הזה.
          </div>
        ) : (
          (editForm.questions || []).map((question, questionIndex) => (
            <QuestionEditor
              key={`question-${questionIndex}`}
              question={question}
              questionIndex={questionIndex}
              updateQuestion={updateQuestion}
              updateOption={updateOption}
              removeQuestion={removeQuestion}
            />
          ))
        )}
      </section>
    </section>
  );
}

function QuestionEditor({
  question,
  questionIndex,
  updateQuestion,
  updateOption,
  removeQuestion,
}) {
  const options = question.options || [];

  return (
    <article className="rounded-[2rem] border-2 border-[#ff6659]/34 bg-[#123c6b]/54 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border-2 border-[#ffd439] bg-[#082844] text-lg font-extrabold text-[#fff3b0]">
            {questionIndex + 1}
          </span>

          <div>
            <h4 className="text-xl font-extrabold leading-8 text-white">
              שאלה {questionIndex + 1}
            </h4>

            <p className="text-sm font-semibold leading-6 text-white/58">
              עריכת שאלה אמריקאית
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeQuestion(questionIndex)}
          className="rounded-full border-2 border-[#ffb4ad]/40 bg-[#b8322a]/42 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#b8322a]/60"
        >
          מחיקה
        </button>
      </div>

      <TextArea
        label="טקסט השאלה"
        value={question.question}
        rows={3}
        onChange={(value) => updateQuestion(questionIndex, "question", value)}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {options.map((option, optionIndex) => (
          <TextInput
            key={`option-${questionIndex}-${optionIndex}`}
            label={`אפשרות ${optionIndex + 1}`}
            value={option}
            onChange={(value) =>
              updateOption(questionIndex, optionIndex, value)
            }
          />
        ))}
      </div>

      <div className="mt-4">
        <SelectInput
          label="תשובה נכונה"
          value={question.correctAnswer}
          onChange={(value) =>
            updateQuestion(questionIndex, "correctAnswer", value)
          }
          options={options
            .filter((option) => String(option || "").trim())
            .map((option) => ({
              value: option,
              label: option,
            }))}
        />
      </div>

      <TextArea
        label="הסבר לתשובה"
        value={question.explanation}
        rows={3}
        onChange={(value) =>
          updateQuestion(questionIndex, "explanation", value)
        }
        placeholder="הסבר שיוצג לתלמידה לאחר ההגשה..."
      />
    </article>
  );
}

function ClassificationFields({ editType, editForm, updateField }) {
  return (
    <section>
      <SectionTitle
        title="סיווג והתאמה"
        subtitle="רמה וקטגוריה משמשות להתאמת התוכן למסלולים אישיים."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectInput
          label="קטגוריה"
          value={editForm.category}
          onChange={(value) => updateField("category", value)}
          options={categoryOptions}
        />

        {editType === "quiz" ? (
          <SelectInput
            label="רמה"
            value={editForm.englishLevel}
            onChange={(value) => updateField("englishLevel", value)}
            options={levelOptions}
          />
        ) : (
          <SelectInput
            label="רמה"
            value={editForm.level}
            onChange={(value) => updateField("level", value)}
            options={levelOptions}
          />
        )}
      </div>
    </section>
  );
}

function PublishBox({ isPublic, onChange }) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <label className="flex cursor-pointer items-start gap-4">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-5 w-5 accent-[#ffd439]"
        />

        <span>
          <span className="block text-xl font-extrabold leading-8 text-white">
            פרסום למסלולים אישיים
          </span>

          <span className="mt-1 block text-base font-semibold leading-7 text-white/72">
            אם מסומן, התוכן יכול להיכנס לקורסים של תלמידות לאחר רענון או יצירת
            מסלול חדש.
          </span>
        </span>
      </label>
    </section>
  );
}

function ActionButtons({ isSaving, onSave, onClose }) {
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

function EditSummary({ editType, editForm }) {
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

function getModalTitle(editType) {
  const titles = {
    lesson: "עריכת שיעור",
    song: "עריכת שיר",
    exercise: "עריכת תרגיל",
    quiz: "עריכת בוחן",
  };

  return titles[editType] || "עריכת תוכן";
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

function getQuizTypeLabel(type) {
  const labels = {
    grammar: "דקדוק",
    vocabulary: "אוצר מילים",
    reading: "קריאה",
    listening: "שמיעה",
    writing: "כתיבה",
    mixed: "מעורב",
  };

  return labels[type] || type || "לא צוין";
}