# Architecture

## Intent

Build one focused frontend experiment at a time. Keep the implementation small, accessible, and easy to replace.

## Layout

- `index.html` — application entry document
- `src/main.js` — behavior and UI composition
- `src/styles.css` — design tokens and styles
- `public/` — static assets served unchanged
- `todo_backend/main.py` — FastAPI Todo API with SQLite persistence
- `todo_backend/requirements.txt` — backend Python dependencies

## Conventions

- Prefer semantic HTML and native browser features.
- Keep shared values as CSS custom properties.
- Add dependencies only when the experiment genuinely needs them.
- Record non-obvious decisions in `MEMORY.md`.
- Keep API routes under `/api` and use `/health` for a simple availability check.
