import React, { useState } from "react";
import { createLesson, uploadSong } from "../../services/teacherService";

export default function TeacherCreate() {
  const [contentType, setContentType] = useState("video");
  const [selectedIcon, setSelectedIcon] = useState("🧠");
  const [isDragging, setIsDragging] = useState(false);

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

  const iconsList = ["🧠", "💬", "🎵", "📚", "🚀", "📝", "🎧", "🗣️"];

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

  const hobbyOptions = [
    { value: "art_music", label: "🎶 אמנות ומוזיקה" },
    { value: "sports", label: "⚽ ספורט" },
    { value: "movies", label: "🎬 סרטים וסרטונים" },
    { value: "books", label: "📚 ספרים וקריאה" },
  ];

  const expectationOptions = [
    { value: "grammar", label: "🧠 דקדוק" },
    { value: "fluent_speaking", label: "🗣️ דיבור שוטף" },
    { value: "confidence", label: "💪 ביטחון באנגלית" },
    { value: "vocabulary", label: "📚 אוצר מילים" },
  ];

  const toggleArrayValue = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
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
    setSelectedIcon("🧠");
  };

  const validateForm = () => {
    if (!title.trim()) return "נא למלא כותרת";
    if (!topic.trim()) return "נא למלא נושא לימוד";
    if (!file) return "נא לבחור קובץ";
    if (Number(minAge) > Number(maxAge)) return "גיל מינימלי לא יכול להיות גדול מגיל מקסימלי";

    if (contentType === "audio") {
      if (!duration) return "נא למלא משך שיר";
      if (!composer.trim()) return "נא למלא מלחין";
      if (!lyricist.trim()) return "נא למלא כותב מילים";
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
    formData.append("icon", selectedIcon);

    formData.append("category", category);
    formData.append("level", level);
    formData.append("targetAgeMin", String(minAge));
    formData.append("targetAgeMax", String(maxAge));
    formData.append("hobbies", JSON.stringify(hobbies));
    formData.append("expectations", JSON.stringify(expectations));

    formData.append("lessonLanguage", "he");
    formData.append("isPublic", "true");

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
        text: contentType === "video" ? "השיעור עלה בהצלחה! 🚀" : "השיר עלה בהצלחה! 🎵",
      });

      resetForm();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold text-white">✨ יצירת והעלאת תוכן חכם</h1>
        <p className="text-gray-400 mt-1">
          כל תוכן שתעלי יקבל תגיות חכמות כדי שה־AI יוכל לשלב אותו במסלולים אישיים לתלמידים.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
        <button
          type="button"
          onClick={() => {
            setContentType("video");
            setFileName("");
            setFile(null);
          }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            contentType === "video"
              ? "bg-indigo-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🎬 שיעור וידאו
        </button>

        <button
          type="button"
          onClick={() => {
            setContentType("audio");
            setFileName("");
            setFile(null);
          }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            contentType === "audio"
              ? "bg-emerald-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🎵 שיר אודיו
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-400">פרטי התוכן</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                כותרת ה{contentType === "video" ? "שיעור" : "שיר"}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                placeholder="לדוגמה: Present Simple Rules"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                נושא לימוד
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
                placeholder="לדוגמה: Grammar Basics"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              תיאור קצר
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm"
              placeholder="מה התלמיד ילמד בתוכן הזה?"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-400">תיוג חכם ל־AI</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">קטגוריה</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              >
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">רמה</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              >
                {levels.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                גיל מינימלי
              </label>
              <input
                type="number"
                min="4"
                max="120"
                value={minAge}
                onChange={(e) => setMinAge(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                גיל מקסימלי
              </label>
              <input
                type="number"
                min="4"
                max="120"
                value={maxAge}
                onChange={(e) => setMaxAge(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-300 mb-3">
              מתאים לתחביבים
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hobbyOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleArrayValue(item.value, hobbies, setHobbies)}
                  className={`p-3 rounded-xl text-sm font-bold transition-all ${
                    hobbies.includes(item.value)
                      ? "bg-yellow-400 text-slate-950"
                      : "bg-slate-900 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-bold text-gray-300 mb-3">
              מתאים למטרות לימוד
            </label>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {expectationOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    toggleArrayValue(item.value, expectations, setExpectations)
                  }
                  className={`p-3 rounded-xl text-sm font-bold transition-all ${
                    expectations.includes(item.value)
                      ? "bg-indigo-400 text-slate-950"
                      : "bg-slate-900 text-gray-300 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {contentType === "audio" && (
          <section>
            <h2 className="text-xl font-bold mb-4 text-yellow-400">פרטי שיר</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  משך בשניות
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  מלחין
                </label>
                <input
                  type="text"
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  כותב מילים
                </label>
                <input
                  type="text"
                  value={lyricist}
                  onChange={(e) => setLyricist(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-4 text-yellow-400">קובץ מדיה</h2>

          <div className="mb-5">
            <label className="block text-sm font-bold text-gray-300 mb-2">
              בחרי אייקון מייצג
            </label>

            <div className="flex gap-3 flex-wrap">
              {iconsList.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 text-xl rounded-xl flex items-center justify-center transition-all border ${
                    selectedIcon === icon
                      ? "bg-yellow-500 border-yellow-400 text-black scale-110"
                      : "bg-slate-900 border-white/10 text-white"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all hover:border-indigo-500 ${
              isDragging
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-white/25 bg-slate-900/50"
            }`}
          >
            <input
              type="file"
              accept={contentType === "video" ? "video/*" : "audio/*"}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />

            <span className="text-4xl mb-3 block relative z-0">
              {contentType === "video" ? "📹" : "🎧"}
            </span>

            <p className="text-gray-300 font-bold text-sm relative z-0">
              {fileName ? `✅ קובץ נבחר: ${fileName}` : "גררי לכאן או לחצי לבחירה"}
            </p>
          </div>
        </section>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-all ${
            contentType === "video"
              ? "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50"
              : "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50"
          }`}
        >
          {isLoading ? "מעלה לשרת..." : "שמור והעלה תוכן חכם 🚀"}
        </button>
      </div>
    </div>
  );
}