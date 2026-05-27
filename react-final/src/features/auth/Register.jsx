import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser as registerAction } from "../../redux/slices/authSlice";
import { registerNewUser } from "../../services/authService";
import { useRegister } from "./userRegister";

const StepName = ({ value, update }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-2xl font-bold text-white text-center">
      איך קוראים לך? 👋
    </h2>

    <input
      autoFocus
      type="text"
      value={value}
      onChange={(e) => update({ username: e.target.value })}
      placeholder="הקלד/י את השם שלך כאן"
      className="p-4 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none text-center text-lg"
    />
  </div>
);

const StepGender = ({ value, update, username }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-2xl font-bold text-white text-center">
      שמחים להכיר, <span className="text-yellow-400">{username}</span>!
    </h2>

    <p className="text-gray-300 text-center">בחר/י אפשרות:</p>

    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => update({ gender: "male" })}
        className={`p-6 rounded-2xl text-xl font-bold transition-all flex flex-col items-center gap-2 ${
          value === "male"
            ? "bg-blue-500 text-white scale-105 shadow-lg"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <span className="text-3xl">👦</span>
        בן
      </button>

      <button
        type="button"
        onClick={() => update({ gender: "female" })}
        className={`p-6 rounded-2xl text-xl font-bold transition-all flex flex-col items-center gap-2 ${
          value === "female"
            ? "bg-pink-500 text-white scale-105 shadow-lg"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        <span className="text-3xl">👧</span>
        בת
      </button>
    </div>
  </div>
);

const StepAge = ({ value, update, username }) => {
  const ages = ["6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

  return (
    <div className="flex flex-col gap-5 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">
        מה הגיל שלך, <span className="text-yellow-400">{username}</span>? 🎉
      </h2>

      <div className="flex flex-wrap justify-center gap-3 max-h-[180px] overflow-y-auto p-2">
        {ages.map((age) => (
          <button
            type="button"
            key={age}
            onClick={() => update({ age })}
            className={`w-14 h-14 rounded-full font-bold text-lg flex items-center justify-center transition-all shadow-md ${
              value === age
                ? "bg-yellow-400 text-slate-900 scale-110"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {age}
          </button>
        ))}
      </div>
    </div>
  );
};

const StepParentOrChild = ({ value, update }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-2xl font-bold text-white text-center">
      מי משתמש באתר?
    </h2>

    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={() => update({ parentOrChild: "child" })}
        className={`p-6 rounded-2xl text-xl font-bold transition-all ${
          value === "child"
            ? "bg-yellow-400 text-slate-950 scale-105"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        🎒 ילד/ה
      </button>

      <button
        type="button"
        onClick={() => update({ parentOrChild: "parent" })}
        className={`p-6 rounded-2xl text-xl font-bold transition-all ${
          value === "parent"
            ? "bg-yellow-400 text-slate-950 scale-105"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        👨‍👩‍👧 הורה
      </button>
    </div>
  </div>
);

const StepLevel = ({ value, update, username }) => {
  const levels = [
    {
      id: "beginner",
      title: "מתחיל/ה 🎯",
      desc: "אני מכיר/ה אותיות ומילים בסיסיות",
    },
    {
      id: "intermediate",
      title: "בינוני/ת 🚀",
      desc: "אני מסוגל/ת לקרוא ולהבין משפטים פשוטים",
    },
    {
      id: "advanced",
      title: "מתקדם/ת 👑",
      desc: "אני מבין/ה אנגלית ברמה גבוהה יחסית",
    },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">
        מה רמת האנגלית שלך,{" "}
        <span className="text-yellow-400">{username}</span>?
      </h2>

      <div className="flex flex-col gap-3">
        {levels.map((level) => (
          <button
            type="button"
            key={level.id}
            onClick={() => update({ englishLevel: level.id })}
            className={`p-4 rounded-xl text-right transition-all border-2 ${
              value === level.id
                ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-lg"
                : "bg-white/5 text-white border-transparent hover:bg-white/10"
            }`}
          >
            <div className="font-bold text-lg">{level.title}</div>
            <div
              className={`text-sm ${
                value === level.id ? "text-slate-800" : "text-gray-300"
              }`}
            >
              {level.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const StepHobbies = ({ selectedList, toggle }) => {
  const hobbies = [
    { id: "art_music", label: "🎶 אמנות ומוזיקה" },
    { id: "sports", label: "⚽ ספורט" },
    { id: "movies", label: "🎬 סרטים וסרטונים" },
    { id: "books", label: "📚 ספרים וקריאה" },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">
        מה התחביבים שלך?
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {hobbies.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => toggle("favoriteHobbies", item.id)}
            className={`p-4 rounded-xl font-semibold text-center transition-all ${
              selectedList.includes(item.id)
                ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-950 scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const StepExpectations = ({ selectedList, toggle }) => {
  const expectations = [
    { id: "grammar", label: "🧠 דקדוק" },
    { id: "fluent_speaking", label: "🗣️ דיבור שוטף" },
    { id: "confidence", label: "💪 ביטחון באנגלית" },
    { id: "vocabulary", label: "📚 אוצר מילים" },
  ];

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h2 className="text-2xl font-bold text-white text-center">
        במה היית רוצה להשתפר?
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {expectations.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => toggle("expectations", item.id)}
            className={`p-4 rounded-xl font-semibold text-center transition-all ${
              selectedList.includes(item.id)
                ? "bg-gradient-to-r from-indigo-400 to-cyan-400 text-slate-950 scale-105"
                : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const StepContact = ({ value, update }) => (
  <div className="flex flex-col gap-4 animate-fadeIn">
    <h2 className="text-yellow-400 font-bold text-xl text-center mb-2">
      המסלול שלך מוכן! נשארו פרטים אחרונים 🎉
    </h2>

    <input
      type="email"
      value={value.email}
      onChange={(e) => update({ email: e.target.value })}
      placeholder="אימייל"
      className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none"
    />

    <input
      type="tel"
      value={value.phone}
      onChange={(e) => update({ phone: e.target.value })}
      placeholder="מספר טלפון"
      className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none"
    />

    <input
      type="password"
      value={value.password}
      onChange={(e) => update({ password: e.target.value })}
      placeholder="סיסמה"
      className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none"
    />

    <input
      type="password"
      value={value.confirmPassword}
      onChange={(e) => update({ confirmPassword: e.target.value })}
      placeholder="אימות סיסמה"
      className="p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:border-yellow-400 border-2 border-transparent outline-none"
    />
  </div>
);

export default function Register() {
  const totalSteps = 7;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentStep,
    formData,
    isLoadingPath,
    nextStep,
    prevStep,
    updateFields,
    toggleArrayValue,
    isFirstStep,
    isLastStep,
  } = useRegister(totalSteps);

  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progressPercent = (currentStep / totalSteps) * 100;

  const canContinue = () => {
    if (currentStep === 1 && !formData.username.trim()) return false;
    if (currentStep === 2 && !formData.gender) return false;
    if (currentStep === 3 && !formData.age) return false;
    if (currentStep === 4 && !formData.parentOrChild) return false;
    if (currentStep === 5 && !formData.englishLevel) return false;
    if (currentStep === 6 && formData.favoriteHobbies.length === 0) return false;

    if (currentStep === 7) {
      if (!formData.email.trim()) return false;
      if (!formData.phone.trim()) return false;
      if (!formData.password.trim()) return false;
      if (formData.password.length < 6) return false;
      if (formData.password !== formData.confirmPassword) return false;
    }

    return true;
  };

  const buildRegisterPayload = () => ({
    username: formData.username.trim(),
    email: formData.email.trim().toLowerCase(),
    password: formData.password,
    phone: formData.phone.trim(),
    age: Number(formData.age),
    gender: formData.gender,
    parentOrChild: formData.parentOrChild,
    favoriteHobbies: formData.favoriteHobbies,
    expectations: formData.expectations,
    englishLevel: formData.englishLevel,
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!canContinue()) return;

    if (!isLastStep) {
      nextStep();
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildRegisterPayload();
      const data = await registerNewUser(payload);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch(registerAction(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setServerError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingPath) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-900 flex flex-col items-center justify-center p-4"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="text-6xl animate-spin">⚙️</div>
          <h2 className="text-3xl font-bold text-white text-center">
            מכינים לך את המסלול המושלם...
          </h2>
          <p className="text-gray-300 text-center">
            אנחנו מתאימים את הלמידה לפי הגיל, הרמה והתחביבים שלך
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-blue-900 flex flex-col items-center justify-center p-4"
      dir="rtl"
    >
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl flex flex-col gap-6"
      >
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="text-center text-sm text-gray-400">
          שלב {currentStep} מתוך {totalSteps}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-3 text-sm text-center font-bold">
            {serverError}
          </div>
        )}

        {currentStep === 7 &&
          formData.password &&
          formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl p-3 text-sm text-center font-bold">
              הסיסמאות אינן תואמות
            </div>
          )}

        <div className="min-h-[300px] flex flex-col justify-center">
          {currentStep === 1 && (
            <StepName value={formData.username} update={updateFields} />
          )}

          {currentStep === 2 && (
            <StepGender
              value={formData.gender}
              update={updateFields}
              username={formData.username}
            />
          )}

          {currentStep === 3 && (
            <StepAge
              value={formData.age}
              update={updateFields}
              username={formData.username}
            />
          )}

          {currentStep === 4 && (
            <StepParentOrChild
              value={formData.parentOrChild}
              update={updateFields}
            />
          )}

          {currentStep === 5 && (
            <StepLevel
              value={formData.englishLevel}
              update={updateFields}
              username={formData.username}
            />
          )}

          {currentStep === 6 && (
            <div className="flex flex-col gap-6">
              <StepHobbies
                selectedList={formData.favoriteHobbies}
                toggle={toggleArrayValue}
              />

              <StepExpectations
                selectedList={formData.expectations}
                toggle={toggleArrayValue}
              />
            </div>
          )}

          {currentStep === 7 && (
            <StepContact value={formData} update={updateFields} />
          )}
        </div>

        <div className="flex justify-between items-center mt-4 gap-4">
          {!isFirstStep && (
            <button
              type="button"
              onClick={prevStep}
              className="text-white font-semibold hover:underline px-4 py-2"
            >
              חזור
            </button>
          )}

          <button
            type="submit"
            disabled={!canContinue() || isSubmitting}
            className={`flex-1 font-bold py-4 rounded-xl shadow-lg transition-all text-center ${
              canContinue() && !isSubmitting
                ? "bg-yellow-400 hover:bg-yellow-300 text-slate-950 cursor-pointer"
                : "bg-white/10 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting
              ? "שומר משתמש..."
              : currentStep === 6
              ? "הכן לי מסלול! ✨"
              : isLastStep
              ? "שמור וסיים 🚀"
              : "המשך"}
          </button>
        </div>
      </form>
    </div>
  );
}