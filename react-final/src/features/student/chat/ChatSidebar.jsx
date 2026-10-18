import React from "react";

export default function ChatSidebar({
  isOpen,
  conversations,
  activeConversationId,
  loadingConversations,
  loadingConversationId,
  onNewConversation,
  onOpenConversation,
  onDeleteConversation,
  onCloseSidebar,
}) {
  if (!isOpen) return null;

  return (
    <aside
      className="flex h-[260px] min-h-0 flex-col overflow-hidden rounded-[1.9rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl xl:h-full"
      style={{
        boxShadow:
          "0 22px 70px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="flex gap-3 border-b border-white/12 p-4">
        <button
          type="button"
          onClick={onNewConversation}
          className="flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-3 text-sm font-black text-white transition hover:brightness-110"
          style={{
            boxShadow: "0 5px 0 rgba(89,15,20,0.42)",
          }}
        >
          שיחה חדשה
        </button>

        <button
          type="button"
          onClick={onCloseSidebar}
          className="rounded-full border-2 border-white/18 bg-white/10 px-4 text-sm font-black text-white transition hover:bg-white/16"
          title="סגור תפריט"
        >
          סגור
        </button>
      </div>

      <div className="border-b border-white/12 p-4">
        <h3 className="text-lg font-black text-white">היסטוריית שיחות</h3>

        <p className="mt-1 text-xs font-semibold leading-5 text-white/55">
          בחרי שיחה קודמת כדי להמשיך מהמקום שבו עצרת.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="p-6 text-center text-sm font-bold text-white/55">
            טוען שיחות...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-sm font-semibold leading-7 text-white/50">
            עדיין אין שיחות שמורות.
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = activeConversationId === conversation._id;

            return (
              <div
                key={conversation._id}
                className={`group border-b border-white/8 p-4 transition ${
                  isActive ? "bg-yellow-300/12" : "hover:bg-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onOpenConversation(conversation._id)}
                  className="w-full text-right"
                >
                  <div className="flex justify-between gap-3">
                    <h4 className="line-clamp-1 text-sm font-black text-white">
                      {conversation.title || "שיחה עם בולט"}
                    </h4>

                    {loadingConversationId === conversation._id && (
                      <span className="text-xs font-black text-yellow-100">
                        טוען...
                      </span>
                    )}
                  </div>

                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-white/52">
                    {getLastMessageText(conversation)}
                  </p>

                  <div className="mt-2 text-[11px] font-bold text-white/38">
                    {formatDate(conversation.lastMessageAt)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteConversation(conversation._id)}
                  className="mt-3 rounded-full border border-red-300/25 bg-red-500/12 px-3 py-1.5 text-xs font-black text-red-100 opacity-0 transition hover:bg-red-500/20 group-hover:opacity-100"
                >
                  מחיקת שיחה
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

function getLastMessageText(conversation) {
  if (typeof conversation.lastMessage === "string") {
    return conversation.lastMessage;
  }

  if (conversation.lastMessage?.text) {
    return conversation.lastMessage.text;
  }

  return "שיחה ריקה";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}