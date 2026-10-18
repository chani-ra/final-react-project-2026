import { useSelector } from "react-redux";
import SmartGuideBackButton from "../../components/ui/SmartGuideBackButton";
import ChatSidebar from "./chat/ChatSidebar";
import useChat from "./chat/useChat.js";
import { getLevelLabel } from "./chat/chatModel.js";
import { ChatBubble, TypingBubble, QuickActionButton, SmallSpinner } from "./chat/ChatComponents.jsx";

export default function Chat() {
  const { user } = useSelector((state) => state.auth);
  const { conversations, activeConversationId, messages, input, setInput, isSidebarOpen, setIsSidebarOpen, loadingConversations, loadingConversationId, isTyping, messagesEndRef, userLevel, activeConversation, handleOpenConversation, handleNewConversation, handleSend, handleDeleteConversation, handleQuickAction } = useChat(user);

  return (
    <div dir="rtl" className="space-y-5">
      <SmartGuideBackButton />

      <section
        className="relative overflow-hidden rounded-[2.2rem] border-2 border-white/25 bg-slate-950/65 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex rounded-full border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm font-black text-red-100">
                בולט AI
              </div>

              <h1
                className="text-3xl font-black leading-tight text-white md:text-4xl"
                style={{
                  textShadow:
                    "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
                }}
              >
                מאמן אישי לתרגול אנגלית
              </h1>

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
                אפשר לשאול, לתרגל משפטים, לבקש תיקון, ללמוד מילים ולקבל עזרה
                שמתאימה לרמה שלך.
              </p>
            </div>

            <div className="rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              רמה: {getLevelLabel(userLevel)}
            </div>
          </div>

          <div
            className={`grid gap-4 xl:h-[560px] ${
              isSidebarOpen
                ? "grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)]"
                : "grid-cols-1"
            }`}
          >
            <ChatSidebar
              isOpen={isSidebarOpen}
              conversations={conversations}
              activeConversationId={activeConversationId}
              loadingConversations={loadingConversations}
              loadingConversationId={loadingConversationId}
              onNewConversation={handleNewConversation}
              onOpenConversation={handleOpenConversation}
              onDeleteConversation={handleDeleteConversation}
              onCloseSidebar={() => setIsSidebarOpen(false)}
            />

            <section
              className="flex h-[560px] min-h-0 flex-col overflow-hidden rounded-[1.9rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
              style={{
                boxShadow:
                  "0 22px 70px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
              }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/12 bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  {!isSidebarOpen && (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(true)}
                      className="rounded-full border-2 border-white/20 bg-white/10 px-4 py-2 text-sm font-black text-white transition hover:bg-white/16"
                    >
                      תפריט
                    </button>
                  )}

                  <div>
                    <h2 className="text-xl font-black text-white md:text-2xl">
                      {activeConversation?.title || "שיחה חדשה עם בולט"}
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-xs font-bold text-emerald-200/85">
                      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.55)]" />
                      מחובר ושומר היסטוריית שיחות
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-white/12 bg-slate-950/35 p-3">
                <p className="mb-2 text-xs font-bold text-white/55">
                  התחלה מהירה:
                </p>

                <div className="flex flex-wrap gap-2">
                  <QuickActionButton
                    label="תרגול שיחה"
                    text="I want to practice a simple English conversation. Please ask me one question at a time."
                    onClick={handleQuickAction}
                  />

                  <QuickActionButton
                    label="תקן לי משפט"
                    text="Please correct this sentence and explain the mistake in Hebrew: "
                    onClick={handleQuickAction}
                  />

                  <QuickActionButton
                    label="לימוד מילים"
                    text="Teach me 5 useful English words for my level and ask me to use one in a sentence."
                    onClick={handleQuickAction}
                  />

                  <QuickActionButton
                    label="שאל אותי שאלה"
                    text="Ask me one easy English question and wait for my answer."
                    onClick={handleQuickAction}
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-4 scroll-smooth">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}

                {isTyping && <TypingBubble />}

                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/12 bg-white/10 p-4">
                <form onSubmit={handleSend} className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="כתבי כאן..."
                    className="flex-1 rounded-full border-2 border-white/18 bg-white/10 px-5 py-3.5 text-base font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15"
                    dir="auto"
                    autoComplete="off"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-7 py-3.5 text-base font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      boxShadow:
                        !input.trim() || isTyping
                          ? "none"
                          : "0 6px 0 rgba(89,15,20,0.42)",
                    }}
                  >
                    {isTyping ? (
                      <span className="inline-flex items-center gap-2">
                        <SmallSpinner />
                        שולח
                      </span>
                    ) : (
                      "שלח"
                    )}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
