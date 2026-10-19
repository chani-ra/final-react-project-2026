import useDictionary from "./useDictionary.js";
import SmartGuideBackButton from "../../../components/ui/SmartGuideBackButton";
import { StatBox, TextInput, TextArea, FilterButton, WordCard, LoadingState, EmptyDictionary, SmallSpinner, DarkSpinner } from "./DictionaryComponents.jsx";

export default function Dictionary() {
  const {
    form, searchQuery, setSearchQuery, activeFilter,
    setActiveFilter, loading, translating, saving,
    actionLoadingId, updateField, handleTranslate, handleSaveWord,
    handleToggleMastered, handleDeleteWord, stats, filteredWords,
  } = useDictionary();

  return (
    <div className="space-y-5" dir="rtl">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              מילון אישי
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              המילים שלי באנגלית
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              כתבי מילה או ביטוי, תני למערכת לבדוק ולתרגם, ושמרי למילון האישי
              כדי לחזור ולתרגל.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:min-w-[330px]">
            <StatBox label="סה״כ" value={stats.total} tone="yellow" />
            <StatBox label="יודעת" value={stats.mastered} tone="green" />
            <StatBox label="בתרגול" value={stats.practicing} tone="red" />
          </div>
        </div>
      </section>



      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
        <section
          className="relative h-fit overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <h2 className="text-2xl font-black">הוספת מילה</h2>

            <p className="mt-2 text-sm font-semibold leading-6 text-white/55">
              אפשר להכניס מילה, לבדוק אותה, ואז לשמור.
            </p>

            <form onSubmit={handleSaveWord} className="mt-5 space-y-4">
              <TextInput
                label="מילה / ביטוי באנגלית"
                value={form.word}
                onChange={(value) => updateField("word", value)}
                placeholder="challenge"
                dir="ltr"
              />

              <button
                type="button"
                onClick={handleTranslate}
                disabled={translating || !form.word.trim()}
                className="w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  boxShadow:
                    translating || !form.word.trim()
                      ? "none"
                      : "0 6px 0 rgba(89,15,20,0.42)",
                }}
              >
                {translating ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <SmallSpinner />
                    בודק ומתרגם...
                  </span>
                ) : (
                  "בדוק ותרגם"
                )}
              </button>

              <TextInput
                label="תרגום לעברית"
                value={form.translation}
                onChange={(value) => updateField("translation", value)}
                placeholder="תרגום"
              />

              <TextArea
                label="הסבר קצר באנגלית"
                value={form.definition}
                onChange={(value) => updateField("definition", value)}
                placeholder="Short English definition..."
                dir="ltr"
              />

              <TextArea
                label="משפט דוגמה"
                value={form.example}
                onChange={(value) => updateField("example", value)}
                placeholder="Example sentence..."
                dir="ltr"
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-full border-2 border-yellow-300/70 bg-yellow-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:brightness-105 active:translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <DarkSpinner />
                    שומר...
                  </span>
                ) : (
                  "שמור במילון"
                )}
              </button>
            </form>
          </div>
        </section>

        <section
          className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
          style={{
            boxShadow:
              "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

          <div className="relative z-10">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש במילון..."
                className="w-full rounded-full border-2 border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15 md:max-w-md"
              />

              <div className="flex flex-wrap gap-2">
                <FilterButton
                  label="הכל"
                  active={activeFilter === "all"}
                  onClick={() => setActiveFilter("all")}
                />

                <FilterButton
                  label="בתרגול"
                  active={activeFilter === "practice"}
                  onClick={() => setActiveFilter("practice")}
                />

                <FilterButton
                  label="יודעת"
                  active={activeFilter === "mastered"}
                  onClick={() => setActiveFilter("mastered")}
                />
              </div>
            </div>

            {loading ? (
              <LoadingState />
            ) : filteredWords.length === 0 ? (
              <EmptyDictionary />
            ) : (
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filteredWords.map((word) => (
                  <WordCard
                    key={word._id}
                    word={word}
                    isLoading={actionLoadingId === word._id}
                    onToggle={() => handleToggleMastered(word._id)}
                    onDelete={() => handleDeleteWord(word._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
