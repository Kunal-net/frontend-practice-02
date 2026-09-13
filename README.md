# Daily Editorial Todo App

A full-stack Todo application featuring an editorial, high-craft workspace interface paired with a resilient FastAPI and SQLite backend.

## Overview

- **Frontend**: Built with Vite, modern semantic HTML, vanilla JavaScript, and CSS design tokens inspired by editorial typography and card-based layouts.
- **Backend**: Python FastAPI with SQLite persistence located in [`todo_backend/`](file:///Users/kunalsuryanshi/Documents/test%20frontends/frontend-lab-02/todo_backend), supporting task CRUD operations and soft-delete with undo restoration.

---

## Project Structure

```text
├── index.html               # Application entry HTML
├── src/
│   ├── main.js              # State management & UI interaction logic
│   └── styles.css           # Design tokens, typography & layout styling
├── public/                  # Static assets
├── todo_backend/            # FastAPI backend service
│   ├── main.py              # FastAPI endpoints & SQLite database logic
│   ├── requirements.txt     # Python dependencies
│   └── README.md            # Backend-specific documentation
├── todo_screenshots/        # UI screenshots & design reference
├── package.json             # Frontend dependencies & scripts
├── ARCHITECTURE.md          # Architecture & conventions
├── DESIGN.md                # Design system documentation
└── MEMORY.md                # Decision log
```

---

## Quick Start

### 1. Start the Backend API

From the root directory:

```bash
cd todo_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py
```

The API will start at `http://127.0.0.1:8000`.
- Interactive API documentation: `http://127.0.0.1:8000/docs`
- Health check: `http://127.0.0.1:8000/health`

### 2. Start the Frontend

In a separate terminal from the root directory:

```bash
npm install
npm run dev
```

The Vite dev server will run at `http://localhost:5173`.

---

## Available Scripts

### Frontend

- `npm run dev`: Starts the local Vite development server.
- `npm run build`: Compiles and bundles production-ready assets into `dist/`.
- `npm run preview`: Locally previews the production build.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health check |
| `GET` | `/api/tasks` | Fetch tasks (supports `completed` and `q` search query parameters) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/{task_id}` | Retrieve task by ID |
| `PATCH` | `/api/tasks/{task_id}` | Update task title, description, priority, or completion status |
| `DELETE` | `/api/tasks/{task_id}` | Soft-delete a task (supports restoration) |
| `POST` | `/api/tasks/{task_id}/restore` | Restore a previously deleted task |

---

## License

Private / Experimental workspace.




Used no skills at all 
prompting - ChatGPT
design - stitch 
agents - antigravity 