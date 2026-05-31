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

  const title =
    editType === "lesson"
      ? "עריכת שיעור"
      : editType === "song"
      ? "עריכת שיר"
      : editType === "exercise"
      ? "עריכת תרגיל"
      : editType === "quiz"
      ? "עריכת בוחן"
      : "עריכת תוכן";

  const updateQuestion = (questionIndex, field, value) => {
    setEditForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              [field]: value,
            }
          : question
      ),
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setEditForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index !== questionIndex) return question;

        const nextOptions = [...(question.options || [])];
        const oldOption = nextOptions[optionIndex];

        nextOptions[optionIndex] = value;

        return {
          ...question,
          options: nextOptions,
          correctAnswer:
            question.correctAnswer === oldOption ? value : question.correctAnswer,
        };
      }),
    }));
  };

  const removeQuestion = (questionIndex) => {
    setEditForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>

            <p className="text-gray-400 text-sm mt-1">
              עדכני פרטים בסיסיים. שינוי קובץ מדיה יטופל בשלב נפרד.
            </p>
          </div>

          <button
            type="button"
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
                rows={3}
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

          {editType === "exercise" && (
            <>
              <TextArea
                label="תיאור"
                value={editForm.description}
                rows={3}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, description: value }))
                }
              />

              <TextArea
                label="הוראות התרגיל"
                value={editForm.instructions}
                rows={6}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, instructions: value }))
                }
              />
            </>
          )}

          {editType === "quiz" && (
            <>
              <TextArea
                label="תיאור הבוחן"
                value={editForm.description}
                rows={3}
                onChange={(value) =>
                  setEditForm((prev) => ({ ...prev, description: value }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectInput
                  label="סוג בוחן"
                  value={editForm.quizType}
                  onChange={(value) =>
                    setEditForm((prev) => ({ ...prev, quizType: value }))
                  }
                  options={[
                    { value: "grammar", label: "דקדוק" },
                    { value: "vocabulary", label: "אוצר מילים" },
                    { value: "reading", label: "קריאה" },
                    { value: "listening", label: "שמיעה" },
                    { value: "writing", label: "כתיבה" },
                    { value: "mixed", label: "מעורב" },
                  ]}
                />

                <TextInput
                  label="משך בדקות"
                  type="number"
                  value={editForm.duration}
                  onChange={(value) =>
                    setEditForm((prev) => ({ ...prev, duration: value }))
                  }
                />

                <TextInput
                  label="ציון מעבר"
                  type="number"
                  value={editForm.passingScore}
                  onChange={(value) =>
                    setEditForm((prev) => ({
                      ...prev,
                      passingScore: value,
                    }))
                  }
                />

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
              </div>

              <section className="space-y-4 pt-4">
                <h3 className="text-xl font-black text-yellow-400">
                  שאלות הבוחן
                </h3>

                {(editForm.questions || []).map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="bg-slate-950/70 border border-white/10 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex justify-between items-center gap-3">
                      <h4 className="text-white font-black">
                        שאלה {questionIndex + 1}
                      </h4>

                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 px-3 py-2 rounded-xl font-bold text-sm"
                      >
                        מחיקת שאלה
                      </button>
                    </div>

                    <TextArea
                      label="טקסט השאלה"
                      value={question.question}
                      rows={2}
                      dir="ltr"
                      onChange={(value) =>
                        updateQuestion(questionIndex, "question", value)
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(question.options || []).map((option, optionIndex) => (
                        <TextInput
                          key={optionIndex}
                          label={`אפשרות ${optionIndex + 1}`}
                          value={option}
                          dir="ltr"
                          onChange={(value) =>
                            updateOption(questionIndex, optionIndex, value)
                          }
                        />
                      ))}
                    </div>

                    <SelectInput
                      label="תשובה נכונה"
                      value={question.correctAnswer}
                      onChange={(value) =>
                        updateQuestion(questionIndex, "correctAnswer", value)
                      }
                      options={(question.options || []).map((option) => ({
                        value: option,
                        label: option,
                      }))}
                    />

                    <TextArea
                      label="הסבר לתשובה"
                      value={question.explanation}
                      rows={3}
                      onChange={(value) =>
                        updateQuestion(questionIndex, "explanation", value)
                      }
                    />
                  </div>
                ))}
              </section>
            </>
          )}

          {editType !== "quiz" && (
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
          )}

          {editType === "quiz" && (
            <SelectInput
              label="רמה"
              value={editForm.englishLevel}
              onChange={(value) =>
                setEditForm((prev) => ({ ...prev, englishLevel: value }))
              }
              options={[
                { value: "beginner", label: "מתחילים" },
                { value: "intermediate", label: "בינוני" },
                { value: "advanced", label: "מתקדמים" },
              ]}
            />
          )}

          {(editType === "exercise" || editType === "quiz") && (
            <label className="flex items-center gap-3 bg-slate-950/70 border border-white/10 rounded-2xl p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={editForm.isPublic}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
                className="w-5 h-5 accent-yellow-400"
              />

              <div>
                <div className="font-bold text-white">פרסם למסלולים אישיים</div>

                <div className="text-gray-400 text-sm">
                  אם מסומן, התוכן יכול להיכנס לקורסים של תלמידות לאחר רענון.
                </div>
              </div>
            </label>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-8">
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 text-slate-950 font-black py-3 rounded-xl transition-all"
          >
            {isSaving ? "שומר..." : "שמור שינויים"}
          </button>

          <button
            type="button"
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

function TextInput({ label, value, onChange, type = "text", dir = "rtl" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3, dir = "rtl" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value ?? ""}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      />
    </div>
  );
}

function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
      >
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}