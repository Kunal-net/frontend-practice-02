/**
 * Developer State Switcher Component
 * Reproduces the preview switcher bar present in the Stitch designs
 */
import {
  state,
  setDevMode,
  openCreateDrawer,
  openEditDrawer,
  openDeleteModal,
  showUndoToast,
} from '../state.js';

export function renderDevSwitcher() {
  const current = state.devMode;

  return `
    <aside class="dev-switcher-pill" aria-label="Developer Preview Modes">
      <span class="dev-switcher-label">State:</span>
      <button
        class="dev-tab-btn ${current === null ? 'active' : ''}"
        data-mode="live"
        type="button"
        title="Live interactive mode with backend"
      >
        Workspace
      </button>
      <button
        class="dev-tab-btn ${current === 'loading' ? 'active' : ''}"
        data-mode="loading"
        type="button"
      >
        Loading
      </button>
      <button
        class="dev-tab-btn ${current === 'empty' ? 'active' : ''}"
        data-mode="empty"
        type="button"
      >
        Empty
      </button>
      <button
        class="dev-tab-btn ${current === 'drawer' ? 'active' : ''}"
        data-mode="drawer"
        type="button"
      >
        Task Drawer
      </button>
      <button
        class="dev-tab-btn ${current === 'modal' ? 'active' : ''}"
        data-mode="modal"
        type="button"
      >
        Delete Modal
      </button>
      <button
        class="dev-tab-btn ${current === 'toast' ? 'active' : ''}"
        data-mode="toast"
        type="button"
      >
        Undo Toast
      </button>
      <button
        class="dev-tab-btn ${current === 'no-results' ? 'active' : ''}"
        data-mode="no-results"
        type="button"
      >
        No Results
      </button>
      <button
        class="dev-tab-btn ${current === 'outage' ? 'active outage' : ''}"
        data-mode="outage"
        type="button"
      >
        API Outage
      </button>
    </aside>
  `;
}

export function bindDevSwitcherEvents(container) {
  const buttons = container.querySelectorAll('.dev-tab-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode === 'live') {
        setDevMode(null);
      } else if (mode === 'drawer') {
        setDevMode(null);
        const sampleTask = state.tasks[0] || {
          id: 104,
          title: 'Review editorial type hierarchy in typography guide',
          description:
            'Ensure EB Garamond pairings balance properly against the Geist technical numbers in all responsive break states.',
          priority: 'high',
          completed: false,
        };
        openEditDrawer(sampleTask);
      } else if (mode === 'modal') {
        setDevMode(null);
        const sampleTask = state.tasks[0] || {
          id: 104,
          title: 'Review editorial type hierarchy in typography guide',
          priority: 'high',
        };
        openDeleteModal(sampleTask);
      } else if (mode === 'toast') {
        setDevMode(null);
        const sampleTask = state.tasks[0] || {
          id: 104,
          title: 'Review editorial type hierarchy in typography guide',
        };
        showUndoToast(sampleTask);
      } else {
        setDevMode(mode);
      }
    });
  });
}
