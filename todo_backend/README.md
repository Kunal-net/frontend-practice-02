# Daily Todo API

FastAPI backend for the Daily editorial Todo workspace generated from the Stitch design.

## Run

```bash
cd /path/to/rewritten_todo_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py
```

The API runs at `http://127.0.0.1:8000`.
Interactive docs: `http://127.0.0.1:8000/docs`

## Configuration

Optional environment variables:

```bash
export DATABASE_PATH="./todo.db"
export CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

## Endpoints

- `GET /health`
- `GET /api/tasks?completed=false&q=design`
- `POST /api/tasks`
- `GET /api/tasks/{task_id}`
- `PATCH /api/tasks/{task_id}`
- `DELETE /api/tasks/{task_id}`

## Task model

```json
{
  "id": 1,
  "title": "Build the task list",
  "description": "Practice loading and rendering data.",
  "priority": "high",
  "completed": false
}
```

The backend intentionally keeps the original task contract used by the frontend. The UI's totals, completed count, and remaining count can be calculated from the task list; no fake statistics or unsupported fields are required.

### Undo deletion

Deletion is implemented as a soft delete so the UI can show an Undo toast:

- `DELETE /api/tasks/{task_id}` — hides the task from normal task lists
- `POST /api/tasks/{task_id}/restore` — restores a recently deleted task

The response shape remains unchanged for normal task operations.
