import React from 'react'
import './About.css'
import profile_img from '../../assets/me.jpeg'

const skills = [
  { name: 'React / Next.js', level: 85 },
  { name: 'Node.js / Express', level: 75 },
  { name: 'HTML & CSS', level: 90 },
  { name: 'JavaScript / TypeScript', level: 80 },
]

const About = () => {
  return (
    <section id="about" className="about">
      <div className="about-inner">
        <div className="section-label">
          <span>01</span>
          <div className="label-line"></div>
          <span>About Me</span>
        </div>

        <div className="about-grid">
          <div className="about-left">
            <div className="about-img-wrap">
              <img src={profile_img} alt="Samandar Abdujabbarov" />
              <div className="about-img-tag">
                <span className="font-mono">Seoul, KR</span>
              </div>
            </div>
          </div>

          <div className="about-right">
            <h2 className="about-heading">
              Building digital experiences<br />
              <span className="heading-accent">that actually work.</span>
            </h2>

            <p className="about-text">
              I'm a fullstack developer from Namangan, Uzbekistan, currently based in Seoul, South Korea.
              With over a year of freelance experience, I've worked across the stack — from pixel-perfect
              frontends to robust backend APIs.
            </p>
            <p className="about-text">
              I care about the details: clean code, fast performance, and interfaces that feel intuitive.
              Every project is an opportunity to build something I'm proud of.
            </p>

            <div className="about-skills">
              <h3 className="skills-title">Skills</h3>
              {skills.map(s => (
                <div key={s.name} className="skill-row">
                  <div className="skill-meta">
                    <span className="skill-name">{s.name}</span>
                    <span className="skill-pct font-mono">{s.level}%</span>
                  </div>
                  <div className="skill-bar">
                    <div
                      className="skill-fill"
                      style={{ '--target': `${s.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="about-stats">
              {[
                { n: '1+', l: 'Years Exp.' },
                { n: '10+', l: 'Projects' },
                { n: '5+', l: 'Clients' },
              ].map(s => (
                <div key={s.l} className="stat-item">
                  <span className="stat-n">{s.n}</span>
                  <span className="stat-l font-mono">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
