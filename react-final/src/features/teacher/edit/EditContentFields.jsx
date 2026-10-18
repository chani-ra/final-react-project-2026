import { SectionTitle, TextInput, TextArea, SelectInput } from "../components/ui/TeacherFormFields";
import { categoryOptions, levelOptions, quizTypeOptions, getTypeLabel } from "./editContentModel.js";

export function BasicFields({ editType, editForm, updateField }) {
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

export function LessonFields({ editForm, updateField }) {
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

export function SongFields({ editForm, updateField }) {
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

export function ExerciseFields({ editForm, updateField }) {
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

export function QuizFields({
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

export function QuestionEditor({
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

export function ClassificationFields({ editType, editForm, updateField }) {
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

export function PublishBox({ isPublic, onChange }) {
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
