export function ChatBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
      <div
        className={`relative max-w-[88%] rounded-[1.45rem] border-2 p-4 md:max-w-[68%] ${
          isUser
            ? "rounded-tr-sm border-red-300/45 bg-gradient-to-b from-red-400 to-red-700 text-white"
            : "rounded-tl-sm border-white/18 bg-white/10 text-white"
        }`}
      >
        <p
          className="whitespace-pre-wrap text-sm font-semibold leading-7 md:text-base"
          dir="auto"
        >
          {message.text}
        </p>

        <span
          className={`mt-2 block text-[11px] font-black ${
            isUser ? "text-white/62" : "text-white/42"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2 rounded-[1.45rem] rounded-tl-sm border-2 border-white/18 bg-white/10 p-5 text-white">
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 animate-bounce rounded-full bg-yellow-300"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

export function QuickActionButton({ label, text, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="rounded-full border-2 border-red-300/28 bg-red-500/12 px-4 py-2 text-sm font-black text-red-100 transition hover:border-yellow-300/45 hover:bg-yellow-300/15 hover:text-yellow-100"
    >
      {label}
    </button>
  );
}

export function SmallSpinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-yellow-300" />
  );
}
