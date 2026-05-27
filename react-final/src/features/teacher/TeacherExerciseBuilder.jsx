import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createExercise,
  generateExerciseWithAI,
} from "../../services/exerciseService";

export default function TeacherExerciseBuilder() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("manual");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructions: "",
    type: "practice",
    category: "vocabulary",
    level: "beginner",
    targetAgeMin: 8,
    targetAgeMax: 18,
    hobbies: [],
    expectations: [],
    materials: "",
    isPublic: false,
    aiPrompt: "",
  });

  const hobbyOptions = [
    { value: "art_music", label: "אמנות ומוזיקה", icon: "🎶" },
    { value: "sports", label: "ספורט", icon: "⚽" },
    { value: "movies", label: "סרטים וסרטונים", icon: "🎬" },
    { value: "books", label: "ספרים וקריאה", icon: "📚" },
  ];

  const expectationOptions = [
    { value: "grammar", label: "דקדוק", icon: "🧠" },
    { value: "fluent_speaking", label: "דיבור שוטף", icon: "🗣️" },
    { value: "confidence", label: "ביטחון באנגלית", icon: "💪" },
    { value: "vocabulary", label: "אוצר מילים", icon: "📚" },
  ];

  // עדכון שדה רגיל בטופס
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // הוספה או הסרה של ערך ממערך
  const toggleArrayValue = (field, value) => {
    setForm((prev) => {
      const currentList = prev[field] || [];
      const exists = currentList.includes(value);

      return {
        ...prev,
        [field]: exists
          ? currentList.filter((item) => item !== value)
          : [...currentList, value],
      };
    });
  };

  // הפיכת תשובת AI למבנה תרגיל ברור עבור הטופס
  const normalizeAIExercise = (data) => {
    const aiExercise =
      data.exercise || data.generatedExercise || data.data || data;

    // אם ה-AI החזיר מערך שאלות כמו: [{ sentence, correctAnswer, hint }]
    if (Array.isArray(aiExercise)) {
      const instructionsText = aiExercise
        .map((item, index) => {
          return `${index + 1}. Complete the sentence:

${item.sentence || ""}

Hint: ${item.hint || "No hint provided"}`;
        })
        .join("\n\n--------------------\n\n");

      return {
        title: form.title || "Fill in the blanks exercise",
        description: "Complete the missing words in the sentences.",
        instructions: instructionsText,
      };
    }

    // אם ה-AI החזיר אובייקט מסודר
    return {
      title: aiExercise.title || form.title || "תרגיל באנגלית",
      description: aiExercise.description || "תרגיל שנוצר בעזרת AI",
      instructions:
        aiExercise.instructions ||
        aiExercise.content ||
        aiExercise.text ||
        "קראי את ההוראות ועני על התרגיל.",
    };
  };

  // יצירת טיוטת תרגיל בעזרת AI
  const handleGenerateWithAI = async () => {
    if (!form.aiPrompt.trim() && !form.title.trim()) {
      setMessage({
        type: "error",
        text: "כתבי נושא או בקשה ל־AI כדי ליצור תרגיל.",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setMessage({ type: "", text: "" });

      const aiData = {
        prompt: form.aiPrompt || form.title,
        topic: form.title,
        level: form.level,
        category: form.category,
        type: form.type,
        targetAges: {
          min: Number(form.targetAgeMin),
          max: Number(form.targetAgeMax),
        },
        hobbies: form.hobbies,
        expectations: form.expectations,
      };

      const data = await generateExerciseWithAI(aiData);
      console.log("AI exercise response:", data);

      const normalizedExercise = normalizeAIExercise(data);

      setForm((prev) => ({
        ...prev,
        title: normalizedExercise.title,
        description: normalizedExercise.description,
        instructions: normalizedExercise.instructions,
      }));

      setMode("manual");

      setMessage({
        type: "success",
        text: "ה־AI יצר טיוטת תרגיל. בדקי את ההוראות, ערכי לפי הצורך ואז שמרי.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsGenerating(false);
    }
  };

  // בדיקת תקינות בסיסית לפני שמירה
  const validateForm = () => {
    if (!form.title.trim()) return "כותרת תרגיל חובה";
    if (!form.instructions.trim()) return "הוראות התרגיל חובה";

    if (Number(form.targetAgeMin) > Number(form.targetAgeMax)) {
      return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי";
    }

    return "";
  };

  // שמירת התרגיל בשרת
  const handleSaveExercise = async () => {
    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setIsSaving(true);
      setMessage({ type: "", text: "" });

      const payload = {
        title: form.title,
        description: form.description,
        instructions: form.instructions,
        type: form.type,
        category: form.category,
        level: form.level,
        targetAgeMin: form.targetAgeMin,
        targetAgeMax: form.targetAgeMax,
        hobbies: JSON.stringify(form.hobbies),
        expectations: JSON.stringify(form.expectations),
        materials: JSON.stringify(
          form.materials
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean)
        ),
        isPublic: form.isPublic,
        createdByAI: Boolean(form.aiPrompt.trim()),
        aiPrompt: form.aiPrompt,
      };

      await createExercise(payload);

      setMessage({
        type: "success",
        text: "התרגיל נשמר בהצלחה!",
      });

      setTimeout(() => {
        navigate("/teacher/library");
      }, 900);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" dir="rtl">
      <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <button
          onClick={() => navigate("/teacher/create")}
          className="text-sm text-gray-400 hover:text-yellow-400 font-bold mb-6"
        >
          ← חזרה להעלאת תוכן
        </button>

        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-white mb-3">
              📝 יצירת תרגיל
            </h1>

            <p className="text-gray-400 max-w-3xl leading-relaxed">
              כאן אפשר ליצור תרגיל ידני או להיעזר ב־AI ליצירת טיוטה. לאחר
              השמירה, תרגיל מפורסם יוכל להיכנס למסלולים אישיים של תלמידים.
            </p>
          </div>

          <div className="bg-yellow-400 text-slate-950 rounded-3xl p-5 h-fit min-w-[190px] text-center">
            <div className="text-4xl mb-2">✨</div>
            <div className="font-black">AI Assisted</div>
          </div>
        </div>
      </section>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="border-b border-white/10 p-4 flex gap-2">
          <button
            onClick={() => setMode("manual")}
            className={`px-5 py-3 rounded-2xl font-bold transition-all ${
              mode === "manual"
                ? "bg-yellow-400 text-slate-950"
                : "bg-slate-950/60 text-gray-300 hover:bg-white/10"
            }`}
          >
            כתיבה ידנית
          </button>

          <button
            onClick={() => setMode("ai")}
            className={`px-5 py-3 rounded-2xl font-bold transition-all ${
              mode === "ai"
                ? "bg-indigo-500 text-white"
                : "bg-slate-950/60 text-gray-300 hover:bg-white/10"
            }`}
          >
            יצירה בעזרת AI
          </button>
        </div>

        <div className="p-6 space-y-8">
          {mode === "ai" && (
            <section className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-6">
              <h2 className="text-2xl font-black text-indigo-300 mb-3">
                ✨ בקשה ל־AI
              </h2>

              <p className="text-gray-400 text-sm mb-4">
                כתבי ל־AI איזה תרגיל את רוצה. לדוגמה: “צור תרגיל אוצר מילים
                לרמת מתחילים בנושא ספורט”.
              </p>

              <textarea
                rows="5"
                value={form.aiPrompt}
                onChange={(e) => updateField("aiPrompt", e.target.value)}
                placeholder="כתבי כאן בקשה ל־AI..."
                className="w-full bg-slate-950 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-indigo-400"
              />

              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-black px-8 py-3 rounded-xl transition-all"
              >
                {isGenerating ? "ה־AI יוצר תרגיל..." : "צור טיוטה בעזרת AI"}
              </button>
            </section>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TextInput
              label="כותרת התרגיל"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="לדוגמה: אוצר מילים בנושא ספורט"
            />

            <SelectInput
              label="סוג תרגיל"
              value={form.type}
              onChange={(value) => updateField("type", value)}
              options={[
                { value: "practice", label: "תרגול" },
                { value: "homework", label: "שיעורי בית" },
                { value: "project", label: "פרויקט" },
              ]}
            />

            <SelectInput
              label="קטגוריה"
              value={form.category}
              onChange={(value) => updateField("category", value)}
              options={[
                { value: "general", label: "כללי" },
                { value: "grammar", label: "דקדוק" },
                { value: "vocabulary", label: "אוצר מילים" },
                { value: "conversation", label: "שיחה" },
                { value: "reading", label: "קריאה" },
                { value: "listening", label: "האזנה" },
              ]}
            />

            <SelectInput
              label="רמה"
              value={form.level}
              onChange={(value) => updateField("level", value)}
              options={[
                { value: "beginner", label: "מתחילים" },
                { value: "intermediate", label: "בינוני" },
                { value: "advanced", label: "מתקדמים" },
              ]}
            />

            <NumberInput
              label="גיל מינימלי"
              value={form.targetAgeMin}
              onChange={(value) => updateField("targetAgeMin", value)}
            />

            <NumberInput
              label="גיל מקסימלי"
              value={form.targetAgeMax}
              onChange={(value) => updateField("targetAgeMax", value)}
            />
          </section>

          <section>
            <h2 className="text-xl font-black text-yellow-400 mb-4">
              התאמה לתחביבים
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hobbyOptions.map((hobby) => (
                <ChoiceButton
                  key={hobby.value}
                  isSelected={form.hobbies.includes(hobby.value)}
                  icon={hobby.icon}
                  label={hobby.label}
                  onClick={() => toggleArrayValue("hobbies", hobby.value)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-yellow-400 mb-4">
              התאמה למטרות לימוד
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {expectationOptions.map((item) => (
                <ChoiceButton
                  key={item.value}
                  isSelected={form.expectations.includes(item.value)}
                  icon={item.icon}
                  label={item.label}
                  onClick={() => toggleArrayValue("expectations", item.value)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-5">
            <TextArea
              label="תיאור קצר"
              value={form.description}
              onChange={(value) => updateField("description", value)}
              rows={3}
              placeholder="תיאור קצר של התרגיל..."
            />

            <TextArea
              label="הוראות התרגיל"
              value={form.instructions}
              onChange={(value) => updateField("instructions", value)}
              rows={8}
              placeholder="כאן יופיעו ההוראות לתלמיד. אם יצרת בעזרת AI, השדה הזה יתמלא אוטומטית."
            />

            <TextArea
              label="חומרי עזר, כל שורה קישור או הערה נפרדת"
              value={form.materials}
              onChange={(value) => updateField("materials", value)}
              rows={4}
              placeholder={"https://example.com\nמילים חשובות לתרגול..."}
            />
          </section>

          <section className="bg-slate-950/60 border border-white/10 rounded-3xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(e) => updateField("isPublic", e.target.checked)}
                className="w-5 h-5 accent-yellow-400"
              />

              <div>
                <div className="font-black text-white">
                  פרסם את התרגיל למסלולי תלמידים
                </div>

                <div className="text-gray-400 text-sm">
                  אם מסומן, התרגיל יוכל להיכנס לקורסים אישיים לאחר רענון.
                </div>
              </div>
            </label>
          </section>

          <section className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleSaveExercise}
              disabled={isSaving}
              className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-4 rounded-2xl transition-all"
            >
              {isSaving ? "שומר תרגיל..." : "שמור תרגיל"}
            </button>

            <button
              onClick={() => navigate("/teacher/library")}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
            >
              חזרה לספרייה
            </button>
          </section>
        </div>
      </section>
    </div>
  );
}

// שדה טקסט
function TextInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

// שדה מספר
function NumberInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type="number"
        min="4"
        max="120"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

// שדה בחירה
function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// שדה טקסט ארוך
function TextArea({ label, value, onChange, rows, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

// כפתור בחירה לתחביבים ומטרות
function ChoiceButton({ isSelected, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 rounded-2xl border transition-all ${
        isSelected
          ? "bg-yellow-400 text-slate-950 border-yellow-300"
          : "bg-slate-950 text-white border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="font-bold text-sm">{label}</div>
    </button>
  );
}