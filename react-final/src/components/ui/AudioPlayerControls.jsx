import { clampPlaybackPosition, formatPlaybackTime } from "./audioPlayerModel.js";

/**
 * One presentational player for learner audio, dashboard songs and previews.
 * Audio ownership belongs to the caller (persistent provider or local preview).
 */
export default function AudioPlayerControls({
  title,
  subtitle = "",
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  onToggle,
  onSeek,
  volume = 0.85,
  onVolumeChange,
  playbackRate = 1,
  onSpeedChange,
  downloadUrl = "",
  compact = false,
  error = "",
  onReturn,
  returnLabel = "חזרה לשירים",
  onClose,
}) {
  const position = clampPlaybackPosition(currentTime, duration);
  return (
    <div
      dir="rtl"
      className={`min-w-0 rounded-2xl border border-[#b5d7e9]/20 bg-gradient-to-l from-[#123e60] via-[#153b59] to-[#102d49] text-white shadow-[0_12px_30px_rgba(5,34,55,0.20)] ${compact ? "px-3 py-2.5" : "p-4 sm:p-5"}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-xl bg-[#f3cf83]/14 text-[#f3cf83] ${compact ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl"}`}>
          ♪
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-white" title={title}>{title || "שיר לימודי"}</div>
          {subtitle && <div className="truncate text-xs text-[#c1d8e7]">{subtitle}</div>}
        </div>
        {compact && onReturn && (
          <button
            type="button"
            onClick={onReturn}
            aria-label={returnLabel}
            title={returnLabel}
            className="group/return inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-1.5 text-xs font-semibold text-[#c1d8e7]/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3cf83]"
          >
            <span aria-hidden="true" className="text-lg leading-none">→</span>
            <span className="hidden max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-200 group-hover/return:max-w-32 group-hover/return:opacity-100 group-focus-within/return:max-w-32 group-focus-within/return:opacity-100 sm:inline-block">
              {returnLabel}
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={onToggle}
          disabled={!onToggle}
          aria-label={isPlaying ? "השהיית השיר" : "השמעת השיר"}
          className={`flex shrink-0 items-center justify-center rounded-full bg-[#f3cf83] text-[#153651] shadow-sm transition hover:bg-[#ffe1a1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3cf83] disabled:opacity-50 ${compact ? "h-10 w-10" : "h-12 w-12"}`}
        >
          <span aria-hidden="true" className="text-lg font-bold">{isPlaying ? "Ⅱ" : "▶"}</span>
        </button>
        {compact && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="סגירת הנגן ועצירת השיר"
            title="סגירת הנגן"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xl leading-none text-[#c1d8e7]/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f3cf83]"
          >
            ×
          </button>
        )}
      </div>
      <div className="mt-2.5 flex items-center gap-2" dir="ltr">
        <span className="w-9 shrink-0 text-center text-[11px] tabular-nums text-[#c3d7e4]">{formatPlaybackTime(position)}</span>
        <input
          aria-label="מיקום השיר"
          type="range"
          disabled={!onSeek}
          min="0"
          max={Number.isFinite(duration) && duration > 0 ? duration : 0}
          step="0.1"
          value={position}
          onChange={(event) => onSeek?.(Number(event.target.value))}
          className="h-2 min-w-0 flex-1 cursor-pointer accent-[#f3cf83]"
        />
        <span className="w-9 shrink-0 text-center text-[11px] tabular-nums text-[#c3d7e4]">{formatPlaybackTime(duration)}</span>
      </div>
      {!compact && (onVolumeChange || onSpeedChange || downloadUrl) && (
        <details className="mt-2.5 border-t border-white/10 pt-2.5 text-xs text-[#dbe9f2]">
          <summary className="w-fit cursor-pointer select-none rounded-lg px-2 py-1 font-semibold transition hover:bg-white/10">אפשרויות השמעה</summary>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {onVolumeChange && (
              <label className="flex items-center gap-2">
                <span>עוצמה</span>
                <input aria-label="עוצמת השמעה" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => onVolumeChange(Number(event.target.value))} className="w-24 accent-[#f3cf83]" />
              </label>
            )}
            {onSpeedChange && (
              <label className="flex items-center gap-2">
                <span>מהירות</span>
                <select aria-label="מהירות השמעה" value={playbackRate} onChange={(event) => onSpeedChange(Number(event.target.value))} className="rounded-lg border border-white/15 bg-[#1a4a6b] px-2 py-1 text-white">
                  {[0.75, 1, 1.25, 1.5, 2].map((speed) => <option key={speed} value={speed}>{speed}×</option>)}
                </select>
              </label>
            )}
            {downloadUrl && <a href={downloadUrl} download className="rounded-lg border border-white/20 px-3 py-1.5 font-semibold hover:bg-white/10">הורדת שיר</a>}
          </div>
        </details>
      )}
      {error && <p role="alert" className="mt-2 text-xs text-[#ffd6d6]">{error}</p>}
    </div>
  );
}
