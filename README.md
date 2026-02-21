# Word Notebook Chrome Extension

A Chrome extension that helps you build vocabulary by recording words and the URLs where you first encountered them — because context is key to remembering new words.

## Installation

You can install it from the google chrome web store. [Install Here](https://chromewebstore.google.com/detail/hanamaru-word-notebook/nimpjcegmngkomfolepcmcngndjomanl)

## Features

- **Right-click to save** — Highlight any word on a webpage and right-click to save it along with the page URL
- **Vocabulary list** — Browse all saved words with their source links and timestamps
- **First-run onboarding** — Language selection on first launch
- **Settings** — Configure language, new-tab behaviour, and reset to defaults
- **Bilingual UI** — English and Traditional Chinese (繁體中文)

## Tech Stack

- **Monorepo**: Turborepo + npm workspaces
- **Popup**: Vite + React + Mantine UI + React Router + react-i18next
- **Background**: Vite + TypeScript (Chrome service worker)
- **Storage**: `chrome.storage.local` (config) + IndexedDB (vocabulary)

## Getting Started

```bash
# Install dependencies
npm install

# Development (all apps)
npm run dev

# Build all apps
npm run build

# Package as Chrome extension
npm run build:extension
```

Then load the `dist/` folder as an unpacked extension in `chrome://extensions`.

## Project Structure

```
apps/
  popup/       # React popup UI
  background/  # Service worker (context menu)
  manifest/    # manifest.json, icons, assets
packages/
  config/      # Chrome storage config helpers
  database/    # IndexedDB vocabulary CRUD
  i18n/        # i18next setup + locale files
```

## Reference


Inspired by [vocabulary-revision-lite](https://github.com/pakyinwww/vocabulary-revision-lite) which was written by the main developer of this repo long time ago.

## License

[License](./LICENSE)