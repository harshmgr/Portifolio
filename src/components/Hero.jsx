import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { profile } from '../config'
import ParticleField from './ParticleField'

function RotatingSpecialty() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % profile.specialties.length), 2400)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-flex h-[1.35em] items-center overflow-hidden align-middle">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          className="inline-block gradient-text font-semibold"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {profile.specialties[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Counter({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 1400
    let raf
    const tick = now => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}{suffix}
    </span>
  )
}

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 grid-backdrop" aria-hidden="true" />
      <ParticleField />

      {/* floating geometry */}
      <div aria-hidden="true">
        <div className="float-slow absolute top-[18%] right-[12%] h-24 w-24 rounded-2xl border border-electric/30 bg-electric/5 backdrop-blur-sm rotate-12 hidden lg:block" />
        <div className="float-slower absolute bottom-[24%] right-[22%] h-14 w-14 rounded-full border border-cyan-400/30 bg-cyan-400/5 hidden lg:block" />
        <div className="float-slow absolute top-[30%] left-[8%] h-16 w-16 border border-violet/25 bg-violet/5 rotate-45 hidden lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 w-full pt-24">
        <motion.p
          className="font-mono text-sm text-cyan-400 mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {'> '}system.online — {profile.location}
        </motion.p>

        <motion.h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          Hi, I'm <span className="gradient-text glow-blue">{profile.name}</span>.
        </motion.h1>

        <motion.h2
          className="mt-4 flex flex-wrap items-center gap-x-3 text-xl sm:text-3xl lg:text-4xl font-bold text-gray-300"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <span>{profile.title} ·</span> <RotatingSpecialty />
        </motion.h2>

        <motion.p
          className="mt-6 max-w-xl text-gray-400 leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <a
            href="#projects"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.03] active:scale-95"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="glass glass-hover px-6 py-3 font-semibold text-cyan-300"
          >
            <span className="font-mono">&gt;_</span> Get in Touch
          </a>
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {profile.stats.map(s => (
            <div key={s.label} className="glass px-4 py-3">
              <p className="text-2xl font-bold text-white">
                <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 text-gray-600"
        style={{ x: '-50%' }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        aria-hidden="true"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.div>
    </section>
  )
}
