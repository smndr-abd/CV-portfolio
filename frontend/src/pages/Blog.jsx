// frontend/src/pages/Blog.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { usePageView } from '../lib/useAnalytics'
import './Blog.css'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  usePageView()

  useEffect(() => {
    api.getPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="blog-page">
      <nav className="blog-nav">
        <Link to="/" className="blog-nav-logo">SA<span className="accent-dot">.</span></Link>
        <Link to="/" className="blog-back font-mono">← Back to portfolio</Link>
      </nav>

      <div className="blog-inner">
        <div className="blog-header">
          <div className="section-label">
            <span className="font-mono">Blog</span>
            <div className="label-line"></div>
            <span className="font-mono">{posts.length} articles</span>
          </div>
          <h1 className="blog-title">Thoughts &<br /><span className="heading-accent">Writing</span></h1>
          <p className="blog-sub font-mono">
            I write about frontend development, design systems, and working as a developer in South Korea.
          </p>
        </div>

        {loading ? (
          <div className="blog-loading">
            {[1,2,3].map(i => <div key={i} className="post-skeleton" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <p className="font-mono">No posts yet. Check back soon.</p>
            <p className="font-mono blog-empty-hint">
              Add posts via the <Link to="/admin">admin panel</Link>.
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <Link to={`/blog/${post.slug}`} key={post._id} className="post-card">
                <div className="post-meta font-mono">
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  <span className="post-read">{post.readTime}</span>
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt font-mono">{post.excerpt}</p>
                {post.tags?.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map(t => <span key={t} className="post-tag font-mono">{t}</span>)}
                  </div>
                )}
                <span className="post-cta font-mono">Read more →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
