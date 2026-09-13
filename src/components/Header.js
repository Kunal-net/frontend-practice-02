/**
 * Header Component
 */
import { state, setView, openCreateDrawer } from '../state.js';

export function renderHeader() {
  const isAllTasks = state.activeView === 'all-tasks';
  const isCompleted = state.activeView === 'completed';

  let statusText = 'Connected · 127.0.0.1:8000';
  let statusClass = 'online';
  if (state.connectionStatus === 'connecting') {
    statusText = 'Connecting · 127.0.0.1:8000';
    statusClass = 'connecting';
  } else if (state.connectionStatus === 'offline') {
    statusText = 'Offline · 127.0.0.1:8000';
    statusClass = 'offline';
  }

  return `
    <header class="app-header">
      <div class="layout-shell header-container">
        <div class="header-left">
          <div class="brand-group">
            <span class="brand-name">daily/</span>
            <span class="brand-version">v0.9.4</span>
          </div>
          <nav class="header-nav" aria-label="Main Navigation">
            <button
              id="tab-all-tasks"
              class="nav-tab ${isAllTasks ? 'active' : ''}"
              type="button"
              aria-current="${isAllTasks ? 'page' : 'false'}"
            >
              All tasks
            </button>
            <button
              id="tab-completed"
              class="nav-tab ${isCompleted ? 'active' : ''}"
              type="button"
              aria-current="${isCompleted ? 'page' : 'false'}"
            >
              Completed
            </button>
          </nav>
        </div>

        <div class="header-right">
          <div class="status-pill" title="API connection status">
            <span class="status-dot ${statusClass}"></span>
            <span>${statusText}</span>
          </div>
          <button
            id="btn-header-new-task"
            class="btn-primary-action"
            type="button"
            aria-label="Create new task"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
            <span>New task</span>
          </button>
          <div class="avatar-icon" title="Workspace Profile" aria-hidden="true">
            <span class="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function bindHeaderEvents(container) {
  const tabAll = container.querySelector('#tab-all-tasks');
  const tabCompleted = container.querySelector('#tab-completed');
  const btnNew = container.querySelector('#btn-header-new-task');

  if (tabAll) {
    tabAll.addEventListener('click', () => setView('all-tasks'));
  }
  if (tabCompleted) {
    tabCompleted.addEventListener('click', () => setView('completed'));
  }
  if (btnNew) {
    btnNew.addEventListener('click', () => openCreateDrawer());
  }
}
