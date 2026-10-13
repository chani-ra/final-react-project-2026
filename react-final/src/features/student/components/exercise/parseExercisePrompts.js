export function parseExercisePrompts(instructions) {
  const text = typeof instructions === "string" ? instructions.trim() : "";
  if (!text) return { intro: "", prompts: ["קראי את התרגיל וכתבי את התשובה שלך."] };

  const normalized = text
    .replace(/\r\n?/g, "\n")
    .replace(/\n\s*-{3,}\s*(?=\n|$)/g, "\n")
    .replace(/(^|[\s])((?:\d{1,2}|[א-ת])[.)])\s+(?=\S)/gm,
      (_, prefix, number) => "\n" + number + " ");

  const intro = [];
  const prompts = [];

  for (const rawLine of normalized.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const numbered = line.match(/^(?:\d{1,2}|[א-ת])[.)]\s+(.+)$/);

    if (numbered) {
      prompts.push(numbered[1]);
    } else if (prompts.length) {
      prompts[prompts.length - 1] += "\n" + line;
    } else {
      intro.push(line);
    }
  }

  return prompts.length
    ? { intro: intro.join("\n"), prompts }
    : { intro: "", prompts: [text] };
}
