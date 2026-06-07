import React, { useEffect, useRef, useState } from "react";

export default function CustomAudioPlayer({
  src,
  title = "Audio",
  subtitle = "",
  allowDownload = false,
}) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError("");
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setError("לא הצלחנו להפעיל את השיר. בדקי שהקובץ קיים ושהשרת פעיל.");
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration || 0);
    audio.volume = volume;
    audio.playbackRate = playbackRate;
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime || 0);
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (!audio) return;

    const value = Number(event.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative overflow-hidden rounded-[2.1rem] border border-white/24 bg-[#072842] text-white shadow-[0_24px_60px_rgba(3,31,61,0.38),inset_0_1px_0_rgba(255,255,255,0.16)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_52%)]" />

      <div className="relative z-10 p-5">
        <div className="grid gap-5 lg:grid-cols-[120px_1fr] lg:items-center">
          <div className="flex justify-center">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-24 w-24 items-center justify-center rounded-[2rem] border-[6px] border-[#075a98] bg-gradient-to-b from-[#ff6659] to-[#b8322a] text-4xl font-black text-white shadow-[0_11px_0_rgba(89,15,20,0.42),0_20px_32px_rgba(3,31,61,0.30)] transition hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:shadow-none"
              aria-label={isPlaying ? "עצירה" : "השמעה"}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="text-xs font-black tracking-[0.18em] text-[#ffd439]">
                  AUDIO PLAYER
                </div>

                <h3 className="mt-1 line-clamp-1 text-2xl font-black leading-tight">
                  {title}
                </h3>

                {subtitle && (
                  <p className="mt-1 line-clamp-1 text-sm font-bold text-white/62">
                    {subtitle}
                  </p>
                )}
              </div>

              <div className="rounded-full border border-white/14 bg-white/9 px-3 py-1 text-xs font-black text-white/66">
                {isPlaying ? "מתנגן עכשיו" : "מוכן להשמעה"}
              </div>
            </div>

            <div className="mt-5 rounded-[1.4rem] border border-white/14 bg-[#123c6b]/68 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <div className="mb-2 flex justify-between text-xs font-black text-white/72">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <RangeWithFill
                min={0}
                max={duration || 0}
                step={0.01}
                value={currentTime}
                percent={progressPercent}
                onChange={handleSeek}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-black text-white">עוצמת שמע</div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">
                {Math.round(volume * 100)}%
              </div>
            </div>

            <div className="grid grid-cols-[32px_1fr_32px] items-center gap-3">
              <span className="text-xl">🔈</span>

              <RangeWithFill
                min={0}
                max={1}
                step={0.01}
                value={volume}
                percent={volume * 100}
                onChange={(event) => setVolume(Number(event.target.value))}
              />

              <span className="text-xl">🔊</span>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-black text-white">מהירות השמעה</div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/70">
                {playbackRate}x
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setPlaybackRate(rate)}
                  className={`rounded-full px-2 py-2 text-xs font-black transition ${
                    playbackRate === rate
                      ? "bg-[#ffd439] text-[#123c6b] shadow-[0_0_16px_rgba(255,212,57,0.35)]"
                      : "bg-white/10 text-white/72 hover:bg-white/16 hover:text-white"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white/55">
            <span className="h-2 w-2 rounded-full bg-[#ffd439] shadow-[0_0_10px_rgba(255,212,57,0.9)]" />
            <span>אפשר לשנות מהירות, ווליום או לגרור את פס ההתקדמות.</span>
          </div>

          {allowDownload && (
            <a
              href={src}
              download
              className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-center text-xs font-black text-white transition hover:bg-white/16"
            >
              הורדת קובץ
            </a>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-300/35 bg-red-500/16 p-3 text-sm font-bold text-red-100">
            {error}
          </div>
        )}

        <audio
          ref={audioRef}
          src={src}
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={() =>
            setError("לא הצלחנו לטעון את קובץ השמע. בדקי שהשרת פעיל.")
          }
        />
      </div>

      <style>
        {`
          .player-range::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 999px;
            background: #ffffff;
            border: 5px solid #075a98;
            box-shadow: 0 5px 14px rgba(3,31,61,0.40);
            cursor: pointer;
          }

          .player-range::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 999px;
            background: #ffffff;
            border: 5px solid #075a98;
            box-shadow: 0 5px 14px rgba(3,31,61,0.40);
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}

function RangeWithFill({ min, max, step, value, percent, onChange }) {
  return (
    <div className="relative h-8">
      <div className="absolute left-0 right-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-white/18 shadow-[inset_0_1px_3px_rgba(0,0,0,0.18)]" />

      <div
        className="pointer-events-none absolute right-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-l from-[#ffd439] via-[#ff6659] to-[#b8322a] shadow-[0_0_14px_rgba(255,212,57,0.22)]"
        style={{ width: `${Math.max(0, Math.min(100, percent || 0))}%` }}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="player-range relative z-10 h-8 w-full cursor-pointer appearance-none bg-transparent"
      />
    </div>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const restSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${restSeconds}`;
}