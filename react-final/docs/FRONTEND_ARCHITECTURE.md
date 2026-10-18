# EnglishWise frontend — feature-first conventions

The frontend is organized by **product feature**, not by a global collection of `hooks`,
`models` and `components`. Keep route-level page components in their role folder
(`features/student`, `features/teacher`, `features/admin`). Complex behavior and UI
live together in a dedicated sibling feature folder such as `student/chat` or
`teacher/library`.

## Directories and responsibilities

- `src/features/auth`: login, registration and validation.
- `src/features/student`: student pages and student-owned features (`chat`,
  `courses`, `dictionary`, `exercise`, `quiz`, `learning`, `tasks`).
- `src/features/teacher`: teacher pages and teacher-owned features (`create`,
  `edit`, `library`, `exerciseBuilder`, `quizBuilder`).
- `src/features/admin`: admin pages and admin-only feature logic (`messages`).
- `src/features/general`: reusable **feature-level UI** used across roles, e.g.
  the dashboard journey map and personal messages.
- `src/features/reviews`: the reviews feature, which spans user roles.
- `src/features/*/components`: truly shared **within that role**; do not put a
  feature-specific component here.
- `src/components`: app-level infrastructure, including layout, route guards,
  notices and low-level UI primitives.
- `src/services`: HTTP clients and backend requests. Never duplicate the Axios
  session/refresh machinery within individual features.
- `src/redux`: global authentication state; keep local form state local.

## Import and extraction rules

1. Pages may import their feature's hooks and presentation components; keep
   feature internals close together. Avoid imports into another role's private
   implementation. Shared cross-role UI belongs in `features/general`.
2. Only extract a helper when it has a real responsibility (validation,
   immutable data transformation, API coordination or independently reusable UI).
   A small screen is allowed to be a single file.
3. `*Model.js` functions are pure and testable; effects and React state stay
   in `use*.js` hooks; HTTP calls remain in `services` or a feature-local
   adapter when several services must be orchestrated.
4. Preserve visible RTL markup, Tailwind classes, route paths, permissions,
   request/response contracts and the centralized NoticeProvider on refactors.
5. Put relevant `*.test.js` next to the pure module it tests. For each batch,
   run `node --test` and `npm run build`, then exercise relevant screens.

## Why there is no folder for every page

Structure follows **complexity**, not appearance. One-file screens remain at the
role root. For a larger screen, create one focused sibling directory. Avoid
creating empty `hooks/components/models/utils` folders and avoid generic
`Manager` / `Controller` classes that only forward calls.

## Changes in the consistency batch

This batch only relocates feature-owned files and adjusts their relative imports.
The previous unused `Curses.jsx` demo was deleted; the active `Courses.jsx` and
its API flow are unchanged. No backend or user-facing UI is modified.
