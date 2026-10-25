import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboardStats } from "../../../services/adminService";
import "../../shared/teacherAdminPolish.css";

const emptyStats = {
  users: { total: 0, students: 0, teachers: 0, admins: 0 },
  courses: { total: 0, public: 0, ai: 0 },
  tasks: { total: 0, pending: 0, review: 0, completed: 0 },
  messages: { total: 0, highPriority: 0 },
  songs: { total: 0, public: 0, weekly: 0 },
};

const formatNumber = (value) => Number(value || 0).toLocaleString("he-IL");

function ProgressRow({ title, amount, total }) {
  const percent = total > 0 ? Math.min(100, Math.max(0, Math.round((amount / total) * 100))) : 0;
  return (
    <div className="ew-admin-progress-row">
      <div className="ew-admin-progress-info"><span>{title}</span><strong>{formatNumber(amount)} מתוך {formatNumber(total)}</strong></div>
      <div className="ew-admin-progress-track" role="progressbar" aria-label={title} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, details, href, index }) {
  const content = (
    <>
      <span className="ew-admin-summary-label">{title}</span>
      <strong>{formatNumber(value)}</strong>
      <span className="ew-admin-summary-details">{details}</span>
      {href && <span className="ew-admin-summary-link">לניהול <span aria-hidden="true">←</span></span>}
    </>
  );
  const className = `ew-admin-summary ew-admin-summary-${index}`;
  return href ? <Link to={href} className={className}>{content}</Link> : <div className={className}>{content}</div>;
}

function BreakdownCard({ title, total, details, href }) {
  return (
    <section className="ew-admin-breakdown">
      <header><h3>{title}</h3><strong>{formatNumber(total)}</strong></header>
      <div className="ew-admin-breakdown-lines">
        {details.map(([label, value]) => (
          <div key={label}><span>{label}</span><strong>{formatNumber(value)}</strong></div>
        ))}
      </div>
      {href && <Link to={href} className="ew-admin-breakdown-link">מעבר לניהול <span aria-hidden="true">←</span></Link>}
    </section>
  );
}

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
    getAdminDashboardStats()
      .then((data) => { if (active) setStats(data || emptyStats); })
      .catch((err) => { if (active) setError(err.toString()); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading) return <main className="ew-dashboard-loading" dir="rtl">טוען נתוני מנהל...</main>;

  return (
    <main className="ew-management ew-admin-page" dir="rtl">
      <header className="ew-management-header">
        <div className="ew-management-title-block">
          <span className="ew-management-eyebrow">מערכת הניהול</span>
          <h1>מרכז הבקרה</h1>
          <p>תמונת מצב של המערכת, נתונים חשובים וגישה מהירה למסכי הניהול.</p>
        </div>
        <button className="ew-admin-refresh" type="button" onClick={loadStats}>רענון נתונים</button>
      </header>

      {error && <div className="ew-admin-error" role="alert">{error}</div>}

      <section className="ew-admin-summary-grid" aria-label="נתונים מרכזיים">
        <SummaryCard title="משתמשים" value={stats.users.total} details={`${formatNumber(stats.users.students)} תלמידים`} href="/admin/users" index="users" />
        <SummaryCard title="קורסים" value={stats.courses.total} details={`${formatNumber(stats.courses.public)} ציבוריים`} href="/admin/content" index="courses" />
        <SummaryCard title="משימות" value={stats.tasks.total} details={`${formatNumber(stats.tasks.completed)} הושלמו`} index="tasks" />
        <SummaryCard title="הודעות" value={stats.messages.total} details={`${formatNumber(stats.messages.highPriority)} בעדיפות גבוהה`} href="/admin/messages" index="messages" />
      </section>

      <section className="ew-admin-main-grid">
        <div className="ew-admin-panel">
          <div className="ew-admin-panel-head"><h2>התפלגות הנתונים</h2><p>מבט ממוקד לפי תחום</p></div>
          <div className="ew-admin-breakdown-grid">
            <BreakdownCard title="משתמשים" total={stats.users.total} href="/admin/users" details={[
              ["תלמידים", stats.users.students], ["מורים", stats.users.teachers], ["מנהלים", stats.users.admins],
            ]} />
            <BreakdownCard title="קורסים" total={stats.courses.total} href="/admin/content" details={[
              ["ציבוריים", stats.courses.public], ["נוצרו עם AI", stats.courses.ai],
            ]} />
            <BreakdownCard title="משימות" total={stats.tasks.total} details={[
              ["לביצוע", stats.tasks.pending], ["בבדיקה", stats.tasks.review], ["הושלמו", stats.tasks.completed],
            ]} />
            <BreakdownCard title="שירים" total={stats.songs.total} href="/admin/content" details={[
              ["ציבוריים", stats.songs.public], ["שיר שבועי", stats.songs.weekly],
            ]} />
          </div>
        </div>

        <aside className="ew-admin-side">
          <section className="ew-admin-panel">
            <div className="ew-admin-panel-head"><h2>מדדי התקדמות</h2><p>נתונים מרכזיים ביחס לסך הכול</p></div>
            <div className="ew-admin-progress-list">
              <ProgressRow title="משימות שהושלמו" amount={stats.tasks.completed} total={stats.tasks.total} />
              <ProgressRow title="קורסים ציבוריים" amount={stats.courses.public} total={stats.courses.total} />
              <ProgressRow title="שירים ציבוריים" amount={stats.songs.public} total={stats.songs.total} />
            </div>
          </section>
          <section className="ew-admin-panel ew-admin-quick">
            <div className="ew-admin-panel-head"><h2>גישה מהירה</h2><p>המסכים הנפוצים לניהול השוטף</p></div>
            <nav aria-label="קיצורי דרך לניהול">
              <Link to="/admin/users">ניהול משתמשים <span>←</span></Link>
              <Link to="/admin/content">ניהול תכנים <span>←</span></Link>
              <Link to="/admin/messages">הודעות <span>←</span></Link>
              <Link to="/admin/reviews">המלצות <span>←</span></Link>
            </nav>
          </section>
        </aside>
      </section>
    </main>
  );
}
