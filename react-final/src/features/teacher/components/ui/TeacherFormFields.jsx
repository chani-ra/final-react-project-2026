
export function SectionTitle({ title, subtitle }) {
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

export function TextInput({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
      />
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder = "",
}) {
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

export function SelectInput({ label, value, onChange, options }) {
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