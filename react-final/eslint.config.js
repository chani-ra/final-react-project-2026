import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Do not lint local one-off migration scripts or generated browser artifacts.
  // These files remain available for future use; they are not deleted.
  globalIgnores(['dist', 'test-results', 'playwright-report', 'refactor-*.cjs', 'englishwise_*.cjs', 'upgrade-navbar-dashboard.cjs']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // Playwright specs and build configuration run in Node.js, not in the browser.
  {
    files: ['e2e/**/*.{js,jsx}', 'playwright.config.js', 'vite.config.js', 'postcss.config.js', 'tailwind.config.js'],
    languageOptions: { globals: globals.node },
  },
])
