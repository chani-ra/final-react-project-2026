// Presentation order only: no route or authorization changes.
const priorities = {
  student: ['/dashboard','/courses','/tasks','/writing','/dictionary','/chat','/messages','/create-personal-course','/'],
  teacher: ['/teacher/dashboard','/teacher/students','/teacher/library','/teacher/create','/teacher/exercises/create','/teacher/grading','/messages','/'],
  admin: ['/admin/dashboard','/admin/users','/admin/content','/admin/messages','/admin/reviews','/admin/settings','/messages','/'],
};
export function prioritizeNavLinks(links, role) {
  const order = priorities[role] || [];
  return [...links].sort((a,b) => {
    const ai = order.indexOf(a.path), bi = order.indexOf(b.path);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
}
