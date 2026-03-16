import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portfolio from './pages/Portfolio'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'
import './index.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  </BrowserRouter>
)

export default App
