import React from "react";

function inlineFormatting(text) {
  return String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((piece, i) => {
    if (piece.startsWith("**") && piece.endsWith("**")) return <strong key={i} className="font-black">{piece.slice(2, -2)}</strong>;
    if (piece.startsWith("`") && piece.endsWith("`")) return <code key={i} className="rounded bg-white/15 px-1">{piece.slice(1, -1)}</code>;
    return piece;
  });
}

// Render model text as React text nodes: never inject model HTML into the page.
export default function LessonText({ text }) {
  return (
    <div className="space-y-2 break-words text-sm leading-8 text-white/90 sm:text-base" dir="auto">
      {String(text || "").split(/\r?\n/).map((line, index) => {
        const content = line.trim();
        if (!content) return <div key={index} className="h-2" aria-hidden="true" />;
        const heading = content.match(/^#{1,3}\s+(.+)$/);
        if (heading) return <h3 key={index} className="pt-3 text-lg font-black text-yellow-100">{inlineFormatting(heading[1])}</h3>;
        const bullet = content.match(/^[-*]\s+(.+)$/);
        if (bullet) return <p key={index} className="pr-3">• {inlineFormatting(bullet[1])}</p>;
        const numbered = content.match(/^(\d+)\.\s+(.+)$/);
        if (numbered) return <p key={index} className="pr-3">{numbered[1]}. {inlineFormatting(numbered[2])}</p>;
        return <p key={index}>{inlineFormatting(content)}</p>;
      })}
    </div>
  );
}
