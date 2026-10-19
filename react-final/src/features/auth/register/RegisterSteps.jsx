import skyJourneyBackground from "../../../assets/sky-journey-background.svg";

const inputClass =
  "w-full min-w-0 rounded-[1.25rem] border-2 border-white/20 bg-white/10 px-4 py-3 text-base sm:rounded-[1.45rem] sm:px-5 sm:py-4 sm:text-lg font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15";

function AuthBackground({ children }) {
  return (
    <div
      className="relative min-h-[100dvh] overflow-x-hidden bg-sky-500 text-white"
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
        className="text-2xl font-black leading-snug text-white sm:text-4xl md:text-5xl"
        style={{
          textShadow:
            "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
        }}
      >
        {title}
      </h1>

      {text && (
        <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 sm:text-base sm:leading-8 text-white/68">
          {text}
        </p>
      )}

      <div className="mt-4 sm:mt-6">{children}</div>
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
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
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
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {ages.map((age) => (
          <button
            type="button"
            key={age.value}
            data-register-choice
            aria-pressed={value === age.value}
            onClick={() => update({ age: age.value })}
            className={`group relative h-12 w-12 overflow-hidden rounded-full border-2 text-sm sm:h-16 sm:w-16 sm:text-lg font-black transition ${
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
      <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
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
            data-register-choice
            aria-pressed={value === level.id}
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
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
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
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3">
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

function StepContact({ value, update, errors = {} }) {
  const fields = [
    { name: "email", label: "אימייל", type: "email", autoComplete: "email" },
    { name: "phone", label: "מספר טלפון", type: "tel", autoComplete: "tel" },
    { name: "password", label: "סיסמה", type: "password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "אימות סיסמה", type: "password", autoComplete: "new-password" },
  ];

  return (
    <StepBlock
      title="כמעט סיימנו"
      text="נשמור את הפרטים כדי שתוכלי לחזור למסלול שלך בכל כניסה."
    >
      <div className="space-y-3">
        {fields.map(({ name, label, type, autoComplete }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="mb-1 block text-sm font-bold text-white/85"
            >
              {label}
            </label>

            <input
              id={name}
              name={name}
              data-register-contact
              type={type}
              autoComplete={autoComplete}
              dir="ltr"
              value={value[name] || ""}
              onChange={(event) =>
                update({ [name]: event.target.value })
              }
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name] ? name + "-error" : undefined
              }
              placeholder={label}
              className={inputClass + " text-left"}
            />

            {errors[name] && (
              <p
                id={name + "-error"}
                className="mt-1 text-xs font-bold text-red-200"
              >
                {errors[name]}
              </p>
            )}
          </div>
        ))}
      </div>
    </StepBlock>
  );
}

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      data-register-choice
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-[1.25rem] border-2 px-3 py-3 text-center text-sm font-black sm:rounded-[1.45rem] sm:px-5 sm:py-4 sm:text-base transition ${
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

export { AuthBackground, StepName, StepGender, StepAge, StepParentOrChild, StepLevel, StepHobbies, StepContact, LoadingCircle, SmallSpinner };
