import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { registerUser as registerAction } from "../../redux/slices/authSlice";
import { registerNewUser } from "../../services/authService";
import { getHomePathForRole, saveAuthSession } from "../../services/authSession";
import { useRegister } from "./userRegister";
import { validateRegisterStep } from "./registerValidation";
import { AuthBackground, StepName, StepGender, StepAge, StepParentOrChild, StepLevel, StepHobbies, StepContact, LoadingCircle, SmallSpinner } from "./RegisterSteps";

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

  const [showErrors, setShowErrors] = useState(false);
  const validationErrors = validateRegisterStep(currentStep, formData);
  const firstError = Object.values(validationErrors)[0];

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

    setShowErrors(true);
    if (Object.keys(validationErrors).length) return;
    setShowErrors(false);

    if (!isLastStep) {
      nextStep();
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = buildRegisterPayload();
      const data = await registerNewUser(payload);

      const user = saveAuthSession(data.user, data.token, data.refreshToken);
      dispatch(registerAction(user));
      navigate(getHomePathForRole(user.role));
    } catch (error) {
      setServerError(error.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnterMoveNext = (event) => {
    if (
      event.key !== "Enter" ||
      event.nativeEvent?.isComposing ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    ) return;

    if (event.target.tagName === "TEXTAREA") return;

    if (event.target.tagName === "BUTTON") {
      if (
        event.target.hasAttribute("data-register-choice") &&
        event.target.getAttribute("aria-pressed") === "true"
      ) {
        event.preventDefault();
        if (!isSubmitting) event.currentTarget.requestSubmit();
      }
      return;
    }

    event.preventDefault();

    if (
      currentStep === 7 &&
      event.target.hasAttribute("data-register-contact")
    ) {
      const inputs = [
        ...event.currentTarget.querySelectorAll("[data-register-contact]")
      ];
      const index = inputs.indexOf(event.target);

      if (index >= 0 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else if (!isSubmitting) {
        event.currentTarget.requestSubmit();
      }
    } else if (!isSubmitting) {
      event.currentTarget.requestSubmit();
    }
  };

  const goBack = () => {
    setShowErrors(false);
    setServerError("");
    prevStep();
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
      <header className="relative z-20 px-3 py-3 sm:px-5 sm:py-5">
        <div
          className="mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-[1.5rem] sm:rounded-full border-2 border-white/25 bg-slate-950/55 px-3 py-3 backdrop-blur-xl sm:px-5"
          style={{
            boxShadow:
              "0 18px 55px rgba(3,31,61,0.38), inset 0 1px 0 rgba(255,255,255,0.16)",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="shrink-0 text-lg font-black tracking-tight text-white sm:text-2xl md:text-3xl"
          >
            EnglishWise
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border-2 border-white/25 bg-white/10 px-2.5 py-2 text-xs font-black sm:px-5 sm:py-2.5 sm:text-sm text-white transition hover:bg-white/20"
            >
              דף הבית
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-2.5 py-2 text-xs font-black sm:px-6 sm:py-2.5 sm:text-sm text-yellow-100 transition hover:bg-yellow-300/25"
            >
              התחברות
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100dvh-86px)] max-w-5xl items-start px-3 pb-6 sm:items-center sm:px-5 sm:pb-10">
        <form
          onSubmit={handleFormSubmit}
          onKeyDown={handleEnterMoveNext}
          noValidate
          className="relative mx-auto w-full min-w-0 max-w-3xl overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-white/25 bg-slate-950/65 p-4 text-white backdrop-blur-xl sm:p-6 md:p-8"
          style={{
            boxShadow:
              "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

          <div className="relative z-10">
            <div className="mb-5 sm:mb-7">
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

            {showErrors && firstError && (
              <div
                role="alert"
                className="mb-4 rounded-2xl border-2 border-red-300/35 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-100"
              >
                {firstError}
              </div>
            )}

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

            <div className="min-h-0 sm:min-h-[390px]">
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
                <StepContact value={formData} update={updateFields} errors={showErrors ? validationErrors : {}} />
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full rounded-full border-2 border-white/22 bg-white/10 px-6 py-3.5 sm:w-auto text-sm font-black text-white transition hover:bg-white/16"
                >
                  חזור
                </button>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-8 py-4 text-base font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow:
                    isSubmitting
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

