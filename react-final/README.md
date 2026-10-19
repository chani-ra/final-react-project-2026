# EnglishWise — React Client

**EnglishWise** is an AI-assisted English-learning platform with separate **student, teacher and administrator** experiences. This repository contains its React frontend; the Node.js API is maintained separately.

**[Live demo](https://englishwise-web.onrender.com)** · **[Backend repository](https://github.com/chani-ra/final-node-project-2026)** · **[Backend API documentation](https://github.com/chani-ra/final-node-project-2026/blob/main/docs/openapi.yaml)**

## Tech stack

- **Frontend:** React 19, Vite 8, JavaScript/JSX and incremental **TypeScript**.
- **Styling and navigation:** Tailwind CSS 3 and React Router 7.
- **State and communication:** Redux Toolkit (global authentication state), Axios (API and session handling), and feature-level React hooks.
- **Testing:** Node's built-in test runner for unit tests, Playwright for browser smoke tests, ESLint, and TypeScript type checking.
- **Deployment:** Render Static Site; the backend is a separate Node.js service.

## What the platform offers

| Role | Main capabilities |
| --- | --- |
| **Student** | Browse and enroll in courses, complete lessons/exercises/quizzes, track progress, listen to songs, use a personal dictionary, chat with AI, and generate personalized AI text lessons. |
| **Teacher** | Create and manage learning content, work with exercise and quiz builders, review students and grading workflows. |
| **Administrator** | Manage users, published content and songs, messages and reviews, and inspect AI Learning Studio history. |

The AI Learning Studio complements the existing features; it does **not** replace the chat, course system, or teacher content tools.

## Suggested demo: AI Learning Studio

```text
Student login
  └─ Courses → "שיעור AI לפי בקשה" (AI lesson on demand)
      ├─ Choose category and subcategory
      ├─ Choose Gemini or OpenAI GPT (if enabled on the backend)
      ├─ Enter a prompt and generate a text lesson
      └─ Reopen the lesson from personal history

Admin login → Learning History → Review saved lesson requests
```

**Note:** Selecting the Listening category in this flow generates **text**, not automatic speech audio.

## Run locally (Windows CMD)

Prerequisites: a recent Node.js version compatible with Vite 8, npm, and a running EnglishWise backend.

From the **`react-final`** directory:

```cmd
npm ci
copy .env.example .env
npm run dev
```

The local `.env` example is:

```dotenv
VITE_API_URL=http://localhost:3000
```

Start the backend separately on port 3000, or set `VITE_API_URL` to your backend's base URL. Do not append `/learning` to this value. `VITE_*` variables are exposed to client-side code: **never place API keys, MongoDB credentials, passwords, or JWT secrets in the React `.env` file.**

For a production build and local preview:

```cmd
npm run build
npm run preview
```

## Quality checks

```cmd
npm run typecheck
node --test
npm run lint
npm run build
npm run test:e2e
```

- `typecheck` runs TypeScript's `tsc --noEmit`; it checks the TypeScript files without producing output files. Existing JavaScript/JSX files are not all type-checked (`checkJs: false`).
- `node --test` runs the unit tests discovered by the Node.js test runner.
- `test:e2e` runs Playwright smoke tests in desktop and mobile Chrome configurations. A local Vite server is started automatically unless `E2E_BASE_URL` points to an external site.
- Authenticated E2E scenarios require optional `E2E_STUDENT_EMAIL/PASSWORD`, `E2E_TEACHER_EMAIL/PASSWORD`, and `E2E_ADMIN_EMAIL/PASSWORD` environment variables; without them, those scenarios are **skipped**, not passed.
- The smoke suite covers a subset of navigation and authentication behavior; manually verify student, teacher and admin workflows before release.

## Frontend architecture

The application follows a **feature-first** structure. UI, hooks, feature models and tests are colocated by feature; shared infrastructure is kept outside individual roles.

| Location | Responsibility |
| --- | --- |
| `src/App.jsx` | Application routes, role guards and lazy-loaded screens. |
| `src/features/auth/` | Login, registration and form validation. |
| `src/features/student/` | Courses, chat, dashboard, dictionary, tasks, writing, quizzes and exercises. |
| `src/features/teacher/` | Content creation and editing, library, students, grading and quiz/exercise builders. |
| `src/features/admin/` | User/content management, songs, messages, reviews and AI learning history. |
| `src/features/general/` | Cross-role features, shared lesson views, navigation and background audio. |
| `src/components/` | Shared layouts, route guards, notifications and UI components. |
| `src/services/` | API services and centralized Axios authentication/refresh handling. |
| `src/contracts/courseContracts.ts` | Shared TypeScript types for course data and API responses. |
| `src/redux/` | Application-wide authentication state. |
| `docs/FRONTEND_ARCHITECTURE.md` | Architectural conventions and feature ownership. |

The typical data flow is **page → feature hook/model → API service → backend**. React renders views and manages local interactions, while services own server requests. Route-level lazy loading keeps unrelated screens out of the initial bundle.

### Incremental TypeScript

TypeScript is used **selectively** to strengthen important data boundaries while preserving the existing working JavaScript/JSX application:

- `tsconfig.json` enables strict checks for `.ts` / `.tsx` files.
- `src/contracts/courseContracts.ts` defines course-related data contracts and a typed content selector.
- `src/services/courseService.ts` types requests and responses for course API operations while reusing the existing shared Axios client.
- Existing JS/JSX components continue to run alongside TS modules; the backend has not been migrated to TypeScript.

These contracts provide **compile-time checking**, not runtime validation of backend JSON.

## Deployment (Render)

Deploy the frontend as a **Render Static Site** using:

| Setting | Value |
| --- | --- |
| Repository root directory | `react-final` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Build-time environment variable | `VITE_API_URL=https://englishwise-api.onrender.com` |
| SPA rewrite rule | `/*` → `/index.html` (**Rewrite**, not Redirect) |

The backend should allow `https://englishwise-web.onrender.com` in its `CLIENT_ORIGINS` setting. The two services are deployed independently. Because Vite embeds `VITE_*` values in the frontend build, a changed API URL requires a new build/deployment.

## Manual acceptance checklist

- [ ] Student: log in, open a course, switch between lessons/songs/exercises/quizzes, and confirm progress after completing an activity.
- [ ] Student: play a course song, navigate away, and verify expected audio/navigation behavior.
- [ ] Student: switch between two AI conversations and verify that their messages remain separate.
- [ ] Student: generate a short AI text lesson and reopen it from personal history.
- [ ] Teacher: open library and verify create/edit workflows relevant to the demo.
- [ ] Admin: open content management, verify songs and the weekly-song selection, and review AI Learning Studio history.
- [ ] Verify role-based access and the deployed backend connection.

## Security and operational notes

AI provider calls and secrets belong to the **backend**, not the browser. The backend implements authorization, input checks, rate limiting and daily OpenAI lesson quotas. A request-count quota is **not** a spending limit for the shared provider account.

For server environment variables, endpoint contracts, and further operational notes, consult the [Backend README](https://github.com/chani-ra/final-node-project-2026/blob/main/README.md) and [OpenAPI specification](https://github.com/chani-ra/final-node-project-2026/blob/main/docs/openapi.yaml).
