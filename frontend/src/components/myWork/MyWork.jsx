import React, { useState, useEffect } from 'react'
import './MyWork.css'
import { api } from '../../lib/api'
import { useSectionTracker } from '../../lib/useAnalytics'

// Fallback placeholder projects (shown until DB has real ones)
const PLACEHOLDERS = [
  { _id: '1', title: 'Your Project Here', category: 'Web App', year: '2024', description: 'Add your real projects via the Admin panel at /admin', imageUrl: '', liveUrl: '', githubUrl: '' },
  { _id: '2', title: 'Another Project', category: 'Frontend', year: '2024', description: 'Upload screenshots and add live links through /admin', imageUrl: '', liveUrl: '', githubUrl: '' },
  { _id: '3', title: 'Third Project', category: 'UI Design', year: '2023', description: 'Manage all your portfolio projects from the admin panel', imageUrl: '', liveUrl: '', githubUrl: '' },
]

const filters = ['All', 'Web App', 'Frontend', 'UI Design']

const MyWork = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('All')
  useSectionTracker('work')

  useEffect(() => {
    api.getProjects()
      .then(data => setProjects(data.length ? data : PLACEHOLDERS))
      .catch(() => setProjects(PLACEHOLDERS))
      .finally(() => setLoading(false))
  }, [])

  const allCategories = ['All', ...new Set(projects.map(p => p.category))]
  const displayFilters = allCategories.length > 2 ? allCategories : filters
  const filtered = active === 'All' ? projects : projects.filter(p => p.category === active)

  return (
    <section id="work" className="mywork">
      <div className="mywork-inner">
        <div className="section-label">
          <span>03</span>
          <div className="label-line"></div>
          <span>My Work</span>
        </div>

        <div className="mywork-header">
          <h2 className="mywork-heading">Selected<br /><span className="heading-accent">Projects</span></h2>
          <div className="work-filters">
            {displayFilters.map(f => (
              <button
                key={f}
                className={`filter-btn font-mono ${active === f ? 'active' : ''}`}
                onClick={() => setActive(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="work-loading">
            {[1,2,3].map(i => <div key={i} className="work-skeleton" />)}
          </div>
        ) : (
          <div className="work-grid">
            {filtered.map(p => (
              <div className="work-card" key={p._id}>
                <div className="work-img-wrap">
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.title} />
                    : <div className="work-placeholder-img"><span>No Image</span></div>
                  }
                  <div className="work-overlay">
                    <div className="overlay-actions">
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noreferrer" className="overlay-cta font-mono">
                          Live ↗
                        </a>
                      )}
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noreferrer" className="overlay-cta overlay-cta--ghost font-mono">
                          GitHub ↗
                        </a>
                      )}
                      {!p.liveUrl && !p.githubUrl && (
                        <span className="overlay-cta font-mono">View Project →</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="work-info">
                  <div className="work-meta font-mono">
                    <span className="work-cat">{p.category}</span>
                    <span className="work-year">{p.year}</span>
                  </div>
                  <h3 className="work-title">{p.title}</h3>
                  {p.description && <p className="work-desc font-mono">{p.description}</p>}
                  {p.tags?.length > 0 && (
                    <div className="work-tags">
                      {p.tags.map(t => <span key={t} className="work-tag font-mono">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default MyWork
