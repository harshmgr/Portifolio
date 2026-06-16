import { useState } from 'react'
import { motion } from 'framer-motion'
import Reveal, { SectionHeading } from './Reveal'
import { terminalCommands, profile } from '../config'

export default function Contact() {
  const [ran, setRan] = useState([])

  const run = c => {
    setRan(r => (r.includes(c.cmd) ? r : [...r, c.cmd]))
    setTimeout(() => {
      if (c.action === 'snake') window.dispatchEvent(new CustomEvent('open-snake'))
      else window.open(c.href(), '_blank', 'noopener')
    }, 450)
  }

  return (
    <section id="contact" className="relative mx-auto max-w-3xl px-5 py-28">
      <SectionHeading kicker="ssh harsh@collab" title="Open a Connection" />
      <Reveal>
        <div className="glass overflow-hidden !rounded-xl">
          {/* terminal title bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
            <p className="ml-3 font-mono text-[10px] sm:text-xs text-gray-500 truncate">harsh@portfolio: ~/contact</p>
          </div>

          <div className="p-4 sm:p-6 font-mono text-xs sm:text-sm space-y-4 sm:space-y-5">
            {terminalCommands.map(c => {
              const executed = ran.includes(c.cmd)
              return (
                <div key={c.cmd}>
                  <button
                    onClick={() => run(c)}
                    className="group flex items-center gap-2 text-left w-full"
                  >
                    <span className="text-cyan-400">&gt;</span>
                    <span className="text-gray-200 group-hover:text-cyan-300 transition-colors">
                      {c.cmd}
                    </span>
                    <span className="ml-auto text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      click to run ↵
                    </span>
                  </button>
                  {executed && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="ml-5 mt-1 text-emerald-400/90"
                    >
                      {c.out}
                    </motion.p>
                  )}
                </div>
              )
            })}
            <p className="pt-2 text-gray-600">
              <span className="text-cyan-400">&gt;</span> <span className="caret" />
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-8 text-center">
        <p className="text-gray-500 text-sm">
          Prefer plain email?{' '}
          <a href={`mailto:${profile.email}`} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
            {profile.email}
          </a>
        </p>
      </Reveal>
    </section>
  )
}
