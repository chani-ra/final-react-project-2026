import React, { useEffect, useMemo, useState } from "react";
import {
  getAllUsersForAdmin,
  getAdminSentMessages,
  sendAdminMessage,
} from "../../services/adminService";
import AppConfirmModal from "../../components/AppConfirmModal";

export default function AdminMessages() {
  const [users, setUsers] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);

  const [form, setForm] = useState({
    targetType: "all",
    targetUser: "",
    title: "",
    body: "",
    priority: "normal",
  });

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    text: "",
  });

  // טעינת משתמשים והיסטוריית הודעות
  const loadData = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const [usersData, messagesData] = await Promise.all([
        getAllUsersForAdmin(),
        getAdminSentMessages(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setSentMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const singleUserOptions = useMemo(() => {
    return users.map((user) => ({
      id: user._id || user.id,
      label: `${user.username || "ללא שם"} - ${
        user.email || "ללא מייל"
      } (${getRoleLabel(user.role)})`,
    }));
  }, [users]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getTargetCount = () => {
    if (form.targetType === "all") return users.length;

    if (form.targetType === "students") {
      return users.filter(
        (user) => user.role === "student" || user.role === "user"
      ).length;
    }

    if (form.targetType === "teachers") {
      return users.filter((user) => user.role === "teacher").length;
    }

    if (form.targetType === "admins") {
      return users.filter((user) => user.role === "admin").length;
    }

    if (form.targetType === "single") {
      return form.targetUser ? 1 : 0;
    }

    return 0;
  };

  const validateForm = () => {
    if (!form.title.trim()) return "כותרת הודעה חובה";
    if (!form.body.trim()) return "תוכן הודעה חובה";

    if (form.targetType === "single" && !form.targetUser) {
      return "בחרי משתמש לקבלת הודעה אישית";
    }

    if (getTargetCount() === 0) {
      return "לא נמצאו נמענים מתאימים";
    }

    return "";
  };

  // פתיחת חלון אישור יפה לפני שליחה
  const openSendConfirmModal = () => {
    const validationError = validateForm();

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "אישור שליחת הודעה",
      text: `האם לשלוח את ההודעה ל-${getTargetCount()} נמענים?`,
    });
  };

  const closeConfirmModal = () => {
    if (sending) return;

    setConfirmModal({
      isOpen: false,
      title: "",
      text: "",
    });
  };

  // שליחת הודעה אחרי אישור במודל
  const handleSendMessage = async () => {
    try {
      setSending(true);
      setMessage({ type: "", text: "" });

      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        targetType: form.targetType,
        targetUser: form.targetType === "single" ? form.targetUser : null,
        priority: form.priority,
        messageType: "announcement",
      };

      const response = await sendAdminMessage(payload);

      setMessage({
        type: "success",
        text: `ההודעה נשלחה בהצלחה ל-${response.count} נמענים`,
      });

      setForm({
        targetType: "all",
        targetUser: "",
        title: "",
        body: "",
        priority: "normal",
      });

      setConfirmModal({
        isOpen: false,
        title: "",
        text: "",
      });

      await loadData();
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          💬 הודעות ופידבקים
        </h1>

        <p className="text-gray-400 mt-1">
          שליחת הודעות מערכת לכל המשתמשים, לתלמידים, למורים, למנהלים או
          למשתמש בודד.
        </p>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-2xl font-bold ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-white font-bold text-xl">
          <div className="animate-pulse">טוען מערכת הודעות... 💬</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <section className="xl:col-span-2 bg-white/5 border border-white/10 p-8 rounded-3xl space-y-5">
            <h2 className="text-2xl font-black text-white">
              שליחת הודעה חדשה
            </h2>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                נמענים
              </label>

              <select
                value={form.targetType}
                onChange={(e) => {
                  updateField("targetType", e.target.value);
                  updateField("targetUser", "");
                }}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
              >
                <option value="all">לכל המשתמשים</option>
                <option value="students">לתלמידים בלבד</option>
                <option value="teachers">למורים בלבד</option>
                <option value="admins">למנהלים בלבד</option>
                <option value="single">משתמש ספציפי</option>
              </select>

              <p className="text-gray-400 text-xs mt-2">
                מספר נמענים משוער: {getTargetCount()}
              </p>
            </div>

            {form.targetType === "single" && (
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  בחירת משתמש
                </label>

                <select
                  value={form.targetUser}
                  onChange={(e) => updateField("targetUser", e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
                >
                  <option value="">בחרי משתמש...</option>

                  {singleUserOptions.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                עדיפות
              </label>

              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
              >
                <option value="low">נמוכה</option>
                <option value="normal">רגילה</option>
                <option value="high">גבוהה</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                כותרת ההודעה
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="לדוגמה: עדכון חשוב במערכת"
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                תוכן ההודעה
              </label>

              <textarea
                rows="6"
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                placeholder="כתבי כאן את הודעת המערכת..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-yellow-400"
              />
            </div>

            <button
              type="button"
              onClick={openSendConfirmModal}
              disabled={sending}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-8 py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-transform w-full disabled:opacity-60"
            >
              {sending ? "שולח הודעה..." : "שלח הודעה 🚀"}
            </button>
          </section>

          <aside className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-black mb-4">📊 תקציר נמענים</h2>

            <div className="space-y-3">
              <MiniStat label="כל המשתמשים" value={users.length} />

              <MiniStat
                label="תלמידים"
                value={
                  users.filter(
                    (user) => user.role === "student" || user.role === "user"
                  ).length
                }
              />

              <MiniStat
                label="מורים"
                value={users.filter((user) => user.role === "teacher").length}
              />

              <MiniStat
                label="מנהלים"
                value={users.filter((user) => user.role === "admin").length}
              />
            </div>
          </aside>
        </div>
      )}

      <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-black mb-5">
          📨 הודעות שנשלחו לאחרונה
        </h2>

        {sentMessages.length === 0 ? (
          <p className="text-gray-400">עדיין לא נשלחו הודעות.</p>
        ) : (
          <div className="space-y-3">
            {sentMessages.slice(0, 10).map((item) => (
              <div
                key={item._id}
                className="bg-slate-950/60 border border-white/10 rounded-2xl p-4"
              >
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <div>
                    <h3 className="font-black text-white">{item.title}</h3>

                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {item.body}
                    </p>
                  </div>

                  <div className="text-left text-sm text-gray-400">
                    <div>{getTargetLabel(item.targetType)}</div>
                    <div>{formatDate(item.createdAt)}</div>
                    <div>{item.recipients?.length || 0} נמענים</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AppConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        text={confirmModal.text}
        type="warning"
        confirmText="כן, שלח הודעה"
        cancelText="ביטול"
        isLoading={sending}
        onConfirm={handleSendMessage}
        onCancel={closeConfirmModal}
      />
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-slate-950/60 border border-white/10 rounded-2xl p-4">
      <span className="text-gray-300 font-bold">{label}</span>
      <span className="text-2xl font-black text-yellow-400">{value}</span>
    </div>
  );
}

function getRoleLabel(role) {
  const labels = {
    admin: "מנהל",
    teacher: "מורה",
    student: "תלמיד",
    user: "תלמיד",
  };

  return labels[role] || role || "לא ידוע";
}

function getTargetLabel(targetType) {
  const labels = {
    all: "כל המשתמשים",
    students: "תלמידים",
    teachers: "מורים",
    admins: "מנהלים",
    single: "משתמש בודד",
  };

  return labels[targetType] || targetType;
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}