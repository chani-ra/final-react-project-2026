# EnglishWise — React Client

**EnglishWise** is a full-stack, AI-assisted English-learning experience with student, teacher and administrator interfaces. The client is built with **React, Vite, Tailwind CSS, Redux Toolkit, React Router and Axios**.

**Live demo:** [EnglishWise](https://englishwise-web.onrender.com) · [Backend repository](https://github.com/chani-ra/final-node-project-2026) · [Backend documentation](https://github.com/chani-ra/final-node-project-2026/blob/main/README.md)

## Evaluation flow: AI Learning Studio

```text
Student login
  └─ Courses → "שיעור AI לפי בקשה" (AI lesson on demand)
      ├─ Choose category and subcategory
      ├─ Choose Google Gemini or OpenAI GPT (when enabled by the API)
      ├─ Type a prompt and generate a lesson
      └─ Read the result and reopen lessons from personal history

Admin login → Learning History → Filter/review saved student prompts
```

The new AI Learning Studio is additive: it does **not** replace the existing chat, courses, teacher content tools or personalized learning functionality.

## Local development (Windows CMD)

From the `react-final` directory:

```cmd
npm install
copy .env.example .env
npm run dev
```

The `.env` file must contain:

```dotenv
VITE_API_URL=http://localhost:3000
```

Start the Node.js backend separately on port 3000. `VITE_API_URL` is the **backend base URL**, without `/learning`. Do not put `GEMINI_API_KEY`, `OPENAI_API_KEY`, MongoDB credentials or JWT secrets in the React environment: `VITE_*` values are embedded in public browser code.

```cmd
npm run build
npm run preview
npm run lint
node --test
```

`npm run build` produces a production-ready `dist` directory. `node --test` runs the existing tests discoverable by the Node test runner; not every UI interaction is covered by automated tests. Run browser smoke tests after each deployment.

## Project structure

| Directory / file | Responsibility |
| --- | --- |
| `src/App.jsx` | Top-level routes, role-specific navigation and lazy-loaded screens. |
| `src/features/student/learning/` | AI Learning Studio UI, lesson display, state hook and model helpers. |
| `src/services/learningService.js` | HTTP calls for category, provider, generation and history endpoints. |
| `src/features/admin/AdminLearningHistory.jsx` | Admin view of generated lessons and their owners. |
| `src/features/student/` | Other student learning workflows (courses, tasks, quizzes, writing and more). |
| `src/features/teacher/` | Teacher content and exercises. |
| `src/components/` | Shared layout and interface components. |
| `src/services/axiosConfig.jsx` | Shared API client and authentication handling. |

The Learning Studio follows a **view → hook/model → API service → backend** separation so that view styling, application state and network logic are not mixed in one file. Route-level lazy loading reduces initial JavaScript work for users who do not visit every screen.

## Deployment (Render)

Deploy this client as a **Static Site**:

- Root directory: `react-final` (the Git repository root is its parent directory).
- Build command: `npm ci && npm run build`.
- Publish directory: `dist`.
- Environment variable: `VITE_API_URL=https://englishwise-api.onrender.com`.
- SPA rewrite: `/*` → `/index.html` (rewrite, not redirect).

The backend's `CLIENT_ORIGINS` setting must allow `https://englishwise-web.onrender.com`. Frontend and backend are deployed independently; verify both versions after a push.

## Manual acceptance checklist

- Log in as a student; open Courses → AI Learning Studio.
- Confirm categories, subcategories and configured AI providers load.
- Generate one short lesson; confirm content is complete and is present in history after refresh.
- Open the same history record again; confirm account isolation (another student cannot read it).
- Log in as admin; check the saved lesson in the admin history view.
- Smoke-test existing courses, tasks, quizzes, chat and teacher workflows after changes.

## Security and product notes

The browser receives **no AI API secrets**; calls are authenticated and routed through the backend. The backend enforces category/subcategory validation, ownership rules, request rate limits and MongoDB-backed **daily OpenAI lesson quotas**. A quota limits API-call counts, not the shared provider account's financial spend.

The AI Learning Studio generates text lessons. Choosing a Listening category does not automatically create speech audio in this module; that is outside the evaluated text-generation flow.

For the exact endpoint contract and backend operational notes, see the [Backend README](https://github.com/chani-ra/final-node-project-2026/blob/main/README.md) and `docs/openapi.yaml` there.
