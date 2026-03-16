// frontend/src/lib/api.js
const BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('admin_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  // Projects
  getProjects: () => request('/projects'),
  createProject: (data) => request('/projects', { method: 'POST', body: data }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: data }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),

  // Blog
  getPosts: (draft = false) => request(`/blog${draft ? '?draft=1' : ''}`),
  getPost: (slug) => request(`/blog/${slug}`),
  createPost: (data) => request('/blog', { method: 'POST', body: data }),
  updatePost: (slug, data) => request(`/blog/${slug}`, { method: 'PUT', body: data }),
  deletePost: (slug) => request(`/blog/${slug}`, { method: 'DELETE' }),

  // Contact
  sendMessage: (data) => request('/contact', { method: 'POST', body: data }),

  // Analytics
  track: (type, extras = {}) => request('/analytics', { method: 'POST', body: { type, ...extras } }),
  getAnalytics: () => request('/analytics'),

  // Admin
  login: (password) => request('/admin/login', { method: 'POST', body: { password } }),
  getMessages: () => request('/admin/messages'),
  markRead: (id) => request(`/admin/messages?id=${id}`, { method: 'PUT', body: {} }),
  deleteMessage: (id) => request(`/admin/messages?id=${id}`, { method: 'DELETE' }),
}
