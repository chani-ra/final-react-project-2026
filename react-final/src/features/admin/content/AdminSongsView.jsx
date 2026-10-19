import { apiUrl } from "../../../services/axiosConfig";
import CustomAudioPlayer from "../../../components/CustomAudioPlayer";

export function SongsTable({
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

export function SelectedSongPanel({ song, actionLoadingId, onSetWeeklySong }) {
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
