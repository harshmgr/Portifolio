import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Reveal, { SectionHeading } from './Reveal'
import { experience } from '../config'

export default function Experience() {
  const railRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 0.75', 'end 0.55'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-5 py-28">
      <SectionHeading kicker="git log --career" title="Experience Timeline" />
      <div className="relative" ref={railRef}>
        {/* vertical rail: faint track + a bright line that draws itself on scroll */}
        <div className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px bg-white/8" aria-hidden="true" />
        <motion.div
          className="absolute left-[7px] sm:left-1/2 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-electric via-cyan-400 to-violet"
          style={{ scaleY }}
          aria-hidden="true"
        />

        <ol className="space-y-8 sm:space-y-14">
          {experience.map((e, i) => {
            const left = i % 2 === 0
            return (
              <li key={e.period} className="relative">
                {/* node dot — scale animates on an inner span so it doesn't
                    clobber the centering translate on the outer one */}
                <span
                  className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-1.5 block"
                  aria-hidden="true"
                >
                  <motion.span
                    className="block h-[15px] w-[15px] rounded-full bg-void border-2 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  />
                </span>
                <Reveal
                  y={20}
                  className={`ml-8 sm:ml-0 sm:w-[calc(50%-2.5rem)] ${left ? '' : 'sm:ml-auto'}`}
                >
                  <article className="glass glass-hover p-4 sm:p-6">
                    <p className="font-mono text-xs text-cyan-400">{e.period}</p>
                    <h3 className="mt-1 text-lg font-bold text-white">{e.role}</h3>
                    <p className="text-sm text-gray-500">{e.org}</p>
                    <ul className="mt-3 space-y-1.5">
                      {e.points.map(p => (
                        <li key={p} className="text-sm text-gray-400 flex gap-2">
                          <span className="text-electric shrink-0">›</span>{p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
