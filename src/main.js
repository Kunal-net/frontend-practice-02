/**
 * Main Application Orchestrator for Daily Editorial Workspace
 */
import './styles.css';

import {
  state,
  subscribe,
  loadTasks,
  getFilteredTasks,
  openCreateDrawer,
  closeDrawer,
  closeDeleteModal,
  confirmDelete,
  setSearchQuery,
} from './state.js';

import { renderHeader, bindHeaderEvents } from './components/Header.js';
import { renderHero } from './components/Hero.js';
import { renderControls, bindControlsEvents } from './components/Controls.js';
import { renderTaskList, bindTaskListEvents } from './components/TaskList.js';
import { renderEmptyState, bindEmptyStateEvents } from './components/EmptyState.js';
import { renderNoSearchResults, bindNoSearchResultsEvents } from './components/NoSearchResults.js';
import { renderLoadingSkeleton } from './components/LoadingSkeleton.js';
import { renderErrorState, bindErrorStateEvents } from './components/ErrorState.js';
import { renderDrawer, bindDrawerEvents } from './components/Drawer.js';
import { renderDeleteModal, bindDeleteModalEvents } from './components/DeleteModal.js';
import { renderUndoToast, bindUndoToastEvents } from './components/UndoToast.js';
import { renderDevSwitcher, bindDevSwitcherEvents } from './components/DevSwitcher.js';
import { renderFooter } from './components/Footer.js';

const appEl = document.getElementById('app');

function renderApp() {
  const isOutage =
    state.devMode === 'outage' ||
    (state.connectionStatus === 'offline' && state.tasks.length === 0);

  const filteredTasks = getFilteredTasks();

  let bodyContent = '';

  if (state.devMode === 'loading' || (state.loading && !state.devMode)) {
    bodyContent = renderLoadingSkeleton();
  } else if (state.devMode === 'outage') {
    bodyContent = renderErrorState('Simulated API Outage State');
  } else if (state.devMode === 'empty') {
    bodyContent = renderEmptyState();
  } else if (state.devMode === 'no-results') {
    bodyContent = renderNoSearchResults();
  } else if (state.error && state.tasks.length === 0 && state.completedTasks.length === 0) {
    bodyContent = renderErrorState(state.error);
  } else if (filteredTasks.length === 0) {
    if (state.searchQuery || state.priorityFilter !== 'all') {
      bodyContent = renderNoSearchResults();
    } else {
      bodyContent = renderEmptyState();
    }
  } else {
    bodyContent = renderTaskList();
  }

  appEl.innerHTML = `
    ${
      isOutage
        ? `
      <div class="outage-banner" role="alert">
        <div class="outage-banner-content">
          <span class="status-dot offline"></span>
          <span>OFFLINE · Connection refused: 127.0.0.1:8000</span>
        </div>
        <div class="outage-banner-actions">
          <span>Auto-reconnect active</span>
          <button id="btn-banner-ping" type="button" class="btn-banner-action">Force ping</button>
        </div>
      </div>
    `
        : ''
    }

    ${renderHeader()}

    <main class="layout-shell" style="flex: 1; display: flex; flex-direction: column;">
      ${renderHero()}
      ${renderControls()}
      <div id="main-content-zone" style="flex: 1; display: flex; flex-direction: column;">
        ${bodyContent}
      </div>
    </main>

    ${renderDrawer()}
    ${renderDeleteModal()}
    ${renderUndoToast()}
    ${renderDevSwitcher()}
    ${renderFooter()}
  `;

  // Bind all interactive events
  bindHeaderEvents(appEl);
  bindControlsEvents(appEl);
  bindTaskListEvents(appEl);
  bindEmptyStateEvents(appEl);
  bindNoSearchResultsEvents(appEl);
  bindErrorStateEvents(appEl);
  bindDrawerEvents(appEl);
  bindDeleteModalEvents(appEl);
  bindUndoToastEvents(appEl);
  bindDevSwitcherEvents(appEl);

  const bannerPing = appEl.querySelector('#btn-banner-ping');
  if (bannerPing) {
    bannerPing.addEventListener('click', () => loadTasks());
  }
}

// Global Keyboard Shortcuts
window.addEventListener('keydown', (e) => {
  const isInputFocused =
    ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) ||
    document.activeElement?.isContentEditable;

  // ⌘K or Ctrl+K -> Focus search
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('task-search-input');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
    return;
  }

  // ⌘S or Ctrl+S -> Save drawer task
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    if (state.drawer.open) {
      e.preventDefault();
      const saveBtn = document.getElementById('btn-drawer-save');
      if (saveBtn) saveBtn.click();
      return;
    }
  }

  // Esc -> Dismiss modal or drawer or search
  if (e.key === 'Escape') {
    if (state.deleteModal.open) {
      e.preventDefault();
      closeDeleteModal();
      return;
    }
    if (state.drawer.open) {
      e.preventDefault();
      closeDrawer();
      return;
    }
    if (state.searchQuery) {
      e.preventDefault();
      setSearchQuery('');
      return;
    }
  }

  // Enter -> Purge when delete modal is open
  if (e.key === 'Enter') {
    if (state.deleteModal.open && !state.deleteModal.deleting) {
      e.preventDefault();
      confirmDelete();
      return;
    }
  }

  // 'C' or 'c' -> Draft new task (only if not focused in an input)
  if (e.key.toLowerCase() === 'c' && !isInputFocused) {
    if (!state.drawer.open && !state.deleteModal.open) {
      e.preventDefault();
      openCreateDrawer();
      setTimeout(() => {
        const titleInput = document.getElementById('drawer-input-title');
        if (titleInput) titleInput.focus();
      }, 50);
    }
  }
});

// Subscribe to state updates
subscribe(renderApp);

// Initial Load
loadTasks();

// Auto-check connection every 15s in background
setInterval(() => {
  if (state.connectionStatus === 'offline' && !state.devMode) {
    loadTasks();
  }
}, 15000);
