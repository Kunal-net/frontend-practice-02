/**
 * NoSearchResults Component
 */
import { state, setSearchQuery, openCreateDrawer } from '../state.js';

export function renderNoSearchResults() {
  const query = state.searchQuery;

  return `
    <section class="no-search-results-section" aria-label="No Search Results">
      <div class="empty-workspace-card">
        <span class="empty-eyebrow">00 MATCHES FOUND</span>
        <h2 class="empty-title">No tasks match that search.</h2>
        <p class="empty-desc">
          Try searching with broader terms, check your spelling, or remove the active priority filter to inspect dormant records.
        </p>
        <div class="empty-actions">
          <button id="btn-clear-search" class="btn-ghost" style="background-color: var(--surface-container); border: 1px solid var(--border-editorial);" type="button">
            <span class="material-symbols-outlined" style="font-size: 16px;">filter_alt_off</span>
            <span>Clear search query</span>
          </button>
          ${
            query
              ? `
            <button id="btn-create-from-search" class="btn-primary-action" type="button">
              <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
              <span>Create task "${escapeHtml(query)}"</span>
            </button>
          `
              : ''
          }
        </div>
        <p style="margin-top: 1.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
          <span class="material-symbols-outlined" style="font-size: 14px;">lightbulb</span>
          Tip: You can search titles and descriptions. Press <kbd class="kbd-badge" style="margin: 0 0.2rem;">Esc</kbd> to restore workspace list.
        </p>
      </div>
    </section>
  `;
}

export function bindNoSearchResultsEvents(container) {
  const btnClear = container.querySelector('#btn-clear-search');
  const btnCreateFromSearch = container.querySelector('#btn-create-from-search');

  if (btnClear) {
    btnClear.addEventListener('click', () => {
      setSearchQuery('');
    });
  }

  if (btnCreateFromSearch) {
    btnCreateFromSearch.addEventListener('click', () => {
      openCreateDrawer();
      // Pre-fill title in drawer if opened from search
      if (state.drawer.task) {
        state.drawer.task.title = state.searchQuery;
      }
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
