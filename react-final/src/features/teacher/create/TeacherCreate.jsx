import React from "react";
import useTeacherCreate from "./useTeacherCreate.js";
import { ContentTypeTabs, PublishModeSection, SongDetails, MediaUploadBox, CreateSummary } from "./TeacherCreateSections.jsx";
import SmartContentFields from "../components/SmartContentFields";

import {
  SectionTitle,
  TextInput,
  TextArea,
} from "../components/ui/TeacherFormFields";

import {
  MiniInfoCard,
  HeaderLines,
} from "../components/ui/TeacherInfoBlocks";

export default function TeacherCreate() {
  const {
    contentType, isDragging, publishMode, fileName,
    title, topic, description, category,
    level, minAge, maxAge, hobbies,
    expectations, duration, composer, lyricist,
    isLoading, setPublishMode, setTitle, setTopic,
    setDescription, setDuration, setComposer, setLyricist,
    updateSmartField, toggleArrayValue, handleContentTypeChange, handleDragOver,
    handleDragLeave, handleDrop, handleFileChange, handleSubmit,
  } = useTeacherCreate();

  return (
    <main className="mx-auto max-w-7xl px-4 py-4" dir="rtl">
      <section className="relative overflow-hidden rounded-[2.4rem] border border-white/32 bg-[#123c6b]/70 text-white shadow-[0_32px_95px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.14),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.07),transparent_52%)]" />

        <HeaderLines />

        <div className="relative z-10 p-4 md:p-6">
          <header className="mb-6">
            <div className="mb-3 inline-flex rounded-full border border-[#ffd439]/28 bg-[#ffd439]/16 px-4 py-1.5 text-base font-extrabold text-[#ffe89a]">
              העלאת תוכן
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
                  יצירת שיעור או שיר
                </h1>

                <p className="mt-3 max-w-4xl text-base font-semibold leading-8 text-white/76">
                  העלי קובץ, הגדירי רמה ותגיות, ובחרי אם לשמור כטיוטה או לפרסם
                  למסלולים אישיים.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[320px]">
                <MiniInfoCard
                  label="סוג תוכן"
                  value={contentType === "video" ? "שיעור" : "שיר"}
                />
                <MiniInfoCard
                  label="פרסום"
                  value={publishMode === "published" ? "מפורסם" : "טיוטה"}
                />
              </div>
            </div>
          </header>


          <div className="grid gap-4 xl:grid-cols-[1.55fr_0.72fr]">
            <section className="rounded-[2rem] border border-white/22 bg-[#061f36]/76 p-4 shadow-[0_24px_65px_rgba(3,31,61,0.32),inset_0_1px_0_rgba(255,255,255,0.14)]">
              <ContentTypeTabs
                contentType={contentType}
                onChange={handleContentTypeChange}
              />

              <div className="space-y-6">
                <section>
                  <SectionTitle
                    title="פרטי התוכן"
                    subtitle="כותרת, נושא ותיאור שיופיעו בספריית התוכן."
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TextInput
                      label={`כותרת ה${
                        contentType === "video" ? "שיעור" : "שיר"
                      }`}
                      value={title}
                      onChange={setTitle}
                      placeholder={
                        contentType === "video"
                          ? "לדוגמה: Present Simple Rules"
                          : "לדוגמה: Vocabulary Song"
                      }
                    />

                    <TextInput
                      label="נושא לימוד"
                      value={topic}
                      onChange={setTopic}
                      placeholder="לדוגמה: Grammar Basics"
                    />
                  </div>

                  <TextArea
                    label="תיאור קצר"
                    value={description}
                    onChange={setDescription}
                    rows={3}
                    placeholder="מה התלמידה תלמד בתוכן הזה?"
                  />
                </section>

                <SmartContentFields
                  category={category}
                  level={level}
                  minAge={minAge}
                  maxAge={maxAge}
                  hobbies={hobbies}
                  expectations={expectations}
                  onChange={updateSmartField}
                  onToggleArrayValue={toggleArrayValue}
                />

                <PublishModeSection
                  publishMode={publishMode}
                  setPublishMode={setPublishMode}
                />

                {contentType === "audio" && (
                  <SongDetails
                    duration={duration}
                    setDuration={setDuration}
                    composer={composer}
                    setComposer={setComposer}
                    lyricist={lyricist}
                    setLyricist={setLyricist}
                  />
                )}

                <MediaUploadBox
                  contentType={contentType}
                  fileName={fileName}
                  isDragging={isDragging}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onFileChange={handleFileChange}
                />

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full rounded-full border-2 border-white/55 bg-gradient-to-b from-[#ff6659] to-[#b8322a] px-5 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgba(89,15,20,0.42)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none disabled:opacity-60"
                >
                  {isLoading
                    ? "מעלה לשרת..."
                    : publishMode === "published"
                    ? "שמירה ופרסום"
                    : "שמירה כטיוטה"}
                </button>
              </div>
            </section>

            <CreateSummary
              contentType={contentType}
              publishMode={publishMode}
              title={title}
              topic={topic}
              category={category}
              level={level}
              minAge={minAge}
              maxAge={maxAge}
              hobbies={hobbies}
              expectations={expectations}
              fileName={fileName}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
