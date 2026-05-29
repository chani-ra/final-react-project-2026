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
    <aside className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-white/10 flex gap-3">
        <button
          type="button"
          onClick={onNewConversation}
          className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black py-3 rounded-xl transition-all"
        >
          שיחה חדשה ✨
        </button>

        <button
          type="button"
          onClick={onCloseSidebar}
          className="bg-white/10 hover:bg-white/20 text-white px-4 rounded-xl font-black transition-all"
          title="סגור תפריט"
        >
          ✕
        </button>
      </div>

      <div className="p-4 border-b border-white/10">
        <h3 className="font-black text-white">היסטוריית שיחות</h3>

        <p className="text-xs text-gray-400 mt-1">
          בחרי שיחה קודמת כדי להמשיך לתרגל.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loadingConversations ? (
          <div className="p-6 text-center text-gray-400 font-bold">
            טוען שיחות...
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            עדיין אין שיחות שמורות.
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`group border-b border-white/5 p-4 transition-all ${
                activeConversationId === conversation._id
                  ? "bg-yellow-400/10"
                  : "hover:bg-white/5"
              }`}
            >
              <button
                type="button"
                onClick={() => onOpenConversation(conversation._id)}
                className="w-full text-right"
              >
                <div className="flex justify-between gap-3">
                  <h4 className="font-black text-white line-clamp-1">
                    {conversation.title || "שיחה עם בולט"}
                  </h4>

                  {loadingConversationId === conversation._id && (
                    <span className="text-xs text-yellow-400">טוען...</span>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                  {conversation.lastMessage?.text || "שיחה ריקה"}
                </p>

                <div className="text-[11px] text-gray-500 mt-2">
                  {formatDate(conversation.lastMessageAt)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onDeleteConversation(conversation._id)}
                className="mt-3 text-xs text-red-300 hover:text-red-200 opacity-0 group-hover:opacity-100 transition-all"
              >
                מחיקת שיחה
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}