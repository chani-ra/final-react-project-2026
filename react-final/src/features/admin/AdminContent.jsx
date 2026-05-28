import React, { useEffect, useState } from "react";
import {
  getAllSongsForAdmin,
  setWeeklySong,
} from "../../services/adminService";
import CustomAudioPlayer from "../../components/CustomAudioPlayer";

export default function AdminContent() {
  const [activeType, setActiveType] = useState("songs");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  // טעינת כל השירים למנהל
  const loadSongs = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllSongsForAdmin();
      setSongs(data);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  // קביעת שיר השבוע
  const handleSetWeeklySong = async (songId) => {
    try {
      setActionLoadingId(songId);
      setMessage({ type: "", text: "" });

      await setWeeklySong(songId);

      setSongs((prev) =>
        prev.map((song) => ({
          ...song,
          isWeeklySong: song._id === songId,
          weeklySelectedAt:
            song._id === songId ? new Date().toISOString() : null,
          isPublic: song._id === songId ? true : song.isPublic,
        }))
      );

      setMessage({
        type: "success",
        text: "שיר השבוע עודכן בהצלחה",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          🗂️ בקרת תוכן גלובלית
        </h1>

        <p className="text-gray-400 mt-1">
          ניהול תכני האתר ובחירת שיר השבוע מתוך השירים שהמורות העלו.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit border border-white/10">
        <button
          onClick={() => setActiveType("songs")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeType === "songs"
              ? "bg-emerald-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🎵 שירים ({songs.length})
        </button>

        <button
          onClick={() => setActiveType("lessons")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeType === "lessons"
              ? "bg-indigo-500 text-white shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🎬 שיעורים
        </button>

        <button
          onClick={() => setActiveType("exercises")}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeType === "exercises"
              ? "bg-yellow-500 text-slate-950 shadow-lg"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📝 תרגילים
        </button>
      </div>

      {activeType === "lessons" && (
        <ComingSoon
          icon="🎬"
          title="ניהול שיעורים גלובלי"
          text="בשלב הבא נחבר כאן את כל השיעורים מכל המורות, כולל פרסום, הסרה ובקרה."
        />
      )}

      {activeType === "exercises" && (
        <ComingSoon
          icon="📝"
          title="ניהול תרגילים גלובלי"
          text="בשלב הבא נחבר כאן את כל התרגילים שנוצרו ידנית או בעזרת AI."
        />
      )}

      {activeType === "songs" && (
        <>
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center text-white font-bold text-xl">
              <div className="animate-pulse">טוען שירים... 🎵</div>
            </div>
          ) : songs.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">🎵</div>

              <h2 className="text-2xl font-black mb-2">
                עדיין אין שירים במערכת
              </h2>

              <p className="text-gray-400">
                כשהמורות יעלו שירים, הם יופיעו כאן לבחירת שיר השבוע.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {songs.map((song) => (
                <div
                  key={song._id}
                  className={`rounded-3xl p-6 border transition-all ${
                    song.isWeeklySong
                      ? "bg-yellow-400/10 border-yellow-400/40"
                      : "bg-white/5 border-white/10 hover:border-emerald-400/30"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-4xl mb-3">
                        {song.isWeeklySong ? "🌟" : "🎵"}
                      </div>

                      <h3 className="text-2xl font-black text-white">
                        {song.title || song.theme || "שיר לימודי"}
                      </h3>

                      <p className="text-gray-400 text-sm mt-2">
                        נושא: {song.theme || "לא צוין"} · רמה:{" "}
                        {getLevelLabel(song.level)}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        מורה: {song.uploadedBy?.username || "לא ידוע"} · מלחין:{" "}
                        {song.composer || "לא צוין"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                      {song.isWeeklySong && (
                        <span className="bg-yellow-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black">
                          שיר השבוע
                        </span>
                      )}

                      {song.isPublic ? (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold">
                          ציבורי
                        </span>
                      ) : (
                        <span className="bg-white/10 text-gray-400 border border-white/10 px-3 py-1 rounded-full text-xs font-bold">
                          טיוטה
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <CustomAudioPlayer
                      src={`http://localhost:3000/songs/song/${song._id}/stream`}
                      title={song.title || song.theme || "שיר לימודי"}
                      subtitle={`בדיקת האזנה למנהל · ${getLevelLabel(
                        song.level
                      )}`}
                      allowDownload={false}
                    />
                  </div>

                  <button
                    onClick={() => handleSetWeeklySong(song._id)}
                    disabled={actionLoadingId === song._id || song.isWeeklySong}
                    className={`w-full mt-5 py-3 rounded-xl font-black transition-all ${
                      song.isWeeklySong
                        ? "bg-yellow-400 text-slate-950 cursor-default"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    } disabled:opacity-70`}
                  >
                    {actionLoadingId === song._id
                      ? "מעדכן..."
                      : song.isWeeklySong
                      ? "🌟 שיר השבוע הנוכחי"
                      : "קבע כשיר השבוע"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ComingSoon({ icon, title, text }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-black mb-2">{title}</h2>
      <p className="text-gray-400 max-w-2xl mx-auto">{text}</p>
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