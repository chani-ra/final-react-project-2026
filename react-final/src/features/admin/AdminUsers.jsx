import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllUsersForAdmin,
  updateUserRole,
} from "../../services/adminService";
import AdminUsersTable from "./components/AdminUsersTable";

export default function AdminUsers() {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [changingRoleId, setChangingRoleId] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const currentUserId = currentUser?._id || currentUser?.id;

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

  const counts = useMemo(() => {
    return {
      all: users.length,
      students: users.filter((item) => item.role === "student" || item.role === "user").length,
      teachers: users.filter((item) => item.role === "teacher").length,
      admins: users.filter((item) => item.role === "admin").length,
    };
  }, [users]);

  const visibleUsers = useMemo(() => {
    const search = searchQuery.toLowerCase().trim();

    let list = users;

    if (activeTab === "students") {
      list = users.filter((item) => item.role === "student" || item.role === "user");
    }

    if (activeTab === "teachers") {
      list = users.filter((item) => item.role === "teacher");
    }

    if (activeTab === "admins") {
      list = users.filter((item) => item.role === "admin");
    }

    if (!search) return list;

    return list.filter((item) => {
      return (
        item.username?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.phone?.toLowerCase().includes(search) ||
        String(item.age || "").includes(search) ||
        item.englishLevel?.toLowerCase().includes(search)
      );
    });
  }, [users, activeTab, searchQuery]);

  const tabs = [
    { id: "all", label: "הכול", count: counts.all },
    { id: "students", label: "תלמידים", count: counts.students },
    { id: "teachers", label: "מורים", count: counts.teachers },
    { id: "admins", label: "מנהלים", count: counts.admins },
  ];

  const handleChangeRole = async (userId, newRole) => {
    try {
      setChangingRoleId(userId);
      setMessage({ type: "", text: "" });

      const updatedUser = await updateUserRole(userId, newRole);

      setUsers((prevUsers) =>
        prevUsers.map((item) => {
          const itemId = item._id || item.id;

          if (itemId !== userId) return item;

          return {
            ...item,
            ...updatedUser,
            role: newRole,
          };
        })
      );

      setMessage({
        type: "success",
        text: "ההרשאה עודכנה בהצלחה.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.toString(),
      });

      throw error;
    } finally {
      setChangingRoleId("");
    }
  };

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
            <div className="mb-3 inline-flex rounded-full border border-yellow-300/45 bg-yellow-300/15 px-4 py-2 text-sm font-black text-yellow-100">
              user management
            </div>

            <h1
              className="text-3xl font-black leading-tight text-white md:text-4xl"
              style={{
                textShadow:
                  "3px 3px 0 rgba(184,50,42,0.45), -1px -1px 0 rgba(15,76,117,0.90)",
              }}
            >
              ניהול משתמשים
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-7 text-white/68">
              טבלת משתמשים מסודרת עם חיפוש, סינון לפי תפקיד ועדכון הרשאות.
            </p>
          </div>

          <button
            type="button"
            onClick={loadUsers}
            className="w-fit rounded-full border-2 border-yellow-300/50 bg-yellow-300/15 px-6 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-300/25"
          >
            רענון משתמשים
          </button>
        </div>
      </section>

      {message.text && (
        <div
          className={`rounded-[1.5rem] border-2 px-5 py-3 text-sm font-black ${
            message.type === "success"
              ? "border-emerald-300/35 bg-emerald-400/15 text-emerald-100"
              : "border-red-300/35 bg-red-500/15 text-red-100"
          }`}
        >
          {message.text}
        </div>
      )}

      <section
        className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-slate-950/55 p-4 text-white backdrop-blur-xl md:p-5"
        style={{
          boxShadow:
            "0 24px 75px rgba(3,31,61,0.34), inset 0 1px 0 rgba(255,255,255,0.10)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/8 to-transparent" />

        <div className="relative z-10">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full border-2 px-5 py-2.5 text-sm font-black transition ${
                    activeTab === tab.id
                      ? "border-yellow-300 bg-yellow-300 text-slate-950 shadow-[0_0_20px_rgba(253,224,71,0.24)]"
                      : "border-white/16 bg-white/10 text-white hover:border-yellow-300/45 hover:bg-white/16"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="חיפוש לפי שם, מייל, טלפון, גיל או רמה..."
              className="w-full rounded-full border-2 border-white/18 bg-white/10 px-5 py-3 text-sm font-bold text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/70 focus:bg-white/15 lg:w-[390px]"
            />
          </div>

          {loading ? (
            <LoadingState />
          ) : visibleUsers.length === 0 ? (
            <EmptyUsers />
          ) : (
            <AdminUsersTable
              users={visibleUsers}
              currentUserId={currentUserId}
              changingRoleId={changingRoleId}
              onChangeRole={handleChangeRole}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/18 bg-white/10">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-yellow-300" />
        </div>

        <p className="mt-4 text-base font-black text-white">
          טוען משתמשים...
        </p>
      </div>
    </div>
  );
}

function EmptyUsers() {
  return (
    <div className="rounded-[2rem] border-2 border-dashed border-white/20 bg-white/8 p-10 text-center">
      <h2 className="text-2xl font-black text-white">לא נמצאו משתמשים</h2>

      <p className="mt-3 text-sm font-semibold leading-7 text-white/60">
        אין משתמשים מתאימים לסינון או לחיפוש שבחרת.
      </p>
    </div>
  );
}