import { BasicFields, LessonFields, SongFields, ExerciseFields, QuizFields, ClassificationFields, PublishBox } from "./EditContentFields.jsx";
import { ModalHeader, ActionButtons, EditSummary } from "./EditContentChrome.jsx";
import { getModalTitle, updateEditField, updateEditQuestion, updateEditOption, removeEditQuestion } from "./editContentModel.js";

export default function EditContentModal({ editType, editForm, setEditForm, actionLoadingId, editingItemId, onClose, onSave }) {
  const isSaving = actionLoadingId === editingItemId;
  const title = getModalTitle(editType);

  const updateField = (field, value) => setEditForm((prev) => updateEditField(prev, field, value));
  const updateQuestion = (index, field, value) => setEditForm((prev) => updateEditQuestion(prev, index, field, value));
  const updateOption = (questionIndex, optionIndex, value) => setEditForm((prev) => updateEditOption(prev, questionIndex, optionIndex, value));
  const removeQuestion = (index) => setEditForm((prev) => removeEditQuestion(prev, index));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/78 p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <section className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2.3rem] border border-white/26 bg-[#123c6b]/92 text-white shadow-[0_32px_95px_rgba(3,31,61,0.48),inset_0_1px_0_rgba(255,255,255,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.13),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_52%)]" />

        <div className="relative z-10 flex max-h-[92vh] flex-col">
          <ModalHeader title={title} editType={editType} onClose={onClose} />

          <div className="overflow-y-auto px-4 pb-4 md:px-6 md:pb-6">
            <div className="grid gap-4 xl:grid-cols-[1.45fr_0.65fr]">
              <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
                <div className="space-y-6">
                  <BasicFields
                    editType={editType}
                    editForm={editForm}
                    updateField={updateField}
                  />

                  {editType === "lesson" && (
                    <LessonFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "song" && (
                    <SongFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "exercise" && (
                    <ExerciseFields
                      editForm={editForm}
                      updateField={updateField}
                    />
                  )}

                  {editType === "quiz" && (
                    <QuizFields
                      editForm={editForm}
                      updateField={updateField}
                      updateQuestion={updateQuestion}
                      updateOption={updateOption}
                      removeQuestion={removeQuestion}
                    />
                  )}

                  <ClassificationFields
                    editType={editType}
                    editForm={editForm}
                    updateField={updateField}
                  />

                  {(editType === "exercise" || editType === "quiz") && (
                    <PublishBox
                      isPublic={Boolean(editForm.isPublic)}
                      onChange={(value) => updateField("isPublic", value)}
                    />
                  )}
                </div>

                <ActionButtons
                  isSaving={isSaving}
                  onSave={onSave}
                  onClose={onClose}
                />
              </section>

              <EditSummary editType={editType} editForm={editForm} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
