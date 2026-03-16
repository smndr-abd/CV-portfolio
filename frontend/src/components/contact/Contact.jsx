import React, { useState } from 'react'
import './Contact.css'
import { api } from '../../lib/api'
import { useSectionTracker } from '../../lib/useAnalytics'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')
  useSectionTracker('contact')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')
    setErrorMsg('')
    try {
      await api.sendMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-inner">
        <div className="section-label">
          <span>04</span>
          <div className="label-line"></div>
          <span>Contact</span>
        </div>

        <div className="contact-grid">
          <div className="contact-left">
            <h2 className="contact-heading">
              Let's build<br />
              something<br />
              <span className="heading-accent">together.</span>
            </h2>
            <p className="contact-blurb font-mono">
              I'm available for new projects. If you have an idea,
              need a developer, or just want to say hi — reach out.
            </p>

            <div className="contact-details">
              <a href="mailto:abdujabbarovsamandar01@gmail.com" className="contact-item">
                <span className="item-icon font-mono">@</span>
                <span>abdujabbarovsamandar01@gmail.com</span>
              </a>
              <a href="tel:+821098052504" className="contact-item">
                <span className="item-icon font-mono">#</span>
                <span>+82 10-9805-2504</span>
              </a>
              <div className="contact-item">
                <span className="item-icon font-mono">📍</span>
                <span>Seoul, South Korea</span>
              </div>
            </div>

            <div className="contact-socials">
              <a href="https://github.com/" target="_blank" rel="noreferrer" className="social-link font-mono">GitHub ↗</a>
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="social-link font-mono">LinkedIn ↗</a>
            </div>
          </div>

          <div className="contact-right">
            {status === 'success' ? (
              <div className="contact-success">
                <div className="success-icon">✓</div>
                <h3>Message sent!</h3>
                <p className="font-mono">Thanks for reaching out. I'll get back to you soon.</p>
                <button className="btn-reset" onClick={() => setStatus('idle')}>Send another</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label font-mono">Your Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="John Doe" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label font-mono">Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="john@example.com" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label font-mono">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Tell me about your project..." className="form-input form-textarea"
                    rows={6} required />
                </div>
                {errorMsg && <p className="form-error font-mono">{errorMsg}</p>}
                <button type="submit" className={`form-submit ${status}`} disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
