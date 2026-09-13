from __future__ import annotations

import os
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Annotated, Literal

from fastapi import FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field, field_validator

Priority = Literal["low", "medium", "high"]

BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "todo.db")).expanduser()


def _cors_origins() -> list[str]:
    configured = os.getenv("CORS_ORIGINS")
    if configured:
        return [origin.strip() for origin in configured.split(",") if origin.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(default="", max_length=2_000)
    priority: Priority = "medium"

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title cannot be blank")
        return value


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, max_length=2_000)
    priority: Priority | None = None
    completed: bool | None = None

    @field_validator("title")
    @classmethod
    def updated_title_must_not_be_blank(cls, value: str | None) -> str | None:
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("Title cannot be blank")
        return value


class Task(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    priority: Priority
    completed: bool


class HealthResponse(BaseModel):
    status: Literal["ok"]
    database: Literal["ok"]


def connection() -> sqlite3.Connection:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(DATABASE_PATH, timeout=10)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON")
    return db


def setup_database() -> None:
    with connection() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL CHECK(length(trim(title)) > 0),
                description TEXT NOT NULL DEFAULT '',
                priority TEXT NOT NULL DEFAULT 'medium'
                    CHECK(priority IN ('low', 'medium', 'high')),
                completed INTEGER NOT NULL DEFAULT 0
                    CHECK(completed IN (0, 1)),
                deleted_at TEXT DEFAULT NULL
            )
            """
        )
        # Lightweight migration for databases created by the original Todo API.
        columns = {row[1] for row in db.execute("PRAGMA table_info(tasks)").fetchall()}
        if "deleted_at" not in columns:
            db.execute("ALTER TABLE tasks ADD COLUMN deleted_at TEXT DEFAULT NULL")
        db.execute(
            "CREATE INDEX IF NOT EXISTS idx_tasks_completed_id "
            "ON tasks (completed, id DESC)"
        )


def task_from_row(row: sqlite3.Row) -> Task:
    return Task(
        id=row["id"],
        title=row["title"],
        description=row["description"],
        priority=row["priority"],
        completed=bool(row["completed"]),
    )


def get_task_or_404(task_id: int) -> Task:
    with connection() as db:
        row = db.execute(
            "SELECT id, title, description, priority, completed "
            "FROM tasks WHERE id = ? AND deleted_at IS NULL",
            (task_id,),
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_from_row(row)


@asynccontextmanager
async def lifespan(_: FastAPI):
    setup_database()
    yield


app = FastAPI(
    title="Daily Todo API",
    description="A small, reliable API for the Daily editorial Todo workspace.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins(),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    try:
        with connection() as db:
            db.execute("SELECT 1").fetchone()
    except sqlite3.Error as exc:
        raise HTTPException(status_code=503, detail="Database unavailable") from exc
    return HealthResponse(status="ok", database="ok")


@app.get("/api/tasks", response_model=list[Task])
def list_tasks(
    completed: bool | None = None,
    q: Annotated[str | None, Query(max_length=200)] = None,
) -> list[Task]:
    clauses: list[str] = []
    values: list[object] = []

    if completed is not None:
        clauses.append("completed = ?")
        values.append(int(completed))

    search = q.strip() if q else ""
    if search:
        clauses.append("(title LIKE ? OR description LIKE ?)")
        search_term = f"%{search}%"
        values.extend([search_term, search_term])

    clauses.append("deleted_at IS NULL")
    where = f" WHERE {' AND '.join(clauses)}"
    query = (
        "SELECT id, title, description, priority, completed "
        f"FROM tasks{where} ORDER BY completed ASC, id DESC"
    )

    with connection() as db:
        rows = db.execute(query, values).fetchall()
    return [task_from_row(row) for row in rows]


@app.post("/api/tasks", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate) -> Task:
    with connection() as db:
        cursor = db.execute(
            "INSERT INTO tasks (title, description, priority) VALUES (?, ?, ?)",
            (payload.title, payload.description, payload.priority),
        )
        task_id = cursor.lastrowid

    if task_id is None:
        raise HTTPException(status_code=500, detail="Task could not be created")
    return get_task_or_404(int(task_id))


@app.get("/api/tasks/{task_id}", response_model=Task)
def get_task(task_id: int) -> Task:
    return get_task_or_404(task_id)


@app.patch("/api/tasks/{task_id}", response_model=Task)
def update_task(task_id: int, payload: TaskUpdate) -> Task:
    existing = get_task_or_404(task_id)
    changes = payload.model_dump(exclude_unset=True)

    if not changes:
        return existing

    allowed_columns = {"title", "description", "priority", "completed"}
    changes = {key: value for key, value in changes.items() if key in allowed_columns}
    assignments = ", ".join(f"{column} = ?" for column in changes)
    values = [
        int(value) if column == "completed" else value
        for column, value in changes.items()
    ]

    try:
        with connection() as db:
            db.execute(
                f"UPDATE tasks SET {assignments} WHERE id = ?",
                [*values, task_id],
            )
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=422, detail="Invalid task data") from exc

    return get_task_or_404(task_id)


@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int) -> Response:
    get_task_or_404(task_id)
    with connection() as db:
        db.execute(
            "UPDATE tasks SET deleted_at = datetime('now') "
            "WHERE id = ? AND deleted_at IS NULL",
            (task_id,),
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.post("/api/tasks/{task_id}/restore", response_model=Task)
def restore_task(task_id: int) -> Task:
    with connection() as db:
        row = db.execute(
            "SELECT id FROM tasks WHERE id = ? AND deleted_at IS NOT NULL",
            (task_id,),
        ).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Deleted task not found")
        db.execute("UPDATE tasks SET deleted_at = NULL WHERE id = ?", (task_id,))
    return get_task_or_404(task_id)
