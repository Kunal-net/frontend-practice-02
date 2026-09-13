/**
 * LoadingSkeleton Component
 */
export function renderLoadingSkeleton() {
  const rows = [1, 2, 3, 4, 5];

  return `
    <section class="skeleton-container" aria-label="Loading tasks...">
      <div style="padding: 0.75rem 0.5rem; display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
        <span style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="status-dot connecting"></span> Syncing datastore telemetry...
        </span>
        <span>Awaiting socket payload</span>
      </div>

      ${rows
        .map(
          () => `
        <div class="skeleton-row">
          <div style="display: flex; align-items: center; gap: 0.875rem;">
            <div class="skeleton-box skeleton-checkbox"></div>
            <div style="display: flex; flex-direction: column;">
              <div class="skeleton-box skeleton-title"></div>
              <div class="skeleton-box skeleton-sub"></div>
            </div>
          </div>
          <div class="skeleton-box skeleton-badge"></div>
        </div>
      `
        )
        .join('')}
    </section>
  `;
}
