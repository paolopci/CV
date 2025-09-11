# Repository Guidelines

## Project Structure & Module Organization
- `index.html`: Main entry point for the CV site.
- `css/`: Stylesheets (primary file: `index.css`).
- `images/`: Image assets (e.g., profile photo).
- `courses.json`: Dynamic data for courses/training; keep schema stable.
- `favicon.ico`: Site icon.
- `cv-paolo-paci.pdf`: Downloadable CV.
- `firma.html`, `firma_paolopci.html`, `firma_email/`: Email signature templates.

## Build, Test, and Development Commands
- Serve locally: `python -m http.server 8080` then open `http://localhost:8080`.
- Quick HTML check: use the W3C validator (upload or URL).
- Optional lint (if Node is available): `npx html-validate .` and `npx stylelint "css/**/*.css"`.

## Coding Style & Naming Conventions
- Indentation: 4 spaces for HTML/CSS; wrap lines at ~100 chars.
- HTML: semantic tags (`header`, `main`, `section`), lowercase attributes, double quotes.
- CSS: hyphenated, lowercase class names (e.g., `hero-header`, `presentation-letter`); avoid inline styles.
- Assets: optimize images (≤200KB when possible); use relative paths.
- JSON (`courses.json`): valid UTF-8, double quotes, stable keys; trailing commas not allowed.

## Testing Guidelines
- Manual checks: load in Chrome/Firefox, verify mobile/desktop responsiveness and hover/animation behavior.
- Links: verify external links and PDF download work.
- Data: after changing `courses.json`, reload and check console for JSON parse errors.
- Accessibility: ensure headings are hierarchical and images have meaningful `alt` text.

## Commit & Pull Request Guidelines
- Commit style observed: short, action-oriented messages (often Italian), no conventional prefix. Examples: `fix pulsante doppio LinkedIn`, `add firma in html per email`, `add miglioramento seo`.
- Prefer present tense and a clear subject; group related changes per commit.
- Branching: open a feature branch from `main`; keep diffs focused.
- PRs must include: concise description, screenshots/GIFs for UI changes, rationale for data/SEO edits, and references to issues (if any).
- Before requesting review: run local server, test on mobile viewport, spell-check visible text.

## Security & Maintenance Tips
- Do not commit secrets or tokens; this is a public static site.
- When updating CV date or details, update all references consistently across HTML and PDF.
- Keep file names stable to avoid broken links; if renaming, update all references.

