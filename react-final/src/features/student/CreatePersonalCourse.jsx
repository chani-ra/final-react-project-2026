import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPersonalizedCourse } from "../../services/courseService";
import AppFeedbackModal from "../../components/ui/AppFeedbackModal";

export default function CreatePersonalCourse() {
  const navigate = useNavigate();

  const [customTitle, setCustomTitle] = useState("");
  const [englishLevel, setEnglishLevel] = useState("beginner");
  const [favoriteHobbies, setFavoriteHobbies] = useState([]);
  const [expectations, setExpectations] = useState([]);

  const [createdCourseId, setCreatedCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [successOpen, setSuccessOpen] = useState(false);

  const levelOptions = [
    {
      value: "beginner",
      label: "מתחילים",
      description: "מתאים ללמידה בסיסית ומסודרת",
    },
    {
      value: "intermediate",
      label: "בינוני",
      description: "מתאים לחיזוק שטף, הבנה ותרגול",
    },
    {
      value: "advanced",
      label: "מתקדמים",
      description: "מתאים להרחבה ולדיוק באנגלית",
    },
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

  const toggleArrayValue = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
      return;
    }

    setList([...list, value]);
  };

  const validateForm = () => {
    if (favoriteHobbies.length === 0) return "בחרי לפחות תחום עניין אחד.";
    if (expectations.length === 0) return "בחרי לפחות מטרה לימודית אחת.";
    return "";
  };

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
      const newCourseId = data.course?._id;

      setCreatedCourseId(newCourseId || null);
      setSuccessOpen(true);

      setMessage({
        type: "success",
        text: "הקורס האישי נוצר בהצלחה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setIsLoading(false);
    }
  };

  const goToCreatedCourse = () => {
    if (createdCourseId) {
      navigate(`/course/${createdCourseId}`);
      return;
    }

    navigate("/courses");
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <button
          type="button"
          onClick={() => navigate("/courses")}
          className="absolute left-5 top-5 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/24 bg-white/12 text-3xl font-black text-white shadow-lg transition hover:bg-white/22"
          aria-label="חזרה לקורסים"
        >
          ×
        </button>

        <div className="relative z-10 p-4 md:p-6">
          <header className="mb-5 pl-14">
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-bold text-white/82 transition hover:bg-white/16 hover:text-white"
            >
              <span>→</span>
              <span>חזרה לקורסים שלי</span>
            </button>

            <div className="mb-2 inline-flex rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-3 py-1 text-xs font-bold text-[#ffe89a]">
              יצירת מסלול אישי
            </div>

            <h1
              className="text-3xl font-black leading-tight md:text-5xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.54), -1px -1px 0 rgba(15,76,117,0.86), 0 14px 30px rgba(7,89,133,0.38)",
              }}
            >
              בניית קורס אישי
            </h1>

            <p className="mt-3 max-w-4xl text-sm font-bold leading-relaxed text-white/68 md:text-base">
              בחרי רמה, תחומי עניין ומטרות לימוד. המערכת תיצור עבורך מסלול
              אנגלית אישי וממוקד.
            </p>
          </header>

          {message.text && (
            <div
              className={`mb-5 rounded-[1.5rem] px-5 py-4 text-sm font-bold shadow-[0_12px_32px_rgba(3,31,61,0.16)] ${
                message.type === "success"
                  ? "border border-emerald-300/28 bg-emerald-400/14 text-emerald-100"
                  : "border border-red-300/30 bg-red-500/16 text-red-100"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid gap-4 xl:grid-cols-[1.65fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <div className="mb-5 rounded-[1.6rem] border-2 border-[#ffd439]/32 bg-[#ffd439]/14 px-5 py-4 text-base font-bold leading-8 text-[#fff3b0] shadow-[0_0_24px_rgba(255,212,57,0.12)]">
                מלאי את הבחירות החשובות בלבד. אין צורך בהרבה פרטים — הקורס
                ייבנה לפי הרמה, תחומי העניין והמטרות שבחרת.
              </div>

              <div className="space-y-6">
                <section>
                  <SectionTitle
                    title="שם הקורס"
                    subtitle="לא חובה. אפשר לתת למערכת לבחור שם אוטומטי."
                  />

                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="לדוגמה: אנגלית דרך קריאה ושיחה"
                    className="w-full rounded-[1.5rem] border border-white/18 p-4 text-base font-bold leading-7 text-white caret-[#ffd439] outline-none transition placeholder:text-white/38 focus:border-[#ffd439]/65 focus:ring-4 focus:ring-[#ffd439]/12"
                    style={{
                      backgroundColor: "rgba(6, 31, 54, 0.92)",
                      color: "#ffffff",
                    }}
                  />
                </section>

                <section>
                  <SectionTitle
                    title="רמת אנגלית"
                    subtitle="בחרי את הרמה שמרגישה הכי מתאימה כרגע."
                  />

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {levelOptions.map((level, index) => (
                      <ChoiceCard
                        key={level.value}
                        title={level.label}
                        subtitle={level.description}
                        number={index + 1}
                        selected={englishLevel === level.value}
                        onClick={() => setEnglishLevel(level.value)}
                        variant="single"
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionTitle
                    title="תחומי עניין"
                    subtitle="אפשר לבחור יותר מאפשרות אחת."
                  />

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {hobbyOptions.map((hobby, index) => (
                      <ChoiceCard
                        key={hobby.value}
                        title={hobby.label}
                        number={index + 1}
                        selected={favoriteHobbies.includes(hobby.value)}
                        onClick={() =>
                          toggleArrayValue(
                            hobby.value,
                            favoriteHobbies,
                            setFavoriteHobbies
                          )
                        }
                      />
                    ))}
                  </div>
                </section>

                <section>
                  <SectionTitle
                    title="מטרות לימוד"
                    subtitle="בחרי מה הכי חשוב לחזק בקורס הזה."
                  />

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {expectationOptions.map((item, index) => (
                      <ChoiceCard
                        key={item.value}
                        title={item.label}
                        number={index + 1}
                        selected={expectations.includes(item.value)}
                        onClick={() =>
                          toggleArrayValue(
                            item.value,
                            expectations,
                            setExpectations
                          )
                        }
                      />
                    ))}
                  </div>
                </section>

                <div className="grid gap-3 pt-2 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleCreateCourse}
                    disabled={isLoading}
                    className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-base font-black text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                  >
                    {isLoading ? "בונה את הקורס..." : "יצירת קורס אישי"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/courses")}
                    className="rounded-full border border-white/18 bg-white/10 px-5 py-4 text-base font-bold text-white transition hover:bg-white/16"
                  >
                    חזרה לקורסים שלי
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-3">
              <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
                <h2 className="text-lg font-black">סיכום הבחירה</h2>

                <div className="mt-3 space-y-2">
                  <InfoRow label="רמה" value={getLevelLabel(englishLevel)} />
                  <InfoRow label="תחומי עניין" value={favoriteHobbies.length} />
                  <InfoRow label="מטרות" value={expectations.length} />
                </div>
              </div>

              <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <h2 className="text-lg font-black text-white">מה יקרה עכשיו?</h2>

                <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-xs font-bold leading-relaxed text-white/74">
                  אחרי יצירת הקורס תוכלי להיכנס למסלול החדש, לראות שיעורים,
                  תרגילים, שירים ובחנים שמתאימים לבחירות שלך.
                </p>
              </div>

              <div className="rounded-[1.7rem] border border-white/18 bg-white/10 p-4">
                <div className="text-xs font-bold text-white/56">
                  מצב הטופס
                </div>

                <div className="mt-1 text-xl font-black text-white">
                  {favoriteHobbies.length && expectations.length
                    ? "מוכן ליצירה"
                    : "חסרות בחירות"}
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/16">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] transition-all"
                    style={{
                      width: `${
                        34 +
                        (favoriteHobbies.length ? 33 : 0) +
                        (expectations.length ? 33 : 0)
                      }%`,
                    }}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <AppFeedbackModal
        isOpen={successOpen}
        type="success"
        title="הקורס נוצר!"
        message="הקורס האישי שלך נוצר בהצלחה. עכשיו אפשר להיכנס למסלול ולהתחיל ללמוד."
        primaryText="כניסה לקורס"
        secondaryText="חזרה לרשימת הקורסים"
        onPrimary={goToCreatedCourse}
        onSecondary={() => navigate("/courses")}
        onClose={() => setSuccessOpen(false)}
      />
    </main>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-3">
      <h2 className="text-xl font-black leading-8 text-white">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm font-bold leading-6 text-white/58">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ChoiceCard({
  title,
  subtitle = "",
  number,
  selected,
  onClick,
  variant = "multi",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.5rem] border-2 p-4 text-right transition-all ${
        selected
          ? "border-[#ffd439] bg-[#ffd439]/28 text-[#fff4b8] shadow-[0_0_24px_rgba(255,212,57,0.30),inset_0_1px_0_rgba(255,255,255,0.14)]"
          : "border-[#2c8fd6]/40 bg-[#123c6b]/50 text-white hover:border-[#ff6659]/58 hover:bg-[#123c6b]/68"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_48%)]" />

      <div className="relative z-10 flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
            selected
              ? "border-[#fff2a3] bg-[#ffd439] text-[#123c6b]"
              : "border-[#2c8fd6]/55 bg-[#061f36]/62 text-white/70"
          }`}
        >
          {selected ? "✓" : number}
        </span>

        <span className="min-w-0">
          <span className="block text-base font-black leading-7">{title}</span>

          {subtitle && (
            <span className="mt-1 block text-xs font-bold leading-5 text-white/62">
              {subtitle}
            </span>
          )}

          {variant === "multi" && (
            <span className="mt-2 block text-[11px] font-bold text-white/48">
              אפשרות בחירה
            </span>
          )}
        </span>
      </div>
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-3 py-2">
      <span className="text-xs font-bold text-white/54">{label}</span>
      <span className="text-xs font-black text-white">{value}</span>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
  };

  return labels[level] || level || "לא צוינה";
}