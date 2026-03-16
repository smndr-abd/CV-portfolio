import React, { useEffect, useRef } from 'react'
import './Hero.css'
import profile_img from '../../assets/me.jpeg'
import AnchorLink from 'react-anchor-link-smooth-scroll'

const Hero = () => {
  const heroRef = useRef(null)

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    const items = el.querySelectorAll('.reveal')
    items.forEach((item, i) => {
      item.style.animationDelay = `${i * 0.12}s`
      item.classList.add('animate')
    })
  }, [])

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-noise"></div>

      <div className="hero-content">
        <div className="hero-left">
          <div className="hero-tag reveal">
            <span className="tag-dot"></span>
            <span>Available for work</span>
          </div>

          <h1 className="hero-title reveal">
            <span className="title-line">Fullstack</span>
            <span className="title-line accent-line">Developer</span>
            <span className="title-line">& Designer</span>
          </h1>

          <p className="hero-bio reveal">
            Hi, I'm <strong>Samandar Abdujabbarov</strong> — a fullstack developer
            based in Seoul, South Korea. I build fast, modern web experiences
            from Namangan to the world.
          </p>

          <div className="hero-actions reveal">
            <AnchorLink href="#work" offset={60} className="btn-primary">
              View My Work
            </AnchorLink>
            <AnchorLink href="#contact" offset={60} className="btn-ghost">
              Get In Touch
            </AnchorLink>
          </div>

          <div className="hero-stack reveal">
            {['React', 'Next.js', 'Node.js', 'TypeScript'].map(t => (
              <span key={t} className="stack-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="hero-right reveal">
          <div className="hero-img-wrap">
            <img src={profile_img} alt="Samandar Abdujabbarov" className="hero-img" />
            <div className="hero-img-border"></div>
            <div className="hero-img-accent"></div>
          </div>

          <div className="hero-stat-card">
            <span className="stat-number">1+</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  )
}

export default Hero
