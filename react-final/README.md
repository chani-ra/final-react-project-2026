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
| `src/App.jsx` | Top-level routes, role-specific guards and lazy-loaded screens. |
| `src/features/auth/login/`, `auth/register/` | Authentication and registration pages with colocated validation. |
| `src/features/student/chat/`, `courses/`, `dictionary/`, `tasks/`, `writing/` | Student pages together with their feature-specific hooks, models, components and tests. |
| `src/features/student/dashboard/`, `exercise/`, `quiz/`, `learning/` | Dashboard and learning experiences; AI Learning Studio includes its own state hook and model. |
| `src/features/teacher/create/`, `library/`, `exerciseBuilder/`, `quizBuilder/` | Teacher workflows, forms and local feature logic. |
| `src/features/admin/` | Admin features: dashboard, users, content, messages, reviews, learning history and settings. |
| `src/features/general/` | Cross-role functionality such as shared lesson preview, messages and the dashboard journey map. |
| `src/components/` | App-wide layout, guards and reusable UI infrastructure. |
| `src/services/` | Backend requests and centralized Axios/session handling. |
| `src/redux/` | Global authentication state. |

**Architecture conventions:** see [Frontend Architecture](docs/FRONTEND_ARCHITECTURE.md). Components are colocated with the feature that owns them, while `.jsx` modules contain JSX and `.js` modules contain logic without JSX. The Learning Studio follows a **view → hook/model → API service → backend** separation. Route-level lazy loading avoids downloading every screen up front.

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
