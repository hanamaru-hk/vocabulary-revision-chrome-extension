# Word Notebook Chrome Extension

## Tech Stack

- **Project**: Turborepo (npm workspaces)
- **Popup**: Vite + React + Mantine UI + React Router
- **Background**: Vite + TypeScript
- **i18n**: react-i18next (English, Traditional Chinese)

## Project Structure

- `apps/popup` — Popup UI (React SPA with routing)
  - `src/pages/Welcome.tsx` — First-run onboarding page (language select + confirm)
  - `src/pages/Vocabulary.tsx` — Vocabulary list page
  - `src/pages/Settings.tsx` — Settings page (language, new tab, reset config)
- `apps/background` — Background service worker (right-click context menu)
- `apps/manifest` — Chrome extension manifest, icons, and static assets
- `packages/config` — Chrome storage config (`getConfig`, `setConfig`, `defaultConfig`)
- `packages/database` — IndexedDB wrapper for vocabulary CRUD (`addVocabulary`, `getAllVocabularies`, etc.)
- `packages/i18n` — i18next setup + locale JSON files (`locales/en.json`, `locales/zh-hk.json`)

## Key Scripts

```bash
npm run dev            # Start all apps in dev mode (via Turbo)
npm run build          # Build all apps
npm run build:extension # Bundle into a Chrome extension (scripts/bundle-extension.js)
npm run lint           # Lint all packages
npm run format         # Prettier format
```

## Config Schema

Stored in `chrome.storage.local` via `@repo/config`:

| Field       | Type    | Default       | Description                        |
|-------------|---------|---------------|------------------------------------|
| `llm`       | string  | `perplexity`  | LLM provider for word lookup       |
| `language`  | string  | `en`          | UI language (`en` or `zh-HK`)      |
| `newTab`    | boolean | `true`        | Open result in new tab             |
| `firstTime` | boolean | `true`        | Whether to show the Welcome page   |

## Routing (Popup)

| Path          | Page        | Notes                          |
|---------------|-------------|--------------------------------|
| `/`           | App.tsx     | Redirects based on `firstTime` |
| `/welcome`    | Welcome     | First-run onboarding           |
| `/vocabulary` | Vocabulary  | Main vocabulary list           |
| `/settings`   | Settings    | App settings                   |