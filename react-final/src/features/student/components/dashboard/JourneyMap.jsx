import React from "react";
import { getStationIcon } from "./dashboardIcons";

export default function JourneyMap({ stations, onStationClick }) {
  return (
    <div className="relative min-h-[590px] px-5 pb-8 pt-4 md:px-8">
      <MondlyLikeInnerBackground />
      <JourneyPath />

      <div className="relative z-10 grid min-h-[500px] grid-cols-2 gap-y-11 md:grid-cols-3 xl:grid-cols-6">
        {stations.map((station, index) => (
          <JourneyBalloon
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

function JourneyBalloon({ station, index, onClick }) {
  const lift =
    index === 0
      ? "xl:translate-y-20"
      : index === 1
      ? "xl:translate-y-4"
      : index === 2
      ? "xl:translate-y-16"
      : index === 3
      ? "xl:-translate-y-2"
      : index === 4
      ? "xl:translate-y-12"
      : "xl:-translate-y-8";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-3 ${lift}`}
    >
      {station.glow && (
        <>
          <div className="absolute top-6 h-48 w-48 rounded-full bg-white/35 blur-2xl" />
          <div className="absolute top-12 h-32 w-32 rounded-full bg-[#ffd439]/18 blur-xl" />
        </>
      )}

      <div className="relative">
        <div className="absolute -inset-5 rounded-full bg-white/12 opacity-0 blur-xl transition group-hover:opacity-100" />

        <div
          className={`relative flex h-[138px] w-[112px] items-center justify-center rounded-[52%_52%_47%_47%] border-[6px] border-[#075a98] bg-gradient-to-b from-[#ff7a6c] via-[#ef3d37] to-[#a92524] shadow-[0_18px_34px_rgba(3,38,66,0.36),inset_0_8px_0_rgba(255,255,255,0.27),inset_0_-10px_18px_rgba(83,10,18,0.18),0_0_28px_rgba(255,255,255,0.18)] ${
            station.glow ? "ring-4 ring-white/45" : ""
          }`}
        >
          <div className="absolute inset-y-4 left-5 w-[2px] rounded-full bg-[#072f57]/42" />
          <div className="absolute inset-y-4 right-5 w-[2px] rounded-full bg-[#072f57]/42" />
          <div className="absolute top-4 h-6 w-12 rounded-full bg-white/18 blur-[2px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-1 text-white/95">{getStationIcon(station.iconKey)}</div>
            <div className="text-3xl font-black text-white drop-shadow">
              {station.number}
            </div>
          </div>
        </div>

        <div className="mx-auto -mt-2 h-8 w-12 rounded-b-xl border-[5px] border-[#075a98] bg-[#b8322a] shadow-[0_8px_13px_rgba(3,38,66,0.25)]" />

        <div className="absolute -left-2 top-7 h-3.5 w-3.5 rounded-full bg-[#ffd439] shadow-[0_0_18px_rgba(255,212,57,0.94)]" />
      </div>

      <div className="mt-3 max-w-[165px]">
        <div className="text-[17px] font-black text-[#062f52] drop-shadow-[0_1px_0_rgba(255,255,255,0.45)]">
          {station.title}
        </div>

        <div className="mt-1 text-xs font-bold leading-tight text-[#08324e]/75">
          {station.short}
        </div>
      </div>
    </button>
  );
}

function JourneyPath() {
  return (
    <svg
      className="absolute left-1/2 top-[49%] z-0 h-[280px] w-[96%] -translate-x-1/2 -translate-y-1/2 opacity-95"
      viewBox="0 0 1200 280"
      preserveAspectRatio="none"
    >
      <path
        d="M55 160 C155 62 265 225 375 138 C500 30 585 190 700 120 C790 65 885 150 965 105 C1050 58 1110 108 1160 65"
        fill="none"
        stroke="rgba(8,72,116,0.26)"
        strokeWidth="20"
        strokeLinecap="round"
      />

      <path
        d="M55 160 C155 62 265 225 375 138 C500 30 585 190 700 120 C790 65 885 150 965 105 C1050 58 1110 108 1160 65"
        fill="none"
        stroke="rgba(255,255,255,0.88)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M55 160 C155 62 265 225 375 138 C500 30 585 190 700 120 C790 65 885 150 965 105 C1050 58 1110 108 1160 65"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="9 14"
      />
    </svg>
  );
}

function MondlyLikeInnerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.4rem]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2db8f6]/42 via-[#80d8ec]/24 to-[#0d6fb6]/20" />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.52]"
        viewBox="0 0 1400 720"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="softLine" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.92" />
            <stop offset="100%" stopColor="white" stopOpacity="0.36" />
          </linearGradient>
        </defs>

        <g
          fill="none"
          stroke="url(#softLine)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        >
          <path d="M40 250 H100 L140 210 H205 L255 165 L330 245 H430" />
          <path d="M880 230 H950 L995 190 H1060 L1120 140 L1210 230 H1370" />

          <path d="M65 610 C150 545 255 570 345 500 C445 425 555 475 655 405 C780 318 900 385 1010 295 C1135 190 1240 240 1340 155" />
          <path d="M80 650 C180 590 280 610 390 535 C520 445 640 505 760 430 C870 360 965 390 1070 320 C1180 250 1265 265 1365 215" />

          <path d="M120 535 V310 L155 280 L195 310 V535" />
          <path d="M155 280 V220" />
          <path d="M140 220 H170" />

          <path d="M335 545 V315" />
          <path d="M300 345 L335 260 L370 345" />
          <path d="M298 400 H372" />
          <path d="M288 455 H382" />

          <path d="M545 540 H675" />
          <path d="M565 540 V405 H655 V540" />
          <path d="M565 405 C580 350 640 350 655 405" />

          <path d="M820 535 C845 455 895 455 920 535" />
          <path d="M805 535 H935" />
          <path d="M830 490 H910" />

          <path d="M1050 545 L1100 335 L1150 545" />
          <path d="M1072 470 H1128" />
          <path d="M1086 405 H1114" />

          <circle cx="720" cy="155" r="34" />
          <path d="M720 190 V245" />

          <path d="M980 132 C1010 102 1065 108 1095 145" />
          <path d="M1040 108 L1075 78" />

          <path d="M230 135 C250 120 275 120 295 135" />
          <path d="M1030 600 C1065 570 1125 570 1160 600" />
          <path d="M50 165 C85 132 145 132 180 165" />
        </g>
      </svg>

      <div className="absolute left-[8%] top-24 h-44 w-[28rem] rounded-full bg-white/22 blur-3xl" />
      <div className="absolute right-[12%] top-28 h-40 w-[25rem] rounded-full bg-white/18 blur-3xl" />
      <div className="absolute bottom-[-90px] left-[-5%] h-60 w-[58%] rounded-t-full bg-white/11 blur-2xl" />
      <div className="absolute bottom-[-95px] right-[-5%] h-64 w-[58%] rounded-t-full bg-white/12 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-[23%] bg-[#14548f]/16" />
    </div>
  );
}