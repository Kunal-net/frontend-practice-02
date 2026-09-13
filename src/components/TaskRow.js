/**
 * TaskRow Component
 */
export function renderTaskRow(task, isCompletedView = false) {
  const isChecked = task.completed;
  const priority = task.priority || 'medium';

  return `
    <article
      class="task-row ${isChecked ? 'completed' : ''}"
      data-task-id="${task.id}"
      tabindex="0"
      role="button"
      aria-label="Task: ${escapeHtml(task.title)}, priority: ${priority}, status: ${isChecked ? 'completed' : 'pending'}"
    >
      <div class="task-row-left">
        <button
          type="button"
          class="custom-checkbox ${isChecked ? 'checked' : ''}"
          data-action="toggle-complete"
          data-task-id="${task.id}"
          aria-label="${isChecked ? 'Mark incomplete' : 'Mark complete'}"
          title="${isChecked ? 'Mark incomplete' : 'Mark complete'}"
        >
          ${
            isChecked
              ? '<span class="material-symbols-outlined">check</span>'
              : ''
          }
        </button>

        <div class="task-text-group">
          <div class="task-title-line">
            <span class="task-title">${escapeHtml(task.title)}</span>
            <span class="priority-badge ${priority}">
              ${priority}
            </span>
          </div>
          ${
            task.description
              ? `<p class="task-description">${escapeHtml(task.description)}</p>`
              : ''
          }
        </div>
      </div>

      <div class="task-row-right">
        ${
          isCompletedView
            ? `
          <button
            type="button"
            class="btn-restore-task"
            data-action="restore-task"
            data-task-id="${task.id}"
            title="Restore task to active list"
          >
            <span class="material-symbols-outlined" style="font-size: 15px;">restore</span>
            <span>Restore</span>
          </button>
        `
            : ''
        }
        <span class="task-id-badge">#${task.id}</span>
        <div class="task-actions">
          <button
            type="button"
            class="btn-icon-action"
            data-action="edit-task"
            data-task-id="${task.id}"
            title="Edit task"
            aria-label="Edit task #${task.id}"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">edit</span>
          </button>
          <button
            type="button"
            class="btn-icon-action danger"
            data-action="delete-task"
            data-task-id="${task.id}"
            title="Delete task"
            aria-label="Delete task #${task.id}"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
