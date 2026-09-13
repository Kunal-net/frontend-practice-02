/**
 * Task Detail & Edit Drawer Component
 */
import {
  state,
  closeDrawer,
  saveDrawerTask,
  openDeleteModal,
} from '../state.js';

export function renderDrawer() {
  const { open, mode, task, saving, error } = state.drawer;
  if (!open || !task) {
    return `
      <div id="drawer-backdrop" class="drawer-backdrop"></div>
      <aside id="task-drawer" class="task-drawer" role="dialog" aria-hidden="true"></aside>
    `;
  }

  const isEdit = mode === 'edit';
  const taskId = task.id;
  const isCompleted = Boolean(task.completed);
  const priority = task.priority || 'medium';
  const title = task.title || '';
  const description = task.description || '';

  return `
    <div id="drawer-backdrop" class="drawer-backdrop open"></div>
    <aside
      id="task-drawer"
      class="task-drawer open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-eyebrow"
    >
      <div class="drawer-header">
        <div class="drawer-title-group">
          <span style="width: 7px; height: 7px; border-radius: 50%; background-color: var(--accent);"></span>
          <span id="drawer-eyebrow" class="drawer-eyebrow">
            ${isEdit ? `RECORD // TASK #${taskId}` : 'NEW RECORD // DRAFT'}
          </span>
          <span class="drawer-status-tag">
            ${isCompleted ? 'COMPLETED' : 'ACTIVE'}
          </span>
        </div>

        <div class="drawer-actions">
          ${
            isEdit
              ? `
            <button
              id="btn-drawer-delete-header"
              type="button"
              class="btn-icon-action danger"
              title="Delete task record"
              aria-label="Delete task"
            >
              <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
            </button>
          `
              : ''
          }
          <button
            id="btn-close-drawer"
            type="button"
            class="btn-icon-action"
            title="Close drawer (Esc)"
            aria-label="Close drawer"
          >
            <span style="font-family: var(--font-mono); font-size: 0.6875rem; margin-right: 0.25rem;">ESC</span>
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
          </button>
        </div>
      </div>

      <div class="drawer-body">
        ${
          error
            ? `
          <div style="background-color: var(--danger-surface); border: 1px solid rgba(255, 117, 109, 0.3); color: var(--danger); font-size: 0.8125rem; padding: 0.75rem 1rem; border-radius: 6px;">
            ${escapeHtml(error)}
          </div>
        `
            : ''
        }

        <!-- Completion Toggle Banner -->
        <div id="drawer-completed-card" class="drawer-banner-toggle">
          <div class="toggle-left">
            <div
              id="drawer-checkbox"
              class="custom-checkbox ${isCompleted ? 'checked' : ''}"
              role="checkbox"
              aria-checked="${isCompleted}"
              tabindex="0"
            >
              ${
                isCompleted
                  ? '<span class="material-symbols-outlined">check</span>'
                  : ''
              }
            </div>
            <div class="toggle-texts">
              <span class="toggle-title ${isCompleted ? 'line-through text-muted' : ''}">
                ${isCompleted ? 'Completed' : 'Mark as completed'}
              </span>
              <span class="toggle-sub">Resolves this item in local database storage</span>
            </div>
          </div>
          <span class="toggle-badge">${isCompleted ? 'resolved' : 'pending'}</span>
        </div>

        <!-- Title Section -->
        <div class="form-group">
          <div class="form-label-row">
            <label for="drawer-input-title" class="form-label">Title specification</label>
            <span id="title-char-counter" class="form-counter">${title.length} / 200</span>
          </div>
          <input
            id="drawer-input-title"
            class="form-input-title"
            type="text"
            maxlength="200"
            placeholder="Give the next important thing a name..."
            value="${escapeHtml(title)}"
            required
            autocomplete="off"
          />
        </div>

        <!-- Priority Selector -->
        <div class="form-group">
          <label class="form-label">Execution priority</label>
          <div class="priority-selector" role="radiogroup" aria-label="Task Priority">
            <button
              type="button"
              class="btn-priority-choice ${priority === 'low' ? 'active low' : ''}"
              data-priority="low"
              role="radio"
              aria-checked="${priority === 'low'}"
            >
              <span>Low</span>
            </button>
            <button
              type="button"
              class="btn-priority-choice ${priority === 'medium' ? 'active medium' : ''}"
              data-priority="medium"
              role="radio"
              aria-checked="${priority === 'medium'}"
            >
              <span>Medium</span>
            </button>
            <button
              type="button"
              class="btn-priority-choice ${priority === 'high' ? 'active high' : ''}"
              data-priority="high"
              role="radio"
              aria-checked="${priority === 'high'}"
            >
              <span style="width: 5px; height: 5px; border-radius: 50%; background-color: var(--danger);"></span>
              <span>High</span>
            </button>
          </div>
        </div>

        <!-- Context & Details (Description) -->
        <div class="form-group">
          <div class="form-label-row">
            <label for="drawer-input-desc" class="form-label">Field context &amp; details</label>
            <span class="form-counter">Markdown enabled</span>
          </div>
          <textarea
            id="drawer-input-desc"
            class="form-textarea"
            maxlength="2000"
            placeholder="Document notes, specs, context, or execution details..."
          >${escapeHtml(description)}</textarea>
        </div>

        <!-- Telemetry Card -->
        <div class="telemetry-box">
          <div class="telemetry-row">
            <span>Target endpoint:</span>
            <span class="telemetry-val">
              ${isEdit ? `PATCH /api/tasks/${taskId}` : 'POST /api/tasks'}
            </span>
          </div>
          <div class="telemetry-row">
            <span>Runtime telemetry:</span>
            <span class="telemetry-val" style="color: var(--success); display: flex; align-items: center; gap: 0.3rem;">
              <span style="width: 5px; height: 5px; border-radius: 50%; background-color: var(--success);"></span> In sync (0ms pending)
            </span>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        ${
          isEdit
            ? `
          <button id="btn-drawer-delete" type="button" class="btn-danger-ghost">
            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
            <span>Delete record</span>
          </button>
        `
            : '<div></div>'
        }

        <div class="drawer-footer-right">
          <button id="btn-drawer-discard" type="button" class="btn-ghost">
            Discard
          </button>
          <button
            id="btn-drawer-save"
            type="button"
            class="btn-primary-action"
            ${saving ? 'disabled style="opacity: 0.6;"' : ''}
          >
            <span>${saving ? 'Saving...' : isEdit ? 'Save changes ⌘S' : 'Create task'}</span>
          </button>
        </div>
      </div>
    </aside>
  `;
}

export function bindDrawerEvents(container) {
  const backdrop = container.querySelector('#drawer-backdrop');
  const btnClose = container.querySelector('#btn-close-drawer');
  const btnDiscard = container.querySelector('#btn-drawer-discard');
  const btnSave = container.querySelector('#btn-drawer-save');
  const btnDelete = container.querySelector('#btn-drawer-delete');
  const btnDeleteHeader = container.querySelector('#btn-drawer-delete-header');
  const completedCard = container.querySelector('#drawer-completed-card');
  const titleInput = container.querySelector('#drawer-input-title');
  const charCounter = container.querySelector('#title-char-counter');
  const descInput = container.querySelector('#drawer-input-desc');
  const priorityBtns = container.querySelectorAll('.btn-priority-choice');

  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  if (btnClose) btnClose.addEventListener('click', closeDrawer);
  if (btnDiscard) btnDiscard.addEventListener('click', closeDrawer);

  let currentPriority = state.drawer.task ? state.drawer.task.priority || 'medium' : 'medium';
  let currentCompleted = state.drawer.task ? Boolean(state.drawer.task.completed) : false;

  if (titleInput && charCounter) {
    titleInput.addEventListener('input', (e) => {
      charCounter.textContent = `${e.target.value.length} / 200`;
    });
  }

  if (completedCard) {
    completedCard.addEventListener('click', () => {
      currentCompleted = !currentCompleted;
      const checkbox = completedCard.querySelector('#drawer-checkbox');
      const titleSpan = completedCard.querySelector('.toggle-title');
      const badgeSpan = completedCard.querySelector('.toggle-badge');

      if (currentCompleted) {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '<span class="material-symbols-outlined">check</span>';
        titleSpan.textContent = 'Completed';
        titleSpan.classList.add('line-through', 'text-muted');
        badgeSpan.textContent = 'resolved';
      } else {
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
        titleSpan.textContent = 'Mark as completed';
        titleSpan.classList.remove('line-through', 'text-muted');
        badgeSpan.textContent = 'pending';
      }
    });
  }

  priorityBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentPriority = btn.getAttribute('data-priority');
      priorityBtns.forEach((b) => {
        const p = b.getAttribute('data-priority');
        b.className = `btn-priority-choice ${p === currentPriority ? `active ${p}` : ''}`;
      });
    });
  });

  function handleSave() {
    const title = titleInput ? titleInput.value.trim() : '';
    if (!title) {
      if (titleInput) {
        titleInput.focus();
        titleInput.style.borderColor = 'var(--danger)';
      }
      return;
    }

    const payload = {
      title,
      description: descInput ? descInput.value.trim() : '',
      priority: currentPriority,
    };

    if (state.drawer.mode === 'edit') {
      payload.completed = currentCompleted;
    }

    saveDrawerTask(payload);
  }

  if (btnSave) {
    btnSave.addEventListener('click', handleSave);
  }

  if (btnDelete) {
    btnDelete.addEventListener('click', () => {
      if (state.drawer.task) openDeleteModal(state.drawer.task);
    });
  }

  if (btnDeleteHeader) {
    btnDeleteHeader.addEventListener('click', () => {
      if (state.drawer.task) openDeleteModal(state.drawer.task);
    });
  }
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
