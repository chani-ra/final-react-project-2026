import React from "react";

const categoryOptions = [
  { value: "general", label: "כללי" },
  { value: "grammar", label: "דקדוק" },
  { value: "vocabulary", label: "אוצר מילים" },
  { value: "conversation", label: "שיחה" },
  { value: "reading", label: "קריאה" },
  { value: "listening", label: "האזנה" },
];

const levelOptions = [
  { value: "beginner", label: "מתחילים" },
  { value: "intermediate", label: "בינוני" },
  { value: "advanced", label: "מתקדמים" },
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

export default function SmartContentFields({
  category,
  level,
  minAge,
  maxAge,
  hobbies = [],
  expectations = [],
  onChange,
  onToggleArrayValue,
  levelFieldName = "level",
  minAgeFieldName = "targetAgeMin",
  maxAgeFieldName = "targetAgeMax",
}) {
  return (
    <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/64 p-5 shadow-[0_18px_42px_rgba(3,31,61,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]">
      <SectionTitle
        title="תיוג חכם למסלולים"
        subtitle="השדות האלו קובעים לאילו תלמידות התוכן יוכל להתאים."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          label="קטגוריה"
          value={category}
          onChange={(value) => onChange("category", value)}
          options={categoryOptions}
        />

        <SelectField
          label="רמה"
          value={level}
          onChange={(value) => onChange(levelFieldName, value)}
          options={levelOptions}
        />

        <InputField
          label="גיל מינימלי"
          type="number"
          value={minAge}
          onChange={(value) => onChange(minAgeFieldName, value)}
        />

        <InputField
          label="גיל מקסימלי"
          type="number"
          value={maxAge}
          onChange={(value) => onChange(maxAgeFieldName, value)}
        />
      </div>

      <ChoiceGroup
        title="תחומי עניין"
        options={hobbyOptions}
        selected={hobbies}
        onToggle={(value) => onToggleArrayValue("hobbies", value)}
      />

      <ChoiceGroup
        title="מטרות לימוד"
        options={expectationOptions}
        selected={expectations}
        onToggle={(value) => onToggleArrayValue("expectations", value)}
      />
    </section>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-extrabold leading-9 text-white">{title}</h2>
      <p className="mt-1 text-base font-semibold leading-7 text-white/72">
        {subtitle}
      </p>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        {label}
      </span>

      <input
        type={type}
        min={type === "number" ? 4 : undefined}
        max={type === "number" ? 120 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
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
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
            className="bg-[#082844] text-white"
          >
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ChoiceGroup({ title, options, selected, onToggle }) {
  return (
    <div className="mt-5">
      <h3 className="mb-3 text-lg font-extrabold text-white">{title}</h3>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {options.map((item, index) => {
          const active = selected.includes(item.value);

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onToggle(item.value)}
              className={`relative overflow-hidden rounded-[1.3rem] border-2 p-4 text-right transition-all ${
                active
                  ? "border-[#ffd439] bg-[#ffd439]/28 text-[#fff4b8] shadow-[0_0_22px_rgba(255,212,57,0.25)]"
                  : "border-[#2c8fd6]/42 bg-[#123c6b]/58 text-white hover:border-[#ff6659]/62 hover:bg-[#123c6b]/76"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                    active
                      ? "border-[#fff2a3] bg-[#ffd439] text-[#123c6b]"
                      : "border-[#2c8fd6]/60 bg-[#061f36]/70 text-white/74"
                  }`}
                >
                  {active ? "✓" : index + 1}
                </span>

                <span className="text-base font-bold leading-7">
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}