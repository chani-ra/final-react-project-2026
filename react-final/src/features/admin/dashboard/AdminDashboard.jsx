import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "../../../services/adminService";

const emptyStats = {
  users: { total: 0, students: 0, teachers: 0, admins: 0 },
  courses: { total: 0, public: 0, ai: 0 },
  tasks: { total: 0, pending: 0, review: 0, completed: 0 },
  messages: { total: 0, highPriority: 0 },
  songs: { total: 0, public: 0, weekly: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminDashboardStats();
      setStats(data || emptyStats);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    // First load starts in the initial loading state. Ignore late responses after unmount.
    getAdminDashboardStats()
      .then((data) => { if (active) setStats(data || emptyStats); })
      .catch((err) => { if (active) setError(err.toString()); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) {
    return <LoadingState />;
  }

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
        <div className="pointer-events-none absolute -left-24 top-8 h-52 w-52 rounded-full bg-red-500/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-8 h-52 w-52 rounded-full bg-yellow-300/12 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              admin dashboard
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              מרכז ניהול
            </h1>

            <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-white/64">
              מבט קצר על נתוני המערכת בזמן אמת.
            </p>
          </div>

          <button
            type="button"
            onClick={loadStats}
            className="w-fit rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            רענון נתונים
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-[1.5rem] border-2 border-red-300/35 bg-red-500/15 px-5 py-3 text-sm font-black text-red-100">
          {error}
        </div>
      )}

      <section
        className="overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10 divide-y divide-white/10 md:grid-cols-4 md:divide-y-0">
          <TopNumber
            label="משתמשים"
            value={stats.users.total}
            tone="yellow"
          />
          <TopNumber label="קורסים" value={stats.courses.total} tone="red" />
          <TopNumber label="משימות" value={stats.tasks.total} tone="green" />
          <TopNumber label="הודעות" value={stats.messages.total} tone="blue" />
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="border-b border-white/10 bg-white/8 px-5 py-4">
          <h2 className="text-2xl font-black text-white">פירוט מערכת</h2>
        </div>

        <div className="divide-y divide-white/10">
          <DataRow
            title="משתמשים"
            main={stats.users.total}
            items={[
              ["תלמידים", stats.users.students],
              ["מורים", stats.users.teachers],
              ["מנהלים", stats.users.admins],
            ]}
            tone="yellow"
          />

          <DataRow
            title="קורסים"
            main={stats.courses.total}
            items={[
              ["ציבוריים", stats.courses.public],
              ["נוצרו עם AI", stats.courses.ai],
            ]}
            tone="red"
          />

          <DataRow
            title="משימות"
            main={stats.tasks.total}
            items={[
              ["לביצוע", stats.tasks.pending],
              ["בבדיקה", stats.tasks.review],
              ["הושלמו", stats.tasks.completed],
            ]}
            tone="green"
          />

          <DataRow
            title="הודעות"
            main={stats.messages.total}
            items={[["עדיפות גבוהה", stats.messages.highPriority]]}
            tone="blue"
          />

          <DataRow
            title="שירים"
            main={stats.songs.total}
            items={[
              ["ציבוריים", stats.songs.public],
              ["שיר שבועי", stats.songs.weekly],
            ]}
            tone="yellow"
          />
        </div>
      </section>

      <section
        className="overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 text-white backdrop-blur-xl"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="border-b border-white/10 bg-white/8 px-5 py-4">
          <h2 className="text-2xl font-black text-white">סטטוס מהיר</h2>
        </div>

        <div className="divide-y divide-white/10">
          <StatusLine
            label="משימות שהושלמו"
            value={stats.tasks.completed}
            total={stats.tasks.total}
            tone="green"
          />

          <StatusLine
            label="קורסים ציבוריים"
            value={stats.courses.public}
            total={stats.courses.total}
            tone="red"
          />

          <StatusLine
            label="שירים ציבוריים"
            value={stats.songs.public}
            total={stats.songs.total}
            tone="yellow"
          />
        </div>
      </section>
    </div>
  );
}

function TopNumber({ label, value, tone }) {
  const tones = {
    yellow: "text-yellow-100",
    red: "text-red-100",
    green: "text-emerald-100",
    blue: "text-sky-100",
  };

  return (
    <div className="p-5 text-center">
      <div className={`text-4xl font-black ${tones[tone] || tones.yellow}`}>
        {formatNumber(value)}
      </div>

      <div className="mt-1 text-sm font-black text-white/58">{label}</div>
    </div>
  );
}

function DataRow({ title, main, items, tone }) {
  const tones = {
    yellow: "bg-yellow-300 text-slate-950",
    red: "bg-red-500 text-white",
    green: "bg-emerald-400 text-slate-950",
    blue: "bg-sky-400 text-slate-950",
  };

  return (
    <div className="grid gap-4 px-5 py-4 md:grid-cols-[170px_1fr] md:items-center">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full text-lg font-black ${
            tones[tone] || tones.yellow
          }`}
        >
          {formatNumber(main)}
        </span>

        <h3 className="text-lg font-black text-white">{title}</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map(([label, value]) => (
          <span
            key={label}
            className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-white/62"
          >
            {label}: {formatNumber(value)}
          </span>
        ))}
      </div>
    </div>
  );
}

function StatusLine({ label, value, total, tone }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;

  const colors = {
    yellow: "bg-yellow-300",
    red: "bg-red-400",
    green: "bg-emerald-300",
    blue: "bg-sky-300",
  };

  return (
    <div className="px-5 py-4">
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-black">
        <span className="text-white/70">{label}</span>
        <span className="text-white/55">
          {formatNumber(value)} מתוך {formatNumber(total)} · {percent}%
        </span>
      </div>

      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${colors[tone] || colors.yellow}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[420px] items-center justify-center" dir="rtl">
      <div className="text-center text-white">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black">טוען נתוני מנהל...</p>
      </div>
    </div>
  );
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("he-IL");
}