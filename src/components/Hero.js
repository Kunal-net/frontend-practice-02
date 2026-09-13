/**
 * Editorial Hero Section Component
 */
import { state } from '../state.js';

export function renderHero() {
  const isCompletedView = state.activeView === 'completed';

  if (isCompletedView) {
    const completedCount = state.completedTasks.length;
    return `
      <section class="hero-section" aria-labelledby="hero-title">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="hero-eyebrow">ARCHIVE // ACCOMPLISHED RECORD / ledger_id: #arc_094x</span>
            <h1 id="hero-title" class="hero-headline">
              The quiet ledger of work<br />fulfilled.
            </h1>
            <p class="hero-subtext">
              A permanent, searchable record of resolved intentions. Reflect on the cadence of completed efforts, or restore obligations directly into today's active flow.
            </p>
          </div>
          <div class="hero-telemetry">
            <div class="archive-summary-box" style="width: 100%; margin-top: 0;">
              <div class="archive-stats-row">
                <div class="archive-stat-item">
                  <span class="archive-stat-num">${completedCount}</span>
                  <span class="archive-stat-label">Resolved tasks</span>
                </div>
                <div class="archive-stat-item">
                  <span class="archive-stat-num" style="color: var(--success); font-size: 1.75rem;">100%</span>
                  <span class="archive-stat-label">Archive resolution</span>
                </div>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid var(--border-editorial); font-family: var(--font-mono); font-size: 0.6875rem; color: var(--text-muted);">
                <span style="display: flex; align-items: center; gap: 0.35rem;">
                  <span class="status-dot online"></span> Immutable ledger active
                </span>
                <span>completed=true</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const activeCount = state.tasks.length;
  const completedCount = state.completedTasks.length;
  const totalCount = activeCount + completedCount;

  return `
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div class="hero-content">
          <span class="hero-eyebrow">CYCLE 42 // DELIBERATE EXECUTION</span>
          <h1 id="hero-title" class="hero-headline">
            Make space for<br />what matters.
          </h1>
          <p class="hero-subtext">
            A clear list for a clearer day. Keep attention on the single next thing without unnecessary noise or performative gamification.
          </p>
        </div>
        <div class="hero-telemetry">
          <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.25rem;">
            <span class="telemetry-header">Session Status</span>
            <div class="telemetry-metrics" id="live-metrics">
              <span class="telemetry-metric-primary">${activeCount} remaining</span>
              <span style="color: var(--text-muted);">·</span>
              <span style="color: var(--text-muted);">${completedCount} completed</span>
              <span style="color: var(--text-muted);">·</span>
              <span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.8125rem;">${totalCount} total</span>
            </div>
          </div>
          <div class="telemetry-sync-badge">
            <span class="telemetry-sync-dot"></span>
            <span>Buffer: In Sync</span>
          </div>
        </div>
      </div>
    </section>
  `;
}
