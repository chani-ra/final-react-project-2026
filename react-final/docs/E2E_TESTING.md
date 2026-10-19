# EnglishWise browser smoke testing

Tests in `e2e/smoke.spec.js` exercise the *rendered app* in desktop Chromium and
mobile Chromium. They **do not write to MongoDB or make paid AI requests**.

## One-time setup (Windows CMD, from `react-final`)

```cmd
npm install --save-dev @playwright/test
```

Tests use the locally installed **Google Chrome** on Windows, including mobile
emulation, so there is no need to download a separate Chromium browser.

This updates `package.json` and `package-lock.json`. Review and commit those
changes along with the test files after verification.

## Run locally

```cmd
npm run test:e2e
```

Playwright starts Vite at `http://127.0.0.1:5173`. The browser uses the app's
normal `VITE_API_URL` configuration. Basic guest tests do not require credentials.

## Read-only smoke tests against deployed Render frontend

```cmd
set "E2E_BASE_URL=https://englishwise-web.onrender.com"
npm run test:e2e
set "E2E_BASE_URL="
```

These checks are limited to public pages, redirects and (if explicitly supplied)
read-only role navigation. They don't constitute a full production end-to-end test.

## Optional role checks (test accounts only)

Use separately provisioned test accounts. Set only the credentials for roles
you intend to test. For example:

```cmd
set "E2E_STUDENT_EMAIL=your-test-student@example.com"
set "E2E_STUDENT_PASSWORD=replace-with-test-password"
npm run test:e2e
set "E2E_STUDENT_EMAIL="
set "E2E_STUDENT_PASSWORD="
```

Teacher credentials use `E2E_TEACHER_EMAIL` / `E2E_TEACHER_PASSWORD`;
admin credentials use `E2E_ADMIN_EMAIL` / `E2E_ADMIN_PASSWORD`.
Never commit credentials or screenshots containing sensitive user data.
Optional tests are skipped if credentials are not set, and do not create lessons,
quizzes, new accounts or messages.

## What these tests do NOT yet establish

- Registration creates a personalized course and progress document.
- Creating an AI lesson stores history, including error and quota scenarios.
- Quiz scores originate in the backend and update progress correctly.
- A student's data is invisible to another student and to an unrelated teacher.
- Chat or essay assessment provider failures are handled end-to-end.

Those flows require a **dedicated test database** and fixtures or test accounts.
Do not test them by creating/deleting records in production. Expand E2E coverage
incrementally once the test environment and fixtures are prepared.
