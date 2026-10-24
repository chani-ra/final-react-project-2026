# EnglishWise — Frontend

**A personalized, AI-assisted English learning platform built with React.**

EnglishWise combines structured courses with AI-generated lessons, a personal study coach, progress insights, and dedicated workspaces for students, teachers, and administrators. This repository contains the **React/Vite client**; the API and database live in a separate backend repository.

**[Live application](https://englishwise-web.onrender.com/)** · **[Backend repository](https://github.com/chani-ra/final-node-project-2026)** · **[API specification](https://github.com/chani-ra/final-node-project-2026/blob/main/docs/openapi.yaml)**

## Core workflow — from prompt to saved lesson

AI Learning Studio offers an end-to-end path from selecting a topic to creating, saving, and revisiting an AI-generated lesson:

```text
1. Register or log in as a student
        ↓
2. Courses → "שיעור AI לפי בקשה" (AI lesson on demand)
        ↓
3. Choose a learning category and its subcategory
        ↓
4. Enter a prompt (e.g., "Explain Past Simple with examples")
   and select an available AI provider
        ↓
5. Generate and read a personalized AI text lesson
        ↓
6. Open the student's saved learning history
   and revisit the lesson after refreshing the page
        ↓
7. Log in as an administrator → AI Learning History
   to view users' stored prompts and generated responses
```

**What happens behind the UI:** `LearningStudio.jsx` → `useLearningStudio.js` → `src/services/learningService.js` → authenticated Express REST API → Joi validation and learning service → Gemini/OpenAI → `LearningPrompt` document in MongoDB → personal/admin history endpoints.

Successful results are **persisted**, not merely displayed in browser state. Personal history is scoped to the authenticated student; administrative access is enforced on the **server**, not only in React. Learning Studio generates **text lessons**, including when the chosen topic is listening.

### Core workflow capabilities

| Capability | EnglishWise implementation |
| --- | --- |
| Register users | Student registration with a MongoDB-backed profile and authentication. |
| Select category and subcategory | Learning Studio uses an API-backed, related category/subcategory catalog. |
| Submit a prompt and display AI response | Authenticated lesson-generation form with Gemini/OpenAI integration. |
| Store and revisit learning history | Persistent lessons and paginated personal history. |
| Admin views user prompt history | Protected AI Learning History dashboard. |
| Modular Full Stack application | React feature modules and a separate Express/Mongoose REST API. |

## At a glance

| Area | What it includes |
| --- | --- |
| **Students** | Courses, lessons, exercises, quizzes, a personal dictionary, writing practice, AI chat, tasks, and progress tracking. |
| **Personalized learning** | AI Learning Studio, personal AI coach, daily smart guide, learning brain map, and weekly song. |
| **Teachers** | Content creation and editing, a resource library, exercise and quiz builders, student views, and grading workflows. |
| **Administrators** | User and content management, messages, reviews, weekly-song selection, and AI learning history. |

### Key student experiences

- **AI Learning Studio:** select a category and subcategory, submit a prompt, choose an available AI provider, receive a generated **text lesson**, and revisit saved lessons.
- **Personal AI Coach:** request a focused study plan, review earlier plans, track steps, and turn recommendations into tasks.
- **Daily Smart Guide:** view daily learning recommendations with shortcuts to relevant activities; a fallback plan is shown if the service is unavailable.
- **Learning Brain Map:** combine course progress, quizzes, vocabulary, conversations, and tasks into a learning overview, with an optional AI-enhanced analysis.
- **Weekly Song:** practice listening with a featured song selected by an administrator, using the shared audio player.
- **Personal tasks and progress:** organize study activities and track completed learning work.

### Adaptive onboarding and tool-using AI agents

- **Personal course from day one:** after registration, the backend assembles a private learning course from **existing** lessons, songs, exercises, and quizzes. Matching uses the student's English level, age, hobbies, and learning goals; later, a personalized course can be refreshed with newly available relevant content. This is a **rule-based matching workflow**, not a claim that an LLM generates every course item.
- **Two scoped AI agents:** the Personal AI Coach and Daily Smart Guide use Gemini function calling through a shared agent runner. When relevant, they can retrieve the **authenticated student's** recent quiz scores, grammar-correction history, course progress, and tasks. They use that context to produce practical study plans and recommendations.
- **Controlled execution:** the agent runner limits tool use (up to three calls per run), returns structured plans, and the application supports fallback guidance when the AI provider is unavailable. These are **on-demand, tool-assisted workflows**, not continuously running autonomous agents.

The homepage uses an illustrated, sky-themed visual language; the application includes responsive layouts for student, teacher, and administrator views.

## Tech stack

- **UI:** React 19, JavaScript/JSX, Vite 8, React Router 7, Tailwind CSS 3.
- **State and networking:** Redux Toolkit for authentication, feature-level hooks for local behavior, Axios for the REST API and token refresh.
- **Type safety:** incremental TypeScript for selected shared contracts and API functions; the full JSX application has not been migrated.
- **Quality tools:** ESLint, TypeScript checking, Node.js unit tests, Playwright browser smoke tests.
- **Hosting:** Render Static Site; the Express API is hosted separately.

## Getting started

**Requirements:** Node.js compatible with Vite 8, npm, and a running EnglishWise backend (locally or remotely).

From the **`react-final`** directory, run these commands in **Windows CMD**:

```cmd
npm ci
copy .env.example .env
npm run dev -- --port 5173 --strictPort
```

Open **http://localhost:5173/**.

The example frontend environment file contains:

```dotenv
VITE_API_URL=http://localhost:3000
```

Start the API separately on port `3000`, or set `VITE_API_URL` to a reachable backend base URL (without appending `/learning`). The backend must allow the **exact** frontend origin in `CLIENT_ORIGINS`; using a different local port can trigger CORS errors.

> **Security:** Vite embeds `VITE_*` values into the browser build. Never place API keys, JWT secrets, passwords, or database credentials in the frontend `.env` file.

### Build and preview

```cmd
npm run build
npm run preview
```

## Architecture

The client is organized primarily by **feature and user role**, with shared UI and API infrastructure:

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Routes, role-based guards, and lazy-loaded screens. |
| `src/features/auth/` | Authentication and registration. |
| `src/features/student/` | Dashboard, courses, learning studio, chat, tasks, exercises, quizzes, dictionary, writing. |
| `src/features/teacher/` | Teaching resources, authoring tools, and grading. |
| `src/features/admin/` | Administrative views, including learning history. |
| `src/features/general/` | Cross-role screens and shared learning/audio behavior. |
| `src/components/` | Layout, dialogs, reusable UI, and presentation assets. |
| `src/services/` | API calls, shared Axios client, and authentication/session handling. |
| `src/redux/` | Global authentication state. |
| `src/contracts/` | Selected TypeScript API/data contracts. |
| `docs/FRONTEND_ARCHITECTURE.md` | Detailed architectural conventions. |

Typical request flow:

```text
Page / UI component → feature hook or model → API service → Express backend → MongoDB / AI provider
```

Route-level lazy loading limits how many screens are loaded up front. Server authorization—not client route guards—is the source of truth for protected data.

## Assumptions and design decisions

- **Focused lesson workflow:** AI Learning Studio keeps the category → subcategory → prompt → generated lesson → history path straightforward. Courses, quizzes, media, and assistant tools complement this workflow without being required to use it.
- **Existing content for personalized courses:** registration creates a student-specific course by *matching and ranking existing published material*. It does not claim to generate an entire course with an LLM. When no content matches, the course can be refreshed after relevant material is added.
- **On-demand AI assistance:** the Personal AI Coach and Daily Smart Guide are tool-using, request-driven assistants; they do not monitor users continuously. Their recommendations use available student data and may fall back when AI is unavailable.
- **Server-enforced access control:** React guards improve navigation and UX, while the backend determines who can read student history and administrator data.
- **Text generation, not audio generation:** AI Learning Studio produces structured text; featured songs and other audio are independent media features.
- **Environment-specific configuration:** API keys stay on the server. Local development uses the allowed frontend origin and a separate backend process; production uses Render and MongoDB Atlas.

## Tests and checks

```cmd
node --test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

- `node --test`: unit tests covering selected UI models, state transformations, and service helpers.
- `typecheck`: strict checking of the `.ts`/`.tsx` portion of the codebase; **not** a complete JavaScript/JSX type audit.
- `test:e2e`: Playwright smoke tests using desktop and mobile Chromium configurations. Authenticated scenarios need optional `E2E_STUDENT_*`, `E2E_TEACHER_*`, and `E2E_ADMIN_*` credentials and are skipped when none are provided.
- `build`: production bundle validation; successful compilation does not replace browser/device testing.

See [`docs/E2E_TESTING.md`](docs/E2E_TESTING.md) for the browser-test setup.

## Deploying on Render

The client is configured for a **Render Static Site**:

| Setting | Value |
| --- | --- |
| Root directory | `react-final` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_URL=https://englishwise-api.onrender.com` |
| SPA rewrite | `/*` → `/index.html` (**Rewrite**) |

On the backend, allow `https://englishwise-web.onrender.com` through `CLIENT_ORIGINS`. A new frontend environment value requires a rebuild. If auto-deploy is enabled for `main`, a push starts a deployment; confirm the commit is marked **Live** before considering it published.

## Demo checklist

- [ ] Register/log in as a student and access the dashboard.
- [ ] Generate an AI text lesson, then find it in learning history.
- [ ] Open the coach, daily guide, brain map, weekly song, and tasks.
- [ ] Complete a sample course activity and review progress.
- [ ] Demonstrate teacher authoring and administrator learning history.
- [ ] Check layout at mobile and desktop widths, plus browser console/network errors.

## Limitations and notes

- Some AI capabilities require working backend provider credentials and may be subject to provider limits.
- Song/video playback depends on media availability and the user's network or content filters.
- Tests cover representative workflows; they do not certify every end-to-end role scenario.
- For backend setup, validation, persistence, and API details, see the [Backend README](https://github.com/chani-ra/final-node-project-2026#readme) and [OpenAPI specification](https://github.com/chani-ra/final-node-project-2026/blob/main/docs/openapi.yaml).
