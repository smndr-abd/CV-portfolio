import React, { useState, useEffect } from 'react'
import './Navbar.css'
import AnchorLink from 'react-anchor-link-smooth-scroll'

const sections = ['home', 'about', 'services', 'work', 'contact']
const labels = { home: 'Home', about: 'About', services: 'Services', work: 'Work', contact: 'Contact' }

const Navbar = () => {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
      const offsets = sections.map(id => {
        const el = document.getElementById(id)
        return el ? { id, top: el.getBoundingClientRect().top } : null
      }).filter(Boolean)
      const current = offsets.filter(o => o.top <= 120).pop()
      if (current) setActive(current.id)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">SA<span className="dot">.</span></div>

      <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        {sections.map(id => (
          <li key={id}>
            <AnchorLink
              className={`nav-link ${active === id ? 'active' : ''}`}
              offset={60}
              href={`#${id}`}
              onClick={() => { setActive(id); setMenuOpen(false) }}
            >
              {labels[id]}
            </AnchorLink>
          </li>
        ))}
      </ul>

      <AnchorLink href="#contact" offset={60} className="nav-cta">
        Hire Me
      </AnchorLink>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        <span className={menuOpen ? 'open' : ''}></span>
        <span className={menuOpen ? 'open' : ''}></span>
        <span className={menuOpen ? 'open' : ''}></span>
      </button>
    </nav>
  )
}

export default Navbar
