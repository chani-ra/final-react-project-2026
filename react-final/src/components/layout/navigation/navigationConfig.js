export function getNavLinks(role) {
    const homeLink = { name: "דף הבית", path: "/" };

    const menus = {
      student: [
        homeLink,

        { name: "דשבורד", path: "/dashboard" },
        { name: "קורסים", path: "/courses" },
        { name: "קורס חדש", path: "/create-personal-course" },
        { name: "הודעות", path: "/messages" },
        { name: "משימות", path: "/tasks" },
        { name: "בולט", path: "/chat" },
        { name: "מילון", path: "/dictionary" },
        { name: "כתיבה", path: "/writing" },
      ],

      teacher: [
        homeLink,

        { name: "לוח בקרה", path: "/teacher/dashboard" },
        { name: "הכיתות שלי", path: "/teacher/students" },
        { name: "העלאת תוכן", path: "/teacher/create" },
        { name: "יצירת תרגיל", path: "/teacher/exercises/create" },
        { name: "הספרייה שלי", path: "/teacher/library" },
        { name: "הודעות", path: "/messages" },
        { name: "בדיקת משימות", path: "/teacher/grading" },
      ],

      admin: [
        homeLink,

        { name: "נתוני מערכת", path: "/admin/dashboard" },
        { name: "ניהול משתמשים", path: "/admin/users" },
        { name: "שיעורי AI", path: "/admin/learning" },
        { name: "מאגר תוכן", path: "/admin/content" },
        { name: "שליחת הודעות", path: "/admin/messages" },
        { name: "ההודעות שלי", path: "/messages" },
        { name: "הגדרות", path: "/admin/settings" },
        { name: "המלצות", path: "/admin/reviews" },
      ],
    };

    const priorities = {
      student: ['/dashboard', '/courses', '/tasks', '/writing', '/dictionary', '/chat', '/messages', '/create-personal-course', '/'],
      teacher: ['/teacher/dashboard', '/teacher/students', '/teacher/library', '/teacher/create', '/teacher/exercises/create', '/teacher/grading', '/messages', '/'],
      admin: ['/admin/dashboard', '/admin/users', '/admin/learning', '/admin/content', '/admin/messages', '/admin/reviews', '/admin/settings', '/messages', '/'],
    };
    const order = priorities[role] || [];
    return [...(menus[role] || menus.student)].sort((a, b) => {
      const aIndex = order.indexOf(a.path);
      const bIndex = order.indexOf(b.path);
      return (aIndex < 0 ? 999 : aIndex) - (bIndex < 0 ? 999 : bIndex);
    });
  }

export function getRoleLabel(role) {
  return {
    student: "תלמידה",
    teacher: "מורה",
    admin: "מנהל",
  }[role] || role;
}

export function isNavActive(pathname, linkPath) {
  if (pathname === linkPath) return true;

  if (linkPath === "/" || linkPath === "/dashboard") {
    return false;
  }

  return pathname.startsWith(linkPath + "/");
}
