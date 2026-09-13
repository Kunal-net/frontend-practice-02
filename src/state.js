/**
 * Reactive State Store for Daily Editorial Workspace
 */

import { api } from './api.js';

const listeners = new Set();

export const state = {
  tasks: [],
  completedTasks: [],
  activeView: 'all-tasks', // 'all-tasks' | 'completed'
  priorityFilter: 'all',  // 'all' | 'high' | 'medium' | 'low'
  searchQuery: '',
  sortBy: 'priority',     // 'priority' | 'newest'
  connectionStatus: 'connecting', // 'connected' | 'connecting' | 'offline'
  connectionUrl: '127.0.0.1:8000',
  loading: true,
  error: null,

  drawer: {
    open: false,
    mode: 'create', // 'create' | 'edit'
    task: null,
    saving: false,
    error: null,
  },

  deleteModal: {
    open: false,
    task: null,
    deleting: false,
  },

  undoToast: {
    visible: false,
    task: null,
    secondsLeft: 5,
    timerId: null,
    restoring: false,
  },

  devMode: null, // null (live) | 'workspace' | 'loading' | 'empty' | 'drawer' | 'modal' | 'toast' | 'outage' | 'no-results' | 'completed'
};

function notify() {
  listeners.forEach((listener) => {
    try {
      listener(state);
    } catch (err) {
      console.error('State subscriber error:', err);
    }
  });
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const PRIORITY_ORDER = { high: 1, medium: 2, low: 3 };

export function getFilteredTasks() {
  const isCompletedView = state.activeView === 'completed';
  const source = isCompletedView ? state.completedTasks : state.tasks;

  return source.filter((task) => {
    // Priority filter
    if (state.priorityFilter !== 'all' && task.priority !== state.priorityFilter) {
      return false;
    }
    // Search query filter (already done by API on search, but handy for instant local filtering)
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = (task.title || '').toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  }).sort((a, b) => {
    if (state.sortBy === 'priority') {
      const pDiff = (PRIORITY_ORDER[a.priority] || 2) - (PRIORITY_ORDER[b.priority] || 2);
      if (pDiff !== 0) return pDiff;
      return b.id - a.id;
    }
    return b.id - a.id;
  });
}

export async function checkConnection() {
  try {
    await api.getHealth();
    state.connectionStatus = 'connected';
    state.error = null;
  } catch {
    state.connectionStatus = 'offline';
  }
  notify();
}

export async function loadTasks() {
  state.loading = true;
  state.error = null;
  notify();

  try {
    await checkConnection();

    // Fetch active tasks
    const activeData = await api.getTasks({
      completed: false,
      q: state.searchQuery || undefined,
    });
    state.tasks = activeData;

    // Fetch completed tasks
    const completedData = await api.getTasks({
      completed: true,
      q: state.searchQuery || undefined,
    });
    state.completedTasks = completedData;

    state.connectionStatus = 'connected';
    state.loading = false;
  } catch (err) {
    state.connectionStatus = 'offline';
    state.error = err.message || 'Unable to connect to the Todo backend';
    state.loading = false;
  }
  notify();
}

export function setView(view) {
  state.activeView = view;
  state.priorityFilter = 'all';
  notify();
}

export function setPriorityFilter(filter) {
  state.priorityFilter = filter;
  notify();
}

export async function setSearchQuery(query) {
  state.searchQuery = query;
  // If connected, query backend directly for full server-side search
  if (state.connectionStatus === 'connected') {
    try {
      if (state.activeView === 'completed') {
        state.completedTasks = await api.getTasks({ completed: true, q: query });
      } else {
        state.tasks = await api.getTasks({ completed: false, q: query });
      }
    } catch (err) {
      console.error('Search query error:', err);
    }
  }
  notify();
}

export function toggleSort() {
  state.sortBy = state.sortBy === 'priority' ? 'newest' : 'priority';
  notify();
}

export function openCreateDrawer() {
  state.drawer = {
    open: true,
    mode: 'create',
    task: {
      title: '',
      description: '',
      priority: 'medium',
      completed: false,
    },
    saving: false,
    error: null,
  };
  notify();
}

export function openEditDrawer(task) {
  state.drawer = {
    open: true,
    mode: 'edit',
    task: { ...task },
    saving: false,
    error: null,
  };
  notify();
}

export function closeDrawer() {
  state.drawer.open = false;
  state.drawer.saving = false;
  state.drawer.error = null;
  notify();
}

export async function saveDrawerTask(payload) {
  state.drawer.saving = true;
  state.drawer.error = null;
  notify();

  try {
    if (state.drawer.mode === 'create') {
      const created = await api.createTask(payload);
      state.tasks.unshift(created);
    } else {
      const id = state.drawer.task.id;
      const updated = await api.updateTask(id, payload);
      
      // Update in active tasks or completed tasks
      if (updated.completed) {
        state.tasks = state.tasks.filter((t) => t.id !== id);
        if (!state.completedTasks.find((t) => t.id === id)) {
          state.completedTasks.unshift(updated);
        } else {
          state.completedTasks = state.completedTasks.map((t) => (t.id === id ? updated : t));
        }
      } else {
        state.completedTasks = state.completedTasks.filter((t) => t.id !== id);
        if (!state.tasks.find((t) => t.id === id)) {
          state.tasks.unshift(updated);
        } else {
          state.tasks = state.tasks.map((t) => (t.id === id ? updated : t));
        }
      }
    }

    state.drawer.open = false;
    state.drawer.saving = false;
  } catch (err) {
    state.drawer.saving = false;
    state.drawer.error = err.message || 'Failed to save task';
  }
  notify();
}

export async function toggleTaskComplete(task) {
  const newCompleted = !task.completed;
  const taskId = task.id;

  // Optimistic UI update
  if (newCompleted) {
    state.tasks = state.tasks.filter((t) => t.id !== taskId);
    state.completedTasks.unshift({ ...task, completed: true });
  } else {
    state.completedTasks = state.completedTasks.filter((t) => t.id !== taskId);
    state.tasks.unshift({ ...task, completed: false });
  }
  notify();

  try {
    const updated = await api.updateTask(taskId, { completed: newCompleted });
    // Sync with returned object
    if (newCompleted) {
      state.completedTasks = state.completedTasks.map((t) => (t.id === taskId ? updated : t));
    } else {
      state.tasks = state.tasks.map((t) => (t.id === taskId ? updated : t));
    }
  } catch (err) {
    console.error('Failed to toggle completion:', err);
    // Rollback
    if (newCompleted) {
      state.completedTasks = state.completedTasks.filter((t) => t.id !== taskId);
      state.tasks.unshift(task);
    } else {
      state.tasks = state.tasks.filter((t) => t.id !== taskId);
      state.completedTasks.unshift(task);
    }
    state.error = 'Failed to update task completion';
  }
  notify();
}

export function openDeleteModal(task) {
  state.deleteModal = {
    open: true,
    task,
    deleting: false,
  };
  notify();
}

export function closeDeleteModal() {
  state.deleteModal.open = false;
  state.deleteModal.task = null;
  state.deleteModal.deleting = false;
  notify();
}

export async function confirmDelete() {
  const task = state.deleteModal.task;
  if (!task) return;

  state.deleteModal.deleting = true;
  notify();

  try {
    await api.deleteTask(task.id);

    // Remove from local lists
    state.tasks = state.tasks.filter((t) => t.id !== task.id);
    state.completedTasks = state.completedTasks.filter((t) => t.id !== task.id);

    // Close drawer if open with this task
    if (state.drawer.open && state.drawer.task && state.drawer.task.id === task.id) {
      state.drawer.open = false;
    }

    closeDeleteModal();
    showUndoToast(task);
  } catch (err) {
    state.deleteModal.deleting = false;
    state.error = err.message || 'Failed to delete task';
    notify();
  }
}

export function showUndoToast(task) {
  if (state.undoToast.timerId) {
    clearInterval(state.undoToast.timerId);
  }

  state.undoToast = {
    visible: true,
    task,
    secondsLeft: 5,
    restoring: false,
    timerId: setInterval(() => {
      if (state.undoToast.secondsLeft > 1) {
        state.undoToast.secondsLeft -= 1;
        notify();
      } else {
        dismissToast();
      }
    }, 1000),
  };
  notify();
}

export async function undoDelete() {
  const task = state.undoToast.task;
  if (!task) return;

  state.undoToast.restoring = true;
  notify();

  try {
    const restored = await api.restoreTask(task.id);
    if (state.undoToast.timerId) {
      clearInterval(state.undoToast.timerId);
    }
    state.undoToast.visible = false;
    state.undoToast.task = null;

    if (restored.completed) {
      state.completedTasks.unshift(restored);
    } else {
      state.tasks.unshift(restored);
    }
  } catch (err) {
    state.undoToast.restoring = false;
    state.error = err.message || 'Failed to restore task';
  }
  notify();
}

export function dismissToast() {
  if (state.undoToast.timerId) {
    clearInterval(state.undoToast.timerId);
  }
  state.undoToast.visible = false;
  state.undoToast.task = null;
  state.undoToast.timerId = null;
  notify();
}

export function setDevMode(mode) {
  state.devMode = mode;
  notify();
}
