import useMessageNotice from "../../../components/ui/useMessageNotice.js";
import SmartContentFields from "./SmartContentFields";

const exerciseTypeOptions = [
  { value: "practice", label: "תרגול" },
  { value: "homework", label: "שיעורי בית" },
  { value: "project", label: "פרויקט" },
];

export default function TeacherExerciseBuilderView({
  navigate,
  mode,
  setMode,
  isGenerating,
  isSaving,
  questionDrafts,
  setQuestionDrafts,
  aiCount,
  setAiCount,
  aiFormat,
  setAiFormat,
  message,
  form,
  updateField,
  toggleArrayValue,
  handleGenerateWithAI,
  handleSaveExercise,
}) {
  useMessageNotice(message);
  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <header className="mb-6">
            <button
              type="button"
              onClick={() => navigate("/teacher/library")}
              className="mb-3 inline-flex items-center rounded-full border border-white/18 bg-white/10 px-4 py-2 text-base font-bold text-white/82 transition hover:bg-white/16 hover:text-white"
            >
              חזרה לספרייה
            </button>

            <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
              יצירת תרגיל
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
                  בניית תרגיל למסלולים אישיים
                </h1>

                <p className="mt-3 max-w-4xl text-base font-semibold leading-8 text-white/76">
                  אפשר ליצור תרגיל ידני או להיעזר ב־AI לטיוטה. תרגיל מפורסם
                  יכול להשתלב במסלולים אישיים לפי רמה, גיל ותגיות.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <MiniInfoCard label="מצב" value={mode === "ai" ? "AI" : "ידני"} />
                <MiniInfoCard
                  label="פרסום"
                  value={form.isPublic ? "מפורסם" : "טיוטה"}
                />
              </div>
            </div>
          </header>


          <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <ModeTabs mode={mode} setMode={setMode} />

              {mode === "ai" && (
                <AIBox
                  aiPrompt={form.aiPrompt}
                  updateField={updateField}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerateWithAI}
                  aiCount={aiCount}
                  onCount={setAiCount}
                  aiFormat={aiFormat}
                  onFormat={setAiFormat}
                />
              )}

              <div className="space-y-6">
                <section>
                  <SectionTitle
                    title="פרטי התרגיל"
                    subtitle="כותרת, סוג ותוכן התרגיל שיוצג לתלמידה."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      options={exerciseTypeOptions}
                    />
                  </div>

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
                    rows={9}
                    placeholder="כאן יופיעו ההוראות לתלמידה. אם יצרת בעזרת AI, השדה הזה יתמלא אוטומטית."
                  />

                  {questionDrafts.length > 0 && (
                    <section className="rounded-[1.6rem] border border-[#ffd439]/30 bg-[#082844]/70 p-4">
                      <h3 className="mb-3 text-lg font-bold text-[#ffe89a]">
                        שאלות ותשובות לדוגמה — למורה בלבד
                      </h3>

                      <div className="space-y-3">
                        {questionDrafts.map((q, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-white/20 bg-[#123c6b]/65 p-3"
                          >
                            <label className="text-sm font-bold">
                              שאלה {i + 1}
                            </label>

                            <textarea
                              dir="auto"
                              rows={2}
                              value={q.prompt}
                              onChange={(e) =>
                                setQuestionDrafts((drafts) =>
                                  drafts.map((item, j) =>
                                    j === i
                                      ? { ...item, prompt: e.target.value }
                                      : item
                                  )
                                )
                              }
                              className="mt-1 mb-2 w-full rounded-lg bg-[#061f36] p-2 text-white"
                            />

                            <label className="text-sm font-bold">
                              תשובה נכונה / תשובת דוגמה
                            </label>

                            <input
                              dir="auto"
                              value={q.answer}
                              onChange={(e) =>
                                setQuestionDrafts((drafts) =>
                                  drafts.map((item, j) =>
                                    j === i
                                      ? { ...item, answer: e.target.value }
                                      : item
                                  )
                                )
                              }
                              className="mt-1 mb-2 w-full rounded-lg bg-[#061f36] p-2 text-white"
                            />

                            <label className="text-sm font-bold">
                              הסבר (לא חובה)
                            </label>

                            <input
                              value={q.explanation}
                              onChange={(e) =>
                                setQuestionDrafts((drafts) =>
                                  drafts.map((item, j) =>
                                    j === i
                                      ? {
                                          ...item,
                                          explanation: e.target.value,
                                        }
                                      : item
                                  )
                                )
                              }
                              className="mt-1 w-full rounded-lg bg-[#061f36] p-2 text-white"
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <TextArea
                    label="חומרי עזר"
                    value={form.materials}
                    onChange={(value) => updateField("materials", value)}
                    rows={4}
                    placeholder="כל שורה יכולה להיות קישור או הערה נפרדת"
                  />
                </section>

                <SmartContentFields
                  category={form.category}
                  level={form.level}
                  minAge={form.targetAgeMin}
                  maxAge={form.targetAgeMax}
                  hobbies={form.hobbies}
                  expectations={form.expectations}
                  onChange={updateField}
                  onToggleArrayValue={toggleArrayValue}
                />

                <PublishBox
                  isPublic={form.isPublic}
                  onChange={(value) => updateField("isPublic", value)}
                />

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleSaveExercise}
                    disabled={isSaving}
                    className="rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                  >
                    {isSaving ? "שומר תרגיל..." : "שמירת תרגיל"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/teacher/library")}
                    className="rounded-full border-2 border-[#7dd3fc] bg-[#0f4c75] px-5 py-4 text-lg font-bold text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#176aa8] active:translate-y-1 active:shadow-none"
                  >
                    חזרה לספרייה
                  </button>
                </div>
              </div>
            </section>

            <ExerciseSummary form={form} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ModeTabs({ mode, setMode }) {
  return (
    <div className="mb-6 rounded-[1.8rem] border-2 border-white/20 bg-[#061f36]/76 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <ModeButton
          active={mode === "manual"}
          title="כתיבה ידנית"
          subtitle="אני כותבת את התרגיל בעצמי"
          label="MANUAL"
          onClick={() => setMode("manual")}
        />

        <ModeButton
          active={mode === "ai"}
          title="יצירה בעזרת AI"
          subtitle="המערכת יוצרת לי טיוטה לעריכה"
          label="AI"
          onClick={() => setMode("ai")}
        />
      </div>
    </div>
  );
}

function ModeButton({ active, title, subtitle, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden rounded-[1.5rem] border-2 p-4 text-right transition-all ${
        active
          ? "border-[#ffd439] bg-[#123c6b] text-white shadow-[0_0_24px_rgba(255,212,57,0.20)]"
          : "border-[#2c8fd6]/42 bg-[#082844]/72 text-white/72 hover:border-[#ff6659]/62 hover:bg-[#123c6b]/82"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] border-2 text-base font-extrabold ${
            active
              ? "border-[#fff2a3] bg-[#ffd439] text-[#123c6b]"
              : "border-[#2c8fd6]/60 bg-[#061f36] text-white/72"
          }`}
        >
          {active ? "✓" : label}
        </span>

        <span>
          <span className="block text-xl font-extrabold leading-8">
            {title}
          </span>

          <span
            className={`mt-1 block text-base font-semibold leading-7 ${
              active ? "text-[#fff3b0]" : "text-white/62"
            }`}
          >
            {subtitle}
          </span>
        </span>
      </div>
    </button>
  );
}

function AIBox({ aiPrompt, updateField, isGenerating, onGenerate, aiCount, onCount, aiFormat, onFormat }) {
  return (
    <section className="mb-6 rounded-[2rem] border-2 border-[#ffd439]/28 bg-[#ffd439]/12 p-5">
      <SectionTitle
        title="בקשה ל־AI"
        subtitle="כתבי איזה תרגיל ליצור. אחרי יצירה תוכלי לערוך לפני שמירה."
      />

      <TextArea
        label="בקשה ל־AI"
        value={aiPrompt}
        onChange={(value) => updateField("aiPrompt", value)}
        rows={5}
        placeholder="לדוגמה: צור תרגיל אוצר מילים לרמת מתחילים בנושא ספורט"
      />

      <div className="mb-4 mt-3 flex flex-wrap gap-3">
        <label className="text-sm font-bold">
          מספר שאלות
          <input
            type="number"
            min="1"
            max="20"
            value={aiCount}
            onChange={(e) => onCount(Number(e.target.value))}
            className="mt-1 block w-24 rounded-lg bg-[#061f36] p-2"
          />
        </label>

        <label className="text-sm font-bold">
          סוג שאלות
          <select
            value={aiFormat}
            onChange={(e) => onFormat(e.target.value)}
            className="mt-1 block rounded-lg bg-[#061f36] p-2"
          >
            <option value="auto">לפי הבקשה</option>
            <option value="open">פתוחות</option>
            <option value="fill">השלמה</option>
            <option value="multiple">אמריקאיות</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={isGenerating}
        className="mt-4 rounded-full border-2 border-[#7dd3fc] bg-[#0f4c75] px-7 py-3 text-lg font-bold text-white shadow-[0_5px_0_rgba(3,31,61,0.45)] transition hover:-translate-y-1 hover:bg-[#176aa8] active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {isGenerating ? "ה־AI יוצר תרגיל..." : "יצירת טיוטה עם AI"}
      </button>
    </section>
  );
}

function PublishBox({ isPublic, onChange }) {
  return (
    <section className="rounded-[2rem] border border-white/18 bg-[#123c6b]/54 p-5">
      <label className="flex cursor-pointer items-start gap-4">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-1 h-5 w-5 accent-[#ffd439]"
        />

        <span>
          <span className="block text-xl font-extrabold leading-8 text-white">
            פרסום התרגיל למסלולים אישיים
          </span>

          <span className="mt-1 block text-base font-semibold leading-7 text-white/72">
            אם מסומן, התרגיל יוכל להיכנס לקורסים אישיים לאחר רענון או יצירה
            מחדש של מסלול.
          </span>
        </span>
      </label>
    </section>
  );
}

function ExerciseSummary({ form }) {
  return (
    <aside className="space-y-3">
      <div className="rounded-[1.7rem] border border-white/18 bg-[#1b5f95]/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl">
        <h2 className="text-xl font-extrabold">סיכום התרגיל</h2>

        <div className="mt-3 space-y-2">
          <InfoRow label="רמה" value={getLevelLabel(form.level)} />
          <InfoRow label="קטגוריה" value={getCategoryLabel(form.category)} />
          <InfoRow label="סוג" value={getExerciseTypeLabel(form.type)} />
          <InfoRow
            label="גיל"
            value={`${form.targetAgeMin || 4}-${form.targetAgeMax || 120}`}
          />
          <InfoRow label="תחביבים" value={form.hobbies.length} />
          <InfoRow label="מטרות" value={form.expectations.length} />
          <InfoRow
            label="מצב"
            value={form.isPublic ? "מפורסם" : "טיוטה"}
          />
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-[#ffd439]/24 bg-[#082844]/68 p-4 text-white shadow-[0_18px_45px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.14)]">
        <h2 className="text-xl font-extrabold text-white">בדיקה לפני שמירה</h2>

        <p className="mt-3 rounded-xl bg-white/8 px-3 py-3 text-base font-semibold leading-8 text-white/78">
          ודאי שיש כותרת ברורה, הוראות מלאות, רמה מדויקת ופרסום רק כשהתרגיל
          מוכן לתלמידות.
        </p>
      </div>
    </aside>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-extrabold leading-9 text-white">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-base font-semibold leading-7 text-white/72">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TextInput({ label, value, onChange, placeholder = "" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        {label}
      </span>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
      />
    </label>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white outline-none transition focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#082844] text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextArea({ label, value, onChange, rows, placeholder = "" }) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-base font-bold text-white/88">
        {label}
      </span>

      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-none rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
      />
    </label>
  );
}

function MessageBox({ message }) {
  return (
    <div
      className={`mb-5 rounded-[1.5rem] px-5 py-4 text-base font-bold shadow-[0_12px_32px_rgba(3,31,61,0.16)] ${
        message.type === "success"
          ? "border border-emerald-300/28 bg-emerald-400/14 text-emerald-100"
          : "border border-red-300/30 bg-red-500/16 text-red-100"
      }`}
    >
      {message.text}
    </div>
  );
}

function MiniInfoCard({ label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-white/18 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="text-sm font-bold text-white/62">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/12 bg-white/8 px-3 py-2">
      <span className="text-sm font-bold text-white/58">{label}</span>
      <span className="text-sm font-extrabold text-white">{value}</span>
    </div>
  );
}

function HeaderLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      <g
        fill="none"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M30 190 C160 130 240 165 360 110 C480 55 570 95 700 55 C840 12 930 70 1070 30 C1130 14 1170 18 1210 4"
          strokeWidth="3"
        />
        <path
          d="M0 230 C130 175 250 200 380 145 C510 92 620 120 760 88 C890 58 970 95 1100 65 C1160 52 1190 56 1220 42"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
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

function getExerciseTypeLabel(type) {
  const labels = {
    practice: "תרגול",
    homework: "שיעורי בית",
    project: "פרויקט",
  };

  return labels[type] || type || "תרגול";
}
