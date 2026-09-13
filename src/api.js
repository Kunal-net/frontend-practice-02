/**
 * API client for Daily Todo backend (FastAPI)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  constructor(message, status, detail = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 204) {
      return null;
    }

    const contentType = res.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = text ? { detail: text } : null;
    }

    if (!res.ok) {
      const errorMessage =
        (data && (data.detail || data.message)) ||
        `Request failed with status ${res.status}`;
      throw new ApiError(errorMessage, res.status, data);
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or connection failure
    throw new ApiError(
      err.message || 'Network error: could not connect to API server',
      0,
      null
    );
  }
}

export const api = {
  getBaseUrl() {
    return API_BASE_URL;
  },

  async getHealth() {
    return request('/health');
  },

  async getTasks({ completed, q } = {}) {
    const params = new URLSearchParams();
    if (completed !== undefined && completed !== null) {
      params.set('completed', String(completed));
    }
    if (q && q.trim()) {
      params.set('q', q.trim());
    }

    const query = params.toString();
    const endpoint = `/api/tasks${query ? `?${query}` : ''}`;
    return request(endpoint);
  },

  async getTask(taskId) {
    return request(`/api/tasks/${taskId}`);
  },

  async createTask({ title, description = '', priority = 'medium' }) {
    return request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        priority,
      }),
    });
  },

  async updateTask(taskId, updates) {
    return request(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async deleteTask(taskId) {
    return request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  async restoreTask(taskId) {
    return request(`/api/tasks/${taskId}/restore`, {
      method: 'POST',
    });
  },
};
