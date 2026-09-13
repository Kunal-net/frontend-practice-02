/**
 * Delete Confirmation Modal Component
 */
import { state, closeDeleteModal, confirmDelete } from '../state.js';

export function renderDeleteModal() {
  const { open, task, deleting } = state.deleteModal;
  if (!open || !task) {
    return '<div id="delete-modal-backdrop" class="modal-backdrop"></div>';
  }

  const priority = task.priority || 'medium';

  return `
    <div id="delete-modal-backdrop" class="modal-backdrop open">
      <div
        class="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
      >
        <div class="modal-header">
          <div class="modal-badge-destructive">
            <span class="pulse-dot"></span>
            <span>DESTRUCTIVE ACTION // RECORD #${task.id}</span>
          </div>
          <button
            id="btn-close-modal"
            type="button"
            class="btn-icon-action"
            title="Close modal (Esc)"
            aria-label="Close modal"
          >
            <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
          </button>
        </div>

        <div>
          <h2 id="modal-title" class="modal-title">Permanently delete this task?</h2>
          <p id="modal-desc" class="modal-desc" style="margin-top: 0.35rem;">
            This will remove the record from your local database and purge all associated telemetry. This action cannot be undone.
          </p>
        </div>

        <div class="modal-target-box">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem;">
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.625rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; display: block; margin-bottom: 0.2rem;">
                TARGET RECORD
              </span>
              <p class="modal-target-title">${escapeHtml(task.title)}</p>
            </div>
            <span class="priority-badge ${priority}" style="background-color: var(--danger-surface); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255, 117, 109, 0.3);">
              ${priority} priority
            </span>
          </div>
          <div class="modal-endpoint-line">
            <span>Endpoint call:</span>
            <span style="color: var(--primary);">DELETE /api/tasks/${task.id}</span>
          </div>
        </div>

        <div class="modal-footer">
          <span class="modal-keys-help">
            <kbd class="kbd-badge">Esc</kbd> dismiss · <kbd class="kbd-badge">↵ Enter</kbd> purge
          </span>
          <div class="modal-actions">
            <button id="btn-cancel-modal" type="button" class="btn-ghost">
              Cancel
            </button>
            <button
              id="btn-confirm-delete"
              type="button"
              class="btn-danger-confirm"
              ${deleting ? 'disabled style="opacity: 0.6;"' : ''}
            >
              <span class="material-symbols-outlined" style="font-size: 16px;">delete_forever</span>
              <span>${deleting ? 'Purging record...' : 'Delete permanently'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindDeleteModalEvents(container) {
  const backdrop = container.querySelector('#delete-modal-backdrop');
  const btnClose = container.querySelector('#btn-close-modal');
  const btnCancel = container.querySelector('#btn-cancel-modal');
  const btnConfirm = container.querySelector('#btn-confirm-delete');

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDeleteModal();
    });
  }
  if (btnClose) btnClose.addEventListener('click', closeDeleteModal);
  if (btnCancel) btnCancel.addEventListener('click', closeDeleteModal);
  if (btnConfirm) btnConfirm.addEventListener('click', confirmDelete);
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
