import React from "react";
import RolePermissionsSelect from "./RolePermissionsSelect";

export default function AdminUsersTable({
  users,
  currentUserId,
  changingRoleId,
  onChangeRole,
}) {
  return (
    <div className="overflow-hidden rounded-[1.7rem] border-2 border-white/14 bg-slate-950/45">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-right">
          <thead>
            <tr className="border-b border-white/12 bg-white/10 text-xs font-black text-white/62">
              <th className="px-4 py-4">שם</th>
              <th className="px-4 py-4">אימייל</th>
              <th className="px-4 py-4">טלפון</th>
              <th className="px-4 py-4">גיל</th>
              <th className="px-4 py-4">רמת אנגלית</th>
              <th className="px-4 py-4">הרשאה</th>
              <th className="px-4 py-4">הצטרפות</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/8 text-sm">
            {users.map((user) => {
              const userId = user._id || user.id;

              return (
                <tr key={userId || user.email} className="transition hover:bg-white/8">
                  <td className="px-4 py-4">
                    <div className="font-black text-white">
                      {user.username || "ללא שם"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-white/62" dir="ltr">
                      {user.email || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-white/62" dir="ltr">
                    {user.phone || "—"}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {user.age || "—"}
                  </td>

                  <td className="px-4 py-4 text-white/62">
                    {getLevelLabel(user.englishLevel)}
                  </td>

                  <td className="px-4 py-4">
                    <RolePermissionsSelect
                      user={user}
                      currentUserId={currentUserId}
                      isLoading={changingRoleId === userId}
                      onChangeRole={onChangeRole}
                    />
                  </td>

                  <td className="px-4 py-4 text-white/55">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getLevelLabel(level) {
  const labels = {
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדמים",
    מתחילים: "מתחילים",
    בינוני: "בינוני",
    מתקדמים: "מתקדמים",
  };

  return labels[level] || level || "לא צוין";
}

function formatDate(date) {
  if (!date) return "לא ידוע";

  return new Date(date).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}