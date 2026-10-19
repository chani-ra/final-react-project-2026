# EnglishWise frontend architecture — feature-first

## Rule: one home per feature

EnglishWise is a React + Vite application with student, teacher and admin roles.
Under `src/features/`, use the role as the first boundary and the user-visible
**feature** as the second boundary. Keep its route page, hook, model, UI pieces,
and tests close together. Even a one-file page has a clear feature home.

- `features/student/chat/Chat.jsx` owns the chat UI; `useChat.js` owns its flow;
  `chatModel.js` is the pure logic; tests stay next to the model.
- `features/student/courses/` includes the list, course details and personalized
  course creation because these screens operate on the same course domain.
- `features/teacher/library/` owns the library screen and library-specific logic.
- `features/admin/messages/` owns the admin message experience.
- `features/auth/login/` and `features/auth/register/` own each public flow.
- `features/general/` contains **genuinely shared feature-level behavior**.
  `general/lessons/LessonView.jsx` is shared by student and teacher routes;
  `general/dashboard/JourneyMap.jsx` is reused across role dashboards.
- `features/reviews/` is already a cohesive cross-role feature.

## What remains outside `features`

- `src/App.jsx`: central routing, guards and lazy imports; no domain work.
- `src/components/`: app shell, guards, notifications and global UI primitives.
- `src/services/`: HTTP calls and shared Axios/refresh-token behavior.
- `src/contracts/`: cross-feature TypeScript data contracts shared by services and features.
- `src/redux/`: global authentication; screen-specific state remains local.
- `src/assets/`: static assets.

## Files and folder depth

`.jsx` is for modules containing JSX, `.js` for JavaScript logic, and `.ts`
for incrementally typed modules such as `courseService.ts` and shared
`courseContracts.ts`. Mixing JavaScript and TypeScript is intentional;
`tsconfig.json` checks `.ts`/`.tsx` with strict settings while `checkJs` remains
disabled for legacy JS/JSX. A small feature should
have no artificial `models/`, `hooks/`, `containers/` or `repositories/` folders.
For a larger feature (e.g., dashboard), `components/` groups multiple visual
parts while hooks and tests can stay beside the page. Choose responsibility,
not the number of lines, as the reason for a new file or folder.

Never import a role's private implementation from another role. Move a truly
shared module into `features/general/` or a globally shared infrastructure
module when appropriate. Do not duplicate an existing service or notification
component. Avoid circular imports and feature-to-feature reach-through.

## Safe refactoring

Preserve the existing routes, permissions, API contracts, JSX output and
Tailwind classes during structural refactors. When migrating individual files
to TypeScript, type the existing API shapes rather than changing runtime
responses. Run `npm run typecheck`, `node --test`, `npm run build`,
`npm run lint`, and `npm run test:e2e`, then check authenticated student,
teacher and admin flows manually when test credentials are unavailable.

When changing features later, follow the nearest existing convention and edit
its colocated tests. Keep untracked ZIPs, patches, generated code and media out
of Git commits.
