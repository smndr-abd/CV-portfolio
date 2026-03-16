// frontend/src/lib/useAnalytics.js
import { useEffect } from 'react'
import { api } from './api'

// Track pageview on mount
export function usePageView() {
  useEffect(() => {
    api.track('pageview', { referrer: document.referrer }).catch(() => {})
  }, [])
}

// Track when a section becomes visible
export function useSectionTracker(sectionId) {
  useEffect(() => {
    const el = document.getElementById(sectionId)
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          api.track('section_view', { section: sectionId }).catch(() => {})
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionId])
}
