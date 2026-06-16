import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal, { SectionHeading } from './Reveal'
import { projects } from '../config'

// ── animated card previews ─────────────────────────────────────────

const API_LOG = [
  'POST /kyc/verify            → 200  11ms',
  'PUT  /sap/roles/sync        → 202  34ms',
  'POST /auth/token            → 200   8ms',
  'GET  /customers/8421        → 200   6ms',
]

function PreviewApiLog() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(v => v + 1), 1500)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="space-y-1">
      {[0, 1, 2].map(row => {
        const line = API_LOG[(i + row) % API_LOG.length]
        return (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: row === 2 ? 0.95 : 0.45, x: 0 }}
            className="truncate"
          >
            <span className="text-emerald-400">▸</span> {line}
          </motion.p>
        )
      })}
    </div>
  )
}

function PreviewSparkline({ accent }) {
  return (
    <svg viewBox="0 0 220 48" className="h-full w-full" preserveAspectRatio="none" aria-hidden="true">
      <motion.path
        d="M0 40 L25 34 L50 38 L75 22 L100 28 L125 12 L150 18 L175 8 L200 14 L220 4"
        fill="none"
        stroke={accent}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
      />
      <path
        d="M0 40 L25 34 L50 38 L75 22 L100 28 L125 12 L150 18 L175 8 L200 14 L220 4"
        fill="none" stroke={accent} strokeWidth="2" opacity="0.15"
      />
    </svg>
  )
}

function PreviewKeygen() {
  const [key, setKey] = useState('')
  useEffect(() => {
    const chars = 'ABCDEF0123456789'
    const t = setInterval(() => {
      setKey(Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
    }, 180)
    return () => clearInterval(t)
  }, [])
  return (
    <div>
      <p className="text-gray-500">$ ecdsa --generate p256</p>
      <p className="text-violet-300/90 tracking-wider truncate">{key || '…'}</p>
      <p className="text-emerald-400/80">✓ key sealed · payload encrypted</p>
    </div>
  )
}

function PreviewByteStream() {
  const bytes = '7E 01 A4 FF C3 19 00 5B 8D 42 E7 2C 90 1F 6A D8 33 4E '
  return (
    <div className="overflow-hidden">
      <p className="text-gray-500 mb-1">RX ← EGM · 9600 8N1</p>
      <div className="overflow-hidden">
        <span className="marquee-x text-cyan-300/80 tracking-[0.2em]">{bytes + bytes}</span>
      </div>
      <p className="text-emerald-400/80 mt-1">CRC OK · frame accepted</p>
    </div>
  )
}

const PREVIEWS = {
  cops360: PreviewApiLog,
  simulator: PreviewSparkline,
  license: PreviewKeygen,
  egm: PreviewByteStream,
}

const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

function TiltCard({ project, expanded, onToggle, index }) {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const Preview = PREVIEWS[project.id]

  const onMove = e => {
    if (isTouch) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: -py * 7, y: px * 9 })
  }

  return (
    <Reveal delay={index * 0.1} className="min-w-0">
      <motion.article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={isTouch ? undefined : {
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s ease-out',
        }}
        className="glass glass-hover h-full p-4 sm:p-6 relative overflow-hidden group"
      >
        {/* accent sweep */}
        <div
          className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl"
          style={{ background: project.accent + '22' }}
          aria-hidden="true"
        />

        <div className="flex items-start justify-between">
          <span className="text-3xl" aria-hidden="true">{project.icon}</span>
          <span
            className="font-mono text-[10px] px-2 py-1 rounded border"
            style={{ color: project.accent, borderColor: project.accent + '55' }}
          >
            featured
          </span>
        </div>

        <h3 className="mt-4 text-xl font-bold text-white break-words">{project.title}</h3>
        <p className="mt-2 text-sm text-gray-400 leading-relaxed break-words">{project.summary}</p>

        {Preview && (
          <div className="mt-4 h-16 rounded-lg border border-white/5 bg-black/40 px-3 py-2 font-mono text-[10px] leading-relaxed overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
            <Preview accent={project.accent} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map(t => (
            <span key={t} className="font-mono text-[10px] text-cyan-300/80 bg-cyan-400/8 border border-cyan-400/15 rounded-md px-2 py-1">
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={onToggle}
          className="mt-5 font-mono text-xs text-electric hover:text-cyan-300 transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? '− collapse' : '+ expand details'}
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden mt-2 space-y-2"
            >
              {project.details.map(d => (
                <li key={d} className="text-sm text-gray-400 flex gap-2">
                  <span className="text-cyan-400 shrink-0">▸</span>{d}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.article>
    </Reveal>
  )
}

export default function Projects() {
  const [expanded, setExpanded] = useState(null)
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-5 py-28 overflow-x-hidden">
      <SectionHeading kicker="ls ./projects --featured" title="Featured Projects" />
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => (
          <TiltCard
            key={p.id}
            project={p}
            index={i}
            expanded={expanded === p.id}
            onToggle={() => setExpanded(e => (e === p.id ? null : p.id))}
          />
        ))}
      </div>
    </section>
  )
}
