// frontend/src/pages/Portfolio.jsx
import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Hero from '../components/hero/Hero'
import About from '../components/about/About'
import Services from '../components/services/Services'
import MyWork from '../components/myWork/MyWork'
import Contact from '../components/contact/Contact'
import Footer from '../components/footer/Footer'
import { usePageView } from '../lib/useAnalytics'

const Portfolio = () => {
  usePageView()
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <MyWork />
      <Contact />
      <Footer />
    </div>
  )
}

export default Portfolio
