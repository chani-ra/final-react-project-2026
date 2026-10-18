import React from "react";
import useAdminMessages from "./useAdminMessages.js";
import AppConfirmModal from "../../../components/AppConfirmModal";
import { MessageFormPanel, RecipientsSummary, MessagesHistory, LoadingState } from "./AdminMessagesSections.jsx";

export default function AdminMessages() {
  const {
    sentMessages, form, loading, sending,
    confirmModal, loadData, counts, singleUserOptions,
    recipientCount, updateField, openSendConfirmModal, closeConfirmModal,
    handleSendMessage,
  } = useAdminMessages();

  return (
    <div className="space-y-5" dir="rtl">
      <section
        className="relative overflow-hidden rounded-[2.1rem] border-2 border-white/25 bg-slate-950/65 p-5 text-white backdrop-blur-xl md:p-6"
        style={{
          boxShadow:
            "0 32px 95px rgba(3,31,61,0.42), inset 0 1px 0 rgba(255,255,255,0.14)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm font-black text-red-100">
              admin messages
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              הודעות מערכת
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              שליחת הודעות לכל המשתמשים, לקבוצות לפי תפקיד, או למשתמש בודד.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            className="w-fit rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            רענון הודעות
          </button>
        </div>
      </section>



      {loading ? (
        <LoadingState />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
            <MessageFormPanel
              form={form}
              recipientCount={recipientCount}
              singleUserOptions={singleUserOptions}
              sending={sending}
              updateField={updateField}
              openSendConfirmModal={openSendConfirmModal}
            />

            <RecipientsSummary counts={counts} recipientCount={recipientCount} />
          </section>

          <MessagesHistory sentMessages={sentMessages} />
        </>
      )}

      <AppConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        text={confirmModal.text}
        type="warning"
        confirmText="כן, שלח"
        cancelText="ביטול"
        isLoading={sending}
        onConfirm={handleSendMessage}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}
