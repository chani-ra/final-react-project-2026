import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser as registerAction } from "../../redux/slices/authSlice";
import { registerNewUser } from "../../services/authService";
import { useRegister } from "./userRegister";
import skyJourneyBackground from "../../assets/sky-journey-background.svg";

const inputClass =
  "w-full rounded-[1.45rem] border-2 border-white/20 bg-white/10 px-5 py-4 text-lg font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15";

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

  const favoriteHobbies = formData.favoriteHobbies || [];
  const expectations = formData.expectations || [];

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const canContinue = () => {
    if (currentStep === 1 && !formData.username.trim()) return false;
    if (currentStep === 2 && !formData.gender) return false;
    if (currentStep === 3 && !formData.age) return false;
    if (currentStep === 4 && !formData.parentOrChild) return false;
    if (currentStep === 5 && !formData.englishLevel) return false;

    if (currentStep === 6) {
      if (favoriteHobbies.length === 0) return false;
      if (expectations.length === 0) return false;
    }

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
    favoriteHobbies,
    expectations,
    englishLevel: formData.englishLevel,
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
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
      localStorage.setItem("refreshToken", data.refreshToken || "");
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

  const handleEnterMoveNext = (event) => {
    if (event.key !== "Enter") return;
    if (event.target.tagName === "TEXTAREA") return;

    event.preventDefault();

    if (!canContinue() || isSubmitting) return;

    event.currentTarget.requestSubmit();
  };

  if (isLoadingPath) {
    return (
      <AuthBackground>
        <main className="relative z-10 flex min-h-screen items-center justify-center px-5">
          <div
            className="w-full max-w-2xl rounded-[2.5rem] border-2 border-white/25 bg-slate-950/65 p-8 text-center text-white backdrop-blur-xl"
            style={{
              boxShadow:
                "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
            }}
          >
            <LoadingCircle />

            <h2 className="mt-6 text-4xl font-black">
              מכינים עבורך את המסלול
            </h2>

            <p className="mt-4 text-lg font-semibold leading-8 text-white/70">
              המערכת מעבדת את הנתונים ובונה חוויית לימוד מתאימה.
            </p>
          </div>
        </main>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <header className="relative z-20 px-5 py-5">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between rounded-full border-2 border-white/25 bg-slate-950/55 px-5 py-3 backdrop-blur-xl"
          style={{
            boxShadow:
              "0 18px 55px rgba(3,31,61,0.38), inset 0 1px 0 rgba(255,255,255,0.16)",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-2xl font-black tracking-tight text-white md:text-3xl"
          >
            EnglishWise
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border-2 border-white/25 bg-white/10 px-5 py-2.5 text-sm font-black text-white transition hover:bg-white/20"
            >
              דף הבית
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-2.5 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
            >
              התחברות
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-110px)] max-w-5xl items-center px-5 pb-10">
        <form
          onSubmit={handleFormSubmit}
          onKeyDown={handleEnterMoveNext}
          className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border-2 border-white/25 bg-slate-950/65 p-6 text-white backdrop-blur-xl md:p-8"
          style={{
            boxShadow:
              "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

          <div className="relative z-10">
            <div className="mb-7">
              <div className="mb-3 flex items-center justify-between gap-4">
                <span className="text-sm font-black text-white/65">
                  שלב {currentStep} מתוך {totalSteps}
                </span>

                <span className="rounded-full border border-yellow-300/45 bg-yellow-300/15 px-3 py-1 text-xs font-black text-yellow-100">
                  {progressPercent}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-yellow-300 shadow-[0_0_18px_rgba(253,224,71,0.45)] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {serverError && (
              <div className="mb-4 rounded-2xl border-2 border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-black text-red-100">
                {serverError}
              </div>
            )}

            {currentStep === 7 &&
              formData.password &&
              formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <div className="mb-4 rounded-2xl border-2 border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-black text-red-100">
                  הסיסמאות אינן תואמות
                </div>
              )}

            <div className="min-h-[390px]">
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
                <StepHobbies
                  favoriteHobbies={favoriteHobbies}
                  expectations={expectations}
                  toggle={toggleArrayValue}
                />
              )}

              {currentStep === 7 && (
                <StepContact value={formData} update={updateFields} />
              )}
            </div>

            <div className="mt-6 flex items-center gap-3">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="rounded-full border-2 border-white/22 bg-white/10 px-6 py-3.5 text-sm font-black text-white transition hover:bg-white/16"
                >
                  חזור
                </button>
              )}

              <button
                type="submit"
                disabled={!canContinue() || isSubmitting}
                className="flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-8 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow:
                    !canContinue() || isSubmitting
                      ? "none"
                      : "0 7px 0 rgba(89,15,20,0.42)",
                }}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-3">
                    <SmallSpinner />
                    שומרת...
                  </span>
                ) : isLastStep ? (
                  "שמירה וסיום"
                ) : (
                  "המשך"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </AuthBackground>
  );
}

function AuthBackground({ children }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-sky-500 text-white"
      dir="rtl"
    >
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${skyJourneyBackground})` }}
      />

      <div className="fixed inset-0 bg-gradient-to-b from-sky-900/10 via-blue-900/20 to-slate-950/55" />

      {children}
    </div>
  );
}

function StepBlock({ title, text, children }) {
  return (
    <div>
      <h1
        className="text-4xl font-black leading-tight text-white md:text-5xl"
        style={{
          textShadow:
            "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
        }}
      >
        {title}
      </h1>

      {text && (
        <p className="mt-3 max-w-2xl text-base font-semibold leading-8 text-white/68">
          {text}
        </p>
      )}

      <div className="mt-6">{children}</div>
    </div>
  );
}

function StepName({ value, update }) {
  return (
    <StepBlock
      title="איך קוראים לך?"
      text="נתחיל מהשם, ומשם נבנה לך מסלול לימוד אישי וברור."
    >
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(event) => update({ username: event.target.value })}
        placeholder="השם שלך"
        className={inputClass}
      />
    </StepBlock>
  );
}

function StepGender({ value, update, username }) {
  return (
    <StepBlock
      title={`נעים להכיר${username ? `, ${username}` : ""}`}
      text="בחרי אפשרות כדי שנוכל להשלים את הפרופיל."
    >
      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton
          active={value === "male"}
          onClick={() => update({ gender: "male" })}
        >
          בן
        </ChoiceButton>

        <ChoiceButton
          active={value === "female"}
          onClick={() => update({ gender: "female" })}
        >
          בת
        </ChoiceButton>
      </div>
    </StepBlock>
  );
}

function StepAge({ value, update, username }) {
  const ages = [
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "18+", value: "18" },
  ];

  return (
    <StepBlock
      title={`מה הגיל שלך${username ? `, ${username}` : ""}?`}
      text="הגיל עוזר להתאים את סגנון התכנים ואת רמת הלמידה."
    >
      <div className="flex flex-wrap justify-center gap-3">
        {ages.map((age) => (
          <button
            type="button"
            key={age.value}
            onClick={() => update({ age: age.value })}
            className={`group relative h-16 w-16 overflow-hidden rounded-full border-2 text-lg font-black transition ${
              value === age.value
                ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_28px_rgba(253,224,71,0.34)]"
                : "border-white/22 bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] hover:border-yellow-300/55 hover:bg-white/16"
            }`}
          >
            <span className="relative z-10">{age.label}</span>

            <span
              className={`pointer-events-none absolute inset-1 rounded-full ${
                value === age.value
                  ? "bg-white/22"
                  : "bg-gradient-to-b from-white/12 to-transparent"
              }`}
            />
          </button>
        ))}
      </div>
    </StepBlock>
  );
}

function StepParentOrChild({ value, update }) {
  return (
    <StepBlock
      title="מי משתמש באתר?"
      text="בחרי את סוג המשתמשת כדי להתאים את חוויית ההתחלה."
    >
      <div className="grid grid-cols-2 gap-3">
        <ChoiceButton
          active={value === "child"}
          onClick={() => update({ parentOrChild: "child" })}
        >
          תלמידה
        </ChoiceButton>

        <ChoiceButton
          active={value === "parent"}
          onClick={() => update({ parentOrChild: "parent" })}
        >
          הורה
        </ChoiceButton>
      </div>
    </StepBlock>
  );
}

function StepLevel({ value, update, username }) {
  const levels = [
    {
      id: "beginner",
      title: "מתחילה",
      desc: "מתאים למי שרוצה לבנות בסיס יציב וברור.",
    },
    {
      id: "intermediate",
      title: "בינונית",
      desc: "מתאים למי שכבר מבינה ורוצה להתחזק.",
    },
    {
      id: "advanced",
      title: "מתקדמת",
      desc: "מתאים למי שרוצה לדייק, להרחיב ולדבר טוב יותר.",
    },
  ];

  return (
    <StepBlock
      title={`מה רמת האנגלית שלך${username ? `, ${username}` : ""}?`}
      text="הרמה עוזרת למערכת להתחיל מהמקום הנכון."
    >
      <div className="space-y-3">
        {levels.map((level) => (
          <button
            type="button"
            key={level.id}
            onClick={() => update({ englishLevel: level.id })}
            className={`w-full rounded-[1.55rem] border-2 p-4 text-right transition ${
              value === level.id
                ? "border-yellow-300 bg-yellow-300/15 text-white shadow-[0_0_24px_rgba(253,224,71,0.14)]"
                : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
            }`}
          >
            <div className="text-lg font-black">{level.title}</div>
            <div className="mt-1 text-sm font-semibold leading-6 text-white/62">
              {level.desc}
            </div>
          </button>
        ))}
      </div>
    </StepBlock>
  );
}

function StepHobbies({ favoriteHobbies, expectations, toggle }) {
  const hobbies = [
    { id: "art_music", label: "אמנות ומוזיקה" },
    { id: "sports", label: "ספורט" },
    { id: "movies", label: "סרטים וסרטונים" },
    { id: "books", label: "ספרים וקריאה" },
  ];

  const expectationOptions = [
    { id: "grammar", label: "דקדוק" },
    { id: "fluent_speaking", label: "דיבור שוטף" },
    { id: "confidence", label: "ביטחון באנגלית" },
    { id: "vocabulary", label: "אוצר מילים" },
  ];

  return (
    <div className="space-y-7">
      <StepBlock
        title="מה מעניין אותך?"
        text="בחרי לפחות תחום אחד שמעניין אותך."
      >
        <div className="grid grid-cols-2 gap-3">
          {hobbies.map((item) => (
            <ChoiceButton
              key={item.id}
              active={favoriteHobbies.includes(item.id)}
              onClick={() => toggle("favoriteHobbies", item.id)}
            >
              {item.label}
            </ChoiceButton>
          ))}
        </div>
      </StepBlock>

      <StepBlock
        title="במה תרצי להתקדם?"
        text="כאן אפשר לבחור כמה מטרות לימוד."
      >
        <div className="grid grid-cols-2 gap-3">
          {expectationOptions.map((item) => (
            <ChoiceButton
              key={item.id}
              active={expectations.includes(item.id)}
              onClick={() => toggle("expectations", item.id)}
            >
              {item.label}
            </ChoiceButton>
          ))}
        </div>
      </StepBlock>
    </div>
  );
}

function StepContact({ value, update }) {
  return (
    <StepBlock
      title="כמעט סיימנו"
      text="נשמור את הפרטים כדי שתוכלי לחזור למסלול שלך בכל כניסה."
    >
      <div className="space-y-3">
        <input
          type="email"
          value={value.email}
          onChange={(event) => update({ email: event.target.value })}
          placeholder="אימייל"
          className={inputClass}
        />

        <input
          type="tel"
          value={value.phone}
          onChange={(event) => update({ phone: event.target.value })}
          placeholder="מספר טלפון"
          className={inputClass}
        />

        <input
          type="password"
          value={value.password}
          onChange={(event) => update({ password: event.target.value })}
          placeholder="סיסמה"
          className={inputClass}
        />

        <input
          type="password"
          value={value.confirmPassword}
          onChange={(event) => update({ confirmPassword: event.target.value })}
          placeholder="אימות סיסמה"
          className={inputClass}
        />
      </div>
    </StepBlock>
  );
}

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[1.45rem] border-2 px-5 py-4 text-center font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_24px_rgba(253,224,71,0.28)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingCircle() {
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
    </div>
  );
}

function SmallSpinner() {
  return (
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}