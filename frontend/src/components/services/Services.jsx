import React from 'react'
import './Services.css'

const services = [
  {
    no: '01',
    name: 'Frontend Development',
    desc: 'Pixel-perfect, responsive interfaces built with React and Next.js. Fast, accessible, and built to impress.',
    tags: ['React', 'Next.js', 'CSS', 'Animation'],
  },
  {
    no: '02',
    name: 'Backend Development',
    desc: 'Scalable APIs and server-side logic with Node.js and Express. From REST endpoints to database architecture.',
    tags: ['Node.js', 'Express', 'REST API', 'MongoDB'],
  },
  {
    no: '03',
    name: 'Full-Stack Web Apps',
    desc: 'End-to-end web applications — from design to deployment. One developer, the whole product.',
    tags: ['Full Stack', 'Auth', 'Deployment'],
  },
  {
    no: '04',
    name: 'UI/UX Design',
    desc: 'Clean, intentional interfaces designed with purpose. I turn ideas into layouts that users actually enjoy.',
    tags: ['Figma', 'Prototyping', 'Design Systems'],
  },
]

const Services = () => {
  return (
    <section id="services" className="services">
      <div className="services-inner">
        <div className="section-label">
          <span>02</span>
          <div className="label-line"></div>
          <span>Services</span>
        </div>

        <div className="services-header">
          <h2 className="services-heading">What I do<span className="accent-dot">.</span></h2>
          <p className="services-sub">
            I offer end-to-end development services — whatever your project needs, I can build it.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={s.no}>
              <div className="service-no font-mono">{s.no}</div>
              <h3 className="service-name">{s.name}</h3>
              <p className="service-desc font-mono">{s.desc}</p>
              <div className="service-tags">
                {s.tags.map(t => (
                  <span key={t} className="service-tag font-mono">{t}</span>
                ))}
              </div>
              <div className="service-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
