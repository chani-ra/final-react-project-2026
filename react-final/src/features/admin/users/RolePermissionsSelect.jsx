import React, { useEffect, useState } from "react";
import AppConfirmModal from "../../../components/AppConfirmModal";

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

function RoleConfirmModal({ user, currentRole, newRole, isLoading, localError, onConfirm, onCancel }) {
  const userName = user.username || user.email || "המשתמש";
  return <AppConfirmModal
    isOpen title={`לשנות את ההרשאה של ${userName}?`}
    text={`ההרשאה הנוכחית: ${getRoleLabel(currentRole)}. ההרשאה החדשה: ${getRoleLabel(newRole)}.`}
    type={newRole === "admin" ? "danger" : "warning"}
    confirmText="כן, עדכני הרשאה" cancelText="ביטול" error={localError}
    isLoading={isLoading} onConfirm={onConfirm} onCancel={onCancel}
  />;
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