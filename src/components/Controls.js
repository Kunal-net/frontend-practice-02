/**
 * Workspace Controls (Search, Filters, Sort, Add) Component
 */
import {
  state,
  setPriorityFilter,
  setSearchQuery,
  toggleSort,
  openCreateDrawer,
} from '../state.js';

export function renderControls() {
  const isCompletedView = state.activeView === 'completed';
  const placeholder = isCompletedView
    ? 'Filter completed archives by keyword, file, or hash...'
    : 'Filter by title or context...';

  const filter = state.priorityFilter;
  const sortText = state.sortBy === 'priority' ? 'Priority rank' : 'Newest timestamp';

  return `
    <section class="workspace-controls" aria-label="Task Filters and Search">
      <div class="search-container">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          id="task-search-input"
          class="search-input"
          type="search"
          placeholder="${placeholder}"
          value="${state.searchQuery}"
          aria-label="Search tasks"
        />
        <div class="search-shortcut">
          <kbd class="kbd-badge">⌘K</kbd>
        </div>
      </div>

      <div class="controls-actions">
        <div class="filter-group" role="group" aria-label="Priority Filter">
          <button
            class="filter-chip ${filter === 'all' ? 'active' : ''}"
            data-filter="all"
            type="button"
          >
            All
          </button>
          <button
            class="filter-chip ${filter === 'high' ? 'active' : ''}"
            data-filter="high"
            type="button"
          >
            High
          </button>
          <button
            class="filter-chip ${filter === 'medium' ? 'active' : ''}"
            data-filter="medium"
            type="button"
          >
            Medium
          </button>
          <button
            class="filter-chip ${filter === 'low' ? 'active' : ''}"
            data-filter="low"
            type="button"
          >
            Low
          </button>
        </div>

        <div class="sort-container">
          <span class="sort-label">Sort:</span>
          <button id="btn-sort-toggle" class="sort-btn" type="button" title="Toggle sort order">
            ${sortText}
          </button>
        </div>

        ${
          !isCompletedView
            ? `
          <button
            id="btn-quick-add"
            class="btn-quick-add"
            type="button"
            aria-label="Create new entry"
          >
            <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
            <span>New entry</span>
          </button>
        `
            : ''
        }
      </div>
    </section>
  `;
}

export function bindControlsEvents(container) {
  const searchInput = container.querySelector('#task-search-input');
  const filterChips = container.querySelectorAll('.filter-chip');
  const sortBtn = container.querySelector('#btn-sort-toggle');
  const quickAddBtn = container.querySelector('#btn-quick-add');

  if (searchInput) {
    let debounceTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setSearchQuery(e.target.value);
      }, 200);
    });
  }

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const targetFilter = chip.getAttribute('data-filter');
      setPriorityFilter(targetFilter);
    });
  });

  if (sortBtn) {
    sortBtn.addEventListener('click', () => {
      toggleSort();
    });
  }

  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      openCreateDrawer();
    });
  }
}
