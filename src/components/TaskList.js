/**
 * TaskList Component
 */
import {
  state,
  getFilteredTasks,
  openEditDrawer,
  toggleTaskComplete,
  openDeleteModal,
} from '../state.js';
import { renderTaskRow } from './TaskRow.js';

export function renderTaskList() {
  const tasks = getFilteredTasks();
  const isCompletedView = state.activeView === 'completed';

  return `
    <section class="task-list-container" aria-label="Task List">
      ${tasks.map((task) => renderTaskRow(task, isCompletedView)).join('')}
    </section>
  `;
}

export function bindTaskListEvents(container) {
  const taskRows = container.querySelectorAll('.task-row');

  taskRows.forEach((row) => {
    const taskId = parseInt(row.getAttribute('data-task-id'), 10);
    const allTasks = [...state.tasks, ...state.completedTasks];
    const task = allTasks.find((t) => t.id === taskId);
    if (!task) return;

    // Checkbox action
    const checkbox = row.querySelector('[data-action="toggle-complete"]');
    if (checkbox) {
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(task);
      });
    }

    // Restore action in archive
    const restoreBtn = row.querySelector('[data-action="restore-task"]');
    if (restoreBtn) {
      restoreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTaskComplete(task); // Re-opens it into active tasks
      });
    }

    // Edit action
    const editBtn = row.querySelector('[data-action="edit-task"]');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditDrawer(task);
      });
    }

    // Delete action
    const deleteBtn = row.querySelector('[data-action="delete-task"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(task);
      });
    }

    // Row click opens drawer
    row.addEventListener('click', (e) => {
      // Don't trigger if clicked on an action button
      if (e.target.closest('button')) return;
      openEditDrawer(task);
    });

    // Keyboard enter opens drawer
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.target.closest('button')) {
        openEditDrawer(task);
      }
    });
  });
}
