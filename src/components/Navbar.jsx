import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { sections, profile } from '../config'

export default function Navbar({ onOpenPalette }) {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // scroll-spy: query the DOM each scroll rather than observing once on
  // mount, since most sections are lazy-loaded and don't exist yet then
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const probe = window.innerHeight * 0.35
        let current = sections[0].id
        for (const s of sections) {
          const el = document.getElementById(s.id)
          if (el && el.getBoundingClientRect().top <= probe) current = s.id
        }
        setActive(current)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const jump = id => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass !rounded-none border-x-0 border-t-0' : ''
      }`}
    >
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-5 py-3.5">
        <button
          onClick={() => jump('home')}
          className="font-mono text-sm text-white font-bold tracking-tight"
          aria-label="Go to top"
        >
          <span className="text-electric">&gt;_</span> {profile.name.toLowerCase()}
          <span className="text-cyan-400">.dev</span>
        </button>

        <ul className="hidden md:flex items-center gap-1 text-sm">
          {sections.map(s => (
            <li key={s.id}>
              <button
                onClick={() => jump(s.id)}
                className={`relative px-3 py-1.5 rounded-lg transition-colors ${
                  active === s.id ? 'text-cyan-300' : 'text-gray-400 hover:text-white'
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-cyan-400/10 border border-cyan-400/20"
                    // radius via style so framer keeps corners round while the
                    // pill stretches between items during layout animation
                    style={{ borderRadius: 8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="hidden sm:flex items-center gap-2 font-mono text-xs text-gray-400 glass px-3 py-1.5 hover:text-cyan-300 transition-colors"
            aria-label="Open command palette"
          >
            <span>⌘</span> Ctrl+K
          </button>
          <button
            className="md:hidden text-gray-300 p-2"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <path d="M6 6l12 12M18 6L6 18" />
                : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul className="md:hidden glass !rounded-none border-x-0 px-5 pb-4 space-y-1">
          {sections.map(s => (
            <li key={s.id}>
              <button
                onClick={() => jump(s.id)}
                className="block w-full text-left px-3 py-3 min-h-[44px] rounded-lg text-gray-300 hover:bg-white/5 active:bg-white/10"
              >
                {s.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => { setOpen(false); onOpenPalette() }}
              className="block w-full text-left px-3 py-3 min-h-[44px] rounded-lg font-mono text-xs text-gray-500 hover:bg-white/5 active:bg-white/10"
            >
              ⌘ Command palette (Ctrl+K)
            </button>
          </li>
        </ul>
      )}
    </motion.header>
  )
}
