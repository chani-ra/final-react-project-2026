import { SectionTitle, TextInput, TextArea, SelectInput } from "../components/ui/TeacherFormFields";
import { MiniInfoCard } from "../components/ui/TeacherInfoBlocks";

const quizTypeOptions = [
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "שמיעה" },
  { value: "writing", label: "כתיבה" },
  { value: "mixed", label: "מעורב" },
];

export function TeacherQuizHeader({ questionCount, publishMode }) {
  return (
    <header className="mb-6">
      <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
        יצירת בוחן
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
            יצירת בוחן למסלולים אישיים
          </h1>

          <p className="mt-3 max-w-4xl text-base font-semibold leading-8 text-white/76">
            בחרי רמה, קטגוריה ותגיות. לאחר יצירת השאלות אפשר לערוך כל שאלה
            לפני שמירה או פרסום.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
          <MiniInfoCard label="שאלות" value={questionCount} />
          <MiniInfoCard
            label="פרסום"
            value={publishMode === "published" ? "מפורסם" : "טיוטה"}
          />
        </div>
      </div>
    </header>
  );
}

export function InstructionBox() {
  return (
    <div className="mb-5 rounded-[1.6rem] border-2 border-[#ffd439]/32 bg-[#ffd439]/14 px-5 py-4 text-base font-semibold leading-8 text-[#fff3b0] shadow-[0_0_24px_rgba(255,212,57,0.12)]">
      כדי שהבוחן ישתלב נכון במסלולים אישיים, חשוב לבחור רמה מדויקת, קטגוריה,
      גילאים ותגיות התאמה.
    </div>
  );
}

export function QuizDetailsSection({ form, handleChange }) {
  return (
    <section>
      <SectionTitle
        title="פרטי הבוחן"
        subtitle="כותרת ונושא ברורים יעזרו ל־AI ליצור שאלות מדויקות."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          label="כותרת הבוחן"
          value={form.title}
          onChange={(value) => handleChange("title", value)}
          placeholder="לדוגמה: Present Simple Quiz"
        />

        <TextInput
          label="נושא לימוד ל־AI"
          value={form.topic}
          onChange={(value) => handleChange("topic", value)}
          placeholder="לדוגמה: Present Simple"
        />
      </div>

      <TextArea
        label="תיאור קצר"
        value={form.description}
        onChange={(value) => handleChange("description", value)}
        placeholder="מה הבוחן בודק?"
        rows={3}
      />
    </section>
  );
}

export function QuizSettingsSection({ form, handleChange }) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <SectionTitle
        title="הגדרות בוחן"
        subtitle="סוג הבוחן, מספר שאלות, זמן וציון מעבר."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectInput
          label="סוג בוחן"
          value={form.quizType}
          onChange={(value) => handleChange("quizType", value)}
          options={quizTypeOptions}
        />

        <TextInput
          label="מספר שאלות"
          type="number"
          value={form.questionCount}
          onChange={(value) => handleChange("questionCount", value)}
        />

        <TextInput
          label="משך בדקות"
          type="number"
          value={form.duration}
          onChange={(value) => handleChange("duration", value)}
        />

        <TextInput
          label="ציון מעבר"
          type="number"
          value={form.passingScore}
          onChange={(value) => handleChange("passingScore", value)}
        />
      </div>
    </section>
  );
}

export function PublishSection({ publishMode, setPublishMode }) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <SectionTitle
        title="מצב פרסום"
        subtitle="טיוטה נשמרת אצל המורה. פרסום מאפשר שילוב במסלולים אישיים."
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <PublishButton
          active={publishMode === "draft"}
          title="שמירה כטיוטה"
          text="הבוחן יישמר אצל המורה, אך עדיין לא ייכנס למסלולים."
          onClick={() => setPublishMode("draft")}
        />

        <PublishButton
          active={publishMode === "published"}
          title="פרסום לתלמידות"
          text="הבוחן יהיה זמין להתאמה חכמה בקורסים אישיים."
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
