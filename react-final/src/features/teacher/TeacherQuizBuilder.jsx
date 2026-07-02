import React, { useState } from "react";
import { generateQuizWithAI } from "../../services/aiService";
import { createQuiz } from "../../services/quizService";

import SmartContentFields from "./components/SmartContentFields";

import {
  SectionTitle,
  TextInput,
  TextArea,
  SelectInput,
} from "./components/ui/TeacherFormFields";

import {
  MessageBox,
  MiniInfoCard,
  InfoRow,
  HeaderLines,
} from "./components/ui/TeacherInfoBlocks";

const quizTypeOptions = [
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "שמיעה" },
  { value: "writing", label: "כתיבה" },
  { value: "mixed", label: "מעורב" },
];

const emptyQuestion = {
  question: "",
  questionType: "multiple-choice",
  options: ["", "", "", ""],
  correctAnswer: "",
  explanation: "",
  points: 1,
  difficulty: "easy",
};

export default function TeacherQuizBuilder() {
  const [publishMode, setPublishMode] = useState("draft");

  const [form, setForm] = useState({
    title: "",
    topic: "",
    description: "",
    category: "general",
    englishLevel: "beginner",
    quizType: "mixed",
    minAge: 6,
    maxAge: 18,
    questionCount: 5,
    duration: 30,
    passingScore: 70,
  });

  const [hobbies, setHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayValue = (fieldOrValue, valueOrList, maybeSetList) => {
    // תמיכה בקריאה הישנה אם נשארה איפשהו:
    // toggleArrayValue(value, list, setList)
    if (Array.isArray(valueOrList) && typeof maybeSetList === "function") {
      const value = fieldOrValue;
      const list = valueOrList;
      const setList = maybeSetList;

      if (list.includes(value)) {
        setList(list.filter((item) => item !== value));
        return;
      }

      setList([...list, value]);
      return;
    }

    // הקריאה החדשה מ-SmartContentFields:
    // toggleArrayValue("hobbies", value)
    const field = fieldOrValue;
    const value = valueOrList;

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

  const resetForm = () => {
    setPublishMode("draft");

    setForm({
      title: "",
      topic: "",
      description: "",
      category: "general",
      englishLevel: "beginner",
      quizType: "mixed",
      minAge: 6,
      maxAge: 18,
      questionCount: 5,
      duration: 30,
      passingScore: 70,
    });

    setHobbies([]);
    setExpectations([]);
    setQuestions([]);
  };

  const validateBaseForm = () => {
    if (!form.title.trim()) return "נא למלא כותרת בוחן.";
    if (!form.topic.trim()) return "נא למלא נושא לימוד.";

    if (Number(form.minAge) > Number(form.maxAge)) {
      return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי.";
    }

    if (Number(form.questionCount) < 1) {
      return "מספר שאלות חייב להיות לפחות 1.";
    }

    return "";
  };

  const validateQuestionsBeforeSave = () => {
    if (!questions.length) {
      return "צריך ליצור או להוסיף שאלות לפני שמירת הבוחן.";
    }

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      const cleanOptions = getCleanOptions(question.options);

      if (!question.question.trim()) {
        return `שאלה ${index + 1}: חסר טקסט שאלה.`;
      }

      if (cleanOptions.length < 2) {
        return `שאלה ${index + 1}: צריך לפחות שתי אפשרויות תשובה.`;
      }

      if (!question.correctAnswer.trim()) {
        return `שאלה ${index + 1}: צריך לבחור תשובה נכונה.`;
      }

      if (!cleanOptions.includes(question.correctAnswer)) {
        return `שאלה ${index + 1}: התשובה הנכונה חייבת להיות אחת מהאפשרויות.`;
      }
    }

    return "";
  };

  const normalizeAIQuestions = (aiQuestions) => {
    if (!Array.isArray(aiQuestions)) return [];

    return aiQuestions.map((question) => {
      const options = getCleanOptions(question.options);

      const finalOptions =
        options.length >= 2
          ? options
          : ["Option A", "Option B", "Option C", "Option D"];

      const correctAnswer =
        question.correctAnswer && finalOptions.includes(question.correctAnswer)
          ? question.correctAnswer
          : finalOptions[0];

      return {
        question: question.question || "",
        questionType: "multiple-choice",
        options: finalOptions,
        correctAnswer,
        explanation: question.explanation || "",
        points: Number(question.points) || 1,
        difficulty:
          form.englishLevel === "beginner"
            ? "easy"
            : form.englishLevel === "advanced"
            ? "hard"
            : "medium",
      };
    });
  };

  const handleGenerateQuestions = async () => {
    const validationError = validateBaseForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setGenerating(true);
      setMessage({ type: "", text: "" });
      setQuestions([]);

      const aiQuestions = await generateQuizWithAI({
        topic: form.topic.trim(),
        difficulty: form.englishLevel,
        questionCount: Number(form.questionCount) || 5,
      });

      const normalizedQuestions = normalizeAIQuestions(aiQuestions);

      if (!normalizedQuestions.length) {
        setMessage({
          type: "error",
          text: "ה־AI לא החזיר שאלות תקינות. נסי שוב עם נושא ברור יותר.",
        });
        return;
      }

      setQuestions(normalizedQuestions);

      setMessage({
        type: "success",
        text: "השאלות נוצרו בהצלחה. אפשר לערוך אותן ואז לשמור את הבוחן.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    const validationError = validateBaseForm() || validateQuestionsBeforeSave();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const cleanQuestions = questions.map((question) => ({
        ...question,
        question: question.question.trim(),
        options: getCleanOptions(question.options),
        correctAnswer: question.correctAnswer.trim(),
        explanation: question.explanation.trim(),
        points: Number(question.points) || 1,
      }));

      await createQuiz({
        title: form.title.trim(),
        description: form.description.trim(),
        courseId: null,

        englishLevel: form.englishLevel,
        quizType: form.quizType,
        questions: cleanQuestions,

        duration: Number(form.duration) || 30,
        passingScore: Number(form.passingScore) || 70,

        isActive: true,
        isPublic: publishMode === "published",

        category: form.category,
        targetAges: {
          min: Number(form.minAge) || 6,
          max: Number(form.maxAge) || 120,
        },
        hobbies,
        expectations,

        generatedByAI: true,
      });

      setMessage({
        type: "success",
        text:
          publishMode === "published"
            ? "הבוחן פורסם בהצלחה ויוכל להשתלב במסלולים אישיים."
            : "הבוחן נשמר כטיוטה.",
      });

      resetForm();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        ...emptyQuestion,
        difficulty:
          form.englishLevel === "beginner"
            ? "easy"
            : form.englishLevel === "advanced"
            ? "hard"
            : "medium",
      },
    ]);
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const nextOptions = [...(question.options || [])];
        const oldOption = nextOptions[optionIndex];

        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === oldOption
              ? value
              : question.correctAnswer,
        };
      })
    );
  };

  const addOption = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              options: [...(question.options || []), ""],
            }
          : question
      )
    );
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index !== questionIndex) return question;

        const removedOption = question.options?.[optionIndex];
        const nextOptions = (question.options || []).filter(
          (_, currentIndex) => currentIndex !== optionIndex
        );

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === removedOption
              ? ""
              : question.correctAnswer,
        };
      })
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) =>
      prev.filter((_, questionIndex) => questionIndex !== index)
    );
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <TeacherQuizHeader
            questionCount={questions.length}
            publishMode={publishMode}
          />

          <MessageBox message={message} />

          <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <InstructionBox />

              <div className="space-y-7">
                <QuizDetailsSection form={form} handleChange={handleChange} />

                <SmartContentFields
                  category={form.category}
                  level={form.englishLevel}
                  minAge={form.minAge}
                  maxAge={form.maxAge}
                  hobbies={hobbies}
                  expectations={expectations}
                  onChange={handleChange}
                  onToggleArrayValue={toggleArrayValue}
                  levelFieldName="englishLevel"
                  minAgeFieldName="minAge"
                  maxAgeFieldName="maxAge"
                />

                <QuizSettingsSection form={form} handleChange={handleChange} />

                <PublishSection
                  publishMode={publishMode}
                  setPublishMode={setPublishMode}
                />

                <ActionButtons
                  generating={generating}
                  saving={saving}
                  questionsCount={questions.length}
                  onGenerate={handleGenerateQuestions}
                  onSave={handleSaveQuiz}
                  onAddQuestion={addQuestion}
                  publishMode={publishMode}
                />
              </div>
            </section>

            <QuizSideSummary
              form={form}
              questions={questions}
              hobbies={hobbies}
              expectations={expectations}
              publishMode={publishMode}
            />
          </div>
        </div>
      </section>

      {questions.length > 0 && (
        <QuestionEditorList
          questions={questions}
          onUpdateQuestion={updateQuestion}
          onUpdateOption={updateOption}
          onAddOption={addOption}
          onRemoveOption={removeOption}
          onRemoveQuestion={removeQuestion}
        />
      )}
    </main>
  );
}

function TeacherQuizHeader({ questionCount, publishMode }) {
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

function InstructionBox() {
  return (
    <div className="mb-5 rounded-[1.6rem] border-2 border-[#ffd439]/32 bg-[#ffd439]/14 px-5 py-4 text-base font-semibold leading-8 text-[#fff3b0] shadow-[0_0_24px_rgba(255,212,57,0.12)]">
      כדי שהבוחן ישתלב נכון במסלולים אישיים, חשוב לבחור רמה מדויקת, קטגוריה,
      גילאים ותגיות התאמה.
    </div>
  );
}

function QuizDetailsSection({ form, handleChange }) {
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

function QuizSettingsSection({ form, handleChange }) {
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

function PublishSection({ publishMode, setPublishMode }) {
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

function ActionButtons({
  generating,
  saving,
  questionsCount,
  onGenerate,
  onSave,
  onAddQuestion,
  publishMode,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <button
        type="button"
        onClick={onGenerate}
        disabled={generating}
        className="rounded-full border-2 border-[#7dd3fc] bg-[#0f4c75] px-5 py-4 text-base font-bold text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#176aa8] active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {generating ? "יוצר שאלות..." : "יצירת שאלות עם AI"}
      </button>

      <button
        type="button"
        onClick={onAddQuestion}
        className="rounded-full border-2 border-[#ffd439] bg-[#123c6b] px-5 py-4 text-base font-bold text-[#fff3b0] shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#0f4c75] active:translate-y-1 active:shadow-none"
      >
        הוספת שאלה ידנית
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={saving || questionsCount === 0}
        className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-base font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {saving
          ? "שומר בוחן..."
          : publishMode === "published"
          ? "שמירה ופרסום"
          : "שמירה כטיוטה"}
      </button>
    </div>
  );
}

function QuizSideSummary({ form, questions, hobbies, expectations, publishMode }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-xl font-extrabold">סיכום הבוחן</h2>

        <div className="mt-3 space-y-2">
          <InfoRow label="רמה" value={getLevelLabel(form.englishLevel)} />
          <InfoRow label="קטגוריה" value={getCategoryLabel(form.category)} />
          <InfoRow label="סוג" value={getQuizTypeLabel(form.quizType)} />
          <InfoRow label="שאלות" value={questions.length} />
          <InfoRow label="תחביבים" value={hobbies.length} />
          <InfoRow label="מטרות" value={expectations.length} />
          <InfoRow
            label="פרסום"
            value={publishMode === "published" ? "מפורסם" : "טיוטה"}
          />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h2 className="text-xl font-extrabold text-white">בדיקה לפני שמירה</h2>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-base font-semibold leading-8 text-white/78">
          ודאי שלכל שאלה יש לפחות שתי אפשרויות, תשובה נכונה והסבר. כך התלמידה
          תקבל משוב ברור אחרי ההגשה.
        </p>
      </div>

      <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
        <div className="text-sm font-bold text-white/62">מצב עריכה</div>

        <div className="mt-1 text-2xl font-extrabold text-white">
          {questions.length ? "יש שאלות" : "אין שאלות"}
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/16">
          <div
            className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] transition-all"
            style={{
              width: `${Math.min(100, questions.length * 20)}%`,
            }}
          />
        </div>
      </div>
    </aside>
  );
}

function QuestionEditorList({
  questions,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
}) {
  return (
    <section className="mt-5 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">
          עריכת שאלות
        </h2>

        <span className="rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-4 py-2 text-base font-bold text-[#ffe89a] shadow-sm">
          {questions.length} שאלות
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <EditableQuestionCard
            key={`question-${index}`}
            question={question}
            index={index}
            onUpdateQuestion={onUpdateQuestion}
            onUpdateOption={onUpdateOption}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
            onRemoveQuestion={onRemoveQuestion}
          />
        ))}
      </div>
    </section>
  );
}

function EditableQuestionCard({
  question,
  index,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
}) {
  const options = question.options || [];

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#ff6659]/45 bg-[#123c6b]/72 p-5 text-white shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-lg font-extrabold text-white shadow-[0_8px_0_rgba(89,15,20,0.38),0_10px_22px_rgba(3,31,61,0.24)]">
              {index + 1}
            </div>

            <div>
              <h3 className="text-2xl font-extrabold leading-tight">
                שאלה {index + 1}
              </h3>

              <p className="text-base font-semibold leading-7 text-white/64">
                עריכת שאלה אמריקאית
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemoveQuestion(index)}
            className="rounded-full border-2 border-[#ffb4ad]/40 bg-[#b8322a]/42 px-4 py-2.5 text-base font-bold text-white transition hover:bg-[#b8322a]/60"
          >
            מחיקה
          </button>
        </div>

        <TextArea
          label="טקסט השאלה"
          value={question.question}
          onChange={(value) => onUpdateQuestion(index, "question", value)}
          rows={3}
          placeholder="כתבי כאן את השאלה..."
        />

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-xl font-extrabold text-white">
              אפשרויות תשובה
            </h4>

            <button
              type="button"
              onClick={() => onAddOption(index)}
              className="rounded-full border-2 border-[#ffd439] bg-[#123c6b] px-4 py-2.5 text-base font-bold text-[#fff3b0] transition hover:bg-[#0f4c75]"
            >
              הוספת אפשרות
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {options.map((option, optionIndex) => (
              <OptionInput
                key={`option-${optionIndex}`}
                option={option}
                optionIndex={optionIndex}
                canDelete={options.length > 2}
                onChange={(value) => onUpdateOption(index, optionIndex, value)}
                onRemove={() => onRemoveOption(index, optionIndex)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <SelectInput
            label="תשובה נכונה"
            value={question.correctAnswer}
            onChange={(value) => onUpdateQuestion(index, "correctAnswer", value)}
            options={getCleanOptions(options).map((option) => ({
              value: option,
              label: option,
            }))}
          />
        </div>

        <TextArea
          label="הסבר לתשובה"
          value={question.explanation}
          onChange={(value) => onUpdateQuestion(index, "explanation", value)}
          rows={3}
          placeholder="כתבי הסבר שיוצג לתלמידה אחרי ההגשה..."
        />
      </div>
    </article>
  );
}

function OptionInput({ option, optionIndex, canDelete, onChange, onRemove }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        אפשרות {optionIndex + 1}
      </span>

      <div className="flex gap-2">
        <input
          value={option}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
          placeholder={`אפשרות ${optionIndex + 1}`}
        />

        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-[1.2rem] border-2 border-[#ffb4ad]/40 bg-[#b8322a]/42 px-4 text-lg font-extrabold text-white transition hover:bg-[#b8322a]/60"
          >
            ×
          </button>
        )}
      </div>
    </label>
  );
}

function getCleanOptions(options = []) {
  if (!Array.isArray(options)) return [];

  return options.map((option) => String(option || "").trim()).filter(Boolean);
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
  };

  return labels[level] || level || "לא צוינה";
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

  return labels[type] || type || "מעורב";
}