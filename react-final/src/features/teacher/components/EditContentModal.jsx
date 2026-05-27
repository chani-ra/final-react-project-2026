import React from "react";

export default function EditContentModal({
  editType,
  editForm,
  setEditForm,
  actionLoadingId,
  editingItemId,
  onClose,
  onSave,
}) {
  const isSaving = actionLoadingId === editingItemId;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">
              {editType === "lesson" ? "עריכת שיעור" : "עריכת שיר"}
            </h2>

            <p className="text-gray-400 text-sm mt-1">
              עדכני פרטים בסיסיים. שינוי קובץ מדיה נעשה בשלב הבא.
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-xl font-black"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <TextInput
            label="כותרת"
            value={editForm.title}
            onChange={(value) =>
              setEditForm((prev) => ({ ...prev, title: value }))
            }
          />

          {editType === "lesson" && (
            <>
              <TextInput
                label="נושא שיעור"
                value={editForm.topic}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, topic: value }))
                }
              />

              <TextArea
                label="תיאור"
                value={editForm.description}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, description: value }))
                }
              />
            </>
          )}

          {editType === "song" && (
            <TextInput
              label="נושא השיר"
              value={editForm.theme}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, theme: value }))
              }
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="קטגוריה"
              value={editForm.category}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, category: value }))
              }
              options={[
                { value: "general", label: "כללי" },
                { value: "grammar", label: "דקדוק" },
                { value: "vocabulary", label: "אוצר מילים" },
                { value: "conversation", label: "שיחה" },
                { value: "reading", label: "קריאה" },
                { value: "listening", label: "האזנה" },
              ]}
            />

            <SelectInput
              label="רמה"
              value={editForm.level}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, level: value }))
              }
              options={[
                { value: "beginner", label: "מתחילים" },
                { value: "intermediate", label: "בינוני" },
                { value: "advanced", label: "מתקדמים" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-8">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-3 rounded-xl transition-all"
          >
            {isSaving ? "שומר..." : "שמור שינויים"}
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

// שדה טקסט
function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

// שדה טקסט ארוך
function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        rows="3"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

// שדה בחירה
function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}