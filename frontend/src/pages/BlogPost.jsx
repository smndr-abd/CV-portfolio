// frontend/src/pages/BlogPost.jsx
import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { usePageView } from '../lib/useAnalytics'
import './BlogPost.css'

const BlogPost = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  usePageView()

  useEffect(() => {
    api.getPost(slug)
      .then(setPost)
      .catch(() => navigate('/blog'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="post-page">
      <div className="post-loading">
        <div className="post-skeleton-title" />
        <div className="post-skeleton-body" />
      </div>
    </div>
  )

  if (!post) return null

  return (
    <div className="post-page">
      <nav className="blog-nav">
        <Link to="/" className="blog-nav-logo">SA<span className="accent-dot">.</span></Link>
        <Link to="/blog" className="blog-back font-mono">← All posts</Link>
      </nav>

      <article className="post-article">
        <header className="post-header">
          <div className="post-tags">
            {post.tags?.map(t => <span key={t} className="post-tag font-mono">{t}</span>)}
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta font-mono">
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}</span>
            <span className="meta-sep">·</span>
            <span>{post.readTime}</span>
            {post.views > 0 && <>
              <span className="meta-sep">·</span>
              <span>{post.views} views</span>
            </>}
          </div>
        </header>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
        />

        <footer className="post-footer">
          <Link to="/blog" className="back-link font-mono">← Back to all posts</Link>
        </footer>
      </article>
    </div>
  )
}

export default BlogPost
