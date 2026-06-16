import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Reveal, { SectionHeading } from './Reveal'
import { skills, skillLinks } from '../config'

const W = 800, H = 480

export default function Skills() {
  const [hovered, setHovered] = useState(null)

  const neighbors = useMemo(() => {
    const map = Object.fromEntries(skills.map(s => [s.id, new Set([s.id])]))
    skillLinks.forEach(([a, b]) => { map[a].add(b); map[b].add(a) })
    return map
  }, [])

  const byId = useMemo(() => Object.fromEntries(skills.map(s => [s.id, s])), [])
  const active = hovered ? byId[hovered] : null
  const isDim = id => hovered && !neighbors[hovered].has(id)
  const linkActive = ([a, b]) => hovered && (a === hovered || b === hovered)

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-28">
      <SectionHeading kicker="tech --graph" title="Skill Constellation" />
      <Reveal>
        <div className="glass p-4 sm:p-8 relative">
          <div className="overflow-x-auto">
          <div className="min-w-[480px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto select-none"
            role="img"
            aria-label="Interactive network of technologies. Tap or hover a node to highlight related skills."
          >
            <defs>
              <radialGradient id="nodeGlow">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {skillLinks.map(([a, b]) => {
              const A = byId[a], B = byId[b]
              const on = linkActive([a, b])
              return (
                <line
                  key={`${a}-${b}`}
                  className="skill-link"
                  x1={A.x * W} y1={A.y * H}
                  x2={B.x * W} y2={B.y * H}
                  stroke={on ? '#22d3ee' : '#1e3a5f'}
                  strokeWidth={on ? 1.8 : 1}
                  opacity={hovered && !on ? 0.15 : 0.7}
                />
              )
            })}

            {/* energy pulses traveling along links */}
            {skillLinks.map(([a, b], i) => {
              const A = byId[a], B = byId[b]
              return (
                <motion.circle
                  key={`pulse-${a}-${b}`}
                  r="2.2"
                  fill="#22d3ee"
                  cx={A.x * W}
                  cy={A.y * H}
                  style={{ opacity: hovered && !linkActive([a, b]) ? 0.05 : 0.8 }}
                  animate={{
                    x: [0, (B.x - A.x) * W],
                    y: [0, (B.y - A.y) * H],
                  }}
                  transition={{
                    duration: 2.5 + (i % 5) * 0.8,
                    delay: (i % 7) * 0.7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )
            })}

            {skills.map(s => (
              <g
                key={s.id}
                className="skill-node"
                style={{ opacity: isDim(s.id) ? 0.18 : 1 }}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onTouchStart={() => setHovered(id => id === s.id ? null : s.id)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-label={`${s.label}, related projects: ${s.projects.join(', ')}`}
              >
                {hovered === s.id && (
                  <circle cx={s.x * W} cy={s.y * H} r={s.size * 2.2} fill="url(#nodeGlow)" />
                )}
                <circle
                  cx={s.x * W} cy={s.y * H} r={s.size / 2.4}
                  fill={hovered === s.id ? '#22d3ee' : '#0b1626'}
                  stroke={hovered === s.id ? '#67e8f9' : '#3b82f6'}
                  strokeWidth="1.5"
                />
                <text
                  x={s.x * W} y={s.y * H + s.size / 2.4 + 18}
                  textAnchor="middle"
                  fill={hovered === s.id ? '#a5f3fc' : '#9ca3af'}
                  fontSize="14"
                  fontFamily="var(--font-mono)"
                >
                  {s.label}
                </text>
              </g>
            ))}
          </svg>
          </div>
          </div>

          {/* detail readout — inline below SVG on mobile, absolute on sm+ */}
          <div className="mt-3 min-h-[3.5rem] sm:mt-0 sm:pointer-events-none sm:absolute sm:top-6 sm:right-6" aria-live="polite">
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass px-4 py-3 max-w-[230px]"
              >
                <p className="font-mono text-xs text-cyan-300 font-bold">{active.label}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  Used in: {active.projects.join(' · ')}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </Reveal>
      <p className="mt-4 text-center font-mono text-xs text-gray-600">
        tap or hover a node to trace its connections
      </p>
    </section>
  )
}
