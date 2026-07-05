import React, { useEffect, useState } from "react";

const roleOptions = [
  { value: "student", label: "תלמיד" },
  { value: "teacher", label: "מורה" },
  { value: "admin", label: "מנהל" },
];

export default function RolePermissionsSelect({
  user,
  currentUserId,
  isLoading,
  onChangeRole,
}) {
  const [selectedRole, setSelectedRole] = useState(normalizeRole(user.role));
  const [pendingRole, setPendingRole] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localError, setLocalError] = useState("");

  const userId = user._id || user.id;
  const isCurrentUser = currentUserId && userId === currentUserId;

  useEffect(() => {
    setSelectedRole(normalizeRole(user.role));
  }, [user.role]);

  const handleSelectChange = (event) => {
    const newRole = event.target.value;

    if (newRole === selectedRole) return;

    setLocalError("");
    setPendingRole(newRole);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setPendingRole("");
    setLocalError("");
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    if (!pendingRole) return;

    try {
      setLocalError("");

      await onChangeRole(userId, pendingRole);

      setSelectedRole(pendingRole);
      setPendingRole("");
      setIsModalOpen(false);
    } catch (error) {
      setLocalError(error.toString());
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <select
          value={selectedRole}
          onChange={handleSelectChange}
          disabled={isLoading || isCurrentUser}
          className="rounded-full border border-white/16 bg-slate-950/70 px-3 py-2 text-xs font-black text-white outline-none transition focus:border-yellow-300/70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value} className="bg-slate-950">
              {role.label}
            </option>
          ))}
        </select>

        {isLoading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-yellow-300" />
        )}

        {isCurrentUser && (
          <span className="rounded-full border border-yellow-300/30 bg-yellow-300/12 px-2 py-1 text-[11px] font-black text-yellow-100">
            החשבון שלך
          </span>
        )}
      </div>

      {isModalOpen && (
        <RoleConfirmModal
          user={user}
          currentRole={selectedRole}
          newRole={pendingRole}
          isLoading={isLoading}
          localError={localError}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

function RoleConfirmModal({
  user,
  currentRole,
  newRole,
  isLoading,
  localError,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-md rounded-[2rem] border-2 border-white/20 bg-slate-950 p-6 text-white shadow-2xl"
        dir="rtl"
      >
        <div className="mb-4 rounded-full border border-red-300/30 bg-red-500/15 px-4 py-2 text-center text-sm font-black text-red-100">
          שינוי הרשאה
        </div>

        <h2 className="text-center text-2xl font-black text-white">
          לשנות את התפקיד של {user.username || user.email || "המשתמש"}?
        </h2>

        <p className="mt-4 text-center text-sm font-semibold leading-7 text-white/65">
          התפקיד הנוכחי הוא <RoleText role={currentRole} /> והתפקיד החדש יהיה{" "}
          <RoleText role={newRole} />.
        </p>

        {localError && (
          <div className="mt-4 rounded-[1rem] border border-red-300/30 bg-red-500/15 px-4 py-3 text-sm font-black text-red-100">
            {localError}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-full border-2 border-white/50 bg-gradient-to-b from-red-400 to-red-700 px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "מעדכן..." : "אישור שינוי"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-full border-2 border-white/16 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/16 disabled:cursor-not-allowed disabled:opacity-60"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}

function RoleText({ role }) {
  return <span className="font-black text-yellow-100">{getRoleLabel(role)}</span>;
}

function normalizeRole(role) {
  if (role === "user") return "student";
  return role || "student";
}

function getRoleLabel(role) {
  const labels = {
    student: "תלמיד",
    teacher: "מורה",
    admin: "מנהל",
    user: "תלמיד",
  };

  return labels[role] || role || "תלמיד";
}