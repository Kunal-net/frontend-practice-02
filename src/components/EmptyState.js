/**
 * EmptyState Component
 */
import { openCreateDrawer } from '../state.js';

export function renderEmptyState() {
  return `
    <section class="empty-state-section" aria-label="Empty Workspace">
      <div class="empty-workspace-card">
        <div class="empty-null-graphic">
          <div class="empty-null-dot"></div>
        </div>
        <span class="empty-eyebrow">INDEX POSITION / CLEARED</span>
        <h2 class="empty-title">Nothing here yet.</h2>
        <p class="empty-desc">
          Start with one small thing. Your tasks will appear here in quiet typographic order as you add them.
        </p>
        <div class="empty-actions">
          <button id="btn-empty-create" class="btn-primary-action" type="button">
            <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
            <span>Create your first task</span>
          </button>
        </div>
        <p style="margin-top: 1.25rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
          <span style="width: 5px; height: 5px; border-radius: 50%; background-color: var(--accent);"></span>
          Keyboard shortcut: Press 'C' anywhere to draft
        </p>
      </div>

      <div class="empty-principles-grid">
        <article class="principle-card">
          <span class="principle-eyebrow">01 // PRINCIPLE</span>
          <h3 class="principle-title">Low friction capture</h3>
          <p class="principle-desc">
            Record obligations the precise instant they surface. Syntax parsing automatically detects dates, priorities, and project markers.
          </p>
          <span style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.6875rem; color: var(--accent);">
            syntax: "Review draft !high @tomorrow"
          </span>
        </article>

        <article class="principle-card">
          <span class="principle-eyebrow">02 // ARCHITECTURE</span>
          <h3 class="principle-title">Zero noisy notifications</h3>
          <p class="principle-desc">
            No badges, red counters, or artificial streaks. An intentional workspace that mirrors physical stationary rather than a casino slot machine.
          </p>
          <span style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.6875rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem;">
            <span class="material-symbols-outlined" style="font-size: 14px;">volume_off</span> Silence guaranteed by design
          </span>
        </article>

        <article class="principle-card">
          <span class="principle-eyebrow">03 // LOCAL RUNTIME</span>
          <h3 class="principle-title">Immediate persistence</h3>
          <p class="principle-desc">
            Everything writes immediately to your local state ledger. Cloud sync resolves silently in background threads with zero layout shift.
          </p>
          <span style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.6875rem; color: var(--success); display: flex; align-items: center; gap: 0.35rem;">
            <span style="width: 5px; height: 5px; border-radius: 50%; background-color: var(--success);"></span> Encrypted SQLite storage valid
          </span>
        </article>
      </div>
    </section>
  `;
}

export function bindEmptyStateEvents(container) {
  const btnCreate = container.querySelector('#btn-empty-create');
  if (btnCreate) {
    btnCreate.addEventListener('click', () => {
      openCreateDrawer();
    });
  }
}
