import React from 'react'
import './Footer.css'
import AnchorLink from 'react-anchor-link-smooth-scroll'
import { Link } from 'react-router-dom'

const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">SA<span className="accent-dot">.</span></span>
            <p className="footer-tagline font-mono">Fullstack Developer · Seoul, KR</p>
          </div>
          <AnchorLink href="#home" offset={60} className="back-top font-mono">
            Back to top ↑
          </AnchorLink>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copy font-mono">© {year} Samandar Abdujabbarov. All rights reserved.</p>
          <div className="footer-links">
            {['home', 'about', 'services', 'work', 'contact'].map(id => (
              <AnchorLink key={id} href={`#${id}`} offset={60} className="footer-link font-mono">
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </AnchorLink>
            ))}
            <Link to="/blog" className="footer-link font-mono">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
