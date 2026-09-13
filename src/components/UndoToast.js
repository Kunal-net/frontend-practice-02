/**
 * UndoToast Component
 */
import { state, undoDelete, dismissToast } from '../state.js';

export function renderUndoToast() {
  const { visible, task, secondsLeft, restoring } = state.undoToast;
  if (!visible || !task) {
    return '<div id="undo-toast-wrap" class="undo-toast" aria-live="polite"></div>';
  }

  return `
    <aside
      id="undo-toast-wrap"
      class="undo-toast visible"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="toast-top-row">
        <div class="toast-left">
          <div class="toast-icon-wrap" aria-hidden="true">
            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
          </div>
          <div class="toast-text-group">
            <div class="toast-title">
              <span>Task record deleted</span>
              <span class="toast-id">#${task.id}</span>
            </div>
            <span class="toast-quote">“${escapeHtml(task.title)}”</span>
          </div>
        </div>

        <div class="toast-actions">
          <button
            id="btn-toast-undo"
            type="button"
            class="btn-toast-undo"
            ${restoring ? 'disabled style="opacity: 0.6;"' : ''}
          >
            <span class="material-symbols-outlined" style="font-size: 14px;">undo</span>
            <span>${restoring ? 'Restoring...' : 'Undo'}</span>
            <span class="toast-timer">${secondsLeft}s</span>
          </button>
          <button
            id="btn-toast-dismiss"
            type="button"
            class="btn-icon-action"
            title="Dismiss notification"
            aria-label="Dismiss notification"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
          </button>
        </div>
      </div>

      <div class="toast-bottom-row">
        <span class="toast-api-status">
          <span style="width: 5px; height: 5px; border-radius: 50%; background-color: var(--success);"></span>
          DELETE /api/tasks/${task.id} · 200 OK
        </span>
        <span class="toast-cache-status">LOCAL CACHE SYNCED</span>
      </div>
    </aside>
  `;
}

export function bindUndoToastEvents(container) {
  const btnUndo = container.querySelector('#btn-toast-undo');
  const btnDismiss = container.querySelector('#btn-toast-dismiss');

  if (btnUndo) btnUndo.addEventListener('click', undoDelete);
  if (btnDismiss) btnDismiss.addEventListener('click', dismissToast);
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
