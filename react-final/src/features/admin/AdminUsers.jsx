import React, { useEffect, useMemo, useState } from "react";
import { getAllUsersForAdmin } from "../../services/adminService";
import AppConfirmModal from "../../components/AppConfirmModal";

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    text: "",
    type: "info",
  });

  // טעינת משתמשים מהשרת
  const loadUsers = async () => {
    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const data = await getAllUsersForAdmin();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage({ type: "error", text: error.toString() });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const students = useMemo(() => {
    return users.filter((user) => user.role === "student" || user.role === "user");
  }, [users]);

  const teachers = useMemo(() => {
    return users.filter((user) => user.role === "teacher");
  }, [users]);

  const admins = useMemo(() => {
    return users.filter((user) => user.role === "admin");
  }, [users]);

  const activeUsers = useMemo(() => {
    const map = {
      students,
      teachers,
      admins,
    };

    const list = map[activeTab] || [];
    const search = searchQuery.toLowerCase().trim();

    if (!search) return list;

    return list.filter((user) => {
      return (
        user.username?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.phone?.toLowerCase().includes(search)
      );
    });
  }, [activeTab, students, teachers, admins, searchQuery]);

  const tabs = [
    {
      id: "students",
      label: "תלמידים",
      icon: "🎒",
      count: students.length,
      color: "border-yellow-400 text-yellow-400",
    },
    {
      id: "teachers",
      label: "מורים",
      icon: "🧑‍🏫",
      count: teachers.length,
      color: "border-indigo-400 text-indigo-400",
    },
    {
      id: "admins",
      label: "מנהלים",
      icon: "🛡️",
      count: admins.length,
      color: "border-emerald-400 text-emerald-400",
    },
  ];

  // פתיחת הודעת מידע יפה במקום alert
  const openInfoModal = ({ title, text, type = "info" }) => {
    setModal({
      isOpen: true,
      title,
      text,
      type,
    });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      title: "",
      text: "",
      type: "info",
    });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          👥 ניהול משתמשי המערכת
        </h1>

        <p className="text-gray-400 mt-1">
          צפייה במשתמשים לפי תפקיד: תלמידים, מורים ומנהלים.
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

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="סה״כ משתמשים" value={users.length} />
        <StatCard title="תלמידים" value={students.length} color="text-yellow-400" />
        <StatCard title="מורים" value={teachers.length} color="text-indigo-400" />
        <StatCard title="מנהלים" value={admins.length} color="text-emerald-400" />
      </section>

      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 pb-4 px-4 font-bold text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? tab.color
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            {tab.icon} {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חיפוש לפי שם, מייל או טלפון..."
          className="w-full md:max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-500 transition-all"
        />

        <button
          type="button"
          onClick={() =>
            openInfoModal({
              title: "שליחת הודעה לקבוצה",
              text: "שליחת הודעות לקבוצות כבר קיימת במסך 'הודעות ופידבקים'. מכאן בהמשך נחבר קיצור ישיר לפי הטאב הנבחר.",
              type: "info",
            })
          }
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3 rounded-xl transition-all"
        >
          שלח הודעה לקבוצה 💬
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-white font-bold text-xl">
          <div className="animate-pulse">טוען משתמשים... 👥</div>
        </div>
      ) : activeUsers.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>

          <h2 className="text-2xl font-black mb-2">לא נמצאו משתמשים</h2>

          <p className="text-gray-400">
            אין משתמשים מתאימים לטאב או לחיפוש שבחרת.
          </p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-lg">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-sm font-semibold">
                <th className="p-4">שם</th>
                <th className="p-4">אימייל</th>
                <th className="p-4">טלפון</th>
                <th className="p-4">גיל</th>
                <th className="p-4">תפקיד</th>
                <th className="p-4">הצטרפות</th>
                <th className="p-4 text-left">פעולות</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-sm">
              {activeUsers.map((user) => (
                <tr
                  key={user._id || user.id}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="p-4 font-bold text-white">
                    {user.username || "ללא שם"}
                  </td>

                  <td className="p-4 text-gray-300 font-mono text-xs">
                    {user.email || "לא צוין"}
                  </td>

                  <td className="p-4 text-gray-400">
                    {user.phone || "לא צוין"}
                  </td>

                  <td className="p-4 text-gray-400">
                    {user.age || "—"}
                  </td>

                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="p-4 text-gray-400">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="p-4 text-left">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openInfoModal({
                            title: "שליחת הודעה אישית",
                            text: `בשלב הבא נחבר מכאן שליחת הודעה אישית ישירות אל ${user.username || user.email}. כרגע אפשר לשלוח הודעה אישית דרך מסך 'הודעות ופידבקים' בבחירת משתמש ספציפי.`,
                            type: "info",
                          })
                        }
                        className="text-xs font-bold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-lg transition-all"
                      >
                        הודעה
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openInfoModal({
                            title: "ניהול הרשאות",
                            text: "ניהול הרשאות מתקדם יתווסף בהמשך: שינוי תפקיד, חסימת משתמש, והפעלה מחדש.",
                            type: "warning",
                          })
                        }
                        className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all text-gray-300"
                      >
                        הרשאות
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AppConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        text={modal.text}
        type={modal.type}
        confirmText="הבנתי"
        cancelText="סגור"
        onConfirm={closeModal}
        onCancel={closeModal}
      />
    </div>
  );
}

function StatCard({ title, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`text-3xl font-black mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function RoleBadge({ role }) {
  const config = {
    admin: {
      label: "מנהל",
      className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    teacher: {
      label: "מורה",
      className: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    student: {
      label: "תלמיד",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    user: {
      label: "תלמיד",
      className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
  };

  const item = config[role] || {
    label: role || "לא ידוע",
    className: "bg-white/10 text-gray-400 border-white/10",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${item.className}`}
    >
      {item.label}
    </span>
  );
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}