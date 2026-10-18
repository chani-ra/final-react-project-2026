export function getRecipientsCounts(users) {
  return {
    all: users.length,
    students: users.filter(user => user.role === "student" || user.role === "user").length,
    teachers: users.filter(user => user.role === "teacher").length,
    admins: users.filter(user => user.role === "admin").length,
  };
}

function getRoleLabel(role) {
  return { admin: "מנהל", teacher: "מורה", student: "תלמיד", user: "תלמיד" }[role] || role || "לא ידוע";
}

export function getRecipientOptions(users) {
  return users.map(user => ({
    id: user._id || user.id,
    label: `${user.username || "ללא שם"} - ${user.email || "ללא מייל"} (${getRoleLabel(user.role)})`,
  }));
}

export function getRecipientCount(form, counts) {
  if (form.targetType === "all") return counts.all;
  if (form.targetType === "students") return counts.students;
  if (form.targetType === "teachers") return counts.teachers;
  if (form.targetType === "admins") return counts.admins;
  if (form.targetType === "single") return form.targetUser ? 1 : 0;
  return 0;
}

export function validateAdminMessage(form, recipientCount) {
  if (!form.title.trim()) return "חובה למלא כותרת הודעה";
  if (!form.body.trim()) return "חובה למלא תוכן הודעה";
  if (form.targetType === "single" && !form.targetUser) return "בחרי משתמש לקבלת הודעה אישית";
  if (recipientCount === 0) return "לא נמצאו נמענים מתאימים";
  return "";
}
