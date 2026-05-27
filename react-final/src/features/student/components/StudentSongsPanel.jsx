import React, { useEffect, useRef, useState } from "react";

export default function StudentSongsPanel({ songs = [], getLevelLabel }) {
  const audioRef = useRef(null);

  const [activeSong, setActiveSong] = useState(songs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // החלפת שיר פעיל כשיש שירים חדשים
  useEffect(() => {
    if (!activeSong && songs.length > 0) {
      setActiveSong(songs[0]);
    }
  }, [songs, activeSong]);

  // הפעלה או עצירה של השיר
  const togglePlay = async () => {
    if (!audioRef.current || !activeSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("שגיאה בהפעלת שיר:", error);
    }
  };

  // בחירת שיר מהרשימה
  const selectSong = (song) => {
    setActiveSong(song);
    setIsPlaying(false);
    setCurrentTime(0);

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.load();
      }
    }, 0);
  };

  // שינוי מיקום ההשמעה
  const handleSeek = (e) => {
    const newTime = Number(e.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }

    setCurrentTime(newTime);
  };

  // פורמט זמן לתצוגה
  const formatTime = (time) => {
    if (!time || Number.isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  if (!songs.length) {
    return (
      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-2">🎵 שירי תרגול</h2>
        <p className="text-gray-400 text-sm">
          עדיין אין שירים מותאמים בקורס.
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:col-span-3">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black">🎵 שירי תרגול</h2>
          <p className="text-gray-400 text-sm mt-1">
            בחרי שיר, האזיני בצורה נעימה, וחזקי הבנה, ביטחון ואוצר מילים.
          </p>
        </div>

        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-full text-sm font-bold h-fit">
          {songs.length} שירים בקורס
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {songs.map((song, index) => {
            const isActive = activeSong?._id === song._id;

            return (
              <button
                key={song._id}
                type="button"
                onClick={() => selectSong(song)}
                className={`w-full text-right p-4 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-emerald-500/20 border-emerald-400"
                    : "bg-black/20 border-white/10 hover:border-white/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                      isActive ? "bg-emerald-400 text-slate-950" : "bg-white/10"
                    }`}
                  >
                    {isActive && isPlaying ? "▶" : "🎧"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-black text-white truncate">
                      {index + 1}. {song.title || song.theme || "שיר לימודי"}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1 truncate">
                      רמה: {getLevelLabel(song.level)} · נושא:{" "}
                      {song.theme || "לא צוין"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3 bg-slate-950/70 border border-white/10 rounded-3xl p-6">
          {!activeSong ? (
            <div className="text-center text-gray-400 py-12">
              בחרי שיר מהרשימה כדי להתחיל להאזין.
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-5xl mb-3">🎶</div>

                  <h3 className="text-3xl font-black text-white">
                    {activeSong.title || activeSong.theme || "שיר לימודי"}
                  </h3>

                  <p className="text-gray-400 mt-2">
                    רמה: {getLevelLabel(activeSong.level)} · נושא:{" "}
                    {activeSong.theme || "לא צוין"}
                  </p>

                  {(activeSong.composer || activeSong.lyricist) && (
                    <p className="text-gray-500 text-sm mt-2">
                      מלחין: {activeSong.composer || "לא צוין"} · כותב מילים:{" "}
                      {activeSong.lyricist || "לא צוין"}
                    </p>
                  )}
                </div>

                <div className="bg-emerald-400 text-slate-950 px-4 py-2 rounded-full text-sm font-black h-fit">
                  Listening Practice
                </div>
              </div>

              <audio
                ref={audioRef}
                src={`http://localhost:3000/songs/song/${activeSong._id}/stream`}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-2xl font-black transition-all shadow-lg"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>

                  <div className="flex-1">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full accent-emerald-400"
                    />

                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <h4 className="font-bold text-emerald-300 mb-2">
                  טיפ לתרגול:
                </h4>

                <p className="text-gray-300 text-sm leading-relaxed">
                  האזיני פעם אחת בשביל להבין את הרעיון הכללי, ופעם שנייה כדי
                  לזהות מילים מוכרות או ביטויים חדשים.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}