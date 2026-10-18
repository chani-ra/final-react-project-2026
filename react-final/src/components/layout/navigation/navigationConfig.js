export const NAVIGATION_PRIORITY = {
      student: ['/dashboard', '/courses', '/tasks', '/writing', '/dictionary', '/chat', '/messages', '/create-personal-course', '/'],
      teacher: ['/teacher/dashboard', '/teacher/students', '/teacher/library', '/teacher/create', '/teacher/exercises/create', '/teacher/grading', '/messages', '/'],
      // Preserve the currently rendered order after the old second sort in ResponsiveHeader.
      admin: ['/admin/dashboard', '/admin/users', '/admin/content', '/admin/messages', '/admin/reviews', '/admin/settings', '/messages', '/', '/admin/learning'],
};

export function sortNavigationLinks(links, role) {
  const order = NAVIGATION_PRIORITY[role] || [];
  return [...links].sort((a, b) => {
    const left = order.indexOf(a.path);
    const right = order.indexOf(b.path);
    return (left < 0 ? 999 : left) - (right < 0 ? 999 : right);
  });
}

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


    return sortNavigationLinks(menus[role] || menus.student, role);
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
