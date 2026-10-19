import { useState } from "react";
import useAdminSongs from "./useAdminSongs.js";
import { SongsTable, SelectedSongPanel } from "./AdminSongsView.jsx";
import {
  TabButton, MiniCounter, SimpleContentPanel, LoadingState, EmptyContent,
} from "./AdminContentUi.jsx";

export default function AdminContent() {
  const [activeType, setActiveType] = useState("songs");
  const {
    songs, selectedSongId, setSelectedSongId, loading,
    actionLoadingId, selectedSong, stats,
    loadSongs, handleSetWeeklySong,
  } = useAdminSongs();

  return (
    <div className="space-y-5" dir="rtl">
      <section
        className="relative overflow-hidden rounded-[2.1rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              content control
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              בקרת תוכן
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              ניהול התוכן שמופיע באתר, כולל בחירת שיר שבועי מתוך השירים
              שהועלו למערכת.
            </p>
          </div>

          <button
            type="button"
            onClick={loadSongs}
            className="w-fit rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            רענון תוכן
          </button>
        </div>
      </section>



      <section
        className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <TabButton
                active={activeType === "songs"}
                onClick={() => setActiveType("songs")}
              >
                שירים ({stats.total})
              </TabButton>

              <TabButton
                active={activeType === "lessons"}
                onClick={() => setActiveType("lessons")}
              >
                שיעורים
              </TabButton>

              <TabButton
                active={activeType === "exercises"}
                onClick={() => setActiveType("exercises")}
              >
                תרגילים
              </TabButton>
            </div>

            <div className="flex flex-wrap gap-2">
              <MiniCounter label="סה״כ" value={stats.total} tone="blue" />

              <MiniCounter
                label="ציבוריים"
                value={stats.publicSongs}
                tone="yellow"
              />

              <MiniCounter label="טיוטות" value={stats.draftSongs} tone="red" />

              <MiniCounter
                label="שבועי"
                value={stats.weeklySongs}
                tone="green"
              />
            </div>
          </div>

          {activeType === "songs" && (
            <>
              {loading ? (
                <LoadingState />
              ) : songs.length === 0 ? (
                <EmptyContent />
              ) : (
                <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px]">
                  <SongsTable
                    songs={songs}
                    selectedSongId={selectedSongId}
                    actionLoadingId={actionLoadingId}
                    onSelectSong={setSelectedSongId}
                    onSetWeeklySong={handleSetWeeklySong}
                  />

                  <SelectedSongPanel
                    song={selectedSong}
                    actionLoadingId={actionLoadingId}
                    onSetWeeklySong={handleSetWeeklySong}
                  />
                </div>
              )}
            </>
          )}

          {activeType === "lessons" && (
            <SimpleContentPanel
              title="שיעורים"
              text="כאן יוצגו שיעורים גלובליים לניהול ובקרה כאשר הם ייטענו למסך הניהול."
            />
          )}

          {activeType === "exercises" && (
            <SimpleContentPanel
              title="תרגילים"
              text="כאן יוצגו תרגילים גלובליים לניהול ובקרה כאשר הם ייטענו למסך הניהול."
            />
          )}
        </div>
      </section>
    </div>
  );
}
