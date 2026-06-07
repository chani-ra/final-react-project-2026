import React from "react";
import { getStationIcon } from "./dashboardIcons";

export default function JourneyMap({ stations, onStationClick }) {
  return (
    <div className="relative min-h-[620px] overflow-hidden px-5 pb-10 pt-6 md:px-8">
      <MapSoftOverlay />
      <JourneyPathLayer />

      <div className="relative z-10 grid min-h-[540px] grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 xl:grid-cols-6">
        {stations.map((station, index) => (
          <BalloonStationCard
            key={station.id}
            station={station}
            index={index}
            onClick={() => onStationClick(station.id)}
          />
        ))}
      </div>
    </div>
  );
}

function BalloonStationCard({ station, index, onClick }) {
  const liftClass =
    index === 0
      ? "xl:translate-y-16"
      : index === 1
      ? "xl:translate-y-[84px]"
      : index === 2
      ? "xl:translate-y-8"
      : index === 3
      ? "xl:translate-y-[92px]"
      : index === 4
      ? "xl:translate-y-6"
      : "xl:translate-y-[88px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 ${liftClass}`}
    >
      {station.glow && (
        <>
          <div className="absolute top-0 h-56 w-56 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute top-10 h-36 w-36 rounded-full bg-[#78d9ff]/24 blur-2xl" />
        </>
      )}

      <div className="relative">
        <div className="absolute inset-x-0 top-1 mx-auto h-36 w-36 rounded-full bg-white/12 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100" />

        <div className="relative flex h-[184px] w-[142px] flex-col items-center">
          <div className="absolute left-1/2 top-[125px] z-0 h-13 w-[3px] -translate-x-1/2 rounded-full bg-[#075a98]/70" />

          <div className="absolute top-[140px] z-10 h-8 w-8 rounded-full border-[4px] border-[#075a98] bg-gradient-to-b from-[#ff6f62] to-[#b8322a] shadow-[0_6px_12px_rgba(5,44,80,0.24)]" />

          <div className="absolute top-[6px] z-10 h-[146px] w-[142px] rounded-[52%_52%_48%_48%/47%_47%_58%_58%] border-[7px] border-[#075a98] bg-gradient-to-b from-[#ff705f] via-[#e93834] to-[#a51f23] shadow-[0_20px_36px_rgba(3,38,66,0.40),inset_0_7px_0_rgba(255,255,255,0.22),inset_0_-14px_22px_rgba(70,9,15,0.24),0_0_26px_rgba(255,255,255,0.18)]" />

          <div className="absolute top-[14px] z-20 h-[130px] w-[126px] rounded-[52%_52%_48%_48%/47%_47%_58%_58%] border-[4px] border-[#ff8a72] bg-gradient-to-b from-[#ff6f62] via-[#dd332f] to-[#961b22]" />

          <div className="absolute top-[26px] z-30 flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full border-[5px] border-[#075a98] bg-gradient-to-br from-[#dff8ff] via-[#ffffff] to-[#a9d9e7] shadow-[inset_0_3px_10px_rgba(255,255,255,0.55),0_10px_18px_rgba(10,71,114,0.16)]">
            <StationIllustration iconKey={station.iconKey} />
          </div>

          <div className="absolute left-[24px] top-[24px] z-40 h-[76px] w-[18px] rounded-full bg-white/22 blur-[1px]" />

          <div className="absolute top-[124px] z-40 flex h-12 w-12 items-center justify-center rounded-full border-[4px] border-[#075a98] bg-gradient-to-b from-[#ff7b66] to-[#b8322a] text-lg font-black text-white shadow-[0_9px_15px_rgba(4,47,77,0.30)]">
            {station.number}
          </div>

          <div className="absolute top-[151px] z-20 h-8 w-12 rounded-b-xl border-[5px] border-[#075a98] bg-gradient-to-b from-[#e23d35] to-[#9f2423] shadow-[0_8px_14px_rgba(3,38,66,0.28)]" />

          <div className="absolute -left-1 top-9 z-50 h-4 w-4 rounded-full bg-[#ffd439] shadow-[0_0_20px_rgba(255,212,57,0.96)]" />

          {station.glow && (
            <div className="absolute top-[6px] z-50 h-[146px] w-[142px] rounded-[52%_52%_48%_48%/47%_47%_58%_58%] ring-4 ring-white/42" />
          )}
        </div>
      </div>

      <div className="mt-2 max-w-[165px]">
        <div className="text-[20px] font-black leading-tight text-white drop-shadow-[0_2px_3px_rgba(15,59,91,0.38)]">
          {station.title}
        </div>

        <div className="mt-1 text-[13px] font-bold leading-tight text-white/88">
          {station.short}
        </div>
      </div>
    </button>
  );
}

function StationIllustration({ iconKey }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.35)_32%,rgba(255,255,255,0)_68%)]" />

      <div className="absolute bottom-0 h-9 w-full bg-[#76c4dd]/18" />

      {iconKey === "music" && (
        <>
          <div className="absolute left-4 top-5 h-14 w-10 rounded-lg border-[4px] border-[#d5382f] bg-[#f7c24b] rotate-[-10deg]" />
          <div className="absolute right-4 top-7 h-14 w-10 rounded-lg border-[4px] border-[#075a98] bg-[#7bc4e4] rotate-[12deg]" />
          <div className="relative z-10 text-[#0f6aa7]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {iconKey === "bot" && (
        <>
          <div className="absolute h-15 w-16 rounded-2xl border-[4px] border-[#075a98] bg-[#e6fbff]" />
          <div className="absolute top-7 flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f6aa7]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#0f6aa7]" />
          </div>
          <div className="relative z-10 mt-12 text-[#0f6aa7]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {iconKey === "book" && (
        <>
          <div className="absolute h-14 w-16 rounded-xl border-[4px] border-[#075a98] bg-[#fff3b0]" />
          <div className="absolute h-12 w-[3px] bg-[#075a98]/60" />
          <div className="relative z-10 text-[#b8322a]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {iconKey === "pen" && (
        <>
          <div className="absolute h-15 w-14 rounded-xl border-[4px] border-[#075a98] bg-white" />
          <div className="absolute right-5 top-5 h-14 w-3 rounded-full bg-[#b8322a] rotate-45" />
          <div className="relative z-10 text-[#0f6aa7]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {iconKey === "brain" && (
        <>
          <div className="absolute h-14 w-16 rounded-2xl border-[4px] border-[#075a98] bg-[#ffd7df]" />
          <div className="relative z-10 text-[#b8322a]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {iconKey === "compass" && (
        <>
          <div className="absolute h-16 w-16 rounded-full border-[5px] border-[#075a98] bg-[#fff8cf]" />
          <div className="absolute h-14 w-[4px] rounded-full bg-[#b8322a] rotate-45" />
          <div className="relative z-10 text-[#0f6aa7]">{getStationIcon(iconKey)}</div>
        </>
      )}

      {!["music", "bot", "book", "pen", "brain", "compass"].includes(
        iconKey
      ) && <div className="relative z-10 text-[#0f6aa7]">{getStationIcon(iconKey)}</div>}
    </div>
  );
}

function JourneyPathLayer() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox="0 0 1400 720"
      preserveAspectRatio="none"
    >
      <path
        d="M120 260C220 220 280 285 360 312C450 342 520 285 605 314C690 343 755 288 845 312C930 334 998 290 1090 316C1168 338 1228 308 1310 270"
        fill="none"
        stroke="rgba(255,255,255,0.32)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 12"
      />

      <path
        d="M80 470C170 432 255 475 340 455C420 436 495 388 585 412C670 435 740 482 830 458C915 435 984 382 1078 396C1160 408 1230 470 1320 448"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="8 12"
      />

      <path
        d="M128 265C225 225 280 290 360 315C448 344 520 288 605 316C690 343 755 289 844 314C930 338 999 292 1090 318C1167 340 1228 311 1305 274"
        fill="none"
        stroke="rgba(19,83,132,0.20)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M88 474C170 438 255 478 342 458C420 440 495 392 585 415C670 438 740 485 830 461C915 438 985 385 1080 399C1160 411 1228 473 1317 451"
        fill="none"
        stroke="rgba(19,83,132,0.17)"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MapSoftOverlay() {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/8 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#16548b]/12 to-transparent" />
      <div className="pointer-events-none absolute left-[8%] top-[18%] h-24 w-40 rounded-full bg-white/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[24%] h-28 w-44 rounded-full bg-white/7 blur-3xl" />
    </>
  );
}