import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPersonalizedCourse } from "../../services/courseService";

export default function CreatePersonalCourse() {
  const navigate = useNavigate();

  const [customTitle, setCustomTitle] = useState("");
  const [englishLevel, setEnglishLevel] = useState("beginner");
  const [favoriteHobbies, setFavoriteHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const levelOptions = [
    { value: "beginner", label: "מתחילים", icon: "🌱" },
    { value: "intermediate", label: "בינוני", icon: "🚀" },
    { value: "advanced", label: "מתקדמים", icon: "🏆" },
  ];

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

  // הוספה או הסרה של ערך מתוך מערך בחירה
  const toggleArrayValue = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }

    setList([...list, value]);
  };

  // בדיקה בסיסית לפני יצירת קורס
  const validateForm = () => {
    if (favoriteHobbies.length === 0) return "בחרי לפחות תחביב אחד";
    if (expectations.length === 0) return "בחרי לפחות מטרה לימודית אחת";
    return "";
  };

  // יצירת קורס אישי נוסף לפי הבחירות של התלמיד
  const handleCreateCourse = async () => {
    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    try {
      setIsLoading(true);
      setMessage({ type: "", text: "" });

      const payload = {
        customTitle: customTitle.trim(),
        englishLevel,
        favoriteHobbies,
        expectations,
      };

      const data = await createPersonalizedCourse(payload);

      setMessage({
        type: "success",
        text: "הקורס האישי החדש נוצר בהצלחה! מעבירים אותך אליו...",
      });

      setTimeout(() => {
        if (data.course?._id) {
          navigate(`/course/${data.course._id}`);
        } else {
          navigate("/courses");
        }
      }, 900);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir="rtl">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
        <h1 className="text-4xl font-black text-white mb-3">
          ✨ בניית קורס אישי נוסף
        </h1>

        <p className="text-gray-400 leading-relaxed max-w-3xl">
          כאן אפשר לבנות מסלול חדש בלי להירשם מחדש. בחרי רמה, תחומי עניין
          ומטרות לימוד — והמערכת תרכיב לך קורס נוסף מתוך התכנים שפורסמו.
        </p>
      </div>

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

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            שם הקורס
          </h2>

          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="לדוגמה: קורס אנגלית דרך ספרים וסרטונים"
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-white focus:border-yellow-400 outline-none"
          />

          <p className="text-gray-500 text-sm mt-2">
            לא חובה. אם לא תמלאי שם, המערכת תיצור שם אוטומטי.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            בחרי רמת אנגלית
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelOptions.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setEnglishLevel(level.value)}
                className={`p-5 rounded-2xl border text-right transition-all ${
                  englishLevel === level.value
                    ? "bg-yellow-400 text-slate-950 border-yellow-300"
                    : "bg-slate-900 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="text-3xl mb-2">{level.icon}</div>
                <div className="font-black text-lg">{level.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            מה מעניין אותך?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hobbyOptions.map((hobby) => (
              <button
                key={hobby.value}
                type="button"
                onClick={() =>
                  toggleArrayValue(
                    hobby.value,
                    favoriteHobbies,
                    setFavoriteHobbies
                  )
                }
                className={`p-5 rounded-2xl border transition-all ${
                  favoriteHobbies.includes(hobby.value)
                    ? "bg-indigo-500 text-white border-indigo-300"
                    : "bg-slate-900 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="text-3xl mb-2">{hobby.icon}</div>
                <div className="font-bold text-sm">{hobby.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">
            מה המטרה שלך בקורס הזה?
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {expectationOptions.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  toggleArrayValue(item.value, expectations, setExpectations)
                }
                className={`p-5 rounded-2xl border transition-all ${
                  expectations.includes(item.value)
                    ? "bg-emerald-500 text-white border-emerald-300"
                    : "bg-slate-900 text-white border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-bold text-sm">{item.label}</div>
              </button>
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            onClick={handleCreateCourse}
            disabled={isLoading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg"
          >
            {isLoading ? "בונה לך קורס..." : "בנה לי קורס אישי נוסף 🚀"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/10 transition-all"
          >
            חזרה לקורסים שלי
          </button>
        </div>
      </div>
    </div>
  );
}