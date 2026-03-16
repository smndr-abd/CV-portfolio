// frontend/src/pages/Admin.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import './Admin.css'

// ── Login Screen ──────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.login(password)
      localStorage.setItem('admin_token', token)
      onLogin()
    } catch {
      setError('Invalid password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-box">
        <div className="login-logo">SA<span>.</span></div>
        <h1>Admin Panel</h1>
        <p className="font-mono">Enter your admin password to continue</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
            autoFocus
          />
          {error && <p className="login-error font-mono">{error}</p>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <Link to="/" className="login-back font-mono">← Back to portfolio</Link>
      </div>
    </div>
  )
}

// ── Projects Tab ──────────────────────────────────────────────────────────────
const ProjectsTab = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', category: '', description: '', imageUrl: '', liveUrl: '', githubUrl: '', tags: '', year: new Date().getFullYear().toString() })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => api.getProjects().then(setProjects).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editing) {
        await api.updateProject(editing, data)
      } else {
        await api.createProject(data)
      }
      setForm({ title: '', category: '', description: '', imageUrl: '', liveUrl: '', githubUrl: '', tags: '', year: new Date().getFullYear().toString() })
      setEditing(null)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p) => {
    setEditing(p._id)
    setForm({ ...p, tags: (p.tags || []).join(', ') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await api.deleteProject(id)
    load()
  }

  return (
    <div className="tab-content">
      <div className="tab-section">
        <h2>{editing ? 'Edit Project' : 'Add New Project'}</h2>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label className="font-mono">Title *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="My Awesome Project" required />
            </div>
            <div className="form-group">
              <label className="font-mono">Category *</label>
              <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Web App / Frontend / UI Design" required />
            </div>
          </div>
          <div className="form-group">
            <label className="font-mono">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief project description..." rows={3} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="font-mono">Image URL</label>
              <input value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="font-mono">Year</label>
              <input value={form.year} onChange={e => setForm({...form, year: e.target.value})} placeholder="2024" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="font-mono">Live URL</label>
              <input value={form.liveUrl} onChange={e => setForm({...form, liveUrl: e.target.value})} placeholder="https://myproject.com" />
            </div>
            <div className="form-group">
              <label className="font-mono">GitHub URL</label>
              <input value={form.githubUrl} onChange={e => setForm({...form, githubUrl: e.target.value})} placeholder="https://github.com/..." />
            </div>
          </div>
          <div className="form-group">
            <label className="font-mono">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="React, Node.js, MongoDB" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Project' : 'Add Project'}</button>
            {editing && <button type="button" className="btn-cancel" onClick={() => { setEditing(null); setForm({ title: '', category: '', description: '', imageUrl: '', liveUrl: '', githubUrl: '', tags: '', year: new Date().getFullYear().toString() }) }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="tab-section">
        <h2>All Projects ({projects.length})</h2>
        {loading ? <p className="font-mono loading-text">Loading...</p> : projects.length === 0 ? (
          <p className="font-mono empty-text">No projects yet. Add one above.</p>
        ) : (
          <div className="items-list">
            {projects.map(p => (
              <div className="item-row" key={p._id}>
                <div className="item-info">
                  <span className="item-title">{p.title}</span>
                  <span className="item-meta font-mono">{p.category} · {p.year}</span>
                </div>
                <div className="item-actions">
                  {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-sm">↗ Live</a>}
                  <button className="btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Blog Tab ──────────────────────────────────────────────────────────────────
const BlogTab = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '', published: false })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => api.getPosts(true).then(setPosts).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const data = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    try {
      if (editing) {
        await api.updatePost(editing, data)
      } else {
        await api.createPost(data)
      }
      setForm({ title: '', content: '', excerpt: '', tags: '', published: false })
      setEditing(null)
      load()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p) => {
    setEditing(p.slug)
    setForm({ ...p, tags: (p.tags || []).join(', ') })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (slug) => {
    if (!confirm('Delete this post?')) return
    await api.deletePost(slug)
    load()
  }

  const togglePublish = async (post) => {
    await api.updatePost(post.slug, { ...post, published: !post.published })
    load()
  }

  return (
    <div className="tab-content">
      <div className="tab-section">
        <h2>{editing ? 'Edit Post' : 'Write New Post'}</h2>
        <form className="admin-form" onSubmit={handleSave}>
          <div className="form-group">
            <label className="font-mono">Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Post title..." required />
          </div>
          <div className="form-group">
            <label className="font-mono">Excerpt (optional — auto-generated if empty)</label>
            <input value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} placeholder="Short description shown in the blog list..." />
          </div>
          <div className="form-group">
            <label className="font-mono">Content * (supports basic HTML)</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              placeholder="Write your post here... You can use HTML: &lt;h2&gt;, &lt;p&gt;, &lt;code&gt;, &lt;blockquote&gt; etc."
              rows={16} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="font-mono">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="React, Tutorial, Tips" />
            </div>
            <div className="form-group form-group--check">
              <label className="check-label">
                <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} />
                <span>Publish immediately</span>
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}</button>
            {editing && <button type="button" className="btn-cancel" onClick={() => { setEditing(null); setForm({ title: '', content: '', excerpt: '', tags: '', published: false }) }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="tab-section">
        <h2>All Posts ({posts.length})</h2>
        {loading ? <p className="font-mono loading-text">Loading...</p> : posts.length === 0 ? (
          <p className="font-mono empty-text">No posts yet. Write one above.</p>
        ) : (
          <div className="items-list">
            {posts.map(p => (
              <div className="item-row" key={p._id}>
                <div className="item-info">
                  <span className="item-title">{p.title}</span>
                  <span className="item-meta font-mono">
                    {new Date(p.createdAt).toLocaleDateString()} ·
                    <span className={`status-badge ${p.published ? 'published' : 'draft'}`}>{p.published ? ' Published' : ' Draft'}</span>
                    {p.views ? ` · ${p.views} views` : ''}
                  </span>
                </div>
                <div className="item-actions">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="btn-sm">↗ View</a>
                  <button className="btn-sm" onClick={() => togglePublish(p)}>{p.published ? 'Unpublish' : 'Publish'}</button>
                  <button className="btn-sm" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(p.slug)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Messages Tab ──────────────────────────────────────────────────────────────
const MessagesTab = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = () => api.getMessages().then(setMessages).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleExpand = async (msg) => {
    setExpanded(expanded === msg._id ? null : msg._id)
    if (!msg.read) {
      await api.markRead(msg._id)
      load()
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    await api.deleteMessage(id)
    load()
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div className="tab-content">
      <div className="tab-section">
        <h2>Messages {unread > 0 && <span className="unread-badge">{unread} new</span>}</h2>
        {loading ? <p className="font-mono loading-text">Loading...</p> : messages.length === 0 ? (
          <p className="font-mono empty-text">No messages yet. They'll appear here when someone contacts you.</p>
        ) : (
          <div className="items-list">
            {messages.map(msg => (
              <div className={`item-row message-row ${!msg.read ? 'unread' : ''}`} key={msg._id}>
                <div className="item-info" onClick={() => handleExpand(msg)} style={{ cursor: 'pointer' }}>
                  <div className="msg-header">
                    {!msg.read && <span className="unread-dot" />}
                    <span className="item-title">{msg.name}</span>
                    <span className="msg-email font-mono">{msg.email}</span>
                  </div>
                  <span className="item-meta font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
                  {expanded === msg._id && (
                    <div className="msg-body font-mono">{msg.message}</div>
                  )}
                </div>
                <div className="item-actions">
                  <a href={`mailto:${msg.email}?subject=Re: Your message`} className="btn-sm">Reply</a>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(msg._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Analytics Tab ─────────────────────────────────────────────────────────────
const AnalyticsTab = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAnalytics().then(setData).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="tab-content"><p className="font-mono loading-text">Loading analytics...</p></div>
  if (!data) return <div className="tab-content"><p className="font-mono empty-text">No analytics data yet.</p></div>

  return (
    <div className="tab-content">
      <div className="analytics-stats">
        {[
          { label: 'Total Views', value: data.totalViews },
          { label: 'Last 30 Days', value: data.last30Days },
          { label: 'Sections Tracked', value: data.bySection?.length || 0 },
        ].map(s => (
          <div className="analytics-stat" key={s.label}>
            <span className="analytics-n">{s.value}</span>
            <span className="analytics-l font-mono">{s.label}</span>
          </div>
        ))}
      </div>

      {data.byDay?.length > 0 && (
        <div className="tab-section">
          <h2>Views by Day (last 30 days)</h2>
          <div className="bar-chart">
            {data.byDay.map(d => {
              const max = Math.max(...data.byDay.map(x => x.count))
              return (
                <div className="bar-item" key={d._id} title={`${d._id}: ${d.count} views`}>
                  <div className="bar-fill" style={{ height: `${(d.count / max) * 100}%` }} />
                  <span className="bar-label font-mono">{d._id.slice(5)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {data.bySection?.length > 0 && (
        <div className="tab-section">
          <h2>Most Viewed Sections</h2>
          <div className="items-list">
            {data.bySection.map(s => (
              <div className="item-row" key={s._id}>
                <span className="item-title">#{s._id}</span>
                <span className="font-mono" style={{ color: 'var(--accent)' }}>{s.count} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.topReferrers?.length > 0 && (
        <div className="tab-section">
          <h2>Top Referrers</h2>
          <div className="items-list">
            {data.topReferrers.map(r => (
              <div className="item-row" key={r._id}>
                <span className="item-title font-mono">{r._id}</span>
                <span className="font-mono" style={{ color: 'var(--fg-dim)' }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main Admin ────────────────────────────────────────────────────────────────
const TABS = ['Projects', 'Blog', 'Messages', 'Analytics']

const Admin = () => {
  const [authed, setAuthed] = useState(!!localStorage.getItem('admin_token'))
  const [tab, setTab] = useState('Projects')

  const logout = () => {
    localStorage.removeItem('admin_token')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-brand">
          <span className="admin-logo">SA<span>.</span></span>
          <span className="admin-title font-mono">Admin Panel</span>
        </div>
        <div className="admin-header-right">
          <Link to="/" className="btn-sm">← Portfolio</Link>
          <button className="btn-sm btn-danger" onClick={logout}>Logout</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map(t => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {tab === 'Projects' && <ProjectsTab />}
        {tab === 'Blog' && <BlogTab />}
        {tab === 'Messages' && <MessagesTab />}
        {tab === 'Analytics' && <AnalyticsTab />}
      </main>
    </div>
  )
}

export default Admin
