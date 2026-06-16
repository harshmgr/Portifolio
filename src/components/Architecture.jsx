import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal, { SectionHeading } from './Reveal'
import { architectures } from '../config'

const KIND_STYLE = {
  client:   { stroke: '#8b5cf6', fill: 'rgba(139,92,246,0.10)' },
  service:  { stroke: '#3b82f6', fill: 'rgba(59,130,246,0.10)' },
  db:       { stroke: '#10b981', fill: 'rgba(16,185,129,0.10)' },
  ai:       { stroke: '#f59e0b', fill: 'rgba(245,158,11,0.10)' },
  external: { stroke: '#06b6d4', fill: 'rgba(6,182,212,0.10)' },
}

const NODE_W = 140, NODE_H = 44

function Diagram({ arch }) {
  const byId = Object.fromEntries(arch.nodes.map(n => [n.id, n]))
  return (
    <svg viewBox="0 0 800 260" className="w-full h-auto" role="img" aria-label={`Architecture diagram: ${arch.title}`}>
      {arch.flows.map(([a, b], i) => {
        const A = byId[a], B = byId[b]
        const x1 = A.x + NODE_W / 2, y1 = A.y + NODE_H / 2
        const x2 = B.x + NODE_W / 2, y2 = B.y + NODE_H / 2
        return (
          <g key={`${a}-${b}-${i}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1e3a5f" strokeWidth="1.5" />
            <line className="flow-line" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="1.5" opacity="0.8" />
          </g>
        )
      })}
      {arch.nodes.map((n, i) => {
        const s = KIND_STYLE[n.kind]
        return (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <rect
              x={n.x} y={n.y} width={NODE_W} height={NODE_H} rx="10"
              fill={s.fill} stroke={s.stroke} strokeWidth="1.5"
            />
            <text
              x={n.x + NODE_W / 2} y={n.y + NODE_H / 2 + 4}
              textAnchor="middle" fill="#e5e7eb" fontSize="12"
              fontFamily="var(--font-mono)"
            >
              {n.label}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

export default function Architecture() {
  const keys = Object.keys(architectures)
  const [tab, setTab] = useState(keys[0])

  return (
    <section id="architecture" className="relative mx-auto max-w-6xl px-5 py-28">
      <SectionHeading kicker="draw --systems" title="Architecture Showcase" />
      <Reveal>
        <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Project architectures">
          {keys.map(k => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={`font-mono text-xs px-4 py-2 rounded-lg border transition-colors ${
                tab === k
                  ? 'border-cyan-400/60 text-cyan-300 bg-cyan-400/10'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              {architectures[k].title}
            </button>
          ))}
        </div>
        <p className="sm:hidden mb-3 text-center font-mono text-[10px] text-gray-600">← scroll to explore diagram →</p>
        <div className="glass p-4 sm:p-8 overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-w-[640px]"
            >
              <Diagram arch={architectures[tab]} />
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex flex-wrap gap-4 font-mono text-[10px] text-gray-500">
            {Object.entries(KIND_STYLE).map(([kind, s]) => (
              <span key={kind} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm border" style={{ borderColor: s.stroke, background: s.fill }} />
                {kind}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
