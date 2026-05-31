import React, { useState } from "react";
import { generateQuizWithAI } from "../../services/aiService";
import { createQuiz } from "../../services/quizService";

const categories = [
  { value: "general", label: "כללי" },
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "האזנה" },
];

const levels = [
  { value: "beginner", label: "מתחילים" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדמים" },
];

const quizTypes = [
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "שמיעה" },
  { value: "writing", label: "כתיבה" },
  { value: "mixed", label: "מעורב" },
];

const hobbyOptions = [
  { value: "art_music", label: "אמנות ומוזיקה" },
  { value: "sports", label: "ספורט" },
  { value: "movies", label: "סרטים וסרטונים" },
  { value: "books", label: "ספרים וקריאה" },
];

const expectationOptions = [
  { value: "grammar", label: "דקדוק" },
  { value: "fluent_speaking", label: "דיבור שוטף" },
  { value: "confidence", label: "ביטחון באנגלית" },
  { value: "vocabulary", label: "אוצר מילים" },
];

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

  const toggleArrayValue = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
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
    if (!form.title.trim()) return "נא למלא כותרת בוחן";
    if (!form.topic.trim()) return "נא למלא נושא לימוד";

    if (Number(form.minAge) > Number(form.maxAge)) {
      return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי";
    }

    return "";
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

      const normalizedQuestions = aiQuestions.map((q) => ({
        question: q.question,
        questionType: "multiple-choice",
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "",
        points: 1,
        difficulty:
          form.englishLevel === "beginner"
            ? "easy"
            : form.englishLevel === "advanced"
            ? "hard"
            : "medium",
      }));

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
    const validationError = validateBaseForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    if (questions.length === 0) {
      setMessage({
        type: "error",
        text: "צריך ליצור שאלות לפני שמירת הבוחן",
      });
      return;
    }

    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      await createQuiz({
        title: form.title.trim(),
        description: form.description.trim(),

        // לא שולחים courseId חובה
        // הבוחן נשמר כתוכן חכם לפי תגיות
        courseId: null,

        englishLevel: form.englishLevel,
        quizType: form.quizType,
        questions,

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
            ? "הבוחן פורסם בהצלחה ויוכל להשתלב במסלולים אישיים"
            : "הבוחן נשמר כטיוטה",
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

  const updateQuestion = (index, field, value) => {
    setQuestions((prev) =>
      prev.map((question, i) =>
        i === index
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
      prev.map((question, i) => {
        if (i !== questionIndex) return question;

        const nextOptions = [...question.options];
        const oldOption = nextOptions[optionIndex];

        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === oldOption ? value : question.correctAnswer,
        };
      })
    );
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#58BDEB] border border-white/45 shadow-[0_24px_80px_rgba(12,74,110,0.20)] p-6 md:p-8 text-white">
        <HeaderLines />

        <div className="relative flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <div className="inline-flex items-center bg-white text-[#0F4C75] border-[3px] border-[#B8322A] px-4 py-2 rounded-full text-sm font-black mb-4 shadow-sm">
              יצירת בוחן חכם
            </div>

            <h1 className="text-4xl md:text-5xl font-black leading-tight drop-shadow-sm">
              יצירת בוחן מותאם למסלולים
            </h1>

            <p className="text-white/88 mt-3 max-w-2xl leading-relaxed">
              כל בוחן מקבל תגיות חכמות: רמה, קטגוריה, גיל, תחביבים ומטרות.
              כך הוא יכול להשתלב בקורסים אישיים לפי התאמה.
            </p>
          </div>

          <div className="relative bg-white/24 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/45 rounded-3xl p-5 min-w-[230px] h-fit shadow-[0_18px_45px_rgba(15,76,117,0.24)] backdrop-blur-xl">
            <div className="absolute -top-3 left-5 bg-[#B8322A] text-white text-xs font-black px-3 py-1 rounded-full shadow">
              QUIZ
            </div>

            <div className="text-white/75 text-sm font-bold">שאלות מוכנות</div>
            <div className="text-3xl font-black mt-1">{questions.length}</div>
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-black ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white/94 border-[3px] border-[#B8322A] outline outline-[2px] outline-[#0F4C75]/30 p-8 rounded-[2rem] space-y-8 shadow-[0_18px_55px_rgba(15,76,117,0.20)]">
        <section>
          <h2 className="text-xl font-black mb-4 text-[#0F4C75]">
            פרטי הבוחן
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="כותרת הבוחן"
              value={form.title}
              onChange={(value) => handleChange("title", value)}
              placeholder="לדוגמה: Present Simple Quiz"
            />

            <InputField
              label="נושא לימוד ל־AI"
              value={form.topic}
              onChange={(value) => handleChange("topic", value)}
              placeholder="לדוגמה: Present Simple"
            />
          </div>

          <label className="block mt-5 space-y-2">
            <span className="text-sm font-black text-slate-700">תיאור קצר</span>

            <textarea
              rows="3"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none resize-none"
              placeholder="מה הבוחן בודק?"
            />
          </label>
        </section>

        <section>
          <h2 className="text-xl font-black mb-4 text-[#0F4C75]">
            תיוג חכם ל־AI
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField
              label="קטגוריה"
              value={form.category}
              onChange={(value) => handleChange("category", value)}
              options={categories}
            />

            <SelectField
              label="רמה"
              value={form.englishLevel}
              onChange={(value) => handleChange("englishLevel", value)}
              options={levels}
            />

            <SelectField
              label="סוג בוחן"
              value={form.quizType}
              onChange={(value) => handleChange("quizType", value)}
              options={quizTypes}
            />

            <InputField
              label="מספר שאלות"
              type="number"
              value={form.questionCount}
              onChange={(value) => handleChange("questionCount", value)}
            />

            <InputField
              label="גיל מינימלי"
              type="number"
              value={form.minAge}
              onChange={(value) => handleChange("minAge", value)}
            />

            <InputField
              label="גיל מקסימלי"
              type="number"
              value={form.maxAge}
              onChange={(value) => handleChange("maxAge", value)}
            />

            <InputField
              label="משך בדקות"
              type="number"
              value={form.duration}
              onChange={(value) => handleChange("duration", value)}
            />

            <InputField
              label="ציון מעבר"
              type="number"
              value={form.passingScore}
              onChange={(value) => handleChange("passingScore", value)}
            />
          </div>

          <TagButtons
            title="מתאים לתחביבים"
            options={hobbyOptions}
            selected={hobbies}
            onToggle={(value) => toggleArrayValue(value, hobbies, setHobbies)}
          />

          <TagButtons
            title="מתאים למטרות לימוד"
            options={expectationOptions}
            selected={expectations}
            onToggle={(value) =>
              toggleArrayValue(value, expectations, setExpectations)
            }
          />
        </section>

        <section>
          <h2 className="text-xl font-black mb-4 text-[#0F4C75]">
            מצב פרסום
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PublishButton
              active={publishMode === "draft"}
              title="שמור כטיוטה"
              text="הבוחן יישמר אצל המורה, אבל עדיין לא ייכנס למסלולים."
              onClick={() => setPublishMode("draft")}
            />

            <PublishButton
              active={publishMode === "published"}
              title="פרסם לתלמידים ולמסלולים"
              text="הבוחן יהיה זמין להתאמה חכמה בקורסים אישיים."
              onClick={() => setPublishMode("published")}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGenerateQuestions}
            disabled={generating}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#0F4C75] hover:bg-[#0B3D5E] disabled:opacity-60 shadow-lg transition-all"
          >
            {generating ? "יוצר שאלות..." : "צור שאלות עם AI"}
          </button>

          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={saving || questions.length === 0}
            className="w-full py-4 rounded-2xl font-black text-white bg-[#B8322A] hover:bg-[#9F2A24] disabled:opacity-60 shadow-lg transition-all"
          >
            {saving
              ? "שומר בוחן..."
              : publishMode === "published"
              ? "שמור ופרסם בוחן"
              : "שמור כטיוטה"}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-2xl font-black text-white drop-shadow-sm">
              עריכת שאלות
            </h2>

            <span className="bg-white text-[#0F4C75] border-[3px] border-[#B8322A] px-4 py-2 rounded-full text-sm font-black shadow-sm">
              {questions.length} שאלות
            </span>
          </div>

          {questions.map((question, index) => (
            <EditableQuestionCard
              key={`${question.question}-${index}`}
              question={question}
              index={index}
              onUpdateQuestion={updateQuestion}
              onUpdateOption={updateOption}
              onRemove={removeQuestion}
            />
          ))}
        </section>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-black text-slate-700">{label}</span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-black text-slate-700">{label}</span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none"
      >
        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TagButtons({ title, options, selected, onToggle }) {
  return (
    <div className="mt-6">
      <label className="block text-sm font-black text-slate-700 mb-3">
        {title}
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {options.map((item) => {
          const isActive = selected.includes(item.value);

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={`p-3 rounded-2xl text-sm font-black transition-all border ${
                isActive
                  ? "bg-[#0F4C75] text-white border-[#B8322A]"
                  : "bg-sky-50 text-slate-700 border-sky-100 hover:border-[#0F4C75]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PublishButton({ active, title, text, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 rounded-3xl text-right border transition-all ${
        active
          ? "bg-[#0F4C75] text-white border-[#B8322A]"
          : "bg-sky-50 text-slate-700 border-sky-100 hover:border-[#0F4C75]"
      }`}
    >
      <div className="font-black text-lg">{title}</div>
      <div className={`text-sm mt-1 ${active ? "text-white/80" : "text-slate-500"}`}>
        {text}
      </div>
    </button>
  );
}

function EditableQuestionCard({
  question,
  index,
  onUpdateQuestion,
  onUpdateOption,
  onRemove,
}) {
  return (
    <div className="bg-white/94 border border-white rounded-[2rem] shadow-[0_14px_40px_rgba(15,76,117,0.18)] p-5">
      <div className="flex justify-between items-start gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0F4C75] border-[3px] border-[#B8322A] text-white flex items-center justify-center font-black shrink-0">
            {index + 1}
          </div>

          <h3 className="text-lg font-black text-slate-900">שאלה {index + 1}</h3>
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="bg-red-50 text-red-600 border border-red-100 px-3 py-2 rounded-xl font-black text-sm"
        >
          מחיקה
        </button>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-black text-slate-700">טקסט השאלה</span>

        <textarea
          value={question.question}
          onChange={(e) => onUpdateQuestion(index, "question", e.target.value)}
          rows="2"
          dir="ltr"
          className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none resize-none"
        />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {(question.options || []).map((option, optionIndex) => (
          <label key={optionIndex} className="space-y-2">
            <span className="text-sm font-black text-slate-700">
              אפשרות {optionIndex + 1}
            </span>

            <input
              value={option}
              dir="ltr"
              onChange={(e) => onUpdateOption(index, optionIndex, e.target.value)}
              className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none"
            />
          </label>
        ))}
      </div>

      <label className="block mt-4 space-y-2">
        <span className="text-sm font-black text-slate-700">תשובה נכונה</span>

        <select
          value={question.correctAnswer}
          onChange={(e) =>
            onUpdateQuestion(index, "correctAnswer", e.target.value)
          }
          className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none"
        >
          {(question.options || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block mt-4 space-y-2">
        <span className="text-sm font-black text-slate-700">הסבר לתשובה</span>

        <textarea
          value={question.explanation}
          onChange={(e) =>
            onUpdateQuestion(index, "explanation", e.target.value)
          }
          rows="3"
          className="w-full bg-sky-50 border border-sky-100 rounded-2xl px-4 py-3 text-slate-800 focus:border-[#0F4C75] outline-none resize-none"
        />
      </label>
    </div>
  );
}

function HeaderLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-25"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4" />
        <path d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42" />
        <path d="M90 75 H150 L185 40 L225 75 H310" />
        <path d="M930 92 H980 L1015 58 L1050 92 H1125" />
      </g>
    </svg>
  );
}