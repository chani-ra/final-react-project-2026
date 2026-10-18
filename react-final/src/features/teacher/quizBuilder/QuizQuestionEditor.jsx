import React from "react";
import { TextArea, SelectInput } from "../components/ui/TeacherFormFields";
import { getCleanOptions } from "./quizBuilder.utils";

export function QuestionEditorList({
  questions,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
}) {
  return (
    <section className="mt-5 space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-white drop-shadow-sm">
          עריכת שאלות
        </h2>

        <span className="rounded-full border border-[#ffd439]/24 bg-[#ffd439]/14 px-4 py-2 text-base font-bold text-[#ffe89a] shadow-sm">
          {questions.length} שאלות
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <EditableQuestionCard
            key={`question-${index}`}
            question={question}
            index={index}
            onUpdateQuestion={onUpdateQuestion}
            onUpdateOption={onUpdateOption}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
            onRemoveQuestion={onRemoveQuestion}
          />
        ))}
      </div>
    </section>
  );
}

function EditableQuestionCard({
  question,
  index,
  onUpdateQuestion,
  onUpdateOption,
  onAddOption,
  onRemoveOption,
  onRemoveQuestion,
}) {
  const options = question.options || [];

  return (
    <article className="relative overflow-hidden rounded-[2rem] border-2 border-[#ff6659]/45 bg-[#123c6b]/72 p-5 text-white shadow-[0_18px_42px_rgba(3,31,61,0.26),inset_0_1px_0_rgba(255,255,255,0.14)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_48%)]" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-lg font-extrabold text-white shadow-[0_8px_0_rgba(89,15,20,0.38),0_10px_22px_rgba(3,31,61,0.24)]">
              {index + 1}
            </div>

            <div>
              <h3 className="text-2xl font-extrabold leading-tight">
                שאלה {index + 1}
              </h3>

              <p className="text-base font-semibold leading-7 text-white/64">
                עריכת שאלה אמריקאית
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemoveQuestion(index)}
            className="rounded-full border-2 border-[#ffb4ad]/40 bg-[#b8322a]/42 px-4 py-2.5 text-base font-bold text-white transition hover:bg-[#b8322a]/60"
          >
            מחיקה
          </button>
        </div>

        <TextArea
          label="טקסט השאלה"
          value={question.question}
          onChange={(value) => onUpdateQuestion(index, "question", value)}
          rows={3}
          placeholder="כתבי כאן את השאלה..."
        />

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-xl font-extrabold text-white">
              אפשרויות תשובה
            </h4>

            <button
              type="button"
              onClick={() => onAddOption(index)}
              className="rounded-full border-2 border-[#ffd439] bg-[#123c6b] px-4 py-2.5 text-base font-bold text-[#fff3b0] transition hover:bg-[#0f4c75]"
            >
              הוספת אפשרות
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {options.map((option, optionIndex) => (
              <OptionInput
                key={`option-${optionIndex}`}
                option={option}
                optionIndex={optionIndex}
                canDelete={options.length > 2}
                onChange={(value) => onUpdateOption(index, optionIndex, value)}
                onRemove={() => onRemoveOption(index, optionIndex)}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <SelectInput
            label="תשובה נכונה"
            value={question.correctAnswer}
            onChange={(value) => onUpdateQuestion(index, "correctAnswer", value)}
            options={getCleanOptions(options).map((option) => ({
              value: option,
              label: option,
            }))}
          />
        </div>

        <TextArea
          label="הסבר לתשובה"
          value={question.explanation}
          onChange={(value) => onUpdateQuestion(index, "explanation", value)}
          rows={3}
          placeholder="כתבי הסבר שיוצג לתלמידה אחרי ההגשה..."
        />
      </div>
    </article>
  );
}

function OptionInput({ option, optionIndex, canDelete, onChange, onRemove }) {
  return (
    <label className="block">
      <span className="mb-2 block text-base font-bold text-white/88">
        אפשרות {optionIndex + 1}
      </span>

      <div className="flex gap-2">
        <input
          value={option}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-[1.3rem] border-2 border-[#2c8fd6]/55 bg-[#082844] px-4 py-3.5 text-lg font-semibold leading-8 text-white caret-[#ffd439] outline-none transition placeholder:text-white/42 focus:border-[#ffd439] focus:ring-4 focus:ring-[#ffd439]/18"
          placeholder={`אפשרות ${optionIndex + 1}`}
        />

        {canDelete && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-[1.2rem] border-2 border-[#ffb4ad]/40 bg-[#b8322a]/42 px-4 text-lg font-extrabold text-white transition hover:bg-[#b8322a]/60"
          >
            ×
          </button>
        )}
      </div>
    </label>
  );
}
