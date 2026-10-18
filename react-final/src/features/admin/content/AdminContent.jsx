import useMessageNotice from "../../../components/ui/useMessageNotice";
import { apiUrl } from "../../../services/axiosConfig";
import React, { useEffect, useMemo, useState } from "react";
import {
  getAllSongsForAdmin,
  setWeeklySong,
} from "../../../services/adminService";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer";

export default function AdminContent() {
  const [activeType, setActiveType] = useState("songs");
  const [songs, setSongs] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  useMessageNotice(message);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllSongsForAdmin();
      const list = Array.isArray(data) ? data : [];

      setSongs(list);

      if (list.length > 0) {
        const weeklySong = list.find((song) => song.isWeeklySong);
        setSelectedSongId((weeklySong || list[0])._id);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const selectedSong = useMemo(() => {
    return songs.find((song) => song._id === selectedSongId) || null;
  }, [songs, selectedSongId]);

  const stats = useMemo(() => {
    return {
      total: songs.length,
      publicSongs: songs.filter((song) => song.isPublic).length,
      draftSongs: songs.filter((song) => !song.isPublic).length,
      weeklySongs: songs.filter((song) => song.isWeeklySong).length,
    };
  }, [songs]);

  const handleSetWeeklySong = async (songId) => {
    try {
      setActionLoadingId(songId);
      setMessage({ type: "", text: "" });

      await setWeeklySong(songId);

      setSongs((prevSongs) =>
        prevSongs.map((song) => ({
          ...song,
          isWeeklySong: song._id === songId,
          weeklySelectedAt:
            song._id === songId ? new Date().toISOString() : null,
          isPublic: song._id === songId ? true : song.isPublic,
        }))
      );

      setSelectedSongId(songId);

      setMessage({
        type: "success",
        text: "שיר השבוע עודכן בהצלחה.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

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

function SongsTable({
  songs,
  selectedSongId,
  actionLoadingId,
  onSelectSong,
  onSetWeeklySong,
}) {
  return (
    <div className="h-[540px] overflow-hidden rounded-[1.7rem] border-2 border-white/14 bg-slate-950/45">
      <div className="h-full overflow-auto">
        <table className="w-full min-w-[850px] text-right">
          <thead className="sticky top-0 z-20">
            <tr className="border-b border-white/12 bg-slate-950 text-xs font-black text-white/62">
              <th className="px-4 py-4">שם השיר</th>
              <th className="px-4 py-4">נושא</th>
              <th className="px-4 py-4">רמה</th>
              <th className="px-4 py-4">מורה</th>
              <th className="px-4 py-4">סטטוס</th>
              <th className="px-4 py-4">שבועי</th>
              <th className="px-4 py-4 text-left">פעולה</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/8 text-sm">
            {songs.map((song) => {
              const isSelected = selectedSongId === song._id;
              const isLoading = actionLoadingId === song._id;

              return (
                <tr
                  key={song._id}
                  onClick={() => onSelectSong(song._id)}
                  className={`cursor-pointer transition ${
                    isSelected ? "bg-yellow-300/10" : "hover:bg-white/8"
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="font-black text-white">
                      {song.title || "שיר ללא שם"}
                    </div>

                    {song.composer && (
                      <div className="mt-1 text-xs font-bold text-white/40">
                        {song.composer}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {song.theme || "לא צוין"}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {getLevelLabel(song.level)}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {song.uploadedBy?.username || "לא ידוע"}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge isPublic={song.isPublic} />
                  </td>

                  <td className="px-4 py-4">
                    {song.isWeeklySong ? (
                      <span className="rounded-full border border-yellow-300/45 bg-yellow-300 px-3 py-1 text-xs font-black text-slate-950">
                        שיר השבוע
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-white/35">
                        רגיל
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSetWeeklySong(song._id);
                        }}
                        disabled={isLoading || song.isWeeklySong}
                        className={`rounded-full border px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-55 ${
                          song.isWeeklySong
                            ? "border-yellow-300/35 bg-yellow-300/15 text-yellow-100"
                            : "border-red-300/35 bg-red-500/15 text-red-100 hover:bg-red-500/25"
                        }`}
                      >
                        {isLoading
                          ? "מעדכן..."
                          : song.isWeeklySong
                          ? "נבחר"
                          : "קבע שבועי"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SelectedSongPanel({ song, actionLoadingId, onSetWeeklySong }) {
  if (!song) {
    return (
      <aside className="sticky top-5 h-[540px] self-start overflow-y-auto rounded-[1.7rem] border-2 border-white/14 bg-slate-950/45 p-4 text-white">
        <h2 className="text-xl font-black">בחרי שיר</h2>

        <p className="mt-2 text-sm font-semibold text-white/55">
          לאחר בחירת שיר בטבלה, הפרטים שלו יוצגו כאן.
        </p>
      </aside>
    );
  }

  const isLoading = actionLoadingId === song._id;

  return (
    <aside
      className="sticky top-5 h-[540px] self-start overflow-y-auto rounded-[1.7rem] border-2 border-white/18 bg-slate-950/55 p-4 text-white"
      style={{
        boxShadow:
          "0 18px 55px rgba(3,31,61,0.24), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black leading-tight text-white">
            {song.title || "שיר ללא שם"}
          </h2>

          <p className="mt-1 text-xs font-semibold text-white/48">
            {song.theme || "ללא נושא"} · {getLevelLabel(song.level)}
          </p>
        </div>

        {song.isWeeklySong && (
          <span className="rounded-full border border-yellow-300/45 bg-yellow-300 px-3 py-1 text-xs font-black text-slate-950">
            שבועי
          </span>
        )}
      </div>

      <div className="space-y-2.5">
        <InfoLine label="מורה" value={song.uploadedBy?.username || "לא ידוע"} />
        <InfoLine label="מלחין" value={song.composer || "לא צוין"} />
        <InfoLine label="סטטוס" value={song.isPublic ? "ציבורי" : "טיוטה"} />
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-white/12 bg-slate-950/40 p-2">
        <CustomAudioPlayer
          src={apiUrl(`/songs/song/${song._id}/stream`)}
          title={song.title || song.theme || "שיר לימודי"}
          subtitle={`בדיקת האזנה למנהל · ${getLevelLabel(song.level)}`}
          allowDownload={false}
        />
      </div>

      <button
        type="button"
        onClick={() => onSetWeeklySong(song._id)}
        disabled={isLoading || song.isWeeklySong}
        className="mt-4 w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
        style={{
          boxShadow:
            isLoading || song.isWeeklySong
              ? "none"
              : "0 6px 0 rgba(89,15,20,0.42)",
        }}
      >
        {isLoading
          ? "מעדכן..."
          : song.isWeeklySong
          ? "זה שיר השבוע הנוכחי"
          : "קבע כשיר השבוע"}
      </button>
    </aside>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
        active
          ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
          : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
      }`}
    >
      {children}
    </button>
  );
}

function MiniCounter({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
  };

  return (
    <div
      className={`rounded-[1.15rem] border px-4 py-3 text-center ${
        tones[tone] || tones.yellow
      }`}
    >
      <div className="text-xl font-black">{value}</div>
      <div className="text-[11px] font-black opacity-75">{label}</div>
    </div>
  );
}

function StatusBadge({ isPublic }) {
  if (isPublic) {
    return (
      <span className="rounded-full border border-emerald-300/35 bg-emerald-300/12 px-3 py-1 text-xs font-black text-emerald-100">
        ציבורי
      </span>
    );
  }

  return (
    <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-xs font-black text-white/55">
      טיוטה
    </span>
  );
}

function InfoLine({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-slate-950/45 px-3 py-2.5">
      <span className="text-xs font-black text-white/40">{label}</span>
      <span className="text-xs font-bold text-white/72">{value}</span>
    </div>
  );
}

function SimpleContentPanel({ title, text }) {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-white/18 bg-white/8 p-8 text-center">
      <h2 className="text-2xl font-black text-white">{title}</h2>

      <p className="mx-auto mt-3 max-w-xl text-sm font-semibold leading-7 text-white/58">
        {text}
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black">טוען תוכן...</p>
      </div>
    </div>
  );
}

function EmptyContent() {
  return (
    <div className="rounded-[1.7rem] border-2 border-dashed border-white/18 bg-white/8 p-10 text-center">
      <h2 className="text-2xl font-black text-white">אין שירים במערכת</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/58">
        כאשר יתווספו שירים, הם יופיעו כאן לניהול ובחירת שיר שבועי.
      </p>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}