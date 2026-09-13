/**
 * ErrorState Component (API Outage State)
 */
import { loadTasks } from '../state.js';

export function renderErrorState(errorMessage) {
  return `
    <section class="error-state-section" aria-label="API Connection Error">
      <div class="empty-workspace-card" style="border-color: rgba(255, 117, 109, 0.3); background-color: rgba(20, 20, 18, 0.95);">
        <div style="width: 4rem; height: 4rem; border-radius: 50%; background-color: var(--danger-surface); color: var(--danger); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
          <span class="material-symbols-outlined" style="font-size: 28px;">wifi_off</span>
        </div>

        <span class="empty-eyebrow" style="color: var(--danger);">HTTP 503 / SOCKET DOWN</span>
        <h2 class="empty-title">We couldn't connect to the local API.</h2>
        <p class="empty-desc">
          ${
            errorMessage ||
            'Failed to fetch from http://127.0.0.1:8000/api/tasks. Please check that the FastAPI server is running with the proper reload flag.'
          }
        </p>

        <div style="width: 100%; max-width: 28rem; background-color: var(--surface-container-lowest); border: 1px solid var(--border-editorial); border-radius: 6px; padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; font-family: var(--font-mono); font-size: 0.8125rem; color: var(--secondary);">
          <span style="user-select: all;">$ uvicorn main:app --reload --port 8000</span>
          <button id="btn-copy-command" type="button" class="btn-icon-action" title="Copy command">
            <span class="material-symbols-outlined" style="font-size: 16px;">content_copy</span>
          </button>
        </div>

        <div class="empty-actions">
          <button id="btn-retry-connection" class="btn-primary-action" type="button">
            <span class="material-symbols-outlined" style="font-size: 16px;">refresh</span>
            <span>Retry connection</span>
          </button>
        </div>
      </div>
    </section>
  `;
}

export function bindErrorStateEvents(container) {
  const btnRetry = container.querySelector('#btn-retry-connection');
  const btnCopy = container.querySelector('#btn-copy-command');

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      loadTasks();
    });
  }

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText('uvicorn main:app --reload --port 8000');
      const icon = btnCopy.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.textContent = 'check';
        setTimeout(() => {
          icon.textContent = 'content_copy';
        }, 1500);
      }
    });
  }
}
