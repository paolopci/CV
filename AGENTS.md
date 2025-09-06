# Repository Guidelines

This repository hosts a static CV website (HTML/CSS/JavaScript) served via a simple static host or GitHub Pages. Use this guide to contribute safely and consistently.

## Project Structure & Module Organization
- `index.html`: main page with markup and inline scripts (e.g., dynamic date, theme toggle, course loader).
- `css/index.css`: site styles and animations.
- `courses.json`: data source for the Courses section.
- `images/`: static assets (profile image).
- `.github/workflows/static.yml`: CI for static hosting.

## Build, Test, and Development Commands
- Run locally (Python): `python -m http.server 8080` then open `http://localhost:8080/`.
- Open directly: double‑click `index.html` (some features may require HTTP to load JSON).
- Validate JSON: `jq . courses.json` (optional, if available).

## Coding Style & Naming Conventions
- Indentation: 4 spaces in HTML/CSS/JS; keep lines readable (<120 chars).
- Naming: use kebab‑case for CSS classes/IDs; descriptive, short names for JS variables.
- CSS: prefer utility‑like, composable classes; avoid inline styles.
- JS: keep scripts near the end of `index.html`; avoid global leaks; prefer `DOMContentLoaded`.

## Testing Guidelines
- Manual checks: verify layout, animations, and dark theme toggle on desktop and mobile sizes.
- Data loading: ensure `courses.json` loads over HTTP; test broken JSON gracefully.
- Accessibility: check contrast, semantic headings, and focus states.

## Commit & Pull Request Guidelines
- Commits: present‑tense, concise summary (e.g., "Add date with day in header").
- Scope: one logical change per commit; include a brief rationale when altering UI/UX.
- PRs: describe changes, screenshots or GIFs for visual updates, steps to validate locally, and note any content edits to `courses.json`.

## Security & Configuration Tips
- Do not include secrets; this site is public.
- Keep third‑party links minimal; host assets locally when possible.
- Validate user‑visible content to avoid broken characters/encoding; use UTF‑8.

