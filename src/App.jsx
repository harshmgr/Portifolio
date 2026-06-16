import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, MotionConfig, useScroll } from 'framer-motion'
import BootSequence from './components/BootSequence'
import Navbar from './components/Navbar'
import CommandPalette from './components/CommandPalette'
import Hero from './components/Hero'
import About from './components/About'
import { profile } from './config'

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme')
      if (saved) return saved
    } catch { /* private mode */ }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('portfolio-theme', theme) } catch { /* private mode */ }
  }, [theme])

  return [theme, () => setTheme(t => t === 'dark' ? 'light' : 'dark')]
}

// Below-the-fold sections are lazy-loaded to keep first paint light.
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const Experience = lazy(() => import('./components/Experience'))
const Architecture = lazy(() => import('./components/Architecture'))
const GitHubSection = lazy(() => import('./components/GitHubSection'))
const Contact = lazy(() => import('./components/Contact'))
const SnakeGame = lazy(() => import('./components/SnakeGame'))

const seenBoot = () => {
  try { return sessionStorage.getItem('boot-done') === '1' } catch { return false }
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  // show the boot sequence once per browser session
  const [booted, setBooted] = useState(seenBoot)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [snakeOpen, setSnakeOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  // the contact terminal and command palette launch the game via this event
  useEffect(() => {
    const open = () => setSnakeOpen(true)
    window.addEventListener('open-snake', open)
    return () => window.removeEventListener('open-snake', open)
  }, [])

  const finishBoot = () => {
    setBooted(true)
    try { sessionStorage.setItem('boot-done', '1') } catch { /* private mode */ }
  }

  // safety net: never strand the visitor on the boot screen,
  // even if exit animations are throttled (background tab, old devices)
  useEffect(() => {
    if (booted) return
    const t = setTimeout(finishBoot, 7000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      {!booted && <BootSequence onDone={finishBoot} />}

      {/* scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-electric via-cyan-400 to-violet"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      <Navbar onOpenPalette={() => setPaletteOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      {snakeOpen && (
        <Suspense fallback={null}>
          <SnakeGame onClose={() => setSnakeOpen(false)} />
        </Suspense>
      )}

      <main>
        <Hero />
        <About />
        <Suspense fallback={<div className="py-28 text-center font-mono text-sm text-gray-600">loading modules…</div>}>
          <Skills />
          <Projects />
          <Experience />
          <Architecture />
          <GitHubSection />
          <Contact />
        </Suspense>
      </main>

      <footer className="border-t border-white/5 py-8 text-center font-mono text-xs text-gray-600">
        <p>
          © {new Date().getFullYear()} {profile.fullName} — built with React, Tailwind & Framer Motion
        </p>
        <p className="mt-1 text-gray-700">deployed on GitHub Pages · 100% static · no trackers</p>
      </footer>
    </MotionConfig>
  )
}
