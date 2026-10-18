import React from "react";

export function MessageFormPanel({
  form,
  recipientCount,
  singleUserOptions,
  sending,
  updateField,
  openSendConfirmModal,
}) {
  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl md:p-6"
      style={{
        boxShadow:
          "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

      <div className="relative z-10 space-y-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">שליחת הודעה חדשה</h2>
            <p className="mt-1 text-sm font-semibold text-white/55">
              מספר נמענים לפי הבחירה הנוכחית: {recipientCount}
            </p>
          </div>

          <span className="w-fit rounded-full border border-yellow-300/35 bg-yellow-300/15 px-4 py-2 text-xs font-black text-yellow-100">
            {getPriorityLabel(form.priority)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="נמענים">
            <select
              value={form.targetType}
              onChange={(event) => {
                updateField("targetType", event.target.value);
                updateField("targetUser", "");
              }}
              className="admin-input"
            >
              <option value="all">כל המשתמשים</option>
              <option value="students">תלמידים בלבד</option>
              <option value="teachers">מורים בלבד</option>
              <option value="admins">מנהלים בלבד</option>
              <option value="single">משתמש ספציפי</option>
            </select>
          </Field>

          <Field label="עדיפות">
            <select
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
              className="admin-input"
            >
              <option value="low">נמוכה</option>
              <option value="normal">רגילה</option>
              <option value="high">גבוהה</option>
            </select>
          </Field>
        </div>

        {form.targetType === "single" && (
          <Field label="בחירת משתמש">
            <select
              value={form.targetUser}
              onChange={(event) => updateField("targetUser", event.target.value)}
              className="admin-input"
            >
              <option value="">בחרי משתמש...</option>

              {singleUserOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="כותרת ההודעה">
          <input
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="לדוגמה: עדכון חשוב במערכת"
            className="admin-input"
          />
        </Field>

        <Field label="תוכן ההודעה">
          <textarea
            rows={6}
            value={form.body}
            onChange={(event) => updateField("body", event.target.value)}
            placeholder="כתבי כאן את הודעת המערכת..."
            className="admin-input resize-none leading-7"
          />
        </Field>

        <button
          type="button"
          onClick={openSendConfirmModal}
          disabled={sending}
          className="w-full rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-7 py-3.5 text-base font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            boxShadow: sending ? "none" : "0 6px 0 rgba(89,15,20,0.42)",
          }}
        >
          {sending ? "שולח הודעה..." : "שליחת הודעה"}
        </button>
      </div>

      <style>
        {`
          .admin-input {
            width: 100%;
            border-radius: 1rem;
            border: 2px solid rgba(255, 255, 255, 0.16);
            background: rgba(2, 6, 23, 0.62);
            padding: 0.8rem 1rem;
            color: white;
            outline: none;
            font-weight: 700;
            transition: 0.2s ease;
          }

          .admin-input::placeholder {
            color: rgba(255, 255, 255, 0.35);
          }

          .admin-input:focus {
            border-color: rgba(253, 224, 71, 0.72);
            background: rgba(255, 255, 255, 0.12);
          }

          .admin-input option {
            background: #020617;
            color: white;
          }
        `}
      </style>
    </section>
  );
}

export function RecipientsSummary({ counts, recipientCount }) {
  return (
    <aside
      className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl"
      style={{
        boxShadow:
          "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

      <div className="relative z-10">
        <h2 className="text-xl font-black text-white">תקציר נמענים</h2>

        <div className="mt-4 space-y-3">
          <SummaryLine label="כל המשתמשים" value={counts.all} tone="blue" />
          <SummaryLine label="תלמידים" value={counts.students} tone="yellow" />
          <SummaryLine label="מורים" value={counts.teachers} tone="red" />
          <SummaryLine label="מנהלים" value={counts.admins} tone="green" />
        </div>

        <div className="mt-5 rounded-[1.4rem] border-2 border-yellow-300/35 bg-yellow-300/15 p-4 text-center text-yellow-100">
          <div className="text-xs font-black opacity-75">נבחרו לשליחה</div>
          <div className="mt-1 text-4xl font-black">{recipientCount}</div>
        </div>
      </div>
    </aside>
  );
}

export function MessagesHistory({ sentMessages }) {
  return (
    <section
      className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-5 text-white backdrop-blur-xl md:p-6"
      style={{
        boxShadow:
          "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

      <div className="relative z-10">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">
              הודעות שנשלחו לאחרונה
            </h2>

            <p className="mt-1 text-sm font-semibold text-white/55">
              מוצגות עד 10 ההודעות האחרונות שנשלחו מהמערכת.
            </p>
          </div>
        </div>

        {sentMessages.length === 0 ? (
          <div className="rounded-[1.6rem] border-2 border-dashed border-white/18 bg-white/8 p-8 text-center">
            <h3 className="text-xl font-black text-white">
              עדיין לא נשלחו הודעות
            </h3>

            <p className="mt-2 text-sm font-semibold text-white/55">
              לאחר שליחת הודעה, היא תופיע כאן.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[1.6rem] border-2 border-white/14 bg-slate-950/45">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-right">
                <thead>
                  <tr className="border-b border-white/12 bg-white/10 text-xs font-black text-white/62">
                    <th className="px-4 py-4">כותרת</th>
                    <th className="px-4 py-4">תוכן</th>
                    <th className="px-4 py-4">יעד</th>
                    <th className="px-4 py-4">עדיפות</th>
                    <th className="px-4 py-4">נמענים</th>
                    <th className="px-4 py-4">תאריך</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/8 text-sm">
                  {sentMessages.slice(0, 10).map((item) => (
                    <tr key={item._id} className="transition hover:bg-white/8">
                      <td className="px-4 py-4 font-black text-white">
                        {item.title || "ללא כותרת"}
                      </td>

                      <td className="max-w-[260px] px-4 py-4 text-white/62">
                        <span className="line-clamp-2">
                          {item.body || "ללא תוכן"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-white/62">
                        {getTargetLabel(item.targetType)}
                      </td>

                      <td className="px-4 py-4">
                        <PriorityBadge priority={item.priority} />
                      </td>

                      <td className="px-4 py-4 text-white/62">
                        {item.recipients?.length || item.count || 0}
                      </td>

                      <td className="px-4 py-4 text-white/55">
                        {formatDate(item.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-white/65">
        {label}
      </span>

      {children}
    </label>
  );
}

function SummaryLine({ label, value, tone }) {
  const tones = {
    yellow: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    red: "border-red-300/35 bg-red-500/15 text-red-100",
    green: "border-emerald-300/35 bg-emerald-300/12 text-emerald-100",
    blue: "border-sky-300/35 bg-sky-300/12 text-sky-100",
  };

  return (
    <div
      className={`flex items-center justify-between rounded-[1.2rem] border px-4 py-3 ${
        tones[tone] || tones.yellow
      }`}
    >
      <span className="text-sm font-black opacity-75">{label}</span>
      <span className="text-2xl font-black">{value}</span>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const config = {
    low: {
      label: "נמוכה",
      className: "border-sky-300/35 bg-sky-300/12 text-sky-100",
    },
    normal: {
      label: "רגילה",
      className: "border-yellow-300/35 bg-yellow-300/15 text-yellow-100",
    },
    high: {
      label: "גבוהה",
      className: "border-red-300/35 bg-red-500/15 text-red-100",
    },
  };

  const item = config[priority] || config.normal;

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${item.className}`}
    >
      {item.label}
    </span>
  );
}

export function LoadingState() {
  return (
    <div className="flex min-h-[360px] items-center justify-center" dir="rtl">
      <div className="text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black">טוען הודעות...</p>
      </div>
    </div>
  );
}

function getTargetLabel(targetType) {
  const labels = {
    all: "כל המשתמשים",
    students: "תלמידים",
    teachers: "מורים",
    admins: "מנהלים",
    single: "משתמש בודד",
  };

  return labels[targetType] || targetType || "לא ידוע";
}

function getPriorityLabel(priority) {
  const labels = {
    low: "עדיפות נמוכה",
    normal: "עדיפות רגילה",
    high: "עדיפות גבוהה",
  };

  return labels[priority] || "עדיפות רגילה";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
